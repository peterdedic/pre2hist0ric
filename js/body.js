var CircleShape = function(args) {
	this.radius = args.radius || 5;
	this.color = args.color || "black";

	this.draw = function(ctx, origin, dir) {
		var o = v2.addv(origin, v2.muls(dir, this.radius));
		v2.draw(ctx, v2.muls(dir, this.radius + 5), o, this.color);

		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(origin[0], origin[1], this.radius, 0, 2*Math.PI);
		ctx.stroke();
	}
}

var PhysBody = function(args) {
	this.pos = args.pos || [0, 0];
	// this._speed = 0;
	// this._maxSpeed = args.maxSpeed || 10;
	// this._maxAcc = args.maxAcc || 0.1;
    this.size = args.radius || 5;
	this.vel = [0, 0];
    //console.log(args);

    this.add = function(v) {
        this.vel = v2.addv(this.vel, v);
    }

	this.update = function(dt) {
		//_debug.addMsg()
		//this.dir = v2.isZero(this.vel) ? this.dir : v2.norm(this.vel);
		// this._speed = v2.isZero(this._vel) ? this._speed : v2.len(this._vel);

		// this._speed = Math.min(this._speed, this._maxSpeed);				// truncate speed to max

		// this._vel = v2.muls(this._dir, this._speed);
		this.pos = v2.addv(this.pos, v2.divs(this.vel, dt));
        this.vel = [0, 0];
	}
}
