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
    this.dir = v2.norm(args.dir) || [0, 1];

	this.shape = new CircleShape(args);
	this.body = new PhysBody(args);
};

// ---------------- PROTOTYPES ---------------------

Player.prototype.draw = function(ctx) {

	// ------ DRAW BODY ----------------
	this.shape.draw(ctx, this.body.pos, this.dir);

};

Player.prototype.update = function(deltaTime) {
    var speed = 10;
    //this.dir = v2.norm(v2.subv(_cursor_loc, this.body.pos));

    var move_fwd = this.dir;
    var move_rigth = v2.perp(this.dir);

    var i=0;
    Gamepad.update();
    Gamepad.g[0].axes.forEach(function(axis){
        _debug.addMsg("axis"+i, axis);
        i++;
    });
    _debug.addMsg("buttons", Gamepad.g[0].buttons.map(function(item, i){return i +":" + item.pressed.toString() + "," + item.value;}).join("\n"));
//    console.log("buttons", Gamepad.g[0].buttons);
//    throw("error");

    if (Keyb.keys["space"])
        this.attack();
    if (Gamepad.g[0].buttons[7].value === 1)
        this.attack();

    var newdir = [Gamepad.g[0].axes[2], Gamepad.g[0].axes[3]];
    var newdir_len = v2.len(newdir);
    this.dir = newdir_len > 0.15 ? v2.divs(newdir, newdir_len) : this.dir;

    var vMotion = [0, 0];

    vMotion[0] = Gamepad.g[0].axes[0] * speed;
    vMotion[1] = Gamepad.g[0].axes[1] * speed;

//    if (Keyb.keys["W"])
//        vMotion = v2.addv(vMotion, v2.muls(move_fwd, speed));
//    if (Keyb.keys["S"])
//        vMotion = v2.addv(vMotion, v2.muls(move_fwd, -speed));
//    if (Keyb.keys["A"])
//        vMotion = v2.addv(vMotion, v2.muls(move_rigth, -speed));
//    if (Keyb.keys["D"])
//        vMotion = v2.addv(vMotion, v2.muls(move_rigth, speed));


    this.body.add(vMotion);



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
    var p = this;
    _debug.drawLine(this.body.pos, v2.addv(this.body.pos, v2.muls(this.dir, 300)), "orange");
    this.env.entities.forEach(function(enemy){

        var laserRayEnd = v2.addv(p.body.pos, v2.muls(p.dir, 300));
        var point = v2.closestPointOnLine(enemy.body.pos, p.body.pos, laserRayEnd );
        if (v2.dist(enemy.body.pos, point) < enemy.body.size) {
            _debug.addMsg("attack dmg:", p.damage);
            enemy.takeDmg({amount: p.damage, dir: p.dir});
        }
//        var weap_end = v2.addv(p.body.pos, v2.muls(p.dir, 15));
//        if (v2.dist(weap_end, enemy.entity.body.pos) < enemy.entity.body.size) {
//            enemy.entity.takeDmg({amount: p.damage, dir: p.dir});
//            _debug.addMsg("attack dmg:", p.damage);
//        }

    });
};
