var v2 = v2 || {};
var shapes = shapes || {};

// ---------------------------------------
//			P A R T I C L E
// ---------------------------------------

var Particle = function (pos, dir, speed, lifeSpan, s, c) {
    "use strict";

    this.p = pos;
    this.v = v2.muls(v2.norm(dir), speed);
    this.c = c || "black";
    this.s = s || 1;
    this.isActive = true;
    this.age = 0;

    this.update = function (dt) {
        if (this.age >= lifeSpan) {
            this.isActive = false;
            return;
        }

        this.p = v2.addv(this.p, v2.divs(this.v, dt));
        this.age += dt;
    };
};


// ---------------------------------------
//			P A R T I C L E
//			E N G I N E
// ---------------------------------------

var ParticleEngine = function (max) {
    "use strict";
    var particles = [],
        maxParticles = max;

    this.getParticles = function () { return particles; };

    this.init = function () {
        var i = 0;
        for (i = 0; i < maxParticles; i += 1) {
            particles.push(new Particle([0, 0], [0, 0], 0, 0));
        }
        return this;
    };

    this.update = function (dt) {
        var i = 0;
        for (i = 0; i < particles.length; i += 1) {
            if (particles[i].isActive) {
                particles[i].update(dt);
            }
        }
    };

    this.draw = function (ctx) {
        var i = 0,
            p;
        for (i = 0; i < particles.length; i += 1) {
            p = particles[i];
            if (p.isActive) {
                shapes.drawSquare(ctx, p.p, p.s, p.c);
            }
        }
    };

    this.setParticles = function (p_array) {
        var i = 0,
            j = 0,
            num = p_array.length;

        while (j < p_array.length) {
            if (i >= maxParticles) {
                break;
            }

            if (!particles[i].isActive) {
                particles[i] = p_array[j];
                j += 1;
            }

            i += 1;
        }
    };
};
