// ---------------------------------------
//			S T E E R
//			M A N A G E R
// ---------------------------------------

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
		vSteerSum = v2.addv(vSteerSum, this.unitSteerVectors[i]);
	}
	if (v2.IsZero(vSteerSum)) {
		return null;
	}
	vSteerSum = v2.muls(vSteerSum, this.entity._maxSpeed);
	var vRes = v2.norm(v2.subv(vSteerSum, this.entity.vel)); 	// get direction desired velocity
	vRes = v2.muls(vRes, this.entity._maxAcc);					// set max acceleration
	this.entity.vel = v2.addv(this.entity.vel, vRes);
	
	this.unitSteerVectors = [];
}


// ----- S T A T I C   M E T H O D S -----
Steer.seek = function(entity, vTarget) {
	return v2.norm(v2.subv(vTarget, entity.pos));	
}
Steer.flee = function(entity, vTarget) {
	return v2.norm(v2.subv(entity.pos, vTarget));;
}
Steer.arrival = function(entity, vTarget) {
	var RADIUS = 30;
	var v = Steer.seek(entity, vTarget);
	var d = v2.dist(entity.pos, vTarget);
	if (d <= RADIUS) { 						// Begin slowing down if within threshold
		v = v2.muls(v, d / RADIUS);
	}
	return v;
}

Steer.wander = function(entity) {
	if (!entity.wa)
		entity.wa = 0;
	
	var DISPLACEMENT = 50;
	var WANDER_RADIUS = 10;
	var cv = [Math.cos(entity.wa), Math.sin(entity.wa)];
	cv = v2.muls(cv, WANDER_RADIUS);
	
	
	//_setDebugMsg(v2.ToString(entity.dir), "cc");
	var cc = v2.muls(v2.norm(entity.dir), DISPLACEMENT);
	var vDisp = v2.addv(cv, cc);
	
	entity.wa += getRandf(-1, 1) * 0.5;
	
	return v2.norm(vDisp); 
}

Steer.pursuit = function(entity, eTarget) {
	var T = 3; 
	// TODO: Implement better future position prediction 
	var futurePos = v2.addv(eTarget.pos, v2.muls(eTarget.vel, T));
	
	return Steer.seek(entity, futurePos);
}

Steer.evade = function(entity, eTarget) {
	var T = 3;
	var futurePos = v2.addv(eTarget.pos, v2.muls(eTarget.vel, T));
	
	return Steer.flee(entity, futurePos);
}