/**
	Creates a specific type of sprite based on the information given.
	Code by Rob Kleffner, 2011
*/

Mario.SpriteTemplate = function(type, winged) {
    this.type = type;
    this.winged = winged;
    this.lastVisibleTick = -1;
    this.isDead = false;
    this.sprite = null;
};

Mario.SpriteTemplate.prototype = {
    spawn: function(world, x, y, dir) {
        if (this.isDead) {
            return;
        }
        
        if (this.type === Mario.Enemy.flower) {
            this.sprite = new Mario.FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
        } else {
            this.sprite = new Mario.Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.type, this.winged);
        }
        this.sprite.spriteTemplate = this;
        world.addSprite(this.sprite);
    }
};