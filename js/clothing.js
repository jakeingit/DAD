"use strict";

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