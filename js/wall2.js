var Wall2 = function(pos, size, N) {
	var _pos = pos;
	var _norm = v2.norm(N);
	var _size = size;
	var _a, _b;
	
	recalc();
	
	this.getPos = function() { return _pos; }
	this.getN = function() { return _norm; }
	
	this.draw = function(ctx) {
		v2.draw(ctx, v2.muls(_norm, 20), _pos);
		drawLine(ctx, _a, _b, "red");
	}
	
	function recalc() {
		_a = v2.rotate(_norm, 90);
		_b = v2.rotate(_norm, -90);
		_a = v2.muls(_a, _size / 2);
		_b = v2.muls(_b, _size / 2);
		_a = v2.addv(_a, _pos);
		_b = v2.addv(_b, _pos);
	}
	
	this.toString = function() {
		return v2.toString(_norm) + ", " + v2.toString(_a);
	}
}

Wall2.draw = function(ctx, wall) {
	//drawLine(ctx, wall.A, wall.B);
}

Wall2.test = function(ctx) {
	var w = _canvas.clientWidth;
	var h = _canvas.clientHeight;
	var pos = [w / 2, h / 2];
	var n = [getRandf(-1, 1), getRandf(-1, 1)];
	n = v2.norm(n);
	
	test_wall = new Wall2(pos, 80, n);
	test_wall.draw(ctx);
	console.log(test_wall.toString());
}