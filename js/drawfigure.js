"use strict";
/* Copyright 2012 tuatha, 2016 penumbra */
/* Originally created by Tuatha, majorly overhauled by Penumbra */

// draw avatar module (loosely augmented so load order isn't important)
// only problem is that private state between files can't be shared
var da = (function(da){

var reflectHorizontal = da.reflectHorizontal = function(ctx) {
	ctx.translate(78.6, 200);
	ctx.scale(-1, 1);
	ctx.translate(-78.6, -200);	
};

da.getCanvas = function(canvasName, styleOverride) {
	/* 	get a canvas DOM element with id=canvasName, generating it if necessary
	   	styleOverride is the additional/overriding css style object to apply over defaults
	   	likely, you'd want to define its location:
		
		styleOverride = {
			position:"absolute",
			top:"10px",
			left:"10px",
			parent: document.getElementById("canvas_holder"),
		}
	*/
	var styles = Object.assign({
		width:"500",
		height:"800",
	}, styleOverride); 

	var canvas = document.getElementById(canvasName);
	// create canvas
	if (!canvas) {
		canvas = document.createElement('canvas');
		canvas.id = canvasName;
		// width and height have to be set on the DOM element rather than styled
		canvas.width = styles.width;
		canvas.height = styles.height;

		// add the rest of the styling
		for (var s in styles) {
			if (styles.hasOwnProperty(s) && s !== "width" && s !== "height") {
				canvas.style[s] = styles[s];
			}
		}

		// explicit location of where to put the canvas (document.body by default)
		if (!styles.parent) {
			styles.parent = document.body;
		}
		// ensure is first child of parent
		styles.parent.insertBefore(canvas, styles.parent.firstChild);
	}

	return canvas;
}

da.hideCanvas = function(canvasName) {
	// on certain screens, you want to hide the canvas
	var canvas = da.getCanvas(canvasName);
	canvas.style.display = "none";
};
da.showCanvas = function(canvasName) {
	// redisplaying a canvas hidden by hideCanvas
	var canvas = da.getCanvas(canvasName);
	canvas.style.display = "block";	
};


// anything defined on da (the module) is exported
da.drawfigure = function(canvasname, avatar, passThrough) {
	// canvas name is the string id of the canvas element to draw to

	function shadeCylinder(context, x, y, wid, hei, clr) {
		
		var gradient = context.createLinearGradient(x, y, x + wid, y);
		gradient.addColorStop(0, clr);
		gradient.addColorStop(0.25, $.xcolor.lighten(clr, 0.75));
		gradient.addColorStop(0.5, clr);
		gradient.addColorStop(0.75, $.xcolor.darken(clr, 0.33));
		gradient.addColorStop(1, clr);

		context.fillStyle = gradient;
		context.fill();
	}
	function drawEllipseByCenter(ctx, cx, cy, w, h) {
		drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
	}

	function drawEllipse(ctx, x, y, w, h)
	{
		var kappa = 0.5522848,
				ox = (w / 2) * kappa, // control point offset horizontal
				oy = (h / 2) * kappa, // control point offset vertical
				xe = x + w,           // x-end
				ye = y + h,           // y-end
				xm = x + w / 2,       // x-middle
				ym = y + h / 2;       // y-middle

		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		//ctx.closePath(); // not used correctly, see comments (use to close off open path)
		ctx.stroke();
	}

	function drawGenitals(ctx)
	{
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		drawTestes(ctx);
		var hasc = avatar.hasCock();
		
		var ev = avatar.physique.gentialscnt - (Math.floor(avatar.physique.gentialscnt / 2) * 2);
		for (var i = avatar.physique.gentialscnt; i > 0; i--) {
			var evi = i - (Math.floor(i / 2) * 2);
			var ab = (evi == 1) ? 10 : -10;
			var ang = ev == 1 ? ab * Math.floor(i / 2) : ab * Math.floor((i + 1) / 2);
			drawPenis(ctx, ang, penis-avatar.arousal/10, hasc);
		}
	}
	
	function drawTestes(ctx)
	{
		ctx.save();
		ctx.beginPath();
		var a = (21 - testes) / 13;
		if (a < 1) a = 1;
		ctx.lineWidth = a;
		
		/*Testes*/
		a = testes;
		a = a/1.4;
		var b = a / 2;  //size
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var f = 1;
		var z;
		

		if (testes < 11)
		{
			// Balls
			ctx.lineWidth = 1.5;
			z = 0;
			if (waist < 0) z = waist * -0.15;
			ctx.moveTo(76 - d, 202 + f + z);
			// left
			ctx.bezierCurveTo(75 + b,
												204 + z + f - e,
												67 + a + b,
												215 + z + f - (a + b),
												70 + (c * 3),
												222 + z + f - (a + a + b)
												);
			ctx.quadraticCurveTo(74 + b,
													 225 + z + f - (a + a + b + c),
													 78 + e,
													 220 + z + f - (a + b + c) - c
													 );
			// right
			ctx.quadraticCurveTo(83 - a,
													 224 + z + f - (a + a + b + d) - b,
													 87 - a,
													 219 + z + f - (a + b + d)
													 );
			ctx.bezierCurveTo(87 - (b + c),
												214 + z + f - (a + d),
												84 - b,
												203 + z + f - e,
												83 + d,
												204 + z + f);
			// central line
			ctx.moveTo(78 + e, 220 + z + f - (a + b + c) - c);
			ctx.quadraticCurveTo(81 - d,
													 218 + z + f - (a + a + a) + a,
													 79,
													 212 + z + f - a + a);
			
		}	else if (waist > -10) {	// can't see down there if belly's too large

			// complete the mons
			ctx.moveTo(ex.mons.tip.x, ex.mons.tip.y);
			ctx.quadraticCurveTo(ex.mons.tip.x-2.5,ex.mons.tip.y-0.2,
				ex.mons.tip.x-1.5-hips*0.02, ex.mons.tip.y-4);
			ctx.bezierCurveTo(ex.mons.tip.x+4+hips*0.02,ex.mons.tip.y-9,
				ex.mons.tip.x-4-hips*0.02, ex.mons.tip.y-9,
				ex.mons.tip.x+1.5+hips*0.02, ex.mons.tip.y-4);
			ctx.quadraticCurveTo(ex.mons.tip.x+2.5,ex.mons.tip.y-0.2,
				ex.mons.tip.x, ex.mons.tip.y);
			ctx.stroke();

			// labia
			ctx.beginPath();
			ctx.lineWidth = (testes > 25)? 2.5 : testes / 10;
			ctx.strokeStyle = LIPCOLOR;
			ctx.moveTo(ex.mons.tip.x, ex.mons.tip.y-0.5);
			ctx.bezierCurveTo(ex.mons.tip.x+1.5, ex.mons.tip.y-2,
				ex.mons.tip.x-1.5, ex.mons.tip.y-3,
				ex.mons.tip.x, ex.mons.tip.y-4);
			ctx.lineCap = "round";

		}
		
		ctx.fill();
		ctx.stroke();
	}
	
	function drawPenis(ctx, rot, size, cock)
	{
		if (!cock) return;
		ctx.save();
		// base size
		// size -= 5;
		size = (size > 0)? 0 : -size;
		ctx.lineWidth = da.clamp(1 + size*0.1, 1, 3);
		ctx.lineCap = "round";

		ctx.translate(ex.mons.tip.x, ex.mons.tip.y);
		ctx.rotate(rot*Math.PI/180);

		// TOOD erection? (not sure if it's even necessary)
		ex.tippenis = {x:79, y:ex.mons.tip.y+size*6.5};

		var translatedtipy = ex.tippenis.y-ex.mons.tip.y;


		ctx.beginPath();
		// shaft
		ex.leftheadpenis = {x:ex.tippenis.x-size*0.8, y:ex.tippenis.y-size*6+2};
		var translatedlefthead = {x:ex.leftheadpenis.x-ex.tippenis.x, y:ex.tippenis.y-ex.leftheadpenis.y};
		var translatedrighthead = {x:0-translatedlefthead.x, y:translatedlefthead.y};

		// center of the base (perhaps as a draw point for pubic hair?)
		ex.basepenis = {x:0, y:-5};
		ctx.moveTo(translatedlefthead.x-penist*0.2, ex.basepenis.y);
		ctx.quadraticCurveTo(translatedlefthead.x-penist, (translatedlefthead.y-size)/2,
			translatedlefthead.x,translatedlefthead.y);

		ctx.lineTo(translatedrighthead.x, translatedrighthead.y);
		ctx.quadraticCurveTo(translatedrighthead.x+penist, (translatedlefthead.y-size)/2,
			translatedrighthead.x+penist*0.2, ex.basepenis.y);

		ctx.fill();
		ctx.stroke();


		// head
		ctx.beginPath();
		ctx.moveTo(0, translatedtipy);
		ctx.bezierCurveTo(-size*3.3,translatedtipy-size*1.6,
			size*3.3,translatedtipy-size*1.6,
			0,translatedtipy);

		// shading for the head
		var grd = ctx.createLinearGradient(translatedlefthead.x, translatedlefthead.y, translatedrighthead.x, translatedrighthead.y);
		// extract the rgb values of lip color
		var rgb = da.extractRGB(LIPCOLOR);
		if (!rgb) {	// some values were negative
			rgb = {r:0, g:0, b:0};
		}

		grd.addColorStop(0,LIPCOLOR);
		var tipcolor = ["rgb(", rgb.r+20+"", ",", (rgb.g+5)+"", ",", (rgb.b+2)+"", ")"].join("");
		grd.addColorStop(0.5, tipcolor);
		grd.addColorStop(1,LIPCOLOR);

		ctx.strokeStyle = ctx.fillStyle = grd;

		ctx.fill();
		ctx.stroke();

		// veins for really thick or long
		if (size + penist > 10) {
			ctx.beginPath();
			ctx.lineWidth = da.clamp(penist*0.3, 0.1, 2);
			ctx.moveTo(translatedlefthead.x-penist*0.1, translatedlefthead.y/2.5);
			ctx.bezierCurveTo(translatedlefthead.x+1,translatedlefthead.y/3,
				0,translatedlefthead.y/2,
				2-penist*0.5, translatedlefthead.y/10);

			ctx.moveTo(translatedrighthead.x+penist*0.4, translatedrighthead.y/1.5);
			ctx.quadraticCurveTo(4,translatedrighthead.y/3,
				3+penist*0.4, translatedrighthead.y/5);

			ctx.moveTo(-5-penist*0.5,translatedtipy-25);
			ctx.bezierCurveTo(-2, translatedtipy-10,
				2+penist*0.2,translatedtipy-20,
				2+penist*0.3, translatedtipy-14);
			ctx.stroke();
		}

		ctx.restore();
		return;

	}
	
	function drawPecs(ctx)
	{
		ctx.beginPath();
		
		/*Pecs*/
		var a = shoulders;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = shoulders * 1.43;
		var y = shoulders * 0.43;
		var z = (breasts*((11-shoulders)*2))/20;
		
		if (shoulders <= 10) {
			ctx.lineWidth = (11-shoulders) / 10;
			ex.outpecs = {x:33 + x + y + (z/4), y:95 + b + (z / 3)};
			ctx.moveTo(ex.outpecs.x, ex.outpecs.y);
			ex.botpecs = {x:50 + c + y + (z / 4), y:120 + z - (a + b + y),
				cp1:{x:30 + x + y + c + c + (z / 4), y:105 + z - y}};
			ctx.quadraticCurveTo(ex.botpecs.cp1.x, ex.botpecs.cp1.y,
				ex.botpecs.x, ex.botpecs.y);

			if (breasts < 14) {
				ex.inpecs = {x:78 - (a + c + (z / 4)), y:117 + z + (z / 4) - (a + c + y),
					cp1:{x:63 + x - (c + (z / 2)), y:120 + (z * 1.3) - (a + b + y)}};
				ctx.quadraticCurveTo(ex.inpecs.cp1.x, ex.inpecs.cp1.y,
					ex.inpecs.x, ex.inpecs.y);
			}

		}
	}
	
	function drawAbs(ctx)
	{
		ctx.beginPath();
		
		/*Abs*/
		
		if (shoulders < 11 && breasts < 50) {
			var a = shoulders;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			var x = shoulders * 1.43;
			var y = shoulders * 0.43;
			var z = (breasts * ((11 - shoulders) * 2)) / 20;
		
			ctx.lineWidth = (12 - shoulders) / 12;
			if (waist < 1) ctx.lineWidth = 0.00001;
			else if (waist < 10 && ctx.lineWidth > waist / 10) ctx.lineWidth = waist / 10;
			ctx.moveTo(79, 125 - a);
			ctx.quadraticCurveTo(63 + c, 132 - a, 60 + c, 140 - a);
			ctx.quadraticCurveTo(62 + c, 146 - a, 63 + c, 160);
			
		}
	}
	
	function drawMons(ctx)
	{
		ctx.beginPath();
		
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		
		/*Belly*/
		var z = legs - 10;
		if (z < 0) z = 0;
		var a = ((waist - 10) + z) / 2;
		if (a < 0) a = 0;
		var b = a;
		if (legs >= 20) b = a / 5;
		else if (legs >= 19) b = a / 5;
		else if (legs >= 18) b = a / 2.8;
		else if (legs >= 17) b = a / 2.2;
		else if (legs >= 16) b = a / 1.8;
		else if (legs >= 15) b = a / 1.6;
		else if (legs >= 14) b = a / 1.5;
		else if (legs >= 13) b = a / 1.3;
		else if (legs >= 12) b = a / 1.2;
		else if (legs >= 11) b = a / 1.1;
		var c = hips / 4;
		
		ex.mons = {};

		ctx.lineWidth = 1;
		if (waist < -9) ctx.lineWidth = 0.00001;
		else if (waist < 0) ctx.lineWidth = (10 + waist) / 10;
		ex.mons.right = {x:85 + b + c, y:200 - a - legl};
		ex.mons.left = {x:74 - (b + c), y:ex.mons.right.y,
			cp1:{x:79, y:209+a-legl}};
		var sp = da.splitQuadratic({p1:ex.mons.right, p2:ex.mons.left, cp1:ex.mons.left.cp1},0.5);
		ex.mons.tip = sp.right.p1;
		ctx.moveTo(ex.mons.right.x, ex.mons.right.y);
		ctx.quadraticCurveTo(ex.mons.left.cp1.x, ex.mons.left.cp1.y, ex.mons.left.x, ex.mons.left.y);
	}
	
	function drawPregs(ctx){
		ctx.beginPath();
		
		//Pregnancy
		
		if (waist<0){/*Upper Waist*/
			ctx.lineWidth = (waist * -1) / 10;
			if (ctx.lineWidth < 1) ctx.lineWidth = 1;
			else if (ctx.lineWidth > 1.8) ctx.lineWidth = 1.8;
			
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
			var h = 0;
			if (waist < 0) h = waist * -0.5;
			if (a < 11){
				ctx.moveTo(47 + (c * 3) - (h / 4), 149 - (h + a));
			}
			else{
				a = shoulders - 11;
				if (shoulders > 20) a = 9;
				a = a * 0.9;
				b = a / 2;
				c = a / 3;
				d = a / 5;
				e = a / 10;
				f = a * 2;
				g = 0;
				if ((hips * 3) + ass > 70) g = (a / 9) * ((((hips * 3) + ass) - 70) / 5);
				if (7 - legs > 0) g += (7 - legs);
				if (g > 14) g = 14;
				z = g / 2;
				x = a;
				y = x / 2;
				var m = 0;
				if (shoulders > 20) m = (shoulders - 20) / 10;
				ctx.moveTo(56 - (d + (h / 4)), 138 - (b + h));
			}
			
			
			/*Waist*/
			a = 0;
			if (shoulders < 11) {
				a = (11 - shoulders);
				if (waist < 1) {
					a += waist / 4;
					if (a < 0) a = 0;
				}
			}
			b = (hips + ass) * 3;
			if (ass > 20) b += (ass - 20) * 8;
			c = waist / 3;
			if (c < -5) c = -5;
			d = hips / 2;
			if (hips > 20) d = 10;
			f = 0;
			
			y = b;
			if (y > 100) y = 100;
			ctx.bezierCurveTo(53 + c - ((a / 1.2) + (y / 40.7) + (f / 5) + (b / 60)), 145 + (c / 5) + (y / 27.5), 52 + c - ((a / 1.6) + (f / 2) + (b / 40)), 161 - ((y / 6.875)),50.3 + (c / 2) - ((a / 2) + (b / 20) + (f / 2)), 175 - ((y / 22) + d));
			
			a = (hips + ass) / 2;
			if (a > 25) a = 25;
			if (legs < 5) a += 5 - legs;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			g = hips / 20;
			var h = waist * -1.7;
			var i = 0;
			var j = 0.0001;
			if (legs > 11) j = ((legs - 11) / 2) - ((21 - hips) / 4);
			if (j < 0.0001) j = 0.0001;
			if (legs > 11) i = (legs - 11) * 2;
			if (i > 9) i = 9;
			if (ass > hips) g = ass / 20;
			if (g > 1) g = 1;
			x = ass / 5;
			y = ass / 15;
			z = 0;
			if (legs < 11) z = (11 - legs) / 2;
			if (a > 15 && z > 20 - a) z = 20 - a;
			ctx.quadraticCurveTo(65 - ((ass / 8) + (hips / 12) + (h / 2) + f), 197 + f + f, 79, 206);
		}
		
		return ctx;
	}
	
	function drawBellyButton(ctx)
	{
		ctx.beginPath();
		
		/*BellyButton*/
		
		var a = 21 - waist;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		
		ex.botbellybutton = {x:80, y:155+d-legl};
		ctx.moveTo(ex.botbellybutton.x, ex.botbellybutton.y-3);
		ctx.quadraticCurveTo(ex.botbellybutton.x+2, ex.botbellybutton.y-2, ex.botbellybutton.x, 
			ex.botbellybutton.y);
		
		ctx.stroke();
	}
	

	function drawLegMuscles(ctx)
	{
		ctx.beginPath();
		
		if (legs <= 8) {
			ctx.lineWidth = (9 - legs) / 9;
			
			var a = legs;
			var b = a / 2;
			var d = a / 5;
			var e = a / 10;
			ctx.moveTo(61 + e, 276 - a);
			ctx.quadraticCurveTo(67 - d, 260, 67 - d, 236);
			
			ctx.moveTo(61 + e, 276 - a);
			ctx.quadraticCurveTo(58 - e, 283 + b, 58 - e, 290 + b);
		}
	}
	
	function drawBoobs(ctx, bsize, ypos, row)
	{
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		ctx.lineWidth = 1;
		drawBreasts(ctx, bsize, ypos);
		ctx.fill();
		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.fillStyle = LIPCOLOR;
		ctx.strokeStyle = LIPCOLOR;
		drawAreola(ctx, bsize, ypos);
		ctx.fill();
		drawAreola(ctx, bsize, ypos);
		ctx.stroke();
		ctx.strokeStyle = NIPPLESHADOW;
		drawNipples(ctx, bsize, ypos);
		ctx.stroke();
	}
	
	function drawBreasts(ctx, bsize, ypos)
	{
		ctx.beginPath();
		
		ctx.lineWidth = bsize / 13;
		if (ctx.lineWidth < 1) ctx.lineWidth = 1;
		else if (ctx.lineWidth > 1.8) ctx.lineWidth = 1.8;
		
		/*Breasts*/
		var a = bsize * 1.5;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = 0;
		// control points we'll be using for top to bottom of breast
		var cp1, cp2, t;

		if (shoulders < 10) x = shoulders * 6.3;
		else if (shoulders > 20) x = 33;
		else x = 73 - (shoulders * 2);
		
		if (bsize < 2) return;	// no breasts

		ex.breast = {};
		ex.cleavage = {};

		if (bsize < 11) {
			ex.breast.top = {x:60 + (x / 10) - b, y:110 - (c + (x / 3)) + ypos};
			ctx.moveTo(ex.breast.top.x, ex.breast.top.y);

			cp1 = {x:60 + (x / 10) - (b + c), y:110 - (d + (x / 3)) + ypos};
			cp2 = {x:60 + (x / 10) - (a + c), y:110 + (a - (x / 3)) + ypos};
			t = 0.5;
			ex.breast.bot = {x:60 + (x / 10) - d, y:110 + (a + c - (x / 3)) + ypos};
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ex.breast.bot.x, ex.breast.bot.y );

			ex.cleavage.bot = {x:60 + (b + c), y:110 + (a + d + (e / 2) - (x / 3)) + ypos,
				cp1:{x:60+b, y:110 + (a + c + e - (x / 3)) + ypos},
				cp2:{x:60 + (b + c), y:110 + (a + d + (e / 2) - (x / 3)) + ypos}};
		} else if (bsize < 20) {
			a = (bsize - 11) * 1.5;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			ex.breast.top = {x:51.75 + (x / 10) - (e / 2), y:104.5 - (x / 3) + ypos};
			ctx.moveTo(ex.breast.top.x, ex.breast.top.y);

			cp1 = {x:46.25 + (x / 10) - (e / 2), y:106.7 + b - (x / 3) + ypos};
			cp2 = {x:38 + (x / 10) - d, y:126.5 + d + d - (x / 3) + ypos};
			t = 0.57;
			ex.breast.bot = {x:56.7 + (x / 10) - d, y:132 + b + c - (x / 3) + ypos};
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ex.breast.bot.x, ex.breast.bot.y);

			var z = 73.75 + b;
			if (z > 78) z = 78;
			ex.cleavage.bot = {x:z, y:130.625 + b + d - (x / 3) + ypos,
				cp1:{x:68.25 - e, y:133.65 + a - (x / 3) + ypos},
				cp2:{x:73.75 - e, y:130.625 + a - (x / 3) + ypos}};
		} else {
			a = (bsize - 20) / 2;
			b = a / 2;
			c = a / 3;
			d = a / 5;
			e = a / 10;
			var f = a * 1.5;
			if (f > 20) f = 20;
			var g = a / 2;
			if (g > 30) g = 30;

			ex.breast.top = {x:51.075 + (x / 10), y:104.5 - (x / 3) + ypos};
			ctx.moveTo(ex.breast.top.x, ex.breast.top.y);

			cp1 = {x:45.575 - a + (x / 10), y:113.45 + a - (x / 3) + ypos};
			cp2 = {x:35.5 - a + (x / 10), y:131.9 + a - (x / 3) + f + ypos};
			t = 0.6;
			ex.breast.bot = {x:54 - a + (x / 10) + d, y:143.25 + a + e - (x / 3) + f + ypos + d};
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ex.breast.bot.x, ex.breast.bot.y);

			ex.cleavage.bot = {x:79.5, y:140.075 + a - (x / 3) + ypos - g,
				cp1:{x:66.9 - a/2, y:147.15 + a + a/2 - (x / 3) + f + ypos},
				cp2:{x:72.4 - a/2 + f, y:144.125 + a + a/2 - (x / 3) + (f * 1.5) + ypos}};
		}
		ctx.bezierCurveTo(ex.cleavage.bot.cp1.x, ex.cleavage.bot.cp1.y,
			ex.cleavage.bot.cp2.x, ex.cleavage.bot.cp2.y,
			ex.cleavage.bot.x, ex.cleavage.bot.y);

		ex.breast.bot.cp1 = cp1;
		ex.breast.bot.cp2 = cp2;
		// get outermost tip for clothes drawing
		var sp = da.splitBezier({p1:ex.breast.top, p2:ex.breast.bot, cp1:cp1, cp2:cp2}, t);
		// control points to continue onto next part
		ex.breast.tip = {x:sp.right.p1.x, y:sp.right.p1.y, cp1:sp.right.cp1, cp2:sp.right.cp2};
	}
		
	function drawCleavage(ctx) {
		ctx.beginPath();
		
		ctx.lineWidth = breasts/15;
		if (ctx.lineWidth < 1) ctx.lineWidth = 1;
		else if (ctx.lineWidth > 1.5) ctx.lineWidth = 1.5;
		
		/*Cleavage*/
		var a = (breasts - 11) * 1.5;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var f = a / 1.2;
		var x = 0;
		if (shoulders < 10) x = shoulders * 6.3;
		else if (shoulders > 20) x = 33;
		else x = 73 - (shoulders * 2);
		
		if (breasts < 14) return;
		else if (breasts < 20) {
			ex.cleavage.mid = {x:79, y:121 + b + d - (x / 3)};
			ctx.moveTo(ex.cleavage.mid.x-0.5, ex.cleavage.mid.y);
			ex.cleavage.top = {x:79 - (e/2), y:105 + c - (x/3)};
			ctx.bezierCurveTo(79.5, 118 + b - (x / 3),
												79.5, 108 + b - (x / 3),
												ex.cleavage.top.x-1, ex.cleavage.top.y );
			ctx.moveTo(ex.cleavage.mid.x+0.5, ex.cleavage.mid.y);
			ctx.bezierCurveTo(78.5, 118 + b - (x / 3),
												78.5, 108 + b - (x / 3),
												ex.cleavage.top.x+1, ex.cleavage.top.y );
		} else {
			if (breasts >= 20) a = (breasts - 20) / 2;
			var g = a / 2;
			if (g > 30) g = 30;

			ex.cleavage.mid = {x:79, y:130.45 - (x / 3)};
			ctx.moveTo(ex.cleavage.mid.x-0.5, ex.cleavage.mid.y);
			ex.cleavage.top = {x:79, y:109.5 - (x / 3)};
			ctx.bezierCurveTo(79.5, 124.75 - (x / 3) + f - g,
												79.5, 114.75 - (x / 3),
												ex.cleavage.top.x-1, ex.cleavage.top.y);
			ctx.moveTo(79.5,130.45 - (x / 3));
			ctx.bezierCurveTo(78.5, 124.75 - (x / 3) + f - g,
												78.5, 114.75 - (x / 3),
												ex.cleavage.top.x+1.675, ex.cleavage.top.y);
		}
		ctx.stroke();
	}
	
	function drawAreola(ctx, bsize, ypos)
	{
		ctx.beginPath();
		
		/*Areola */
		ctx.lineWidth = (nipples - 11) / 7;
		if (ctx.lineWidth < 1) ctx.lineWidth = 1;
		else if (ctx.lineWidth > 1.5) ctx.lineWidth = 1.5;
		var a = bsize;
		a = a * 0.9;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = 0;
		if (shoulders < 10) x=shoulders * 6.3;
		else if (shoulders > 20) x = 33;
		else x = 73 - (shoulders * 2);
		var y = nipples / 3;
		if (y < 2) y = 2;
		
		
		if (bsize < 11) {
			ex.areola = {x:60 + (x / 10) - e, y:110 + b + e - (x / 3) + ypos, r: y};
		}
		else if (bsize < 20) {
			var a = bsize-11;
			a = a * 0.9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			ex.areola = {x:59.01 + (x / 10) - b, y:115.94 + a + d - (x / 3) + ypos, r:y};
		} else {
			var a = bsize-20;
			a = a * 0.9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			ex.areola = {x:54.96 + (x / 10) - c, y:125.66 + b - (x / 3) + ypos, r:y};
		}
		ctx.arc(ex.areola.x, ex.areola.y, ex.areola.r, 0 ,Math.PI + Math.PI, false);
	}
	
	function drawNipples(ctx, bsize, ypos)
	{
		ctx.beginPath();
		
		/*Nipples*/
		var a = bsize;
		a = a * 0.9;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = 0;
		if (shoulders < 10) x=shoulders * 6.3;
		else if (shoulders > 20) x = 33;
		else x = 73 - (shoulders * 2);
		var y = nipples / 3.5;
		if (y < 2) y = 2;
		
		if (bsize < 11) {
			ex.nipples = {x:60 + (x / 10) - (e + (e / 2)), y:111 + b + e - (x / 3) + ypos, 
				r:y / 2, startAngle:1 - (nipples / 20), endAngle: 3 + (nipples / 20)};
		}
		else if (bsize < 20) {
			var a = bsize - 11;
			a = a * 0.9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			ex.nipples = {x:60.01 + (x / 10) - (b + (nipples / 10)), y:114.94 + a + d + (nipples / 10) - (x / 3) + ypos, 
				r:y / 2, startAngle:1.3 - (nipples / 20), endAngle:3 + (nipples / 20)};
		} else {
			var a = bsize-20;
			a = a * 0.9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			ex.nipples = {x:55.96 + (x / 10) - (c + (nipples / 10)), y:124.66 + (nipples / 10) + b - (x / 3) + ypos,
				r: y / 2, stargAngle:1.3 - (nipples / 20), endAngle:3 + (nipples / 20)};
		}
		ctx.arc(ex.nipples.x, ex.nipples.y, ex.nipples.r, ex.nipples.startAngle, ex.nipples.endAngle, false);
	}
	
	function drawHead(ctx)
	{
		ctx.beginPath();
		
		ctx.lineWidth = (21 - face) / 10;
		if (ctx.lineWidth < 1.4) ctx.lineWidth = 1.4;
		
		/*Face*/
		var a = face;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var earbottom = 37;

		
		if (a < 11) {
			ctx.moveTo(79, 63 - e);
			ctx.quadraticCurveTo(75, 64 - d, 70 + b, 64 - d);
			ctx.quadraticCurveTo(68, 62 - b, 59, 47 - c);
			ctx.lineTo(59, earbottom);
			ctx.bezierCurveTo(56, earbottom, 55, earbottom - 8, 59, earbottom - 10);
			ctx.quadraticCurveTo(59, 5 + c, 79, 5 + c);
		} else {
			var a = face - 11;
			if (face > 20) a = 9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			var earbottom = 37;
			var z = 0;
			if (face > 20) {
				z = face - 20;
				z = z / 2;
			}
			ctx.moveTo(79,62 - d);
			ctx.quadraticCurveTo(75 + d + d - (z / 3),62 - d, 75 + d + d - (z / 3), 62 - d);
			ctx.quadraticCurveTo(68 - e, 57 + b - z, 59 + d, 44 - c);
			ctx.lineTo(59 + d, earbottom + c);
			ctx.bezierCurveTo(56 + d, earbottom, 55 + d, earbottom-7, 59 + d, earbottom - 10);
			ctx.quadraticCurveTo(59 + d, 8.4 + e, 79, 8.4 + e);
		}
	}
	
	function drawEyes(ctx)
	{
		ctx.beginPath();
		ctx.lineWidth = 1;
		
		/*Eyes*/
		var a = eyes / 6;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = face / 26;
		var y = 27;
		
		ex.eye = {};
		ex.eye.incorner = {x:74,y:35.3};
		ex.eye.out = {x:64.333 + x - eyes/20, y:34.5 - eyes/18 -eyec*0.1};

		ex.eye.in = {x:73.666 + x, y:y + 8.5 -d,
			cp2:{x:71 + x, y: y + 6 - (b + c)*0.5 - 2}};

		if (eyes >= 10) {
			ex.eye.out.y-= eyes*0.01;
			ex.eye.in.cp1 = {x:ex.eye.out.x+1, y: y + 6 - (b + c)*0.7 - 2};			
		}
		else {												
			ex.eye.in.cp1 = {x:65.333 + x, y: y + 6 - (b + c)*0.5 - 2};
		}
		

		ex.eye.out.cp1 = {x:ex.eye.incorner.x-3, y:ex.eye.incorner.y+2};
		ex.eye.out.cp2 = {x:ex.eye.out.x+2, y:ex.eye.out.y+2};

		if (eyes < -14) {	// ultra squinty
			ex.eye.in.cp1 = {x:ex.eye.out.x+3, y: ex.eye.out.y-2};
			ex.eye.in.cp1.y -= eyes/10;
			ex.eye.in.cp2.y -= eyes/10;
		}


		ctx.moveTo(ex.eye.incorner.x, ex.eye.incorner.y);

		ctx.bezierCurveTo(ex.eye.out.cp1.x, ex.eye.out.cp1.y,
			ex.eye.out.cp2.x, ex.eye.out.cp2.y,
			ex.eye.out.x, ex.eye.out.y);

		ctx.bezierCurveTo(ex.eye.in.cp1.x, ex.eye.in.cp1.y,
			ex.eye.in.cp2.x, ex.eye.in.cp2.y, 
			ex.eye.in.x, ex.eye.in.y);	

		ex.eye.tearduct = {x:ex.eye.incorner.x+0.4, y:ex.eye.incorner.y+1.2};
		ctx.lineTo(ex.eye.tearduct.x, ex.eye.tearduct.y);	//73,28)
	}
	
	function drawEyelids(ctx)
	{
		ctx.beginPath();

		/*Eyes*/
		var a = eyes / 6;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = face / 20;
		var y = 27;
		
		ctx.moveTo(ex.eye.out.x, ex.eye.out.y);
		ctx.bezierCurveTo(65.333 + x - a,
											y + 5.5 - 3 - a,
											71 + x + b,
											y + 5.5 -  2 - a,
											ex.eye.in.x,
											ex.eye.in.y);
		ctx.bezierCurveTo(ex.eye.in.cp2.x -eyes/15, ex.eye.in.cp2.y +eyes/10,
			ex.eye.in.cp1.x +eyes/8, ex.eye.in.cp1.y +eyes/10,
			ex.eye.out.x+1, ex.eye.out.y);
		// ctx.lineTo(73 + x, y + 8);	//73,28)
	}
	function drawIris(ctx)
	{
		ctx.beginPath();
		
		var x = face / 20;
		var y = 27 - eyes*0.04;
		
		ex.iris = {x:68.7 + x, y:y + 7.1};
		ctx.arc(ex.iris.x, ex.iris.y, 1.7, 0, Math.PI*2, true);
	}
	function drawEyebrows(ctx) {
		ctx.beginPath();
		ctx.fillStyle = HAIRCOLOR;
		ctx.strokeStyle = HAIRCOLOR;

		ex.eyebrow = {};

		ex.eyebrow.in = {x:ex.eye.in.x, y:ex.eye.in.y -browh};
		ex.eyebrow.out = {x:ex.eye.out.x, y:ex.eye.out.y -browh};
		ctx.moveTo(ex.eyebrow.in.x, ex.eyebrow.in.y);
		ctx.lineTo(ex.eyebrow.out.x, ex.eyebrow.out.y);
	}
	
	function drawLips(ctx)
	{
		ctx.fillStyle = LIPCOLOR;
		ctx.strokeStyle = LIPCOLOR;
		ctx.beginPath();
		
		/*Lips*/
		var a = lips / 2.4;
		if (a < 0.6) a = 0.6;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var y = -0.17;
		
		ex.centermouth = {x:79+lipw*0.1, y:50+liph*0.1 + lipc*0.1}; // positive curl moves it down into :(
		ctx.moveTo(ex.centermouth.x, ex.centermouth.y);

		ex.leftmouth = {x:76 - d -lipw*0.1, y:ex.centermouth.y - (y + (e / 2))};
		ctx.quadraticCurveTo(77 + e, ex.centermouth.y - (e * 1.2) -lipt*0.1 -lipc*0.2, ex.leftmouth.x, ex.leftmouth.y);
		// center to left

		ex.rightmouth = {x:82 + d+lipw*0.1, y:ex.centermouth.y - (y + (e / 2))};
		ctx.quadraticCurveTo(79, ex.centermouth.y + 1.1 + d +lipt*0.1 -lipc*0.1, ex.rightmouth.x, ex.rightmouth.y);
		// left to right

		ctx.quadraticCurveTo(81 - e, ex.centermouth.y - (e * 1.2) -lipt*0.1 -lipc*0.2, ex.centermouth.x, ex.centermouth.y);
		ctx.lineWidth = 2.3 + (lips / 40);
		// right back to center
		
		ctx.stroke();
	}
	
	function drawNose(ctx)
	{
		ctx.beginPath();
		
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		ctx.lineWidth = (21 - face) / 15;
		if (ctx.lineWidth < 1) ctx.lineWidth = 1;
		
		/*Nose*/
		var a = face;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var y = 23;
		
		if (a < 11) {
			ex.topnose = {x:80+noseskew*0.2, y:y+8+e};
			ex.tipnose = {x:83 - e, y:y + 20 - e};
			ex.botnose = {x:80, y:y + 22 - e};

			ctx.moveTo(ex.topnose.x, ex.topnose.y);
			ctx.lineTo(ex.tipnose.x, ex.tipnose.y);
			ctx.lineTo(ex.botnose.x, ex.botnose.y);
		} else{
			var a = face - 11;
			if (face > 20) a = 9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			var z = 0;
			if (face > 20) {
				z = face - 20;
				z = z / 10;
			}
			ex.topnose = {x:80+noseskew*0.2, y:y+8+e};
			ex.tipnose = {x:82 - z, y:y + 19 - (e + z)};
			ex.botnose = {x:80 - e, y:y + 20 - z};

			ctx.moveTo(ex.topnose.x, ex.topnose.y);
			ctx.bezierCurveTo(ex.topnose.x, ex.topnose.y+3,
				ex.tipnose.x-0.4, ex.tipnose.y-0.5,
				ex.tipnose.x, ex.tipnose.y);
			ctx.bezierCurveTo(ex.tipnose.x+0.5, ex.tipnose.y+1,
				ex.botnose.x+0.4, ex.botnose.y+0.3,
				ex.botnose.x, ex.botnose.y);
		}
		ctx.stroke();
	}
	
	function drawHairBack(ctx)
	{
		if (avatar.physique.hairstyle == 0) return;	// Bald
		
		ctx.fillStyle = HAIRCOLOR;
		ctx.strokeStyle = HAIRCOLORB;
		ctx.beginPath();
		
		/*Hairback*/
		var a = hairlength;
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

		ctx.fill();
		ctx.stroke();
	}
	
	function drawHairFront(ctx)
	{
		if (avatar.physique.hairstyle == 0) return;	// Bald
		
		ctx.beginPath();
		
		ctx.fillStyle = HAIRCOLOR;
		ctx.strokeStyle = HAIRCOLORB;
		ctx.lineWidth = 1;
		
		/*Hairfront*/
		var a = hairlength;	
		if (a > 50) a = 50 + (a-50)*0.2; // hairlength over a limit grows much slower
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var x = face / 7;
		
		if (hairlength < 2) {
			var z = (hairlength - 1) * 2;
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
		
		ctx.fill();
		ctx.stroke();
	}
	
	// main drawing functions from top to down
	function drawUpperBody(ctx) {
		// from neck to waist

		ctx.lineWidth = (41 - (shoulders+legs)) / 20;
		if (ctx.lineWidth < 1.4) ctx.lineWidth = 1.4;
		
		/*Neck*/
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
		ex.neck = {};
		ex.shoulder = {};
		ex.elbow = {};
		ex.hand = {};
		ex.wrist = {};
		ex.thumb = {};

		if (a < 11) {
			ctx.moveTo(79, 48);
			ex.neck.top = {x:62 + b + d, y:48};
			ctx.lineTo(ex.neck.top.x, ex.neck.top.y);

			ex.neck.cusp = {x:62 + b + d, y:68 - b};
			ctx.quadraticCurveTo(61 + e + b + d, 58 - b, ex.neck.cusp.x, ex.neck.cusp.y);

			// top of where you can see trapezius muscle
			ex.trapezius = {};
			ex.trapezius.top = {x:62 + b + d, y:58 + b};
			ctx.lineTo(ex.trapezius.top.x, ex.trapezius.top.y);

			ex.collarbone = {x:41 + b, y:72 - d,
				cp1:{x:50 + b, y:64 + b}};
			ctx.quadraticCurveTo(ex.collarbone.cp1.x, ex.collarbone.cp1.y , ex.collarbone.x, ex.collarbone.y);

			if (a < 6) ctx.quadraticCurveTo(39 + b, 70 + d + d, 37 + b, 72 + d);

			/*Outer Arm*/
			ex.shoulder = {x:14 + f, y:110 - (a + d),
				cp1:{x:16 + f, y:74},
				cp2:{x:9 + f + a, y:88 - a}};
			ctx.bezierCurveTo(ex.shoulder.cp1.x, ex.shoulder.cp1.y, 
				ex.shoulder.cp2.x, ex.shoulder.cp2.y,
				ex.shoulder.x, ex.shoulder.y);

			ctx.lineTo(13 + f + e, 100 - d);	// shoulder muscle details (deltoids)

			ex.elbow.out = {x:10 + a + b, y:144 - (d * 3),
				cp1:{x:4 + f + d + d + d, y:127 - b - d},
				cp2:{x:14 + a + e, y:130}};
			ctx.bezierCurveTo(ex.elbow.out.cp1.x, ex.elbow.out.cp1.y, 
				ex.elbow.out.cp2.x, ex.elbow.out.cp2.y, 
				ex.elbow.out.x, ex.elbow.out.y);

			ex.wrist.out = {x:9 + d + d - g, y:211 - (a + d + b),
				cp1:{x:0 + a + b + d - (g / 2), y:160 - b}};
			ctx.quadraticCurveTo(ex.wrist.out.cp1.x, ex.wrist.out.cp1.y, ex.wrist.out.x, ex.wrist.out.y);

			/*Hands*/
			ex.hand.knuckle = {x:20 - ((d*4) + g), y:226 - (b + (d * 4)),
				cp1:{x:13-g, y:223 - (b + b + c)}};
			ctx.quadraticCurveTo(ex.hand.knuckle.cp1.x, ex.hand.knuckle.cp1.y, ex.hand.knuckle.x, ex.hand.knuckle.y);

			ex.hand.tip = {x:26-g, y:222 - (b + c),
				cp1:{x:23 - (d + g), y:223 - (b + d)}};
			ctx.quadraticCurveTo(ex.hand.tip.cp1.x, ex.hand.tip.cp1.y, ex.hand.tip.x, ex.hand.tip.y);
			// up to second joint of fingers

			ex.hand.palm = {x:19 + e-g, y:213 - (b + e),
				cp1:{x:22 + c - g, y:212 + (d - b)}};
			ctx.quadraticCurveTo(ex.hand.palm.cp1.x, ex.hand.palm.cp1.y, ex.hand.palm.x, ex.hand.palm.y);

			// no inner and outer thumb, end point is the thumb tip
			ex.thumb.tip = {x:26 - g, y:222 - (b + c)};
			ctx.lineTo(ex.thumb.tip.x, ex.thumb.tip.y);

			ex.wrist.in = {x:19 + d - g, y:202 - (b + c),
				cp1:{x:32 - g, y:222 - (b + d)}};
			ctx.quadraticCurveTo(ex.wrist.in.cp1.x, ex.wrist.in.cp1.y, ex.wrist.in.x, ex.wrist.in.y);

			/*Inner Arm*/
			ex.ulna = {x:19 + d - g, y:186 + b,
				cp1:{x:17 + d - g, y:195 + b}};
			ctx.quadraticCurveTo(ex.ulna.cp1.x, ex.ulna.cp1.y, ex.ulna.x, ex.ulna.y);

			ex.elbow.in = {x:27 + a, y:150 - (a + d + b),
				cp1:{x:28 + b + d - (g / 2), y:167 - (b + (c * 3))}};
			ctx.quadraticCurveTo(ex.elbow.in.cp1.x, ex.elbow.in.cp1.y, ex.elbow.in.x, ex.elbow.in.y);

			ex.armpit = {x:44 + b + e, y:115 - (a + a),
				cp1:{x:40, y:140 - a}};
			ctx.quadraticCurveTo(ex.armpit.cp1.x, ex.armpit.cp1.y, ex.armpit.x, ex.armpit.y);

			ex.trapezius.bot = {x:39 + (b + c), y:132 - (f + b + d)};
			ctx.lineTo(ex.trapezius.bot.x, ex.trapezius.bot.y);
			var h = 0;
			if (waist < 0) h = waist * -0.5;

			ex.waist = {x:47 + (c * 3) - (h / 4), y:149 - (h + a),
				cp1:{x:43 + (c * 3), y:145 - (h + a + b)}};
			ctx.quadraticCurveTo(ex.waist.cp1.x, ex.waist.cp1.y, ex.waist.x, ex.waist.y);
			
		} else {
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
			z = g / 2;
			x = a;
			y = x / 2;
			var m = 0;
			if (shoulders > 10) m = (shoulders - 10) / 20;
			ctx.moveTo(79, 48);

			ex.neck.top = {x:69, y:48};
			ctx.lineTo(ex.neck.top.x, ex.neck.top.y);

			ex.neck.cusp = {x:69, y:63, cp1:{x:69,y:53}};
			ctx.quadraticCurveTo(ex.neck.cusp.cp1.x, ex.neck.cusp.cp1.y, ex.neck.cusp.x, ex.neck.cusp.y);

			ex.collarbone = {x:46 + a, y:70 + b, cp1:{x:55+c, y:69+c}};
			ctx.quadraticCurveTo(ex.collarbone.cp1.x, ex.collarbone.cp1.y, ex.collarbone.x, ex.collarbone.y);
			// up to middle of shoulder, about collar bone distance

			/*Outer Arm*/
			ex.shoulder = {x:34 + d + m + m + m, y:97,
				cp1:{x:36 + m, y:74 + a + e},
				cp2:{x:40 + m, y:77 + a}};
			ctx.bezierCurveTo(ex.shoulder.cp1.x, ex.shoulder.cp1.y, 
				ex.shoulder.cp2.x, ex.shoulder.cp2.y,
				ex.shoulder.x, ex.shoulder.y);
			// shoulder up to outside of upper arm
			ex.elbow.out = {x:24 + b + m + m + b, y:138,
				cp1:{x:28 + m + m + m + d + b, y:115}};
			ctx.quadraticCurveTo(ex.elbow.out.cp1.x, ex.elbow.out.cp1.y, ex.elbow.out.x, ex.elbow.out.y);
			// down to outside of elbow

			ex.wrist.out = {x:14 + x + m + m + c + b-g, y:193 - z,
				cp1:{x:17 + a + c + m + m + m + b - (g / 2), y:155 - z}};
			ctx.quadraticCurveTo(ex.wrist.out.cp1.x, ex.wrist.out.cp1.y, ex.wrist.out.x, ex.wrist.out.y);
			// down to outside of wrist

			/*Hands*/
			ex.hand.knuckle = {x:15 + x + y + (y/3) - (g + z), y:213 - (b + z),
				cp1:{x:16 + x + y + (y/4) - (g + z), y:209 - (b + z)}};
			ctx.quadraticCurveTo(ex.hand.knuckle.cp1.x, ex.hand.knuckle.cp1.y, ex.hand.knuckle.x, ex.hand.knuckle.y);
			// down to middle of the back of the hand

			ex.hand.tip = {x:29 + x + y + (y/1.2) - (a + b + g + z + (z / 3)), y:214 + a - z,
				cp1:{x:21 + x + y + (y/1.2) - (a + b + g + z + (z / 10)), y:216 + b - (z/10)}};
			ctx.quadraticCurveTo(ex.hand.tip.cp1.x, ex.hand.tip.cp1.y, ex.hand.tip.x, ex.hand.tip.y);
			// down to tip of hand

			ex.hand.palm = {x:23 + x + (y * 1.5) - (b + g + z), y:207 - (e + z),
				cp1:{x:28 + x + y - (g + z), y:209 - z}};
			ctx.quadraticCurveTo(ex.hand.palm.cp1.x, ex.hand.palm.cp1.y, ex.hand.palm.x, ex.hand.palm.y);

			ex.thumb.in = {x:29 + x + (y*1.5) - (a + g + z), y:214 - (b + c + z)};
			ctx.lineTo(ex.thumb.in.x, ex.thumb.in.y);
			ex.thumb.out = {x:23 + x + y + c - (g + (z/2)), y:194 + a + d - z,
				cp1:{x:35 + x + y - (a + e + g + z), y:215 + e - z}};
			ex.wrist.out = ex.thumb.out;	// actually the same place from this perspective
			ctx.quadraticCurveTo(ex.thumb.out.cp1.x, ex.thumb.out.cp1.y, ex.thumb.out.x, ex.thumb.out.y);
			// past the thumb

			/*Inner Arm*/
			ex.ulna = {x:22 + (x / 2) + b + b + a - (g / 2), y:191 - (f + z),
				cp1:{x:22 + x + a - (d + g), y:200 - z}};
			ctx.quadraticCurveTo(ex.ulna.cp1.x, ex.ulna.cp1.y, ex.ulna.x, ex.ulna.y);
			// halfway up forearm

			ex.elbow.in = {x:38 + b + d + b + d, y:132,
				cp1:{x:35 + c + b + b + c - ((x / 4)), y:153 - b}};
			ctx.quadraticCurveTo(ex.elbow.in.cp1.x, ex.elbow.in.cp1.y, ex.elbow.in.x, ex.elbow.in.y);
			// slightly past elbow on its way up
			ctx.lineTo(50 + d - e, 95 + (c * 3));
			ex.armpit = {x:46 + d + d + e, y:108 + b};
			ctx.lineTo(ex.armpit.x, ex.armpit.y);
			var h = 0;
			if (waist < 0) h = waist * -0.5;

			ex.waist = {x:56 - (d + (h / 4)) +legl*0.1 +waist*0.1, 
				y:138 - (b + h) - legl*0.5,
				cp1:{x:52 + d +legl*0.05 +waist*0.1, y:129 -h -legl}};
			ctx.quadraticCurveTo(ex.waist.cp1.x, ex.waist.cp1.y, ex.waist.x, ex.waist.y);
			// down to narrowest part of waist
		}		
	}
	function drawMidBody(ctx) {
		// from waist to hipbones
		/*Waist*/
		var a = 0;
		if (shoulders < 11) {
			a = (11 - shoulders);
			if (waist < 1) {
				a+=waist / 4;
				if (a<0) a = 0;
			}
		}
		var b = (hips + ass) * 3;
		// if (ass > 20) b += (ass - 20) * 8;
		var c = waist / 3;
		if (c < -5) c = -5;
		var d = hips / 2;
		if (hips > 20) d = 10;
		var f = 0;
		
		var y = b;
		if (y > 100) y = 100;

		ex.hipbone = {x:50.3 + (c / 2) - ((a / 2) + (b/20) + (f / 2)),
			y:175 - ((y / 22) + d) - legl,
			cp1:{x:53 + c - ((a / 1.2) + (y / 40.7) + (b / 60)), y:145 + (c / 5) + (y / 27.5) + legl*0.2},
			cp2:{x:52 + c - ((a / 1.6) + (f / 2) + (b / 40)), y:161 - ((y / 6.875)) -legl}};
		ctx.bezierCurveTo(ex.hipbone.cp1.x, ex.hipbone.cp1.y,
			ex.hipbone.cp2.x, ex.hipbone.cp2.y,
		 	ex.hipbone.x, ex.hipbone.y);
		// down to hips at belly button level		
	}

	function drawOuterThigh(ctx) {
		// starting from hipbone all the way to top outer ankle
		ex.calf = {};
		if (legs < 11) {
			ex.kneepit = {x:36 + legs*0.833, y:269 + legs*0.6 -legl*0.6,
				cp1:{x:25 + legs*1.833 - hips*0.818, y:227 -legs*1.5 -hips*0.364 -ass/10}};
			ex.calf.out = {x:34 + legs*0.4, y:319 +legs*1.2 -legl*0.6,
				cp1:{x:26 + legs, y:307 - legs/3}};
		}
		else {
			var a = 9;
			if (legs <= 20) a = legs - 11;
			a = a * 0.8;
			var z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}

			ex.kneepit = {x:44 + a*2.1, y:275 -legl*0.6,
				cp1:{x:43.3 - (a*0.533 + hips*0.818 + z), y:202 + z - hips*0.364 -ass/10}};
			// from hip down to back of knee
			ex.calf.out = {x:38 + a*2.7, y:332 -legl*0.1,
				cp1:{x:36 + a*2.33 - hips/5.5, y:304 -a -hips/5.5}};
		}	

		// actual drawing after defining draw points
		ctx.quadraticCurveTo(ex.kneepit.cp1.x, ex.kneepit.cp1.y, ex.kneepit.x, ex.kneepit.y);
		ctx.quadraticCurveTo(ex.calf.out.cp1.x, ex.calf.out.cp1.y, ex.calf.out.x, ex.calf.out.y);
	}

	function drawLegs(ctx)
	{
		// starting from top outer ankle all the way to pelvic region
		ex.ankle = {};
		ex.toe = {};
		if (legs < 11) {
			ex.ankle.outtop = {x:41 - legs/3, y:354 - legs/3 -legl*0.1,
				cp1:{x:34 + legs*0.4, y:335 + legs/3}};

			ex.ankle.out = {x:41 - legs/5, y:365 - legs/10,
				cp1:{x:42 - legs/3, y:360 - legs/3}};

			ex.ankle.outbot = {x:41 - legs/5, y:370 - legs/3,
				cp1:{x:39 - legs/10, y:367 - legs/5}};

			/*Foot*/
			ex.toe.out = {x:29 +legs/10, y:388 -legs*0.4,
				cp1:{x:34 +legs/5, y:386 - legs*1.33}};

			ex.toe.in = {x:59 -legs*0.7, y:389 -legs/3,
				cp1:{x:43 -legs/3, y:394 -legs/3}};
			// wearing heels
			if (shoeheight >= 3) {
				ex.toe.in.cp1.y += 10;
			}
				
 			ex.ankle.in = {x:53 - legs/2, y:371 -legs/3,
 				cp1:{x:54 - legs*0.6, y:380 - legs/3}};

			ex.ankle.intop = {x:53 -legs/3, y:363 -legs/5 -legl*0.6,
				cp1:{x:56 -legs/2, y:366 -legs/5}};

			ex.calf.in = {x:54 -legs*0.4, y:342 +legs};

			// inverted with feminine legs as knee pit is on the inside rather than outside (will still call this kneecap for consistency)
			ex.kneecap = {x:61 +legs/10, y:276 -legs -legl*0.6,
				cp1:{x:64, y:308 -legs},
				cp2:{x:67 -legs, y:297 -legs}};

			ex.groin = {x:78 -legs/5, y:205 -legs/5 -legl*1.1,
				cp1:{x:78 -legs*0.7, y:230 +legs/3}};

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
			var a = 9;
			if (legs <= 20) a = legs - 11;
			a = a * 0.8;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			var f = hips / 5.5;
			var g = f * (a / 9);
			var z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}

			ex.ankle.outtop = {x:38 + e + (a + b + b + d + b), y:351 -legl*0.1,
				cp1:{x:37 + e + (a + b + b + d + b), y:338}};
			ctx.quadraticCurveTo(ex.ankle.outtop.cp1.x, ex.ankle.outtop.cp1.y, ex.ankle.outtop.x, ex.ankle.outtop.y);

			ex.ankle.out = {x:39 + (a + b + b + d + b), y:364, 
				cp1:{x:38 + (a + b + b + d + b), y:357}};
			ctx.quadraticCurveTo(ex.ankle.out.cp1.x, ex.ankle.out.cp1.y, ex.ankle.out.x, ex.ankle.out.y);

			/*Foot*/
			if (shoeheight < 3) {	// not wearing heels
				ctx.quadraticCurveTo(38 + (a + b + b + d + b), 365, 39 + (a + b + b + d + b), 367);
				ex.toe.out = {x:30 + (a + a + b + d + b), y:384};
				ctx.quadraticCurveTo(36 + (a + a + b + d + b), 372, ex.toe.out.x, ex.toe.out.y);
				// down to outer toes
				ctx.quadraticCurveTo(32 + (a + a + b + d + b), 386, 33 + (a + a + b + d + b), 387);
				ex.toe.in = {x:52 + (a + a + b + d + b), y:386};
				ctx.quadraticCurveTo(40 + (a + a + b + d + b), 391, ex.toe.in.x, ex.toe.in.y);
				// to inner toes
				ctx.quadraticCurveTo(54 + (a + a + b + d + b), 384, 52 + (a + a + b + d + b), 381);

				ex.ankle.in = {x:49 + (a + a + b + d + b),y:368};
				ctx.quadraticCurveTo(49 + (a + a + b + d + b), 377, ex.ankle.in.x, ex.ankle.in.y);
				// inner ankle
				ex.ankle.intop = {x:50 + (a + a + b + b + c), y:361};
				ctx.quadraticCurveTo(50 + (a + a + b + b + c), 364, ex.ankle.intop.x, ex.ankle.intop.y);
				ctx.lineTo(50 + b + (a + b + c + b), 353 - a);
			}
			else {
				// bottom ankle bone
				ex.ankle.outbot = {x:ex.ankle.out.x, y:ex.ankle.out.y+5};
				ctx.quadraticCurveTo(ex.ankle.outbot.x-1, ex.ankle.outbot.y-1.5,
					ex.ankle.outbot.x, ex.ankle.outbot.y);

				var legaddition = legs;
				if (legaddition > 30) legaddition = 30;

				// higher heels will cause foot to appear narrower
				ex.toe.out = {x:ex.ankle.out.x-2+shoeheight*0.2+legaddition*0.1, y:ex.ankle.out.y+12+shoeheight*2};
				ex.toe.in = {x:ex.toe.out.x+14-shoeheight*0.2, y:ex.toe.out.y};
				ex.ankle.in = {x:49 + (a + a + b + d + b)*0.95, y:368};
				ex.ankle.intop = {x:ex.ankle.in.x-1,y:ex.ankle.in.y-5};
				
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
			ex.kneecap = {x:63 + a + b + e + b, y:265 -legl*0.6,
				cp1:{x:64 +a*2.6, y:297 -a},
				cp2:{x:56 +a*2.1, y:296}};
			ctx.bezierCurveTo(ex.kneecap.cp1.x, ex.kneecap.cp1.y, ex.kneecap.cp2.x, ex.kneecap.cp2.y, ex.kneecap.x, ex.kneecap.y);

			ex.topkneecap = {x:ex.kneecap.x, y:ex.kneecap.y-4};
			ctx.quadraticCurveTo(63 + a + b + e + b, 262, ex.topkneecap.x, ex.topkneecap.y);

			// up to corner of inner thigh
			ex.groin = {x:75 + d, y:203 -legl*1.1,
				cp1:{x:71 + a + b + (z / 3), y:233 + (z / 3) - b}};
			ctx.quadraticCurveTo(ex.groin.cp1.x, ex.groin.cp1.y, ex.groin.x, ex.groin.y);
			ctx.quadraticCurveTo(79, 204-legl*1.1, 79, ex.groin.y);
		}
	}
	
	function drawHalfFigure1(ctx)
	{
		ctx.fillStyle = SKINC;
		ctx.strokeStyle = SKINCB;

		// base body stroke and fill
		ctx.beginPath();
		drawUpperBody(ctx);
		drawMidBody(ctx);
		drawOuterThigh(ctx);
		drawLegs(ctx);
		ctx.fill();
		ctx.stroke();


		drawHead(ctx);
		ctx.fill();
		ctx.stroke();
		drawAbs(ctx);
		ctx.stroke();
		drawPecs(ctx);
		ctx.stroke();
		// close up the shape so we can cover over the abs
		if (ex.hasOwnProperty("inpecs")) {
			ctx.lineTo(79, ex.inpecs.y);
			ctx.lineTo(79, ex.inpecs.y-30);
		}
		else if (ex.hasOwnProperty("botpecs")) {
			ctx.lineTo(79, ex.botpecs.y);
			ctx.lineTo(79, ex.botpecs.y-40);
		}
		// ctx.fillStyle = "black";
		ctx.fill();


		drawLegMuscles(ctx);
		ctx.stroke();

		ctx.save();
		// highlight hips and thighs if thick
		var hipthick = ((hips * 3) + ass) / 4;
		if (hipthick > 17) {
			ctx.lineWidth = hipthick / 17;
			ctx.beginPath();
			ctx.moveTo(ex.waist.x, ex.waist.y);
			drawMidBody(ctx);
			ctx.stroke();
		}
		if (hipthick > 14) {
			ctx.lineWidth = hipthick / 14;
			ctx.beginPath();
			ctx.moveTo(ex.hipbone.x, ex.hipbone.y);
			drawOuterThigh(ctx);
			ctx.stroke();
		}
		ctx.restore();


		ctx.save();
		ctx.fillStyle = EYECOLOR;
		drawEyes(ctx);
		ctx.fill();
		ctx.clip();
		ctx.fillStyle = IRISCOLOR;
		drawIris(ctx);
		ctx.fill();
		ctx.restore();

		// strokes for eyes
		ctx.strokeStyle = EYELINER;
		drawEyes(ctx);
		ctx.stroke();
		ctx.fillStyle = EYELINER;
		drawEyelids(ctx);
		ctx.fill();

		drawEyebrows(ctx);
		ctx.stroke();
		ctx.fill();
	}
	
	function drawHalfFigure2(ctx)
	{
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		drawPregs(ctx);
		ctx.fill();
		drawPregs(ctx);
		ctx.stroke();
		
		for (var i = avatar.physique.breastrows; i > 0; i--) {
			var sz = breasts * (1.0 - (i * 0.1));
			if (sz < (breasts / 2)) sz = breasts / 2;
			var pos = (18 - i) * i;
			if (pos < 4) pos = 4;
			drawBoobs(ctx, sz, pos, i);
		}
		drawBoobs(ctx, breasts, 0, 0);
		
		
	}
	

	// start of main function (above are all helper definitions)
	var canvas = document.getElementById(canvasname);

	// can't find canvas
	if (typeof canvas === 'undefined') {
		alert("can't find canvas with name " + canvasname);
		return;
	}

	// define stats
	var missingData = false;
	if (!passThrough)
		avatar.calcPhysique();
	var stats = avatar.physique;

	// NECESSARY properties for avatar.physique
	var height = typeof stats["height"] !== 'undefined' ? stats["height"] : missingData = true; 
	var face = typeof stats["face"] !== 'undefined' ? stats["face"] : missingData = true;
	var eyes = typeof stats["eyes"] !== 'undefined' ? stats["eyes"] : missingData = true;
	var irisc = typeof stats["irisc"] !== 'undefined' ? stats["irisc"] : missingData = true;
	var lips = typeof stats["lips"] !== 'undefined' ? stats["lips"] : missingData = true;
	var skin = typeof stats["skin"] !== 'undefined' ? stats["skin"] : missingData = true;
	var hairlength = typeof stats["hairlength"] !== 'undefined' ? stats["hairlength"] : missingData = true;
	var hairc = typeof stats["hairc"] !== 'undefined' ? stats["hairc"] : missingData = true;
	var shoulders = typeof stats["shoulders"] !== 'undefined' ? stats["shoulders"] : missingData = true;
	var breasts = typeof stats["breasts"] !== 'undefined' ? stats["breasts"] : missingData = true;
	var nipples = typeof stats["nipples"] !== 'undefined' ? stats["nipples"] : missingData = true;
	var testes = typeof stats["testes"] !== 'undefined' ? stats["testes"] : missingData = true;
	var penis = typeof stats["penis"] !== 'undefined' ? stats["penis"] : missingData = true;
	var waist = typeof stats["waist"] !== 'undefined' ? stats["waist"] : missingData = true;
	var hips = typeof stats["hips"] !== 'undefined' ? stats["hips"] : missingData = true;
	var ass = typeof stats["ass"] !== 'undefined' ? stats["ass"] : missingData = true;
	var legs = typeof stats["legs"] !== 'undefined' ? stats["legs"] : missingData = true;
	
	// NECESSARY properties for avatar.Mods idiosyncracies to give variation to characters (an identity)
	var id = avatar.Mods;
	var lipw = typeof id["lipw"] !== 'undefined' ? id["lipw"] : missingData = true;
	var lipt = typeof id["lipt"] !== 'undefined' ? id["lipt"] : missingData = true;
	var liph = typeof id["liph"] !== 'undefined' ? id["liph"] : missingData = true;
	var lipc = typeof id["lipc"] !== 'undefined' ? id["lipc"] : missingData = true;
	var legl = typeof id["legl"] !== 'undefined' ? id["legl"] : missingData = true;
	var eyec = typeof id["eyec"] !== 'undefined' ? id["eyec"] : missingData = true;
	var noseskew = typeof id["noseskew"] !== 'undefined' ? id["noseskew"] : missingData = true;
	var penist = typeof id["penist"] !== 'undefined' ? id["penist"] : missingData = true;
	var browh = typeof id["browh"] !== 'undefined' ? id["browh"] : missingData = true;

	// DRAW POINTS defined (x,y) for specific body points so we have unified calculations
	// these are calculated once in a core function and then referenced in other functions
	// they are the exported physical parameters and are defined in their respective draw functions
	var ex = {};

	// everything is well defined and canvas is supported (if not then don't do anything)
	if (missingData || !canvas.getContext) {
		alert("Drawing figure but some statistics are not defined!");
		return;
	}

	var ctx = canvas.getContext("2d");
	var ctx = new Context2DTracked(canvas.getContext("2d"));

	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// prevent canvas from shrinking...
	canvas.width = canvas.width;
	var SKINC = "black";
	var SKINCB = "black";
	var LIPCOLOR = "black";
	var HAIRCOLOR = "black";
	var HAIRCOLORB = "black";
	var EYECOLOR = "white";
	var IRISCOLOR = "brown";
	var EYELINER = "black";
	var NIPPLESHADOW = "black";
	
	// if they're NaN then we assume they are in a postprocessed form already and it's safe to directly assign
	if (isNaN(irisc)) {
		IRISCOLOR = irisc;
	} else if (irisc < 11) {
		IRISCOLOR = "rgb(" + Math.floor(92 - (irisc*5.2)) + "," + Math.floor(64 + (irisc*5.1)) + "," + Math.floor(51 - (irisc*1.1)) + ")";
	}	else if (irisc < 100) {
		var a = irisc - 10;
		IRISCOLOR = "rgb(" + Math.floor(40 + (a * 4.9)) + "," + Math.floor(115 - (a * 2.6)) + "," + Math.floor(40 + (a * 13.1)) + ")";
	}
	
	if (isNaN(skin)) {
		SKINC = skin;
		SKINCB = skin;
		LIPCOLOR = skin;
		NIPPLESHADOW = skin;
		EYELINER = SKINCB;
	} else if (skin < 11) {
		SKINC = "rgb(" + Math.floor(255 - (skin*2.8)) + "," + Math.floor(214 - (skin*5.3)) + "," + Math.floor(180 - (skin*6.5)) + ")";
		SKINCB = "rgb(" + Math.floor(214 - (skin*5.1)) + "," + Math.floor(156 - (skin*4)) + "," + Math.floor(147 - (skin*6.4)) + ")";
		LIPCOLOR = "rgb(" + Math.floor(194 - (skin*4.1)) + "," + Math.floor(123 - (skin*4.1)) + "," + Math.floor(119 - (skin*4.1)) + ")";
		NIPPLESHADOW = "rgb(" + Math.floor(140 - (skin*4.1)) + "," + Math.floor(89 - (skin*4.1)) + "," + Math.floor(86 - (skin*4.1)) + ")";
		EYELINER = "rgb(" + Math.floor(128 - (skin*2.6)) + "," + Math.floor(91 - (skin*2.3)) + "," + Math.floor(65 - (skin*1.8)) + ")";
	}	else if (skin < 100) {
		var a = skin - 11;
		SKINC = "rgb(" + Math.floor(227 - (a * 9.6)) + "," + Math.floor(161 - (a * 9.1)) + "," + Math.floor(115 - (a * 6.3)) + ")";
		if (skin > 28) a = a - ((skin - 23) * 2.5);	// change colours to lighter so we do not get black on near black effects
		SKINCB = "rgb(" + Math.floor(163 - (a * 12)) + "," + Math.floor(116 - (a * 10.8)) + "," + Math.floor(83 - (a * 7.3)) + ")";
		LIPCOLOR = "rgb(" + Math.floor(153 - (a * 8.9)) + "," + Math.floor(82 - (a * 6.2)) + "," + Math.floor(78 - (a * 6.4)) + ")";
		NIPPLESHADOW = "rgb(" + Math.floor(99 - (a * 9.9)) + "," + Math.floor(48 - (a * 7.2)) + "," + Math.floor(45 - (a * 7.4)) + ")";
		EYELINER = "rgb(" + Math.floor(102 - (a * 8.9)) + "," + Math.floor(68 - (a * 6.6)) + "," + Math.floor(47 - (a * 4.4)) + ")";
	} else if (skin == 100) {
		SKINC = "rgb(211,130,136)";
		SKINCB = "rgb(184,45,45)";
		LIPCOLOR = SKINCB;
		NIPPLESHADOW = SKINCB;
		EYELINER = SKINCB;
	} else if (skin == 101) {
		SKINC = "rgb(174,187,254)";
		SKINCB = "rgb(32,40,64)";
		LIPCOLOR = SKINCB;
		NIPPLESHADOW = SKINCB;
		EYELINER = SKINCB;
	} else if (skin == 102) {
		SKINC = "rgb(114,224,114)";
		SKINCB = "rgb(82,115,84)";
		LIPCOLOR = SKINCB;
		NIPPLESHADOW = SKINCB;
		EYELINER = SKINCB;
	}
	
	if (isNaN(hairc)) {
		HAIRCOLOR = hairc;
		HAIRCOLORB = hairc;
	} else if (hairc < 0) {	// jet black
		HAIRCOLOR = "black";
		HAIRCOLORB = "rgb(" + Math.floor(30+hairc) + "," + Math.floor(30+hairc) + "," + Math.floor(50+hairc) + ")";
	} 	else if (hairc < 6) {
		HAIRCOLOR = "rgb(" + Math.floor(36 + (hairc * 17.2)) + "," + Math.floor(7 + (hairc*10.6)) + "," + Math.floor(11 + (hairc*8.8)) + ")";
		HAIRCOLORB = "rgb(" + Math.floor(0 + (hairc * 11.8)) + "," + Math.floor(0 + (hairc*5.8)) + "," + Math.floor(0 + (hairc*5.2)) + ")";
	}	else if (hairc < 11) {
		var a = hairc - 6;
		HAIRCOLOR = "rgb(" + Math.floor(122 + (a * 8.2)) + "," + Math.floor(60 - (a * 12)) + "," + Math.floor(55 - (a * 10.8)) + ")";
		HAIRCOLORB = "rgb(" + Math.floor(59 + (a * 8.6)) + "," + Math.floor(29 - (a * 5.8)) + "," + Math.floor(26 - (a * 5)) + ")";
	}	else if (hairc < 16) {
		var a = hairc - 11;
		HAIRCOLOR = "rgb(" + Math.floor(163 + (a * 11.8)) + "," + Math.floor(0 + (a * 37.6)) + "," + Math.floor(1 + (a * 30.4)) + ")";
		HAIRCOLORB = "rgb(" + Math.floor(102 + (a * 11.2)) + "," + Math.floor(0 + (a * 26.8)) + "," + Math.floor(1 + (a * 21.6)) + ")";
	}	else if (hairc < 40) {
		var a = hairc - 16;
		HAIRCOLOR = "rgb(" + Math.floor(222 + (a * 5.8)) + "," + Math.floor(188 + (a * 12.6)) + "," + Math.floor(153 + (a * 6.2)) + ")";
		HAIRCOLORB = "rgb(" + Math.floor(158 + (a * 6.2)) + "," + Math.floor(134 + (a * 5.8)) + "," + Math.floor(109 + (a * 0.4)) + ")";
	}	else {
		var a = hairc - 40;
		HAIRCOLOR = "white";
		// varying shades of grey to look silver
		HAIRCOLORB = "rgb(" + Math.floor(255-a) + "," + Math.floor(255-a) + "," + Math.floor(118+a) + ")";	
	}

	// use as much of the space as necessary
	// use the minimum scaling from x and y, then take the rest as offset
	var sx = canvas.width/180,
		sy = canvas.height/400;
	var scaling = Math.min(sx,sy);
	ctx.scale(scaling, scaling);

	var ox = Math.floor(canvas.width/scaling - canvas.width/sx);
	var oy = Math.floor(canvas.height/scaling - canvas.height/sy);


	// adjust height (shoes)
	var shoeheight = avatar.heightAdjust();
	ex.shoeheight = shoeheight;

	var heightread = (height * 0.7) + 60 + shoeheight;	// in inches
	// taller if you have low face (masculine?)
	if (face < 10) heightread += ((11 - face) / 10);
	var heightft = "" + Math.floor(heightread / 12) + "\'";
	var heightin = "" + Math.floor(heightread - (Math.floor(heightread / 12) * 12)) + "\"";
	// print imperial height
	heightread = heightft + heightin;
	ctx.font = "12px Arial";
	ctx.fillText(heightread, 125+ox, 16);

	heightread = (height * 0.7) + 60;	// unadjusted
	heightft = "" + Math.floor(heightread / 12) + "\'";
	heightin = "" + Math.floor(heightread - (Math.floor(heightread / 12) * 12)) + "\"";
	heightread = heightft + heightin;
	ctx.fillText("("+heightread+")", 150+ox, 16);


	// print other info
	ctx.font = "bold 20px Arial";
	ctx.fillText(avatar.isFutanari() ? String.fromCharCode(0x26a5) : avatar.isMale() ? String.fromCharCode(0x2642) : String.fromCharCode(0x2640), 6, 24);
	ctx.font = "18px Arial";
	ctx.fillText(avatar.name, 30, 24);

	// draw height measurement bar on the right
	ctx.beginPath();
	var pos = 20+ox;
	ctx.moveTo(130 + pos, 20);
	ctx.lineTo(158 + pos, 20);
	ctx.lineTo(158 + pos, 390+oy);
	var dashes = 370 / 72;
	var numdashes = Math.floor(72 + oy / dashes);
	var i = 1;
	for (i = 1; i < numdashes; i++) {
		var v = 390 + oy - (i * dashes);
		ctx.moveTo(158 + pos,v);
		if (i % 12 == 0) ctx.lineTo(144 + pos,v);
		else if (i % 6 == 0) ctx.lineTo(151 + pos,v);
		else if (i % 3 == 0) ctx.lineTo(153 + pos,v);
		else ctx.lineTo(155 + pos,v);
	}
	ctx.stroke();
	
	// height adjustment
	var heightheight = (height*.0095) + 0.81;
	var heightscale = 1 - ((30 - height) / 250);
	var heightoffset = (0.3 * (30 - height)) + 4;
	ctx.translate(heightoffset+ox, 400 - (heightheight * 400)+oy -shoeheight*2);	// TODO does shoeheight scale correctly?
	ctx.scale(heightscale, heightheight);
	
	// before anything gets drawn, draw anything behind back (wings?)
	avatar.drawAdditional(ctx, ex, "behindback");	

	// Draw hair
	drawHairBack(ctx);
	
	// Draw left side, part 1
	drawHalfFigure1(ctx);
	
	// Draw right side, part 1
	reflectHorizontal(ctx);
	drawHalfFigure1(ctx);
	
	ctx.translate(0, 0);
	
	// Draw central/common parts of the body, part 1
	// translate for leg proportional
	drawMons(ctx);
	ctx.fill();
	ctx.stroke();
	
	avatar.drawAdditional(ctx, ex, "undergenitals");

	reflectHorizontal(ctx);
	drawBellyButton(ctx);
	drawGenitals(ctx);


	// before breasts are drawn
	avatar.drawAdditional(ctx, ex, "underbreasts");

	// Draw left side, part 2
	drawHalfFigure2(ctx);
	
	// Draw right side, part 2
	reflectHorizontal(ctx);
	drawHalfFigure2(ctx);
	


	ctx.translate(0,0);
	
	// Draw central/common parts of the body, part 2
	reflectHorizontal(ctx);
	drawNose(ctx);
	drawCleavage(ctx);

	drawLips(ctx);


	// things to render under hair
	avatar.drawAdditional(ctx, ex, "underhair");

	// in the future the reflection will happen in the hairstyle drawer since some styles may be asymmetric
	drawHairFront(ctx);
	reflectHorizontal(ctx);
	drawHairFront(ctx);

	// more exports
	ex.ox = ox;
	ex.oy = oy;
	ex.scaling = scaling;
	ex.sx = sx;
	ex.sy = sy;

	reflectHorizontal(ctx);

	avatar.drawAdditional(ctx, ex, "afterall");
};

return da;
}(da || {}));
