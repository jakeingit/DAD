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

var drawPoints = da.drawPoints = function(ctx) {
	// given ctx and a list of points, draw points between them based on how many control points are defined for each
	// does not begin a path or fill or stroke (just moves pen between the points)
	if (arguments.length < 2) return;	// not enough points to draw
	var startPoint = arguments[1];	// first argument is ctx
	// if null is passed through, just continue from last location
	if (startPoint) {
		ctx.moveTo(startPoint.x, startPoint.y);
	}
	// for every point after
	for (var i = 2, len = arguments.length; i < len; ++i) {
		var p = arguments[i];
		// allow calls with nonexistent points so that different drawing modes can be consolidated
		if (!p) {
			// console.log("don't have point #", i);
			continue;
		}
		if (p.hasOwnProperty("cp2")) {
			ctx.bezierCurveTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, p.x, p.y, p.traceSize);
		}
		else if (p.hasOwnProperty("cp1")) {
			ctx.quadraticCurveTo(p.cp1.x, p.cp1.y, p.x, p.y, p.traceSize);
		}
		else {
			ctx.lineTo(p.x, p.y);
		}
	}
};

var tracePoint = da.tracePoint = function(point, radius) {
	// add a trace to a drawpoint when giving to da.drawPoints function
	return Object.assign({traceSize:radius},point);
};

da.averageQuadratic = function(ctx, p1, p2, t, dx, dy, st, et) {
	// draw a smooth quadratic curve with the control point t along the straight line from p1 to p2
	// disturbed with dx and dy if applicable
	if (!t) t = 0.5;
	if (!dx) dx = 0;
	if (!dy) dy = 0;
	var cp1 = {x:p1.x*t+p2.x*(1-t)+dx, y:p1.y*t+p2.y*(1-t)+dy};
	// start time not the default value of 0
	if (st) {
		var sp = da.splitQuadratic({p1:p1,p2:p2,cp1:cp1},st);
		p1 = sp.left.p2;
		cp1 = sp.right.cp1;
		ctx.moveTo(p1.x, p1.y);
	}
	if (et) {
		var sp = da.splitQuadratic({p1:p1,p2:p2,cp1:cp1},et);
		p2 = sp.left.p2;
		cp1 = sp.left.cp1;
	}
	ctx.quadraticCurveTo(cp1.x, cp1.y, p2.x, p2.y);
	return cp1;
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
	// if given a canvas object, just return it
	if (typeof canvasName !== "string")
		return canvasName;

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
			if (s === "width" || s === "height") {
				canvas.style[s] = styles[s]+"px";
			}
			else if (styles.hasOwnProperty(s)) {
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



da.drawNail = function(ctx, pt, w, h, rot) {
	rot = rot || 0;
	ctx.save();
	ctx.translate(pt.x,pt.y);
	ctx.rotate(rot);
	ctx.moveTo(0,0);
	ctx.bezierCurveTo(-w, -h, +w, -h, 0, 0);
	ctx.fill();
	ctx.restore();
	ctx.translate(0,0);
};

// anything defined on da (the module) is exported
da.drawfigure = function(canvasname, avatar, passThrough) {
	// canvas name is the string id of the canvas element to draw to
	// if it's not a string, we assume it's the actual canvas passed in

	function drawGenitals(ctx)
	{
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		drawTestes(ctx);
		var hasc = avatar.hasCock();
		
		var ev = avatar.physique.genitals - (Math.floor(avatar.physique.genitals / 2) * 2);
		for (var i = avatar.physique.genitals; i > 0; i--) {
			var evi = i - (Math.floor(i / 2) * 2);
			var ab = (evi == 1) ? 10 : -10;
			var ang = ev == 1 ? ab * Math.floor(i / 2) : ab * Math.floor((i + 1) / 2);
			drawPenis(ctx, ang, penis, hasc);
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

		ex.penis = {};
		ex.penis.tip = {x:79, y:ex.mons.tip.y+size*6.5};

		var translatedtipy = ex.penis.tip.y-ex.mons.tip.y;


		ctx.beginPath();
		// shaft
		ex.leftheadpenis = {x:ex.penis.tip.x-size*0.8, y:ex.penis.tip.y-size*6+2};
		var translatedlefthead = {x:ex.leftheadpenis.x-ex.penis.tip.x, y:ex.penis.tip.y-ex.leftheadpenis.y};
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
			ex.pecs = {};

			ctx.lineWidth = (11-shoulders) / 10;
			ex.pecs.out = {x:33 + x + y + (z/4), y:95 + b + (z / 3)};
			ctx.moveTo(ex.pecs.out.x, ex.pecs.out.y);
			ex.pecs.bot = {x:50 + c + y + (z / 4), y:120 + z - (a + b + y),
				cp1:{x:30 + x + y + c + c + (z / 4), y:105 + z - y}};
			ctx.quadraticCurveTo(ex.pecs.bot.cp1.x, ex.pecs.bot.cp1.y,
				ex.pecs.bot.x, ex.pecs.bot.y);

			if (breasts < 14) {
				ex.pecs.in = {x:78 - (a + c + (z / 4)), y:117 + z + (z / 4) - (a + c + y),
					cp1:{x:63 + x - (c + (z / 2)), y:120 + (z * 1.3) - (a + b + y)}};
				ctx.quadraticCurveTo(ex.pecs.in.cp1.x, ex.pecs.in.cp1.y,
					ex.pecs.in.x, ex.pecs.in.y);
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

		da.drawPoints(ctx, ex.mons.right, ex.mons.left);
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
				if ((hips * 3) + butt > 70) g = (a / 9) * ((((hips * 3) + butt) - 70) / 5);
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
			b = (hips + butt) * 3;
			if (butt > 20) b += (butt - 20) * 8;
			c = waist / 3;
			if (c < -5) c = -5;
			d = hips / 2;
			if (hips > 20) d = 10;
			f = 0;
			
			y = b;
			if (y > 100) y = 100;
			ctx.bezierCurveTo(53 + c - ((a / 1.2) + (y / 40.7) + (f / 5) + (b / 60)), 145 + (c / 5) + (y / 27.5), 52 + c - ((a / 1.6) + (f / 2) + (b / 40)), 161 - ((y / 6.875)),50.3 + (c / 2) - ((a / 2) + (b / 20) + (f / 2)), 175 - ((y / 22) + d));
			
			a = (hips + butt) / 2;
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
			if (butt > hips) g = butt / 20;
			if (g > 1) g = 1;
			x = butt / 5;
			y = butt / 15;
			z = 0;
			if (legs < 11) z = (11 - legs) / 2;
			if (a > 15 && z > 20 - a) z = 20 - a;
			ctx.quadraticCurveTo(65 - ((butt / 8) + (hips / 12) + (h / 2) + f), 197 + f + f, 79, 206);
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
		
		ex.bellybutton = {};
		ex.bellybutton.bot = {x:80, y:155+d-legl};
		ctx.moveTo(ex.bellybutton.bot.x, ex.bellybutton.bot.y-3);
		ctx.quadraticCurveTo(ex.bellybutton.bot.x+2, ex.bellybutton.bot.y-2, ex.bellybutton.bot.x, 
			ex.bellybutton.bot.y);
		
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
	
	function calcHeadBase() {
		/*Face*/
		var a = face;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;

		ex.chin = {};
		ex.ear = {};

		if (a < 11) {
			var s = sk.upper.m;
			ex.skull = {x:s.skull.x, y:s.skull.y + c};
			ex.ear.top = {x:s.ear.x, y:s.ear.y-10,
				cp1:{x:s.ear.x, y:s.skull.y + c}};

			ex.ear.bot = {x:s.ear.x, y:s.ear.y,
				cp1:{x:s.ear.cp1.x, y:s.ear.cp1.y},
				cp2:{x:s.ear.cp2.x, y:s.ear.cp2.y}};
				
			ex.jaw = {x:s.jaw.x, y:s.jaw.y - c};

			ex.chin.out = {x:s.chin.x-9 + b, y:s.chin.y+1 - d,
				cp1:{x:s.jaw.x+9, y:s.jaw.y+15}};

			ex.chin.bot = {x:s.chin.x, y:s.chin.y - e,
				cp1:{x:s.chin.x-4, y:s.chin.y+1 - d}};

		} else {
			var a = face - 11;
			if (face > 20) a = 9;
			var b = a / 2;
			var c = a / 3;
			var d = a / 5;
			var e = a / 10;
			var z = 0;
			if (face > 20) {
				z = face - 20;
				z = z / 2;
			}
			var s = sk.upper.f;


			ex.skull = {x:s.skull.x, y:s.skull.y + e};
			ex.ear.top = {x:s.ear.x + d, y:s.ear.y - 10,
				cp1:{x:s.ear.x + d, y:s.skull.y + e}};
			ex.ear.bot = {x:s.ear.x + d, y:s.ear.y + c,
				cp1:{x:s.ear.cp1.x, y:s.ear.cp1.y},
				cp2:{x:s.ear.cp2.x, y:s.ear.cp2.y}};
			ex.jaw = {x:s.jaw.x + d, y:s.jaw.y - c};
			ex.chin.bot = {x:s.chin.x, y:s.chin.y - d,
				cp1:{x:s.chin.x-4 + d + d - (z / 3), y:s.chin.y - d}};
			ex.chin.out = {x:s.chin.x-4 + d + d - (z / 3), y:s.chin.y - d,
				cp1:{x:s.jaw.x+9 - e, y:s.jaw.y+13 + b - z}};

		}		
	}

	function drawHeadBase(ctx)
	{
		ctx.beginPath();
		
		ctx.lineWidth = (21 - face) / 10;
		if (ctx.lineWidth < 1.4) ctx.lineWidth = 1.4;

		da.drawPoints(ctx, ex.skull, ex.ear.top, ex.ear.bot, ex.jaw, ex.chin.out, ex.chin.bot);
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
			ex.eye.in.cp1.y -= eyes/25;
			ex.eye.in.cp2.y -= eyes/25;
			ex.eye.out.y += eyes/20;
			ex.eye.out.x += eyes/20;
		}

		ex.eye.tearduct = {x:ex.eye.incorner.x+0.4, y:ex.eye.incorner.y+1.2};

		da.drawPoints(ctx, ex.eye.incorner, ex.eye.out, ex.eye.in, ex.eye.tearduct);
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
		
		ex.eye.lid = {};
		ex.eye.lid.in = {x:ex.eye.in.x, y: ex.eye.in.y,
			cp1:{x:65.333 + x - a, y: y + 5.5 - 3 - a},
			cp2:{x:71 + x + b, y: y + 5.5 -  2 - a}};

		ex.eye.lid.out = {x:ex.eye.out.x+1, y:ex.eye.out.y,
			cp1:{x:ex.eye.in.cp2.x -eyes/15, y:ex.eye.in.cp2.y +eyes/10},
			cp2:{x:ex.eye.in.cp1.x +eyes/8, y:ex.eye.in.cp1.y +eyes/10}};

		da.drawPoints(ctx, ex.eye.out, ex.eye.lid.in, ex.eye.lid.out);
	}
	function calcIris() {	// need to do this before drawing eyes in case ex.iris's position is needed
		var x = face / 35;
		var y = 27 - eyes*0.04;
		
		ex.iris = {x:69.2 + x, y:y + 7.1, r:1.7};
		if (eyes < -14) {	// intense staring eyes
			ex.iris.x += 0.2;
			ex.iris.y += 0.3;
		}		
	}
	function drawIris(ctx)
	{
		ctx.beginPath();
		
		ctx.arc(ex.iris.x, ex.iris.y, ex.iris.r, 0, Math.PI*2, true);

		if (typeof IRISCOLOR === "function") ctx.fillStyle = IRISCOLOR(ctx, ex);
		else ctx.fillStyle = IRISCOLOR;
	}
	function drawPupil(ctx) {
		ctx.beginPath();
		ctx.arc(ex.iris.x, ex.iris.y, ex.iris.r*0.7, 0, Math.PI*2, true);
		var grd = ctx.createRadialGradient(ex.iris.x, ex.iris.y, ex.iris.r*0.5, ex.iris.x, ex.iris.y, ex.iris.r*0);
		grd.addColorStop(0, "rgba(0,0,0,0)");
		grd.addColorStop(1, "black");
		ctx.fillStyle = grd;
	}
	function drawEyebrows(ctx) {
		ctx.beginPath();

		ctx.fillStyle = HAIRCOLOR;
		ctx.strokeStyle = HAIRCOLOR;
		if (browv < 3) return;
		ctx.lineWidth = Math.sqrt(browv) / 5;

		ex.brow = {};

		ex.brow.in = {x:ex.eye.in.x, y:ex.eye.in.y -browh*0.3 +browt*0.3};
		ex.brow.out = {x:ex.eye.out.x, y:ex.eye.out.y -browh*0.3 -browt*0.3};
		// decide where along the brow the sharp bend occurs
		var bendpoint = browb/100;	// buttuming browb [0,100]
		ex.brow.in.cp1 = {x:bendpoint*ex.brow.in.x+(1-bendpoint)*ex.brow.out.x,
			y:bendpoint*ex.brow.in.y+(1-bendpoint)*ex.brow.out.y -browc*0.4};


		// gently go down to the bottom or go straight down
		ex.brow.bot = {x:ex.brow.in.x, y:ex.brow.in.y +browv*0.02};
		ex.brow.bot.cp1 = {x:ex.brow.in.x +browr*0.015, y:ex.brow.bot.y/2 + ex.brow.in.y/2};	
		ex.brow.out.cp1 = {x:bendpoint*ex.brow.in.x+(1-bendpoint)*ex.brow.out.x,
			y:bendpoint*ex.brow.in.y+(1-bendpoint)*ex.brow.out.y -browc*0.4}


		da.drawPoints(ctx, ex.brow.out, ex.brow.in, ex.brow.bot, ex.brow.out);
	}
	
	function drawLips(ctx)
	{
		ctx.fillStyle = LIPCOLOR;
		ctx.strokeStyle = LIPCOLOR;
		ctx.beginPath();

		ex.mouth = {};
		

		/*Lips*/
		var a = lips / 2.4;
		if (a < 0.6) a = 0.6;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var y = -0.17;
		
		ex.mouth.mid = {x:79, y:49+liph*0.1 + lipc*0.1 +lips*0.02};
		ex.mouth.top = {x:ex.mouth.mid.x, y:ex.mouth.mid.y -lips*0.06 -lipt*0.1};


		ex.mouth.left = {x:ex.mouth.mid.x -5.2  -lips*0.11 -lipw*0.1, y:ex.mouth.mid.y +0.9 +lipc*0.1 -lips*0.05};
		// center to left

		// clone the left mouth's x
		ex.mouth.right = {x:2*ex.mouth.mid.x-ex.mouth.left.x, y:ex.mouth.left.y};
		// left to right


		if (lips < -10 || lipt < -5 || (lipw > lips*1.5)) {	// very thin lips
			ex.mouth.mid = {x:79+lipw*0.1, y:50+liph*0.1 + lipc*0.1};
			ex.mouth.left = {x:76 - d -lipw*0.1, y:ex.mouth.mid.y - (y + (e / 2))};
			// center to left
			ex.mouth.right = {x:82 + d+lipw*0.1, y:ex.mouth.mid.y - (y + (e / 2))};

			ctx.moveTo(ex.mouth.left.x, ex.mouth.left.y);

			ctx.bezierCurveTo(ex.mouth.left.x+2, ex.mouth.left.y -lipc*0.2,
				ex.mouth.right.x-2, ex.mouth.right.y -lipc*0.2,
				ex.mouth.right.x, ex.mouth.right.y);
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(ex.mouth.mid.x-1, ex.mouth.mid.y+2);
			ctx.lineTo(ex.mouth.mid.x+2, ex.mouth.mid.y+2);
			ctx.lineWidth = 0.5;
			ctx.stroke();
		}
		else {
			ex.mouth.left.cp1 = {x:77 +lips*0.01 -lipc*0.1, y:ex.mouth.mid.y - lips*0.1 -lipt*0.1 -lipc*0.2 -lipa*0.2};
			ex.mouth.right.cp1 = {x:77, y:ex.mouth.mid.y + 3.1 + lips*0.07 +lipt*0.1 -lipc*0.1};
			ex.mouth.right.cp2 = {x:81, y:ex.mouth.right.cp1.y};

			ex.mouth.top.cp1 = {x:2*79 -ex.mouth.left.cp1.x, y:ex.mouth.left.cp1.y}; // positive curl moves it down into :(

			var sp = da.splitCurve(ex.mouth.left, ex.mouth.right, 0.5);
			ex.mouth.bot = sp.left.p2;
			ex.mouth.bot.cp1 = sp.left.cp2, ex.mouth.bot.cp2 = sp.right.cp2;

			da.drawPoints(ctx, ex.mouth.top, ex.mouth.left, ex.mouth.right, ex.mouth.top);
			ctx.fill();
		}

		ctx.miterLimit = 5;
		
	}
	
	function drawNose(ctx)
	{
		ctx.beginPath();
		
		ctx.strokeStyle = SKINCB;
		ctx.fillStyle = SKINC;
		ctx.lineWidth = (21 - face) / 15;
		if (ctx.lineWidth < 1) ctx.lineWidth = 1;
		
		ex.nose = {};
		/*Nose*/
		var a = face;
		var b = a / 2;
		var c = a / 3;
		var d = a / 5;
		var e = a / 10;
		var y = 23;
		
		if (a < 11) {
			ex.nose.top = {x:80+noseskew*0.2, y:y+8+e};
			ex.nose.tip = {x:83 - e, y:y + 20 - e};
			ex.nose.bot = {x:80, y:y + 22 - e};

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
			ex.nose.top = {x:80+noseskew*0.2, y:y+8+e};
			ex.nose.tip = {x:82 - z, y:y + 19 - (e + z)};
			ex.nose.bot = {x:80 - e, y:y + 20 - z};

			ex.nose.tip.cp1 = {x:ex.nose.top.x, y:ex.nose.top.y+3};
			ex.nose.tip.cp2 = {x:ex.nose.tip.x-0.4, y:ex.nose.tip.y-0.5};
			
			ex.nose.bot.cp1 = {x:ex.nose.tip.x+0.5, y:ex.nose.tip.y+1};
			ex.nose.bot.cp2 = {x:ex.nose.bot.x+0.4, y:ex.nose.bot.y+0.3};

		}

		da.drawPoints(ctx, ex.nose.top, ex.nose.tip, ex.nose.bot);
		ctx.stroke();
	}
	

	// main drawing functions from top to down
	function drawHead(ctx) {
		drawHeadBase(ctx);
		ctx.fillStyle = SKINC;
		ctx.strokeStyle = SKINCB;
		ctx.fill();
		ctx.stroke();

		calcIris();
		ctx.save();
		drawEyes(ctx);
		if (typeof EYECOLOR === "function") ctx.fillStyle = EYECOLOR(ctx, ex);
		else ctx.fillStyle = EYECOLOR;
		ctx.fill();
		ctx.clip();
		drawIris(ctx);
		ctx.fill();
		drawPupil(ctx);
		ctx.fill();
		ctx.restore();

		// strokes for eyes
		ctx.strokeStyle = EYELINER;
		drawEyes(ctx);
		ctx.lineWidth = 0.8;
		ctx.stroke();
		ctx.fillStyle = EYELINER;
		drawEyelids(ctx);
		ctx.fill();

		drawEyebrows(ctx);
		ctx.stroke();
		ctx.fill();	
	}

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

		ex.neck.nape = {x:79, y:sk.upper.m.top};
		if (a < 11) {
			var neckw = 62 + b + d;
			var s = sk.upper.m;

			ex.neck.top = {x:neckw, y:s.top};
			ctx.lineTo(ex.neck.top.x, ex.neck.top.y);

			ex.neck.cusp = {x:neckw, y:s.neck - b,
				cp1:{x:61 + e + b + d, y:s.neck-10 - b}};

			// most things below can be defined in terms of collarbone
			var cb = s.collarbone;
			// top of where you can see trapezius muscle
			ex.trapezius = {};
			ex.trapezius.top = {x:neckw, y:s.neck-10 + b};
			ex.collarbone = {x:cb.x + b, y:cb.y - d,
				cp1:{x:cb.x+9 + b, y:cb.y-8 + b}};

			da.drawPoints(ctx, ex.neck.nape, ex.neck.top, ex.neck.cusp, 
				ex.trapezius.top, ex.collarbone);

			if (a < 6) {
				ex.collarbone.top = {x:cb.x-4 + b, y:cb.y + d,
					cp1:{x:cb.x-2 + b, y:cb.y-2 + d + d}};
				da.drawPoints(ctx, null, ex.collarbone.top);
			}

			/*Outer Arm*/
			ex.deltoids = {x:cb.x-27 + f, y:cb.y+38 - (a + d),
				cp1:{x:cb.x-25 + f, y:cb.y+2},
				cp2:{x:cb.x-32 + f + a, y:cb.y+16 - a}};


			ex.shoulder = {x:cb.x-28 + f + e, y:cb.y+28 - d};

			ex.elbow.out = {x:s.elbow.x + a + b, y:s.elbow.y - (d * 3),
				cp1:{x:s.elbow.x-6 + f + d + d + d, y:s.elbow.y-17 - b - d},
				cp2:{x:s.elbow.x+4 + a + e, y:s.elbow.y-14}};

			ex.wrist.out = {x:s.wrist.x + d + d - g, y:s.wrist.y - (a + d + b),
				cp1:{x:s.wrist.x-9 + a + b + d - (g / 2), y:s.wrist.y-51 - b}};

			/*Hands*/
			ex.hand.knuckle = {x:s.knuckle.x - ((d*4) + g), y:s.knuckle.y - (b + (d * 4)),
				cp1:{x:s.knuckle.x-7 -g, y:s.knuckle.y-3 - (b + b + c)}};

			ex.hand.tip = {x:s.finger.x-g, y:s.finger.y - (b + c),
				cp1:{x:s.finger.x-3 - (d + g), y:s.finger.y+1 - (b + d)}};
			// up to second joint of fingers

			ex.hand.palm = {x:s.finger.x-7 + e-g, y:s.finger.y-9 - (b + e),
				cp1:{x:s.finger.x-4 + c - g, y:s.finger.y-10 + (d - b)}};

			// no inner and outer thumb, end point is the thumb tip
			ex.thumb.tip = {x:ex.hand.tip.x, y:ex.hand.tip.y};

			ex.wrist.in = {x:s.wrist.x+10 + d - g, y:s.wrist.y-9 - (b + c),
				cp1:{x:s.wrist.x+23 - g, y:s.wrist.y+11 - (b + d)}};

			/*Inner Arm*/
			ex.ulna = {x:ex.wrist.in.x , y:s.wrist.y-25 + b,
				cp1:{x:s.wrist.x+8 + d - g, y:s.wrist.y-16 + b}};

			ex.elbow.in = {x:s.elbow.x+17 + a, y:s.elbow.y+6 - (a + d + b),
				cp1:{x:s.elbow.x+18 + b + d - (g / 2), y:s.elbow.y+23 - (b + (c * 3))}};

			ex.armpit = {x:s.rib.x + b + e, y:s.rib.y - (a + a),
				cp1:{x:s.rib.x-4, y:s.rib.y+25 - a}};

			ex.trapezius.bot = {x:s.rib.x-5 + (b + c), y:s.rib.y+17 - (f + b + d)};
			var h = 0;
			if (waist < 0) h = waist * -0.5;

			ex.waist = {x:s.rib.x+3 + (c * 3) - (h / 4), y:s.rib.y+34 - (h + a),
				cp1:{x:s.rib.x-1 + (c * 3), y:s.rib.y+30 - (h + a + b)}};
			
			da.drawPoints(ctx, null, ex.deltoids, ex.shoulder, ex.elbow.out, 
				ex.wrist.out, ex.hand.knuckle, ex.hand.tip, ex.hand.palm, ex.thumb.tip, ex.wrist.in,
				ex.ulna, ex.elbow.in, ex.armpit, ex.trapezius.bot, ex.waist);

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
			if ((hips * 3) + (butt * 1.5) > 40) g = ((((hips * 3) + (butt * 1.5)) - 40) / 5);
			if (7 - legs > 0) g += (7 - legs);
			g *= a / 9;
			if (g > 13.5) g = 13.5;
			g += ((20 - waist) / 10) * (a / 9);
			z = g / 2;
			x = a;
			y = x / 2;
			var m = 0;
			if (shoulders > 10) m = (shoulders - 10) / 20;

			var s = sk.upper.f;
			var neckw = 69;
			ex.neck.top = {x:neckw, y:s.top};

			ex.neck.cusp = {x:neckw, y:s.neck, cp1:{x:69,y:53}};

			var cb = s.collarbone;
			ex.collarbone = {x:cb.x + a, y:cb.y + b, cp1:{x:cb.x+9+c, y:cb.y-1+c}};
			// up to middle of shoulder, about collar bone distance

			/*Outer Arm*/
			ex.shoulder = {x:cb.x-12 + d + m + m + m, y:cb.y+27,
				cp1:{x:cb.x-10 + m, y:cb.y+4 + a + e},
				cp2:{x:cb.x-6 + m, y:cb.y+7 + a}};
	
			// shoulder up to outside of upper arm
			ex.elbow.out = {x:s.elbow.x + b + m + m + b, y:s.elbow.y,
				cp1:{x:s.elbow.x+4 + m + m + m + d + b, y:s.elbow.y-23}};
			// down to outside of elbow

			ex.wrist.out = {x:s.wrist.x + x + m + m + c + b-g, y:s.wrist.y - z,
				cp1:{x:s.wrist.x+3 + a + c + m + m + m + b - (g / 2), y:s.wrist.y-38 - z}};
			// down to outside of wrist

			/*Hands*/
			ex.hand.knuckle = {x:s.knuckle.x + x + y + (y/3) - (g + z), y:s.knuckle.y - (b + z),
				cp1:{x:s.knuckle.x+1 + x + y + (y/4) - (g + z), y:s.knuckle.y-4 - (b + z)}};
			// down to middle of the back of the hand

			ex.hand.tip = {x:s.finger.x + x + y + (y/1.2) - (a + b + g + z + (z / 3)), y:s.finger.y + a - z,
				cp1:{x:s.finger.x-8 + x + y + (y/1.2) - (a + b + g + z + (z / 10)), y:s.finger.y+2 + b - (z/10)}};
			// down to tip of hand


			ex.hand.palm = {x:s.finger.x-6 + x + (y * 1.5) - (b + g + z), y:s.finger.y-7 - (e + z),
				cp1:{x:s.finger.x-1 + x + y - (g + z), y:s.finger.y-5 - z}};

			ex.thumb.in = {x:s.finger.x + x + (y*1.5) - (a + g + z), y:s.finger.y - (b + c + z)};
			ex.thumb.out = {x:s.finger.x-6 + x + y + c - (g + (z/2)), y:s.finger.y-20 + a + d - z,
				cp1:{x:s.finger.x+6 + x + y - (a + e + g + z), y:s.finger.y+1 + e - z}};
			// past the thumb
			var sp = da.splitCurve(ex.thumb.in, ex.thumb.out, da.clamp(-0.5+shoulders*0.05,0.1,0.5));
			ex.thumb.tip = sp.left.p2;
			ex.thumb.tip.cp1 = sp.left.cp1;

			/*Inner Arm*/
			ex.ulna = {x:s.ulna.x + (x / 2) + b + b + a - (g / 2), y:s.ulna.y - (f + z),
				cp1:{x:s.ulna.x + x + a - (d + g), y:s.ulna.y+9 - z}};
			// halfway up forearm

			ex.wrist.in = da.splitCurve(ex.thumb.out, ex.ulna, 0.4).right.p1;

			// elbow: {x:24, y:138},

			ex.elbow.in = {x:s.elbow.x+14 + b + d + b + d, y:s.elbow.y-6,
				cp1:{x:s.elbow.x+11 + c + b + b + c - ((x / 4)), y:s.elbow.y+15 - b}};

			// slightly past elbow on its way up
			ex.humorous = {x:s.rib.x+4 + d - e, y:s.rib.y-13 + (c * 3)};
			ex.armpit = {x:s.rib.x + d + d + e, y:s.rib.y + b};
			var h = 0;
			if (waist < 0) h = waist * -0.5;

			ex.waist = {x:s.rib.x+10 - (d + (h / 4)) +legl*0.1 +waist*0.1, 
				y:s.rib.y+30 - (b + h) - legl*0.5,
				cp1:{x:s.rib.x+6 + d +legl*0.05 +waist*0.1, y:s.rib.y+21 -h -legl}};
			// down to narrowest part of waist


			da.drawPoints(ctx, ex.neck.nape, ex.neck.top, ex.neck.cusp, 
				ex.collarbone, ex.shoulder, ex.elbow.out, ex.wrist.out,
				ex.hand.knuckle, ex.hand.tip, ex.hand.palm, ex.thumb.in, ex.thumb.out,
				ex.ulna, ex.elbow.in, ex.humorous, ex.armpit, ex.waist);
		}		
	}
	function drawMidBody(ctx) {
		// from waist to hips
		/*Waist*/
		var a = 0;
		if (shoulders < 11) {
			a = (11 - shoulders);
			if (waist < 1) {
				a+=waist / 4;
				if (a<0) a = 0;
			}
		}
		var b = (hips + butt) * 3;
		// if (butt > 20) b += (butt - 20) * 8;
		var c = waist / 3;
		if (c < -5) c = -5;
		var d = hips / 2;
		if (hips > 20) d = 10;
		var f = 0;
		
		var y = b;
		if (y > 100) y = 100;

		var s = sk.mid;

		ex.hip = {x:s.hip.x + (c / 2) - ((a / 2) + (b/20) + (f / 2)),
			y:s.hip.y - ((y / 22) + d) - legl,
			cp1:{x:s.hip.x+2.7 + c - ((a / 1.2) + (y / 40.7) + (b / 60)), y:s.hip.y-30 + (c / 5) + (y / 27.5) + legl*0.2},
			cp2:{x:s.hip.x+1.7 + c - ((a / 1.6) + (f / 2) + (b / 40)), y:s.hip.y-14 - ((y / 6.875)) -legl}};
		ctx.bezierCurveTo(ex.hip.cp1.x, ex.hip.cp1.y,
			ex.hip.cp2.x, ex.hip.cp2.y,
		 	ex.hip.x, ex.hip.y);
		// down to hips at belly button level		
	}

	function drawOuterThigh(ctx) {
		// starting from hip all the way to top outer ankle
		ex.calf = ex.calf || {};
		ex.thigh = ex.thigh || {};

		if (legs < 11) {
			var s = sk.lower.m;

			ex.kneepit = {x:s.knee.x + legs*0.833, y:s.knee.y + legs*0.6 -legl*0.6,
				cp1:{x:s.knee.x-11 + legs*1.833 - hips*0.818, y:s.knee.y-42 -legs*1.5 -hips*0.364 -butt/10}};
			ex.calf.out = {x:s.knee.x-2 + legs*0.4, y:s.knee.y+50 +legs*1.2 -legl*0.6,
				cp1:{x:s.knee.x-10 + legs, y:s.knee.y+38 - legs/3}};
		}
		else {
			var s = sk.lower.f;
			var a = 9;
			if (legs <= 20) a = legs - 11;
			a = a * 0.8;
			var z = 0;
			if (legs > 20) {
				z = legs - 20;
				z /= 2;
			}

			// ex.kneepit = {x:44 + a*2.1, y:275 -legl*0.6,
			ex.kneepit = {x:s.knee.x + a*2.1, y:s.knee.y -legl*0.6,
				cp1:{x:s.knee.x-0.7 - (a*0.533 + hips*0.818 + z), y:s.knee.y-73 + z - hips*0.364 -butt/10}};
			// from hip down to back of knee
			ex.calf.out = {x:s.knee.x-6 + a*2.7, y:s.knee.y+57 -legl*0.1,
				cp1:{x:s.knee.x-8 + a*2.33 - hips/5.5, y:s.knee.y+29 -a -hips/5.5}};
		}	

		var sp = da.splitCurve(ex.hip, ex.kneepit, 0.55);
		ex.thigh.out = sp.left.p2;
		ex.thigh.out.cp1 = sp.left.cp1;
		// reassign kneepit to have cp1 incoming from the thigh
		ex.kneepit.cp1 = sp.right.cp1;

		// actual drawing after defining draw points
		da.drawPoints(ctx, null, ex.thigh.out, ex.kneepit, ex.calf.out);
	}

	function drawLegs(ctx)
	{
		// starting from top outer ankle all the way to pelvic region
		ex.ankle = {};
		ex.toe = {};
		if (legs < 11) {
			var s = sk.lower.m;
			ex.ankle.outtop = {x:s.ankle.x - legs/3, y:s.ankle.y-11 - legs/3 -legl*0.1,
				cp1:{x:s.ankle.x-7 + legs*0.4, y:s.ankle.y-30 + legs/3}};

			ex.ankle.out = {x:s.ankle.x - legs/5, y:s.ankle.y - legs/10,
				cp1:{x:s.ankle.x+1 - legs/3, y:s.ankle.y-5 - legs/3}};

			ex.ankle.outbot = {x:s.ankle.x - legs/5, y:s.ankle.y+5 - legs/3,
				cp1:{x:s.ankle.x-2 - legs/10, y:s.ankle.y+2 - legs/5}};
			/*Foot*/
			ex.toe.out = {x:s.toe.out.x +legs/10, y:s.toe.out.y -legs*0.4,
				cp1:{x:s.toe.out.cp1.x +legs/5, y:s.toe.out.cp1.y - legs*1.33}};

			ex.toe.mid = {x:s.toe.mid.x + legs*0.4, y:s.toe.mid.y - legs/3,
				cp1:{x:s.toe.mid.cp1.x + legs/3, y:s.toe.mid.cp1.y - legs/3}};

			ex.toe.in = {x:s.toe.in.x -legs*0.7, y:s.toe.in.y -legs/3,
				cp1:{x:s.toe.in.cp1.x -legs/3, y:s.toe.in.cp1.y -legs/3}};

			ex.toe.intop = {x:ex.toe.in.x+0.2, y:ex.toe.in.y-3};

 			ex.ankle.in = {x:s.ankle.x+14 - legs/2, y:s.ankle.y+6 -legs/3,
 				cp1:{x:s.ankle.x+13 - legs*0.6, y:s.ankle.y+15 - legs/3}};

			// wearing heels
			if (shoeheight >= 3) {
				ex.toe.in.cp1.y += 10;
				ex.toe.out.x += 6;
				ex.ankle.in.cp1.x += 3;
				delete ex.toe.mid;
				delete ex.toe.intop;
			}

			ex.ankle.intop = {x:s.ankle.x+12 -legs/3, y:s.ankle.y-2 -legs/5 -legl*0.6,
				cp1:{x:s.ankle.x+15 -legs/2, y:s.ankle.y+1 -legs/5}};

			ex.calf.in = {x:s.shin.x -legs*0.4, y:s.shin.y +legs};

			// inverted with feminine legs as knee pit is on the inside rather than outside (will still call this kneecap for consistency)
			ex.kneecap = {x:s.knee.x+25 +legs/10, y:s.knee.y+7 -legs -legl*0.6,
				cp1:{x:s.knee.x+28, y:s.knee.y+37 -legs},
				cp2:{x:s.knee.x+31 -legs, y:s.knee.y+26 -legs}};

			ex.groin = {x:s.cocyx.x-1 -legs/5, y:s.cocyx.y -legs/5 -legl*1.1,
				cp1:{x:s.cocyx.x-1 -legs*0.7, y:s.cocyx.y+25 +legs/3}};


			ex.kneecap.top = {x:s.knee.x+34 - legs*0.7, y:s.knee.y-19 + legs,
				cp1:{x:s.knee.x+29 - legs/5, y:s.knee.y-9 + legs/5}};

			ex.groin.in = {x:s.cocyx.x, y:s.cocyx.y - legs/5 -legl*1.1,
				cp1:{x:s.cocyx.x, y:s.cocyx.y+3 - legs/5}};

		} else {
			var s = sk.lower.f;
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
			ex.ankle.outtop = {x:s.ankle.x-1 + e + (a + b + b + d + b), y:s.ankle.y-13 -legl*0.1,
				cp1:{x:s.ankle.x-1 + e + (a + b + b + d + b), y:s.ankle.y-26}};

			ex.ankle.out = {x:s.ankle.x + (a + b + b + d + b), y:s.ankle.y, 
				cp1:{x:s.ankle.x-1 + (a + b + b + d + b), y:s.ankle.y-7}};


			/*Foot*/
			if (shoeheight < 3) {	// not wearing heels
				ex.ankle.outbot = {x:s.ankle.x + (a + b + b + d + b), y:s.ankle.y+3,
					cp1:{x:s.ankle.x-1 + (a + b + b + d + b), y:s.ankle.y+1}};

				ex.toe.out = {x:s.toe.out.x + (a + a + b + d + b), y:s.toe.out.y,
					cp1:{x:s.toe.out.cp1.x + (a + a + b + d + b), y:s.toe.out.cp1.y}};

				// down to outer toes
				ex.toe.mid = {x:s.toe.mid.x + (a + a + b + d + b), y:s.toe.mid.y,
					cp1:{x:s.toe.mid.cp1.x + (a + a + b + d + b), y:s.toe.mid.cp1.y}};

				ex.toe.in = {x:s.toe.in.x + (a + a + b + d + b), y:s.toe.in.y,
					cp1:{x:s.toe.in.cp1.x + (a + a + b + d + b), y:s.toe.in.cp1.y}};

				// to inner toes
				ex.toe.intop = {x:ex.toe.in.x, y:s.toe.in.y-5,
					cp1:{x:s.toe.in.x+2 + (a + a + b + d + b), y:s.toe.in.y-2}};

				ex.ankle.in = {x:s.ankle.x+10 + (a + a + b + d + b),y:s.ankle.y+4,
					cp1:{x:s.ankle.x+10 + (a + a + b + d + b), y:s.ankle.y+13}};

				// inner ankle
				ex.ankle.intop = {x:s.ankle.x+11 + (a + a + b + b + c), y:s.ankle.y-3,
					cp1:{x:s.ankle.x+11 + (a + a + b + b + c), y:s.ankle.y}};

			}
			else {
				// bottom ankle bone
				ex.ankle.outbot = {x:ex.ankle.out.x, y:ex.ankle.out.y+5};
				ex.ankle.outbot.cp1 = {x:ex.ankle.outbot.x-1, y:ex.ankle.outbot.y-1.5};

				var legaddition = legs;
				if (legaddition > 30) legaddition = 30;

				// higher heels will cause foot to appear narrower
				ex.toe.out = {x:ex.ankle.out.x-2+shoeheight*0.2+legaddition*0.1, y:ex.ankle.out.y+12+shoeheight*2};
				ex.toe.in = {x:ex.toe.out.x+14-shoeheight*0.2, y:ex.toe.out.y};
				ex.toe.in.cp1 = {x:ex.toe.out.x+3, y:ex.toe.out.y+15};
				ex.toe.in.cp2 = {x:ex.toe.in.x-3, y:ex.toe.in.y+9};
				ex.ankle.in = {x:s.ankle.x+10 + (a + a + b + d + b)*0.95, y:s.ankle.y+4};

				ex.ankle.intop = {x:ex.ankle.in.x-1,y:ex.ankle.in.y-5};
				ex.ankle.intop.cp1 = {x:ex.ankle.in.x+2, y:ex.ankle.in.y-2};

			}

			ex.calf.in = {x:s.shin.x + b + (a + b + c + b), y:s.shin.y - a};

			/*Inner-Leg*/
			// inner shin to knee cap
			ex.kneecap = {x:s.knee.x+19 + a + b + e + b, y:s.knee.y-10 -legl*0.6,
				cp1:{x:s.knee.x+20 +a*2.6, y:s.knee.y+22 -a},
				cp2:{x:s.knee.x+12 +a*2.1, y:s.knee.y+21}};

			ex.kneecap.top = {x:ex.kneecap.x, y:ex.kneecap.y-4,
				cp1:{x:s.knee.x+19 + a + b + e + b, y:s.knee.y-13}};

			// cocyx: {x:79, y:203}
			// up to corner of inner thigh
			ex.groin = {x:s.cocyx.x-4 + d, y:s.cocyx.y -legl*1.1,
				cp1:{x:s.cocyx.x-8 + a + b + (z / 3), y:s.cocyx.y+30 + (z / 3) - b}};

			ex.groin.in = {x:s.cocyx.x, y:ex.groin.y,
				cp1:{x:s.cocyx.x, y:204-legl*1.1}};

		}
		// create additional draw points
		var sp = da.splitCurve(ex.kneecap.top, ex.groin, da.clamp(0.3+legs*0.05, 0.2, 0.7));
		ex.thigh.in = sp.left.p2;
		ex.thigh.in.cp1 = sp.left.cp1;
		// reassign to insert thigh.in in between
		ex.groin.cp1 = sp.right.cp1;

		// consolidated drawing of legs (some points will always be null for either masculinity)
		da.drawPoints(ctx, null, ex.ankle.outtop, ex.ankle.out, ex.ankle.outbot,
			ex.toe.out, da.tracePoint(ex.toe.mid,1), ex.toe.in, ex.toe.intop, ex.ankle.in, ex.ankle.intop,
			ex.calf.in, ex.kneecap, ex.kneecap.top, ex.thigh.in, ex.groin, ex.groin.in);
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

		// extra detail drawing
		drawAbs(ctx);
		ctx.stroke();
		drawPecs(ctx);
		ctx.stroke();
		// close up the shape so we can cover over the abs
		if (ex.hasOwnProperty("pecs.in")) {
			ctx.lineTo(79, ex.pecs.in.y);
			ctx.lineTo(79, ex.pecs.in.y-30);
		}
		else if (ex.hasOwnProperty("pecs.bot")) {
			ctx.lineTo(79, ex.pecs.bot.y);
			ctx.lineTo(79, ex.pecs.bot.y-40);
		}
		// ctx.fillStyle = "black";
		ctx.fill();


		drawLegMuscles(ctx);
		ctx.stroke();

		ctx.save();
		// highlight hips and thighs if thick
		var hipthick = ((hips * 3) + butt) / 4;
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
			ctx.moveTo(ex.hip.x, ex.hip.y);
			drawOuterThigh(ctx);
			ctx.stroke();
		}
		ctx.restore();
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
	var canvas = null;
	if (typeof canvasname === "string")
		canvas = document.getElementById(canvasname);
	else
		canvas = canvasname;	// assume canvas element passed in

	// can't find canvas
	if (typeof canvas === 'undefined') {
		alert("can't find canvas with name " + canvasname);
		return;
	}

	// define stats
	var missingData = false;
	if (!passThrough)
		avatar.calcPhysique();
	var sk = da.racialSkeleton[avatar.skeleton];
	if (!sk) {
		alert("can't find skeleton with name " + avatar.skeleton);
		return;
	}
	var stats = avatar.physique;

	// NECESSARY properties for avatar.physique
	var height = typeof stats["height"] !== 'undefined' ? stats["height"] : missingData = true; 
	var face = typeof stats["face"] !== 'undefined' ? stats["face"] : missingData = true;
	var eyes = typeof stats["eyes"] !== 'undefined' ? stats["eyes"] : missingData = true;
	var eyecolor = typeof stats["eyecolor"] !== 'undefined' ? stats["eyecolor"] : missingData = true;
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
	var butt = typeof stats["butt"] !== 'undefined' ? stats["butt"] : missingData = true;
	var legs = typeof stats["legs"] !== 'undefined' ? stats["legs"] : missingData = true;
	
	// NECESSARY properties for avatar.Mods idiosyncracies to give variation to characters (an identity)
	var id = avatar.Mods;
	var lipw = typeof id["lipw"] !== 'undefined' ? id["lipw"] : missingData = true;
	var lipt = typeof id["lipt"] !== 'undefined' ? id["lipt"] : missingData = true;
	var liph = typeof id["liph"] !== 'undefined' ? id["liph"] : missingData = true;
	var lipc = typeof id["lipc"] !== 'undefined' ? id["lipc"] : missingData = true;
	var lipa = typeof id["lipa"] !== 'undefined' ? id["lipa"] : missingData = true;
	var legl = typeof id["legl"] !== 'undefined' ? id["legl"] : missingData = true;
	var eyec = typeof id["eyec"] !== 'undefined' ? id["eyec"] : missingData = true;
	var noseskew = typeof id["noseskew"] !== 'undefined' ? id["noseskew"] : missingData = true;
	var penist = typeof id["penist"] !== 'undefined' ? id["penist"] : missingData = true;
	var browh = typeof id["browh"] !== 'undefined' ? id["browh"] : missingData = true;
	var browt = typeof id["browt"] !== 'undefined' ? id["browt"] : missingData = true;
	var browc = typeof id["browc"] !== 'undefined' ? id["browc"] : missingData = true;
	var browb = typeof id["browb"] !== 'undefined' ? id["browb"] : missingData = true;
	var browv = typeof id["browv"] !== 'undefined' ? id["browv"] : missingData = true;
	var browr = typeof id["browr"] !== 'undefined' ? id["browr"] : missingData = true;
	var eyelinerc = typeof id["eyelinerc"] !== 'undefined' ? id["eyelinerc"] : missingData = true;

	// DRAW POINTS defined (x,y) for specific body points so we have unified calculations
	// these are calculated once in a core function and then referenced in other functions
	// they are the exported physical parameters and are defined in their respective draw functions
	var ex = {};
	ex.pelvis = {x:79,y:sk.mid.pelvis-legl, // special case for pelvis where cp3 is to the hip
		cp1:{x:60,y:sk.mid.pelvis-legl},
		cp3:{x:60,y:sk.mid.pelvis-legl}};

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
	var EYECOLOR = eyecolor;
	var IRISCOLOR = "brown";
	var EYELINER = "black";
	var NIPPLESHADOW = "black";
	
	// if they're NaN then we buttume they are in a postprocessed form already and it's safe to directly buttign
	if (typeof irisc === "function") {
		IRISCOLOR = irisc;
	} else if (isNaN(irisc)) {
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
	
	if (typeof hairc === "function") {
		HAIRCOLOR = hairc(ctx, false);
		HAIRCOLORB = hairc(ctx, true);
	}
	else if (isNaN(hairc)) {
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

	if (typeof eyelinerc === "function") {
		EYELINER = eyelinerc(ctx);
	}
	else if (eyelinerc && isNaN(eyelinerc)) {
		EYELINER = eyelinerc;
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
	ctx.fillText(avatar.isMale() ? String.fromCharCode(0x2642) : String.fromCharCode(0x2640), 6, 24);
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
	
	calcHeadBase();
	// before anything gets drawn, draw anything behind back (wings?)
	avatar.drawAdditional(ctx, ex, "behindback");	

	ex.hairlength = hairlength;
	// Draw hair
	ctx.fillStyle = HAIRCOLOR;
	ctx.strokeStyle = HAIRCOLORB;
	da.drawHairBack[avatar.physique.hairstyle](ctx, ex);


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
	
	reflectHorizontal(ctx);
	avatar.drawAdditional(ctx, ex, "undergenitals");

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
	avatar.drawAdditional(ctx, ex, "underchin");
	
	// Draw central/common parts of the body, part 2
	drawHead(ctx);
	reflectHorizontal(ctx);
	drawHead(ctx);
	drawNose(ctx);

	drawCleavage(ctx);

	drawLips(ctx);


	// things to render under hair
	avatar.drawAdditional(ctx, ex, "underhair");

	// in the future the reflection will happen in the hairstyle drawer since some styles may be asymmetric
	ctx.fillStyle = HAIRCOLOR;
	ctx.strokeStyle = HAIRCOLORB;
	ctx.lineWidth = 1;
	da.drawHairFront[avatar.physique.hairstyle](ctx, ex, face);
		

	// more exports
	ex.ox = ox;
	ex.oy = oy;
	ex.scaling = scaling;
	ex.sx = sx;
	ex.sy = sy;

	// where shoes are allowed to draw
	ex.shoebox = {
		x:-ox-10, y:-oy+300,
		width:ox+70, height:oy+90
	};

	reflectHorizontal(ctx);

	avatar.drawAdditional(ctx, ex, "afterall");

	ex.ctx = ctx;
	return ex;
};

return da;
}(da || {}));

window.da = da;