// ---------------------------------------
//			C R I T T E R
// ---------------------------------------
var v2 = v2 || {};
var shapes = shapes || {};
var PhysBody = PhysBody || {};
var gParticleEngine = gParticleEngine || {};
var Particle = Particle || {};

console.log(gParticleEngine);

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
        this.isActive = false;
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
    var i = 0,
        p = [];
    for (i = 0; i < 50; i += 1) {
        p.push(new Particle(this.body.pos, [getRandf(-1, 1), getRandf(-1, 1)], getRandf(20, 25), getRandi(500, 800)));
    }
    return p;
    gParticleEngine.addParticles(p);
};

Crit.prototype.stop = function () {
    "use strict";
	this.vel = [0, 0];
};
