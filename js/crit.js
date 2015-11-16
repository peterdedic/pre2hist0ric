// ---------------------------------------
//			C R I T T E R
// ---------------------------------------

"use strict;"
var Crit = function (args) {
	this.name = args.name || "crit";
	this.type = "crit";
	this.isActive = true;
	this.env = args.env;

    this.health = 10;
    this.damage = 1;
    this.isDead = false;
    this.dir = v2.norm(args.dir) || [0, 1];
	
	this.shape = new CircleShape(args);
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function(ctx) {
	
	// ------ DRAW BODY ----------------
	this.shape.draw(ctx, this.body.pos, this.dir);
	
};

Crit.prototype.update = function(deltaTime) {

    if (this.health < 1)
        this.isActive = false;

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Crit.prototype.takeDmg = function(dmgInfo) {
	this.health -= dmgInfo.amount;
    //this.body.pos = v2.addv(this.body.pos, v2.muls(dmgInfo.dir, 15));
};

Crit.prototype.attack = function() {

};

Crit.prototype.stop = function() {
	this.vel = [0, 0];
};

