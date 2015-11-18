// ---------------------------------------
//			G A M E
// ---------------------------------------

var Game = function () {
    var _env;
    var _canvas;
    var _ctx;

    this.gParticleEngine = {};
    this.gCursor_loc = [0, 0];

    this.setCanvas = function (elementName) {
        _canvas = document.getElementById("c");
        _ctx = _canvas.getContext("2d");
    }

    this.init = function () {
        _env = new Environment();
        _env.setBounds([0, 0, _canvas.clientWidth, _canvas.clientHeight]);

        this.gParticleEngine = new ParticleEngine(1000).init();

        _env.add(new Player({
                name: "player",
                pos: [getRandi(0, _canvas.clientWidth), getRandi(0, _canvas.clientHeight)],
                dir: [getRandf(-1, 1), getRandf(-1, 1)],
                radius: 5,
                color: "black",
                env: _env
            }));

        for (var i = 0; i < 5; i++){
            var newCrit = new Crit({
                name: "crit" + i,
                pos: [getRandi(0, _canvas.clientWidth), getRandi(0, _canvas.clientHeight)],
                dir: [getRandf(-1, 1), getRandf(-1, 1)],
                radius: getRandi(3, 5),
                color: "purple",
                env: _env
            });

            _env.add(newCrit);
        }
    }

    this.tick = function (delta) {
        _ctx.clearRect(0, 0, _canvas.clientWidth, _canvas.clientHeight);
        //_debug.clear();
    //	_debug.addMsg("delta",delta.toFixed(2));

        _env.update(delta);
        _env.draw(_ctx);

        this.gParticleEngine.update(delta);
        this.gParticleEngine.draw(_ctx);

        _debug.print();
    };

}
