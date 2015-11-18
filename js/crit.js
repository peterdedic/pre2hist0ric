// ---------------------------------------
//			C R I T T E R
// ---------------------------------------
var v2 = v2 || {};
var shapes = shapes || {};
var PhysBody = PhysBody || {};

var Crit = function (args) {
    "use strict";
	this.name = args.name || "crit";
	this.type = "crit";
	this.isActive = true;
	this.env = args.env;

    this.health = 10;
    this.damage = 1;
    this.isDead = false;
    this.dir = v2.norm(args.dir) || [0, 1];
	
    this.color = args.color || "black";
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function (ctx) {
	"use strict";
	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
};

Crit.prototype.update = function (deltaTime) {
    "use strict";

    if (this.health < 1) {
        this.die();
    }

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Crit.prototype.takeDmg = function (dmgInfo) {
    "use strict";
	this.health -= dmgInfo.amount;
};

Crit.prototype.attack = function () {
    "use strict";
};

Crit.prototype.die = function () {
    "use strict";
    this.env.createExplosion(this);
    this.isActive = false;
};

Crit.prototype.stop = function () {
    "use strict";
	this.vel = [0, 0];
};
