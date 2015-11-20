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
    }

    this.init = function () {
        _env.setBounds([0, 0, _width, _height]);
        _env.init();

        this.reset();
    }

    this.reset = function () {
        var innerBound = _width * 0.2;
        _env.add(new Player({
                name: "player",
                pos: [getRandi(innerBound, _width - innerBound), getRandi(innerBound, _height - innerBound)],
                dir: [getRandf(-1, 1), getRandf(-1, 1)],
                radius: 5,
                color: "black",
                env: _env
            }));

        var speed = 5;
        for (var i = 0; i < 5; i++){
            var d = [getRandf(-1, 1), getRandf(-1, 1)];
            var newCrit = new Crit({
                name: "enemy_" + i,
                pos: [getRandi(0, _width), getRandi(0, _height)],
                dir: d,
                vel: v2.muls(d, speed),
                radius: getRandi(10, 15),
                color: "black",
                env: _env
            });

            _env.add(newCrit);
        }
    }

    this.tick = function (delta) {
        _ctx.clearRect(0, 0, _width, _height);
        gDebug.clear();

        var player = _env.getEntityByName("player");
        if (player && player.isDead) {
            _ctx.save();
            _ctx.font = "18px Consolas";
            _ctx.fillText("GAME OVER", _width / 2, _height / 2 - 30);
            _ctx.font = "10px Consolas";
            _ctx.fillText("press R to reset", _width / 2, _height / 2);
            _ctx.restore();

            if (Keyb.get("R").pressed) {
                this.reset();
            }
        }

        _env.update(delta);
        _env.draw(_ctx);

        Keyb.update();
        gDebug.print();
    };

}
