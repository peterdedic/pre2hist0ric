var shapes = shapes || {};

shapes.drawCircle = function (ctx, center, radius, color) {
    "use strict";
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
};

shapes.drawCircle = function (ctx, center, side, color) {
    "use strict";
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(center[0] - side, center[1] - side, side, side);
    ctx.stroke();
};

//shapes.drawSquare = function (ctx, center, radius, color) {
//    ctx.strokeStyle = color;
//    ctx.beginPath();
//    ctx.arc(center[0], center[1], radius, 0, 2*Math.PI);
//    ctx.stroke();
//}
