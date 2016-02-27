// namespace of Context2DTracked
(function(namespace){

	// class definition on the namespace (probably global)
	namespace.Context2DTracked = function(target){
		// target is Canvas Context2D that will be wrapped and tracked
		this.context = target;

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

		this.scale = function(x, y) {
			this.scalex *= x;
			this.scaley *= y;
			target.scale(x,y);
		}
		this.translate = function(x, y) {
			this.ox += x;
			this.oy += y;
			target.translate(x,y);
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
		this.lineTo = function(x,y, showcontrol) {
			if (showcontrol || this.showcontrol) {
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y}
				}, {
					controlLine: {color:"rgb(200,100,100)", width:1},
					point: {color:"rgb(200,50,50)", fill:"white", width:2, radius:2},					
				});
			}
			target.lineTo(x,y);
			this.movePen(x,y);
		}

		this.bezierCurveTo = function(cpx1,cpy1,cpx2,cpy2,x,y, showcontrol) {
			if (showcontrol || this.showcontrol) {
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y},
					cp1: {x:cpx1, y:cpy1},
					cp2: {x:cpx2, y:cpy2},
				}, {
					controlLine: {color:"rgb(200,100,100)", width:1},
					point: {color:"rgb(200,50,50)", fill:"white", width:2, radius:2},
				});
			}
			// rest of curve
			target.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
			this.movePen(x,y);
		}
		this.quadraticCurveTo = function(cpx, cpy, x, y, showcontrol) {
			if (showcontrol || this.showcontrol) {
				this.drawCurveControl({
					p1: {x:this.penx, y:this.peny},
					p2: {x:x, y:y},
					cp1: {x:cpx, y:cpy},
				}, {
					controlLine: {color:"#C00", width:1},
					point: {color:"#C00", fill:"white", width:2, radius:2},					
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
			console.log(["from points","("+Math.round(point.p1.x*10)/10+", "+Math.round(point.p1.y*10)/10+")", "to", 
				"("+Math.round(point.p2.x*10)/10+", "+Math.round(point.p2.y*10)/10+")"].join(" "));
			// draw control lines
			target.strokeStyle = style.controlLine.color;
			target.lineWidth = style.controlLine.width;
			if (point.cp1) {
				target.moveTo(point.p1.x, point.p1.y);
				target.lineTo(point.cp1.x, point.cp1.y);
				if (point.cp2) {
					// 2 control points, cubic bezier
					target.lineTo(point.cp2.x, point.cp2.y);
					target.lineTo(point.p2.x, point.p2.y);
				}
				else {
					target.lineTo(point.p2.x, point.p2.y);
				}
			}
			target.stroke();

			// control points
			for (var p in point) {
				target.lineWidth = style.point.width;
				target.strokeStyle = style.point.color;
				target.fillStyle = style.point.fill;
				target.beginPath();
				target.arc(point[p].x, point[p].y, style.point.radius, 0, 2*Math.PI, true)
				target.font = "8px arial";
				target.fill();
				target.fillStyle = "black";
				target.fillText("("+Math.round(point[p].x*10)/10+", "+Math.round(point[p].y*10)/10+")", point[p].x+style.point.radius+5, point[p].y+style.point.radius+5);
				target.stroke();

			}

			target.restore();
			target.beginPath();	// return to previously open path
			target.moveTo(point.p1.x, point.p1.y);

		}
	};
	
}(this));