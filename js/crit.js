// ---------------------------------------
//			C R I T T E R
// ---------------------------------------

"use strict;"
var Crit = function (args) {
	this.name = args.name || "crit";
	this.type = "crit";
	this.isActive = true;
	this.env = args.env;
	
	this.shape = new CircleBody(args);
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function(ctx) {
	
	// ------ DRAW BODY ----------------
	this.shape.draw(ctx, this.body.pos, this.body.dir);
	
};

Crit.prototype.update = function(deltaTime) {

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

//Crit.prototype.canTouch = function(v) {
//	return (v2.dist(this.pos, v) <= this.TOUCH_RANGE);
//};

Crit.prototype.stop = function() {
	this.vel = [0, 0];
};

// Crit.prototype.handleCollision = function (e) {
// 	this._hasCollided = true;
// 	this.pos = v2.addv(this.pos, v2.muls(e.normal, e.overlap));
// }
//Crit.prototype.getDistToEnt = function(ent) {
//	if (ent.pos) {
//		return v2.dist(this.pos, ent.pos);
//	}
//	if (ent.type === "line") {
//		return v2.dist(this.pos, Line2.closestPoint(this.pos, ent));
//	}
//}
