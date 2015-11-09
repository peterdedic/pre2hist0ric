var Crit = function (args) {
	this.name = args.name || "crit";
	this.type = args.type || "crit";
	this.isActive = true;
	this.pos = args.pos || [0, 0];
	this.env = args.env;
	this.dir = v2.norm(args.dir || [1, 0]);
	this.speed = 0;
	this.maxSpeed = args.maxSpeed || 10;
	this.maxAcc = args.maxAcc || 0.1;
	this.vel = [0, 0];
	this.energy = 10;
	this.steer = new Steer(this);
	this.SM = new StateMngr(this);
	this.SM.changeState(new states.Idle());
	
	this._TOUCH_RANGE = 10;
	this._SEE_RANGE = 50;
	this._LOW_ENERGY_THRESHOLD = 9;
	
	this.nearbyEnts = [];
	this.target = null;
};

Crit.prototype.draw = function(ctx) {
	//var b = v2.addv(this.pos, this.dir, 10));
	var b = v2.addv(this.pos, this.vel);
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(this.pos[0], this.pos[1]);
	ctx.lineTo(b[0], b[1]);
	ctx.stroke();
	
	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(this.pos[0], this.pos[1], 1, 0, 2*Math.PI);
	ctx.stroke();
	
	if (this.target !== null){
		// try{
		var gradient=ctx.createLinearGradient(this.pos[0],this.pos[1],this.target.pos[0],this.target.pos[1]);
		gradient.addColorStop("0","rgba(0,0,255,0.4)");
		gradient.addColorStop("1.0","rgba(255,0,0,0.1)");
		ctx.strokeStyle = gradient;
		ctx.beginPath();
		ctx.moveTo(this.pos[0], this.pos[1]);
		ctx.lineTo(this.target.pos[0], this.target.pos[1]);
		ctx.stroke();
		// }catch(e){
		// 	console.log(this, this.target);
		// }
	}
};

Crit.prototype.update = function(deltaTime) {
	this.nearbyEnts = this.env.getNearbyEntities(this.pos, this._SEE_RANGE);
			
	// ------ S T E E R I N G -----------
	this.SM.update(deltaTime);
	
	this.steer.apply();
	// --------- APPLY VELOCITY ---------
	this.dir = v2.norm(this.vel);
	this.speed = v2.len(this.vel);
	this.speed = Math.min(this.speed, this.maxSpeed);				// truncate speed to max
	this.vel = v2.muls(this.dir, this.speed);
	this.pos = v2.addv(this.pos, v2.divs(this.vel, deltaTime));
	
	this.energy -= 0.05 / deltaTime;
};

Crit.prototype.canSee = function(sResourceType) {
	for(var i=0; i<this.nearbyEnts.length; i++){
		if (this.nearbyEnts[i].entity.type === sResourceType)
			return true;	
	}
	return false;
};
Crit.prototype.canTouch = function(v) {
	return (v2.dist(this.pos, v) <= this._TOUCH_RANGE);
};
Crit.prototype.canEat = function() {
	for(var i=0; i<this.nearbyEnts.length; i++){
		var e = this.nearbyEnts[i]; 
		if ( e.d <= this._TOUCH_RANGE && e.type === "food") {
			return true;
		}	
	}
	return false;
};
Crit.prototype.eat = function() {
	this.energy += this.target.drain(0.05);
};
Crit.prototype.isHungry = function() {
	return (this.energy < this._LOW_ENERGY_THRESHOLD);
};
Crit.prototype.pickFoodSource = function() {
	for(var i=0; i<this.nearbyEnts.length; i++){
		if (this.nearbyEnts[i].entity.type === "food") {
			this.target = this.nearbyEnts[i].entity; 
			return this.nearbyEnts[i].entity.pos;
		}
	}
	return null;
};

Crit.prototype.clearTarget = function() {
	this.target = null;
};
Crit.prototype.stop = function() {
	console.log(this.name, ": stopped.");
	this.vel = [0, 0];
};
Crit.prototype.getSpeed = function() {
	return this.maxSpeed;
};
Crit.prototype.getTarget = function() {
	return this.target;
};