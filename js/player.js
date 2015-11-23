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

    this.health = 100;
    this.damage = 1;
    this.maxEnergy = 100;
    this.energy = 100;
//    this.dir = v2.norm(args.dir) || [0, 1];

    this.color = args.color || "black";
	this.body = new PhysBody(args);
    this.weaponMount1 = v2.muls(v2.norm([-1,-1]), this.body.size + 3);
    this.weaponMount2 = v2.muls(v2.norm([ 1,-1]), this.body.size + 3);
    this.weapon1 = new weapons.Laser(this, "weaponMount1", v2.norm([-1,-1]));
    this.weapon2 = new weapons.Laser(this, "weaponMount2", v2.norm([ 1,-1]));

    //this.ctx = {};
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function (ctx) {
    "use strict";
//    this.ctx = ctx;

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
    shapes.drawCircleArrow(ctx, this.body.pos, this.body.dir, this.body.size, "rgb(180, 180, 180)", "black");

    // ------ HEALTH BAR ---------------
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x, y, this.body.size, 0, 2 * (this.health / 100) * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;



    // ------ DRAW WEAPON --------------
    if (this.weapon1)
        this.weapon1.draw(ctx);
    if (this.weapon2)
        this.weapon2.draw(ctx);
};

Player.prototype.update = function (deltaTime) {
    "use strict";
    if (this.energy <= this.maxEnergy) {
        this.energy += 0.25;
    }

    if (this.health < 1) {
        this.die();
        return;
    }

    if (this.weapon1) {
        this.weapon1.update(deltaTime);
    }
    if (this.weapon2) {
        this.weapon2.update(deltaTime);
    }
};

Player.prototype.updateMovement = function (deltaTime) {
    // --------- APPLY VELOCITY ---------
	this.body.update(deltaTime);
}

Player.prototype.updateControls = function (dt) {
    "use strict";

    var vMotion = [0, 0],
        speed = 0.1;

    if (Gamepad.connected) {
//        Gamepad.update();
//
//        if (Gamepad.g[0].buttons[7].value === 1) {
//            this.attack();
//        }
//
//        var newdir = [Gamepad.g[0].axes[2], Gamepad.g[0].axes[3]],
//            newdir_len = v2.len(newdir);
//        this.body.dir = newdir_len > 0.15 ? v2.divs(newdir, newdir_len) : this.body.dir;
//
//
//        vMotion[0] = Gamepad.g[0].axes[0] * speed;
//        vMotion[1] = Gamepad.g[0].axes[1] * speed;
//
//        this.body.add(vMotion);

    } else {
        //this.body.dir = v2.norm(v2.subv(Mouse.position, this.body.pos));
        if (Keyb.get("left").down) { this.rotate(-2); }
        if (Keyb.get("right").down) { this.rotate(2); }

        var move_fwd = this.body.dir;
//            move_right = v2.perp(this.body.dir);

        if (Keyb.get("W").down) { this.move(v2.muls(move_fwd, speed)); }
        if (Keyb.get("space").down) { this.attack(); }
    }

    gDebug.text += "energy: " + this.energy + "\n";
};

Player.prototype.stop = function () {
    "use strict";
	this.body.vel = [0, 0];
};

Player.prototype.rotate = function (angle) {
    "use strict";
	this.body.dir = v2.rotate(this.body.dir, angle);
	this.weaponMount1 = v2.rotate(this.weaponMount1, angle);
	this.weaponMount2 = v2.rotate(this.weaponMount2, angle);
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
//    if (this.energy < 0.5) {
//        v = [0, 0];
//    } else {
//        this.energy -= 0.5;
//    }

    this.body.add(v);
};

Player.prototype.attack = function () {
    "use strict";

    this.weapon1.fire();
    this.weapon2.fire();


};

Player.prototype.handleCollision = function (collisionData) {
    "use strict";
    this.takeDmg({amount: collisionData.overlap * 5});
};
