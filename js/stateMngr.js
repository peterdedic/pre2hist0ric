// ---------------------------------------
//			S T A T E
//			M A N A G E R
// ---------------------------------------

var StateMngr = function(entity) {
	this.entity = entity;
	this.currState = null;
	
	this.changeState = function(newState) {
		if (this.currState !== null) {
			this.currState.exit(this.entity);
		}
		
		this.currState = newState;
		this.currState.sm = this;
		this.currState.enter(this.entity);
		
	}
	
	this.update = function(deltaTime) {
		this.currState.execute(this.entity, deltaTime);
	}
}


var states = states || {}

states.Test = function() {
	this.name = "Testing";
	this.sm = null;
	
	this.enter = function(entity) {
		entity.stop();
	}
	this.execute = function(entity) {
		entity.steer.wander(_cursor_loc);
	}
	this.exit = function(entity) {
	}
}

states.GoTo = function(vDest, nextState) {
	this.name = "Going to";
	this.sm = null;				// reference to State Manager
	
	this.enter = function() {
	}
	this.execute = function(entity) {
		if (entity.canTouch(vDest)) {
			entity.stop();
			this.sm.changeState(nextState);
		}

		entity.steer.arrival(vDest);
	}
	this.exit = function() {
	}
}

states.Idle = function() {
	this.name = "Idling";
	this.sm = null;				// reference to State Manager
	
	this.enter = function(entity) {
		entity.stop();
	}
	this.execute = function(entity) {

	}
	this.exit = function(entity) {
	}
}


// states.Idle = function() {
// 	this.name = "Idle";
// 	this.sm = null;				// reference to State Manager
	
// 	this.enter = function(entity) {
// 	}
// 	this.execute = function(entity) {
// 	}
// 	this.exit = function(entity) {
// 	}
// }
