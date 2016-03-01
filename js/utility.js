"use strict";
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
}

da.clamp = function(num, min, max) {
  return num < min ? min : num > max ? max : num;
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


// utility and higher level functions for drawing clothes
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
  function draw(ctx, ex, mods) {
    ctx.save();

    ctx.lineWidth = lineWidth;
    if (typeof stroke === "function")
      ctx.strokeStyle = stroke(ctx);
    else
      ctx.strokeStyle = stroke;
    if (typeof fill === "function")
      ctx.fillStyle = fill(ctx);
    else 
      ctx.fillStyle = fill;

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
