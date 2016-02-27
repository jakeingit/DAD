"use strict";
// continue draw avatar module
var da = (function(da){


var defaultStats = da.defaultStats = {
		// core stats, with limits in Player.statLimits
		str	: 5,
		dex	: 5,
		con	: 5,
		wil	: 5,
		age	: 18,
		gender : "female",
		hair	: 3,	// style and length
		eyes	: 0,
		face	: 3,
		lips	: 3,
		skin	: 3,
		breast	: 3,
		hips	: 3,
		butt	: 3,
		fem 	: 6,
		sub 	: 5,

		// vitals
		arousal : 0,
};
var defaultMods = da.defaultMods = {
		// idosyncratic stats (random deviations for each person)
		// could also be modified by items
		amazon: 0,
		breasts:0,
		penis: 	0,
		testes: 0,
		eyes: 	0,
		lips: 	0,
		lipw: 	0,	// lip width
		lipt: 	0, 	// lip thickness
		liph: 	0, 	// lip height
		lipc: 	0, 	// lip curl
		fem: 	0,
		sub: 	0,
		waist: 	0,	// positive is narrower
		ass: 	0,	
		legl: 	0,	// how long their legs are (proportion of body that is legs) 
		eyec: 	0,	// eye curl (positive produces / slant, negative \ slant) [-4,10]
		skinc: 	0,	// skin color, positive is darker
		noseskew:0,	// positive means nose starts on the right
		penist: 0,	// penis thickness
	};
var defaultPhysique =  da.defaultPhysique = {
		"hairc": 20,
		"hairstyle": 3,
		"height":6,

		// special numbers 100 = red, 101 = blue
		"irisc": -10,
		"skin": 0,		
		
		// Body parts
		"breastrows": 0,
		"gentialscnt": 1,
    };

var Player = da.Player = function(data) {
	Object.assign(this, {	// default value construction; overriden by properties of data passed in
		// modifiers
		Mods 	: defaultMods,
		// physique for drawing
		physique: defaultPhysique,
				
		// inventory
		top		: "",
		bot		: "",
		shoes	: "",
		acc		: [],
		back	: [],
		
		// sex organ status and history
		value_virginity	: false,
		vag_used: 0,	// -1 indicates magic enhancements, higher number reflects higher usage
		ass_used: 0,
		vag_sex	: 0,	// # times used
		ass_sex	: 0,
		
		piercings 	: [],
		fetishes 	: [],
		traits		: [],
	}, defaultStats, data);
};


// ---- player drawing functions ----
Player.prototype.selectClothing = function(drawAt) {
	// selector is a filter function taking in a clothing object and returning boolean
	// returns an array of {layer:layer of clothing, draw:draw function} since 
	// sometimes 1 piece of clothing needs multiple parts to be drawn at different points (a shirt)
	drawAt = "draw"+drawAt;
	var toDraw = [];
	var wornClothes = ["top", "bot", "shoes"];
	for (var i=0; i < wornClothes.length; ++i) {
		var c = da.clothes[this[wornClothes[i]]];
		if (c && typeof c[drawAt] === "function") 
			toDraw.push({layer:c.layer,draw:c[drawAt]});
	}
	// draw accessories (same as above)
	for (var i=0; i < this.acc.length; ++i) {
		var c = da.clothes[this.acc[i]];
		if (c && typeof c[drawAt] === "function") 
			toDraw.push({layer:c.layer,draw:c[drawAt]});
	}

	// sort in order of layer with lower layer placed first
	toDraw.sort(function(a,b) {
		return (a.layer < b.layer)? -1 : 1;
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

Player.prototype.heightAdjust = function() {
	// heel's height will make you taller!
	var extraheight = 0;
	if (this.shoes) {
		extraheight += da.clothes[this.shoes].height;
	}

	return extraheight;
};
Player.prototype.isWearing = function(clothesName) {
	if (!da.clothes.hasOwnProperty(clothesName)) return false;
	var cc = da.clothes[clothesName];
	if (cc.loc === "acc") {
		return (this.acc.indexOf(clothesName) > -1);
	}
	return this[cc.loc] === clothesName;
};
Player.prototype.changeClothes = function(clothesName) {
	// change into da.clothes provided, doesn't handle removing from backpack since source agnostic!
	if (!da.clothes.hasOwnProperty(clothesName)) return;
	var cc = da.clothes[clothesName];
	if (this.isWearing(clothesName)) {	// change out of da.clothes
		console.log("changing out of", clothesName);
		if (cc.loc === "acc") {
			this.acc.splice(this.acc.indexOf(clothesName), 1);	// remove
		}
		else
			this[cc.loc] = "";

		// reset the previoiusly applied modifiers
		for (var mod in defaultMods) {
			if (cc.hasOwnProperty(mod) && !isNaN(cc.mod)) {
				this.Mods[mod] -= cc.mod;
			}
		}		

		this.back.push(clothesName);
	}
	else {	// change into da.clothes
		console.log("changing into", clothesName);
		if (cc.loc === "acc") {
			this.acc.push(clothesName);
		}
		else {
			if (this[cc.loc]) // already wearing something there, change out of it first
				this.changeClothes(this[cc.loc]);
			this[cc.loc] = clothesName;
		} 

		// apply modifiers
		for (var mod in defaultMods) {
			if (cc.hasOwnProperty(mod) && !isNaN(cc.mod)) {
				this.Mods[mod] += cc.mod;
			}
		}
	}
}

// for bias, if not defined then default to 1 - it means females tend to get higher values
// otherwise, 0 means unisex, and a negative number means more affected by high masculinity
Player.femBias = {
	// core stats
	age:0,
	str:-0.5,
	dex:-0.3,
	con:-0.2,
	wil:0,
	eyes:2,
	breast:2,
	skin:2,
	fem:2,
	sub:2,
	// physiques
	hairc:0,
	height:-2,
	gentialscnt:0,
	face:3,
	eyes:3,
	lips:3,
	hairlength:3,
	shoulders:1.5,
	breasts:5,
	testes:2,
	penis:2,
	waist:2,
	legs:3,
	// idiosyncracies
	skinc:-3,
	lipw:2,
	lipt:3,
	liph:0,
	lipc:0,
	legl:0,
	eyec:0,
	noseskew:0,
	penist:-2,
};

Player.statLimits = {	// core stats, each with low, high, average, and stdev (assuming Normally distributed)
	str	: {low:0, high:10, avg:5, stdev:2.5},
	dex	: {low:0, high:10, avg:5, stdev:2.5},	// honestly, large chests don't do much for dexterity
	con	: {low:0, high:10, avg:5, stdev:2.2},
	wil	: {low:0, high:10, avg:4, stdev:1.5},	// brains > brawns ;P
	// appearance scores, 0-11, lower scores are more modest
	// they will be shown as 1 + their value so 1-12
	age	: 		{low:0, high:1e9, avg:30, stdev:6},	// no real limit on age
	hair	: 	{low:0, high:11, avg:4, stdev:3},	// style and length
	eyes	: 	{low:0, high:11, avg:4, stdev:2},	// higher value is more seductive
	face	: 	{low:0, high:11, avg:5, stdev:2},	// higher value is better looking
	lips	: 	{low:0, high:11, avg:4, stdev:3},
	skin	: 	{low:0, high:11, avg:6, stdev:2,bias:1},	// higher value is better looking / fresher
	breast	: 	{low:0, high:11, avg:1, stdev:1.5},
	hips	: 	{low:0, high:11, avg:5, stdev:2},
	butt	: 	{low:0, high:11, avg:3, stdev:2},
	fem 	: 	{low:0, high:11, avg:5, stdev:1},
	sub 	: 	{low:0, high:11, avg:4, stdev:1},

	// vitals
	arousal : {low:0, high:11, avg:4, stdev:2},	

	// statistics
	vag_used: {low:-1, high:10, avg:3, stdev:2},	// -1 indicates magic enhancements, higher number reflects higher usage
	ass_used: {low:-1, high:10, avg:1, stdev:3},
	vag_sex	: {low:0, high:1e9, avg:4, stdev:8},	// # times used; optimistic?
	ass_sex	: {low:0, high:1e9, avg:0, stdev:4},	
};
Player.statDiscretePool = { 	// pool of available values for discrete properties
	gender  : 	["female", "male", "futa"],
	name 	: 	["Alice", "Anna", "Anaïs", "Alexis", "Alex", "Aaron", "Abdul", "Abe", "Abel", "Abraham", "Abram", "Adalberto", "Adam", "Adan", "Adolfo", "Adolph", "Adrian", "Agustin", "Ahmad", "Ahmed", "Al", "Alan", "Albert", "Alberto", "Alden", "Aldo", "Alec", "Alejandro", "Alex", "Alexander", "Alexis", "Alfonso", "Alfonzo", "Alfred", "Alfredo", "Ali", "Allan", "Allen", "Alonso", "Alonzo", "Alphonse", "Alphonso", "Alton", "Alva", "Alvaro", "Alvin", "Amado", "Ambrose", "Amos", "Anderson", "Andre", "Andrea", "Andreas", "Andres", "Andrew", "Andy", "Angel", "Angelo", "Anibal", "Anthony", "Antione", "Antoine", "Anton", "Antone", "Antonia", "Antonio", "Antony", "Antwan", "Archie", "Arden", "Ariel", "Arlen", "Arlie", "Armand", "Armando", "Arnold", "Arnoldo", "Arnulfo", "Aron", "Arron", "Art", "Arthur", "Arturo", "Asa", "Ashley", "Aubrey", "August", "Augustine", "Augustus", "Aurelio", "Austin", "Avery"],
};


Player.physiqueLimits = {
	hairc: 		{low:-5,high:120,avg:10,stdev:12},	// jet black to platinum blonde (40) to silver white (100) to pure white (~200)
	hairstyle: 	{low:0,high:11,avg:4,stdev:3},					// bald (0) to parted at middle hair style (not 0)
	height: 	{low:-10,high:25,avg:9,stdev:4},		// 4'5" (-10) to 5'7" (10) to 6'6" (25) (need some canvas teweaking?)
	irisc: 		{low:-20,high:100,avg:5,stdev:20},	// red (~-20) to brown (0) to green (10) to blue (20) to purple (40)
	skin: 		{low:-20,high:50,avg:10,stdev:30},	// translucent (-20) to porcelein (-10) to fair (-5) to tanned (5) to brown (15) pure black (50)
	breastrows: {low:0,high:0,avg:0,stdev:0},		// should only have 1 row...
	gentialscnt:{low:0,high:2,avg:1,stdev:0.1},
	face: 		{low:-8,high:28,avg:10,stdev:5},		// hypermasculine (-5) to androgenous (10) to feminine (25)
	eyes: 		{low:-15,high:25,avg:0,stdev:2},		// squinty eyes (-15) to super surprise (25)
	lips: 		{low:-20,high:40,avg:0,stdev:10},	// thin line (-20) to duck lips (40)
	hairlength: {low:-1,high:100,avg:5,stdev:13},	// short (-1) to floor touching (100)
	shoulders: 	{low:-4,high:60,avg:18,stdev:18},	// freakishly strong (-4) to boyish (15) to feminine (25) emaciated (60)
	breasts: 	{low:-5,high:100,avg:10,stdev:8},	// flat (-5) to A (10) to B (13) to C (15) to D (18) to DD (20) to E (23) to ... to gargantuan (100) 
	nipples: 	{low:0,high:40,avg:8,stdev:8},				// nonexistent (0) to prominent (15) to udders (40)
	testes: 	{low:-20,high:35,avg:0,stdev:8},		// gigantic (-20) to nothing there (11) to deep slit (35)  
	penis: 		{low:-10,high:20,avg:0,stdev:4},		// footlong (-10) to nothing there (20)
	waist: 		{low:-20,high:35,avg:8,stdev:8},		// pregnant (-20) to flat (0) to toned (5) to narrow (10) to pinched (30)
	hips: 		{low:-10,high:50,avg:0,stdev:7},		// narrow (-10) to normal (0) to wide (15) to fertility goddess (30)
	ass: 		{low:-10,high:40,avg:10,stdev:10},	// nonexistent (-10) to normal (10) to titanic (40)			
	legs: 		{low:-5,high:55,avg:15,stdev:10},	// leg day (-5) to boyish (10) to neutral (15) to lithe (20) to curvy (30) to gigantic thighs (50)
};

// only put numerical idiosyncratic values here
Player.modLimits = {
	breasts: 	{low:-1e9,high:1e9,avg:0,stdev:2},
	penis: 		{low:-1e9,high:1e9,avg:0,stdev:2, bias:-6},	// override here since for modifiers, higher penis actually results in lower physique.penis
	testes: 	{low:-1e9,high:1e9,avg:-1,stdev:1, bias:-4},	// same here as well
	eyes: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	lips: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	lipw: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	lipt: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	liph: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	lipc: 		{low:-3,high:1e9,avg:2,stdev:2},	// anything below -3 is just too creepy
	fem: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	sub: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	waist: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	ass: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	legl: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	eyec: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	noseskew: 	{low:-1e9,high:1e9,avg:0,stdev:2},
	skinc: 		{low:-1e9,high:1e9,avg:10,stdev:15},	// this is the "natural skin color"
	penist: 	{low:-10, high:1e9,avg:0,stdev:2},
};
// use objects as unordered sets (mapped value is dummy, just true here)
Player.physiqueAllowed = {
	hairc: 		{},
	hairstyle: 	{},
	height: 	{},
	irisc: 		{},
	skin: 		{100:true,101:true,102:true},
	breastrows: {},
	gentialscnt:{},
	face: 		{},
	eyes: 		{},
	lips: 		{},
	hairlength: {},
	shoulders: 	{},
	breasts: 	{},
	nipples: 	{},
	testes: 	{},
	penis: 		{},
	waist: 		{},
	hips: 		{},
	ass: 		{},
	legs: 		{},
};
Player.prototype.clampStats = function() {
	for (var p in Player.statLimits) {
		this[p] = da.clamp(this[p], Player.statLimits[p].low, Player.statLimits[p].high);
	}
};
Player.prototype.clampPhysique = function() {
	for (var p in Player.physiqueLimits) {
		// this property is limited and the value is not explicitely allowed
		if (!Player.physiqueAllowed[p].hasOwnProperty(this.physique[p])) {
			this.physique[p] = da.clamp(this.physique[p], Player.physiqueLimits[p].low, Player.physiqueLimits[p].high);
		}
	}
};

Player.prototype.getFem = function() {
	return this.fem + this.Mods.fem;
};
Player.prototype.getSub = function() {
	return this.sub + this.Mods.sub;
};
Player.prototype.calcSkin = function() {
	if (isNaN(this.physique.skin)) return this.physique.skin;	// already set, just pass through
	return -this.skin + this.Mods.skinc;	// -10 is porcelein
};
Player.prototype.calcFace = function() {
	// higher value is more feminine
	var f = this.getFem() + this.face*1.8 - this.str;
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
	var v = this.hair*2 + this.getFem() + this.getSub();
	return v;
};
Player.prototype.calcShoulders = function() {
	// higher value is more feminine
	var s = (this.getFem() + this.getSub()) * 2.1; // scaling factor
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
	return this.getFem()*0.6 + this.breast;
};
Player.prototype.calcTestes = function(considerMods) {
	// higher is more feminine
	var val	= (this.getSub() + this.getFem())*1.3;
	if (this.Mods.testes > 0 && considerMods)
		val = val > 0 ? this.Mods.testes * -2 : (val + this.Mods.testes * 2);
	return val;
};
Player.prototype.calcPenis = function() {
	var v = this.getFem()*1 + this.getSub()*1 - this.Mods.penis;
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
	return (this.getFem() + this.hips)*1.2 - 2;
};
Player.prototype.calcAss = function() {
	return this.getFem() + this.Mods.ass + this.butt;
};
Player.prototype.calcLegs = function() {
	return this.getFem()*1.5 + this.getSub()*2 - this.str;
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
    this.physique.ass = this.calcAss();
    this.physique.legs = this.calcLegs();
    this.clampPhysique();
};
Player.prototype.hasCock = function() {
	var tst = this.calcTestes(false);
	return tst <= 11;
};
Player.prototype.hasVagina = function () {
	var tst = this.calcTestes(false);
	return tst > 11;
};
Player.prototype.isFutanari = function() {
	return this.hasCock() && this.hasVagina();
};
Player.prototype.isFemale = function () { 
	return this.fem > 5; 
};
Player.prototype.isMale = function () { 
	return !(this.isFemale() || this.isFutanari()); 
};


// ---- player character description functions ----
Player.prototype.toJSON = function () {
	/*
		This ensures that all of the object's own enumerable properties
		are passed to the constructor, thus restoring the state of the
		original object upon deserialization.
	*/
	return JSON.reviveWrapper('new Player('+ JSON.stringify(Object.assign({}, this)) + ')');
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
	var pc = new Player();
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

	return pc;
}

return da;
}(da || {}));