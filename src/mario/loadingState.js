/**
    State that loads all the resources for the game.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var GameState = require('enjine/gamestate');
    var Resources = require('enjine/resources');

    var MapState = require('mario/mapstate').MapState;
    var Mario = require('mario/mario');
    var Tile = require('mario/tile');
    var TitleState = require('mario/titlestate');

    var LoadingState = function() {
        this.images = [];
        this.imagesLoaded = false;
        this.screenColor = 0;
        this.colorDirection = 1;
        this.imageIndex = 0;
        this.soundIndex = 0;
    };

    LoadingState.prototype = new GameState();

    LoadingState.prototype.enter = function() {
        var i = 0;
        for (i = 0; i < 15; i++) {
            this.images[i] = {};
        }

        this.images[0].name = 'background';
        this.images[1].name = 'endScene';
        this.images[2].name = 'enemies';
        this.images[3].name = 'fireMario';
        this.images[4].name = 'font';
        this.images[5].name = 'gameOverGhost';
        this.images[6].name = 'items';
        this.images[7].name = 'logo';
        this.images[8].name = 'map';
        this.images[9].name = 'mario';
        this.images[10].name = 'particles';
        this.images[11].name = 'racoonMario';
        this.images[12].name = 'smallMario';
        this.images[13].name = 'title';
        this.images[14].name = 'worldMap';

        this.images[0].src = 'images/bgsheet.png';
        this.images[1].src = 'images/endscene.gif';
        this.images[2].src = 'images/enemysheet.png';
        this.images[3].src = 'images/firemariosheet.png';
        this.images[4].src = 'images/font.gif';
        this.images[5].src = 'images/gameovergost.gif';
        this.images[6].src = 'images/itemsheet.png';
        this.images[7].src = 'images/logo.gif';
        this.images[8].src = 'images/mapsheet.png';
        this.images[9].src = 'images/mariosheet.png';
        this.images[10].src = 'images/particlesheet.png';
        this.images[11].src = 'images/racoonmariosheet.png';
        this.images[12].src = 'images/smallmariosheet.png';
        this.images[13].src = 'images/title.gif';
        this.images[14].src = 'images/worldmap.png';

        Resources.addImages(this.images);

        var testAudio = new Audio();

        if (testAudio.canPlayType('audio/mp3')) {
            Resources.addSound('1up', 'sounds/1-up.mp3', 1)
                .addSound('breakblock', 'sounds/breakblock.mp3')
                .addSound('bump', 'sounds/bump.mp3', 4)
                .addSound('cannon', 'sounds/cannon.mp3')
                .addSound('coin', 'sounds/coin.mp3', 5)
                .addSound('death', 'sounds/death.mp3', 1)
                .addSound('exit', 'sounds/exit.mp3', 1)
                .addSound('fireball', 'sounds/fireball.mp3', 1)
                .addSound('jump', 'sounds/jump.mp3')
                .addSound('kick', 'sounds/kick.mp3')
                .addSound('pipe', 'sounds/pipe.mp3', 1)
                .addSound('powerdown', 'sounds/powerdown.mp3', 1)
                .addSound('powerup', 'sounds/powerup.mp3', 1)
                .addSound('sprout', 'sounds/sprout.mp3', 1)
                .addSound('stagestart', 'sounds/stagestart.mp3', 1)
                .addSound('stomp', 'sounds/stomp.mp3', 2);
        } else {
            Resources.addSound('1up', 'sounds/1-up.wav', 1)
                .addSound('breakblock', 'sounds/breakblock.wav')
                .addSound('bump', 'sounds/bump.wav', 2)
                .addSound('cannon', 'sounds/cannon.wav')
                .addSound('coin', 'sounds/coin.wav', 5)
                .addSound('death', 'sounds/death.wav', 1)
                .addSound('exit', 'sounds/exit.wav', 1)
                .addSound('fireball', 'sounds/fireball.wav', 1)
                .addSound('jump', 'sounds/jump.wav', 1)
                .addSound('kick', 'sounds/kick.wav', 1)
                .addSound('message', 'sounds/message.wav', 1)
                .addSound('pipe', 'sounds/pipe.wav', 1)
                .addSound('powerdown', 'sounds/powerdown.wav', 1)
                .addSound('powerup', 'sounds/powerup.wav', 1)
                .addSound('sprout', 'sounds/sprout.wav', 1)
                .addSound('stagestart', 'sounds/stagestart.wav', 1)
                .addSound('stomp', 'sounds/stomp.wav', 1);
        }

        //load the array of tile behaviors
        Tile.loadBehaviors();
    };

    LoadingState.prototype.exit = function() {
        delete this.images;
    };

    LoadingState.prototype.update = function(delta) {
        if (!this.imagesLoaded) {
            this.imagesLoaded = true;
            var i = 0;
            for (i = 0; i < this.images.length; i++) {
                if (Resources.images[this.images[i].name].complete !== true) {
                    this.imagesLoaded = false;
                    break;
                }
            }
        }

        this.screenColor += this.colorDirection * 255 * delta;
        if (this.screenColor > 255) {
            this.screenColor = 255;
            this.colorDirection = -1;
        } else if (this.screenColor < 0) {
            this.screenColor = 0;
            this.colorDirection = 1;
        }
    };

    LoadingState.prototype.draw = function(context) {
        if (!this.imagesLoaded) {
            var color = parseInt(this.screenColor, 10);
            context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
            context.fillRect(0, 0, 640, 480);
        } else {
            context.fillStyle = 'rgb(0, 0, 0)';
            context.fillRect(0, 0, 640, 480);
        }
    };

    LoadingState.prototype.checkForChange = function(context) {
        if (this.imagesLoaded) {
            //set up the global map state variable
            Mario.globalMapState = new MapState();

            context.changeState(new TitleState.TitleState());
        }
    };

    return LoadingState;
});