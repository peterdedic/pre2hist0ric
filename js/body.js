var v2 = v2 || {};

var PhysBody = function (args) {
	"use strict";
    this.pos = args.pos || [0, 0];
    this.size = args.radius || 5;
	this.vel = args.vel || [0, 0];
	this.dir = v2.norm(args.dir) || [1, 0];
    this.acc = [0, 0];

    this.add = function (v) {
        this.acc = v2.addv(this.acc, v);
    };

	this.update = function (dt) {
        this.vel = v2.addv(this.vel, this.acc);
        this.acc = [0, 0];
		this.pos = v2.addv(this.pos, v2.divs(this.vel, dt));
	};
};

var Body = function (args) {
    this.pos = args.pos || [0, 0];
    this.acc = [0, 0];
    this.vel = [0, 0];

    var rot = 0;
    this.trans = m3.mul(m3.createTrans(this.pos), m3.createRot(0));

    this.add = function (v) {
        this.acc = v2.addv(this.acc, v);
    };

    this.rot = function (a) {
        rot += a;
    };

    this.update = function (dt) {
        this.vel = v2.addv(this.vel, this.acc);
        this.acc = [0, 0];
		this.pos = v2.addv(this.pos, v2.divs(this.vel, dt));

        this.trans = m3.mul(m3.createRot(rot), m3.createTrans(this.pos));
	};
}

var collision = collision || {};

collision.Circle = function () {

    this.testCollision = function (other) {
        if (other instanceof collision.Circle) {

        }
    }
}

collision.AABB = function () {

    this.testCollision = function (other) {
        if (other instanceof collision.AABB) {

        }
    }
}
