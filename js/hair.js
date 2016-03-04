"use strict";
var da = (function(da){

function drawSymmetricStraightBack(ctx, ex) {
	ctx.beginPath();
	
	/*Hairback*/
	var a = ex.hairlength;
	if (a < 1) a = 1;
	var b = a / 2;
	var c = a / 3;
	var d = a / 5;
	var e = a / 10;
	
	ctx.moveTo(61, 26);
	ctx.quadraticCurveTo(60 - (c + e), 26 + (a + b), 60 - (d + e), 26 + (a * 3));
	ctx.quadraticCurveTo(79, 26 + (a * 4), 97 + d + e, 26 + (a * 3));
	ctx.quadraticCurveTo(97 + c + e, 26 + (a + b), 96, 26);
	ctx.lineTo(61,26);	
}


function drawSymmetricStraightPartedFront(ctx, ex, face) {
	/*Hairfront*/
	ctx.beginPath();
	var hl = ex.hairlength;
	var a = hl;	
	if (a > 50) a = 50 + (a-50)*0.2; // hairlength over a limit grows much slower
	var b = a / 2;
	var c = a / 3;
	var d = a / 5;
	var e = a / 10;
	var x = face / 7;
	
	if (hl < 2) {
		var z = (hl - 1) * 2;
		if (z > 1) z = 1;
		
		var facea = face - 11;
		if (face < 11) facea = face;
		var faceb = facea / 2;
		var facec = facea / 3;
		var faced = facea / 5;
		var facee = facea / 10;
		
		ctx.moveTo(79,8 + x + x);
		ctx.quadraticCurveTo(55 + (x * 3), 15 + b, 59, 27);
		ctx.quadraticCurveTo(59 + e, 27 + a + b, 59, 24 + (a * 3));
		if (face < 11) {
			ctx.lineTo(59 - a, 27);
			ctx.quadraticCurveTo(59 - (a + a), 5 + facec, 79, 5 + facec - (b + c));
		} else {
			ctx.lineTo(59 + faced - a, 27);
			ctx.quadraticCurveTo(59 + faced - (a + a), 8.4 + facee, 79, 8.4 + facee - (b + c));
		}
	} else {
		ctx.moveTo(79, 8 + x + x);
		if (a > 20) ctx.quadraticCurveTo(55 + (x * 3), 25, 59, 27);
		else ctx.quadraticCurveTo(55 + (x * 3), 15 + b, 59, 27);
		ctx.quadraticCurveTo(59 + e, 27 + a + b, 59, 24 + (a * 3));
		ctx.lineTo(57, 22 + (a * 3));
		ctx.quadraticCurveTo(57 - e, 25 + a + b, 57, 22);
		ctx.quadraticCurveTo(58 + x, 5 + x - (e / 2), 79, 5 + x - (e / 2));
		ctx.lineTo(79, 8 + x + x);
	}
}

function drawBangsBack(ctx, ex) {
	ctx.beginPath();
	var hl = ex.hairlength*2+20;
	var hairside = {x:da.clamp(ex.ear.bot.x-2 +hl*0.05,0,65), y:da.clamp(hl,0,200)};
	var hairtip = {x:da.clamp(hairside.x+2+hl*0.05,0,70), y:hairside.y+3+hl*0.1};
	hairside.cp1 = {x:ex.ear.bot.x-1 -hl*0.1, y:ex.skull.y};
	hairside.cp2 = {x:hairside.x -hl*0.1, y:ex.skull.y -2 +hl*0.4};
	var backtip = {x:79, y:hairtip.y};
	if (hl > 90) hairside.x -= hl*0.1;

	da.drawPoints(ctx, da.adjustPoint(ex.skull,0,-1-hl*0.02), hairside, backtip);
}

function drawBangsFront(ctx, ex) {
	ctx.save();
	ctx.beginPath();
	var hl = ex.hairlength*2+20;
	var hairside = {x:da.clamp(ex.ear.bot.x-2 +hl*0.05,0,65), y:da.clamp(hl,0,200)};
	var hairtip = {x:da.clamp(hairside.x+2+hl*0.05,0,70), y:hairside.y+3+hl*0.1};

	hairside.cp1 = {x:ex.ear.bot.x-1 -hl*0.1, y:ex.skull.y};
	hairside.cp2 = {x:hairside.x -hl*0.1, y:ex.skull.y -2 +hl*0.4};

	var bangtip = {x:79, y:ex.skull.y+da.clamp(hl*0.4,0,25)};
	var bangedge = {x:79-15, y:bangtip.y-2};

	if (hl > 90) {
		hairside.x -= hl*0.05;
		hairtip.x -= hl*0.1;
	}

	da.drawPoints(ctx, da.adjustPoint(ex.skull,0,-1-hl*0.02), hairside);
	da.averageQuadratic(ctx, hairside, hairtip, 0.5, -1,1);
	da.averageQuadratic(ctx, hairtip, bangedge, 0.5, (hl>90)?hl*0.01:-hl*0.1,0);

	var bangcp1 = da.averageQuadratic(ctx, bangedge, bangtip, 0.5, -1,1);

	// bang details
	if (hl > 50) {
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		var hairstart = {x:79, y:ex.skull.y};
		for (var i = 0; i < 1; i+=0.3) {
			var sp = da.splitQuadratic({p1:bangedge,p2:bangtip,cp1:bangcp1},i);
			var bangstart = sp.left.p2;
			ctx.moveTo(bangstart.x, bangstart.y);
			da.averageQuadratic(ctx, bangstart, hairstart, 0.5, -(1-i)*5, -(1-i)*5, 0.05, da.clamp(0.2+hl*0.004,0,1));
		}	
	}
	ctx.restore();
}

function drawSideBraidsFront(ctx, ex) {
	ctx.save();
	ctx.beginPath();
	var hl = ex.hairlength+10;

	// draw front parting
	var hairtip = {x:ex.skull.x+5, y:ex.skull.y-2-hl*0.01};
	var hairbot = {x:ex.ear.bot.x-2-hl*0.03, y:ex.ear.bot.y+hl*0.05,
		cp1:{x:hairtip.x-27-hl*0.02, y:hairtip.y-5}};
	hairbot.cp2 = {x:hairbot.x-5, y:hairbot.y-10};
	hairtip.cp1 = {x:hairbot.x+5, y:hairbot.y-20};
	hairtip.cp2 = {x:hairtip.x+5+hl*0.1, y:hairtip.y+20+hl*0.1};

	da.drawPoints(ctx, hairtip, hairbot, hairtip);
	ctx.restore();	

	// draw braids (wow turned out pretty complicated)
	if (hl > 30) {
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();

		var braidtop = {x:hairbot.x-hl*0.01, y:hairbot.y+10};
		var braidtip = {x:braidtop.x+hl*0.3, y:braidtop.y+hl};
		var braidend = {x:ex.neck.top.x-5, y:ex.neck.top.y+5};
		// var braidend = {x:braidtop.x+4+hl*0.04, y:braidtop.y};

		ctx.moveTo(hairbot.x, hairbot.y);
		ctx.lineTo(braidtop.x, braidtop.y);
		var outcp1 = da.averageQuadratic(ctx, braidtop, braidtip, 0.5, -hl*0.2, hl*0.2);
		var outcp2 = da.averageQuadratic(ctx, braidtip, braidend, 0.5, -hl*0.2, hl*0.2);
		var i = 0, j = 0.05;
		var outer = da.splitQuadratic({p1:braidtop,p2:braidtip,cp1:outcp1},i).left.p2;
		var inner = da.splitQuadratic({p1:braidend,p2:braidtip,cp1:outcp2},j).left.p2;
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();

		for (; i < 1 && j < 1;) {
			i += 10/hl;
			outer = da.splitQuadratic({p1:braidtop,p2:braidtip,cp1:outcp1},i).left.p2;	
			j += 10/hl;
			inner = da.splitQuadratic({p1:braidend,p2:braidtip,cp1:outcp2},j+(10-2*j)/hl).left.p2;
			ctx.moveTo(outer.x, outer.y);
			da.averageQuadratic(ctx, outer, inner, 0.5, -10+5*j,2);
			ctx.moveTo(inner.x, inner.y);
			da.averageQuadratic(ctx, inner, outer, 0.5, 10-5*i,-5);

			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
		}

		// extra stray hair for detail
		var stray = da.splitCurve(hairbot,hairtip,0.7).left.p2;
		ctx.moveTo(stray.x, stray.y);
		ctx.bezierCurveTo(stray.x+5, stray.y+10, braidtop.x-10, braidtop.y-20, braidtop.x, braidtop.y+10);
		// ctx.lineTo(braidtop.x, braidtop.y);
		ctx.fillStyle = "rgba(0,0,0,0)";
	}

}
function drawSideBraidsBack(ctx, ex) {
	ctx.save();
	ctx.beginPath();
	var hl = ex.hairlength+10;

	// draw front parting
	var hairtip = {x:ex.skull.x+5, y:ex.skull.y-2-hl*0.01};
	var hairbot = {x:ex.ear.bot.x-2-hl*0.03, y:ex.ear.bot.y+hl*0.05,
		cp1:{x:hairtip.x-27-hl*0.02, y:hairtip.y-5}};
	hairbot.cp2 = {x:hairbot.x-5, y:hairbot.y-10};
	hairtip.cp1 = {x:hairbot.x+5, y:hairbot.y-20};
	hairtip.cp2 = {x:hairtip.x+5+hl*0.1, y:hairtip.y+20+hl*0.1};
	var hairback = {x:79, y:hairbot.y+hl*0.5,
		cp1:{x:60, y:hairbot.y+hl*0.5}};

	// to the other side of ears
	var tuckedhair = {x:2*79-ex.ear.bot.x, y:ex.ear.bot.y,
		cp1:{x:80+hl*0.2,y:ex.chin.bot.y}};
	da.drawPoints(ctx, hairtip, hairbot, hairback, tuckedhair);
}

function drawOtherSideBraidsFront(ctx, ex) {
	ctx.save();
	ctx.beginPath();
	var hl = ex.hairlength;

	var hairtip = {x:ex.skull.x-5, y:ex.skull.y-2-hl*0.01};
	var hairbot = da.adjustPoint(ex.ear.top,-2,2);
	da.drawPoints(ctx, hairtip, hairbot);
	da.averageQuadratic(ctx, hairbot, hairtip, 0.5, 10, 5);

	ctx.restore();		
}

da.drawHairBack = [
	function(ctx, ex) {
		return;	// bald
	},
	function(ctx, ex) {
		drawSymmetricStraightBack(ctx, ex);
		ctx.fill();
		ctx.stroke();
	},
	function(ctx, ex) {
		drawBangsBack(ctx, ex);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
		drawBangsBack(ctx, ex);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
	},
	function(ctx, ex) {
		drawSideBraidsBack(ctx, ex);
		ctx.fill();
		ctx.stroke();
	}
];
da.drawHairFront = [
	function(ctx, ex) {
		da.reflectHorizontal(ctx);
		return;	// bald
	},
	function(ctx, ex, face) {
		drawSymmetricStraightPartedFront(ctx, ex, face);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
		drawSymmetricStraightPartedFront(ctx, ex, face);
		ctx.fill();
		ctx.stroke();
	},
	function(ctx, ex) {
		drawBangsFront(ctx, ex);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
		drawBangsFront(ctx, ex);
		ctx.fill();
		ctx.stroke();
	},
	function(ctx, ex) {
		da.reflectHorizontal(ctx);
		drawOtherSideBraidsFront(ctx, ex);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
		drawSideBraidsFront(ctx, ex);
		ctx.fill();
		ctx.stroke();
		da.reflectHorizontal(ctx);
	}
];

return da;
}(da || {}));