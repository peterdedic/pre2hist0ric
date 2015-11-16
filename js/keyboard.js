var Keyb = {};

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

Keyb.onKeyUp = function(event){
	var key = Keyb.getKeyName(event.keyCode);

	Keyb.keys[key] = false;
	//console.log('up', key);
    //event.cancelBubble = true;
};

Keyb.onKeyDown = function(event){
//    console.log(event);
	var key = Keyb.getKeyName(event.keyCode);

	if (!Keyb.keys[key])
		Keyb.keys[key] = false;

	if (Keyb.keys[key] == false){
		Keyb.keys[key] = true;
	}
    //event.cancelBubble = true;
};

document.addEventListener("keydown", Keyb.onKeyDown, false);
document.addEventListener("keyup",   Keyb.onKeyUp,   false);
