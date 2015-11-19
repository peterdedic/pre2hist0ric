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
    this.maxEnergy = 100;
    this.energy = 100;
    this.dir = v2.norm(args.dir) || [0, 1];

    this.color = args.color || "black";
	this.body = new PhysBody(args);

    this.ctx;
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function(ctx) {
    this.ctx = ctx;
//    if (this.isAttacking)
//        _debug.drawLine(ctx, {A: this.body.pos, B: v2.addv(this.body.pos, v2.muls(this.dir, 300))}, "orange");

    var x = this.body.pos[0];
    var y = this.body.pos[1];

    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(x, y, this.body.size - 2, 0, 2 * (this.energy / this.maxEnergy) * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;

	// ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, this.color);
};

Player.prototype.update = function(deltaTime) {
    this.isAttacking = false;

    if (this.health < 1) {
        this.die();
    }

    this.updateControls(deltaTime);

    if (this.energy <= this.maxEnergy)
        this.energy += 0.25;

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Player.prototype.updateControls = function (dt) {
    var vMotion = [0, 0];
    var speed = 0.1;

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
            this.dir = v2.rotate(this.dir, -5);
        if (Keyb.keys["right"])
            this.dir = v2.rotate(this.dir,  5);

        var move_fwd = this.dir;
        var move_rigth = v2.perp(this.dir);

        if (Keyb.keys["W"])
            vMotion = v2.addv(vMotion, this.move(v2.muls(move_fwd, speed)));
        if (Keyb.keys["space"])
            this.attack();
    }

    this.body.add(vMotion);
};

Player.prototype.stop = function() {
	this.body.vel = [0, 0];
};

Player.prototype.takeDmg = function(dmgInfo) {
	this.health =- dmgInfo.amount;
    //this.body.add(v2.neg(dmgInfo.dir));
};

Player.prototype.die = function () {
    this.env.createExplosion(this);
    this.isActive = false;
}

Player.prototype.move = function (v) {
    if (this.energy < 0.5)
        return [0, 0];

    this.energy -= 0.5;
    return v;
}

Player.prototype.attack = function() {
    var me = this;

    if (this.energy < 2.5) {
        return;
    }

    this.isAttacking = true;

    var laserLineEnd = v2.addv(me.body.pos, v2.muls(me.dir, 300));
    var laserVector = {A: me.body.pos, B: laserLineEnd};

    var entsList = this.env.getEntitiesByLine(laserVector, true);
    _debug.text = entsList.map(function(item) { return item.name + ", " + item.t;}).join("\n");

    if (entsList.length > 1 && entsList[1].t > 0 && entsList[1].t < 1) {
        this.env.getEntityByName(entsList[1].name).takeDmg({amount: me.damage});
        laserLineEnd = v2.addv(me.body.pos, v2.muls(v2.subv(laserVector.B, laserVector.A), entsList[1].t));
    }

    this.energy -= 2.5;

    _debug.drawLine(this.ctx, {A: this.body.pos, B: laserLineEnd}, "orange");
//    _debug.drawPoint(this.ctx, laserLineEnd, "orange");
};
