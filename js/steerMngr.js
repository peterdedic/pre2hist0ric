var Steer = function(entity) {
	this.entity = entity;
	this.steering = [];
}

Steer.prototype.seek = function(v) {
	this.steering.push(Steer.seek(this.entity, v));
}
Steer.prototype.flee = function(v) {
	this.steering.push(Steer.flee(this.entity, v));
}
Steer.prototype.arrival = function(v) {
	this.steering.push(Steer.arrival(this.entity, v));
}
Steer.prototype.wander = function() {
	this.steering.push(Steer.wander(this.entity));
}
Steer.prototype.pursuit = function(e) {
	this.steering.push(Steer.pursuit(this.entity, e));
}
Steer.prototype.evade = function(e) {
	this.steering.push(Steer.evade(this.entity, e));
}

Steer.prototype.apply = function() {
	var vSteer = [0, 0];
	for (var i=0; i<this.steering.length; i++) {
		vSteer = vec2addv(vSteer, this.steering[i]);
	}
	if (vec2IsZero(vSteer)) {
		return null;
	}
	vSteer = vec2norm(vec2subv(vSteer, this.entity.vel)); 	// get direction desired velocity
	vSteer = vec2muls(vSteer, this.entity.maxAcc);			// set max acceleration
	this.entity.vel = vec2addv(this.entity.vel, vSteer);
	
	this.steering = [];
}


// ----- S T A T I C   M E T H O D S -----
Steer.seek = function(entity, vTarget) {
	_setDebugMsg(vec2ToString(vTarget), "seek");
	var dirToTarget = vec2norm(vec2subv(vTarget, entity.pos));
	var desired_vel = vec2muls(dirToTarget, entity.getSpeed());
	return desired_vel;
}
Steer.flee = function(entity, vTarget) {
	var dirToTarget = vec2norm(vec2subv(entity.pos, vTarget));
	var desired_vel = vec2muls(dirToTarget, entity.getSpeed());
	return desired_vel;
}
Steer.arrival = function(entity, vTarget) {
	var RADIUS = 30;
	var v = Steer.seek(entity, vTarget);
	var d = vec2dist(entity.pos, vTarget);
	if (d <= RADIUS) { // Begin slowing down if within threshold
		v = vec2muls(v, d / RADIUS);
	}
	if (d < 1){ // Completely Stop the entity if within threshold
		v = [0,0];
		entity.vel = [0,0];
	}
	return v;
}

Steer.wander = function(entity) {
	if (!entity.wa)
		entity.wa = 0;
	
	var DISPLACEMENT = 50;
	var WANDER_RADIUS = 10;
	var cv = [Math.cos(entity.wa), Math.sin(entity.wa)];
	cv = vec2muls(cv, WANDER_RADIUS);
	
	var cc = vec2muls(vec2norm(entity.vel), DISPLACEMENT);
	var vDisp = vec2addv(cv, cc);
	
	entity.wa += getRandf(-1, 1) * 0.5;
	
	return vec2muls(vec2norm(vDisp), entity.getSpeed()); 
}

Steer.pursuit = function(entity, eTarget) {
	var T = 3; 
	// TODO: Implement better future position prediction 
	var futurePos = vec2addv(eTarget.pos, vec2muls(eTarget.vel, T));
	
	return Steer.seek(entity, futurePos);
}

Steer.evade = function(entity, eTarget) {
	var T = 3;
	var futurePos = vec2addv(eTarget.pos, vec2muls(eTarget.vel, T));
	
	return Steer.flee(entity, futurePos);
}