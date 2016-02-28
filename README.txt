[size=150]1. Download and Including into Game[/size]

Go to the IGDB link above and download the latest version.
Extract into any folder.
[b]Copy the content of da.js[/b] into the top of your Story Javascript.
That's all.

[size=150]2. Using the code in your Game[/size]

First we need a place on the page to draw the avatar. This is up to you, but for example in the tester we want it inside an element with the id "testbody"
[code]
var canvas_holder = document.getElementById("testbody");
// getting it for the first time, so create it with those style overrides
var canvas = da.getCanvas("player_avatar", {
	parent:canvas_holder,
	border:"1px solid black",
});
[/code]

You can hide and unhide the canvas with the following:
[code]
// hiding it and then immediately showing it again
da.hideCanvas("player_avatar");
da.showCanvas("player_avatar");
[/code]
Note we're passing in the string name of the canvas, which is also it's DOM id.

Now let's create a Player object so we can draw to the canvas we just made:
[code]
var PC = new da.Player();
[/code]
The default Player isn't very interesting. We can construct the player while overriding some of its default values.
Note that the properties you don't specify are initialized with the default value (we'll talk about it later):
[code]
var PC = new da.Player({
	name 		: "Genesis",
	fullname 	: "HAL 9001",
	gender 		: "female",
	occupation 	: "Pod Bay Opener",
	// provide specific values here to override the default ones set
	str			: 5,
	dex			: 5,
	con			: 5,
	wil			: 5,
	age			: 26,

	lips		:6,
	breast 		:2,
	hips 		:4,
	hair 		:2,
	fem 		:7,
	sub 		:2,
	butt 		:3,
	eyes 		:8,
	face 		:6,
	skin 		:7,

	// physique and mods have to be overriden like this
	Mods 		: Object.assign({}, da.defaultMods(), {
		// doesn't matter if the property names are wrapped in quotes or not
		"amazon":0,
		"breasts":4,
		"penis":-5,
		"testes":-6,
		"eyes":0,
		"lips":2,
		"lipw":-3,
		"lipt":2,
		"liph":-1,
		"lipc":3,
		"fem":1,
		"sub":2,
		"waist":2,
		"ass":-2,
		"legl":-2,
		"eyec":-1,
		"skinc":6,
		"noseskew":0,
		"penist":-1,
		"browc":5,
	}),
	physique 	: Object.assign({}, da.defaultPhysique(), {
		"hairc":-5,
		"hairstyle":4,
		"height":6,
		"irisc":-20,
		"hairlength":19,
		"nipples":6.8,
	}),
});
[/code]

All right, now that we have our Player object, we can draw her onto a canvas:
[code]
da.drawfigure("player_avatar", PC);
[/code]
Where we pass in the canvas name to draw to as well as the Player object.

[b]That's it for the most basic usage of drawing an avatar![/b]
You can stop here if you're fine with the default Player object and the properties it holds.
See the included js/player.js for details on what stats it has and how its physique is calculated.
If you want to have an extended Player system (if you want more stats, different ways of calculating physique, and so on),
read on.

[size=150]3. Extending the Player prototype for your own game[/size]

All of this is done in your own Story Javascript, after copy pasting da.js into the top of it.

Suppose we want to include a new core statistic to our Player prototype, intelligence, or int for short.
We can do this by simply defining its distribution:
[code]
// create additional core stat of int (intelligence) with default value of 5
da.defaultStats["int"] = 5;
[/code]
Then giving that stat some bounds and probability
[code]
da.Player.statLimits["int"] = {low:0, high:10, avg:5, stdev:2.5, bias:0.3};
[/code]
Bias is mostly used when randomly generating a character. 
Higher positive bias means more feminine characters will more likely have higher values for this stat.
That's all you need to do for adding a new stat.

Now you might want to change the way physiques are calculated to take into account your new stat.
Each of the Player's physique is calculated by separate functions to allow easy overrides by you.
Let's say that we'd intelligence to change how long our hairlength is,
[code]
da.Player.prototype.calcHairLength = function() {
	var v = this.hair*2 + this.getFem() + this.getSub() + this.int;
	return v;
};
[/code]
See js/player.js for the list of all the "calc" functions that are for calculating physique.
The tester (test.html) is great for seeing whether your physique calculation makes sense or not.
Once you add the int stat in as well as change the way hairlength is calculated, moving the int slider will change the hair and you can immediately see how that stat affects the character!

The procedure is similar if you'd like to add a modifier, which are values that change based on genetics (some people just have longer legs), items used, and worn clothing.
[code]
da.Player.modLimits["fat"] = {low:-1e9, high:1e9, avg:2, stdev:2, bias:0};
// both sexes are equally as fat on average
[/code]

Similarly let's change how the waist is drawn. This time, we're going to extend it without having to know how it was previously calculated:
[code]
var prevCalcWaist = da.Player.prototype.calcWaist;	// keep track of how we were doing it before
da.Player.prototype.calcWaist = function() {
	return prevCalcWaist.call(this) - this.Mods.fat;	// note that lower waist values is wider
}
[/code]

That's the basics of extending the Player system for your own game! If you have more questions, post in this thread or PM me.

[size=150]4. Convenient Tools[/size]

Creating random characters is a common task, so here's a function for it:
[code]
var fembias = 0.7;	// how feminine the character will likely be
var PC = da.createRandomCharacter(fembias);
[/code]
fembias is a number between -1 and 1 with a higher positive value meaning the character will likely be more feminine.

If you'd like to change the da module itself instead of extending it in your own story Javascript, you can do it (but I don't recommend it)
conveniently by keeping the build.py running. Basically it listens for file changes inside the js folder and every time a file changes
it concatenates everything into da.js. You can keep it running through:
[code]
python build.py
[/code]
Make sure you have python installed and pip install watchdog and jsmin python packages

[size=150]5. Drawing clothes[/size]

All of the clothes are defined under the da.clothes object. It maps the string name of clothes to the actual clothing object.
First let's see how we can wear existing clothes (then we'll see how you can make your own clothes):
[code]
// assuming we made PC before
PC.changeClothes("grey_tank");
PC.changeClothes("levi_511");
PC.changeClothes("classic_black_pumps");
PC.changeClothes("black_paint");
[/code]
Please always change into clothes using the changeClothes function, rather than assigning directly to a location (e.g. PC.top = "grey_tank").
This is so that the clothes' modifiers are correctly applied and it's put in the right location.
Note that the function doesn't remove the item from PC.back, which you have to do additionally.

By default, the Player prototype has top, bot, and shoes as locations where you can have 1 item equipped.
I probably will change this sometime in the future so that you can wear items in the same location with different layer values.

To change out of clothes, you call the same function (changeClothes will change you out of it if you're wearing it):
[code]
PC.changeClothes("grey_tank");
[/code]

[size=150]6. Making your own clothes[/size]
TODO