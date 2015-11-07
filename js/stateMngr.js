var StateMngr = function(entity) {
	this.entity = entity;
	this.currState = null;
	
	this.changeState = function(newState) {
		//console.log(entity);
		
		if (this.currState !== null) {
			this.currState.exit(this.entity);
		}
		
		this.currState = newState;
		this.currState.sm = this;
		this.currState.enter(this.entity);
		
	}
	
	this.update = function(deltaTime) {
		this.currState.execute(this.entity);
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
		entity.steer.seek(_cursor_loc);
	}
	this.exit = function(entity) {
	}
}

states.Eat = function() {
	this.name = "Eating";
	this.sm = null;				// reference to State Manager
	
	this.enter = function(entity) {
	}
	this.execute = function(entity) {
		if (!entity.canEat())
			if (entity.isHungry())
				this.sm.changeState(new states.SearchForFood());
			else
				this.sm.changeState(new states.Idle());
				
		this.entity.consume();
	}
	this.exit = function() {
	}
}

states.SearchForFood = function() {
	this.name = "Searching For Food";
	this.sm = null;				// reference to State Manager
	
	this.enter = function() {
	}
	this.execute = function(entity) {
		if (entity.canSee("food")) {
			var location = entity.pickFoodSource();
			if (entity.canTouch(location))
				this.sm.changeState(new states.Eat());
			else
				this.sm.changeState(new states.GoTo(location, new states.Eating()));
		}
		
		entity.steer.wander();
	}
	this.exit = function() {
	}
}


states.GoTo = function(vDest, nextState) {
	this.name = "Going to";
	this.sm = null;				// reference to State Manager
	
	this.enter = function() {
	}
	this.execute = function(entity) {
		if (entity.canReach(vDest)) {
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
		if (entity.isHungry()) {
			this.sm.changeState(new states.SearchForFood());
		}
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