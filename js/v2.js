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
	return Math.sqrt(v2.len2(v));
}
v2.len2 = function(v){
	var x = v[0],
		y = v[1];
	return x*x + y*y;
}
v2.dist = function(a, b){
	return v2.len(v2.subv(b, a));
}
v2.dist2 = function(a, b){
	return v2.len2(v2.subv(b, a));
}
v2.distToLine = function(P, L){
	//var vL = v2.subv(L.p1, L.p0);
	var uL = v2.norm(v2.subv(L.getP1(), L.getP0()));
	var w = v2.subv(P, L.getP0());
	return v2.cross(uL, w);
}
v2.isZero = function(v) {
	return ((v[0] === 0) && (v[1] === 0));
}

v2.neg = function(v) {
	return [-v[0], -v[1]];
}

v2.dot = function(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1];
}
v2.cross = function(v1, v2) {
	return v1[0]*v2[1] - v1[1]*v2[0];
}
v2.clone = function(v) {
	return [v[0], v[1]];
}

v2.rotate = function(v, angle) {
	angle = degToRad(angle);
	var r = [0, 0];
	r[0] = v[0] * Math.cos(angle) - v[1] * Math.sin(angle);
    r[1] = v[0] * Math.sin(angle) + v[1] * Math.cos(angle);
	
	return r;
}

v2.toString = function(v) {
	var p = 2
	return "["+v[0].toFixed(p)+","+v[1].toFixed(p)+"]";
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
	
	// --- DRAW ARROWHEAD ---
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

v2.perp = function (v) {
    return [v[1], -v[0]];
}

v2.closestPointOnSegment = function(P, segment) {
	var a = v2.subv(P, segment.A);
	var b = v2.subv(segment.B, segment.A);

	var c1 = v2.dot(a, b);
	if (c1 <= 0 )  // before P0
		return segment.A;

	var c2 = v2.dot(b, b); // or squared magnitute of vector v (vx*vx + vy*vy)
	if (c2 <= c1 ) // after P1
		return segment.B;

	var t = c1 / c2;
	var Pb = v2.addv(segment.A, v2.muls(b, t));

	return Pb;
}

v2.intersLineCircle = function (line, circle) {
    var c = {x: circle.center[0], y: circle.center[1]};
    var r = circle.radius;

    var p1 = {x: line.A[0], y: line.A[1]};
    var p2 = {x: line.B[0], y: line.B[1]};
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;

    var A = dx * dx + dy * dy;
    var B = 2 * (dx * (p1.x - c.x) + dy * (p1.y - c.y));
    var C = (p1.x - c.x) * (p1.x - c.x) + (p1.y - c.y) * (p1.y - c.y) - r * r;

    var det = B * B - 4 * A * C;
    if ((A <= 0.0000001) || (det < 0)) {
        // No real solutions.
        return [];
    }
    else if (det == 0) {
        // One solution.
//        t = -B / (2 * A);
        //return [p1.x + t * dx, p1.y + t * dy];
        return [-B / (2 * A)];
    }
    else
    {
        // Two solutions.
        var h = Math.sqrt(det);
        var result = [];
//        t = (-B + h) / (2 * A);
        //result.push([p1.x + t * dx, p1.y + t * dy]);
        result.push((-B + h) / (2 * A));
//        t = (-B - h) / (2 * A);
        result.push((-B - h) / (2 * A));
        result.sort();
        //result.push([p1.x + t * dx, p1.y + t * dy]);
        return result;
    }
}

v2.intersLineLine = function (line1, line2) {
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

// ---------------------------------------
//			R A Y
// ---------------------------------------
var Vector = function (x, y) {
    this.x = x;
    this.y = y;
}
Vector.fromArray = function (a) {
    return new Vector(a[0], a[1]);
}

var Ray = function (position, direction) {
    this.p = position;
    this.d = direction;
}


// ---------------------------------------
//			M A T R I X 2
// ---------------------------------------

var m3 = m3 || {};

m3.createRot = function (angle) {
    angle = degToRad(angle);
    var c = Math.cos(angle),
        s = Math.sin(angle);
    return [
        c, -s, 0,
        s,  c, 0,
        0,  0, 1
    ];
};

m3.createTrans = function (T) {
    return [1,    0,    0,
            0,    1,    0,
            T[0], T[1], 1];
};
m3.mul = function (M, N) {
    var a = M[0], b = M[1], c = M[2],
        d = M[3], e = M[4], f = M[5],
        g = M[6], h = M[7], i = M[8],

        l = N[0], m = N[1], n = N[2],
        o = N[3], p = N[4], q = N[5],
        r = N[6], s = N[7], t = N[8],
        out = [];

    out[0] = a*l + b*o + c*r;
    out[1] = a*m + b*p + c*s;
    out[2] = a*n + b*q + c*t;
    out[3] = d*l + e*o + f*r;
    out[4] = d*m + e*p + f*s;
    out[5] = d*n + e*q + f*t;
    out[6] = g*l + h*o + i*r;
    out[7] = g*m + h*p + i*s;
    out[8] = g*n + h*q + i*t;
    return out;
};
m3.mulv = function (m, v) {
    var x = v[0],
        y = v[1];
    return [
        m[0]*x + m[1]*y + m[2],
        m[3]*x + m[4]*y + m[5]
    ];
};
