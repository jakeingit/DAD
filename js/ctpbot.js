var da = (function(da){

// CREATE ASSET bot
da.ctp.bot = {};
da.ctp.bot.drawTightPants = function(stroke, fill) {
	// for midrift to ankle coverage with any kind of fill (can be a function that returns gradient or pattern)
	function drawHalf(ctx, ex, mods) {
		ctx.moveTo(ex.pelvis.x, ex.pelvis.y);
		ctx.quadraticCurveTo(ex.pelvis.cp3.x, ex.pelvis.cp3.y, ex.hip.x, ex.hip.y);
		// from center of waist to side

		da.drawPoints(ctx, null, ex.thigh.out, ex.kneepit, ex.calf.out, ex.ankle.outtop, da.adjustPoint(ex.ankle.out,0,-3));
		// bottom of the pants
		ctx.quadraticCurveTo(ex.ankle.intop.x*0.5+ex.ankle.out.x*0.5, ex.ankle.out.y+2,
				ex.ankle.intop.x+0.5, ex.ankle.intop.y-3);

		da.drawPoints(ctx, null, ex.calf.in, ex.kneecap, ex.kneecap.top, ex.thigh.in, ex.groin, ex.groin.in);
	}
	return da.getFullDrawer(stroke, fill, 2, drawHalf);
}

da.ctp.bot.drawPencilSkirt = function(stroke, fill) {
	function drawHalf(ctx, ex, mods) {
		// these skirts are relatively high waisted
		ctx.moveTo(ex.bellybutton.bot.x, ex.bellybutton.bot.y-2);
		var sp = da.splitCurve(ex.waist, ex.hip,0.5);

		ctx.bezierCurveTo(79-4,ex.bellybutton.bot.y-2,
			sp.right.p1.x+3, (sp.right.p1.y+ex.bellybutton.bot.y)/2,
			sp.right.p1.x, sp.right.p1.y);

		// copy it to avoid editing the original drawpoint!
		var p2 = Object.assign({},sp.right.p2);
		p2.cp1 = sp.right.cp1;
		p2.cp2 = sp.right.cp2;

		// goes down to cover the knee
		da.drawPoints(ctx, null, p2, ex.thigh.out, ex.kneepit);

		// close up to the middle
		ctx.bezierCurveTo(ex.kneepit.x+5,ex.kneepit.y+4,
			79-3, ex.kneepit.y+4,
			79, ex.kneepit.y+4);

	}
	return da.getFullDrawer(stroke, fill, 2, drawHalf);
}

da.ctp.bot.drawBulge = function(stroke, fill) {
	function draw(ctx, ex, mods) {
		if (!ex.bulge) return;
		var pt = {x:79,y:ex.bulge.top.y};
		da.drawPoints(ctx, ex.bulge.top, ex.bulge.bot, pt);
		// special fill with shading
		var grd = ctx.createRadialGradient(79, ex.bulge.top.y+8, (ex.bulge.bot.y-ex.bulge.top.y)/1,
			79, ex.bulge.top.y+3.5, 7); 
		grd.addColorStop(0,stroke);
		grd.addColorStop(1,"rgba(0,0,0,0)");
		ctx.fillStyle = grd;

		ctx.fill();
		ctx.beginPath();
		da.drawPoints(ctx, ex.bulge.top, ex.bulge.bot);
		ctx.fillStyle = "rgba(0,0,0,0)";
		ctx.strokeStyle = "rgba(0,0,0,0)";
		// ctx.strokeStyle = "rgba(0,0,0,0)";
	}
	return da.getFullDrawer(stroke, fill, 1, draw);
}

return da;
}(da || {}));