(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
      this.load.setPreloadSprite(this.asset);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();

      //this.ready = true;
    },

    loadResources: function () {
      var assets = [
        ['empty', 'empty.png'],
        ['orange', 'orange.png'],
        ['violet', 'violet.png'],
        ['blue', 'blue.png'],
        ['red', 'red.png'],
        ['yellow', 'yellow.png'],
        ['green', 'green.png'],
        ['gameover', 'gameover.png'],
        ['level-complete', 'level-complete.png'],
        ['btn-retry', 'btn-retry.png'],
        ['life-pane', 'life-pane.png'],
        ['life-bg', 'life-bg.png'],
        ['menu-logo', 'menu-logo.png'],
        ['btn-start', 'btn-start.png'],
      ];

      var game = this;
      assets.forEach(function(arr) {
        var key = arr[0];
        var url = 'assets/' + arr[1];
        game.load.image(key, url);
      });
    },

    create: function () {
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
       this.ready = true;
    }
  };

  window['tapmatch'] = window['tapmatch'] || {};
  window['tapmatch'].Preloader = Preloader;
}());
