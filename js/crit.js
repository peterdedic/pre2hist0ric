// ---------------------------------------
//			C R I T T E R
// ---------------------------------------

var Crit = function (args) {
	this.name = args.name || "crit";
	this.type = args.type || "crit";
	this.isActive = true;
	this.env = args.env;
	this.pos = args.pos || [0, 0];
	
	this.dir = v2.norm(args.dir || [1, 0]);
	this._speed = 0;
	this._maxSpeed = args.maxSpeed || 10;
	this._maxAcc = args.maxAcc || 0.1;
	this.vel = [0, 0];
	
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

Crit.prototype.draw = function(ctx) {
	// ------ DRAW TRACKS --------------
	ctx.strokeStyle = "rgb(0,200,255)";
	ctx.beginPath();
	ctx.moveTo(this.pos[0], this.pos[1]);
	var t = this._tracks;
	this._tracks.forEach(function(vp){
			ctx.lineTo(vp[0], vp[1]);
	}, true);
	ctx.stroke();
	
	//v2.draw(ctx, this.dir, this.pos)
	v2.draw(ctx, this.vel, this.pos)
	
	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(this.pos[0], this.pos[1], 1, 0, 2*Math.PI);
	ctx.stroke();
	
	v2.draw(ctx, v2.muls(this.dir, this._SEE_RANGE), this.pos);
	
};

Crit.prototype.update = function(deltaTime) {
	_debug_panel.innerHTML = "" + this._timer + "\n";
	this.nearbyEnts = this.env.getNearbyEntities(this.pos, this._SEE_RANGE);
	
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
	this.dir = v2.norm(this.vel);
	this._speed = v2.len(this.vel);
	
	this._speed = Math.min(this._speed, this._maxSpeed);				// truncate speed to max
	
	this.vel = v2.muls(this.dir, this._speed);
	this.pos = v2.addv(this.pos, v2.divs(this.vel, deltaTime));
	
	// --------- APPLY BODY -------------
	this.bodyUpdate(deltaTime);
	
	// --------- DEBUG ------------------
	_debug_panel.innerHTML += "\n---------\n";
	this.nearbyEnts.forEach(function(item){
		_debug_panel.innerHTML += item.entity.name + " {"+item.entity.type+"} " + "[" + item.distance.toFixed(2) + "]\n";
	});
};

// Crit.prototype.pickFoodSource = function() {
// 	for(var i=0; i<this.nearbyEnts.length; i++){
// 		if (this.nearbyEnts[i].entity.type === "food") {
// 			this.target = this.nearbyEnts[i].entity; 
// 			return this.nearbyEnts[i].entity.pos;
// 		}
// 	}
// 	return null;
// };

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
	_debug_panel.innerHTML += "digest: " + d.toFixed(2) + "\n";
};

Crit.prototype.drainStamina = function(dt) {
	var mpdt = ( 2.0 / dt);
	var movement_r = this._speed / this._maxSpeed;
	
	var d = movement_r * mpdt;
	
	this._stamina -= Math.min(this._stamina, d);
	_debug_panel.innerHTML += "drain: " + (d*dt).toFixed(2) + "\n";
};

Crit.prototype.recoverStamina = function(dt) {
	var mpdt = ( 1.0 / dt);
	var d = Math.min(this._energy, mpdt);
	d = Math.min(this._maxStamina - this._stamina, d);
	this._energy -= d;
	this._stamina += d;
	_debug_panel.innerHTML += "recover: " + d.toFixed(2) + "\n";
};

Crit.prototype.bodyUpdate = function(dt) {
	this.digest(dt);
	this.drainStamina(dt);
	this.recoverStamina(dt);
}


// Crit.prototype.clearTarget = function() {
// 	this.target = null;
// };
Crit.prototype.stop = function() {
	//this._stamina += this.target.drain(0.01);
	this.vel = [0, 0];
};
Crit.prototype.getSpeed = function() {
	return this._maxSpeed;
};
// Crit.prototype.getTarget = function() {
// 	return this.target;
// };