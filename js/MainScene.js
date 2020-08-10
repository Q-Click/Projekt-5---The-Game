import Player from "./Player.js";
import Resource from "./Resource.js";
import Enemy from "./Enemy.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.enemies = [];
  }

  preload() {
    Player.preload(this);
    Enemy.preload(this);
    Resource.preload(this);
    this.load.image("tiles", "assets/images/RPG Nature Tileset.png");
    this.load.tilemapTiledJSON("map", "assets/images/map.json");
    this.load.atlas(
      "resources",
      "assets/images/resources.png",
      "assets/images/resources_atlas.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    this.map = map;
    const tileset = map.addTilesetImage(
      "RPG Nature Tileset",
      "tiles",
      32,
      32,
      0,
      0
    );

    const layer1 = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
    const layer2 = map.createStaticLayer("Tile Layer 2", tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    layer2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    this.matter.world.convertTilemapLayer(layer2);
    this.map
      .getObjectLayer("Resources")
      .objects.forEach((resource) => new Resource({ scene: this, resource }));
    this.map
      .getObjectLayer("Enemies")
      .objects.forEach((enemy) =>
        this.enemies.push(new Enemy({ scene: this, enemy }))
      );
    this.player = new Player({
      scene: this,
      x: 240,
      y: 270,
      texture: "archer",
      frame: "archer_idle_1",
    });
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    let camera = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);
  }

  update() {
    this.enemies.forEach((enemy) => enemy.update());
    this.player.update();
  }
}