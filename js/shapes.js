var shapes = shapes || {};

shapes.drawCircle = function (ctx, center, radius, color) {
    "use strict";
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
};

shapes.drawSquare = function (ctx, center, side, color) {
    "use strict";
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(center[0] - side, center[1] - side, side, side);
    ctx.stroke();
};

shapes.drawCircleArrow = function (ctx, origin, dir, radius, bcolor, acolor) {
    "use strict";

    var o = v2.addv(origin, v2.muls(dir, radius));

//    v2.draw(ctx, v2.muls(dir, radius + 5), o, color);

    shapes.drawArrow(ctx, {
        origin: o,
        vector: v2.muls(dir, radius + 5),
        color: acolor
    });
    shapes.drawCircle(ctx, origin, radius, bcolor);
};

shapes.drawArrow = function(ctx, settings) {
    "use strict";
    var s = settings.origin || [0, 0],
        v = settings.vector,
        e = v2.addv(s, v),
        bColor = settings.color || "black",
    // --- ARROWHEAD VARS ---
        ARROW_HEAD_ANGLE = settings.arrowAngle || 20,
        ARROW_HEAD_SIZE = settings.arrowSize || 5,
        aa = v2.muls(v2.norm(v2.neg(v)), ARROW_HEAD_SIZE),
        r1 = v2.rotate(aa, ARROW_HEAD_ANGLE),
        r2 = v2.rotate(aa, -ARROW_HEAD_ANGLE),
        aColor = settings.color || "black";

    // --- DRAW BODY ---
    ctx.strokeStyle = bColor;
    ctx.beginPath();
    ctx.moveTo(s[0], s[1]);
    ctx.lineTo(e[0], e[1]);
    ctx.stroke();

    // --- DRAW HEAD ---
    r1 = v2.addv(e, r1);
    r2 = v2.addv(e, r2);
    ctx.beginPath();
    ctx.strokeStyle = aColor;
    ctx.moveTo(e[0], e[1]);
    ctx.lineTo(r1[0], r1[1]);
    ctx.lineTo(r2[0], r2[1]);
    ctx.lineTo(e[0], e[1]);
    ctx.stroke();
}

shapes.drawPoint = function (ctx, settings) {
    "use strict";
    var p = settings.point,
        c = settings.color || "black";
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.moveTo(p[0] - 3, p[1] - 3);
    ctx.lineTo(p[0] + 3, p[1] + 3);
    ctx.moveTo(p[0] + 3, p[1] - 3);
    ctx.lineTo(p[0] - 3, p[1] + 3);
    ctx.stroke();
}
