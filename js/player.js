// ---------------------------------------
//			P L A Y E R
// ---------------------------------------

"use strict;"
var Player = function (args) {
	this.name = args.name || "crit";
	this.type = "crit";
	this.isActive = true;
	this.env = args.env;

    this.health = 10;
    this.damage = 1;

	this.shape = new CircleShape(args);
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function(ctx) {

	// ------ DRAW BODY ----------------
	this.shape.draw(ctx, this.body.pos, this.body.dir);

};

Player.prototype.update = function(deltaTime) {
    var speed = 10;

    if (Keyb.keys["up"])
        this.body.add(v2.muls([ 0, -1], speed));
    if (Keyb.keys["down"])
        this.body.add(v2.muls([ 0,  1], speed));
    if (Keyb.keys["left"])
        this.body.add(v2.muls([-1,  0], speed));
    if (Keyb.keys["right"])
        this.body.add(v2.muls([ 1,  0], speed));
    if (Keyb.keys["space"])
        this.attack();

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Player.prototype.stop = function() {
	this.vel = [0, 0];
};

Player.prototype.takeDmg = function(dmgInfo) {
	this.health =- dmgInfo.amount;
    this.body.add(v2.neg(dmgInfo.dir));
};

Player.prototype.attack = function() {
    var ents = this.env.getNearbyEntities(this);
    var p = this;
    ents.forEach(function(item){
        _debug.addMsg("attack-"+item.entity.name, item.entity.body.size);
        var weap_end = v2.addv(p.body.pos, v2.muls(p.body.dir, 15));
        if (v2.dist(weap_end, item.entity.body.pos) < item.entity.body.size) {
            item.entity.takeDmg({amount: p.damage, dir: p.body.dir});
            _debug.addMsg("attack dmg:", p.damage);
        }
    });
};
