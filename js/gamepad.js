// ---------------------------------------
//			G A M E P A D
// ---------------------------------------

var Gamepad = {g: []}

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s.", e.gamepad.index, e.gamepad.id);

	if (e.gamepad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)")
		Gamepad.g[e.gamepad.index] = navigator.getGamepads()[e.gamepad.index];

});


Gamepad.update = function () {
    for(var i in navigator.getGamepads()) {
        if (navigator.getGamepads()[i].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
            Gamepad.g[i] = navigator.getGamepads()[i];
        }
    };
}
