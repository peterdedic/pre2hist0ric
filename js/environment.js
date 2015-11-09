var Environment = function() {
	this.entities = [];
	var minX, minY, maxX, maxY;
	
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
				et.update(deltaTime);
				wrapAround(et);
			}
		}
	}
	
	this.draw = function (context) {
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].isActive)
				this.entities[i].draw(context);
		}
	}
	
	this.getEntityByName = function(name) {
		for (var i=0; i<this.entities.length; i++) { 
			if (this.entities[i].name == name){ 
				return this.entities[i];
			}
		}
		return null;
	}
	
	this.getNearbyEntities = function(pos, range) {
		var eList = [];
		for (var i=0; i<this.entities.length; i++){
			var ent = this.entities[i];
			var d = vec2dist(pos, ent.pos);
			if (ent.isActive && d <= range) {
				eList.push({
					entity: ent, 
					distance: d
				});
			}
		}
		return eList;
	}
	
	this.findClosestEntity = function(pos, etype){
		var target = null,
		minDist = 999999;
		for (var i=0; i<this.entities.length; i++){
			var ent = this.entities[i];
			if (ent.type == etype && ent.isActive){
				var dist = vec2dist(pos, ent.pos);
				
				if (dist < minDist){
					target = ent;
					minDist = dist;
				}
			}
		}
		
		return target;
	}
	
	function wrapAround(entity){
		var x = entity.pos[0],
		y = entity.pos[1];
		if (x > maxX)
			x = minX;
		if (x < minX)
			x = maxX;
		if (y > maxY)
			y = minY;
		if (y < minY)
			y = maxY;
			
		entity.pos[0] = x;
		entity.pos[1] = y;
	}
}