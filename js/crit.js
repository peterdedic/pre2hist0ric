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
	
    this.color = args.color || "black";
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function(ctx) {
	
	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
	
};

Crit.prototype.update = function(deltaTime) {

    if (this.health < 1) {
        this.isActive = false;
        this.die();
    }

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Crit.prototype.takeDmg = function(dmgInfo) {
	this.health -= dmgInfo.amount;
};

Crit.prototype.attack = function() {

};

Crit.prototype.die = function () {
    var e = this;
    _PE.addParticles((function(){
        var i = 0,
            p = [];
        for (i = 0; i < 50; i += 1) {
            p.push(new Particle(e.body.pos, [getRandf(-1, 1), getRandf(-1, 1)], getRandf(20, 25), getRandi(500, 800)));
        }
        return p;
    })());
}

Crit.prototype.stop = function() {
	this.vel = [0, 0];
};

