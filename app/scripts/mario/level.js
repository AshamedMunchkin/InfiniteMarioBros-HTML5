/**
	Represents a playable level in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Tile = {
    blockUpper: 1 << 0,
    blockAll: 1 << 1,
    blockLower: 1 << 2,
    special: 1 << 3,
    bumpable: 1 << 4,
    breakable: 1 << 5,
    pickUpable: 1 << 6,
    animated: 1 << 7,
    behaviors: [],
    
    loadBehaviors: function() {
        var b = [];
        b[0] = 0;
        b[1] = 20;
        b[2] = 28;
        b[3] = 0;
        b[4] = 130;
        b[5] = 130;
        b[6] = 130;
        b[7] = 130;
        b[8] = 2;
        b[9] = 2;
        b[10] = 2;
        b[11] = 2;
        b[12] = 2;
        b[13] = 0;
        b[14] = 138;
        b[15] = 0;
        b[16] = 162;
        b[17] = 146;
        b[18] = 154;
        b[19] = 162;
        b[20] = 146;
        b[21] = 146;
        b[22] = 154;
        b[23] = 146;
        b[24] = 2;
        b[25] = 0;
        b[26] = 2;
        b[27] = 2;
        b[28] = 2;
        b[29] = 0;
        b[30] = 2;
        b[31] = 0;
        b[32] = 192;
        b[33] = 192;
        b[34] = 192;
        b[35] = 192;
        b[36] = 0;
        b[37] = 0;
        b[38] = 0;
        b[39] = 0;
        b[40] = 2;
        b[41] = 2;
        b[42] = 0;
        b[43] = 0;
        b[44] = 0;
        b[45] = 0;
        b[46] = 2;
        b[47] = 0;
        b[48] = 0;
        b[49] = 0;
        b[50] = 0;
        b[51] = 0;
        b[52] = 0;
        b[53] = 0;
        b[54] = 0;
        b[55] = 0;
        b[56] = 2;
        b[57] = 2;
        
        var i = 0;
        for (i = 58; i < 128; i++) {
            b[i] = 0;
        }
        
        b[128] = 2;
        b[129] = 2;
        b[130] = 2;
        b[131] = 0;
        b[132] = 1;
        b[133] = 1;
        b[134] = 1;
        b[135] = 0;
        b[136] = 2;
        b[137] = 2;
        b[138] = 2;
        b[139] = 0;
        b[140] = 2;
        b[141] = 2;
        b[142] = 2;
        b[143] = 0;
        b[144] = 2;
        b[145] = 0;
        b[146] = 2;
        b[147] = 0;
        b[148] = 0;
        b[149] = 0;
        b[150] = 0;
        b[151] = 0;
        b[152] = 2;
        b[153] = 2;
        b[154] = 2;
        b[155] = 0;
        b[156] = 2;
        b[157] = 2;
        b[158] = 2;
        b[159] = 0;
        b[160] = 2;
        b[161] = 2;
        b[162] = 2;
        b[163] = 0;
        b[164] = 0;
        b[165] = 0;
        b[166] = 0;
        b[167] = 0;
        b[168] = 2;
        b[169] = 2;
        b[170] = 2;
        b[171] = 0;
        b[172] = 2;
        b[173] = 2;
        b[174] = 2;
        b[175] = 0;
        b[176] = 2;
        b[177] = 2;
        b[178] = 2;
        b[179] = 0;
        b[180] = 1;
        b[181] = 1;
        b[182] = 1;
        
        for (i = 183; i < 224; i++) {
            b[i] = 0;
        }
        
        b[224] = 1;
        b[225] = 1;
        b[226] = 1;
        
        for (i = 227; i < 256; i++) {
            b[i] = 0;
        }
        
        this.behaviors = b;
    }
};

Mario.LevelType = {
    overground: 0,
    underground: 1,
    castle: 2
};

Mario.Odds = {
    straight: 0,
    hillStraight: 1,
    tubes: 2,
    jump: 3,
    cannons: 4
};

Mario.Level = function(width, height) {
    this.width = width;
    this.height = height;
    this.exitX = 10;
    this.exitY = 10;
    
    this.map = [];
    this.data = [];
    this.spriteTemplates = [];
    
    var x = 0, y = 0;
    for (x = 0; x < this.width; x++) {
        this.map[x] = [];
        this.data[x] = [];
        this.spriteTemplates[x] = [];
        
        for (y = 0; y < this.height; y++) {
            this.map[x][y] = 0;
            this.data[x][y] = 0;
            this.spriteTemplates[x][y] = null;
        }
    }
};

Mario.Level.prototype = {
    update: function() {
        var x = 0, y = 0;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this.data[x][y] > 0) {
                    this.data[x][y]--;
                }
            }
        }
    },
    
    getBlockCapped: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x >= this.width) { x = this.width - 1; }
        if (y >= this.height) { y = this.height - 1; }
        return this.map[x][y];
    },
    
    getBlock: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { return 0; }
        if (x >= this.width) { x = this.width - 1; }
        if (y >= this.height) { y = this.height - 1; }
        return this.map[x][y];
    },
    
    setBlock: function(x, y, block) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.width) { return; }
        if (y >= this.height) { return; }
        this.map[x][y] = block;
    },
    
    setBlockData: function(x, y, data) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.width) { return; }
        if (y >= this.height) { return; }
        this.data[x][y] = data;
    },
    
    isBlocking: function(x, y, xa, ya) {
        var block = this.getBlock(x, y);
        var blocking = ((Mario.Tile.behaviors[block & 0xff]) & Mario.Tile.blockAll) > 0;
        blocking |= (ya > 0) && ((Mario.Tile.behaviors[block & 0xff]) & Mario.Tile.blockUpper) > 0;
        blocking |= (ya < 0) && ((Mario.Tile.behaviors[block & 0xff]) & Mario.Tile.blockLower) > 0;

        return blocking;
    },
    
    getSpriteTemplate: function(x, y) {
        if (x < 0) { return null; }
        if (y < 0) { return null; }
        if (x >= this.width) { return null; }
        if (y >= this.height) { return null; }
        return this.spriteTemplates[x][y];
    },
    
    setSpriteTemplate: function(x, y, template) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.width) { return; }
        if (y >= this.height) { return; }
        this.spriteTemplates[x][y] = template;
    }
};