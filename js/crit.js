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

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.damage = 1;
    this.isDead = false;
    this.dir = v2.norm(args.dir) || [0, 1];
	
    this.color = args.color || "black";
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function (ctx) {
	"use strict";

    var x = this.body.pos[0],
        y = this.body.pos[1];


    ctx.strokeStyle = "rgb(211, 84, 118)";
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(x, y, this.body.size - 2, 0, 2 * (this.health / this.maxHealth) * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.font = "10px Consolas";
    ctx.textAlign = "center";
    ctx.fillText(this.name, x, y);
	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
};

Crit.prototype.update = function (deltaTime) {
    "use strict";

    if (this.health < 0) {
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
    this.isDead = true;
};

Crit.prototype.stop = function () {
    "use strict";
	this.vel = [0, 0];
};

Crit.prototype.handleCollision = function (collisionData) {
    "use strict";

};
