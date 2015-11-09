var Steer = function(entity) {
	this.entity = entity;
	this.unitSteerVectors = [];
}

Steer.prototype.seek = function(v) {
	this.unitSteerVectors.push(Steer.seek(this.entity, v));
}
Steer.prototype.flee = function(v) {
	this.unitSteerVectors.push(Steer.flee(this.entity, v));
}
Steer.prototype.arrival = function(v) {
	this.unitSteerVectors.push(Steer.arrival(this.entity, v));
}
Steer.prototype.wander = function() {
	this.unitSteerVectors.push(Steer.wander(this.entity));
}
Steer.prototype.pursuit = function(e) {
	this.unitSteerVectors.push(Steer.pursuit(this.entity, e));
}
Steer.prototype.evade = function(e) {
	this.unitSteerVectors.push(Steer.evade(this.entity, e));
}

Steer.prototype.apply = function() {
	var vSteerSum = [0, 0];
	for (var i=0; i<this.unitSteerVectors.length; i++) {
		vSteerSum = vec2addv(vSteerSum, this.unitSteerVectors[i]);
	}
	if (vec2IsZero(vSteerSum)) {
		return null;
	}
	vSteerSum = vec2muls(vSteerSum, this.entity.maxSpeed);
	var vRes = vec2norm(vec2subv(vSteerSum, this.entity.vel)); 	// get direction desired velocity
	vRes = vec2muls(vRes, this.entity.maxAcc);					// set max acceleration
	this.entity.vel = vec2addv(this.entity.vel, vRes);
	
	this.unitSteerVectors = [];
}


// ----- S T A T I C   M E T H O D S -----
Steer.seek = function(entity, vTarget) {
	return vec2norm(vec2subv(vTarget, entity.pos));	
}
Steer.flee = function(entity, vTarget) {
	return vec2norm(vec2subv(entity.pos, vTarget));;
}
Steer.arrival = function(entity, vTarget) {
	var RADIUS = 30;
	var v = Steer.seek(entity, vTarget);
	var d = vec2dist(entity.pos, vTarget);
	if (d <= RADIUS) { 						// Begin slowing down if within threshold
		v = vec2muls(v, d / RADIUS);
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
	
	
	//_setDebugMsg(vec2ToString(entity.dir), "cc");
	var cc = vec2muls(vec2norm(entity.dir), DISPLACEMENT);
	var vDisp = vec2addv(cv, cc);
	
	entity.wa += getRandf(-1, 1) * 0.5;
	
	return vec2norm(vDisp); 
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