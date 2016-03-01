var da = (function(da){

// CREATE TEMPLATE drawing of types of clothing and accessories
// all clothing templates will go inside ctp (clothing templates)
da.ctp.top = {};
da.ctp.top.drawTankTop = function(stroke, fill) {
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
		

		ctx.bezierCurveTo(ex.hip.cp1.x, ex.hip.cp1.y,
			ex.hip.cp2.x, ex.hip.cp2.y,
		 ex.hip.x,
		 ex.hip.y - 4);

		var hipmod = (this.hips > 0)? this.hips*0.1 : 20;
		var hipshirtmod = (this.hips < 0)? -this.hips*0.7 : (this.hips > 20)? this.hips*0.05 : 0;

		var shirtbot = {x:79, y:171-this.hips*0.1 + hipshirtmod};
		var diff = {x:ex.hip.x - shirtbot.x, y:ex.hip.y - shirtbot.y};

		ctx.bezierCurveTo(ex.hip.x+10, (ex.hip.y-3.5 +shirtbot.y)/2 - diff.y*0.5,
			60, shirtbot.y,
			shirtbot.x, shirtbot.y);
		return;

	}

	return da.getFullDrawer(stroke, fill, 2, drawHalf);
}
da.ctp.top.drawTurtleNeck = function(stroke, fill) {
	function drawHalf(ctx, ex, mods) {

		if (ex.deltoids) {
			da.drawPoints(ctx, ex.neck.nape, ex.neck.top, ex.trapezius.top,
			    ex.collarbone, ex.collarbone.top, ex.deltoids, ex.shoulder,
				ex.elbow.out, ex.wrist.out);
			da.averageQuadratic(ctx, ex.wrist.out, ex.wrist.in);
			da.drawPoints(ctx, null, ex.ulna, ex.elbow.in, ex.armpit,
				ex.trapezius.bot, ex.waist, ex.hip, ex.pelvis);
			// da.drawPoints(ctx, ex.armpit, );
		}
		else {
			ctx.moveTo(ex.neck.nape.x, ex.neck.cusp.y-10);
			ctx.bezierCurveTo(ex.neck.nape.x-5, ex.neck.cusp.y-10,
				ex.neck.cusp.x-10, ex.neck.top.y+5, ex.neck.cusp.x, ex.neck.cusp.y);
			da.drawPoints(ctx, null, ex.collarbone, ex.shoulder,
				ex.elbow.out, ex.wrist.out);
			da.averageQuadratic(ctx, ex.wrist.out, ex.wrist.in);
			da.drawPoints(ctx, null, ex.ulna, ex.elbow.in, ex.armpit, ex.waist, ex.hip, ex.pelvis);
		}
	}
	return da.getFullDrawer(stroke, fill, 2, drawHalf);
}
da.ctp.top.drawShirtBreasts = function(stroke, fill) {
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
			if (ex.breast.bot.y > ex.hip.y - 17.6) {
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
	return da.getFullDrawer(stroke, fill, 2, drawBreasts);
}
da.ctp.top.drawLongSleeveBreasts = function(stroke, fill) {
	function drawBreasts(ctx, ex, mods) {
		// breasts will stretch shirt
		ctx.moveTo(ex.collarbone.x-1, ex.collarbone.y+1);
		if (ex.breast && ex.breast.tip && ex.breast.tip.x < ex.armpit.x) {

			da.drawPoints(ctx, ex.breast.top, ex.breast.bot); 
			
			var lastLoc = ex.breast.bot;
			// if breasts are past hip...
			if (ex.breast.bot.y > ex.hip.y - 17.6) {
				da.drawPoints(ctx, null, ex.cleavage.bot);
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

			// double coverage
			da.averageQuadratic(ctx, {x:79,y:lastLoc}, ex.breast.top, 0.5, 5, -5);
			da.averageQuadratic(ctx, ex.breast.top, da.adjustPoint(ex.breast.bot,0,-1), 0.5, -5, 0);

			// suppress stroke afterwards
			ctx.strokeStyle = "rgba(0,0,0,0)";
		}
		else if (ex.breast) {
			// just cover breasts
			da.drawPoints(ctx, da.adjustPoint(ex.breast.top,-1,-1), da.adjustPoint(ex.breast.bot,-2,2), da.adjustPoint(ex.cleavage.bot,0,2));
			da.averageQuadratic(ctx, ex.cleavage.bot, da.adjustPoint(ex.breast.top,-1,-1), 0.5, 10, -4);
			ctx.strokeStyle = "rgba(0,0,0,0)";
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
	return da.getFullDrawer(stroke, fill, 2, drawBreasts);
}

return da;
}(da || {}));