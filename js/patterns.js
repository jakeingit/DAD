var da = (function(da){

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
		return da.strToPat(ctx, "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");
	},
	"blue_plaid": function(ctx) {
		return da.strToPat(ctx, "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Cw/yBBYe8ggoNvIJKzvyCTBC8ggpOfIHJjTyCS0+8gUbJfIEERjyBBUe8gEGCPICBwnyAw4T8gUZIvIEEhnyBBQc8gQTGvIFGSLyAw8U8gEEBvICCw/yAxEX8gUWH/IEFR7yBRcf8gMPFfIFGSLyAwwR8gEHCfICDBHyBBMZ8gQVHvIIJjTyDDpQ8gkyRPIJMELyCzdL8g0/VvIJMEHyAxAX8gYeJ/IJLT7yDkRd8gw8U/INP1byDD1U8gw7UfIHICzyBBQb8gUbJfIGHCbyBBMb8gksPfINQlryCzdM8gw/V/IMP1byD0ll8gkyRPIFGCHyBh8r8gw/VvIORF7yD0tn8g1DXPINQFfyDkRe8gcjL/IGGiTyBh4p8gUXH/IDEhjyCCk48g0+VfIMO1HyDT5W8gw7UfIORmDyCSk48gQVHPIHIzDyDD1T8gw+VvINPlXyCzlP8gw6UPINQFnyByQy8gUVHvIGHijyBBQb8gQUG/IIKTnyDD9W8g1BWfIMPVPyCzlN8g5EXvIJLj/yBBcf8gYfLPIMO1HyDD1U8gs3S/INP1byDUJa8g1CWvIGIS3yBRYe8gUcJfIEFh7yBRcf8gkrPPIMPlTyCTVI8gw+VfIMO1HyDUFZ8ggrPPIFFh7yBhsk8gw8U/INQVnyDD9W8gw7UfIJM0byCzlP8gYfKfIFFyDyBhwm8gUZI/IFFh/yCCU08gs5TvILN0vyDDtR8gw9VPINQVryCCg38gQSGfIGHinyDDtR8g1CWvINP1fyCzlO8gs2SvINP1fyBiAs8gQWHvIGGiTy");
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
}(da || {}));