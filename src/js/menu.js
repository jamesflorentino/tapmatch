(function() {
  'use strict';

  function Menu() {}

  Menu.prototype = {
    create: function () {
      //var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
      //  'MENU', {font: '42px Arial', fill: '#ffffff', align: 'center'
      //});
      //text.anchor.set(0.5);
      this.menuLogo = this.add.sprite(this.world.width/2, this.world.height/2, 'menu-logo');
      this.menuLogo.y -= 50;
      this.menuLogo.anchor.set(0.5);

      this.btnStart = this.add.sprite(this.world.width/2, this.world.height/2, 'btn-start');
      this.btnStart.anchor.set(0.5);
      this.btnStart.y += 80;
      this.input.onDown.add(this.onDown, this);
      this.add.tween(this.menuLogo)
        .from({ alpha: 0 }, 800, null, true);
      this.add.tween(this.menuLogo.scale)
        .from({ x: 5.2, y: 5.2 }, 800, Phaser.Easing.Bounce.Out, true);


      this.add.tween(this.btnStart)
        .from({ alpha: 0, y: this.btnStart.y + 100 }, 700, Phaser.Easing.Bounce.Out, true);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['tapmatch'] = window['tapmatch'] || {};
  window['tapmatch'].Menu = Menu;
}());
