// ---------------------------------------
//			E N V I R O N M E N T
// ---------------------------------------

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
		this.ccColisionDetection();
	}
	
	this.draw = function (context) {
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].isActive)
				this.entities[i].draw(context);
		}
	}
	
	this.ccColisionDetection = function() {
		for (var i=0; i<this.entities.length; i++) {
			var e1 = this.entities[i];
			for (var j=0; j < e1.nearbyEnts.length; j++) {
				var e2 = e1.nearbyEnts[j].entity;
				
				_debug.drawLine(e1.pos, e2.pos);
				
				var overlap = (e1.size + e2.size) - e1.nearbyEnts[j].distance; 
				if (overlap > 0) {
					var surface_normal = v2.norm(v2.subv(e1.pos, e2.pos));
					_debug.addMsg("collision: ", e1.name, " - ", e2.name);
					e1.collided({
							overlap: overlap,
							normal: surface_normal,
							entity: e2
						});
					e2.collided({
							overlap: overlap,
							normal: v2.neg(surface_normal),
							entity: e1
						}); 
				}
			}
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
	
	this.getNearbyEntities = function(entity, range) {
		var eList = [];
		for (var i=0; i<this.entities.length; i++){
			var ent = this.entities[i];
			if (ent.name === entity.name)
				continue;
				
			var d = v2.dist(entity.pos, ent.pos);
			if (ent.isActive && d <= range + ent.size) {
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
				var dist = v2.dist(pos, ent.pos);
				
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