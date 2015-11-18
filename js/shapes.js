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

shapes.drawCircleArrow = function (ctx, origin, dir, radius, color) {
    "use strict";

    var o = v2.addv(origin, v2.muls(dir, radius));

    v2.draw(ctx, v2.muls(dir, radius + 5), o, color);

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(origin[0], origin[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
};
