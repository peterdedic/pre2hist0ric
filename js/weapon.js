var weapons = weapons || {};

weapons.Laser = function (entity, wm) {
    "use strict";
    this.pos = [0, 0];
    this.dir = [1, 0];

    this.damage = 1;
    this.range = 300;
    this.isFiring = false;
    this.entity = entity;

    this.rayEnd = [0, 0];

    this.fire = function () {
        this.isFiring = true;
    };

    this.update = function (dt) {
        this.dir = this.entity.body.dir;
        this.pos = v2.addv(this.entity.body.pos, this.entity[wm]);

        if (this.isFiring) {
            var laserLineEnd = v2.addv(this.pos, v2.muls(this.dir, this.range)),
                laserLine = {A: this.pos, B: laserLineEnd},
                entsList = this.entity.env.getEntitiesByLine(laserLine, true),
                targetID = "";

            gDebug.text += entsList.map(function (item) { return item.name + ", " + item.t; }).join("\n");

            if (entsList.length > 0) {
                var minT = 1;
                entsList.forEach(function (e) {
                    if (e.t <= minT && e.t > 0) {
                        targetID = entsList[0].name;
                        minT = e.t;
                    }
                });
                laserLineEnd = v2.addv(this.pos, v2.muls(v2.subv(laserLine.B, laserLine.A), minT));
            }

            if (targetID !== "") {
                this.entity.env.getEntityByName(targetID).takeDmg({amount: this.damage});
            }

            this.rayEnd = laserLineEnd;
        }
    };

    this.draw = function (ctx) {
        if (this.isFiring) {
            gDebug.drawLine(ctx, {A: this.pos, B: this.rayEnd}, "orange");
        }
        this.isFiring = false;

        // ------ DRAW AIM -----------------
        shapes.drawPoint(ctx, {point: v2.addv(this.pos, v2.muls(this.dir, this.range)), color: "orange"});
    };
};
