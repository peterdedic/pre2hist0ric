// ---------------------------------------
//			P L A Y E R
// ---------------------------------------

"use strict;"
var Player = function (args) {
	this.name = args.name || "player";
	this.type = "player";
	this.isActive = true;
	this.env = args.env;

    this.isAttacking = false;
    this.health = 10;
    this.damage = 1;
    this.dir = v2.norm(args.dir) || [0, 1];

    this.color = args.color || "black";
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function(ctx) {

    if (this.isAttacking)
        _debug.drawLine(ctx, this.body.pos, v2.addv(this.body.pos, v2.muls(this.dir, 300)), "orange");
	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
};

Player.prototype.update = function(deltaTime) {
    this.isAttacking = false;

    if (this.health < 1) {
        this.die();
    }

    this.updateControls(deltaTime);

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Player.prototype.updateControls = function (dt) {
    var vMotion = [0, 0];
    var speed = 10;

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
        //this.dir = v2.norm(v2.subv(Mouse.position, this.body.pos));
        if (Keyb.keys["left"])
            this.dir = v2.rotate(this.dir, -1);
        if (Keyb.keys["right"])
            this.dir = v2.rotate(this.dir,  1);

        var move_fwd = this.dir;
        var move_rigth = v2.perp(this.dir);

        if (Keyb.keys["W"])
            vMotion = v2.addv(vMotion, v2.muls(move_fwd, speed));
        if (Keyb.keys["S"])
            vMotion = v2.addv(vMotion, v2.muls(move_fwd, -speed));
        if (Keyb.keys["A"])
            vMotion = v2.addv(vMotion, v2.muls(move_rigth, -speed));
        if (Keyb.keys["D"])
            vMotion = v2.addv(vMotion, v2.muls(move_rigth, speed));
        if (Keyb.keys["space"])
            this.attack();
    }

    this.body.add(vMotion);
};

Player.prototype.stop = function() {
	this.vel = [0, 0];
};

Player.prototype.takeDmg = function(dmgInfo) {
	this.health =- dmgInfo.amount;
    //this.body.add(v2.neg(dmgInfo.dir));
};

Player.prototype.die = function () {
    this.env.createExplosion(this);
    this.isActive = false;
}

Player.prototype.attack = function() {
    var me = this;

    this.isAttacking = true;

    this.env.entities.forEach(function(entity){
        if (entity.isActive && entity.name !== me.name) {
            var laserRayEnd = v2.addv(me.body.pos, v2.muls(me.dir, 300));
            var point = v2.closestPointOnLine(entity.body.pos, me.body.pos, laserRayEnd );
            if (v2.dist(entity.body.pos, point) < entity.body.size) {
//                _debug.addMsg("attack dmg:", me.damage);
                entity.takeDmg({amount: me.damage, dir: me.dir});
            }
        }
    });
};
