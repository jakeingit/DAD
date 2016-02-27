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


return da;
}(da || {}));
