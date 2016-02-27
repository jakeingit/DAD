"use strict";

var da = (function(da){

// ---- generic clothing object (one size fits all...) ----
var Clothing = da.Clothing = function(data) {
	Object.assign(this, {
		name 	: "",
		price 	: 0,
		blunt 	: 0,				// bonus to con checks and other things
		loc 	: "top",			// where the clothing can be worn
		layer 	: 0,				// lower layer goes under higher layer (can be negative)
		longdesc: "placeholder",	// long description of item
		slutdesc: "",				// long description of how you modified the item if you're an exhibitionist
		// bonus modifiers to appearance score (individually defined)
		cursed 	: false,
		traits 	: [],	// special characteristics of clothing
	}, data);
};

// utility and higher level functions
function drawFull(ctx, ex, mods, drawHalf) {
	// left half
	ctx.beginPath();
	drawHalf.call(this,ctx,ex,mods);
	ctx.fill();
	ctx.stroke();

	da.reflectHorizontal(ctx);

	ctx.beginPath();
	drawHalf.call(this,ctx,ex,mods);
	ctx.fill();
	ctx.stroke();
}
var getFullDrawer = da.getFullDrawer = function(stroke, fill, lineWidth, drawHalf) {
	// everything needs a stroke, fill, and lineWidth, as well the half drawing method
	// returns a full draw method (draws both left and right)
	function draw(ctx, ex, mods) {
		ctx.save();

		ctx.lineWidth = lineWidth;
		if (typeof stroke === "function")
			ctx.strokeStyle = stroke(ctx);
		else
			ctx.strokeStyle = stroke;
		if (typeof fill === "function")
			ctx.fillStyle = fill(ctx);
		else 
			ctx.fillStyle = fill;

		ctx.save();	// drawHalf might change style in itself
		ctx.beginPath();
		drawHalf.call(this,ctx,ex,mods);
		ctx.fill("nonzero");
		ctx.stroke();


		ctx.restore();
		ctx.beginPath();
		da.reflectHorizontal(ctx);
		drawHalf.call(this,ctx,ex,mods);
		ctx.fill("nonzero");
		ctx.stroke();

		// reset to original scale
		ctx.restore();
	}
	return draw;
}
var getPattern = da.getPattern = function(patternName) {
	function get(ctx) {
		if (clothesPatterns.hasOwnProperty(patternName)) {
			return clothesPatterns[patternName];
		}
		// if it doesn't exist try to create it
		else if (producePattern.hasOwnProperty(patternName)) {
			var pat = producePattern[patternName](ctx);
			clothesPatterns[patternName] = pat;
			return pat;
		}
		else {
			console.log("No pattern creation method for", patternName);
		}
	}
	return get;
}

// CREATE TEMPLATE drawing of types of clothing and accessories
var drawTankTop = da.drawTankTop = function(stroke, fill) {
	function drawHalf(ctx, ex, mods) {
		// set up parameters
		var shoulders = this.shoulders;
		var hips = this.hips;
		var ass = this.ass;
		var waist = this.waist;
		var legs = this.legs;
		var legl = mods.legl
		
		var a = shoulders - 11;
		if (shoulders > 20) a = 9;
		a = a * 0.9;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var f = a * 2;
		var g = 0;
		if ((hips * 3) + (ass * 1.5) > 40) g = ((((hips * 3) + (ass * 1.5)) - 40) / 5);
		if (7 - legs > 0) g += (7 - legs);
		g *= a / 9;
		if (g > 13.5) g = 13.5;
		g += ((20 - waist) / 10) * (a / 9);
		var x = a;
		var y = x / 2;
		var m = 0;
		if (shoulders > 10) m = (shoulders - 10) / 20;

		// start from chest
		ctx.moveTo(79, 92);
		ctx.quadraticCurveTo(60,92, ex.collarbone.x+2, ex.collarbone.y-1);
		ctx.lineTo(ex.collarbone.x-1, ex.collarbone.y+1);
		// up to middle of shoulder, about collar bone distance

		// draw base
		ctx.quadraticCurveTo(ex.collarbone.x+1,ex.collarbone.y+10, 
			ex.armpit.x, ex.armpit.y);

		// if trapezius is strong enough (masculine)
		if (ex.trapezius) {
			ctx.lineTo(ex.trapezius.bot.x, ex.trapezius.bot.y);
		}

		ctx.quadraticCurveTo(ex.waist.cp1.x, ex.waist.cp1.y,
		 ex.waist.x, ex.waist.y);
		// down to narrowest part of waist
		

		ctx.bezierCurveTo(ex.hipbone.cp1.x, ex.hipbone.cp1.y,
			ex.hipbone.cp2.x, ex.hipbone.cp2.y,
		 ex.hipbone.x,
		 ex.hipbone.y - 4);

		var hipmod = (this.hips > 0)? this.hips*0.1 : 20;
		var hipshirtmod = (this.hips < 0)? -this.hips*0.7 : (this.hips > 20)? this.hips*0.05 : 0;

		var shirtbot = {x:79, y:171-this.hips*0.1 + hipshirtmod};
		var diff = {x:ex.hipbone.x - shirtbot.x, y:ex.hipbone.y - shirtbot.y};

		ctx.bezierCurveTo(ex.hipbone.x+10, (ex.hipbone.y-3.5 +shirtbot.y)/2 - diff.y*0.5,
			60, shirtbot.y,
			shirtbot.x, shirtbot.y);
		return;

	}

	return getFullDrawer(stroke, fill, 2, drawHalf);
}
var drawShirtBreasts = da.drawShirtBreasts = function(stroke, fill) {
	function drawBreasts(ctx, ex, mods) {
		// breasts will stretch shirt
		ctx.moveTo(ex.collarbone.x-1, ex.collarbone.y+1);
		if (ex.breast && ex.breast.tip && ex.breast.tip.x < ex.armpit.x) {
			// ctx.lineTo(ex.breast.tip.x-5, ex.breast.tip.y);
			ctx.bezierCurveTo(ex.collarbone.x-2, ex.collarbone.y+30,
				ex.breast.tip.x-2, ex.breast.tip.y-26,
				ex.breast.tip.x, ex.breast.tip.y);

			ctx.bezierCurveTo(ex.breast.tip.cp1.x, ex.breast.tip.cp1.y,
				ex.breast.tip.cp2.x, ex.breast.tip.cp2.y,
				ex.breast.bot.x, ex.breast.bot.y);
			
			var lastLoc = ex.breast.bot;
			// if breasts are past hip...
			if (ex.breast.bot.y > ex.hipbone.y - 17.6) {
				ctx.bezierCurveTo(ex.cleavage.bot.cp1.x, ex.cleavage.bot.cp1.y,
					ex.cleavage.bot.cp2.x, ex.cleavage.bot.cp2.y,
					ex.cleavage.bot.x, ex.cleavage.bot.y);
				lastLoc = ex.cleavage.bot;
			}
			// not past hip but past waist
			else if (ex.breast.bot.y > ex.waist.y) {
				var sp = da.splitBezier({p1:ex.breast.bot, p2:ex.cleavage.bot,
					cp1:ex.cleavage.bot.cp1, cp2:ex.cleavage.bot.cp2}, 0.6);

				ctx.bezierCurveTo(sp.left.cp1.x, sp.left.cp1.y,
					sp.left.cp2.x, sp.left.cp2.y,
					sp.left.p2.x, sp.left.p2.y);
				lastLoc = sp.left.p2;
			}
			ctx.fill();
			ctx.stroke();

			// begin a new path so there are no new stroke
			ctx.beginPath();
			ctx.moveTo(lastLoc.x, lastLoc.y);
			ctx.quadraticCurveTo((lastLoc.x+79)/2, lastLoc.y+10,
				79, lastLoc.y);
			if (ex.cleavage.top) {
				lastLoc = ex.cleavage.top.y;
			}
			else {
				lastLoc = ex.cleavage.bot.y-20;
			}
			ctx.lineTo(79, lastLoc);

			ctx.bezierCurveTo(75,lastLoc,
				ex.collarbone.x-1, ex.collarbone.y+1+10,
				ex.collarbone.x-1, ex.collarbone.y+1);

			// suppress stroke afterwards
			ctx.strokeStyle = "rgba(0,0,0,0)";
		}
		else if (ex.breast) {
			// just cover breasts
			ctx.moveTo(ex.breast.top.x, ex.breast.top.y);
			ctx.bezierCurveTo(ex.breast.bot.cp1.x, ex.breast.bot.cp1.y,
				ex.breast.bot.cp2.x, ex.breast.bot.cp2.y, 
				ex.breast.bot.x, ex.breast.bot.y);
			ctx.bezierCurveTo(ex.cleavage.bot.cp1.x, ex.cleavage.bot.cp1.y,
				ex.cleavage.bot.cp2.x, ex.cleavage.bot.cp2.y,
				ex.cleavage.bot.x, ex.cleavage.bot.y);
			ctx.quadraticCurveTo((ex.cleavage.bot.x+ex.breast.top.x)/2+5, (ex.cleavage.bot.y+ex.breast.top.y)/2-5,
			 	ex.breast.top.x, ex.breast.top.y);
			ctx.strokeStyle = fill;
		}
		else {
			// BUG? can't do nonzero filling, always goes even-odd over areola
			// cover areola
			ctx.moveTo(ex.areola.x, ex.areola.y);
			ctx.arc(ex.areola.x, ex.areola.y, ex.areola.r+1, 0, 2*Math.PI, false);
			ctx.fill();

			ctx.strokeStyle = "rgba(0,0,0,0)";
		}	

	}		
	return getFullDrawer(stroke, fill, 2, drawBreasts);
}

// CREATE ASSET bot
var drawTightPants = da.drawTightPants = function(stroke, fill) {
	// for midrift to ankle coverage with any kind of fill (can be a function that returns gradient or pattern)
	function drawHalf(ctx, ex, mods) {
		// set up parameters
		var shoulders = this.shoulders;
		var hips = this.hips;
		var ass = this.ass;
		var waist = this.waist;
		var legs = this.legs;
		var legl = mods.legl
		var a = shoulders - 11;
		if (shoulders > 20) a = 9;
		a = a * 0.9;
		var e = a / 10;
		var f = a * 2;
		var b = (hips + ass) * 3;
		if (ass > 20) b += (ass - 20) * 8;
		var c = waist / 3;
		if (c < -5) c = -5;
		var d = hips / 2;
		if (hips > 20) d = 10;
		var f = 0;
		var x = a;
		var y = x / 2;
		var g = 0;
		var z = 0;

		var lowerhipx = 52 + (c / 2) - ((a / 2) + (b/20) + (f / 2))*1.15;
		var lowerhipy = 175 - ((y / 22) + d) - legl;
		ctx.moveTo(79,180-legl);
		ctx.quadraticCurveTo(60,180-legl,
			ex.hipbone.x,
		 	ex.hipbone.y);
		// from center of waist to side

		if (a >= 11) {	// update for feminine shoulders
			a = shoulders - 11;
			if (shoulders > 20) a = 9;
			a = a * 0.9;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = a * 2;
			g = 0;
			if ((hips * 3) + (ass * 1.5) > 40) g = ((((hips * 3) + (ass * 1.5)) - 40) / 5);
			if (7 - legs > 0) g += (7 - legs);
			g *= a / 9;
			if (g > 13.5) g = 13.5;
			g += ((20 - waist) / 10) * (a / 9);			
		}
		/*Outer Leg*/
		if (legs < 11) {
			ctx.quadraticCurveTo(ex.kneepit.cp1.x, ex.kneepit.cp1.y, ex.kneepit.x, ex.kneepit.y);
			ctx.quadraticCurveTo(ex.calf.out.cp1.x, ex.calf.out.cp1.y, ex.calf.out.x, ex.calf.out.y);
			ctx.quadraticCurveTo(ex.ankle.outtop.cp1.x, ex.ankle.outtop.cp1.y, ex.ankle.outtop.x, ex.ankle.outtop.y);

			ctx.quadraticCurveTo(ex.ankle.out.cp1.x, ex.ankle.out.cp1.y, ex.ankle.out.x, ex.ankle.out.y);

			ctx.quadraticCurveTo(ex.ankle.outbot.cp1.x, ex.ankle.outbot.cp1.y, ex.ankle.outbot.x, ex.ankle.outbot.y);


			ctx.quadraticCurveTo(ex.toe.out.cp1.x, ex.toe.out.cp1.y, ex.toe.out.x, ex.toe.out.y);

			ctx.quadraticCurveTo(29 + legs/3, 389 - legs/3, 29 + legs*0.4, 390 - legs/3);


			ctx.quadraticCurveTo(ex.toe.in.cp1.x, ex.toe.in.cp1.y, ex.toe.in.x, ex.toe.in.y);
 
			ctx.quadraticCurveTo(ex.ankle.in.cp1.x, ex.ankle.in.cp1.y, ex.ankle.in.x, ex.ankle.in.y);
			/*Inner-Leg*/

			ctx.quadraticCurveTo(ex.ankle.intop.cp1.x, ex.ankle.intop.cp1.y, ex.ankle.intop.x, ex.ankle.intop.y);

			ctx.lineTo(ex.calf.in.x, ex.calf.in.y);

			ctx.bezierCurveTo(ex.kneecap.cp1.x, ex.kneecap.cp1.y, ex.kneecap.cp2.x, ex.kneecap.cp2.y, ex.kneecap.x, ex.kneecap.y);

			ctx.quadraticCurveTo(65 - legs/5, 260 + legs/5, 70 - legs*0.7, 250 + legs);

			ctx.quadraticCurveTo(ex.groin.cp1.x, ex.groin.cp1.y, ex.groin.x, ex.groin.y);

			ctx.quadraticCurveTo(79, 208 - legs/5, 79, 205 - legs/5 -legl*1.1);
		} else {
			if (legs <= 20) a = legs - 11;
			else a = 9;
			a = a * 0.8;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = hips / 5.5;
			g = f * (a / 9);
			z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}
			ctx.quadraticCurveTo(43.3 - (c + d + (f * 4.5) + z), 202 + z - ((f * 2) + (ass / 10)), ex.kneepit.x, ex.kneepit.y);
			ctx.quadraticCurveTo(36 + (a + a + c + d) - (b + f), 304 - (a + f), ex.calf.out.x, ex.calf.out.y);
			// ankle
			ctx.quadraticCurveTo(37 + e + (a + b + b + d + b), 338, ex.ankle.outtop.x, ex.ankle.outtop.y);
			ctx.quadraticCurveTo(38 + (a + b + b + d + b), 357, ex.ankle.out.x, ex.ankle.out.y-3);
			ctx.quadraticCurveTo(44 + (a + b + b + d + b),367, 
				ex.ankle.intop.x, ex.ankle.intop.y-3);
			ctx.lineTo(50 + b + (a + b + c + b), 353 - a);
			/*Inner-Leg*/
			// inner shin to knee cap
			ctx.bezierCurveTo(64 + a + b + e + b + b, 297 - a, 56 + a + b + e + b, 286, 63 + a + b + e + b, 265 -legl*0.6);
			ctx.quadraticCurveTo(63 + a + b + e + b, 262, 63 + a + b + e + b, 261 -legl*0.6);
			// up to corner of inner thigh
			ctx.quadraticCurveTo(71 + a + b + (z / 3), 233 + (z / 3) - b, 75 + d, 203 -legl*1.1);
			ctx.quadraticCurveTo(79, 204-legl*1.1, 79, 203 -legl*1.1);
		}		
	}
	return getFullDrawer(stroke, fill, 2, drawHalf);
}

var drawPencilSkirt = da.drawPencilSkirt = function(stroke, fill) {
	function drawHalf(ctx, ex, mods) {
		// these skirts are relatively high waisted
		ctx.moveTo(ex.botbellybutton.x, ex.botbellybutton.y-2);
		var sp = da.splitBezier({p1:ex.waist, p2:ex.hipbone,
			cp1:ex.hipbone.cp1, cp2:ex.hipbone.cp2},0.5);

		ctx.bezierCurveTo(79-4,ex.botbellybutton.y-2,
			sp.right.p1.x+3, (sp.right.p1.y+ex.botbellybutton.y)/2,
			sp.right.p1.x, sp.right.p1.y);

		ctx.bezierCurveTo(sp.right.cp1.x, sp.right.cp1.y,
			sp.right.cp2.x, sp.right.cp2.y,
			sp.right.p2.x, sp.right.p2.y);

		// goes down to cover the knee
		ctx.quadraticCurveTo(ex.kneepit.cp1.x, ex.kneepit.cp1.y,
			ex.kneepit.x, ex.kneepit.y);
		// close up to the middle
		ctx.bezierCurveTo(ex.kneepit.x+5,ex.kneepit.y+4,
			79-3, ex.kneepit.y+4,
			79, ex.kneepit.y+4);

	}
	return getFullDrawer(stroke, fill, 2, drawHalf);
}



// CREATE ASSET shoes
function drawShortBoots(stroke, fill) {
	function drawBase(ctx, ex, mods) {
		// set up parameters
		var shoulders = this.shoulders;
		var hips = this.hips;
		var ass = this.ass;
		var waist = this.waist;
		var legs = this.legs;
		var legl = mods.legl
		var a = shoulders - 11;
		if (shoulders > 20) a = 9;
		a = a * 0.9;
		var e = a / 10;
		var f = a * 2;
		var b = (hips + ass) * 3;
		if (ass > 20) b += (ass - 20) * 8;
		var c = waist / 3;
		if (c < -5) c = -5;
		var d = hips / 2;
		if (hips > 20) d = 10;
		var f = 0;
		var x = a;
		var y = x / 2;
		var g = 0;
		var z = 0;
		// from center of waist to side

		if (a >= 11) {	// update for feminine shoulders
			a = shoulders - 11;
			if (shoulders > 20) a = 9;
			a = a * 0.9;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = a * 2;
			g = 0;
			if ((hips * 3) + (ass * 1.5) > 40) g = ((((hips * 3) + (ass * 1.5)) - 40) / 5);
			if (7 - legs > 0) g += (7 - legs);
			g *= a / 9;
			if (g > 13.5) g = 13.5;
			g += ((20 - waist) / 10) * (a / 9);			
		}
		/*Outer Leg*/
		if (legs < 11) {	// masculine foot		
			var anklex = ex.ankle.outtop.x-2;
			var ankley = ex.ankle.outtop.y;
			ctx.moveTo(anklex, ankley);
			ctx.lineTo(ex.ankle.outbot.x-3, ex.ankle.outbot.y);
			ctx.quadraticCurveTo(ex.toe.out.x-4, ex.toe.out.y-3, ex.toe.out.x-2, ex.toe.out.y+1.5);
			ctx.quadraticCurveTo(ex.toe.in.cp1.x, ex.toe.in.cp1.y, ex.toe.in.x, ex.toe.in.y);
			ctx.lineTo(ex.ankle.intop.x+2, ex.ankle.intop.y-3);
			ctx.quadraticCurveTo((ex.ankle.intop.x+2+anklex)/2, ankley-3, anklex, ankley);
		} else {
			if (legs <= 20) a = legs - 11;
			else a = 9;
			a = a * 0.8;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = hips / 5.5;
			g = f * (a / 9);
			z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}

			var anklex = ex.ankle.outtop.x + 1;
			var ankley = ex.ankle.outtop.y;

			ctx.moveTo(anklex, ankley);
			ctx.quadraticCurveTo(38 + (a + b + b + d + b), 357, 39 + (a + b + b + d + b), 364);
			ctx.quadraticCurveTo(38 + (a + b + b + d + b), 365, 39 + (a + b + b + d + b), 367);
			/*Foot*/
			ctx.quadraticCurveTo(31 + (a + a + b + d + b), 372, 30 + (a + a + b + d + b), 384);
			ctx.quadraticCurveTo(40 + (a + a + b + d + b), 391, 53 + (a + a + b + d + b), 386);
			ctx.quadraticCurveTo(55 + (a + a + b + d + b), 377, 49 + (a + a + b + d + b), 368);
			// inner ankle
			ctx.quadraticCurveTo(50+(a+a+b+b+c), 364, 50 + b + (a + b + c + b), 355 - a);

			ctx.quadraticCurveTo(anklex+5, ankley-3, anklex, ankley);
			// top of ankle
			return;
		}		
	}
	function drawDetails(ctx, ex, mods) {
		ctx.lineWidth = 3;


		ctx.moveTo(ex.toe.out.x-0.5, ex.toe.out.y+0.7);
		// frontage of shoes
		ctx.bezierCurveTo(ex.toe.out.x, ex.toe.out.y - 25, 
			ex.toe.in.x, ex.toe.in.y - 25,
			ex.toe.in.x, ex.toe.in.y);

		// shoe laces
		for (var i=0; i<3; ++i) {
			ctx.moveTo(ex.ankle.out.x, ex.ankle.out.y-i*6);
			ctx.quadraticCurveTo((ex.ankle.out.x+ex.ankle.in.x)/2, ex.ankle.out.y-i*6-2,
				ex.ankle.in.x, ex.ankle.in.y-i*6);
		}		
	}	
	function drawSide(ctx, ex, mods) {
		// for shoes, best to have an x offset of around 70
		ctx.save();

		ctx.beginPath();
		ctx.rect(-ex.ox, -ex.oy+300, ex.ox+20, ex.oy+90);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box

		var toetip = {x:-ex.ox+5, y:382};
		var archtip = {x:toetip.x+54, y:toetip.y-1};
		var heeltip = {x:archtip.x, y:archtip.y+3};
		var heelback = {x:heeltip.x+20, y:heeltip.y-2};

		// top of shoe
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(toetip.x, toetip.y);

		var tongue = {x:archtip.x-7, y:archtip.y-50};
		ctx.bezierCurveTo(toetip.x-5, toetip.y-30,
			tongue.x-10, tongue.y+50,
			tongue.x, tongue.y);

		var countertip = {x:heelback.x-3, y:tongue.y+4};
		ctx.bezierCurveTo(tongue.x+10, tongue.y,
			countertip.x-10, countertip.y,
			countertip.x, countertip.y);

		// back down to heel
		ctx.bezierCurveTo(countertip.x, countertip.y+20,
			heelback.x+3, heelback.y-20,
			heelback.x, heelback.y);

		// enclose shoes by going back to toetip (first go to archtip)
		ctx.quadraticCurveTo(heelback.x, heeltip.y, archtip.x, archtip.y);
		ctx.bezierCurveTo(archtip.x-20, archtip.y-2,
			toetip.x+30, toetip.y+10, 
			toetip.x, toetip.y);		

		ctx.strokeStyle = stroke;
		ctx.fillStyle = fill;
		ctx.fill();
		ctx.stroke();


		// drawing the heels
		ctx.lineWidth = 3;
		ctx.strokeStyle = stroke;
		ctx.fillStyle = stroke;	// heel filling as if stroked

		ctx.beginPath();
		ctx.moveTo(toetip.x, toetip.y);

		ctx.bezierCurveTo(toetip.x+30, toetip.y+10, 
			archtip.x-20, archtip.y-2,
			archtip.x, archtip.y);
		// from toe to top of arch
		ctx.stroke();

		ctx.beginPath();
		ctx.lineTo(heeltip.x+1.5, heeltip.y);
		// go down from arch to tip of heel

		ctx.quadraticCurveTo(heelback.x, heeltip.y, heelback.x, heelback.y);
		ctx.lineTo(heelback.x, heelback.y-4);
		// close the heel
		ctx.quadraticCurveTo(heelback.x-8, heelback.y,
			archtip.x, archtip.y);
		ctx.stroke();
		ctx.fill();


		// laces along the front from tongue to toe tip
		ctx.beginPath();
		ctx.lineCap = "round";
		for (var t = 0.7; t < 0.90; t+=0.07) {
			var sp = da.splitBezier({p1:toetip, p2:tongue,
				cp1:{x:toetip.x-5, y:toetip.y-30},
				cp2:{x:tongue.x-10, y:tongue.y+50}}, t);
			ctx.moveTo(sp.right.p1.x-2, sp.right.p1.y);
			ctx.quadraticCurveTo(sp.right.p1.x+4, sp.right.p1.y-1,
				sp.right.p1.x+7, sp.right.p1.y+2);
		}
		ctx.stroke();
		// stiching details
		ctx.beginPath();
		var sp = da.splitBezier({p1:tongue, p2:countertip,
			cp1:{x:tongue.x+10, y:tongue.y},
			cp2:{x:countertip.x-10, y:countertip.y}}, 0.3);
		ctx.moveTo(sp.right.p1.x, sp.right.p1.y);
		ctx.quadraticCurveTo(tongue.x+10, tongue.y+20,
			tongue.x-10, toetip.y-20);


		ctx.lineWidth = 1;
		ctx.setLineDash([2,4]);
		ctx.stroke();

		ctx.restore();
	}
	function draw(ctx, ex, mods) {
		// draw both boots in addition to side view
		var drawBoots = getFullDrawer(stroke, fill, 2, drawBase);
		drawBoots.call(this, ctx, ex, mods);

		// don't fill anything, "none" doesn't work so use alpha=0
		var drawBootDetails = getFullDrawer(stroke, fill, 2, drawDetails);
		drawBootDetails.call(this, ctx, ex, mods);

		drawSide.call(this, ctx, ex, mods);
	}
	return draw;
}

var drawHeels = da.drawHeels = function(stroke, fill, drawDetails, drawSideDetails) {
	function drawBase(ctx, ex, mods) {
		ctx.moveTo(ex.toe.out.x-1, ex.toe.out.y-4);
		ctx.quadraticCurveTo((ex.toe.out.x+ex.toe.in.x)/2, ex.toe.out.y+15,
			ex.toe.in.x-0.5, ex.toe.in.y-2.5);

		var heeltip = {x:(ex.toe.out.x+ex.toe.in.x)/2, y:(ex.toe.out.y+ex.toe.in.y)/2+15};
		var heelout = {x:ex.toe.out.x-1, y:ex.toe.out.y+5};
		var heelin = {x:ex.toe.in.x+0.2, y:ex.toe.in.y+4};


		ctx.lineTo(heelin.x, heelin.y);
		ctx.quadraticCurveTo(heelin.x-1, (heeltip.y+heelin.y)/2, heeltip.x, heeltip.y);
		ctx.quadraticCurveTo(heelout.x+1, (heeltip.y+heelout.y)/2, heelout.x, heelout.y);
		ctx.lineTo(ex.toe.out.x-1, ex.toe.out.y-4);
		ctx.lineJoin = "miter";
	}
	function drawEdge(ctx, ex, mods) {
		// along the edge of the foot
		ctx.moveTo(ex.ankle.outbot.x-0.5, ex.ankle.outbot.y);
		ctx.quadraticCurveTo(ex.toe.out.x-4, ex.toe.out.y-3,
			ex.toe.out.x+2, ex.toe.out.y+4);
		ctx.quadraticCurveTo(ex.toe.out.x-1, ex.toe.out.y-3,
			ex.ankle.outbot.x-0.5, ex.ankle.outbot.y);

		ctx.moveTo(ex.toe.in.x+0.1, ex.toe.in.y-1);
		ctx.quadraticCurveTo(ex.toe.in.x+1, (ex.ankle.in.y+ex.toe.in.y-4)/2, 
			ex.ankle.in.x, ex.ankle.in.y);
	}
	function drawSide(ctx, ex, mods) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(-ex.ox, -ex.oy+300, ex.ox+20, ex.oy+90);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box


		var toetip = {x:-ex.ox+15, y:377};
		ctx.beginPath();
		ctx.moveTo(toetip.x, toetip.y);

		var solebot = {x:toetip.x+13, y:toetip.y+9};
		ctx.bezierCurveTo(toetip.x-3, toetip.y+3,
			solebot.x-8, solebot.y+1,
			solebot.x, solebot.y);

		var archtip = {x:toetip.x+65-ex.shoeheight*4, y:toetip.y-ex.shoeheight*5};
		ctx.bezierCurveTo(solebot.x+20, solebot.y,
			archtip.x-20, archtip.y+10,
			archtip.x, archtip.y);

		var heeltip = {x:archtip.x+5, y:solebot.y};
		ctx.quadraticCurveTo(heeltip.x, archtip.y,
			heeltip.x, heeltip.y);

		ctx.lineTo(heeltip.x+2, heeltip.y);

		var heelback = {x:archtip.x+10, y:archtip.y};
		ctx.bezierCurveTo(heeltip.x+2, heeltip.y-10,
			heelback.x-1, heelback.y,
			heelback.x, heelback.y);

		var countertip = {x:archtip.x+4, y:heelback.y-19};
		ctx.bezierCurveTo(heelback.x+3, heelback.y-10,
			countertip.x+3, countertip.y+5,
			countertip.x, countertip.y);


		var vamp = {x:toetip.x+10, y:toetip.y-5};
		ctx.bezierCurveTo(countertip.x-19, countertip.y+5,
			vamp.x+18, vamp.y+10,
			vamp.x, vamp.y);

		ctx.lineTo(toetip.x, toetip.y);

		ctx.lineWidth = 2;
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}
	function draw(ctx, ex, mods) {
		// always draw base heels
		var drawHeelsBase = getFullDrawer(stroke, fill, 2, drawBase);
		drawHeelsBase.call(this, ctx, ex, mods);
		var drawHeelsEdge = getFullDrawer("rgba(0,0,0,0)", fill, 3, drawEdge);
		drawHeelsEdge.call(this, ctx, ex, mods);

		// draw side view (challenging to scale with heel height correctly!)
		drawSide.call(this, ctx, ex, mods);

		// sometimes want extra addornments on heels
		if (drawDetails) {
			var drawDetailsFull = getFullDrawer(stroke, fill, 2, drawDetails);
			drawDetailsFull.call(this, ctx, ex, mods);
		}
		if (drawSideDetails) {
			drawSideDetails.call(this, ctx, ex, mods);
		}
	}
	return draw;
}
// heel decorators
var drawHeelStrap = da.drawHeelStrap = function(stroke) {
	function draw(ctx, ex, mods) {
		ctx.strokeStyle = stroke;
		ctx.fillStyle = "rgba(0,0,0,0)";	// can still override choices inside here	
		ctx.moveTo(ex.ankle.out.x, ex.ankle.out.y);
		ctx.quadraticCurveTo(ex.ankle.out.x+5,ex.ankle.out.y+5,
			ex.ankle.intop.x, ex.ankle.intop.y);	
	}
	return draw;
}
// heel detail decorators (window on the left)
var drawHeelStrapDetails = da.drawHeelStrapDetails = function(stroke) {
	function draw(ctx, ex, mods) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(-ex.ox, -ex.oy+300, ex.ox+20, ex.oy+90);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box


		var toetip = {x:-ex.ox+15, y:377};
		var archtip = {x:toetip.x+65-ex.shoeheight*4, y:toetip.y-ex.shoeheight*5};
		var heelback = {x:archtip.x+10, y:archtip.y};
		var countertip = {x:archtip.x+4, y:heelback.y-19};
		
		ctx.beginPath();
		ctx.ellipse(countertip.x-10, countertip.y-1, 10, 3.5, 0.95*Math.PI, 0, 2*Math.PI, true);
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 3;
		ctx.stroke();
	}
	return draw;
}


// CREATE ASSET acc
var drawThighSocks = da.drawThighSocks = function(stroke, pattern) {
	function drawHalf(ctx, ex, mods) {
		// set up parameters
		var shoulders = this.shoulders;
		var hips = this.hips;
		var ass = this.ass;
		var waist = this.waist;
		var legs = this.legs;
		var legl = mods.legl
		var a = shoulders - 11;
		if (shoulders > 20) a = 9;
		a = a * 0.9;
		var e = a / 10;
		var f = a * 2;
		var b = (hips + ass) * 3;
		if (ass > 20) b += (ass - 20) * 8;
		var c = waist / 3;
		if (c < -5) c = -5;
		var d = hips / 2;
		if (hips > 20) d = 10;
		var f = 0;
		var x = a;
		var y = x / 2;
		var g = 0;
		var z = 0;


		if (a >= 11) {	// update for feminine shoulders
			a = shoulders - 11;
			if (shoulders > 20) a = 9;
			a = a * 0.9;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = a * 2;
			g = 0;
			if ((hips * 3) + (ass * 1.5) > 40) g = ((((hips * 3) + (ass * 1.5)) - 40) / 5);
			if (7 - legs > 0) g += (7 - legs);
			g *= a / 9;
			if (g > 13.5) g = 13.5;
			g += ((20 - waist) / 10) * (a / 9);
		}
		/*Outer Leg*/
		if (legs < 11) {

		
			var sp = da.splitQuadratic({p1:ex.hipbone,
				cp1:ex.kneepit.cp1,
				p2:ex.kneepit}, 0.55);

			// ctx.quadraticCurveTo(sp.left.cp1.x, sp.left.cp1.y, sp.left.p2.x, sp.left.p2.y);
			var midthighx = sp.left.p2.x;
			var midthighy = sp.left.p2.y;
			ctx.moveTo(midthighx, midthighy);
			ctx.quadraticCurveTo(sp.right.cp1.x, sp.right.cp1.y, ex.kneepit.x, ex.kneepit.y);
			ctx.quadraticCurveTo(ex.calf.out.cp1.x, ex.calf.out.cp1.y, ex.calf.out.x, ex.calf.out.y);
			ctx.quadraticCurveTo(ex.ankle.outtop.cp1.x, ex.ankle.outtop.cp1.y, ex.ankle.outtop.x, ex.ankle.outtop.y);
			ctx.quadraticCurveTo(ex.ankle.out.cp1.x, ex.ankle.out.cp1.y, ex.ankle.out.x, ex.ankle.out.y);
			ctx.quadraticCurveTo(ex.ankle.outbot.cp1.x, ex.ankle.outbot.cp1.y, ex.ankle.outbot.x, ex.ankle.outbot.y);
			ctx.quadraticCurveTo(ex.toe.out.cp1.x, ex.toe.out.cp1.y, ex.toe.out.x, ex.toe.out.y);
			ctx.quadraticCurveTo(29 + legs/3, 389 - legs/3, 29 + legs*0.4, 390 - legs/3);
			ctx.quadraticCurveTo(ex.toe.in.cp1.x, ex.toe.in.cp1.y, ex.toe.in.x, ex.toe.in.y);
			ctx.quadraticCurveTo(ex.ankle.in.cp1.x, ex.ankle.in.cp1.y, ex.ankle.in.x, ex.ankle.in.y);
			ctx.quadraticCurveTo(ex.ankle.intop.cp1.x, ex.ankle.intop.cp1.y, ex.ankle.intop.x, ex.ankle.intop.y);
			ctx.lineTo(ex.calf.in.x, ex.calf.in.y);
			ctx.bezierCurveTo(ex.kneecap.cp1.x, ex.kneecap.cp1.y, ex.kneecap.cp2.x, ex.kneecap.cp2.y, ex.kneecap.x, ex.kneecap.y);
			ctx.quadraticCurveTo(65 - legs/5, 260 + legs/5, 70 - legs*0.7, 250 + legs);

			ctx.quadraticCurveTo(midthighx+15+f, midthighy-6-f, midthighx, midthighy);

		} else {
			if (legs <= 20) a = legs - 11;
			else a = 9;
			a = a * 0.8;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			f = hips / 5.5;
			g = f * (a / 9);
			z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}


			// we want to start somewhere along the outer thigh rather than the lowerhip point
			var sp = da.splitQuadratic({p1:ex.hipbone,
							cp1:ex.kneepit.cp1,
							p2:ex.kneepit}, 0.55);

			// ctx.quadraticCurveTo(sp.left.cp1.x, sp.left.cp1.y, sp.left.p2.x, sp.left.p2.y);
			var midthighx = sp.left.p2.x;
			var midthighy = sp.left.p2.y;
			ctx.moveTo(midthighx, midthighy);
			ctx.quadraticCurveTo(sp.right.cp1.x, sp.right.cp1.y, ex.kneepit.x, ex.kneepit.y);

			// from hip down to back of knee
			ctx.quadraticCurveTo(ex.calf.out.cp1.x, ex.calf.out.cp1.y, ex.calf.out.x, ex.calf.out.y);
			// ankle
			ctx.quadraticCurveTo(37 + e + (a + b + b + d + b), 338, ex.ankle.outtop.x, ex.ankle.outtop.y);
			ctx.quadraticCurveTo(38 + (a + b + b + d + b), 357, ex.ankle.out.x, ex.ankle.out.y);

			/*Foot*/
			if (ex.shoeheight < 3) {	// not wearing heels
				ctx.quadraticCurveTo(38 + (a + b + b + d + b), 365, 39 + (a + b + b + d + b), 367);
				ctx.quadraticCurveTo(36 + (a + a + b + d + b), 372, ex.toe.out.x, ex.toe.out.y);
				// down to outer toes
				ctx.quadraticCurveTo(32 + (a + a + b + d + b), 386, 33 + (a + a + b + d + b), 387);
				ctx.quadraticCurveTo(40 + (a + a + b + d + b), 391, ex.toe.in.x, ex.toe.in.y);
				// to inner toes
				ctx.quadraticCurveTo(54 + (a + a + b + d + b), 384, 52 + (a + a + b + d + b), 381);

				ctx.quadraticCurveTo(49 + (a + a + b + d + b), 377, ex.ankle.in.x, ex.ankle.in.y);
				// inner ankle
				ctx.quadraticCurveTo(50 + (a + a + b + b + c), 364, ex.ankle.intop.x, ex.ankle.intop.y);
				ctx.lineTo(50 + b + (a + b + c + b), 353 - a);
			}
			else {
				// ankle bone
				ctx.quadraticCurveTo(ex.ankle.outbot.x-1, ex.ankle.outbot.y-1.5,
					ex.ankle.outbot.x, ex.ankle.outbot.y);

				var legaddition = legs;
				if (legaddition > 30) legaddition = 30;
				// higher heels will cause foot to appear narrower
				ctx.lineTo(ex.toe.out.x, ex.toe.out.y);

				ctx.bezierCurveTo(ex.toe.out.x+3, ex.toe.out.y+15,
					ex.toe.in.x-3, ex.toe.in.y+15,
					ex.toe.in.x, ex.toe.in.y);

				ctx.lineTo(ex.ankle.in.x, ex.ankle.in.y);

				ctx.quadraticCurveTo(ex.ankle.in.x+2, ex.ankle.in.y-2,
					ex.ankle.intop.x, ex.ankle.intop.y);
			}


			/*Inner-Leg*/
			// inner shin to knee cap
			ctx.bezierCurveTo(64 + a + b + e + b + b, 297 - a, 56 + a + b + e + b, 286, ex.kneecap.x, ex.kneecap.y);
			ctx.quadraticCurveTo(63 + a + b + e + b, 262, ex.topkneecap.x, ex.topkneecap.y);
			// up to corner of inner thigh
			sp = da.splitQuadratic({p1:ex.topkneecap,
								cp1:{x:71 + a + b + (z / 3), y:233 + (z / 3) - b},
								p2:ex.groin}, 0.7);

			ctx.quadraticCurveTo(sp.left.cp1.x, sp.left.cp1.y, sp.left.p2.x, sp.left.p2.y);
			// control point go up with higher hips to better reflect contour
			ctx.quadraticCurveTo(midthighx+15+f, midthighy-6-f, midthighx, midthighy);
			// finish up by crossing over the thigh
		}		
	}

	return getFullDrawer(stroke, pattern, 2, drawHalf);

}

var drawMakeup = da.drawMakeup = function(lipcolor, nailcolor) {
	function drawLipStick(ctx, ex, mods) {
		/*Lips*/
		var lips = this.lips;
		var lipt = mods.lipt;
		var lipc = mods.lipc;
		var a = lips / 2.4;
		if (a < 0.6) a = 0.6;
		var d = a / 5;
		var e = a / 10;
	
		// left corner of mouth
		ctx.moveTo(ex.centermouth.x, ex.centermouth.y);

		ctx.quadraticCurveTo(77 + e, ex.centermouth.y - (e * 1.2) -lipt*0.1 -lipc*0.2, ex.leftmouth.x, ex.leftmouth.y);
		// center to left
		ctx.quadraticCurveTo(79, ex.centermouth.y + 1.1 + d +lipt*0.1 -lipc*0.1, ex.rightmouth.x, ex.rightmouth.y);
		// left to right
		ctx.quadraticCurveTo(81 - e, ex.centermouth.y - (e * 1.2) -lipt*0.1 -lipc*0.2, ex.centermouth.x, ex.centermouth.y);
		ctx.lineWidth = 2.3 + (lips / 40);
	}
	function drawNailPolish(ctx, ex, mods) {
		var hips = this.hips;
		var ass = this.ass;
		var waist = this.waist;
		var legs = this.legs;
		var shoulders = this.shoulders;
		var a = shoulders;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var f = a * 2;
		var g = 0;
		var x = 0;
		var y = 0;
		var z = 0;		
		if (a < 11) {
			// TODO for masculine hands...
		}
		else {
			ctx.ellipse(ex.hand.tip.x+2,ex.hand.tip.y-5.5, 4,1, 3/5*Math.PI,  0,2*Math.PI);

			var sp = da.splitQuadratic({p1:ex.thumb.in, p2:ex.thumb.out,
				cp1:ex.thumb.out.cp1}, 0.78);

			ctx.moveTo(ex.thumb.in.x, ex.thumb.in.y);
			ctx.quadraticCurveTo((ex.thumb.in.x+sp.right.p1.x)/2, (ex.thumb.in.y+sp.right.p1.y)/2-0.5, 
				sp.right.p1.x, sp.right.p1.y);
			ctx.quadraticCurveTo(ex.thumb.in.x+4, ex.thumb.in.y+3, ex.thumb.in.x, ex.thumb.in.y);
		}
	}
	function draw(ctx, ex, mods) {
		ctx.save();
		// lips
		ctx.strokeStyle = lipcolor;
		ctx.beginPath();
		drawLipStick.call(this, ctx, ex, mods);
		ctx.stroke();

		ctx.restore();
		ctx.save();
		// nails
		ctx.strokeStyle = nailcolor;
		ctx.fillStyle = nailcolor;
		ctx.beginPath();
		drawNailPolish.call(this, ctx, ex, mods);
		ctx.stroke();
		ctx.fill();

		da.reflectHorizontal(ctx);
		ctx.beginPath();
		drawNailPolish.call(this, ctx, ex, mods);
		ctx.stroke();
		ctx.fill();

		ctx.restore();
	}
	return draw;
}


// cached images 
var clothesPatterns = da.clothesPatterns = {};

// CREATE ASSET how to produce each pattern, each function takes in only ctx
var producePattern = da.producePattern = {
	// each function produces and returns either a color, CanvasGradient, or CanvasPattern
	"sheer cross": function(ctx) {
		var img = new Image();
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBBQ0MwREMzRDY2QTExRTVBNTU1Q0M0N0I5NTVENzQ3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBBQ0MwREM0RDY2QTExRTVBNTU1Q0M0N0I5NTVENzQ3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEFDQzBEQzFENjZBMTFFNUE1NTVDQzQ3Qjk1NUQ3NDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEFDQzBEQzJENjZBMTFFNUE1NTVDQzQ3Qjk1NUQ3NDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6IWo2oAAAAKElEQVQY02NgYGDYRCQmU+H////BmI4KYQrQMfkKB9AzQ0khHkycQgBSwM7hMJs4pQAAAABJRU5ErkJggg==';
		var pat = ctx.createPattern(img, 'repeat');
		return pat;
	},
	"washed jeans": function(ctx) {
		var grd = ctx.createLinearGradient(0,200,400,200);
		grd.addColorStop(0,"rgba(0,68,110,0.9)");
		grd.addColorStop(0.2,"rgba(0,110,160,0.9)");
		grd.addColorStop(0.5,"rgba(0,75,140,0.7)");
		grd.addColorStop(0.8,"rgba(0,110,160,0.9)");
		grd.addColorStop(1,"rgba(0,68,110,0.9)");
		return grd;		
	},
	"plaid": function(ctx) {
		var img = new Image();
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAIAAACgvKk3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDkzRjg1M0ZEODRCMTFFNUFFNkFCMDhDREVBRTZDQzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDkzRjg1M0VEODRCMTFFNUFFNkFCMDhDREVBRTZDQzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJDNDkwMzc4MTEzN0MwMTE5NEI0QTk3MzcwMDQzN0MyMyIgc3RSZWY6ZG9jdW1lbnRJRD0iQzQ5MDM3ODExMzdDMDExOTRCNEE5NzM3MDA0MzdDMjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5OMVcdAAAFyklEQVR42hyVWW8cxxHHq4+5dnY5s9SKpIilRFGRbCFIYuR4MpCXvOUlCGLkI+YD5CnPsYEchm0pia1IIaOQliheu9zduXr6qEoNBxgMpqe75t/Vv/qX+GL2GO6usTdvkvkfLH48O3l8+NGLf1frdvN7Kbs23H/28HJTTS6Wr7L4c9v/dH9+uBs+f33xAB/9xl9ZNEEo2TVif18SESISEIBQIJXip1aInjCA4OEgPNJwgeBZ6PiWkiRaoB4Ff+JbI0iUQKSHr0JIngwYBM8ZAiNQJMQQGbwEVHKIq4BXhGiIiw5R8W8FByNeDqwnTnHT6DHHhGE0BZcSpCAytKnDkfCdcBkOgjIMIwiJ6DIa5YBp6EcUeMKYbOFYbkAIQaDsjf5T+kSAYAlZZD9Ej/4h6FZ3y+zZN0l7467nIA34Ijm6jVdpMv1vmr4wpo/3L1P3Uo/fy8P7ugjYO8lagyah/+YvIpAcLob+Suh/rvwyXq391df1bVctvxwltrd5m6y61ci0r1H9r6rXhXrf0FfriwImoG9CaBxGnBfJ2//lI0N+SG4i7Vlkzmfh2T13cNCJvq/q8Iu4D12/fdRdrkM+be6rWNTwyZF/NOukcWVYfkpL6x2C4DRyArXI58KhVjoBF+ndhFOQUjI+mJSFFXUkNclGjR+lVAu7lSZRmdnxdJ5v9ZNJMokPc5zk3qLisxWKUL94czGcBEAWzGUcvq3hujhdufy7k/pmvZ5r5ds6M1BXdXKzOYnjl8Y2N+58D//+3YdtEWfiGn3rOZSA6A6xwIh5UinTxyAwJMKHwGh6ROcIO8BESGS8fHAxf3coAkbSkeBt9tobDEwuKhEJqT/jSCQCwAjFiVMbTU9j9bGUe0Q3SvyWeJmekbwCKIH+RbKU+udxPCdfSLov4dcOZFBOkAvEGOqqbYCpA+bUttTZzlrdrKuqqzamrZzUvne3TbWuN5HpHCvuu27dWt37pnLUeFtrsIxyFPgkQE+fPx2YBpEzk/HujpOzKdx78qwcbWhzW4BqOrPz9MivNsntTZGOJp0t5/PZjs3kKAuPJzgNoUemXQsuLr2x/MsQgAzaJoTKuHXmut75qu+7sIgEq0udqYNRvWmF7HnYtrUHxoulGsm7dfymZaSl1Nnbcz8UMo6CTdMoNjZp3kk50WerpFplQgVrmfl0U+fXG50oriToya8s/eeSSAb8gN6wLD7Ihr3gOk24hj1gG+TlKFmotMyzMk0u8mwNbkPQa0n5aOMBJn0Vxxutqq2x2bbVuElg3PqxpFQKjd4GCvqP0CuKDFEsHG/2LwZPvH+C8I3xxvqtRFuGHLFCN/XuWMo3li6MeejFX12YSVuLIAeHs72ETEV6PinZvfzgEPpGj0vC+db0oCwuC79WsBdJizLPJssgyjbUaXIau53x9l7uHozygso90aNrPQ24sqHpHx1N2YM4d7l0H+Tk2KnDafXk4diFuGq2noM3vn1weG9RZ3pHZ3Fsjf3hwb35zHXWT6n8MQMXcs/lT6gYvXfvXnOFMSup6N8nzWkdYPV9LOn0ZLNoq49iEWxndLXgo1is3+n4uOkyfw1ddHb2fSvXC3UduH5UjOC5HPRX1wcxSQs4wnaRHZyuWbpvR7uvznVnkm9j3fd2Kz9aLtflavlWRTeteaX3WhG9OodtOMx1jqFjbYwau4r+LMtVQCeJjfciSqgc7Zf54Va6O91qOvU7oStpiyxbTKjs/Jss/XNqPimmhwWNt8uZL37FlUzJXc8YuoL+WXc8NBXimjXH5F4aeNq8/QHD56qlXf/Ey8rURdsv+qYwtxpGZ9Y8ts1zG676y20Pn/r3QK0Dzb2Je4a+BW4yUihuJ9Bg1im/gfgWkx6cBbtkiqM01qNKcPPTvYgscE0lLYYVsEWKtYhQJERK3qmTXK1isNLB8oaGxl7AYxHfFMhL4h4puTNqkBHxb9m3OUkMFj8lAiI3Ghi2ercS/i/AAB8X8HtbiP2cAAAAAElFTkSuQmCC';
		var pat = ctx.createPattern(img, 'repeat');
		return pat;
	},
	"blue_plaid": function(ctx) {
		var img = new Image();
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGRTFFQzBEQzQ5NTFFMjExODA2NUM5NzE1QzkxNTk2MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNkRFMTcxREQ4NEQxMUU1OTBEMTg0REEwMEJBRkI1RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNkRFMTcxQ0Q4NEQxMUU1OTBEMTg0REEwMEJBRkI1RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MDQyMEVFRjc1MUUyMTE4NkYyQkUyOTcxMURENzJGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZFMUVDMERDNDk1MUUyMTE4MDY1Qzk3MTVDOTE1OTYxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+CVfvyQAABMdJREFUeNo8VmtvHEUQ7Hnsve98fsQhAScSApGI//8v+MAHhARIYGERKzHB8fl89t7uzlBVM+c459tHT3d1dXW3XfP1d5u8by2efWPN+YXllAy/zIXG3GRm+6vfrL+5srA8tub19+ZnC8tDb/lpZ84Hc+OJtX/9Yunhi1kcW0z3t5b7vQ0hWt4/4rozS4OZ9+bHcxvuPll+3Fo/4LnzeB4sdy2CZtx6BI42bD4jwEMB4UfTTc6DuWaCaFNz+OH/POBZZJDW0uM9ngWh46GMDPQPSF0cWWp3ZgTinEU3mgiRny7ML9ZC6GJTDsBz2m3MdXtz07mF+doMiIiKaSOsAtjtR8u+oI80pPewPLFw8lVxQyPyCNTdzd8I2APdkcXzN0rV07EloffkGc4T6GIgTwN+Mg5lcgdUuuYz8EZ+hQb8uWYsbvN+pzO81lleo5j8jlZvdABVMpIP/rKIzCVzfgFx7p5KYXQ7CBF5k1MEdiFUhN4VJ4xMI3BhNACXQkXULRXQi++EqrN45JvXjK1A+MQSLhdHfMP06JCBwZE4ZWrNCGCckJE30YBz6WkrGbnRWPcsV4GMStKZhM0cMw4P+4KMBMBRrsEoKRZFyPQL9n05G5lGUf4Wap+g/EjmwJ3EDt5QwcRKTuYlNeoPcpMeGRtgZMeUS4WG5zTFJYkm0oqKNsJRhSzN9S3uUy1IV+wDhB2Wa3HVQGPNxQ+1/Xo596h69+nSumvwtjq18dsf1d/sYwJw4JVVbn//ST54H/1kaRkC9osjiPtUAqV03GiqtEh6j04IsxUGyGs4PrO0+Q9oghD78cz61SU66k6yi3qBm9x1OHgtTqgnRgxwMGxvlQ77lcXor/8USuvw7OHODMiH7Zeiw/YJZ1enmwxjj9bzs6Ucq7/Z0xgWw92NDlIW4ejFc2uqIKw6OB0+f3gWejxokE4I2fkoYwbQ4KFzjCZMJQvr82dtsvJucSzOGdg40ujQz1cqO/lrLt5Bd+iCMCoTBwYd5QHjcPJKA9ZyrSwrTjXApk0/1ywACg435I3jK4Dw3HOCLMQZJzJbixxxNvK9qwFUMLwL8yMo4Qrp7ykLBBlPNxpJrCrJph6pSw4LIKDjtLsXh366KhwCPYtwGB6UUWJRKGzNPpKLIUAElIkLU2mRTlzifgFaTGyS7tgtnPCQC4tJm4EFJAXwEUU0SI8vsKRefVsF2oATTGpor/8IYZOG6dJGb97X6VOmC1eDRwAuMva8gZZIZ+Qt4bv/90OZb0wDzxxSldbYq6NeEtIigtPEocEBrLG2F1obGosULrkauBfQ4IpEHrkCSDx2Cg8zTIdi+KYMBY60BO6oXW7OhOHLlRG5b2Fl8fhcu5kcsjOoLaZDVO3lr8aeD+uX1rx8K0fqpjpAun/+UEeRV09u+NDVKjOKR0eQfC4mrU9VP9Yl5tAxZ+oQjXwgZPtKJRQ2NcW9TD6srlB3WFD8cCLj21PoHP+gxXE+crWKb6eg0qaKwnKTM+4IGEi4JDn1pSu06ULdJ0n7hxOJdJS1YQVMXQ9Rc42OaiGG7UYSUU/3XfkLgo77p7oZm7JKuaDYQUiVe1vv8OPLUrdSYaZBx4dFpaXVFXR1+ROJNl6dLp7DgynzHTL4X4ABAODRJLz4TnlIAAAAAElFTkSuQmCC';
		var pat = ctx.createPattern(img, 'repeat');
		return pat;
	},
};
var preloadPattern = da.preloadPattern = function(imgObj) {
	// preload image into producePattern lookup table as producePattern[imgObj.name]
	// can then be used wherever a stroke or fill is needed
	function cachePattern() {
		// call back after image loaded
		producePattern[imgObj.name] = function(ctx) {
			var pat = ctx.createPattern(img, imgObj.reptition);	// "repeat", "repeat-x", "repeat-y", "no-repeat"
			return pat;
		}
	}

	var img = new Image();

	// should always include a format, but will default to png
	var format = imgObj.hasOwnProperty("format")? imgObj.format : 'png';
	
	// can optionally have many different methods of creating the pattern
	if (imgObj.hasOwnProperty("dataurl")) {	// create from data url (base64 encoded image)
		img.src = 'data:image/'+format+';base64,'+imgObj.dataurl;
		cachePattern();
	}
	else if (imgObj.hasOwnProperty("url")) {	// load from external url
		img.src = imgObj.url;
		img.onload = cachePattern;
	}
	else if (imgObj.hasOwnProperty("path")) {	// path to local image
		img.src = imgObj.path;
		img.onload = cachePattern;
	}
	else {
		console.log("ERROR don't know how to print", imgObj);
	}

}




// exhaustic map of all the CLOTHING inside the game
var clothes = da.clothes = {
	// tops
	"test_top" :
	new Clothing({
		name: 	"test top", 
		price: 	1, 
		blunt: 	0, 
		loc: 	"top",
		layer: 	2,
		longdesc:"extremely abstract clothing. Can you see it? Is that a bug?",
	}),
	
	"grey_tank" :
	new Clothing({
		name: 	"grey tank top",
		price: 	25,
		blunt: 	0,
		loc: 	"top",
		layer: 	2,
		longdesc:"ordinary grey tank top, fitted just right.",
		drawunderbreasts: 	drawTankTop("rgb(200,190,200)","rgba(230,230,210,0.92)"),
		drawunderhair: drawShirtBreasts("rgb(200,190,200)","rgba(230,230,210,0.92)"),
	}),
	"white_tank" :
	new Clothing({
		name: 	"white tank top",
		price: 	25,
		blunt: 	0,
		loc: 	"top",
		layer: 	2,
		longdesc:"ordinary white tank top, fitted just right.",
		drawunderbreasts: 	drawTankTop("rgb(200,190,200)","rgb(240,250,250)"),
		drawunderhair: drawShirtBreasts("rgb(200,190,200)","rgb(240,250,250)"),
	}),
	"checkered_tank" :
	new Clothing({
		name: 	"checkered tank top",
		price: 	25,
		blunt: 	0,
		loc: 	"top",
		layer: 	2,
		longdesc:"chess master.",
		drawunderbreasts: 	drawTankTop("rgb(200,190,200)", getPattern("checkered")),
		drawunderhair: drawShirtBreasts("rgb(200,190,200)",getPattern("checkered")),
	}),


	
	// bottoms
	"test_bot" :
	new Clothing({
		name: 	"test bot", 
		price: 	1, 
		blunt: 	0, 
		loc: 	"bot",
		layer: 	2,
		longdesc:"clothing purely for testing; extremely abstract and defies comprehension"
	}),

	"levi_511" :
	new Clothing({
		name: 	"slim fit jeans",
		price: 	80,
		blunt: 	0,
		loc: 	"bot",
		layer: 	2,
		longdesc:"quality denim of the ass hugging type.",
		drawunderbreasts: 	drawTightPants("rgb(0, 68, 102)", getPattern("washed jeans")),
	}),

	"plaid_pencil_skirt" :
	new Clothing({
		name: 	"plaid pencil skirt",
		price: 	100,
		blunt: 	0,
		loc: 	"bot",
		layer: 	3,
		longdesc:"TODO",
		drawunderbreasts: drawPencilSkirt("rgb(100,30,40)", getPattern("plaid")),
		legs: 	2,
	}),

	"blue_plaid_pencil_skirt" :
	new Clothing({
		name: 	"plaid pencil skirt",
		price: 	100,
		blunt: 	0,
		loc: 	"bot",
		layer: 	3,
		longdesc:"TODO",
		drawunderbreasts: drawPencilSkirt("rgb(60,100,140)", getPattern("blue_plaid")),
		legs: 	2,
	}),
	
	
	// shoes
	"leather_boots" :
	new Clothing({
		name: 	"leather boots", 
		price: 	20, 
		blunt: 	0, 
		loc: 	"shoes",
		layer: 	3,
		height: 1,
		longdesc:"well kept leather boots. Useful for kicking ass and accidentally stepping on manure.",
		drawafterall: drawShortBoots("black", "brown"),
	}),



	"classic_black_pumps" :
	new Clothing({
		name: 	"classic black pumps",
		price: 	500,
		blunt: 	0,
		loc: 	"shoes",
		layer: 	3,
		height: 4,
		longdesc: "TODO",
		drawafterall: drawHeels("black", "black", drawHeelStrap("black"), drawHeelStrapDetails("black")),
	}),
	

	// accessories (for them, the longdesc is how they will be printed)
	"black_paint" :
	new Clothing({
		name: 	"magical black paint for lips and nails",
		price: 	2000,
		loc: 	"acc",
		layer: 	-1,
		lips: 	1,
		cursed: true,
		longdesc:["Your lips and nails are glossily painted a shade darker than night.",
		"Try as you might, not the slightest bit of it washes off.",
		"They are sensual while not being slutty, and gives you an exotic aura."].join(" "),
		drawafterall: drawMakeup("rgb(40,20,45)", "rgb(40,20,45)"),
	}),

	"cross_hold_ups":
	new Clothing({
		name: 	"hold ups with crosses",
		price: 	500,
		loc: 	"acc",
		layer:  -1,
		legs: 	1,
		longdesc:["TODO"].join(" "),
		drawundergenitals: drawThighSocks("rgb(200,100,100)", getPattern("sheer cross")),
	}),

	"solid_black_hold_ups":
	new Clothing({
		name: "solid black hold ups",
		price: 	500,
		loc: 	"acc",
		layer:  -1,
		legs: 	1,
		longdesc:["TODO"].join(" "),
		drawundergenitals: drawThighSocks("black", "rgb(30,30,30)"),
	}),
};

return da;
}(da || {}));