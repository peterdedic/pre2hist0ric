var Line2 = function(P0, P1) {
	// -- base object props
	this.type = "line";
	this.name = "line";
	this.isActive = true;
	// --------------------
	
	// -- body props
	var _p0 = P0;
	var _p1 = P1;
	var _norm;
	var _mid;
	recalc();
	// --------------------
	
	this.getP0 = function() { return _p0; };
	this.getP1 = function() { return _p1; };
	this.getN = function() { return _norm; };
	this.getSlope = function() { return (_p1[1]-_p0[1]) / (_p1[0]-_p0[1]); };
	
	console.log('created line at ', v2.toString(P0), ", ", v2.toString(P1), this);
	
	
	this.draw = function(ctx) {
		v2.draw(ctx, v2.muls(_norm, 20), _mid, "red");
		drawLine(ctx, _p0, _p1, "black");
	}
	
	function recalc() {
		var A = _p1[1] - _p0[1];
		var B = _p0[0] - _p1[0];
		//var C = A*_p0[0]+B*_p0[1];
		
		_norm = v2.norm( [A, B] );
		
		_mid = v2.addv(_p0, v2.muls(v2.subv(_p1, _p0), 0.5));
	}
	
	this.toString = function() {
		return v2.toString(_p0) + ", " + v2.toString(_p1);
	}
}

Line2.prototype.getDistToEnt = function(ent) {
	return v2.dist(ent.pos, Line2.closestPoint(ent.pos, this));
}

Line2.closestPoint = function(P, Segment) {
	var v = v2.subv(Segment.getP1(), Segment.getP0());
	var w = v2.subv(P, Segment.getP0());
	
	var c1 = v2.dot(w, v);
	if (c1 <= 0 )  // before P0
		return Segment.getP0();
	
	var c2 = v2.dot(v, v);
	if (c2 <= c1 ) // after P1
		return Segment.getP1();
	
	var b = c1 / c2;
	var Pb = v2.addv(Segment.getP0(), v2.muls(v, b));
	
	return Pb;
}

Line2.test = function(ctx) {
	var w = _canvas.clientWidth;
	var h = _canvas.clientHeight;
	var pos = [w / 2, h / 2];
	var n = [getRandf(-1, 1), getRandf(-1, 1)];
	n = v2.norm(n);
	
	var test_line = new Line2(pos, n);
	test_line.draw(ctx);
	test_line.log(test_line.toString());
}