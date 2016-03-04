var da = (function(da){

// CREATE ASSET acc
da.ctp.acc = {};
da.ctp.acc.drawThighSocks = function(stroke, pattern) {
	function drawHalf(ctx, ex, mods) {
		var legs = this.legs;

		if (!ex.thigh.in || !ex.calf.in) console.log("something wrong");
		da.drawPoints(ctx, ex.thigh.out, ex.kneepit, ex.calf.out, 
			ex.ankle.outtop, ex.ankle.out, ex.ankle.outbot, 
			ex.toe.out, ex.toe.mid, ex.toe.in, ex.toe.intop,
			ex.ankle.in, ex.ankle.intop, ex.calf.in, ex.kneecap, ex.kneecap.top, ex.thigh.in);

		ctx.quadraticCurveTo(ex.thigh.out.x+15+this.hips/5.5, ex.thigh.out.y-6-this.hips/5.5, ex.thigh.out.x, ex.thigh.out.y);
	}

	return da.getFullDrawer(stroke, pattern, 2, drawHalf);

}



da.ctp.acc.drawMakeup = function(lipcolor, nailcolor) {
	function drawLipStick(ctx, ex, mods) {
		// just draw right over lips
		da.drawPoints(ctx, ex.mouth.top, ex.mouth.left, ex.mouth.right, ex.mouth.top);
	}
	function drawNailPolish(ctx, ex, mods) {
		da.drawNail(ctx, da.adjustPoint(ex.thumb.tip,0,1), 3, 4, -Math.PI*0.05);
		da.drawNail(ctx, da.adjustPoint(ex.hand.tip,-4,-2), 3, 5, 0);
	}
	function draw(ctx, ex, mods) {
		ctx.save();
		// lips
		ctx.fillStyle = lipcolor;
		ctx.beginPath();
		drawLipStick.call(this, ctx, ex, mods);
		ctx.fill();

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

return da;
}(da || {}));