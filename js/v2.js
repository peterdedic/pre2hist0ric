// ---------------------------------------
//			V E C T O R 2
// ---------------------------------------

var v2 = v2 || {}

v2.addv = function(a, b) {
	return [ a[0] + b[0], a[1] + b[1] ];
};
v2.subv = function(a, b) {
	return [ a[0] - b[0], a[1] - b[1] ];
};
v2.muls = function(v, s) {
	return [ v[0] * s, v[1] * s ];
};
v2.mulv = function(a, b) {
	return [ a[0] * b[0], a[1] * b[1] ];
};
v2.divs = function(v, s) {
	return [ v[0] / s, v[1] / s ];
};
v2.divv = function(a, b) {
	return [ a[0] / b[0], a[1] / b[1] ];
};
v2.trunc = function(v, smax) {
	if (v2.len(v) > smax) {
		v = v2.norm(v);
		v = v2.muls(v, smax);
	}
};
v2.norm = function(v) {
	var x = v[0],
		y = v[1];
	var len = x*x + y*y;
	if (len > 0) {
		len = 1 / Math.sqrt(len);
		x = x * len;
		y = y * len;
	}
	return [x, y];
};
v2.len = function(v){
	var x = v[0],
		y = v[1];
	return Math.sqrt(x*x + y*y);
}
v2.dist = function(a, b){
	return v2.len(v2.subv(b, a));
}
v2.IsZero = function(v) {
	return ((v[0] === 0) && (v[1] === 1));
}
v2.neg = function(v) {
	return [-v[0], -v[1]];
}

v2.dot = function(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1];
}

v2.rotate = function(v, angle) {
	angle = degToRad(angle);
	var r = [0,0];
	r[0] = v[0] * Math.cos(angle) - v[1] * Math.sin(angle);
    r[1] = v[0] * Math.sin(angle) + v[1] * Math.cos(angle);
	
	return r;
}

v2.toString = function(v) {
	var p = 3
	return "["+v[0].toPrecision(p)+","+v[1].toPrecision(p)+"]";
}

v2.draw = function(ctx, v, o, c) {
	var s = o || [0, 0];
	var color = c || "black";
	var e = v2.addv(s, v);
	// var g=ctx.createLinearGradient(s[0], s[1], e[0], e[1]);
	// g.addColorStop("0","rgba(0,0,255,0.4)");
	// g.addColorStop("1.0","rgba(255,0,0,0.1)");
	// ctx.strokeStyle = g;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(s[0], s[1]);
	ctx.lineTo(e[0], e[1]);
	ctx.stroke();
	
	var ARROW_HEAD_ANGLE = 20;
	var ARROW_HEAD_SIZE = 5;
	var aa = v2.muls(v2.norm(v2.neg(v)), ARROW_HEAD_SIZE);
	var r1 = v2.rotate(aa, ARROW_HEAD_ANGLE);
	var r2 = v2.rotate(aa, -ARROW_HEAD_ANGLE);
	r1 = v2.addv(e, r1);
	r2 = v2.addv(e, r2);
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(e[0], e[1]);
	ctx.lineTo(r1[0], r1[1]);
	ctx.lineTo(r2[0], r2[1]);
	ctx.lineTo(e[0], e[1]);
	ctx.stroke();
}

v2.inters2 = function (v1s, v1e, v2s, v2e) {
	
}

v2.inters = function (ps1, pe1, ps2, pe2) {
  // Get A,B,C of first line - points : ps1 to pe1
  var A1 = pe1[1]-ps1[1];
  var B1 = ps1[0]-pe1[0];
  var C1 = A1*ps1[0]+B1*ps1[1];
 
  // Get A,B,C of second line - points : ps2 to pe2
  var A2 = pe2[1]-ps2[1];
  var B2 = ps2[0]-pe2[0];
  var C2 = A2*ps2[0]+B2*ps2[1];
 
  // Get delta and check if the lines are parallel
  var delta = A1*B2 - A2*B1;
  if (delta == 0)
     return;
 
  // now return the Vector2 intersection point
  return [(B2*C1 - B1*C2)/delta,(A1*C2 - A2*C1)/delta];
}