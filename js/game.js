// ---------------------------------------
//			G A M E
// ---------------------------------------

var Game = function () {
    var _env = new Environment();
    var _canvas;
    var _ctx;
    var _height, _width;

    this.setCanvas = function (elementName) {
        _canvas = document.getElementById("c");
        _ctx = _canvas.getContext("2d");
        _height = _canvas.clientHeight;
        _width = _canvas.clientWidth;
//        _height = 1800;
//        _width = 1800;
    }

    this.init = function () {
        _env.setBounds([0, 0, _width, _height]);
        _env.init();

        _env.add(new Player({
                name: "player",
                pos: [getRandi(0, _width), getRandi(0, _height)],
                dir: [getRandf(-1, 1), getRandf(-1, 1)],
                radius: 5,
                color: "black",
                env: _env
            }));

        var speed = 5;
        for (var i = 0; i < 5; i++){
            var newCrit = new Crit({
                name: "" + i,
                pos: [getRandi(0, _width), getRandi(0, _height)],
                dir: [getRandf(-1, 1), getRandf(-1, 1)],
                vel: [getRandf(-speed, speed), getRandf(-speed, speed)],
                radius: getRandi(10, 15),
                color: "black",
                env: _env
            });

            _env.add(newCrit);
        }
    }

    this.tick = function (delta) {
        _ctx.clearRect(0, 0, _width, _height);
        _debug.clear();
    //	_debug.addMsg("delta",delta.toFixed(2));

        _env.update(delta);
        _env.draw(_ctx);

        _debug.print();
    };

}
