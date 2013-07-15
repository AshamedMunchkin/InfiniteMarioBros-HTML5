/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Mario.BackgroundRenderer = function(level, width, height, distance) {
    this.level = level;
    this.width = width;
    this.distance = distance;
    this.tilesY = ((height / 32) | 0) + 1;
    
    this.background = Mario.SpriteCuts.getBackgroundSheet();
};

Mario.BackgroundRenderer.prototype = new Enjine.Drawable();

Mario.BackgroundRenderer.prototype.draw = function(context, camera) {
    var xCam = camera.x / this.distance;
    var x = 0, y = 0, b = null, frame = null;
    
    //the OR truncates the decimal, quicker than Math.floor
    var xTileStart = (xCam / 32) | 0;
    //the +1 makes sure the right edge tiles get drawn
    var xTileEnd = (((xCam + this.width) / 32) | 0);
    
    for (x = xTileStart; x <= xTileEnd; x++) {
        for (y = 0; y < this.tilesY; y++) {
            b = this.level.getBlock(x, y) & 0xff;
            frame = this.background[b % 8][(b / 8) | 0];
            
            //bitshifting by five is the same as multiplying by 32
            context.drawImage(Enjine.Resources.images["background"], frame.x, frame.y, frame.width, frame.height, ((x << 5) - xCam) | 0, (y << 5) | 0, frame.width, frame.height);
        }
    }
};