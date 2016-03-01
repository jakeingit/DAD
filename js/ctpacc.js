var da = (function(da){

// CREATE ASSET acc
da.ctp.acc = {};
da.ctp.acc.drawThighSocks = function(stroke, pattern) {
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
			var sp = da.splitQuadratic({p1:ex.hip,
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
			ctx.quadraticCurveTo(63 + a + b + e + b, 262, ex.kneecap.top.x, ex.kneecap.top.y);
			// up to corner of inner thigh
			sp = da.splitQuadratic({p1:ex.kneecap.top,
								cp1:{x:71 + a + b + (z / 3), y:233 + (z / 3) - b},
								p2:ex.groin}, 0.7);

			ctx.quadraticCurveTo(sp.left.cp1.x, sp.left.cp1.y, sp.left.p2.x, sp.left.p2.y);
			// control point go up with higher hips to better reflect contour
			ctx.quadraticCurveTo(midthighx+15+f, midthighy-6-f, midthighx, midthighy);
			// finish up by crossing over the thigh
		}		
	}

	return da.getFullDrawer(stroke, pattern, 2, drawHalf);

}

da.ctp.acc.drawMakeup = function(lipcolor, nailcolor) {
	function drawLipStick(ctx, ex, mods) {
		var lips = this.lips;

		// just draw right over lips
		ctx.moveTo(ex.mouth.mid.x, ex.mouth.mid.y);
		ctx.quadraticCurveTo(ex.mouth.left.cp1.x, ex.mouth.left.cp1.y, ex.mouth.left.x, ex.mouth.left.y);
		ctx.quadraticCurveTo(ex.mouth.right.cp1.x, ex.mouth.right.cp1.y, ex.mouth.right.x, ex.mouth.right.y);
		ctx.quadraticCurveTo(ex.mouth.mid.cp1.x, ex.mouth.mid.cp1.y, ex.mouth.mid.x, ex.mouth.mid.y);
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