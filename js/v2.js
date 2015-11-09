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

v2.ToString = function(v) {
	var p = 3
	return "["+v[0].toPrecision(p)+","+v[1].toPrecision(p)+"]";
}

v2.draw = function(ctx, v, o) {
	o = o || [50, 50];
	var g=ctx.createLinearGradient(o[0], o[1], o[0] + v[0], o[1] + v[1]);
	g.addColorStop("0","rgba(0,0,255,0.4)");
	g.addColorStop("1.0","rgba(255,0,0,0.1)");
	ctx.strokeStyle = g;
	ctx.beginPath();
	ctx.moveTo(o[0], o[1]);
	ctx.lineTo(o[0] + v[0], o[1] + v[1]);
	ctx.stroke();
}