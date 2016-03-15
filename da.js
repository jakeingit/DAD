/* Copyright 2012 Tuatha, 2016 Johnson Zhong
   Originally created by Tuatha, totally overhauled by Johnson
   Feel free to include this into your game, 
   just remember to credit and leave the license in place.

   To use, just copy the entire content of this file to the top of your Javascript.
*/
/*
	2D Transformation Matrix v2.1.0
	(c) Epistemex.com 2014-2016
	License: MIT, header required.
*/
function Matrix(a){var b=this;b._t=b.transform;b.a=b.d=1;b.b=b.c=b.e=b.f=0;b.context=a;if(a){a.setTransform(1,0,0,1,0,0)}}Matrix.prototype={concat:function(a){return this.clone()._t(a.a,a.b,a.c,a.d,a.e,a.f)},flipX:function(){return this._t(-1,0,0,1,0,0)},flipY:function(){return this._t(1,0,0,-1,0,0)},reflectVector:function(c,e){var b=this.applyToPoint(0,1),a=2*(b.x*c+b.y*e);c-=a*b.x;e-=a*b.y;return{x:c,y:e}},reset:function(){return this.setTransform(1,0,0,1,0,0)},rotate:function(a){var b=Math.cos(a),c=Math.sin(a);return this._t(b,c,-c,b,0,0)},rotateFromVector:function(a,b){return this.rotate(Math.atan2(b,a))},rotateDeg:function(a){return this.rotate(a*0.0174532925199433)},scaleU:function(a){return this._t(a,0,0,a,0,0)},scale:function(a,b){return this._t(a,0,0,b,0,0)},scaleX:function(a){return this._t(a,0,0,1,0,0)},scaleY:function(a){return this._t(1,0,0,a,0,0)},shear:function(a,b){return this._t(1,b,a,1,0,0)},shearX:function(a){return this._t(1,0,a,1,0,0)},shearY:function(a){return this._t(1,a,0,1,0,0)},skew:function(a,b){return this.shear(Math.tan(a),Math.tan(b))},skewX:function(a){return this.shearX(Math.tan(a))},skewY:function(a){return this.shearY(Math.tan(a))},setTransform:function(g,h,i,j,k,l){var m=this;m.a=g;m.b=h;m.c=i;m.d=j;m.e=k;m.f=l;return m._x()},translate:function(a,b){return this._t(1,0,0,1,a,b)},translateX:function(a){return this._t(1,0,0,1,a,0)},translateY:function(a){return this._t(1,0,0,1,0,a)},transform:function(b,d,f,h,j,l){var m=this,a=m.a,c=m.b,e=m.c,g=m.d,i=m.e,k=m.f;m.a=a*b+e*d;m.b=c*b+g*d;m.c=a*f+e*h;m.d=c*f+g*h;m.e=a*j+e*l+i;m.f=c*j+g*l+k;return m._x()},divide:function(b){if(!b.isInvertible()){throw"Input matrix is not invertible"}var a=b.inverse();return this._t(a.a,a.b,a.c,a.d,a.e,a.f)},divideScalar:function(a){var b=this;b.a/=a;b.b/=a;b.c/=a;b.d/=a;b.e/=a;b.f/=a;return b._x()},inverse:function(){if(this.isIdentity()){return new Matrix()}else{if(!this.isInvertible()){throw"Matrix is not invertible."}else{var p=this,g=p.a,h=p.b,i=p.c,j=p.d,l=p.e,n=p.f,o=new Matrix(),k=g*j-h*i;o.a=j/k;o.b=-h/k;o.c=-i/k;o.d=g/k;o.e=(i*n-j*l)/k;o.f=-(g*n-h*l)/k;return o}}},interpolate:function(c,e,a){var d=this,b=a?new Matrix(a):new Matrix();b.a=d.a+(c.a-d.a)*e;b.b=d.b+(c.b-d.b)*e;b.c=d.c+(c.c-d.c)*e;b.d=d.d+(c.d-d.d)*e;b.e=d.e+(c.e-d.e)*e;b.f=d.f+(c.f-d.f)*e;return b._x()},interpolateAnim:function(e,j,a){var d=a?new Matrix(a):new Matrix(),b=this.decompose(),c=e.decompose(),k=b.translate,g=b.scale,f=b.rotation+(c.rotation-b.rotation)*j,l=k.x+(c.translate.x-k.x)*j,n=k.y+(c.translate.y-k.y)*j,h=g.x+(c.scale.x-g.x)*j,i=g.y+(c.scale.y-g.y)*j;d.translate(l,n);d.rotate(f);d.scale(h,i);return d._x()},decompose:function(w){var l=this,e=l.a,h=l.b,i=l.c,j=l.d,f=Math.acos,g=Math.atan,u=Math.sqrt,m=Math.PI,v={x:l.e,y:l.f},o=0,q={x:1,y:1},t={x:0,y:0},k=e*j-h*i;if(w){if(e){t={x:g(i/e),y:g(h/e)};q={x:e,y:k/e}}else{if(h){o=m*0.5;q={x:h,y:k/h};t.x=g(j/h)}else{q={x:i,y:j};t.x=m*0.25}}}else{if(e||h){var n=u(e*e+h*h);o=h>0?f(e/n):-f(e/n);q={x:n,y:k/n};t.x=g((e*i+h*j)/(n*n))}else{if(i||j){var p=u(i*i+j*j);o=m*0.5-(j>0?f(-i/p):-f(i/p));q={x:k/p,y:p};t.y=g((e*i+h*j)/(p*p))}else{q={x:0,y:0}}}}return{scale:q,translate:v,rotation:o,skew:t}},determinant:function(){return this.a*this.d-this.b*this.c},applyToPoint:function(b,c){var a=this;return{x:b*a.a+c*a.c+a.e,y:b*a.b+c*a.d+a.f}},applyToArray:function(e){var a=0,d,b,c=[];if(typeof e[0]==="number"){b=e.length;while(a<b){d=this.applyToPoint(e[a++],e[a++]);c.push(d.x,d.y)}}else{for(;d=e[a];a++){c.push(this.applyToPoint(d.x,d.y))}}return c},applyToTypedArray:function(e,f){var a=0,d,b=e.length,c=f?new Float64Array(b):new Float32Array(b);while(a<b){d=this.applyToPoint(e[a],e[a+1]);c[a++]=d.x;c[a++]=d.y}return c},applyToContext:function(a){var b=this;a.setTransform(b.a,b.b,b.c,b.d,b.e,b.f);return b},isIdentity:function(){var a=this;return a._q(a.a,1)&&a._q(a.b,0)&&a._q(a.c,0)&&a._q(a.d,1)&&a._q(a.e,0)&&a._q(a.f,0)},isInvertible:function(){return !this._q(this.determinant(),0)},isValid:function(){return !this._q(this.a*this.d,0)},clone:function(c){var b=this,a=new Matrix();a.a=b.a;a.b=b.b;a.c=b.c;a.d=b.d;a.e=b.e;a.f=b.f;if(!c){a.context=b.context}return a},isEqual:function(a){var b=this,c=b._q;return c(b.a,a.a)&&c(b.b,a.b)&&c(b.c,a.c)&&c(b.d,a.d)&&c(b.e,a.e)&&c(b.f,a.f)},toArray:function(){var a=this;return[a.a,a.b,a.c,a.d,a.e,a.f]},toTypedArray:function(d){var b=d?new Float64Array(6):new Float32Array(6),c=this;b[0]=c.a;b[1]=c.b;b[2]=c.c;b[3]=c.d;b[4]=c.e;b[5]=c.f;return b},toCSS:function(){return"matrix("+this.toArray()+")"},toCSS3D:function(){var a=this;return"matrix3d("+a.a+","+a.b+",0,0,"+a.c+","+a.d+",0,0,0,0,1,0,"+a.e+","+a.f+",0,1)"},toJSON:function(){var a=this;return'{"a":'+a.a+',"b":'+a.b+',"c":'+a.c+',"d":'+a.d+',"e":'+a.e+',"f":'+a.f+"}"},toString:function(){return""+this.toArray()},_q:function(a,b){return Math.abs(a-b)<1e-14},_x:function(){var a=this;if(a.context){a.context.setTransform(a.a,a.b,a.c,a.d,a.e,a.f)}return a}};if(typeof exports!=="undefined"){exports.Matrix=Matrix};
// namespace of Context2DTracked
(function(namespace){
	function Transform() {
		// start as the identity transformation
		this.val = [[1,0,0],
					[0,1,0],
					[0,0,1]];
	}
	// class definition on the namespace (probably global)
	namespace.Context2DTracked = function(target){
		// target is Canvas Context2D that will be wrapped and tracked
		this.context = target;

		this.tf = [new Matrix(target)];	// keep track of transformations

		// tracking where the current pen is on the canvas
		this.penx = 0;
		this.peny = 0;
		// at the beginning of the path
		this.justBegun = false;
		this.bpenx = 0;
		this.bpeny = 0;

		// scaling
		this.scalex = 1;
		this.scaley = 1;

		// translate
		this.ox = 0;
		this.oy = 0;

		// for fine control of when to show controls
		this.showcontrol = false;

		
		// "inherit" methods and properties from Context
		var origProps = Object.getOwnPropertyNames(target.__proto__);
		for (var i = 0; i < origProps.length; i++) {
			var p = origProps[i];
			if (typeof target[p] === "function") {
				this[p] = target[p].bind(target);
			}
			// make sure to access only 1 copy of the data
			else {
				Object.defineProperty(this, p, {
					get: function(p) {return target[p];}.bind(null, p),
					set: function(p,v) {return target[p] = v;}.bind(null, p)
				});
			}
		}

		// transformation handling
		this.save = function() {
			this.tf.push(this.tf.last().clone());
			target.save();
		}
		this.restore = function() {
			this.tf.pop();
			target.restore();
		}
		this.transformPoint = function(x, y) {
			// transforms a point into context coordinates
			var invtf = this.tf.last().inverse();
			return invtf.applyToPoint(x,y);
		}
		this.scale = function(x, y) {
			this.tf.last().scale(x,y);
			// target.scale(x,y);
		}
		this.translate = function(x, y) {
			// this.ox += x;
			// this.oy += y;
			// target.translate(x,y);
			this.tf.last().translate(x,y);
		}
		this.rotate = function(angle) {
			// target.rotate(angle);
			this.tf.last().rotate(angle);
		}
		this.movePen = function(x,y) {
			if (this.justBegun) {
				this.justBegun = false;
				this.bpenx = x;
				this.bpeny = y;
			}
			this.penx = x;
			this.peny = y;
		}

		// methods that change pen position will be overriden
		this.beginPath = function() {
			this.justBegun = true;
			target.beginPath();
		}
		this.moveTo = function(x,y) {
			this.movePen(x,y);
			target.moveTo(x,y);
		}
		this.lineTo = function(x,y, r) {
			if (r || this.showcontrol) {
				if (isNaN(r)) r = 2;
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y}
				}, {
					controlLine: {color:"rgb(200,100,100)", width:r/2},
					point: {color:"rgb(200,50,50)", fill:"white", width:r, radius:r},					
				});
			}
			target.lineTo(x,y);
			this.movePen(x,y);
		}

		this.bezierCurveTo = function(cpx1,cpy1,cpx2,cpy2,x,y, r) {
			if (r || this.showcontrol) {
				if (isNaN(r)) r = 2;	// radius of points to draw with
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y},
					cp1: {x:cpx1, y:cpy1},
					cp2: {x:cpx2, y:cpy2},
				}, {
					controlLine: {color:"rgb(200,100,100)", width:r/2},
					point: {color:"rgb(200,50,50)", fill:"white", width:r, radius:r},
				});
			}
			// rest of curve
			target.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
			this.movePen(x,y);
		}
		this.quadraticCurveTo = function(cpx, cpy, x, y, r) {
			if (r || this.showcontrol) {
				if (isNaN(r)) r = 2;
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y},
					cp1: {x:cpx, y:cpy},
				}, {
					controlLine: {color:"#C00", width:r/2},
					point: {color:"#C00", fill:"white", width:r, radius:r},					
				});
			}

			// rest of curve
			target.quadraticCurveTo(cpx, cpy, x, y);
			this.movePen(x,y);
		}
		this.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
			// first move to starting location using a bit of trig
			var sx = x + Math.cos(startAngle)*radius,
				sy = y + Math.sin(startAngle)*radius;
			this.movePen(sx,sy);
			// draw arc
			target.arc(x,y,radius,startAngle,endAngle,anticlockwise);

			var ex = x + Math.cos(endAngle)*radius,
				ey = y + Math.sin(endAngle)*radius;
			this.movePen(ex,ey);
			// bug? fills to the start of the path, but the continuation for the next part of the line is actually the end point
			this.bpenx = ex;
			this.bpeny = ey;
		}
		this.ellipse = function(x, y, rx, ry, rot, sa, ea, anticlockwise) {
			if (target.ellipse) target.ellipse.apply(target, arguments);
			else {
				// polyfill
			    this.save();
			    this.translate(x, y);
			    this.rotate(rot);
			    this.scale(rx, ry);
			    this.arc(0, 0, 1, sa, ea, anticlockwise);
			    this.restore();				
			}
		}
		this.arcTo = function(x1, y1, x2, y2, radius) {
			// Don't use this please; no idea how to calculate the ending location...
			target.arcTo(x1, y1, x2, y2, radius);
		}

		// fill always draws straight line to point starting the path
		this.fill = function() {
			this.movePen(this.bpenx, this.bpeny);
			target.fill.apply(target, arguments);
		}
		this.clip = function() {
			this.movePen(this.bpenx, this.bpeny);
			target.clip.apply(target, arguments);
		}


		// debugging functions
		this.trace = function() {
			var x = this.penx, y = this.peny;
			console.log(Math.round(x*10)/10 + this.ox, Math.round(y*10)/10 + this.oy);
			// assume path has begun
			target.moveTo(x-5,y);
			target.lineTo(x+5,y);
			target.moveTo(x,y+5);
			target.lineTo(x,y-5);
			target.moveTo(x,y);
		}		
		this.drawCurveControl = function(point, style) {
			target.save();
			// assume path has already begun

			var ptprint = [point.p1];
			// draw control lines
			target.strokeStyle = style.controlLine.color;
			target.lineWidth = style.controlLine.width;
			if (point.cp1) {
				target.moveTo(point.p1.x, point.p1.y);
				target.lineTo(point.cp1.x, point.cp1.y);
				ptprint.push(point.cp1);
				if (point.cp2) {
					// 2 control points, cubic bezier
					target.lineTo(point.cp2.x, point.cp2.y);
					target.lineTo(point.p2.x, point.p2.y);
					ptprint.push(point.cp2);
				}
				else {
					target.lineTo(point.p2.x, point.p2.y);
				}
			}
			target.stroke();
			ptprint.push(point.p2);

			// control points
			for (var i = 0; i < ptprint.length; ++i) {
				var p = ptprint[i];
				ptprint[i] = "("+Math.round(ptprint[i].x*10)/10+", "+Math.round(ptprint[i].y*10)/10+")";
				target.lineWidth = style.point.width;
				target.strokeStyle = style.point.color;
				target.fillStyle = style.point.fill;
				target.beginPath();
				target.arc(p.x, p.y, style.point.radius, 0, 2*Math.PI, true)
				
				target.fill();
				target.font = style.point.radius*4+"px arial";
				target.fillStyle = "black";
				target.fillText(i+1, p.x, p.y+style.point.radius*5);
				target.stroke();				
			}
			console.log("from points",ptprint.join(" to "));

			target.restore();
			target.beginPath();	// return to previously open path
			target.moveTo(point.p1.x, point.p1.y);

		}
	};
	
}.call(window, window));"use strict";
// ---- UTILITY functions

var da = (function(da){

// twine test function
if (typeof State !== 'undefined') {
(function () {
	window.TEST_MODE = $("tw-storydata")
		.attr("options")
		.splitOrEmpty(/\s+/)
		.includes("debug");
})();	
}
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return (this.length)? this[this.length-1] : null;
  }
}
if (!Array.prototype.extend) {
  Array.prototype.extend = function(b) {
    this.push.apply(this, b);
  }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}
da.extractRGB = function(rgbString) {
	var rgb = /rgb\((\d+)\s*,(\d+)\s*,(\d+)\s*\)/.exec(rgbString);
	if (rgb) {
		return {r:parseInt(rgb[1]), g:parseInt(rgb[2]), b:parseInt(rgb[3])};
	}
	return null;
};

da.clamp = function(num, min, max) {
  return num < min ? min : num > max ? max : num;
};

da.roundToDec = function(num, numDecimals) {
  numDecimals = numDecimals || 1;
  return Math.round(num*Math.pow(10,numDecimals))/Math.pow(10,numDecimals);
};

da.RLE = function(s) {
  // simple run length encoding for images (4 characters at a time)
  var shortests = String.fromCharCode(0)+s;

  // try encoding multiples of 4 (repetitions could be at different intervals)
  // try subpixel encoding first ()
  for (var j = 1; j < 41;) {
    // first character to indicate how many pixels is a pattern
    var ss = String.fromCharCode(j);
    var c = s.slice(0,j);
    var repeat = 1;

    var i = j;
    for (var len = s.length; i < len; i+=j) {
      // base64 can only handle up to 255
      if (c !== s.slice(i,i+j) || repeat === 255) {
        ss += String.fromCharCode(repeat)+c;
        repeat = 1;
        c = s.slice(i,i+j);
      }
      else {
        ++repeat;
      }
    }
    // was still repeating a sequence at the end
    if (c === s.slice(s.length-j))
      ss += String.fromCharCode(repeat)+c;
    // copy over the end (number of total pixels doesn't divide 4*stride evenly)
    else if (i > s.length-1)
      ss += String.fromCharCode(1)+s.slice(i-j);

    console.log("RLE over",j,"stride -- compressed",ss.length, "original", s.length);
    if (ss.length < shortests.length) shortests = ss;
    // after subpixel encoding, increment by a pixel
    if (j === 1) j = 4;
    else j += 4;
  }
  // actually smaller to keep original string
  return shortests;
}

da.RLD = function(ss) {
  // simple run length decoding
  var stride = ss.charCodeAt(0);
  if (stride === 0) return ss.slice(1);

  var s = "";
  for (var i = 1, len = ss.length; i < len; i += 1+stride) {
    s += ss.slice(i+1,i+1+stride).repeat(ss.charCodeAt(i));
  }
  console.log("decoded length",s.length);
  return s;
}

// zigurat algorithm, from https://www.filosophy.org/post/35/normaldistributed_random_values_in_javascript_using_the_ziggurat_algorithm/
function Ziggurat(){
  var jsr = 123456789;
  var wn = Array(128);
  var fn = Array(128);
  var kn = Array(128);
  function RNOR(){
    var hz = SHR3();
    var iz = hz & 127;
    return (Math.abs(hz) < kn[iz]) ? hz * wn[iz] : nfix(hz, iz);
  }
  this.nextGaussian = function(){
    return RNOR();
  }
  function nfix(hz, iz){
    var r = 3.442619855899;
    var r1 = 1.0 / r;
    var x;
    var y;
    while(true){
      x = hz * wn[iz];
      if( iz == 0 ){
        x = (-Math.log(UNI()) * r1); 
        y = -Math.log(UNI());
        while( y + y < x * x){
          x = (-Math.log(UNI()) * r1); 
          y = -Math.log(UNI());
        }
        return ( hz > 0 ) ? r+x : -r-x;
      }

      if( fn[iz] + UNI() * (fn[iz-1] - fn[iz]) < Math.exp(-0.5 * x * x) ){
         return x;
      }
      hz = SHR3();
      iz = hz & 127;
 
      if( Math.abs(hz) < kn[iz]){
        return (hz * wn[iz]);
      }
    }
  }

  function SHR3(){
    var jz = jsr;
    var jzr = jsr;
    jzr ^= (jzr << 13);
    jzr ^= (jzr >>> 17);
    jzr ^= (jzr << 5);
    jsr = jzr;
    return (jz+jzr) | 0;
  }

  function UNI(){
    return 0.5 * (1 + SHR3() / -Math.pow(2,31));
  }

  function zigset(){
    // seed generator based on current time
    jsr ^= new Date().getTime();

    var m1 = 2147483648.0;
    var dn = 3.442619855899;
    var tn = dn;
    var vn = 9.91256303526217e-3;
    
    var q = vn / Math.exp(-0.5 * dn * dn);
    kn[0] = Math.floor((dn/q)*m1);
    kn[1] = 0;

    wn[0] = q / m1;
    wn[127] = dn / m1;

    fn[0] = 1.0;
    fn[127] = Math.exp(-0.5 * dn * dn);

    for(var i = 126; i >= 1; i--){
      dn = Math.sqrt(-2.0 * Math.log( vn / dn + Math.exp( -0.5 * dn * dn)));
      kn[i+1] = Math.floor((dn/tn)*m1);
      tn = dn;
      fn[i] = Math.exp(-0.5 * dn * dn);
      wn[i] = dn / m1;
    }
  }
  zigset();
}

// instantiate the generator
var randZig;
da.randNormal = function(mean, stdev) {
	// pseudo random approximate
	// standard normal: mean 0 and std 1
	if (!randZig) randZig = new Ziggurat();
	return randZig.nextGaussian()*stdev + mean;
};
da.testRandGenerator = function(n) {
	var histogram = {};	// buckets with each key being an integer mapping to the number of occurances
	for (var i = -100; i < 101; ++i) 
		histogram[i] = 0;

	var v;
	while (n-- > 0) {
		v = Math.round(randNormal(10,20));
		++histogram[v];
	}

	var str = [];
	for (i in histogram) {
		str.push(""+i+"\t"+histogram[i]);
	}
	console.log(str.join("\n"));
};

// drawing related
da.splitBezier = function(points, t) {
	// split a cubic bezier based on De Casteljau, t is between [0,1]
	var A = points.p1, B = points.cp1, C = points.cp2, D = points.p2;
	var E = {x:A.x*(1-t) + B.x*t, y:A.y*(1-t) + B.y*t};
	var F = {x:B.x*(1-t) + C.x*t, y:B.y*(1-t) + C.y*t};
	var G = {x:C.x*(1-t) + D.x*t, y:C.y*(1-t) + D.y*t};
	var H = {x:E.x*(1-t) + F.x*t, y:E.y*(1-t) + F.y*t};
	var J = {x:F.x*(1-t) + G.x*t, y:F.y*(1-t) + G.y*t};
	var K = {x:H.x*(1-t) + J.x*t, y:H.y*(1-t) + J.y*t};
	return {left:{p1:A, cp1:E, cp2:H, p2:K},
			right:{p1:K, cp1:J, cp2:G, p2:D}};
};
da.splitQuadratic = function(points, t) {
	// split a quadratic bezier based on De Casteljau, t is between [0,1]
	var A = points.p1, B = points.cp1, C = points.p2;
	var D = {x:A.x*(1-t) + B.x*t, y:A.y*(1-t) + B.y*t};
	var E = {x:B.x*(1-t) + C.x*t, y:B.y*(1-t) + C.y*t};
	var F = {x:D.x*(1-t) + E.x*t, y:D.y*(1-t) + E.y*t};

	return {left:{p1:A, cp1:D, p2:F},
			right:{p1:F, cp1:E, p2:C}};
};
da.splitLinear = function(points, t) {
  // split a linear line
  var A = points.p1, B = points.p2;
  var C = {x:A.x*t + B.x*(1-t), y:A.y*t + B.y*(1-t)};
  return {left:{p1:A, p2:C},
      right:{p1:C, p2:B}};
}
da.splitCurve = function(startp, endp, t) {
  // split either a quadratic or bezier curve depending on number of control points on endp
  if (endp.hasOwnProperty("cp2")) {
    return da.splitBezier({p1:startp, p2:endp, cp1:endp.cp1, cp2:endp.cp2}, t);
  }
  else if (endp.hasOwnProperty("cp1")) {
    return da.splitQuadratic({p1:startp, p2:endp, cp1:endp.cp1}, t);
  }
  else {
    return da.splitLinear({p1:startp, p2:endp}, t);
  }
}
da.adjustPoint = function(point, dx, dy) {
  // return a point with x and y adjusted by dx and dy respectively
  var movedPoint = Object.assign({},point);
  movedPoint.x += dx;
  movedPoint.y += dy;
  if (movedPoint.cp1) {
    movedPoint.cp1.x += dx;
    movedPoint.cp1.y += dy;    
  }
  if (movedPoint.cp2) {
    movedPoint.cp2.x += dx;
    movedPoint.cp2.y += dy;    
  }
  return movedPoint;
}
da.averagePoint = function(p1, p2) {
  return {x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2};
}
da.diff = function(p1, p2) {
  return {x:p1.x-p2.x, y:p1.y-p2.y};
}

// utility and higher level functions for drawing clothes

/** set stroke and fill to potentially be functions */
da.setStrokeAndFill = function(ctx, stroke, fill) {
    if (typeof stroke === "function")
      ctx.strokeStyle = stroke(ctx);
    else
      ctx.strokeStyle = stroke;
    if (typeof fill === "function")
      ctx.fillStyle = fill(ctx);
    else 
      ctx.fillStyle = fill;
}

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
  if (!fill) fill = "rgba(0,0,0,0)";
  function draw(ctx, ex, mods) {
    ctx.save();

    ctx.lineWidth = lineWidth;
    da.setStrokeAndFill(ctx, stroke, fill);


    ctx.save(); // drawHalf might change style in itself
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





return da;
}(da || {}));
var da = (function(da){

da.femaleNames = "Aaliyah Aarushi Abagail Abbey Abbi Abbie Abby Abi Abia Abigail Abree Abrianna Abrielle Aby Acacia Ada Adalia Adaline Adalyn Addie Addilyn Addison Adelaide Adele Adelene Adelia Adelina Adeline Adelynn Adreanna Adriana Adrianna Adrianne Adrienne Ady Aerona Agatha Aggie Agnes Aida Aileen Ailsa Aimee Aine Ainsleigh Ainsley Aisha Aisling Aislinn Aislynn Alaina Alana Alanis Alanna Alannah Alaska Alayah Alayna Alba Albany Alberta Aleah Alecia Aleisha Alejandra Alena Alessandra Alessia Alex Alexa Alexandra Alexandria Alexia Alexis Alexus Ali Alia Alice Alicia Alina Alisa Alisha Alison Alissa Alivia Aliyah Aliza Alize Alka Allie Allison Ally Allyson Alma Alondra Alya Alycia Alyshialynn Alyson Alyssa Alyssia Amalia Amanda Amandine Amani Amara Amari Amaris Amaryllis Amaya Amber Amberly Amelia Amelie America Amethyst Amie Amina Amirah Amity Amy Amya Ana Anabel Anabelle Anahi Anais Anamaria Ananya Anastasia Andie Andrea Andromeda Angel Angela Angelia Angelica Angelina Angeline Angelique Angie Anika Anisa Anissa Anita Aniya Aniyah Anjali Ann Anna Annabel Annabella Annabelle Annabeth Annalisa Annalise Annamaria Anne Anneke Annemarie Annette Annie Annika Annmarie Anthea Antoinette Antonia Anuja Anusha Anushka Anwen Anya Aoibhe Aoibheann Aoife Aphrodite Apple April Aqua Arabella Arabelle Arden Aria Ariadne Ariana Arianna Arianne Ariel Ariella Arielle Arisha Arleen Arlene Arlette Artemis Arwen Arya Asha Ashanti Ashe Ashia Ashlee Ashleigh Ashley Ashlie Ashlyn Ashlynn Ashton Ashtyn Ashvini Asia Asma Aspen Aster Astra Astrid Athalia Athena Athene Atlanta Aubreanna Aubree Aubrey Aubriana Aubrielle Audra Audrey Audriana Audrina Augustina Aura Aurelia Aurora Autumn Ava Avaline Avalon Avery Avia Avriella Avril Aya Ayana Ayanna Ayesha Ayisha Ayla Azalea Azaria Azariah Bailey Barbara Barbie Bay Baylee Bea Beatrice Beatrix Becca Beccy Becky Belinda Bella Bellatrix Belle Benita Berenice Bernadette Bernice Bertha Beryl Bess Bessie Beth Bethan Bethanie Bethany Betsy Bettina Betty Bev Beverly Beyonce Bianca Billie Blair Blaire Blake Blakely Blanche Blaze Blessing Bliss Bloom Blossom Blythe Bobbi Bobbie Bobby Bonita Bonnie Bonquesha Braelyn Brandi Brandy Braylee Brea Breanna Bree Breeze Brenda Brenna Bria Briana Brianna Brianne Briar Bridget Bridgette Bridie Brie Briella Brielle Brigid Brigitte Briley Brinley Briony Brisa Bristol Britney Britt Brittany Brittney Brodie Brogan Bronagh Bronte Bronwen Bronwyn Brook Brooke Brooklyn Brooklynn Bryanna Brylee Bryleigh Bryn Brynlee Brynn Bryony Bunty Cadence Caila Cailin Caitlan Caitlin Caitlyn Caleigh Cali Calista Callie Calliope Callista Calypso Cambree Cambria Cameron Cami Camila Camilla Camille Campbell Camry Camryn Candace Candice Candis Candy Caoimhe Caprice Cara Carenza Carina Caris Carissa Carla Carlene Carley Carlie Carlotta Carly Carlyn Carlynn Carmel Carmela Carmen Carol Carole Carolina Caroline Carolyn Carrie Carter Carys Casey Cassandra Cassia Cassidy Cassie Cassiopeia Cat Catalina Catarina Cate Caterina Cathalina Catherine Cathleen Cathryn Cathy Catlin Catrina Catriona Cayla Cayleigh Ceanna Cece Cecelia Cecile Cecilia Cecily Celeste Celestia Celestine Celia Celina Celine Celise Ceri Cerise Cerys Chanel Chanelle Chantal Chantelle Charis Charissa Charity Charla Charlene Charlette Charley Charlie Charlize Charlotte Charmaine Chastity Chelsea Chelsey Chenai Chenille Cher Cheri Cherie Cherry Cheryl Cheyanne Cheyenne Chiara Chloe Chole Chris Chrissy Christa Christabel Christal Christen Christi Christiana Christiane Christie Christina Christine Christy Chrysanthemum Chrystal Chyanne Ciara Cicely Cici Ciel Cierra Cindy Clair Claire Clara Clarabelle Clare Clarice Claris Clarissa Clarisse Clarity Clary Claudette Claudia Claudine Clea Clemence Clementine Cleo Cleopatra Clodagh Cloe Clotilde Clover Coco Coleen Colette Colleen Connie Constance Cora Coral Coralie Coraline Cordelia Corey Cori Corina Corinne Cornelia Corra Cosette Courtney Cressida Cristal Cristina Crystal Cyndi Cynthia Dacia Dagmar Dahlia Daina Daisy Dakota Damaris Dana Danette Dani Danica Daniela Daniella Danielle Danika Daphne Dara Darby Darcey Darcie Darcy Daria Darla Darlene Dasia Davida Davina Dawn Dayle Dayna Daysha Deana Deandra Deann Deanna Deanne Deb Debbie Debby Debora Deborah Debra Dede Dee Deedee Deena Deidre Deirdre Deja Delana Delaney Delanie Delany Delia Delilah Delina Della Delores Delphine Demetria Demi Dena Denice Denise Denny Derica Desiree Dessa Destinee Destiny Diamond Diana Diane Dianna Dianne Didi Dido Dilys Dina Dinah Dionne Dior Dixie Dolly Dolores Dominique Donna Dora Doreen Doriana Dorinda Doris Dorla Dorothy Dot Dottie Drew Dulce Dusty Dympna Eabha Ebony Echo Eden Edie Edith Edlyn Edna Edwina Effie Eibhlin Eileen Eilidh Eimear Eireann Eisley Elaina Elaine Elana Eleanor Electra Elektra Elen Elena Eleonora Eliana Elicia Elida Elin Elina Elinor Elisa Elisabeth Elise Eliza Elizabeth Ella Elle Ellen Ellery Elliana Ellie Ellis Elly Elodie Elody Eloise Elora Elouise Elsa Elsie Elspeth Elva Elvina Elvira Elysia Elyza Emanuela Ember Emelda Emelia Emeline Emely Emer Emerald Emerson Emery Emi Emilee Emilia Emilie Emily Emma Emmalee Emmaline Emmalyn Emmanuelle Emmeline Emmie Emmy Ena Enid Enna Enya Erica Erika Erin Eris Ernestine Eryn Esmay Esme Esmeralda Esparanza Esperanza Estee Estelle Ester Esther Estrella Ethel Eudora Eugenie Eunice Eva Evaline Evangelina Evangeline Eve Evelin Evelina Evelyn Everly Evie Evita Ezmae Fabienne Fabrizia Faith Fallon Fanny Farah Farrah Fatima Fawn Fay Faye Felicia Felicity Fern Fernanda Ffion Fia Fifi Fion Fiona Fiora Fleur Flick Flo Flora Florence Floss Fran Frances Francesca Francine Francoise Frankie Freda Frederica Freya Frida Gabby Gabriela Gabriella Gabrielle Gail Garnet Gayle Gaynor Geena Gemma Gena Genesis Genevieve Genna Georgette Georgia Georgie Georgina Geraldine Germaine Gert Gertrude Gia Gianna Gigi Gilda Gillian Gina Ginger Ginnie Ginny Giovanna Gisela Giselle Gisselle Gladys Glenda Glenys Gloria Glynis Golda Goldie Grace Gracelyn Gracie Grainne Greta Gretchen Griselda Guadalupe Guinevere Gwen Gwendolyn Gwyneth Gwynn Habiba Hadley Hailee Hailey Haleigh Haley Halle Hallie Hanna Hannah Harley Harmony Harper Harriet Hattie Haven Hayden Haylee Hayley Hazel Hazeline Heather Heaven Heidi Helen Helena Helene Helga Helina Henrietta Hepsiba Hera Hermine Hermione Hester Hetty Hilary Hilda Hildegard Hillary Hollie Holly Honesty Honey Honor Honour Hope Hortense Hyacinth Ianthe Ida Ila Ilene Iliana Ilona Ilse Imani Imelda Immy Imogen Ina India Indie Indigo Indira Ines Ingrid Iona Ira Irena Irene Irina Iris Irma Isa Isabel Isabell Isabella Isabelle Isadora Isha Isidora Isis Isla Isobel Isolde Itzel Ivana Ivy Iyanna Izabella Izidora Izzie Izzy Jacinda Jacinta Jackie Jacqueline Jacquelyn Jada Jade Jaden Jadyn Jaelynn Jaida Jaime Jaimie Jaina Jamie Jamiya Jan Jana Janae Jancis Jane Janelle Janessa Janet Janette Jania Janice Janie Janine Janis Janiya January Jaqueline Jasmin Jasmine Jaya Jayda Jayden Jayla Jayleen Jaylene Jaylinn Jaylynn Jayne Jazlyn Jazmin Jazmine Jazz Jean Jeana Jeanette Jeanine Jeanna Jeanne Jeannette Jeannie Jeannine Jemima Jemma Jen Jena Jenelle Jenessa Jenna Jennette Jenni Jennie Jennifer Jenny Jensen Jeraldine Jeri Jerri Jeslyn Jess Jessa Jesse Jessica Jessie Jet Jewel Jill Jillian Jina Jo Joan Joann Joanna Joanne Jocelyn Jodi Jodie Jody Joelle Johanna Jojo Joleen Jolene Jolie Joni Jordan Jordana Jordyn Jorja Joseline Joselyn Josephine Josie Journey Joy Joya Joyce Juanita Jude Judith Judy Jules Julia Juliana Julianna Julianne Julie Julienne Juliet Juliette Julissa July Juna June Juniper Juno Justice Justina Justine Kacey Kadence Kaelyn Kaidence Kailey Kailyn Kaitlin Kaitlyn Kaitlynn Kalea Kaleigh Kali Kalia Kalin Kalista Kaliyah Kallie Kamala Kami Kamryn Kaori Kara Karen Kari Karin Karina Karis Karissa Karla Karlee Karly Karolina Karyn Kasey Kassandra Kassidy Kassie Kat Katara Katarina Kate Katelyn Katelynn Katerina Katharine Katherine Kathleen Kathryn Kathy Katia Katie Katlyn Katniss Katrin Katrina Katy Katya Kay Kaya Kayden Kaydence Kaye Kayla Kaylee Kayleigh Kayley Kaylie Kaylin Keana Keara Keeley Keely Keira Keisha Kelis Kelley Kelli Kellie Kelly Kelsey Kelsie Kendall Kendra Kenley Kenna Kennedy Kensey Kenzie Kera Keri Kerian Kerri Kerry Khloe Kia Kiana Kiara Kiera Kierra Kiersten Kiki Kiley Kim Kimberlee Kimberley Kimberly Kimbriella Kimmy Kinley Kinsey Kinsley Kira Kirsten Kirstin Kirsty Kit Kitty Kizzy Kloe Kora Kori Kourtney Kris Krista Kristen Kristi Kristie Kristin Kristina Kristine Kristy Krystal Kya Kyla Kylee Kyleigh Kylie Kyra Lacey Lacie Lacy Ladonna Laila Lainey Lakyn Lala Lana Laney Lara Larissa Lark Latoya Laura Laurel Lauren Lauretta Laurie Lauryn Lavana Lavender Lavinia Layla Lea Leah Leandra Leann Leanna Leanne Leda Lee Leela Leena Leia Leigh Leigha Leila Leilani Lela Lena Lenora Lenore Leona Leonie Leonora Leora Lesley Leslie Lesly Leticia Letitia Lettie Lexi Lexia Lexie Lexis Leyla Lia Liah Liana Lianne Liara Libbie Libby Liberty Lidia Liesl Lila Lilac Lilah Lili Lilian Liliana Lilita Lilith Lillia Lillian Lillie Lilly Lily Lina Linda Lindsay Lindsey Lindy Lisa Lisette Liv Livia Livvy Liz Liza Lizbeth Lizette Lizzie Lizzy Logan Lois Lola Lolita London Lora Loran Lorelei Loren Lorena Loretta Lori Lorie Lorna Lorraine Lorri Lorrie Lottie Lotus Lou Louella Louisa Louise Lourdes Luann Lucia Luciana Lucie Lucille Lucinda Lucky Lucretia Lucy Luisa Lulu Luna Lupita Luz Lydia Lyla Lynda Lyndsey Lynette Lynn Lynne Lynnette Lynsey Lyra Lyric Mabel Macey Macie Mackenzie Macy Madalyn Maddie Maddison Maddy Madeleine Madeline Madelyn Madge Madison Madisyn Madonna Madyson Mae Maeve Magda Magdalena Magdalene Maggie Maia Maira Maire Mairead Maisie Maisy Maja Makayla Makenna Makenzie Malala Maleah Malena Malia Malina Malinda Mallory Malory Mandy Manuela Mara Marcela Marcella Marcelle Marci Marcia Marcie Marcy Margaret Margarita Margaux Marge Margery Margie Margo Margot Margret Maria Mariah Mariam Marian Mariana Marianna Marianne Maribel Marie Mariela Mariella Marilyn Marina Marion Maris Marisa Marisol Marissa Maritza Marjorie Marla Marlee Marlena Marlene Marley Marnie Marsha Martha Martina Mary Maryam Maryann Marybeth Maryjane Masie Mathilda Mathilde Matilda Mattie Maude Maura Maureen Mavis Maxime Maxine May Maya Maybell Mazie Mckayla Mckenna Mckenzie Mea Meadow Meagan Meera Meg Megan Meghan Mei Mel Melanie Melina Melinda Melissa Melody Melvina Mercedes Mercy Meredith Merida Merissa Meryl Mia Michaela Michele Michelle Mika Mikaela Mikayla Mikhaela Mila Mildred Milena Miley Millicent Millie Milly Mim Mimi Mina Mindy Minerva Minnie Mira Mirabel Mirabelle Miracle Miranda Miriam Mirielle Missie Misty Mitzi Modesty Moira Mollie Molly Mona Monica Monika Monique Monroe Montana Montserrat Morag Morgan Morgana Moxie Moya Muriel Mya Myfanwy Myla Myra Myrna Myrtle Nadene Nadia Nadine Naja Nala Nana Nancy Nanette Naomi Natalia Natalie Natasha Naya Nayeli Nell Nellie Nelly Nena Nerissa Nerys Nessa Netty Nevaeh Neve Neveah Nia Niamh Nichola Nichole Nicki Nicky Nicola Nicole Nicolette Nieve Nigella Niki Nikita Nikki Nila Nina Nisha Nishka Nita Noella Noelle Noely Noemi Nola Nora Norah Noreen Norma Nova Nyla Oasis Ocean Oceana Octavia Odalis Odalys Odele Odelia Odette Olga Olive Olivia Olwen Olwyn Oona Oonagh Opal Ophelia Oprah Ora Oriana Orianna Orla Orlaith Page Paige Paisley Paloma Pam Pamela Pandora Pansy Paola Paris Patience Patrice Patricia Patsy Patti Patty Paula Paulette Paulina Pauline Payton Peace Pearl Peggy Penelope Penny Pepper Perla Perrie Persephone Petra Petunia Peyton Philippa Phillipa Philomena Phoebe Phoenix Phyllis Piper Pippa Pixie Polly Pollyanna Poppy Portia Precious Presley Preslie Primrose Princess Priscilla Priya Promise Prudence Prue Queenie Quiana Quinn Rabia Rachael Rachel Rachelle Racquel Rae Raegan Raelyn Raina Raine Ramona Ramsha Randi Rani Rania Raquel Raven Raya Rayna Rayne Reagan Reanna Reanne Rebecca Rebekah Reese Regan Regina Reilly Reina Remi Rena Renae Renata Rene Renee Renesmee Reyna Rhea Rhian Rhianna Rhiannon Rhoda Rhona Rhonda Ria Rianna Richelle Ricki Rihanna Rikki Riley Rina Rita River Riya Roanne Roberta Robin Robyn Rochelle Rocio Roisin Rolanda Ronda Roni Ronna Rosa Rosalie Rosalina Rosalind Rosalinda Rosalynn Rosamund Rosanna Rose Roseanne Rosella Roselle Rosemarie Rosemary Rosetta Rosie Rosita Roslyn Rosy Rowan Rowena Roxana Roxanne Roxie Roxy Rozlynn Ruby Rue Ruth Ruthie Ryanne Rydel Rylee Ryleigh Rylie Sabina Sabine Sable Sabrina Sade Sadhbh Sadie Saffron Safire Safiya Sage Sahara Saige Saira Sally Salma Salome Sam Samantha Samara Samia Samira Sammie Sammy Sandra Sandy Sania Saoirse Saphira Sapphire Sara Sarah Sarina Sariya Sascha Sasha Saskia Savanna Savannah Scarlet Scarlett Seanna Sebastianne Selah Selena Selene Selina Selma Senuri September Seren Serena Serenity Shaelyn Shakira Shamira Shana Shanaya Shani Shania Shannon Shantell Shari Sharon Shary Shauna Shawn Shawna Shawnette Shayla Shayna Shea Sheba Sheena Sheila Shelby Shelia Shelley Shelly Sheri Sheridan Sherri Sherrie Sherry Sheryl Shirley Shivani Shona Shonagh Shreya Shyann Shyla Sian Sidney Sienna Sierra Sigourney Silvia Simone Simran Sindy Sinead Siobhan Sissy Sky Skye Skylar Skyler Sloane Snow Sofia Sofie Sondra Sonia Sonja Sonya Sophia Sophie Sophy Sorrel Spring Stacey Staci Stacia Stacie Stacy Star Starla Stefanie Stella Steph Stephanie Sue Sugar Suki Summer Susan Susanna Susannah Susanne Susie Sutton Suzanna Suzanne Suzette Suzie Suzy Sybil Sydney Sylvia Sylvie Tabatha Tabitha Taelyn Tagan Tahlia Tailynn Tala Talia Talitha Taliyah Tallulah Tamara Tamera Tami Tamia Tamika Tammi Tammie Tammy Tamra Tamsin Tania Tanika Tanisha Tanya Tara Taryn Tasha Tasmin Tatiana Tatum Tawana Taya Tayah Tayla Taylah Tayler Taylor Teagan Teegan Tegan Teigan Tenille Teresa Teri Terri Terrie Terry Tess Tessa Thalia Thea Thelma Theodora Theresa Therese Thomasina Tia Tiana Tiara Tiegan Tiffany Tillie Tilly Tina Tisha Titania Toni Tonia Tonya Tora Tori Tracey Traci Tracie Tracy Tricia Trina Trinity Trish Trisha Trista Trixie Trixy Trudy Tula Tulip Tyra Ulrica Uma Una Ursula Val Valentina Valeria Valerie Valery Vanessa Veda Velma Venetia Venus Vera Verity Veronica Vesper Vicki Vickie Vicky Victoria Vienna Viola Violet Violetta Virginia Virginie Vivian Viviana Vivien Vivienne Wallis Wanda Waverley Wendi Wendy Whitney Wilhelmina Willa Willamina Willow Wilma Winifred Winnie Winnifred Winona Winter Wynne Wynona Xandra Xandria Xanthe Xaviera Xena Xenia Xia Ximena Xochil Xochitl Yara Yasmin Yasmina Yasmine Yazmin Yelena Yesenia Yessica Yolanda Ysabel Yula Yulissa Yvaine Yvette Yvonne Zada Zaheera Zahra Zaira Zakia Zali Zandra Zara Zaria Zaya Zayla Zelda Zelida Zelina Zena Zendaya Zia Zina Zita Ziva Zoe Zoey Zola Zora Zoya Zula Zuri Zyana".split(" ");

da.maleNames = "Aaron Abdul Abdullah Abe Abel Abraham Abram Abriel Ace Adair Adam Adan Addison Ade Aden Adnan Adonis Adrian Adriel Ahmad Ahmed Aidan Aiden Ainsley Ajay Al Alain Alan Alaric Alastair Albany Albert Alberto Albie Albus Alden Aldo Aldric Aldrin Alec Aled Alejandro Alen Alesandro Alex Alexander Alexis Alfie Alfonse Alfonso Alfred Alfredo Ali Alistair Allan Allen Alonzo Aloysius Alphonso Alton Alvin Amari Ambrose Amir Amit Amos Anand Anderson Andre Andreas Andres Andrew Andy Angel Angelo Angus Ansel Anson Anthony Anton Antonio Antony Apollo Aran Archer Archibald Archie Ari Arjun Arlo Arman Armando Arnie Arnold Aron Arran Arrie Art Arthur Arturo Arun Arwin Asa Asad Ash Ashby Asher Ashley Ashton Ashwin Aspen Aston Aswin Athan Atticus Aubrey Auden Audric Audwin August Augustus Austen Austin Aven Avery Avon Axel Ayaan Ayden Ayrton Bailey Barack Barclay Barnaby Barney Barrett Barron Barry Bart Bartholomew Basil Bastian Baxter Bay Baylor Bear Beau Beck Beckett Bellamy Ben Benedict Benjamin Benji Benjy Bennett Bennie Benny Benson Bentley Bently Benton Bernard Bernardo Bernie Bert Bertie Bertram Bev Bevan Bevin Bevis Bill Billy Bjorn Bladen Blain Blaine Blair Blaise Blake Blaze Blue Bob Bobby Bodie Bogdan Boris Boston Bowen Boyd Brad Braden Bradford Bradley Bradwin Brady Braeden Bram Branden Brandon Branson Brantley Braxton Bray Brayan Brayden Braydon Braylon Brayson Breck Breckin Brendan Brenden Brendon Brennan Brennon Brent Brentley Brenton Bret Brett Brevin Brevyn Brian Brice Bridie Brie Brig Brighton Brinley Brock Brod Broden Broderick Brodie Brody Brogan Bronson Brook Brooke Brooklyn Brooks Bruce Bruno Bryan Bryant Bryce Bryden Brydon Bryn Bryon Bryson Buck Buddy Burt Burton Buster Butch Byron Cadby Cade Caden Cael Caelan Caesar Cai Caiden Cain Caius Cal Cale Caleb Calhoun Callan Callen Callum Calum Calvin Cam Camden Cameron Campbell Camron Caolan Carey Carl Carlisle Carlos Carlton Carsen Carson Carsten Carter Cary Casey Cash Cason Casper Cassius Castiel Castor Cathal Cato Cavan Cayden Caydon Cayson Cecil Cedric Cesar Chad Chance Chandler Channing Charles Charley Charlie Charlton Chas Chase Chauncey Chayton Chaz Che Chesney Chester Chevy Chip Chris Christian Christopher Chuck Cian Ciaran Cillian Clancy Clarence Clark Claude Clay Clayton Clement Cletus Cliff Clifford Clifton Clint Clinton Clive Clovis Clyde Coby Cody Cohen Colby Cole Colin Collin Colm Colt Colten Colton Conan Conlan Conner Connor Conor Conrad Constantine Cooper Corbin Corey Cormac Cornelius Cory Craig Crispin Cristian Cristobal Crosby Cruz Cullen Curt Curtis Cuthbert Cyril Cyrus Dacey Daire Dakota Dale Dalen Dallas Dalon Dalton Damian Damien Damion Damon Dan Dana Dane Daniel Danny Dante Dara Daragh Darcy Daren Darian Darin Dario Darius Darnell Darragh Darrel Darrell Darren Darrin Darryl Darryn Darwin Daryl Dash Dashawn Dave David Davin Davion Davis Dawson Dax Daxon Daxter Daxton Daylen Dayton Deacon Dean Deandre Declan Deepak Delbert Delvin Demetrius Denis Dennis Denny Denver Denzel Deon Derek Derik Dermot Derrick Deshaun Deshawn Desmond Dev Devin Devlin Devon Devyn Dewayne Dewey Dexter Diarmuid Dick Dicky Diego Digby Dilan Dillon Dimitri Dinesh Dino Dion Dirk Dixon Django Dmitri Dominic Dominick Don Donal Donald Donnie Donovan Dorian Doug Dougie Douglas Doyle Drake Draven Drew Duane Dudley Duke Duncan Dustin Dwayne Dwight Dylan Eamon Earl Earnest Eason Easton Eben Ed Eddie Eddy Eden Edgar Edison Edmund Edouard Edric Edsel Edson Eduardo Edward Edwardo Edwin Efrain Efren Egan Egon Eli Elian Elias Elijah Eliot Elisha Ellington Elliot Elliott Ellis Elmer Elmo Elon Elroy Elton Elvis Elwood Elwyn Ely Emanuel Emerson Emery Emet Emil Emiliano Emilio Emlyn Emmanuel Emmerson Emmet Emmett Emory Ender Ennio Enoch Enrique Enzo Eoghan Eoin Eric Erick Erik Ernest Ernesto Ernie Errol Ervin Erwin Esteban Ethan Ethen Etienne Euan Euen Eugene Eustace Evan Evangelos Evelyn Everett Ewan Eyan Ezekiel Ezio Ezra Fabian Fabio Faisal Farley Febian Felipe Felix Fenton Ferdinand Fergal Fergus Fernand Fernando Fidel Filbert Finbar Findlay Finlay Finley Finn Finnian Finnigan Fionn Fletcher Florian Floyd Flynn Ford Forest Forrest Foster Fox Francesco Francis Francisco Frank Frankie Franklin Franklyn Fraser Fred Freddie Freddy Frederick Fredrick Fritz Fynn Gabe Gabriel Gael Gaelan Gage Gale Galen Gannon Gareth Garman Garrett Garrison Garry Garth Gary Gaston Gavin Gene Geoff Geoffrey George Geraint Gerald Gerard Gerardo Germain Gerry Gian Gibson Gideon Gil Gilbert Gilberto Giles Gino Giorgio Giovanni Glen Glenn Glyndwr Glynn Godfrey Godric Godwin Gonzalo Gordon Grady Graeme Graham Granger Grant Gray Grayson Greg Gregg Gregor Gregory Grey Greyson Griffin Grover Guido Guillermo Gunnar Gunner Gus Gustav Gustavo Guy Gwain Haden Haiden Hal Hamilton Hamish Han Hank Hans Harlan Harley Harold Harris Harrison Harry Harvey Hassan Hayden Hayes Heath Hector Hendrik Hendrix Henley Henri Henry Herbert Herbie Herman Heston Hezekiah Hilary Holden Homer Horace Horatio Howard Hubert Huck Hudson Huey Hugh Hugo Humberto Humphrey Hunter Huw Huxley Hywel Iain Ian Ianto Ibrahim Ichabod Idris Ieuan Ieystn Iggy Ignacio Igor Ike Imran Indiana Inigo Ira Irvin Irving Irwin Isaac Isaiah Isaias Ishaan Ishmael Isiah Isidore Ismael Israel Issac Ivan Ivor Jace Jack Jackie Jackson Jacob Jacoby Jacques Jad Jaden Jadon Jagger Jago Jai Jaiden Jaime Jak Jake Jakob Jalen Jamal James Jameson Jamie Jamison Jan Jared Jaret Jariel Jarod Jaron Jarrett Jarrod Jarvis Jase Jason Jasper Javid Javier Javon Jax Jaxon Jaxson Jay Jayce Jayden Jaydon Jaylen Jaylin Jaylon Jayson Jeb Jebediah Jed Jedediah Jediah Jedidiah Jeff Jefferson Jeffery Jeffrey Jeffry Jem Jensen Jenson Jerald Jeremiah Jeremy Jericho Jermaine Jerome Jerrion Jerrold Jerry Jersey Jesse Jessie Jesus Jet Jethro Jett Jevan Jim Jimmie Jimmy Joachim Joaquin Jock Jody Joe Joel Joey Johan Johann John Johnathan Johnathon Johnnie Johnny Jon Jonah Jonas Jonathan Jonathon Jonty Jordan Jordon Jordy Jorge Jose Joseph Josh Joshua Josiah Joss Josue Jovan Juan Judah Judas Judd Jude Julian Julio Julius Justice Justin Kade Kaden Kai Kaiden Kaine Kale Kaleb Kalem Kameron Kane Karl Karson Karsten Kash Kason Kasper Kayden Kayle Kaylen Kayson Kean Keanu Keaton Kedrick Keegan Keenan Keith Kelby Kellan Kellen Kellin Kelly Kelvin Ken Kenan Kendall Kendrick Kennedy Kenneth Kenny Kent Kenton Keon Kerry Kevin Khalid Khalil Kian Kiefer Kieran Kieron Killian Kim Kingsley Kingston Kip Kiran Kirby Kirk Kit Klaus Klay Knox Kobe Koby Kody Kolby Konnor Kris Krish Kristian Kristoff Kristopher Kurt Kurtis Kyan Kye Kylar Kyle Kylen Kyler Kyran Kyrin Kyron Lacey Lachlan Lake Lamar Lamont Lance Lancelot Landen Landon Landyn Lane Langdon Langston Larry Lars Laurence Laurie Lawrence Lawson Layne Layton Leaf Leandro Lebron Ledger Lee Leif Leigh Leighton Leland Lemuel Len Lennie Lennon Lennox Lenny Leo Leon Leonard Leonardo Leonel Leopold Leroy Les Leslie Lester Leuan Lev Leven Levi Levy Lewis Lex Leyton Liam Lief Lincoln Linden Lindon Link Linley Linus Lionel Lisandro Llewelyn Lloyd Lochlan Logan Loki London Lonnie Lorcan Loren Lorenzo Loris Lou Louie Louis Lowell Luca Lucas Lucian Luciano Luigi Luis Lukas Luke Luther Lyle Lyndon Lynn Lysander Mack Maddox Magnus Maison Malachi Malakai Malcolm Malik Malloy Manny Manuel Marc Marcel Marcelo Marco Marcos Marcus Marik Mario Marion Mark Marley Marlon Marquis Marshall Martin Marty Martyn Marvin Mason Massimo Mat Mateo Mathew Matt Matthew Matthias Maurice Mauricio Maverick Max Maxim Maximilian Maximus Maxwell Mckenzie Mehdi Mehtab Mekhi Mel Melvin Memphis Merick Mervin Mervyn Mica Micah Michael Micheal Mick Mickey Miguel Mike Mikey Milan Miles Miller Milo Milton Misha Mitch Mitchell Mitt Moe Mohamed Mohammad Mohammed Moises Monte Montgomery Monty Mordecai Morgan Morris Moses Muhammad Murphy Murray Myles Mylo Myron Nash Nasir Nate Nath Nathan Nathanael Nathaniel Neal Ned Neel Nehemiah Neil Nelson Nesbit Nestor Neville Nevin Newton Niall Nicholas Nick Nickolas Nicky Nico Nicolas Nigel Nihal Nik Niklaus Niko Nikolai Nikolas Nile Nils Noah Noam Noe Noel Nolan Norbert Norman Norris Norton Nyle Nyles Oakes Oakley Oberon Octavio Oisin Olaf Oli Oliver Ollie Olly Omar Oran Orion Orlando Orson Oscar Osvaldo Oswald Otis Otto Owain Owen Ozzie Ozzy Pablo Paco Paddy Padraig Palmer Paolo Parker Pascal Pat Patrick Paul Paxton Payton Pearce Pedro Percy Perry Petar Pete Peter Peyton Phebian Phil Philip Philippe Phillip Phineas Phoenix Pierce Piers Pip Porter Poul Prakash Preston Prince Princeton Quentin Quincy Quinlan Quinn Quinton Quintrell Rafael Rafferty Raheem Rahul Raiden Raj Rajesh Ralph Ram Rameel Ramon Ramsey Randal Randall Randolph Randy Raoul Raphael Rashad Rashan Rashid Raul Ravi Ray Raydon Raylan Raymond Reece Reed Reef Reese Reg Reggie Reginald Rehan Reid Reilly Remco Remington Remy Ren Rene Reuben Rex Reynaldo Reza Rhett Rhydian Rhys Rian Ricardo Rich Richard Richie Rick Rickey Rickie Ricky Rico Rider Rigby Rik Riker Riley Rio Riordan River Roan Rob Robbie Robby Robert Roberto Robin Rocco Rock Rocky Rod Roddy Roderick Rodger Rodney Rodolfo Rodrigo Rogelio Roger Rohan Roland Rolando Roman Romeo Ron Ronald Ronan Ronnie Ronny Roosevelt Rory Roscoe Ross Rowan Roy Royce Ruairi Ruben Rubin Rudolph Rudy Rufus Rupert Russ Russell Rusty Ryan Ryder Ryker Rylan Ryland Ryle Ryley Sacha Said Salman Salvador Salvatore Sam Samir Sammy Samson Samuel Sandeep Sandy Sanjay Santiago Sasha Saul Sawyer Scot Scott Scottie Scotty Seamus Sean Seb Sebastian Sebastien Sebestian Sergio Seth Shadrach Shane Shannon Shaun Shawn Shay Shayne Shea Sheldon Shelton Sherlock Sherman Sherwin Shiloh Sid Sidney Silas Simeon Simon Sky Skylar Skyler Slade Sol Solomon Sonny Soren Spencer Spike Stacey Stacy Stan Stanley Stefan Stephan Stephen Sterling Steve Steven Stevie Stewart Stone Storm Struan Stuart Sufyan Sullivan Sven Sylvester Tadhg Talon Tam Tane Tanner Tariq Tarquin Tate Taye Taylor Teague Ted Teddy Teo Terence Terrance Terrell Terrence Terry Tevin Tex Thad Thaddeus Theo Theodore Theon Theophilus Thom Thomas Thor Tiago Tiberius Tiernan Tiger Tim Timmy Timothy Tito Titus Tobias Tobin Toby Tod Todd Tom Tomas Tommie Tommy Tony Torin Toryn Trace Tracey Tracy Travis Tray Tremaine Trent Trenton Trevon Trevor Trey Treyden Tristan Tristen Triston Troy Truman Tucker Turner Ty Tylan Tyler Tyrell Tyren Tyrese Tyrone Tyson Ulrich Ulysses Umar Uriah Uriel Usama Valentin Valentine Valentino Van Vance Vasco Vaughn Vernon Vic Victor Vidal Vihan Vijay Vikram Vince Vincent Vinnie Virgil Vishal Vivian Vlad Vladimir Wade Walker Wallace Wally Walter Warren Waylon Wayne Wendell Wes Wesley Westin Weston Wilbert Wilbur Wiley Wilfred Wilhelm Will Willam Willard Willem William Willie Willis Wilson Winston Wolf Wolfgang Woody Wyatt Xander Xavier Xerxes Yahir Yardley Yehudi Yestin York Yuri Yusuf Yves Zac Zach Zachariah Zachary Zachery Zack Zackary Zackery Zaiden Zain Zaine Zak Zander Zane Zayden Zayn Zayne Zeb Zebulon Zed Zeke Zeph Ziggy Zion Zohar Zoltan Zuriel Zylen".split(" ");

return da;
}(da || {}));

"use strict";
var da = (function(da){

/** provide drawfigure with information about where to start drawing
 *	also defines special racial features to be drawn such as pointy ears */
da.racialSkeleton = {
	human: {
		upper: {
			m: {
				// base level values without x and y have implied x = 79
				top:48,
				neck:68,
				collarbone: {x:41, y:72},
				elbow: {x:10, y:144},	// outer elbow
				wrist: {x:9, y:211},	// outer wrist
				knuckle: {x:20, y:226},	// knuckles/tip of hand
				finger: {x:26, y:222},	// end of fingers
				rib: {x:44, y:115},		// armpit

				chin: {x:79, y:63},
				jaw: {x:59, y:47},
				ear: {x:59, y:37, cp2:{x:56, y:37}, cp1:{x:55, y:29}},
				skull: {x:79, y:5},	
			},
			f: {
				top:48,
				neck:63,
				collarbone: {x:46, y:70},
				elbow: {x:24, y:138},
				wrist: {x:14, y:193},
				knuckle: {x:15, y:213},
				finger: {x:29, y:214},
				ulna: {x:22, y:191},
				rib: {x:46, y:108},

				chin: {x:79, y:62},
				jaw: {x:59, y:44},
				ear: {x:59, y:37, cp2:{x:56, y:37}, cp1:{x:55, y:30}},
				skull: {x:79, y:8.4},
			},
		},
		mid: {
			hip: {x:50.3, y:175},
			pelvis: 180,
		},
		lower: {
			m: {
				knee: {x:36, y:269},
				ankle: {x:41, y:365},
				toe: {
					out: {x:29, y:388, cp1:{x:34, y:386}},
					mid: {x:29, y:390, cp1:{x:29, y:389}},
					in: {x:59, y:389, cp1:{x:43, y:394}},
				},
				shin: {x:54, y:342},
				cocyx: {x:79, y:205},
			},
			f: {
				knee: {x:44, y:275},
				ankle: {x:39, y:364},
				toe: {
					out: {x:30, y:384, cp1:{x:36, y:372}},
					mid: {x:33, y:387, cp1:{x:32, y:386}},
					in: {x:52, y:386, cp1:{x:40, y:391}},
				},
				shin: {x:50, y:353},
				cocyx: {x:79, y:203},
			}
		}
	},
};

return da;
}(da || {}));"use strict";
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
}(da || {}));"use strict";
// continue draw avatar module
var da = (function(da){



var statLimits = {	// core stats, each with low, high, average, and stdev (assuming Normally distributed)
	str	: {low:0, high:10, avg:5, stdev:2.5},
	dex	: {low:0, high:10, avg:5, stdev:2.5},	// honestly, large chests don't do much for dexterity
	con	: {low:0, high:10, avg:5, stdev:2.2},
	wil	: {low:0, high:10, avg:4, stdev:1.5},	// brains > brawns ;P
	// appearance scores, 0-11, lower scores are more modest
	// they will be shown as 1 + their value so 1-12
	age	: 		{low:0, high:1e9, avg:30, stdev:6},	// no real limit on age
	hair	: 	{low:0, high:11, avg:4, stdev:3},	// style and length
	eyes	: 	{low:0, high:11, avg:4, stdev:2,bias:1},	// higher value is more seductive
	face	: 	{low:0, high:11, avg:5, stdev:2},	// higher value is better looking
	lips	: 	{low:0, high:11, avg:4, stdev:3},
	skin	: 	{low:0, high:11, avg:6, stdev:2,bias:1},	// higher value is better looking / fresher
	breast	: 	{low:0, high:11, avg:1, stdev:1.5},
	hips	: 	{low:0, high:11, avg:5, stdev:2},
	butt	: 	{low:0, high:11, avg:3, stdev:2},
	fem 	: 	{low:0, high:11, avg:5, stdev:1},
	sub 	: 	{low:0, high:11, avg:4, stdev:1},
};
var statDiscretePool = { 	// pool of available values for discrete properties
	gender  : 	["female", "male", "futa"],
	skeleton: 	["human"],	// underlying racial structure of player
};



var physiqueLimits = {
	hairc: 		{low:-5,high:120,avg:10,stdev:12},	// jet black to platinum blonde (40) to silver white (100) to pure white (~200)
	hairstyle: 	{low:0,high:da.drawHairFront.length-1,avg:1,stdev:1},		// bald (0) to parted at middle hair style (1)
	height: 	{low:-10,high:25,avg:6,stdev:3},		// 4'5" (-10) to 5'7" (10) to 6'6" (25) (need some canvas teweaking?)
	irisc: 		{low:-20,high:100,avg:5,stdev:20},	// red (~-20) to brown (0) to green (10) to blue (20) to purple (40)
	skin: 		{low:-20,high:50,avg:10,stdev:30},	// translucent (-20) to porcelein (-10) to fair (-5) to tanned (5) to brown (15) pure black (50)
	breastrows: {low:0,high:0,avg:0,stdev:0},		// should only have 1 row...
	genitals: 	{low:0,high:2,avg:1,stdev:0.1},
	face: 		{low:-8,high:28,avg:10,stdev:5},		// hypermasculine (-5) to androgenous (10) to feminine (25)
	eyes: 		{low:-20,high:25,avg:0,stdev:15},		// squinty eyes (-15) to super surprise (25)
	lips: 		{low:-20,high:40,avg:0,stdev:10},	// thin line (-20) to duck lips (40)
	hairlength: {low:-1,high:100,avg:5,stdev:13},	// short (-1) to floor touching (100)
	shoulders: 	{low:-4,high:60,avg:18,stdev:18},	// freakishly strong (-4) to boyish (15) to feminine (25) emaciated (60)
	breasts: 	{low:-5,high:100,avg:10,stdev:8},	// flat (-5) to A (10) to B (13) to C (15) to D (18) to DD (20) to E (23) to ... to gargantuan (100) 
	nipples: 	{low:0,high:40,avg:8,stdev:8},				// nonexistent (0) to prominent (15) to udders (40)
	testes: 	{low:-20,high:35,avg:0,stdev:8},		// gigantic (-20) to nothing there (11) to deep slit (35)  
	penis: 		{low:-10,high:20,avg:0,stdev:4},		// footlong (-10) to nothing there (20)
	waist: 		{low:-20,high:35,avg:8,stdev:8},		// pregnant (-20) to flat (0) to toned (5) to narrow (10) to pinched (30)
	hips: 		{low:-10,high:50,avg:0,stdev:7},		// narrow (-10) to normal (0) to wide (15) to fertility goddess (30)
	butt: 		{low:-10,high:40,avg:10,stdev:10},	// nonexistent (-10) to normal (10) to titanic (40)			
	legs: 		{low:-5,high:55,avg:15,stdev:10},	// leg day (-5) to boyish (10) to neutral (15) to lithe (20) to curvy (30) to gigantic thighs (50)
};
// use objects as unordered sets (mapped value is dummy, just true here)
var physiqueAllowed = {
	skin: 		{100:true,101:true,102:true},
};
// first element of discrete pools is the default
var physiqueDiscretePool = {
	eyecolor:["white"],
};


// idosyncratic stats (random deviations for each person)
// could also be modified by items
// only put numerical values here
var modLimits = {
	breasts: 	{low:-1e9,high:1e9,avg:0,stdev:2},
	penis: 		{low:-1e9,high:1e9,avg:0,stdev:2, bias:-6},	// override here since for modifiers, higher penis actually results in lower physique.penis
	testes: 	{low:-1e9,high:1e9,avg:-1,stdev:1, bias:-4},	// same here as well
	eyes: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	lips: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	lipw: 		{low:-1e9,high:1e9,avg:0,stdev:5}, 	// lip width
	lipt: 		{low:-1e9,high:1e9,avg:0,stdev:4},	// lip thickness
	liph: 		{low:-1e9,high:1e9,avg:0,stdev:3},	// lip height
	lipc: 		{low:0,high:1e9,avg:3,stdev:5},	 // lip curl; anything below -3 is just too creepy
	lipa: 		{low:-1e9,high:1e9,avg:0,stdev:4},	// lip arch
	fem: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	sub: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	waist: 		{low:-1e9,high:1e9,avg:0,stdev:2},		// positive is narrower
	butt: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	legl: 		{low:-1e9,high:1e9,avg:0,stdev:2},		// how long their legs are (proportion of body that is legs) 
	eyec: 		{low:-1e9,high:1e9,avg:0,stdev:2},		// eye curl (positive produces / slant, negative \ slant)
	noseskew: 	{low:-1e9,high:1e9,avg:0,stdev:2},		// positive means nose starts on the right
	skinc: 		{low:-1e9,high:1e9,avg:10,stdev:15},	// this is the "natural skin color"
	penist: 	{low:-10, high:1e9,avg:0,stdev:2},		// penis thickness
	browh: 		{low:10, high:35, avg:16,stdev:5,bias:3},		// eyebrow height
	browt: 		{low:-10, high:10, avg:1,stdev:2,bias:0},		// eyebrow tilt (higher value tilts more \/ way)
	browc: 		{low:-10, high:20, avg:4,stdev:2,bias:2},		// eyebrow curl (higher value has higher arch)
	browb: 		{low:0, high:100, avg:60,stdev:15,bias:0},		// eyebrow bending point (higher value bends closer to outside)
	browv: 		{low:0, high:100, avg:30,stdev:15,bias:-20},		// eyebrow volume/thickness
	browr: 		{low:0, high:100, avg:30,stdev:15,bias:20},		// eyebrow roundedness
};
var modDiscretePool = {
	eyelinerc:[""],
};
// fill out modifier for numerical stats if they don't exist
(function(){
	for (var p in statLimits) {
		if (!modLimits.hasOwnProperty(p)) {
			// default
			modLimits[p] = {low:-1e9, high:1e9, avg:0, stdev:1, bias:0};
		}
	}
	for (p in physiqueLimits) {
		if (!modLimits.hasOwnProperty(p)) {
			// default
			modLimits[p] = {low:-1e9, high:1e9, avg:0, stdev:1, bias:0};
		}
	}
}())


// for example, max_hp, mana, etc...
var vitalLimits = {};

// for bias, if not defined then default to 1 - it means females tend to get higher values
// otherwise, 0 means unisex, and a negative number means more affected by high masculinity
var femBias = {
	// core stats
	age:0,
	str:-0.5,
	dex:-0.3,
	con:-0.2,
	wil:0,
	eyes:5,
	breast:2,
	skin:2,
	fem:2,
	sub:2,
	// physiques
	hairc:0,
	height:-3,
	genitals:0,
	face:3,
	lips:2,
	hairlength:3,
	shoulders:1.5,
	breasts:5,
	testes:2,
	penis:2,
	waist:2,
	legs:3,
	// idiosyncracies
	skinc:-3,
	lipw:0,
	lipt:4,
	liph:0,
	lipc:0,
	lipa:0,
	legl:0,
	eyec:0,
	noseskew:0,
	penist:-2,
	browh:0,
};


// create default stats from the avg of the stat limits
function getDefault(limits, discretePool) {
	function run() {
		var defaults = {};
		for (var p in limits) {
			defaults[p] = limits[p].avg;
		}

		if (discretePool) {
			for (p in discretePool) {
				defaults[p] = discretePool[p][0];
			}
		}
		return defaults;
	}
	return run;
}
// used to generate default values
var defaultStats = da.defaultStats = getDefault(statLimits, statDiscretePool);
var defaultPhysique = da.defaultPhysique = getDefault(physiqueLimits, physiqueDiscretePool);
var defaultMods = da.defaultMods = getDefault(modLimits, modDiscretePool);
var defaultWorn = da.defaultWorn = {	
	// each maps a layer to a clothing name 
	top:{},
	bot:{},
	shoes:{},
	acc:{},
};
var defaultVitals = da.defaultVitals = getDefault(vitalLimits);
// class definition for Player
var Player = da.Player = function(data) {
	Object.assign(this, {	// default value construction; overriden by properties of data passed in
		// mods, physique, worn require dynamic default value construction, so are assigned separately
		inv		: [],
		Mods 	: defaultMods(),
		physique: defaultPhysique(),
		worn 	: defaultWorn,
		vitals 	: defaultVitals(),	// where you would store max_hp, cur_hp, etc...
		traits	: [],
	}, defaultStats(), data);
	// upgrade with newer default values if necessary so saves are compatible (new stat wouldn't be missing)
	if (data) {
		this.Mods = Object.assign({}, defaultMods(), data.Mods);
		this.physique = Object.assign({}, defaultPhysique(), data.physique);
		this.worn = Object.assign({}, defaultWorn, data.worn);
		this.vitals = Object.assign({}, defaultVitals(), data.vitals);
	}


	// apply modifiers
	for (var loc in this.worn) {
		for (var layer in this.worn[loc]) {
			var cname = this.worn[loc][layer];
			if (!da.clothes.hasOwnProperty(cname)) continue;
			var cc = da.clothes[cname];
			for (var mod in modLimits) {
				if (cc.hasOwnProperty(mod) && !isNaN(cc[mod])) {
					console.log("adding",cc[mod],mod);
					this.Mods[mod] += cc[mod];
				}
			}
		}
	}
};
// first define as local variable to avoid circular referencing
// purpose is to put them close to each other on top for ease of use
Player.statLimits = statLimits;
Player.modLimits = modLimits;
Player.physiqueLimits = physiqueLimits;
Player.vitalLimits = vitalLimits;
Player.physiqueAllowed = physiqueAllowed;

Player.statDiscretePool = statDiscretePool;
Player.modDiscretePool = modDiscretePool;
Player.physiqueDiscretePool = physiqueDiscretePool;

Player.femBias = femBias;



// ---- player drawing functions ----
Player.prototype.selectClothing = function(drawAt) {
	// drawAt is the drawing time (which point in the drawing process) the clothes wants to be drawn at
	// returns an array of {layer:layer of clothing, draw:draw function} since 
	// sometimes 1 piece of clothing needs multiple parts to be drawn at different points (a shirt)
	drawAt = "draw"+drawAt;
	var toDraw = [];
	for (var loc in this.worn) {
		var locWorn = this.worn[loc];
		for (var layer in locWorn) {
			var c = da.clothes[locWorn[layer]];
			if (c && c[drawAt]) {
				if (typeof c[drawAt] === "function")	// only 1 thing to draw at this opportunity
					toDraw.push({layer:layer,draw:c[drawAt]});
				else if (c[drawAt].length)	{// is an array-like object containing multiple, push all sequentially
					c[drawAt].forEach(function(drawer){
						toDraw.push({layer:layer,draw:drawer});
					});
				}
			} 
		}
	}

	// sort in order of layer with lower layer placed first
	toDraw.sort(function(a,b) {
		return (a.layer === b.layer)? 0 : (a.layer < b.layer)? -1 : 1;
	});	
	return toDraw;
};
Player.prototype.drawAdditional = function(ctx, ex, selector) {
	// ex is exported properties of the drawing script such as offset

	// no other special position requirements to be drawn last
	var toDraw = this.selectClothing(selector);
	
	// actually do the drawing
	for (var i=0; i < toDraw.length; ++i) {
		toDraw[i].draw.call(this.physique, ctx, ex, this.Mods);
	}
};

/** adjust the player's height based on shoes worn */
Player.prototype.heightAdjust = function() {
	var extraheight = 0;
	// take the max height of what's being worn in shoes location
	for (var layer in this.worn.shoes) {
		if (da.clothes[this.worn.shoes[layer]] && da.clothes[this.worn.shoes[layer]].hasOwnProperty("height"))
			extraheight = Math.max(extraheight, da.clothes[this.worn.shoes[layer]].height);
	}

	return extraheight;
};

/** some clothing items hide crotch so genitals should be drawn differently */
Player.prototype.crotchHidden = function() {
	for (var w in this.worn) {
		for (var layer in this.worn[w]) {
			if (da.clothes[this.worn[w][layer]] && da.clothes[this.worn[w][layer]].hasOwnProperty("hidecrotch"))
				return true;
		}
	}
	return false;
}

/** check if the player is wearing a clothing item */
Player.prototype.isWearing = function(clothesName) {
	if (!da.clothes.hasOwnProperty(clothesName)) return false;
	var cc = da.clothes[clothesName];
	return this.worn[cc.loc][cc.layer] === clothesName;
};
Player.prototype.changeClothes = function(clothesName) {
	// change into da.clothes provided, doesn't handle removing from backpack since source agnostic!
	// returns clothing changed out of, if any, else null
	if (!da.clothes.hasOwnProperty(clothesName)) return null;
	var cc = da.clothes[clothesName];
	if (this.isWearing(clothesName)) {	// change out of da.clothes
		console.log("changing out of", clothesName);
		this.worn[cc.loc][cc.layer] = "";

		// reset the previoiusly applied modifiers
		for (var mod in modLimits) {
			if (cc.hasOwnProperty(mod) && !isNaN(cc[mod])) {
				this.Mods[mod] -= cc[mod];
			}
		}		

		return clothesName;
	}
	else {	// change into da.clothes
		var changedOut = null;
		console.log("changing into", clothesName);

		if (this.worn[cc.loc][cc.layer]) // already wearing something there, change out of it first
			changedOut = this.changeClothes(this.worn[cc.loc][cc.layer]);
		this.worn[cc.loc][cc.layer] = clothesName;

		// apply modifiers
		for (var mod in modLimits) {
			if (cc.hasOwnProperty(mod) && !isNaN(cc[mod])) {
				console.log("adding",cc[mod],mod);
				this.Mods[mod] += cc[mod];
			}
		}
		return changedOut;
	}
}







Player.prototype.clampStats = function() {
	for (var p in statLimits) {
		this[p] = da.clamp(this[p], Player.statLimits[p].low, Player.statLimits[p].high);
	}
};
Player.prototype.clampPhysique = function() {
	for (var p in physiqueLimits) {
		// this property is limited and the value is not explicitely allowed
		if (!isNaN(this.physique[p]) && !(Player.physiqueAllowed[p] && Player.physiqueAllowed[p].hasOwnProperty(this.physique[p]))) {
			this.physique[p] = da.clamp(this.physique[p], Player.physiqueLimits[p].low, Player.physiqueLimits[p].high);
		}
	}
};
Player.prototype.clampMods = function() {
	for (var p in modLimits) {
		this.Mods[p] = da.clamp(this.Mods[p], modLimits[p].low, modLimits[p].high);
	}
}
Player.prototype.getFem = function() {
	return this.fem + this.Mods.fem;
};
Player.prototype.getSub = function() {
	return this.sub + this.Mods.sub;
};
Player.prototype.calcSkin = function() {
	if (isNaN(this.physique.skin)) return this.physique.skin;	// already set, just pass through
	return -(this.skin+this.Mods.skin) + this.Mods.skinc;	// -10 is porcelein
};
Player.prototype.calcFace = function() {
	// higher value is more feminine
	var f = this.getFem() + this.face*1.8 - this.str + this.Mods.face;
	return f;
};
Player.prototype.calcEyes = function() {
	// includes eyelids :D
	return this.eyes + this.Mods.eyes;
};
Player.prototype.calcLips = function() {
	var l = this.getFem() + this.Mods.lips + this.lips;
	return l;
};
Player.prototype.calcHairLength = function() {
	var v = (this.hair+this.Mods.hair)*2 + this.getFem() + this.getSub() + this.Mods.hairlength;
	return v;
};
Player.prototype.calcShoulders = function() {
	// higher value is more feminine
	var s = (this.getFem() + this.getSub()) * 2.1 + this.Mods.shoulders; // scaling factor
	s -= this.str;
	return s;
};
Player.prototype.calcBreasts = function() {
	var v = 0;
	if (this.breast === 0)
		v = -this.str; // negative is flat
	else if (this.breast === 11)
		v = 18 + this.Mods.breasts/5; // nice value for 
	else
		v = this.breast*3 + this.Mods.breasts;	

	return v;
};
Player.prototype.calcNipples = function() {
	return this.getFem()*0.6 + this.breast + this.Mods.shoulders + this.Mods.nipples;
};
Player.prototype.calcTestes = function(considerMods) {
	// higher is more feminine
	var val	= (this.getSub() + this.getFem())*1.3;
	if (this.Mods.testes > 0 && considerMods)
		val = val > 0 ? this.Mods.testes * -2 : (val + this.Mods.testes * 2);
	return val;
};
Player.prototype.calcPenis = function() {
	var v = -5 + this.getFem() + this.getSub()*0.2 - this.Mods.penis;
	return v;
};
Player.prototype.calcWaist = function() {
	var v = this.getFem()*1.5 + this.dex + this.Mods.waist;
	// constitution tries to draw this value towards 5
	if (v > 12) v -= this.con * 0.75;
	else if (v < 5) v += this.con * 0.75;
	return v;
};
Player.prototype.calcHips = function() {
	return (this.getFem() + this.hips)*1.2 - 2 + this.Mods.hips;
};
Player.prototype.calcButt = function() {
	return this.getFem() + this.butt + this.Mods.butt;
};
Player.prototype.calcLegs = function() {
	return this.getFem()*1.5 + this.getSub()*2 - this.str + this.Mods.legs;
};

Player.prototype.calcPhysique = function() {
    // this.physique.height = this.calcHeight(); // height is fixed
    this.physique.skin = this.calcSkin();
    this.physique.face = this.calcFace();
    this.physique.eyes = this.calcEyes();
    this.physique.lips = this.calcLips();
    this.physique.hairlength = this.calcHairLength();
    this.physique.shoulders = this.calcShoulders();
    this.physique.breasts = this.calcBreasts();
    this.physique.nipples = this.calcNipples();
    this.physique.testes = this.calcTestes(true);
    this.physique.penis = this.calcPenis();
    this.physique.waist = this.calcWaist();
    this.physique.hips = this.calcHips();
    this.physique.butt = this.calcButt();
    this.physique.legs = this.calcLegs();
    this.clampPhysique();
};
Player.prototype.hasPenis = function() {
	if (this.Mods.penis > 4) return true;	// higher modifier overrides this
	var tst = this.calcTestes(false);
	return tst <= 11;
};
Player.prototype.hasVagina = function () {
	var tst = this.calcTestes(false);
	return tst > 11;
};
Player.prototype.isFemale = function () { 
	return this.fem > 5; 
};
Player.prototype.isMale = function () { 
	return !this.isFemale(); 
};


// ---- player character description functions ----
Player.prototype.toJSON = function () {
	/*
		This ensures that all of the object's own enumerable properties
		are passed to the constructor, thus restoring the state of the
		original object upon deserialization.
	*/
	// some properties need to be updated to have the latest default values
	// var rev

	return JSON.reviveWrapper('new da.Player('+ JSON.stringify(Object.assign({}, this)) + ')');
};

Player.prototype.toString = function() {
	return this.name;
};

// CREATE CHARACTER
var getBiasMod = da.getBiasMod = function(prop, propName) {
	// own defined property takes precidence over the globally defined one
	if (prop.hasOwnProperty("bias")) return prop.bias;
	if (Player.femBias.hasOwnProperty(propName)) return Player.femBias[propName];
	// default to 1 (higher values correlated with higher femininity)
	return 1;
}
var createRandomCharacter = da.createRandomCharacter = function(bias) {
	// bias is a number from 0 to 1 with 1 being the most feminine bias and 0 most masculine bias
	var pc = new da.Player();
	// first generate all physique since later calculated physique from core stats will override some values
	for (var p in Player.physiqueLimits) {
		var physique = Player.physiqueLimits[p];
		// assuming normal distribution of physique
		pc.physique[p] = Math.round(da.randNormal(physique.avg + bias*getBiasMod(physique,p), physique.stdev));
	}
	// generate numerical statistics
	for (var s in Player.statLimits) {
		var stat = Player.statLimits[s];
		pc[s] = Math.round(da.randNormal(stat.avg + bias*getBiasMod(stat,s), stat.stdev));
	}
	// generate discrete statistics
	for (s in Player.statDiscretePool) {
		// uniform randomly pick a value from any of the available ones
		var availVals = Player.statDiscretePool[s];
		pc[s] = availVals[Math.floor(Math.random() * availVals.length)];
	}
	pc.clampStats();

	// names is a discrete statistic, but it's special in that different genders tend to have different pools of values
	if (bias > 0) {
		pc.name = da.femaleNames[Math.floor(Math.random() * da.femaleNames.length)];
		if (bias > 0.5) pc.gender = "female";
	}
	else {
		pc.name = da.maleNames[Math.floor(Math.random() * da.maleNames.length)];
		if (bias < -0.5) pc.gender = "male";
	}

	for (var m in Player.modLimits) {
		var mod = Player.modLimits[m];
		pc.Mods[m] = Math.round(da.randNormal(mod.avg + bias*getBiasMod(mod,m), mod.stdev));
	}
	pc.clampMods();

	return pc;
}

return da;
}(da || {}));"use strict";
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

		if (avatar.hasPenis() && avatar.crotchHidden()) {
			calcBulge();
		}
		else {
			drawTestes(ctx);
			var ev = avatar.physique.genitals - (Math.floor(avatar.physique.genitals / 2) * 2);
			for (var i = avatar.physique.genitals; i > 0; i--) {
				var evi = i - (Math.floor(i / 2) * 2);
				var ab = (evi == 1) ? 10 : -10;
				var ang = ev == 1 ? ab * Math.floor(i / 2) : ab * Math.floor((i + 1) / 2);
				drawPenis(ctx, ang, penis, avatar.hasPenis());
			}			
		}
		
	}
	
	/** penis and testes hidden by clothing item, don't draw anything */
	function calcBulge() {
		var size = -(penis*2 + testes);
		if (size < 0) return;
		ex.bulge = {};
		ex.bulge.top = {x:75-size*0.2, y:ex.mons.tip.y-15-size*0.1};
		ex.bulge.bot = {x:79, y:ex.mons.tip.y+size*0.3};
		ex.bulge.bot.cp1 = {x:77-size*0.4, y:ex.bulge.top.y+2+size*0.3};
		ex.bulge.bot.cp2 = {x:77-size*0.3-penist, y:ex.bulge.bot.y};
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
			ex.toe.out, ex.toe.mid, ex.toe.in, ex.toe.intop, ex.ankle.in, ex.ankle.intop,
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

window.da = da;var da = (function(da){

da.ctp = {};

// cached images 
var clothesPatterns = da.clothesPatterns = {};

/** convert an image object into byte array of RGB */
da.imgToStr = function(img, success) {
  // do this by creating a canvas object, drawing the image to it, then
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  console.log(img.width, img.height);
  ctx.drawImage(img, 0,0);
  var imgData = ctx.getImageData(0,0,img.width,img.height);

  var dataStr = [String.fromCharCode(imgData.width), String.fromCharCode(imgData.height)].join("");
  // for (var i = 0; i < imgData.data.length; ++i)
  dataStr += String.fromCharCode.apply(null, imgData.data);
  dataStr = btoa(da.RLE(dataStr));

  console.log(dataStr);  
  if (success) success(dataStr, ctx);

  return dataStr;
};

da.srcToStr = function(src) {
  var img = new Image();
  img.onload = function(){
    da.imgToStr(img);
  }
  img.src = src;
}

/** make a pattern with string encoded imageData */
da.strToPat = function(ctx, str) {
  str = da.RLD(atob(str));
  var imgData = ctx.createImageData(str.charCodeAt(0), str.charCodeAt(1));
  for (var i = 2; i < str.length; ++i)
    imgData.data[i-2] = str.charCodeAt(i);

  var canvas = document.createElement("canvas");
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  var cttx = canvas.getContext("2d");
  cttx.putImageData(imgData,0,0);

  var pat = ctx.createPattern(canvas, 'repeat');
  return pat;
}

// CREATE ASSET how to produce each pattern, each function takes in only ctx
var producePattern = da.producePattern = {
	// each function produces and returns either a color, CanvasGradient, or CanvasPattern
	"sheer cross": function(ctx) {
		return da.strToPat(ctx, "KAEKEAAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAAQCyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAADALIAAACyAAAAsgAAALIAAACy////sv///7IAAACyAAAAsgAAALIAAAIAsgAAALIAAACy////sv///7L///+y////sv///7L///+yAAAAsgAABwCyAAAAsgAAALIAAACyAAAAsv///7L///+yAAAAsgAAALIAAACyAAACALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAA==");
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
		return da.strToPat(ctx, "ABoZxBQh/8QUIf/EFCH/0BAZ/6oXNf9QETP/eCUQ/5lFN/9pHSr/WhMc/7AVHv+nCxv/vDE5/6UjLP+yCxr/iRQg/0wOGf9+KDX/nj8y/2EYGv96Fjn/yRIj/8MQG//AER7/wggT/8MiLf/DEyD/whIf/8MUIP/QEBr/rRc3/1MUM/94JhT/nEM1/2UcKP9XEx3/sBQe/6QMF/+6MDj/pCIr/7IMGf+JEx7/Rw4Y/3wqN/+dQTD/WxgZ/3MUOv/HESL/xA4a/8QPHv/EBhX/wyEs/8MSHv/EEx//xhMg/9EQGP+qGDH/UxMx/3cmFP+aQzT/ah0p/1oTHf+xFBr/pgwV/70yOf+kISv/tQwX/4sTG/9MDRf/fCs1/5g/Lv9eGBr/dxU5/8YSIf/GDxv/xg0d/8YMHf/EEyH/zxId/84THf/NFBz/2RAT/7IXMf9bEzL/gCQO/6I+Mv90HiX/YRQY/7oSGP+wChD/xjA2/64hKP+8DQ7/lBIY/1cNFf+EKC7/oj4r/2gZFv+DFDP/1Q0c/9UMGP/TDBj/0A0W/9IMFf+HGkD/iBpB/4oaP/+TGTn/eh5Y/y0YV/9KKCn/bkdY/z0lTv8pGTn/fRk7/3USN/+EN1n/cydJ/3sUOf9ZHEH/JxQ5/1AuU/9tRk7/OR03/00bV/+YGEL/lRY7/5AYPv+QGTv/lBg8/1AWKP9VFir/VxYo/10WIf9HGj3/AAg5/xseGf87Q0L/CRkx/wAMH/9IFib/Qgsg/00tPv89Hi7/Rwwk/yASJ/8ABRv/GCM8/zU7O/8CDh//EQ5E/00SLv9KDyP/RQ0o/0UOKP9HDin/jjUg/40xHv+PMx3/ljUX/3g6Nf8tLjL/U0EU/3BgOf88PCr/LzAc/302H/96LRj/jE81/3VAK/+ALxn/XDIf/yEmG/9RSDj/cFwv/zczGv9HMDL/iC8c/4IrF/+AKxj/gSoX/38pF/+PQDz/jzs6/5M+Pv+dPjn/fUJQ/zQ7Tv9VSTH/d2xW/0lMSP82PTz/gj9A/3w4Nf+PW1T/fU5I/4E6Of9kQT7/MTs4/11ZVP97ak3/REA2/1RGVv+TRD//k0A5/5FDPf+PQz7/kkI8/18aJP9fGSP/YBkj/2kWG/9SHDb/CRA2/x8fEv9FRDz/GyEw/wcSIf9SFiT/TgwY/1cwNf9LIyn/Ug8b/y8VIf8ADRv/Jicz/0M/Mf8NFRj/HxY8/10XJ/9bEx3/VxQg/1YVIP9bFSH/Yhgh/14XH/9bFiL/aBQZ/1EeNv8GEDT/HyAO/0JBOv8THiz/BRAc/00VH/9EDBb/VTE3/0kiKv9QCxj/KhUe/wALFv8kKDD/QUQy/wgUGf8ZETf/VhUj/04RGv9MDxv/ShIc/08THv+2FCD/uRMg/7YTIv/AERr/nRk5/0MUNf9oJhH/kEM8/1odK/9GEx3/nhQh/5kLGv+tMDn/lyIq/6cLF/97FCD/Og0a/24uNv+KQzL/UBYY/2UWN/+vESP/sQ4d/6wPHP+nDxv/qxAd/6kKFf+pCRb/qAkW/7UJEP+TEDD/PQcq/2IYBv+BNi//URAd/z4GEP+ZCBT/lQEP/5wlLP+IFhz/nAMO/3YHFf84AAz/ZR8s/4QyJf9MCwv/YAos/6sEF/+vBBH/qwYS/6wDEP+rAxD/ujM6/7oxOf+6MTr/xTA0/6I2S/9TMU3/dkIq/5RlVf9hQEf/UDI2/6gyOf+dKTH/s05T/5g+Rf+jLTH/hTU7/0UsNf91SFH/mF5L/1U0L/9pMVD/uC89/7UsNv+tKjb/rC43/6wvOf+sLTX/qCsy/6UrMf+yKSv/ly1I/0YlRv9nOiX/i15Q/10zQP9JKTP/lS43/5EiLP+lSUv/jDs9/5smKf97LjP/PiUs/2xCR/+MWkf/VDAt/2cuSf+wMDj/sC4x/6ksMP+tMDX/sTI5/7UMG/+xDRn/sAwX/7wJEf+fETD/TAkq/24aCf+NPDL/YRUi/1AIEv+eCRX/mwMP/6clLP+UFyD/pgIS/38JFf9AAg3/bB4r/4gyJf9TCw7/Zgov/60IFv+rBA7/qgYS/6sEEf+mAhD/oBQi/6IVI/+eFSH/phIZ/4gcN/85FDj/XCUS/35EOf9JICv/OhUd/5AUHf+JDRf/mjA2/4YhLP+UDxn/chUf/zINGP9fLDf/gEQx/0YXGv9aFzv/oxMi/6USHv+nEyL/pQ8c/6IOGf9SFBv/VRQg/00TH/9TExT/SBk0/wAMMv8WIQ7/OUI5/wgYJ/8ADxn/SBYd/0IIFf9GLjT/OR8n/0oLFP8mERv/AAcX/xokL/84QDD/ABIX/xQUNf9OFB//UBIc/04RHP9HERz/UBQe/24hK/9wIC3/bB8q/3YgI/9iJED/EBg+/zIvH/9WUkj/Iic1/xMbJ/9gICn/WhQf/2U3Qf9TKzX/YxUk/z4dK/8HFyb/MDBB/1BLPP8ZHCL/KBtF/2YcLv9kFyT/YBYk/14WJf9hFiX/m0M8/5tCOv+aQTj/pUMz/4xFTf8+QFD/XlEx/4FwVP9RT07/RERD/4lEP/+BQDX/mmBU/4dUSv+LQTn/bEc//zg/Of9jXFT/f3BP/0dFOP9YRFX/lENA/5FAOf+NQDv/jT85/5A8OP9/JxX/gCcV/4AlFP+IJg3/bS0o/x8hJf8+MAj/ZFMw/zIsIv8fIhX/aygW/2giDf95RCj/ZjYc/3EjDf9QJxP/FBwK/0E7JP9jUyn/KScM/z0pKf+BLBT/fikQ/3wsFv96LBL/fSsT/0wSMv9SETT/TBEy/1YPKP9DGEX/AAlA/xUdIf80Okf/CRI0/wAKKf9AEC3/OQkn/0ctSv81Gzv/RQsp/yQOLv8ABCb/GCA+/zc8Q/8ADSn/Eg1J/0gRNP9GDiv/SA4q/0UOKf9GDyj/oBs9/6MYO/+eGjr/pxgy/48dTP9CGU//XC0s/3xIT/9LI0L/QBo3/5MbO/+GEjX/lTZT/4IoSf+SEjf/bBs//y4WN/9eL0//fktO/0MfOf9XG1j/mhlF/5cYO/+VGTn/lBg5/5MYOf/TEhn/0hIa/9ERGv/bDxL/txct/2APLf+FIgv/qUIz/3EeJv9fFBf/whAZ/7UIDf/ELC7/sSEj/8AKEv+WEhz/TgwU/38pLP+oRSn/aBgS/3oUOf/VEB7/1Q8U/9APGP/PDhf/0A8X/8ISHv/DEyD/xBUh/88QGv+sFTb/VxIy/3ciEf+YQDr/ah4u/1kUIP+wEx3/qg0V/7swOP+kIiv/sg0W/48TIf9IDBn/eCcz/55DMP9YGBb/bxQ6/8YRI//EERv/wxAe/8UOHv/EDx7/whIf/8QUIf/DFCD/0BAa/60XNf9XEjL/diQR/5hFPP9qHi3/VhMc/7ISIP+oCxf/ty43/6giLf+3DBf/kRQf/0oOGf93KDX/mkIy/1oYGP9tFDj/xBIj/8URHP/BDx3/xA4e/8QOHv8=");
	},
	"blue_plaid": function(ctx) {
		return da.strToPat(ctx, "ABQeBRsk8gQVHvIIKTnyDT9W8gw9VPIMPFLyDT9X8g5HYfIIKjryBBUe8gciLvIMPFPyDkZf8g1DW/IMO1HyDT1U8g5EXPIHIzDyBRgg8gUcJ/IDDhPyAgkN8gUYIfIHIzDyBh8r8gYeKPIGHyryCCY18gUXH/IDDBHyAxIY8gcjMPIHJTPyBiAs8gYfK/IHIS3yCCQy8gQVHvIDDRLyBBAX8gIGCfIBBQbyAgkO8gMRF/IEERjyBBIY8gMPFfIEExnyAw0S8gEEBfIBBQjyAw8U8gQSGfIDERfyAxEX8gMOE/IEEhnyAgsP8gIHCfICCAvyAwwR8gIJDvIEExryBh8q8gUbJfIGHyryBh8q8gYfK/IEFR7yAggM8gMRF/IGHCfyBh8r8gciL/IGHyvyBh8q8gciL/IEERjyAw0R8gMPFPIEFRzyAxEX8gcgLPIJMkTyCTJE8gs1SfILNEfyDDlP8gckMvIEExnyBh4o8gkzRvIJMkTyDD1V8gw9U/ILN0zyDT9W8gcfK/IFGSLyBhwm8gQUG/IDEBbyBh4o8gkwQfIJMkTyCTNE8gkzRvILNkryBiAr8gMQFfIGHiryCzhN8gk0R/ILN0vyDDxS8gs5TvINPlXyBh4q8gUXIPIFGyXyBBMa8gMOFPIGHyryCTRI8gkyQ/IJL0DyCS9B8gkyRPIGICvyAw8V8gYeKPIJM0TyCTRH8gs3S/ILOk/yDDxS8g0/VvIGHinyBBMa8gUaI/IEEhnyAxAV8gYcJ/IJLj7yCTRH8gkyQ/IJKzvyCzZK8gclMvIDDxbyBRYf8gkvQfIJMkTyCS4/8gw6UPILOE3yCzZK8gYeKfIEFBzyBRsl8gQSGfIDDxTyBh8r8gkuP/IJMkPyCTNG8gksO/IJMEPyByUy8gQRGPIFGyXyCTBC8gkwQfILNknyCzdM8gs2S/IJLj7yBRki8gUaI/IFGiTyBBEW8gMOE/IFGiXyCSs78gksPfIJLDzyCSs88gktPfIGHinyAxEX8gUZIvIJLT7yCS9B8gkzRvIJM0fyCTRH8gkuP/IFGSHyBRYe8gQUHPIDDRLyAgkO8gQSGfIHIC3yBiIu8gchLfIHIS3yByQy8gUYIfIDCw7yAw4T8gchLfIHIi/yBx8r8gglM/IHJDLyByMy8gQUG/IDDhPyAw8V8gIMEfICCAvyBBQc8gchLfIGHyvyBiAs8gYeKvIGHyryBBUe8gIJDfIDDhPyBh4p8gciL/IGIS3yByEs8gYeKvIGHinyAxAW8gMMEfIDDxTyBRkh8gQTGvIJKjryDkdh8g1BWfIMPVTyDD5U8g5CW/IJLDvyBBMa8gYhLfINQFnyDkhi8g1AWfINQlvyDkdh8g5IYvIHIi7yBhwn8gchLfIHIS7yBh4p8gs2SfIRVHTyD05r8g9LZvIQUW/yEVd38gw6T/IFGyTyCSs78hFUcvITYobyEVR08hFXd/IQVHPyElt98gkwQvIIJjPyCSo68gckMvIFFx/yCTJE8g1DW/INQlvyDkRe8g5EX/IRWXnyCS4+8gUZIvIHJDLyEFFv8g9JZPIQUW7yEE9r8g5EXfIQUnDyByQy8gYgLPIHHyvyAw4T8gIHCfIEFBvyBh4o8gUZI/IGHyvyBhsm8gciL/IEExryAggL8gMOEvIGHifyBh4n8gcgLPIGHyryBhwm8gYgLPIDDRLyAgsP8gMOE/IDDRLyAgkN8gUaI/IHIi/yByAs8gYfKvIIKDjyCCk48gUZIvICCw/yBRQb8gktPfIIJzbyCCc28gchLfIIKzvyByUy8gQUG/IDDxTyAxIY8gUYIPIEExryCCc28g1EXvIMPVLyDUBZ8g5EXfIOR2HyCS9A8gQUG/IIJjTyDkdi8g5GYPIORF/yDUJb8g5DXPIORmDyByMw8gUYIfIGHinyAgsO8gIJDvIEExryByEu8gYeJ/IIJTPyBh4p8gcgLPIFFyDyAgsQ8gMPFPIGHijyByMw8gYeKfIHJDLyBRsl8ggmNPIDEBfyAw0R8gMPFfIBBwnyAQYI8gMMEfIEFBvyBBYe8gQUG/IEFR7yBRYe8gMPFPIBBQfyAgsO8gQUHPIEFBzyBRgh8gQUG/IEExryBBMa8gMLEPIBBwnyAggM8gIJDvICBwnyAxEY8gciL/IFGiPyBh4n8gUZI/IGHyryBBQc8gIICfIDDBHyBRcg8gYfK/IGHijyBh8r8gUYIfIGHijyAw8V8gIIDPIDDRPyBRok8gQSGfIIJzXyDUBX8gw6UPINP1XyCzRH8gw+VfIIJzXyAxAV8gUZIvILN0vyDDxS8gw8UvIMPVTyCTRH8gw8UvIGHyvyBRgi8gUcJvIEEhnyAw4S8gYfKvIJLD3yCS0+8gktPvIIKTfyCSo68gYcJvIDCw/yBBYe8ggoNvIJKzvyCTBC8ggpOfIHJjTyCS0+8gUbJfIEERjyBBUe8gEGCPICBwnyAw4T8gUZIvIEEhnyBBQc8gQTGvIFGSLyAw8U8gEEBvICCw/yAxEX8gUWH/IEFR7yBRcf8gMPFfIFGSLyAwwR8gEHCfICDBHyBBMZ8gQVHvIIJjTyDDpQ8gkyRPIJMELyCzdL8g0/VvIJMEHyAxAX8gYeJ/IJLT7yDkRd8gw8U/INP1byDD1U8gw7UfIHICzyBBQb8gUbJfIGHCbyBBMb8gksPfINQlryCzdM8gw/V/IMP1byD0ll8gkyRPIFGCHyBh8r8gw/VvIORF7yD0tn8g1DXPINQFfyDkRe8gcjL/IGGiTyBh4p8gUXH/IDEhjyCCk48g0+VfIMO1HyDT5W8gw7UfIORmDyCSk48gQVHPIHIzDyDD1T8gw+VvINPlXyCzlP8gw6UPINQFnyByQy8gUVHvIGHijyBBQb8gQUG/IIKTnyDD9W8g1BWfIMPVPyCzlN8g5EXvIJLj/yBBcf8gYfLPIMO1HyDD1U8gs3S/INP1byDUJa8g1CWvIGIS3yBRYe8gUcJfIEFh7yBRcf8gkrPPIMPlTyCTVI8gw+VfIMO1HyDUFZ8ggrPPIFFh7yBhsk8gw8U/INQVnyDD9W8gw7UfIJM0byCzlP8gYfKfIFFyDyBhwm8gUZI/IFFh/yCCU08gs5TvILN0vyDDtR8gw9VPINQVryCCg38gQSGfIGHinyDDtR8g1CWvINP1fyCzlO8gs2SvINP1fyBiAs8gQWHvIGGiTy");
	},
	"white_cashmere": function(ctx) {
		return da.strToPat(ctx, "ABAQ7u7u//Ly8v/w8PD/7+/v//Ly8v/y8vL/8vLy//Ly8v/y8vL/8fHx//Pz8//y8vL/8vLy//Hx8f/y8vL/7u7u//Ly8v/x8fH/7+/v//Hx8f/y8vL/8vLy//Pz8//x8fH/8PDw//T09P/19fX/8vLy//Dw8P/x8fH/8fHx/+3t7f/w8PD/8PDw//Dw8P/x8fH/8fHx//Ly8v/y8vL/8vLy//Ly8v/09PT/8vLy//Ly8v/y8vL/8PDw//Dw8P/x8fH/8vLy//Ly8v/w8PD/8vLy//Ly8v/y8vL/8PDw//Hx8f/y8vL/8vLy//Ly8v/w8PD/8PDw//Ly8v/y8vL/8fHx//X19f/y8vL/8vLy//Pz8//z8/P/8vLy//Hx8f/y8vL/9PT0//Pz8//y8vL/9PT0//T09P/z8/P/8vLy//Dw8P/x8fH/8vLy//Hx8f/x8fH/8fHx//Hx8f/w8PD/8PDw//Hx8f/x8fH/8PDw//Pz8//y8vL/8fHx//Dw8P/v7+//7+/v//Ly8v/u7u7/7+/v/+7u7v/u7u7/7+/v/+/v7//w8PD/7+/v//Dw8P/x8fH/8vLy//Dw8P/u7u7/7+/v//Ly8v/x8fH/7+/v//Dw8P/w8PD/8PDw//Hx8f/09PT/8PDw//Dw8P/z8/P/8fHx//Ly8v/x8fH/8PDw//Hx8f/y8vL/8PDw/+/v7//w8PD/8PDw//Hx8f/x8fH/8PDw/+7u7v/y8vL/8/Pz//Hx8f/y8vL/8PDw//Ly8v/w8PD/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8PDw/+3t7f/x8fH/8/Pz//Ly8v/z8/P/8vLy//Hx8f/x8fH/7u7u//T09P/09PT/8fHx//Hx8f/y8vL/8vLy//Pz8//z8/P/8/Pz//Pz8//09PT/8/Pz//Ly8v/z8/P/9PT0//Hx8f/z8/P/8vLy//Ly8v/z8/P/8vLy//Pz8//y8vL/8/Pz//X19f/09PT/8/Pz//T09P/z8/P/9PT0//T09P/z8/P/8vLy//Hx8f/y8vL/8vLy//Pz8//y8vL/8vLy//Ly8v/09PT/8/Pz//Ly8v/y8vL/8/Pz//Ly8v/y8vL/8vLy//Pz8//y8vL/8PDw//Ly8v/y8vL/8vLy//Ly8v/y8vL/8vLy//Pz8//09PT/8/Pz//Pz8//09PT/8vLy//Ly8v/y8vL/8PDw//Dw8P/w8PD/7+/v//Hx8f/y8vL/8PDw//Dw8P/y8vL/8vLy//Ly8v/x8fH/8vLy//Pz8//y8vL/7u7u/+3t7f/w8PD/7+/v//Dw8P/w8PD/7+/v//Hx8f/x8fH/8fHx//Ly8v/w8PD/8vLy//Dw8P/v7+//8PDw/w==");
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

};


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
};

return da;
}(da || {}));var da = (function(da){

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
}(da || {}));var da = (function(da){

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
}(da || {}));var da = (function(da){

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
}(da || {}));var da = (function(da){

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
}(da || {}));"use strict";

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

var ctp = da.ctp;

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
		drawunderbreasts: 	ctp.top.drawTankTop("rgb(200,190,200)","rgba(230,230,210,0.92)"),
		drawunderhair: ctp.top.drawShirtBreasts("rgb(200,190,200)","rgba(230,230,210,0.92)"),
	}),
	"white_tank" :
	new Clothing({
		name: 	"white tank top",
		price: 	25,
		blunt: 	0,
		loc: 	"top",
		layer: 	2,
		longdesc:"ordinary white tank top, fitted just right.",
		drawunderbreasts: 	ctp.top.drawTankTop("rgb(200,190,200)","rgb(240,250,250)"),
		drawunderhair: ctp.top.drawShirtBreasts("rgb(200,190,200)","rgb(240,250,250)"),
	}),
	"cashmere_turtleneck":
	new Clothing({
		name: 	"classy cashmere turtleneck",
		price: 	350,
		blunt: 	0,
		loc: 	"top",
		layer: 	2,
		longdesc:["TODO"].join(" "),
		drawunderbreasts: ctp.top.drawTurtleNeck("rgb(200,200,200)",da.getPattern("white_cashmere")),
		drawunderhair: ctp.top.drawLongSleeveBreasts("rgb(200,200,200)",da.getPattern("white_cashmere")),
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
		drawunderbreasts: [ctp.bot.drawTightPants("rgb(0, 68, 102)", da.getPattern("washed jeans")),
			ctp.bot.drawBulge("rgb(0, 68, 102)", da.getPattern("washed jeans"))],
		hidecrotch: true,
	}),

	"plaid_pencil_skirt" :
	new Clothing({
		name: 	"plaid pencil skirt",
		price: 	100,
		blunt: 	0,
		loc: 	"bot",
		layer: 	3,
		longdesc:"TODO",
		drawunderbreasts: ctp.bot.drawPencilSkirt("rgb(100,30,40)", da.getPattern("plaid")),
		legs: 	5,
	}),

	"blue_plaid_pencil_skirt" :
	new Clothing({
		name: 	"plaid pencil skirt",
		price: 	100,
		blunt: 	0,
		loc: 	"bot",
		layer: 	3,
		longdesc:"TODO",
		drawunderbreasts: ctp.bot.drawPencilSkirt("rgb(60,100,140)", da.getPattern("blue_plaid")),
		legs: 	8,
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
		drawafterall: ctp.shoes.drawShortBoots("black", "brown"),
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
		drawafterall: [ctp.shoes.drawHeels("black", "black"), 
			ctp.shoes.details.drawHeelStrap("black", null),
			ctp.shoes.sideDetails.drawHeelStrapDetails("black")],
		legs: 	4,
		ass: 	2,
	}),
	

	// accessories (for them, the longdesc is how they will be printed)
	"black_paint" :
	new Clothing({
		name: 	"magical black paint for lips and nails",
		price: 	2000,
		loc: 	"acc",
		layer: 	0,
		lips: 	1,
		cursed: true,
		longdesc:["Your lips and nails are glossily painted a shade darker than night.",
		"Try as you might, not the slightest bit of it washes off.",
		"They are sensual while not being slutty, and gives you an exotic aura."].join(" "),
		drawafterall: ctp.acc.drawMakeup("rgb(40,20,45)", "rgb(40,20,45)"),
	}),

	"cross_hold_ups":
	new Clothing({
		name: 	"hold ups with crosses",
		price: 	500,
		loc: 	"acc",
		layer:  1,
		legs: 	1,
		longdesc:["TODO"].join(" "),
		drawundergenitals: ctp.acc.drawThighSocks("rgb(200,100,100)", da.getPattern("sheer cross")),
	}),

	"solid_black_hold_ups":
	new Clothing({
		name: "solid black hold ups",
		price: 	500,
		loc: 	"acc",
		layer:  1,
		legs: 	1,
		longdesc:["TODO"].join(" "),
		drawundergenitals: ctp.acc.drawThighSocks("black", "rgba(30,30,30,0.9)"),
	}),
};

return da;
}(da || {}));