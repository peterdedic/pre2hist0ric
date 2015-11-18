document.addEventListener("mousemove", function (e) { //getElementById("c").
	Mouse.position[0] = e.offsetX;
	Mouse.position[1] = e.offsetY;

    document.getElementById("cursorCoord").innerHTML = v2.toString(Mouse.position);
});

var Mouse = Mouse || {};

Mouse.position = [0, 0]

