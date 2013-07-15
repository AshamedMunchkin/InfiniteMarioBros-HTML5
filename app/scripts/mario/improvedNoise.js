/**
	Noise function to generate the world maps.
	Code by Rob Kleffner, 2011
*/

Mario.ImprovedNoise = function(seed) {
    this.p = [];
    this.shuffle(seed);
};

Mario.ImprovedNoise.prototype = {
    shuffle: function(seed) {
        var permutation = [];
        var i = 0, j = 0, tmp = 0;
        
        for (i = 0; i < 256; i++) {
            permutation[i] = i;
        }
        
        for (i = 0; i < 256; i++) {
            j = ((Math.random() * (256 - 1)) | 0) + i;
            tmp = permutation[i];
            permutation[i] = permutation[j];
            permutation[j] = tmp;
            this.p[i + 256] = this.p[i] = permutation[i];
        }
    },
    
    perlinNoise: function(x, y) {
        var i = 0, n = 0, stepSize = 0;
        
        for (i = 0; i < 8; i++) {
            stepSize = 64 / (1 << i);
            n += this.noise(x / stepSize, y / stepSize, 128) / (1 << i);
        }
        
        return n;
    },
    
    noise: function(x, y, z) {
        var nx = (x | 0) & 255, ny = (y | 0) & 255, nz = (z | 0) & 255;
        x -= (x | 0);
        y -= (y | 0);
        z -= (z | 0);
        
        var u = this.fade(x), v = this.fade(y), w = this.fade(z);
        var a = this.p[nx] + ny, aa = this.p[a] + nz, ab = this.p[a + 1] + nz,
        b = this.p[nx + 1] + ny, ba = this.p[b] + nz, bb = this.p[b + 1] + nz;
        
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[aa], x, y, z),
            this.grad(this.p[ba], x - 1, y, z)),
            this.lerp(u, this.grad(this.p[ab], x, y - 1, z),
                this.grad(this.p[bb], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(this.p[aa + 1], x, y, z - 1),
                this.grad(this.p[ba + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[ab + 1], x, y - 1, z - 1), this.grad(this.p[bb + 1], x - 1, y - 1, z - 1))));
    },
    
    fade: function(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },
    
    lerp: function(t, x, y) {
        return x + t * (y - x);
    },
    
    grad: function(hash, x, y, z) {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h === 12 || h === 14) ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
};