// ---------------------------------------
//			E N V I R O N M E N T
// ---------------------------------------

var Environment = function () {
	this.entities = [];
    this.messages = [];
	var minX, minY, maxX, maxY;
	this._ENTITY_PROXIMITY_LIMIT = 50;

    var _particleEngine = {};
	
	this.setBounds = function(bounds) {
		minX = bounds[0];
		minY = bounds[1];
		maxX = bounds[2];
		maxY = bounds[3];
	}

    this.init = function () {
        _particleEngine = new ParticleEngine(1000).init();
    };
	
	this.add = function(entity) {
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].name === entity.name) {
				this.entities[i] = entity;
				return;
			}
		}

        this.entities.push(entity);
	}
		
	this.update = function (deltaTime) {
        var i = 0,
            et = {};

        for (i = 0; i < this.entities.length; i++) {
            et = this.entities[i];
            if (et.isActive && et.updateControls) {
				et.updateControls(deltaTime);
			}
        }

        for (i = 0; i < this.entities.length; i++) {
            et = this.entities[i];
            if (et.isActive && et.updateMovement) {
				et.updateMovement(deltaTime);
			}
        }

        this.findAndresolveCollisions();

        for (i = 0; i < this.entities.length; i++) {
            wrapAround(this.entities[i]);
		}

		for (i = 0; i < this.entities.length; i++) {
			et = this.entities[i];
			if (et.isActive && et.update) {
				et.update(deltaTime);
			}
		}
        _particleEngine.update(deltaTime);

//		this.resolveMessages();
	}

	this.draw = function (context) {
		for (var i = 0; i < this.entities.length; i++) {
            var et = this.entities[i];
			if (et.isActive && et.draw)
				this.entities[i].draw(context);
		}

        _particleEngine.draw(context);
	}
	
	this.getEntityByName = function(name) {
		for (var i=0; i<this.entities.length; i++) { 
			if (this.entities[i].name === name){
				return this.entities[i];
			}
		}
		return null;
	}

    this.getEntitiesByLine = function (line, sort) {
        var i = 0,
            results = [];
        for (i=0; i<this.entities.length; i++){
            var entity = this.entities[i];
            if (entity.isActive) {
                var t = v2.intersLineCircle(
                    line,
                    {center: entity.body.pos, radius: entity.body.size});

                if (t.length > 0) {
                    results.push({name: entity.name, t: t[0]});
                }
            }
        }

        if (sort) {
            results.sort(function (a, b) {
                return a.t - b.t;
            });
        }

        return results;
    }

    this.createExplosion = function (entity) {
        _particleEngine.createExplosionOnPerimeter(entity.body.pos, entity.body.size);
    }

    this.findAndresolveCollisions = function () {
//        console.log(this);
        var i=0,
            j=0,
            e1,
            e2;

        for (i=0; i<this.entities.length; i++) {
            e1 = this.entities[i];
            if (!e1.isActive) { continue; }
            for (j=i+1; j<this.entities.length; j++) {
                e2 = this.entities[j];
                if (!e2.isActive) { continue; }

                var dist = v2.dist(e1.body.pos, e2.body.pos);
                if (dist <= e1.body.size + e2.body.size) {
                    var dir = v2.norm(v2.subv(e2.body.pos, e1.body.pos)),
                        amount = (e1.body.size + e2.body.size) - dist;

                    var aaa = v2.muls(dir, amount / 2);
                    e1.body.pos = v2.addv(e1.body.pos, v2.neg(aaa));
                    e2.body.pos = v2.addv(e2.body.pos, aaa);


                    e1.body.add(v2.neg(aaa));
                    e2.body.add(aaa);

                    e1.handleCollision({overlap: amount});
                    e2.handleCollision({overlap: amount});
                }
            }
        }
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
