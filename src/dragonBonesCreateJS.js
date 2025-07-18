let createjs = require('@blakeelearning/createjs');
let dragonBones = require('./dragonBones.js');

let __extends = function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

(function (dragonBones) {
    (function (display) {
        var CreateJSDisplayBridge = (function () {
            function CreateJSDisplayBridge() {
            }
            CreateJSDisplayBridge.prototype.getVisible = function () {
                return this._display ? this._display.visible : false;
            };
            CreateJSDisplayBridge.prototype.setVisible = function (value) {
                if (this._display) {
                    this._display.visible = value;
                }
            };

            CreateJSDisplayBridge.prototype.getDisplay = function () {
                return this._display;
            };
            CreateJSDisplayBridge.prototype.setDisplay = function (value) {
                if (this._display == value) {
                    return;
                }
                if (this._display) {
                    var parent = this._display.parent;
                    if (parent) {
                        var index = this._display.parent.getChildIndex(this._display);
                    }
                    this.removeDisplay();
                }
                this._display = value;
                this.addDisplay(parent, index);
            };

            CreateJSDisplayBridge.prototype.dispose = function () {
                this._display = null;
            };

            CreateJSDisplayBridge.prototype.updateTransform = function (matrix, transform) {
                /*
                var pivotX:number = this._display.regX;
                var pivotY:number = this._display.regY;
                matrix.tx -= matrix.a * pivotX + matrix.c * pivotY;
                matrix.ty -= matrix.b * pivotX + matrix.d * pivotY;
                
                this._display._matrix.a = matrix.a;
                this._display._matrix.b = matrix.b;
                this._display._matrix.c = matrix.c;
                this._display._matrix.d = matrix.d;
                this._display._matrix.tx = matrix.tx;
                this._display._matrix.ty = matrix.ty;
                */
                this._display.x = matrix.tx;
                this._display.y = matrix.ty;
                this._display.skewX = transform.skewX * CreateJSDisplayBridge.RADIAN_TO_ANGLE;
                this._display.skewY = transform.skewY * CreateJSDisplayBridge.RADIAN_TO_ANGLE;
                this._display.scaleX = transform.scaleX;
                this._display.scaleY = transform.scaleY;
            };

            CreateJSDisplayBridge.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
                if (this._display) {
                    this._display.alpha = aMultiplier;
                }
            };

            CreateJSDisplayBridge.prototype.addDisplay = function (container, index) {
                var parent = container;
                if (parent && this._display) {
                    if (index < 0) {
                        parent.addChild(this._display);
                    } else {
                        parent.addChildAt(this._display, Math.min(index, parent.numChildren));
                    }
                }
            };

            CreateJSDisplayBridge.prototype.removeDisplay = function () {
                if (this._display && this._display.parent) {
                    this._display.parent.removeChild(this._display);
                }
            };
            CreateJSDisplayBridge.RADIAN_TO_ANGLE = 180 / Math.PI;
            return CreateJSDisplayBridge;
        })();
        display.CreateJSDisplayBridge = CreateJSDisplayBridge;
    })(dragonBones.display || (dragonBones.display = {}));
    var display = dragonBones.display;

    (function (textures) {
        var CreateJSTextureAtlas = (function () {
            function CreateJSTextureAtlas(image, textureAtlasRawData, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                this._regions = {};

                this.image = image;
                this.scale = scale;

                this.parseData(textureAtlasRawData);
            }
            CreateJSTextureAtlas.prototype.dispose = function () {
                this.image = null;
                this._regions = null;
            };

            CreateJSTextureAtlas.prototype.getRegion = function (subTextureName) {
                return this._regions[subTextureName];
            };

            CreateJSTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
                var textureAtlasData = dragonBones.objects.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
                this.name = textureAtlasData.__name;
                delete textureAtlasData.__name;

                for (var subTextureName in textureAtlasData) {
                    this._regions[subTextureName] = textureAtlasData[subTextureName];
                }
            };
            return CreateJSTextureAtlas;
        })();
        textures.CreateJSTextureAtlas = CreateJSTextureAtlas;
    })(dragonBones.textures || (dragonBones.textures = {}));
    var textures = dragonBones.textures;

    (function (factorys) {
        var CreateJSFactory = (function (_super) {
            __extends(CreateJSFactory, _super);
            function CreateJSFactory() {
                _super.call(this);
            }
            /** @private */
            CreateJSFactory.prototype._generateArmature = function () {
                var armature = new dragonBones.Armature(new createjs.Container());
                return armature;
            };

            /** @private */
            CreateJSFactory.prototype._generateSlot = function () {
                var slot = new dragonBones.Slot(new display.CreateJSDisplayBridge());
                return slot;
            };

            /** @private */
            CreateJSFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
                var rect = textureAtlas.getRegion(fullName);
                if (rect) {
                    var shape = new createjs.Shape(null);
                    var m = new createjs.Matrix2D(1, 0, 0, 1, -pivotX - rect.x, -pivotY - rect.y)
                    m.scale(1 / textureAtlas.scale, 1 / textureAtlas.scale);
                    shape.graphics.beginBitmapFill(textureAtlas.image, null, m);
                    shape.graphics.drawRect(-pivotX, -pivotY, rect.width, rect.height);
                }
                return shape;
            };
            return CreateJSFactory;
        })(factorys.BaseFactory);
        factorys.CreateJSFactory = CreateJSFactory;
    })(dragonBones.factorys || (dragonBones.factorys = {}));
    var factorys = dragonBones.factorys;
})(dragonBones);

// Shim for deprecated createjs method pending dragonbones update
dragonBones.display.CreateJSDisplayBridge.prototype.addDisplay = function (container, index) {
  let parent = container;
  if (parent && this._display) {
    if (index < 0) {
      parent.addChild(this._display);
    } else {
      parent.addChildAt(this._display, Math.min(index, parent.numChildren));
    }
  }
}

module.exports = dragonBones;
