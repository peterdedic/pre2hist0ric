// ---------------------------------------
//			C R I T T E R
// ---------------------------------------

var Crit = function (args) {
	this.name = args.name || "crit";
	this.type = "crit";
	this.isActive = true;
	this.env = args.env;
	this.pos = args.pos || [0, 0];
	this.size = args.size || 5;
	this._color = "black";
	this._hasCollided = false;
	
	this._dir = v2.norm(args.dir || [1, 0]);
	this._speed = 0;
	this._maxSpeed = args.maxSpeed || 10;
	this._maxAcc = args.maxAcc || 0.1;
	this._vel = [0, 0];
	
	this._stamina = 5;
	this._maxStamina = 5;
	this._energy = 10;
	this._stomachSize = 6;
	this._stomachLevel = 2.2;
	
	this.steer = new Steer(this);
	this.SM = new StateMngr(this);
	this.SM.changeState(new states.Test());
	
	this._TOUCH_RANGE = 10;
	this._SEE_RANGE = 50;
	this._HUNGER_THRESHOLD = 2;
	this._METABOLISM_RATE = 0.01;
	
	this._tracks = new WrapArray(10);
	this._timer = 0;
	this.nearbyEnts = [];
};

// ---------------- PROTOTYPES ---------------------

Crit.prototype.draw = function(ctx) {
	// ------ DRAW TRACKS --------------
	// ctx.strokeStyle = "brown";
	// ctx.beginPath();
	// ctx.moveTo(this.pos[0], this.pos[1]);
	// var t = this._tracks;
	// this._tracks.forEach(function(vp){
	// 		ctx.lineTo(vp[0], vp[1]);
	// }, true);
	// ctx.stroke();
	
	var color = this._hasCollided ? "red" : this._color;
	
	// ------ DRAW BODY ----------------
	var o = v2.addv(this.pos, v2.muls(this._dir, this.size));
	v2.draw(ctx, v2.muls(this._dir, this.size+5), o, color);
	// v2.draw(ctx, this._vel, this.pos, color);
	
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(this.pos[0], this.pos[1], this.size, 0, 2*Math.PI);
	ctx.stroke();
	
	// ------ DRAW VIEW AREA ----------
	ctx.fillStyle = "rgba(0,0,0,0.1)";
	ctx.beginPath();
	ctx.arc(this.pos[0], this.pos[1], this._SEE_RANGE, 0, 2*Math.PI);
	ctx.fill();
	
	// ------ DRAW VIEW DIR ----------
	//v2.draw(ctx, v2.muls(this._dir, this._SEE_RANGE), this.pos);
	
};

Crit.prototype.update = function(deltaTime) {
	
	
	// ------ LOG TRACKS ----------------
	if (this._timer >= 30) {
		this._tracks.add(this.pos);
		this._timer = 0;
	}
	this._timer++;
			
	// ------ S T E E R I N G -----------
	this.SM.update(deltaTime);
	this.steer.apply();
	
	
	// --------- APPLY VELOCITY ---------
	this._dir = v2.norm(this._vel);
	this._speed = v2.len(this._vel);
	
	this._speed = Math.min(this._speed, this.getMaxSpeed());				// truncate speed to max
	
	this._vel = v2.muls(this._dir, this._speed);
	this.pos = v2.addv(this.pos, v2.divs(this._vel, deltaTime));
	
	// --------- UPDATE BODY ------------
	
	// --------- DEBUG ------------------
	_debug.addMsg("---------");
	var entname = this.name;
	this.nearbyEnts.forEach(function(item){
		_debug.addMsg(entname," ", item.entity.name, "[" + item.distance.toFixed(2) + "]");
	});
};

Crit.prototype.canSee = function(sResourceType) {
	for(var i=0; i<this.nearbyEnts.length; i++){
		if (this.nearbyEnts[i].entity.type === sResourceType)
			return this.nearbyEnts[i].entity;	
	}
	return;
};
Crit.prototype.canTouch = function(v) {
	return (v2.dist(this.pos, v) <= this._TOUCH_RANGE);
};
Crit.prototype.canEat = function(entity) {
	return ( this.canTouch(entity.pos) && entity.type === "food" && !this.isFull());
};
Crit.prototype.isFull = function() {
	return (this._stomachLevel >= this._stomachSize);
}
Crit.prototype.eat = function(food, dt) {
	var _EATING_RATE = 0.2;
	if (!this.isFull()){
		this._stomachLevel += food.drain(_EATING_RATE / dt);
	}
};
Crit.prototype.isHungry = function() {
	return (this._stomachLevel < this._HUNGER_THRESHOLD);
};

Crit.prototype.digest = function(dt) {
	var mpdt = (this._METABOLISM_RATE / dt);
	var d = Math.min(this._stomachLevel, mpdt);
	//d = Math.min(this._maxEnergy - this._energy, d);
	this._stomachLevel -= d;
	this._energy += d;
};

Crit.prototype.drainStamina = function(dt) {
	var mpdt = ( 2.0 / dt);
	var movement_r = this._speed / this._maxSpeed;
	
	var d = movement_r * mpdt;
	
	this._stamina -= Math.min(this._stamina, d);
};

Crit.prototype.recoverStamina = function(dt) {
	var mpdt = ( 1.0 / dt);
	var d = Math.min(this._energy, mpdt);
	d = Math.min(this._maxStamina - this._stamina, d);
	this._energy -= d;
	this._stamina += d;
};

Crit.prototype.bodyUpdate = function(dt) {
	this.digest(dt);
	this.drainStamina(dt);
	this.recoverStamina(dt);
}

Crit.prototype.stop = function() {
	//this._stamina += this.target.drain(0.01);
	this._vel = [0, 0];
};
Crit.prototype.getMaxSpeed = function() {
	return this._maxSpeed;
};

Crit.prototype.handleCollision = function (e) {
	this._hasCollided = true;
	this.pos = v2.addv(this.pos, v2.muls(e.normal, e.overlap));
}
Crit.prototype.getDistToEnt = function(ent) {
	if (ent.pos) {
		return v2.dist(this.pos, ent.pos);
	}
	if (ent.type === "line") {
		return v2.dist(this.pos, Line2.closestPoint(this.pos, ent));
	}
}