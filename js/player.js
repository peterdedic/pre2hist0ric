// ---------------------------------------
//			P L A Y E R
// ---------------------------------------

"use strict;"
var Player = function (args) {
	this.name = args.name || "player";
	this.type = "player";
	this.isActive = true;
	this.env = args.env;

    this.health = 10;
    this.damage = 1;
    this.dir = v2.norm(args.dir) || [0, 1];

    this.color = args.color || "black";
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function(ctx) {

	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
};

Player.prototype.update = function(deltaTime) {
    var speed = 10;

    this.dir = v2.norm(v2.subv(Mouse.position, this.body.pos));
    var move_fwd = this.dir;
    var move_rigth = v2.perp(this.dir);
    var vMotion = [0, 0];

    if (Gamepad.connected) {
        Gamepad.update();

        if (Gamepad.g[0].buttons[7].value === 1)
            this.attack();

        var newdir = [Gamepad.g[0].axes[2], Gamepad.g[0].axes[3]];
        var newdir_len = v2.len(newdir);
        this.dir = newdir_len > 0.15 ? v2.divs(newdir, newdir_len) : this.dir;


        vMotion[0] = Gamepad.g[0].axes[0] * speed;
        vMotion[1] = Gamepad.g[0].axes[1] * speed;
    } else {
        if (Keyb.keys["up"])
            vMotion = v2.addv(vMotion, v2.muls(move_fwd, speed));
        if (Keyb.keys["down"])
            vMotion = v2.addv(vMotion, v2.muls(move_fwd, -speed));
        if (Keyb.keys["left"])
            vMotion = v2.addv(vMotion, v2.muls(move_rigth, -speed));
        if (Keyb.keys["right"])
            vMotion = v2.addv(vMotion, v2.muls(move_rigth, speed));
        if (Keyb.keys["space"])
            this.attack();
    }

	// --------- APPLY VELOCITY ---------
    this.body.add(vMotion);
	this.body.update(deltaTime);
};

Player.prototype.stop = function() {
	this.vel = [0, 0];
};

Player.prototype.takeDmg = function(dmgInfo) {
	this.health =- dmgInfo.amount;
    this.body.add(v2.neg(dmgInfo.dir));
};

Player.prototype.die = function () {
    var e = this;
    gParticleEngine.addParticles((function(){
        var i = 0,
            p = [];
        for (i = 0; i < 50; i += 1) {
            p.push(new Particle(e.body.pos, [getRandf(-1, 1), getRandf(-1, 1)], getRandf(20, 25), getRandi(500, 800)));
        }
        return p;
    })());
}

Player.prototype.attack = function() {
    var p = this;
    _debug.drawLine(this.body.pos, v2.addv(this.body.pos, v2.muls(this.dir, 300)), "orange");
    this.env.entities.forEach(function(enemy){

        if (enemy.isActive) {
            var laserRayEnd = v2.addv(p.body.pos, v2.muls(p.dir, 300));
            var point = v2.closestPointOnLine(enemy.body.pos, p.body.pos, laserRayEnd );
            if (v2.dist(enemy.body.pos, point) < enemy.body.size) {
                _debug.addMsg("attack dmg:", p.damage);
                enemy.takeDmg({amount: p.damage, dir: p.dir});
            }
        }
    });
};
