var da = (function(da){

da.ctp = {};

// cached images 
var clothesPatterns = da.clothesPatterns = {};

/** convert an image object into byte array of RGB */
da.imagify = function(img, success) {
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
  dataStr = btoa(dataStr);


  console.log(dataStr);  
  if (success) success(dataStr, ctx);

  return dataStr;
};

da.imgToStr = function(src) {
  var img = new Image();
  img.onload = function(){
    da.imagify(img);
  }
  img.src = src;
}

/** make a pattern with string encoded imageData */
da.strToPat = function(ctx, str) {
  str = atob(str);
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
		return da.strToPat(ctx, "ChAAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALL///+y////sgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACy////sv///7IAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsv///7L///+yAAAAsgAAALIAAACyAAAAsgAAALIAAACy////sv///7L///+y////sv///7L///+yAAAAsgAAALIAAACyAAAAsv///7L///+y////sv///7L///+y////sgAAALIAAACyAAAAsgAAALIAAACyAAAAsv///7L///+yAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALL///+y////sgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACy////sv///7IAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsv///7L///+yAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALL///+y////sgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACy////sv///7IAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsv///7L///+yAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACyAAAAsgAAALIAAACy");
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
		return da.strToPat(ctx, "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D/IEFh7yCCg28gkrO/IJMELyCCk58gcmNPIJLT7yBRsl8gQRGPIEFR7yAQYI8gIHCfIDDhPyBRki8gQSGfIEFBzyBBMa8gUZIvIDDxTyAQQG8gILD/IDERfyBRYf8gQVHvIFFx/yAw8V8gUZIvIDDBHyAQcJ8gIMEfIEExnyBBUe8ggmNPIMOlDyCTJE8gkwQvILN0vyDT9W8gkwQfIDEBfyBh4n8gktPvIORF3yDDxT8g0/VvIMPVTyDDtR8gcgLPIEFBvyBRsl8gYcJvIEExvyCSw98g1CWvILN0zyDD9X8gw/VvIPSWXyCTJE8gUYIfIGHyvyDD9W8g5EXvIPS2fyDUNc8g1AV/IORF7yByMv8gYaJPIGHinyBRcf8gMSGPIIKTjyDT5V8gw7UfINPlbyDDtR8g5GYPIJKTjyBBUc8gcjMPIMPVPyDD5W8g0+VfILOU/yDDpQ8g1AWfIHJDLyBRUe8gYeKPIEFBvyBBQb8ggpOfIMP1byDUFZ8gw9U/ILOU3yDkRe8gkuP/IEFx/yBh8s8gw7UfIMPVTyCzdL8g0/VvINQlryDUJa8gYhLfIFFh7yBRwl8gQWHvIFFx/yCSs88gw+VPIJNUjyDD5V8gw7UfINQVnyCCs88gUWHvIGGyTyDDxT8g1BWfIMP1byDDtR8gkzRvILOU/yBh8p8gUXIPIGHCbyBRkj8gUWH/IIJTTyCzlO8gs3S/IMO1HyDD1U8g1BWvIIKDfyBBIZ8gYeKfIMO1HyDUJa8g0/V/ILOU7yCzZK8g0/V/IGICzyBBYe8gYaJPI=");
	},
	"white_cashmere": function(ctx) {
		return da.strToPat(ctx, "EBDu7u7/8vLy//Dw8P/v7+//8vLy//Ly8v/y8vL/8vLy//Ly8v/x8fH/8/Pz//Ly8v/y8vL/8fHx//Ly8v/u7u7/8vLy//Hx8f/v7+//8fHx//Ly8v/y8vL/8/Pz//Hx8f/w8PD/9PT0//X19f/y8vL/8PDw//Hx8f/x8fH/7e3t//Dw8P/w8PD/8PDw//Hx8f/x8fH/8vLy//Ly8v/y8vL/8vLy//T09P/y8vL/8vLy//Ly8v/w8PD/8PDw//Hx8f/y8vL/8vLy//Dw8P/y8vL/8vLy//Ly8v/w8PD/8fHx//Ly8v/y8vL/8vLy//Dw8P/w8PD/8vLy//Ly8v/x8fH/9fX1//Ly8v/y8vL/8/Pz//Pz8//y8vL/8fHx//Ly8v/09PT/8/Pz//Ly8v/09PT/9PT0//Pz8//y8vL/8PDw//Hx8f/y8vL/8fHx//Hx8f/x8fH/8fHx//Dw8P/w8PD/8fHx//Hx8f/w8PD/8/Pz//Ly8v/x8fH/8PDw/+/v7//v7+//8vLy/+7u7v/v7+//7u7u/+7u7v/v7+//7+/v//Dw8P/v7+//8PDw//Hx8f/y8vL/8PDw/+7u7v/v7+//8vLy//Hx8f/v7+//8PDw//Dw8P/w8PD/8fHx//T09P/w8PD/8PDw//Pz8//x8fH/8vLy//Hx8f/w8PD/8fHx//Ly8v/w8PD/7+/v//Dw8P/w8PD/8fHx//Hx8f/w8PD/7u7u//Ly8v/z8/P/8fHx//Ly8v/w8PD/8vLy//Dw8P/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/w8PD/7e3t//Hx8f/z8/P/8vLy//Pz8//y8vL/8fHx//Hx8f/u7u7/9PT0//T09P/x8fH/8fHx//Ly8v/y8vL/8/Pz//Pz8//z8/P/8/Pz//T09P/z8/P/8vLy//Pz8//09PT/8fHx//Pz8//y8vL/8vLy//Pz8//y8vL/8/Pz//Ly8v/z8/P/9fX1//T09P/z8/P/9PT0//Pz8//09PT/9PT0//Pz8//y8vL/8fHx//Ly8v/y8vL/8/Pz//Ly8v/y8vL/8vLy//T09P/z8/P/8vLy//Ly8v/z8/P/8vLy//Ly8v/y8vL/8/Pz//Ly8v/w8PD/8vLy//Ly8v/y8vL/8vLy//Ly8v/y8vL/8/Pz//T09P/z8/P/8/Pz//T09P/y8vL/8vLy//Ly8v/w8PD/8PDw//Dw8P/v7+//8fHx//Ly8v/w8PD/8PDw//Ly8v/y8vL/8vLy//Hx8f/y8vL/8/Pz//Ly8v/u7u7/7e3t//Dw8P/v7+//8PDw//Dw8P/v7+//8fHx//Hx8f/x8fH/8vLy//Dw8P/y8vL/8PDw/+/v7//w8PD/");
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