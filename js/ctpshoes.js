var da = (function(da){

// CREATE ASSET shoes
da.ctp.shoes = {};
da.ctp.shoes.drawShortBoots = function(stroke, fill) {
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
		ctx.rect(ex.shoebox.x, ex.shoebox.y, ex.shoebox.width, ex.shoebox.height);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box

		var toetip = {x:ex.shoebox.x*0.7, y:ex.shoebox.y+ex.shoebox.height-10};
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
		var drawBoots = da.getFullDrawer(stroke, fill, 2, drawBase);
		drawBoots.call(this, ctx, ex, mods);

		// don't fill anything, "none" doesn't work so use alpha=0
		var drawBootDetails = da.getFullDrawer(stroke, fill, 2, drawDetails);
		drawBootDetails.call(this, ctx, ex, mods);

		drawSide.call(this, ctx, ex, mods);
	}
	return draw;
}

da.ctp.shoes.drawHeels = function(stroke, fill, drawDetails, drawSideDetails) {
	function drawBase(ctx, ex, mods) {
		var sp = da.splitCurve(ex.ankle.outbot, ex.toe.out, 0.5);
		var heelouttop = {x:sp.right.p1.x, y:sp.right.p1.y};
		heelouttop.cp1 = {x:heelouttop.x-2, y:heelouttop.y+4};
		var heelintop = {x:ex.toe.in.x + 1, y:ex.toe.in.y-2.5};

		heelintop.cp1 = ex.toe.in.cp1;

		var heeltip = {x:(heelouttop.x+heelintop.x)/2, y:(ex.toe.out.y+ex.toe.in.y)/2+17};
		var heelout = {x:ex.toe.out.x-1, y:ex.toe.out.y+5};
		var heelin = {x:heelintop.x, y:heelintop.y+8};

		heelin.cp1 = {x:heelin.x+1, y:heelin.y-3};
		heelout.cp1 = {x:heelout.x+1, y:(heeltip.y+heelout.y)/2};
		heeltip.cp1 = {x:heelin.x-1, y:(heeltip.y+heelin.y)/2};

		da.drawPoints(ctx, heelouttop, heelintop, heelin, heeltip, heelout, heelouttop);

		// ctx.lineJoin = "miter";
	}

	function drawSide(ctx, ex, mods) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(ex.shoebox.x, ex.shoebox.y, ex.shoebox.width, ex.shoebox.height);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box


		var toetip = {x:ex.shoebox.x*0.7, y:ex.shoebox.y+ex.shoebox.height-15};
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
		var drawHeelsBase = da.getFullDrawer("rgba(0,0,0,0)", fill, 2, drawBase);
		drawHeelsBase.call(this, ctx, ex, mods);

		// draw side view (challenging to scale with heel height correctly!)
		drawSide.call(this, ctx, ex, mods);
	}
	return draw;
}

// heel decorators
da.ctp.shoes.details = {};
da.ctp.shoes.sideDetails = {};
da.ctp.shoes.details.drawHeelStrap = function(stroke, fill) {
	function draw(ctx, ex, mods) {
		ctx.moveTo(ex.ankle.out.x, ex.ankle.out.y);
		ctx.quadraticCurveTo(ex.ankle.out.x+5,ex.ankle.out.y+5,
			ex.ankle.intop.x, ex.ankle.intop.y);	
	}
	return da.getFullDrawer(stroke, fill, 2, draw);
}

// heel detail decorators (window on the left)
da.ctp.shoes.sideDetails.drawHeelStrapDetails = function(stroke) {
	function draw(ctx, ex, mods) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(ex.shoebox.x, ex.shoebox.y, ex.shoebox.width, ex.shoebox.height);
		// ctx.stroke();
		ctx.clip();	// don't draw shoes outside of this box


		var toetip = {x:ex.shoebox.x*0.7, y:ex.shoebox.y+ex.shoebox.height-15};
		var archtip = {x:toetip.x+65-ex.shoeheight*4, y:toetip.y-ex.shoeheight*5};
		var heelback = {x:archtip.x+10, y:archtip.y};
		var countertip = {x:archtip.x+4, y:heelback.y-19};
		
		ctx.beginPath();
		ctx.ellipse(countertip.x-10, countertip.y-1, 10, 3.5, 0.95*Math.PI, 0, 2*Math.PI, true);
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.restore();
	}
	return draw;
}


return da;
}(da || {}));