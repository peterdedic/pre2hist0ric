// ---------------------------------------
//			E N V I R O N M E N T
// ---------------------------------------

var Environment = function() {
	this.entities = [];
    this.messages = [];
	var minX, minY, maxX, maxY;
	this._ENTITY_PROXIMITY_LIMIT = 50;
	
	this.setBounds = function(bounds) {
		minX = bounds[0];
		minY = bounds[1];
		maxX = bounds[2];
		maxY = bounds[3];
	}
	
	this.add = function(entity) {
		var bAdded = false;
		for (var i = 0; i < this.entities.length; i++) {
			if (!this.entities[i].isActive) {
				this.entities[i] = entity;
				bAdded = true;
			}
		}
		if (!bAdded){
			this.entities.push(entity);
		}
	}
		
	this.update = function (deltaTime) {
		for (var i = 0; i < this.entities.length; i++) {
			var et = this.entities[i];
			if (et.isActive && et.update) {
				// et.nearbyEnts = this.getNearbyEntities(et);
				et.update(deltaTime);
				wrapAround(et);
			}
		}
//		this.resolveMessages();
	}
	
	this.draw = function (context) {
		for (var i = 0; i < this.entities.length; i++) {
            var et = this.entities[i];
			if (et.isActive && et.draw)
				this.entities[i].draw(context);
		}
	}

//    this.addMsg = function(msg) {
//        this.messages.push(msg);
//    }
//
//	this.resolveMessages = function() {
//
//	}
	
	this.getEntityByName = function(name) {
		for (var i=0; i<this.entities.length; i++) { 
			if (this.entities[i].name == name){ 
				return this.entities[i];
			}
		}
		return null;
	}
	
	this.getNearbyEntities = function(entity) {
		var eList = [];
		for (var i=0; i<this.entities.length; i++){
			var e = this.entities[i];
			if (e.name === entity.name)
				continue;
				
			var d = v2.dist(entity.body.pos, e.body.pos); //entity.getDistToEnt(e);
			
//            _debug.addMsg("e."+i, d);
			if (e.isActive && d <= this._ENTITY_PROXIMITY_LIMIT + e.body.size) {
				//_debug.drawLine(entity.body.pos, e.body.pos, "rgba(255,0,0,0.2)");
				eList.push({
					entity: e,
					distance: d
				});
			}
		}
		return eList;
	}
	
	function wrapAround(entity){
		var x = entity.body.pos[0],
		y = entity.body.pos[1];
		if (x > maxX)
			x = minX;
		if (x < minX)
			x = maxX;
		if (y > maxY)
			y = minY;
		if (y < minY)
			y = maxY;
			
		entity.body.pos[0] = x;
		entity.body.pos[1] = y;
	}
}
