"use strict";
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

	// vitals
	arousal : {low:0, high:11, avg:4, stdev:2},	

	// statistics
	vag_used: {low:-1, high:10, avg:3, stdev:2},	// -1 indicates magic enhancements, higher number reflects higher usage
	ass_used: {low:-1, high:10, avg:1, stdev:3},
	vag_sex	: {low:0, high:1e9, avg:4, stdev:8},	// # times used; optimistic?
	ass_sex	: {low:0, high:1e9, avg:0, stdev:4},	
};
var statDiscretePool = { 	// pool of available values for discrete properties
	gender  : 	["female", "male", "futa"],
};



var physiqueLimits = {
	hairc: 		{low:-5,high:120,avg:10,stdev:12},	// jet black to platinum blonde (40) to silver white (100) to pure white (~200)
	hairstyle: 	{low:0,high:11,avg:4,stdev:3},					// bald (0) to parted at middle hair style (not 0)
	height: 	{low:-10,high:25,avg:6,stdev:3},		// 4'5" (-10) to 5'7" (10) to 6'6" (25) (need some canvas teweaking?)
	irisc: 		{low:-20,high:100,avg:5,stdev:20},	// red (~-20) to brown (0) to green (10) to blue (20) to purple (40)
	skin: 		{low:-20,high:50,avg:10,stdev:30},	// translucent (-20) to porcelein (-10) to fair (-5) to tanned (5) to brown (15) pure black (50)
	breastrows: {low:0,high:0,avg:0,stdev:0},		// should only have 1 row...
	gentialscnt:{low:0,high:2,avg:1,stdev:0.1},
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
	ass: 		{low:-10,high:40,avg:10,stdev:10},	// nonexistent (-10) to normal (10) to titanic (40)			
	legs: 		{low:-5,high:55,avg:15,stdev:10},	// leg day (-5) to boyish (10) to neutral (15) to lithe (20) to curvy (30) to gigantic thighs (50)
};
// use objects as unordered sets (mapped value is dummy, just true here)
var physiqueAllowed = {
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
	lipw: 		{low:-1e9,high:1e9,avg:0,stdev:2}, 	// lip width
	lipt: 		{low:-1e9,high:1e9,avg:0,stdev:2},	// lip thickness
	liph: 		{low:-1e9,high:1e9,avg:0,stdev:2},	// lip height
	lipc: 		{low:1,high:1e9,avg:2,stdev:2},	 // lip curl; anything below -3 is just too creepy
	fem: 		{low:-1e9,high:1e9,avg:0,stdev:1},
	sub: 		{low:-1e9,high:1e9,avg:0,stdev:2},
	waist: 		{low:-1e9,high:1e9,avg:0,stdev:2},		// positive is narrower
	ass: 		{low:-1e9,high:1e9,avg:0,stdev:2},
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
	gentialscnt:0,
	face:3,
	eyes:3,
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
var defaultStats = da.defaultStats = getDefault(statLimits);
var defaultPhysique = da.defaultPhysique = getDefault(physiqueLimits, physiqueDiscretePool);
var defaultMods = da.defaultMods = getDefault(modLimits, modDiscretePool);
var defaultWorn = da.defaultWorn = {	
	// each maps a layer to a clothing name 
	top:{},
	bot:{},
	shoes:{},
	acc:{},
};
// class definition for Player
var Player = da.Player = function(data) {
	Object.assign(this, {	// default value construction; overriden by properties of data passed in
		// modifiers
		Mods 	: defaultMods(),
		// physique for drawing
		physique: defaultPhysique(),
				
		// what is being worn or wielded
		worn 	: defaultWorn,
		// inventory
		inv		: [],

		
		// sex organ status and history
		value_virginity	: false,
		vag_used: 0,	// -1 indicates magic enhancements, higher number reflects higher usage
		ass_used: 0,
		vag_sex	: 0,	// # times used
		ass_sex	: 0,
		
		piercings 	: [],
		fetishes 	: [],
		traits		: [],
	}, defaultStats(), data);

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
Player.physiqueAllowed = physiqueAllowed;
Player.statDiscretePool = statDiscretePool;
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
			if (c && typeof c[drawAt] === "function") 
				toDraw.push({layer:layer,draw:c[drawAt]});
		}
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
	// take the max height of what's being worn in shoes location
	for (var layer in this.worn.shoes) {
		if (da.clothes[this.worn.shoes[layer]] && da.clothes[this.worn.shoes[layer]].hasOwnProperty("height"))
			extraheight = Math.max(extraheight, da.clothes[this.worn.shoes[layer]].height);
	}

	return extraheight;
};
Player.prototype.isWearing = function(clothesName) {
	if (!da.clothes.hasOwnProperty(clothesName)) return false;
	var cc = da.clothes[clothesName];
	console.log(cc);
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
		if (!isNaN(this.physique[p]) && !Player.physiqueAllowed[p].hasOwnProperty(this.physique[p])) {
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
	return -this.skin + this.Mods.skinc;	// -10 is porcelein
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
	var v = this.hair*2 + this.getFem() + this.getSub() + this.Mods.hairlength;
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
	return this.getFem()*0.6 + this.breast + this.Mods.shoulders;
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
Player.prototype.calcAss = function() {
	return this.getFem() + this.Mods.ass + this.butt;
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
    this.physique.ass = this.calcAss();
    this.physique.legs = this.calcLegs();
    this.clampPhysique();
};
Player.prototype.hasCock = function() {
	if (this.Mods.penis > 4) return true;	// higher modifier overrides this
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
	pc.clampMods();

	return pc;
}

return da;
}(da || {}));