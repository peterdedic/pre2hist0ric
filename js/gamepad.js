// ---------------------------------------
//			G A M E P A D
// ---------------------------------------

var Gamepad = {g: [], connected: false, debugOn: true};

window.addEventListener("gamepadconnected", function (e) {
    "use strict";
//    console.log("Gamepad connected at index %d: %s.", e.gamepad.index, e.gamepad.id);

    if (e.gamepad.id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
        Gamepad.g[e.gamepad.index] = navigator.getGamepads()[e.gamepad.index];
        Gamepad.connected = true;
    }

});

//window.addEventListener("gamepaddisconnected", function (e) {
//    "use strict";
////    console.log("Gamepad connected at index %d: %s.", e.gamepad.index, e.gamepad.id);
//
//    if (e.gamepad.id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
//        Gamepad.g[e.gamepad.index] = navigator.getGamepads()[e.gamepad.index];
//        Gamepad.connected = true;
//    }
//
//});


Gamepad.update = function () {
    "use strict";
    var i,
        gamepads = navigator.getGamepads();
    for (i in gamepads) {
        if (gamepads.hasOwnProperty(i)) {
            if (gamepads[i].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
                Gamepad.g[i] = gamepads[i];
            }
        }
    }

    if (Gamepad.debugOn) {
        Gamepad.g[0].axes.forEach(function(axis){
            _debug.addMsg("axis"+i, axis);
            i++;
        });

        _debug.addMsg("buttons", Gamepad.g[0].buttons.map(function(item, i){return i +":" + item.pressed.toString() + "," + item.value;}).join("\n"));
    }
};
