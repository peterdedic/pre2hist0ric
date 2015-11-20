var Keyb = Keyb || {};

Keyb.SpecialKeyNames = {
	8: "backspace",  9: "tab",       13: "enter",    16: "shift",
    17: "ctrl",     18: "alt",       27: "esc",      32: "space",
    33: "pageup",   34: "pagedown",  35: "end",      36: "home",
    37: "left",     38: "up",        39: "right",    40: "down",
    45: "insert",   46: "delete",   186: ";",       187: "=",
    188: ",",      189: "-",        190: ".",       191: "/",
    219: "[",      220: "\\",       221: "]",       222: "'"
};

Keyb.getKeyName = function (keyCode){
	var k = Keyb.SpecialKeyNames[keyCode];
	if (k == null)
		k = String.fromCharCode(keyCode);

	return k;
}

Keyb.keys = [];

Keyb.get = function (keyName) {
    var k = Keyb.keys[keyName];
    if (k) {
        return k;
    } else {
        return Keyb.keys[keyName] = {
            up: false,
            down: false,
            pressed: false
        };
    }
}

Keyb.onKeyUp = function(event){
	var keyName = Keyb.getKeyName(event.keyCode),
        key = Keyb.get(keyName);

    key.pressed = key.down ? true : false;;
    key.down = false;
    key.up = true;
};

Keyb.onKeyDown = function(event){
	var keyName = Keyb.getKeyName(event.keyCode),
        key = Keyb.get(keyName);

    key.down = true;
    key.up = false;
    key.pressed = false;
};

Keyb.update = function () {
    var k = {};
    for (k in Keyb.keys) {
        if (Keyb.keys.hasOwnProperty(k)) {
//            gDebug.text += k + ", " + Keyb.keys[k].pressed + "\n";
            Keyb.keys[k].pressed = false;
        }
    }
}

document.addEventListener("keydown", Keyb.onKeyDown, false);
document.addEventListener("keyup",   Keyb.onKeyUp,   false);
