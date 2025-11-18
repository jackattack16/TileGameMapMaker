/**
 * @typedef {Object} CollisionData
 * @property {boolean} isWalkable
 * @property {boolean} isBarrier
 * @property {number}  barrierId
 * @property {boolean} isWater
 */

/**
 * @typedef {Object} DialogueTrigger
 * @property {boolean} isDialogueTrigger
 * @property {number} dialogueTriggerId
 */

/**
 * @typedef {Object} CutsceneTrigger
 * @property {boolean} isCutsceneTrigger
 * @property {number} cutsceneTriggerId
 */

/**
 * @typedef {Object} GameStateTrigger
 * @property {boolean} changesGameState
 * @property {number} gameStateId
 */

/**
 * @typedef {Object} TileTriggers
 * @property {DialogueTrigger} dialogue
 * @property {CutsceneTrigger} cutScene
 * @property {GameStateTrigger} gameState
 */

/**
 * @typedef {Object} TileOptions
 * @property {number} [rotation]
 * @property {boolean} [mirrorHorizontal]
 * @property {boolean} [mirrorVertical]
 * @property {CollisionData} [collision]
 * @property {TileTriggers} [triggers]
 */

class Tile {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} tileId
   * @param {TileOptions} [options]
   */
  constructor(x, y, tileId, {
    rotation = 0,
    mirrorHorizontal = false,
    mirrorVertical = false,
    collision = {
      isWalkable: true,
      isBarrier: false,
      barrierId: 0,
      isWater: false
    },
    triggers = {
      dialogue: {
        isDialogueTrigger: false,
        dialogueTriggerId: 0
      },
      cutScene: {
        isCutsceneTrigger: false,
        cutsceneTriggerId: 0
      },
      gameState: {
        changesGameState: false,
        gameStateId: 0
      }
    }
  } = {}) {

    this.x = x;
    this.y = y;
    this.tileId = tileId;

    this.rotation = rotation;  // <-- uses setter now
    this.mirrorHorizontal = mirrorHorizontal;
    this.mirrorVertical = mirrorVertical;

    this.collision = collision;
    this.triggers = triggers;

    // ---- FLATTENED ACCESS FIELDS ----

    // Collision
    this.isWalkable = collision.isWalkable;
    this.isBarrier = collision.isBarrier;
    this.barrierId = collision.barrierId;
    this.isWater = collision.isWater;

    // Dialogue Trigger
    this.dialogue = triggers.dialogue;
    this.isDialogueTrigger = triggers.dialogue.isDialogueTrigger;
    this.dialogueTriggerId = triggers.dialogue.dialogueTriggerId;

    // Cutscene Trigger
    this.cutScene = triggers.cutScene;
    this.isCutsceneTrigger = triggers.cutScene.isCutsceneTrigger;
    this.cutsceneTriggerId = triggers.cutScene.cutsceneTriggerId;

    // Game State Trigger
    this.gameState = triggers.gameState;
    this.changesGameState = triggers.gameState.changesGameState;
    this.gameStateId = triggers.gameState.gameStateId;



    this.updateCollisionFlags();
  }

  // ---- ROTATION SETTER/GETTER (belongs OUTSIDE constructor) ----

  set rotation(value) {
    const valid = [0, 90, 180, 270];
    if (!valid.includes(value)) {
      value = valid[((Math.round(value / 90) % 4) + 4) % 4];
    }
    this._rotation = value;
  }

  get rotation() {
    return this._rotation;
  }

  _collision = { type: 'walkable' };

  // Getter/setter for collision type
  get collision() {
    return this._collision;
  }

  set collision({ type }) {
    const validTypes = ['walkable', 'barrier', 'water'];
    if (!validTypes.includes(type)) type = 'walkable';
    this._collision.type = type;
    this.updateCollisionFlags();
  }

  // Update flattened boolean fields
  updateCollisionFlags() {
    this.isWalkable = this._collision.type === 'walkable';
    this.isBarrier = this._collision.type === 'barrier';
    this.isWater = this._collision.type === 'water';
  }
}
