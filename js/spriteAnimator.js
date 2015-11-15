function SpriteAnimator(img, tileWidth, tileHeight, frameDur)
{
    var hReps = img.width / tileWidth;
    var vReps = img.height / tileHeight;
    var numTiles = hReps * vReps;

    var currentDisplayTime = 0;

    var currentTile = 0;
    var startTile = 0;
    var endTile = numTiles - 1;

    var offsetX = 0;
    var offsetY = 0;

    this.animations = [
        {name: "default", start: 0, end: 0 },
        {name: "walk", start: 0, end: 2 }
    ];
    this.currentAnimation = this.animations[0];

    this.nextTile = function()
    {
        currentTile++;
        if (currentTile > this.currentAnimation.end)
            currentTile = this.currentAnimation.start;

        this.setTile(currentTile);
    };

    this.prevTile = function()
    {
        currentTile--;
        if (currentTile < this.currentAnimation.start)
            currentTile = this.currentAnimation.end;

        this.setTile(currentTile);
    };

    this.setTile = function( tileNum )
    {
        if (tileNum > numTiles)
            currentTile = numTiles - 1;

        if (tileNum < 0)
            currentTile = 0;

        var currentCol = tileNum % hReps;
        var currentRow = Math.floor( tileNum / hReps );
//        offsetX = (currentCol * tileWidth) / img.width;
//        offsetY = (currentRow * tileHeight) / img.height;
        offsetX = (currentCol * tileWidth);
        offsetY = (currentRow * tileHeight);
    };

    this.setAnimation = function( name )
    {
        for (var i=0; i<this.animations.length; i++) {
            if (this.animations[i].name === name) {
                this.currentAnimation = this.animations[i];
                this.setTile(this.currentAnimation.start);
                currentDisplayTime = 0;
                return;
            }
        }
    };

    this.update = function( dt )
    {
        currentDisplayTime += dt;
        while (currentDisplayTime > frameDur)
        {
            currentDisplayTime -= frameDur;
            this.nextTile();
        }
    };

    this.draw = function( ctx )
    {
        ctx.save();
        ctx.translate(550,200);
        //ctx.translate(-190,0);
        //ctx.scale(-1, 1);
        ctx.drawImage( img, offsetX, offsetY, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
        ctx.restore();
    };
}

//var spriteAnim;
//var spriteImage = new Image();
//spriteImage.src = "assets/anim_test.png";
//spriteImage.addEventListener("load", function() {
//  spriteAnim = new SpriteAnimator(spriteImage, 16, 16, 100);
//}, false);
//
//function fwd() {
//
//}
//
//function bck() {
//    spriteAnim.prevTile();
//}
