var da = (function(da){

// CREATE ASSET acc
da.ctp.acc = {};
da.ctp.acc.drawThighSocks = function(stroke, pattern) {
	function drawHalf(ctx, ex, mods) {
		var legs = this.legs;

		/*Outer Leg*/
		if (legs < 11) {

		
			var sp = da.splitQuadratic({p1:ex.hip,
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

			ctx.quadraticCurveTo(midthighx+15, midthighy-6, midthighx, midthighy);

		} else {

			// we want to start somewhere along the outer thigh rather than the lowerhip point
			var sp = da.splitQuadratic({p1:ex.hip,
							cp1:ex.kneepit.cp1,
							p2:ex.kneepit}, 0.55);
			var midthigh = sp.right.p1;
			var kneepitclone = Object.assign({},sp.right.p2,{cp1:sp.right.cp1});

			da.drawPoints(ctx, midthigh, kneepitclone, ex.calf.out, ex.ankle.outtop,
				ex.ankle.out);

			if (ex.shoeheight < 3) {
				da.drawPoints(ctx, null, ex.ankle.outbot, ex.toe.out, ex.toe.mid, ex.toe.in, ex.toe.intop,
					ex.ankle.in, ex.ankle.intop, ex.calf.in);
			}
			else {
				da.drawPoints(ctx, null, ex.ankle.outbot, ex.toe.out, ex.toe.in, ex.ankle.in, ex.ankle.intop, ex.calf.in);
			}

			da.drawPoints(ctx, null, ex.kneecap, ex.kneecap.top);

			// /*Inner-Leg*/
			sp = da.splitCurve(ex.kneecap.top, ex.groin, 0.7);

			ctx.quadraticCurveTo(sp.left.cp1.x, sp.left.cp1.y, sp.left.p2.x, sp.left.p2.y);
			ctx.quadraticCurveTo(midthigh.x+15+this.hips/5.5, midthigh.y-6-this.hips/5.5, midthigh.x, midthigh.y);
			// finish up by crossing over the thigh

		}		
	}

	return da.getFullDrawer(stroke, pattern, 2, drawHalf);

}

da.ctp.acc.drawMakeup = function(lipcolor, nailcolor) {
	function drawLipStick(ctx, ex, mods) {
		var lips = this.lips;

		// just draw right over lips
		da.drawPoints(ctx, ex.mouth.mid, ex.mouth.left, ex.mouth.right, ex.mouth.mid);
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

return da;
}(da || {}));