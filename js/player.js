// ---------------------------------------
//			P L A Y E R
// ---------------------------------------
var v2 = v2 || {};
var shapes = shapes || {};
var PhysBody = PhysBody || {};
var Gamepad = Gamepad || {};
var Keyb = Keyb || {};

var Player = function (args) {
    "use strict";

	this.name = args.name || "player";
	this.type = "player";
	this.isActive = true;
	this.env = args.env;

    this.isAttacking = false;
    this.health = 100;
    this.damage = 1;
    this.maxEnergy = 100;
    this.energy = 100;
    this.dir = v2.norm(args.dir) || [0, 1];

    this.color = args.color || "black";
	this.body = new PhysBody(args);

    this.ctx = {};
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function (ctx) {
    "use strict";
    this.ctx = ctx;
//    if (this.isAttacking)
//        gDebug.drawLine(ctx, {A: this.body.pos, B: v2.addv(this.body.pos, v2.muls(this.dir, 300))}, "orange");

    var x = this.body.pos[0],
        y = this.body.pos[1];

    // ------ ENERGY BAR ---------------
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(x, y, this.body.size - 2, 0, 2 * (this.energy / this.maxEnergy) * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;

    // ------ DRAW BODY ----------------
    shapes.drawCircleArrow(ctx, this.body.pos, this.dir, this.body.size, "rgb(180, 180, 180)", "black");

    // ------ HEALTH BAR ---------------
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x, y, this.body.size, 0, 2 * (this.health / 100) * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;

    // ------ DRAW AIM -----------------
    shapes.drawPoint(ctx, {point: v2.addv(this.body.pos, v2.muls(this.dir, 300)), color: "orange"});
};

Player.prototype.update = function (deltaTime) {
    "use strict";
    this.isAttacking = false;

    if (this.health < 1) {
        this.die();
    }

    this.updateControls(deltaTime);

    if (this.energy <= this.maxEnergy) {
        this.energy += 0.25;
    }

	// --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
};

Player.prototype.updateControls = function (dt) {
    "use strict";

    var vMotion = [0, 0],
        speed = 0.1;

    if (Gamepad.connected) {
        Gamepad.update();

        if (Gamepad.g[0].buttons[7].value === 1) {
            this.attack();
        }

        var newdir = [Gamepad.g[0].axes[2], Gamepad.g[0].axes[3]],
            newdir_len = v2.len(newdir);
        this.dir = newdir_len > 0.15 ? v2.divs(newdir, newdir_len) : this.dir;


        vMotion[0] = Gamepad.g[0].axes[0] * speed;
        vMotion[1] = Gamepad.g[0].axes[1] * speed;

        this.body.add(vMotion);

    } else {
        //this.dir = v2.norm(v2.subv(Mouse.position, this.body.pos));
        if (Keyb.get("left").down) {this.dir = v2.rotate(this.dir, -5); }
        if (Keyb.get("right").down) {this.dir = v2.rotate(this.dir,  5); }

        var move_fwd = this.dir,
            move_rigth = v2.perp(this.dir);

        if (Keyb.get("W").down) { this.move(v2.muls(move_fwd, speed)); }
        if (Keyb.get("space").down) { this.attack(); }
        if (Keyb.get("ctrl").pressed) { console.log("btn press test"); }
    }

};

Player.prototype.stop = function () {
    "use strict";
	this.body.vel = [0, 0];
};

Player.prototype.takeDmg = function (dmgInfo) {
    "use strict";
	this.health -= dmgInfo.amount;
    //this.body.add(v2.neg(dmgInfo.dir));
};

Player.prototype.die = function () {
    "use strict";
    this.env.createExplosion(this);
    this.isActive = false;
    this.isDead = true;
};

Player.prototype.move = function (v) {
    "use strict";
    if (this.energy < 0.5) { v = [0, 0]; }

    this.energy -= 0.5;

    this.body.add(v);
};

Player.prototype.attack = function () {
    "use strict";

    if (this.energy < 2.5) {
        return;
    }

    this.isAttacking = true;

    var laserLineEnd = v2.addv(this.body.pos, v2.muls(this.dir, 300)),
        laserVector = {A: this.body.pos, B: laserLineEnd},
        entsList = this.env.getEntitiesByLine(laserVector, true);

//    gDebug.text += entsList.map(function (item) { return item.name + ", " + item.t; }).join("\n");

    if (entsList.length > 1 && entsList[1].t > 0 && entsList[1].t < 1) {
        this.env.getEntityByName(entsList[1].name).takeDmg({amount: this.damage});
        laserLineEnd = v2.addv(this.body.pos, v2.muls(v2.subv(laserVector.B, laserVector.A), entsList[1].t));
    }

    this.energy -= 2.5;

    gDebug.drawLine(this.ctx, {A: this.body.pos, B: laserLineEnd}, "orange");
//    gDebug.drawPoint(this.ctx, laserLineEnd, "orange");
};

Player.prototype.handleCollision = function (collisionData) {
    "use strict";
    this.takeDmg({amount: collisionData.overlap * 5});
};
