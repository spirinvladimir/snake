(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/a/odesk/snake/index.js":[function(require,module,exports){
/*jslint node:true*/
/*global window*/
var domready = require('domready'),
    ex = require('./lib/excalibur'),
    Snake = require('./lib/snake');

domready(function () {
    'use strict';
    var game = new ex.Engine(),
        snake = new Snake({
            ex: ex,
            game: game,
            color: {
                head: ex.Color.Red,
                body: ex.Color.Yellow,
                food: ex.Color.Green
            }
        }),
        replay = function () {
            snake.kill();
            snake = new Snake({
                ex: ex,
                game: game,
                color: {
                    head: ex.Color.Red,
                    body: ex.Color.Yellow,
                    food: ex.Color.Green
                }
            });
            snake.onLose = replay;
            snake.run({x: 1});
        };
    window.onkeydown = function (k) {
        k = k.keyCode;
        if (k === 37) {
            snake.left();
        } else if (k === 38) {
            snake.up();
        } else if (k === 39) {
            snake.right();
        } else if (k === 40) {
            snake.down();
        }
    };
    document.addEventListener('click', function () {
        replay();
    });
    game.start();
    snake.onLose = replay;
    snake.run({x: 1});
});

},{"./lib/excalibur":"/home/a/odesk/snake/lib/excalibur.js","./lib/snake":"/home/a/odesk/snake/lib/snake.js","domready":"/home/a/odesk/snake/node_modules/domready/ready.js"}],"/home/a/odesk/snake/lib/excalibur.js":[function(require,module,exports){
/*! excalibur - v0.2.5 - 2015-02-04
* https://github.com/excaliburjs/Excalibur
* Copyright (c) 2015 ; Licensed BSD*/
if (typeof window == 'undefined') {
    window = { audioContext: function () {
    } };
}
if (typeof window != 'undefined' && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setInterval(callback, 1000 / 60);
    };
}
if (typeof window != 'undefined' && !window.AudioContext) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
}
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }
        // 6. Let k be 0
        k = 0;
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {
                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];
                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function (fun /*, thisArg */) {
        'use strict';
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function')
            throw new TypeError();
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t))
                return true;
        }
        return false;
    };
}
// Polyfill from  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
var ex;
(function (ex) {
    var Effects;
    (function (Effects) {
        /**
         * Applies the "Grayscale" effect to a sprite, removing color information.
         * @class Effects.Grayscale
         * @constructor
         * @extends ISpriteEffect
         */
        var Grayscale = (function () {
            function Grayscale() {
            }
            Grayscale.prototype.updatePixel = function (x, y, imageData) {
                var firstPixel = (x + y * imageData.width) * 4;
                var pixel = imageData.data;
                var avg = (pixel[firstPixel + 0] + pixel[firstPixel + 1] + pixel[firstPixel + 2]) / 3;
                pixel[firstPixel + 0] = avg;
                pixel[firstPixel + 1] = avg;
                pixel[firstPixel + 2] = avg;
            };
            return Grayscale;
        })();
        Effects.Grayscale = Grayscale;
        /**
         * Applies the "Invert" effect to a sprite, inverting the pixel colors.
         * @class Effects.Invert
         * @constructor
         * @extends ISpriteEffect
         */
        var Invert = (function () {
            function Invert() {
            }
            Invert.prototype.updatePixel = function (x, y, imageData) {
                var firstPixel = (x + y * imageData.width) * 4;
                var pixel = imageData.data;
                pixel[firstPixel + 0] = 255 - pixel[firstPixel + 0];
                pixel[firstPixel + 1] = 255 - pixel[firstPixel + 1];
                pixel[firstPixel + 2] = 255 - pixel[firstPixel + 2];
            };
            return Invert;
        })();
        Effects.Invert = Invert;
        /**
         * Applies the "Opacity" effect to a sprite, setting the alpha of all pixels to a given value.
         * @class Effects.Opacity
         * @extends ISpriteEffect
         * @constructor
         * @param opacity {number} The new opacity of the sprite from 0-1.0
         */
        var Opacity = (function () {
            function Opacity(opacity) {
                this.opacity = opacity;
            }
            Opacity.prototype.updatePixel = function (x, y, imageData) {
                var firstPixel = (x + y * imageData.width) * 4;
                var pixel = imageData.data;
                if (pixel[firstPixel + 3] !== 0) {
                    pixel[firstPixel + 3] = Math.round(this.opacity * 255);
                }
            };
            return Opacity;
        })();
        Effects.Opacity = Opacity;
        /**
         * Applies the "Colorize" effect to a sprite, changing the color channels of all the pixels to an
         * average of the original color and the provided color
         * @class Effects.Colorize
         * @extends ISpriteEffect
         * @constructor
         * @param color {Color} The color to apply to the sprite
         */
        var Colorize = (function () {
            function Colorize(color) {
                this.color = color;
            }
            Colorize.prototype.updatePixel = function (x, y, imageData) {
                var firstPixel = (x + y * imageData.width) * 4;
                var pixel = imageData.data;
                if (pixel[firstPixel + 3] !== 0) {
                    pixel[firstPixel + 0] = (pixel[firstPixel + 0] + this.color.r) / 2;
                    pixel[firstPixel + 1] = (pixel[firstPixel + 1] + this.color.g) / 2;
                    pixel[firstPixel + 2] = (pixel[firstPixel + 2] + this.color.b) / 2;
                }
            };
            return Colorize;
        })();
        Effects.Colorize = Colorize;
        /**
         * Applies the "Fill" effect to a sprite, changing the color channels of all non-transparent pixels to match
         * a given color
         * @class Effects.Fill
         * @extends ISpriteEffect
         * @constructor
         * @param color {Color} The color to apply to the sprite
         */
        var Fill = (function () {
            function Fill(color) {
                this.color = color;
            }
            Fill.prototype.updatePixel = function (x, y, imageData) {
                var firstPixel = (x + y * imageData.width) * 4;
                var pixel = imageData.data;
                if (pixel[firstPixel + 3] !== 0) {
                    pixel[firstPixel + 0] = this.color.r;
                    pixel[firstPixel + 1] = this.color.g;
                    pixel[firstPixel + 2] = this.color.b;
                }
            };
            return Fill;
        })();
        Effects.Fill = Fill;
    })(Effects = ex.Effects || (ex.Effects = {}));
})(ex || (ex = {}));
/// <reference path="../SpriteEffects.ts" />
/// <reference path="../Interfaces/IPipelineModule.ts" />
var ex;
(function (ex) {
    var MovementModule = (function () {
        function MovementModule() {
        }
        MovementModule.prototype.update = function (actor, engine, delta) {
            // Update placements based on linear algebra
            actor.x += actor.dx * delta / 1000;
            actor.y += actor.dy * delta / 1000;
            actor.dx += actor.ax * delta / 1000;
            actor.dy += actor.ay * delta / 1000;
            actor.rotation += actor.rx * delta / 1000;
            actor.scale.x += actor.sx * delta / 1000;
            actor.scale.y += actor.sy * delta / 1000;
        };
        return MovementModule;
    })();
    ex.MovementModule = MovementModule;
})(ex || (ex = {}));
/// <reference path="../Interfaces/IPipelineModule.ts" />
var ex;
(function (ex) {
    var OffscreenCullingModule = (function () {
        function OffscreenCullingModule() {
        }
        OffscreenCullingModule.prototype.update = function (actor, engine, delta) {
            var eventDispatcher = actor.eventDispatcher;
            var anchor = actor.anchor;
            var globalScale = actor.getGlobalScale();
            var width = globalScale.x * actor.getWidth() / actor.scale.x;
            var height = globalScale.y * actor.getHeight() / actor.scale.y;
            var actorScreenCoords = engine.worldToScreenCoordinates(new ex.Point(actor.getGlobalX() - anchor.x * width, actor.getGlobalY() - anchor.y * height));
            var zoom = 1.0;
            if (actor.scene && actor.scene.camera) {
                zoom = actor.scene.camera.getZoom();
            }
            if (!actor.isOffScreen) {
                if (actorScreenCoords.x + width * zoom < 0 || actorScreenCoords.y + height * zoom < 0 || actorScreenCoords.x > engine.width || actorScreenCoords.y > engine.height) {
                    eventDispatcher.publish('exitviewport', new ex.ExitViewPortEvent());
                    actor.isOffScreen = true;
                }
            }
            else {
                if (actorScreenCoords.x + width * zoom > 0 && actorScreenCoords.y + height * zoom > 0 && actorScreenCoords.x < engine.width && actorScreenCoords.y < engine.height) {
                    eventDispatcher.publish('enterviewport', new ex.EnterViewPortEvent());
                    actor.isOffScreen = false;
                }
            }
        };
        return OffscreenCullingModule;
    })();
    ex.OffscreenCullingModule = OffscreenCullingModule;
})(ex || (ex = {}));
/// <reference path="../Interfaces/IPipelineModule.ts" />
var ex;
(function (ex) {
    /**
     * Propogates pointer events to the actor
     */
    var CapturePointerModule = (function () {
        function CapturePointerModule() {
        }
        CapturePointerModule.prototype.update = function (actor, engine, delta) {
            if (!actor.enableCapturePointer)
                return;
            if (actor.isKilled())
                return;
            engine.input.pointers.propogate(actor);
        };
        return CapturePointerModule;
    })();
    ex.CapturePointerModule = CapturePointerModule;
})(ex || (ex = {}));
/// <reference path="../Interfaces/IPipelineModule.ts" />
var ex;
(function (ex) {
    var CollisionDetectionModule = (function () {
        function CollisionDetectionModule() {
        }
        CollisionDetectionModule.prototype.update = function (actor, engine, delta) {
            var eventDispatcher = actor.eventDispatcher;
            if (actor.collisionType !== 0 /* PreventCollision */) {
                for (var j = 0; j < engine.currentScene.tileMaps.length; j++) {
                    var map = engine.currentScene.tileMaps[j];
                    var intersectMap;
                    var side = 0 /* None */;
                    var max = 2;
                    var hasBounced = false;
                    while (intersectMap = map.collides(actor)) {
                        if (max-- < 0) {
                            break;
                        }
                        side = actor.getSideFromIntersect(intersectMap);
                        eventDispatcher.publish('collision', new ex.CollisionEvent(actor, null, side, intersectMap));
                        if ((actor.collisionType === 2 /* Active */ || actor.collisionType === 3 /* Elastic */)) {
                            actor.y += intersectMap.y;
                            actor.x += intersectMap.x;
                            // Naive elastic bounce
                            if (actor.collisionType === 3 /* Elastic */ && !hasBounced) {
                                hasBounced = true;
                                if (side === 3 /* Left */) {
                                    actor.dx = Math.abs(actor.dx);
                                }
                                else if (side === 4 /* Right */) {
                                    actor.dx = -Math.abs(actor.dx);
                                }
                                else if (side === 1 /* Top */) {
                                    actor.dy = Math.abs(actor.dy);
                                }
                                else if (side === 2 /* Bottom */) {
                                    actor.dy = -Math.abs(actor.dy);
                                }
                            }
                        }
                    }
                }
            }
        };
        return CollisionDetectionModule;
    })();
    ex.CollisionDetectionModule = CollisionDetectionModule;
})(ex || (ex = {}));
var ex;
(function (ex) {
    /**
     * An enum that describes the sides of an Actor for collision
     * @class Side
     */
    (function (Side) {
        /**
        @property None {Side}
        @static
        @final
        */
        Side[Side["None"] = 0] = "None";
        /**
        @property Top {Side}
        @static
        @final
        */
        Side[Side["Top"] = 1] = "Top";
        /**
        @property Bottom {Side}
        @static
        @final
        */
        Side[Side["Bottom"] = 2] = "Bottom";
        /**
        @property Left {Side}
        @static
        @final
        */
        Side[Side["Left"] = 3] = "Left";
        /**
        @property Right {Side}
        @static
        @final
        */
        Side[Side["Right"] = 4] = "Right";
    })(ex.Side || (ex.Side = {}));
    var Side = ex.Side;
})(ex || (ex = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ex;
(function (ex) {
    /**
     * A simple 2D point on a plane
     * @class Point
     * @constructor
     * @param x {number} X coordinate of the point
     * @param y {number} Y coordinate of the point
     *
     */
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * X Coordinate of the point
         * @property x {number}
         */
        /**
         * Y Coordinate of the point
         * @property y {number}
         */
        /**
         * Convert this point to a vector
         * @method toVector
         * @returns Vector
         */
        Point.prototype.toVector = function () {
            return new Vector(this.x, this.y);
        };
        /**
         * Rotates the current point around another by a certain number of
         * degrees in radians
         * @method rotate
         * @returns Point
         */
        Point.prototype.rotate = function (angle, anchor) {
            if (!anchor) {
                anchor = new ex.Point(0, 0);
            }
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            var x = cosAngle * (this.x - anchor.x) - sinAngle * (this.y - anchor.y) + anchor.x;
            var y = sinAngle * (this.x - anchor.x) + cosAngle * (this.y - anchor.y) + anchor.y;
            return new Point(x, y);
        };
        /**
         * Translates the current point by a vector
         * @method add
         * @returns Point
         */
        Point.prototype.add = function (vector) {
            return new Point(this.x + vector.x, this.y + vector.y);
        };
        /**
         * Sets the x and y components at once
         * @method setTo
         * @param x {number}
         * @param y {number}
         */
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
        };
        /**
         * Clones a new point that is a copy of this one.
         * @method clone
         * @returns Point
         */
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        return Point;
    })();
    ex.Point = Point;
    /**
     * A 2D vector on a plane.
     * @class Vector
     * @extends Point
     * @constructor
     * @param x {number} X component of the Vector
     * @param y {number} Y component of the Vector
     */
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(x, y) {
            _super.call(this, x, y);
            this.x = x;
            this.y = y;
        }
        /**
         * Returns a vector of unit length in the direction of the specified angle.
         * @method fromAngle
         * @static
         * @param angle {number} The angle to generate the vector
         * @returns Vector
         */
        Vector.fromAngle = function (angle) {
            return new Vector(Math.cos(angle), Math.sin(angle));
        };
        /**
         * The distance to another vector
         * @method distance
         * @param v {Vector} The other vector
         * @returns number
         */
        Vector.prototype.distance = function (v) {
            if (!v) {
                v = new Vector(0.0, 0.0);
            }
            return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
        };
        /**
         * Normalizes a vector to have a magnitude of 1.
         * @method normalize
         * @return Vector
         */
        Vector.prototype.normalize = function () {
            var d = this.distance();
            if (d > 0) {
                return new Vector(this.x / d, this.y / d);
            }
            else {
                return new Vector(0, 1);
            }
        };
        /**
         * Scales a vector's by a factor of size
         * @method scale
         * @param size {number} The factor to scale the magnitude by
         * @returns Vector
         */
        Vector.prototype.scale = function (size) {
            return new Vector(this.x * size, this.y * size);
        };
        /**
         * Adds one vector to another
         * @method add
         * @param v {Vector} The vector to add
         * @returns Vector
         */
        Vector.prototype.add = function (v) {
            return new Vector(this.x + v.x, this.y + v.y);
        };
        /**
         * Subtracts a vector from the current vector
         * @method minus
         * @param v {Vector} The vector to subtract
         * @returns Vector
         */
        Vector.prototype.minus = function (v) {
            return new Vector(this.x - v.x, this.y - v.y);
        };
        /**
         * Performs a dot product with another vector
         * @method dot
         * @param v {Vector} The vector to dot
         * @returns number
         */
        Vector.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        /**
         * Performs a 2D cross product with another vector. 2D cross products return a scalar value not a vector.
         * @method cross
         * @param v {Vector} The vector to cross
         * @returns number
         */
        Vector.prototype.cross = function (v) {
            return this.x * v.y - this.y * v.x;
        };
        /**
         * Returns the perpendicular vector to this one
         * @method perpendicular
         * @return Vector
         */
        Vector.prototype.perpendicular = function () {
            return new Vector(this.y, -this.x);
        };
        /**
         * Returns the normal vector to this one
         * @method normal
         * @return Vector
         */
        Vector.prototype.normal = function () {
            return this.perpendicular().normalize();
        };
        /**
         * Returns the angle of this vector.
         * @method toAngle
         * @returns number
         */
        Vector.prototype.toAngle = function () {
            return Math.atan2(this.y, this.x);
        };
        /**
         * Returns the point represention of this vector
         * @method toPoint
         * @returns Point
         */
        Vector.prototype.toPoint = function () {
            return new Point(this.x, this.y);
        };
        /**
         * Rotates the current vector around a point by a certain number of
         * degrees in radians
         * @method rotate
         * @returns Vector
         */
        Vector.prototype.rotate = function (angle, anchor) {
            return _super.prototype.rotate.call(this, angle, anchor).toVector();
        };
        return Vector;
    })(Point);
    ex.Vector = Vector;
    /**
     * A 2D ray that can be cast into the scene to do collision detection
     * @class Ray
     * @constructor
     * @param pos {Point} The starting position for the ray
     * @param dir {Vector} The vector indicating the direction of the ray
     */
    var Ray = (function () {
        function Ray(pos, dir) {
            this.pos = pos;
            this.dir = dir.normalize();
        }
        /**
         * Tests a whether this ray intersects with a line segment. Returns a number greater than or equal to 0 on success.
         * This number indicates the mathematical intersection time.
         * @method intersect
         * @param line {Line} The line to test
         * @returns number
         */
        Ray.prototype.intersect = function (line) {
            var numerator = line.begin.toVector().minus(this.pos.toVector());
            // Test is line and ray are parallel and non intersecting
            if (this.dir.cross(line.getSlope()) === 0 && numerator.cross(this.dir) !== 0) {
                return -1;
            }
            // Lines are parallel
            var divisor = (this.dir.cross(line.getSlope()));
            if (divisor === 0) {
                return -1;
            }
            var t = numerator.cross(line.getSlope()) / divisor;
            if (t >= 0) {
                var u = (numerator.cross(this.dir) / divisor) / line.getLength();
                if (u >= 0 && u <= 1) {
                    return t;
                }
            }
            return -1;
        };
        /**
         * Returns the point of intersection given the intersection time
         * @method getPoint
         * @returns Point
         */
        Ray.prototype.getPoint = function (time) {
            return this.pos.toVector().add(this.dir.scale(time)).toPoint();
        };
        return Ray;
    })();
    ex.Ray = Ray;
    /**
     * A 2D line segment
     * @class Line
     * @constructor
     * @param begin {Point} The starting point of the line segment
     * @param end {Point} The ending point of the line segment
     */
    var Line = (function () {
        function Line(begin, end) {
            this.begin = begin;
            this.end = end;
        }
        /**
         * Returns the slope of the line in the form of a vector
         * @method getSlope
         * @returns Vector
         */
        Line.prototype.getSlope = function () {
            var begin = this.begin.toVector();
            var end = this.end.toVector();
            var distance = begin.distance(end);
            return end.minus(begin).scale(1 / distance);
        };
        /**
         * Returns the length of the line segment in pixels
         * @method getLength
         * @returns number
         */
        Line.prototype.getLength = function () {
            var begin = this.begin.toVector();
            var end = this.end.toVector();
            var distance = begin.distance(end);
            return distance;
        };
        return Line;
    })();
    ex.Line = Line;
    var Projection = (function () {
        function Projection(min, max) {
            this.min = min;
            this.max = max;
        }
        Projection.prototype.overlaps = function (projection) {
            return this.max > projection.min && projection.max > this.min;
        };
        Projection.prototype.getOverlap = function (projection) {
            if (this.overlaps(projection)) {
                if (this.max > projection.max) {
                    return projection.max - this.min;
                }
                else {
                    return this.max - projection.min;
                }
            }
            return 0;
        };
        return Projection;
    })();
    ex.Projection = Projection;
})(ex || (ex = {}));
/// <reference path="Algebra.ts"/>
/// <reference path="Events.ts"/>
var ex;
(function (ex) {
    var Util;
    (function (Util) {
        Util.TwoPI = Math.PI * 2;
        function base64Encode(inputStr) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var outputStr = "";
            var i = 0;
            while (i < inputStr.length) {
                //all three "& 0xff" added below are there to fix a known bug 
                //with bytes returned by xhr.responseText
                var byte1 = inputStr.charCodeAt(i++) & 0xff;
                var byte2 = inputStr.charCodeAt(i++) & 0xff;
                var byte3 = inputStr.charCodeAt(i++) & 0xff;
                var enc1 = byte1 >> 2;
                var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                var enc3, enc4;
                if (isNaN(byte2)) {
                    enc3 = enc4 = 64;
                }
                else {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3)) {
                        enc4 = 64;
                    }
                    else {
                        enc4 = byte3 & 63;
                    }
                }
                outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
            }
            return outputStr;
        }
        Util.base64Encode = base64Encode;
        function clamp(val, min, max) {
            return val <= min ? min : (val >= max ? max : val);
        }
        Util.clamp = clamp;
        function drawLine(ctx, color, startx, starty, endx, endy) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(startx, starty);
            ctx.lineTo(endx, endy);
            ctx.closePath();
            ctx.stroke();
        }
        Util.drawLine = drawLine;
        function randomInRange(min, max) {
            return min + Math.random() * (max - min);
        }
        Util.randomInRange = randomInRange;
        function randomIntInRange(min, max) {
            return Math.round(randomInRange(min, max));
        }
        Util.randomIntInRange = randomIntInRange;
        function canonicalizeAngle(angle) {
            var tmpAngle = angle;
            if (angle > this.TwoPI) {
                while (tmpAngle > this.TwoPI) {
                    tmpAngle -= this.TwoPI;
                }
            }
            if (angle < 0) {
                while (tmpAngle < 0) {
                    tmpAngle += this.TwoPI;
                }
            }
            return tmpAngle;
        }
        Util.canonicalizeAngle = canonicalizeAngle;
        function toDegrees(radians) {
            return 180 / Math.PI * radians;
        }
        Util.toDegrees = toDegrees;
        function toRadians(degrees) {
            return degrees / 180 * Math.PI;
        }
        Util.toRadians = toRadians;
        function getPosition(el) {
            var oLeft = 0, oTop = 0;
            var calcOffsetLeft = function (parent) {
                oLeft += parent.offsetLeft;
                if (parent.offsetParent) {
                    calcOffsetLeft(parent.offsetParent);
                }
            };
            var calcOffsetTop = function (parent) {
                oTop += parent.offsetTop;
                if (parent.offsetParent) {
                    calcOffsetTop(parent.offsetParent);
                }
            };
            calcOffsetLeft(el);
            calcOffsetTop(el);
            return new ex.Point(oLeft, oTop);
        }
        Util.getPosition = getPosition;
        function getOppositeSide(side) {
            if (side === 1 /* Top */)
                return 2 /* Bottom */;
            if (side === 2 /* Bottom */)
                return 1 /* Top */;
            if (side === 3 /* Left */)
                return 4 /* Right */;
            if (side === 4 /* Right */)
                return 3 /* Left */;
            return 0 /* None */;
        }
        Util.getOppositeSide = getOppositeSide;
        /**
         * Excaliburs dynamically resizing collection
         * @class Collection
         * @constructor
         * @param [initialSize=200] {number} Initial size of the internal backing array
         */
        var Collection = (function () {
            function Collection(initialSize) {
                this.internalArray = null;
                this.endPointer = 0;
                var size = initialSize || Collection.DefaultSize;
                this.internalArray = new Array(size);
            }
            Collection.prototype.resize = function () {
                var newSize = this.internalArray.length * 2;
                var newArray = new Array(newSize);
                var count = this.count();
                for (var i = 0; i < count; i++) {
                    newArray[i] = this.internalArray[i];
                }
                delete this.internalArray;
                this.internalArray = newArray;
            };
            /**
             * Push elements to the end of the collection
             * @method push
             * @param element {T}
             * @returns T
             */
            Collection.prototype.push = function (element) {
                if (this.endPointer === this.internalArray.length) {
                    this.resize();
                }
                return this.internalArray[this.endPointer++] = element;
            };
            /**
             * Removes elements from the end of the collection
             * @method pop
             * @returns T
             */
            Collection.prototype.pop = function () {
                this.endPointer = this.endPointer - 1 < 0 ? 0 : this.endPointer - 1;
                return this.internalArray[this.endPointer];
            };
            /**
             * Returns the count of the collection
             * @method count
             * @returns number
             */
            Collection.prototype.count = function () {
                return this.endPointer;
            };
            /**
             * Empties the collection
             * @method clear
             */
            Collection.prototype.clear = function () {
                this.endPointer = 0;
            };
            /**
             * Returns the size of the internal backing array
             * @method internalSize
             * @returns number
             */
            Collection.prototype.internalSize = function () {
                return this.internalArray.length;
            };
            /**
             * Returns an element at a specific index
             * @method elementAt
             * @param index {number} Index of element to retreive
             * @returns T
             */
            Collection.prototype.elementAt = function (index) {
                if (index >= this.count()) {
                    return;
                }
                return this.internalArray[index];
            };
            /**
             * Inserts an element at a specific index
             * @method insert
             * @param index {number} Index to insert the element
             * @returns T
             */
            Collection.prototype.insert = function (index, value) {
                if (index >= this.count()) {
                    this.resize();
                }
                return this.internalArray[index] = value;
            };
            /**
             * Removes an element at a specific index
             * @method remove
             * @param index {number} Index of element to remove
             * @returns T
             */
            Collection.prototype.remove = function (index) {
                var count = this.count();
                if (count === 0)
                    return;
                // O(n) Shift 
                var removed = this.internalArray[index];
                for (var i = index; i < count; i++) {
                    this.internalArray[i] = this.internalArray[i + 1];
                }
                this.endPointer--;
                return removed;
            };
            /**
             * Removes an element by reference
             * @method removeElement
             * @param element {T} Index of element to retreive
             */
            Collection.prototype.removeElement = function (element) {
                var index = this.internalArray.indexOf(element);
                this.remove(index);
            };
            /**
             * Returns a array representing the collection
             * @method toArray
             * @returns T[]
             */
            Collection.prototype.toArray = function () {
                return this.internalArray.slice(0, this.endPointer);
            };
            /**
             * Iterate over every element in the collection
             * @method forEach
             * @param func {(T,number)=>any} Callback to call for each element passing a reference to the element and its index, returned values are ignored
             */
            Collection.prototype.forEach = function (func) {
                var count = this.count();
                for (var i = 0; i < count; i++) {
                    func.call(this, this.internalArray[i], i);
                }
            };
            /**
             * Mutate every element in the collection
             * @method map
             * @param func {(T,number)=>any} Callback to call for each element passing a reference to the element and its index, any values returned mutate the collection
             */
            Collection.prototype.map = function (func) {
                var count = this.count();
                for (var i = 0; i < count; i++) {
                    this.internalArray[i] = func.call(this, this.internalArray[i], i);
                }
            };
            /**
             * Default collection size
             * @property DefaultSize {number}
             * @static
             * @final
             */
            Collection.DefaultSize = 200;
            return Collection;
        })();
        Util.Collection = Collection;
    })(Util = ex.Util || (ex.Util = {}));
})(ex || (ex = {}));
var ex;
(function (ex) {
    /**
     * A Sprite is one of the main drawing primitives. It is responsible for drawing
     * images or parts of images known as Textures to the screen.
     * @class Sprite
     * @constructor
     * @param image {Texture} The backing image texture to build the Sprite
     * @param sx {number} The x position of the sprite
     * @param sy {number} The y position of the sprite
     * @param swidth {number} The width of the sprite in pixels
     * @param sheight {number} The height of the sprite in pixels
     */
    var Sprite = (function () {
        function Sprite(image, sx, sy, swidth, sheight) {
            var _this = this;
            this.sx = sx;
            this.sy = sy;
            this.swidth = swidth;
            this.sheight = sheight;
            this.scaleX = 1.0;
            this.scaleY = 1.0;
            this.rotation = 0.0;
            this.transformPoint = new ex.Point(0, 0);
            this.logger = ex.Logger.getInstance();
            this.flipVertical = false;
            this.flipHorizontal = false;
            this.width = 0;
            this.height = 0;
            this.effects = [];
            this.internalImage = new Image();
            this.spriteCanvas = null;
            this.spriteCtx = null;
            this.pixelData = null;
            this.pixelsLoaded = false;
            this.dirtyEffect = false;
            if (sx < 0 || sy < 0 || swidth < 0 || sheight < 0) {
                this.logger.error("Sprite cannot have any negative dimensions x:", sx, "y:", sy, "width:", swidth, "height:", sheight);
            }
            this.texture = image;
            this.spriteCanvas = document.createElement('canvas');
            this.spriteCanvas.width = swidth;
            this.spriteCanvas.height = sheight;
            this.spriteCtx = this.spriteCanvas.getContext('2d');
            this.texture.loaded.then(function () {
                _this.spriteCanvas.width = _this.spriteCanvas.width || _this.texture.image.naturalWidth;
                _this.spriteCanvas.height = _this.spriteCanvas.height || _this.texture.image.naturalHeight;
                _this.loadPixels();
                _this.dirtyEffect = true;
            }).error(function (e) {
                _this.logger.error("Error loading texture ", _this.texture.path, e);
            });
            this.width = swidth;
            this.height = sheight;
        }
        Sprite.prototype.loadPixels = function () {
            if (this.texture.isLoaded() && !this.pixelsLoaded) {
                var clamp = ex.Util.clamp;
                var naturalWidth = this.texture.image.naturalWidth || 0;
                var naturalHeight = this.texture.image.naturalHeight || 0;
                if (this.swidth > naturalWidth) {
                    this.logger.warn("The sprite width", this.swidth, "exceeds the width", naturalWidth, "of the backing texture", this.texture.path);
                }
                if (this.sheight > naturalHeight) {
                    this.logger.warn("The sprite height", this.sheight, "exceeds the height", naturalHeight, "of the backing texture", this.texture.path);
                }
                this.spriteCtx.drawImage(this.texture.image, clamp(this.sx, 0, naturalWidth), clamp(this.sy, 0, naturalHeight), clamp(this.swidth, 0, naturalWidth), clamp(this.sheight, 0, naturalHeight), 0, 0, this.swidth, this.sheight);
                //this.pixelData = this.spriteCtx.getImageData(0, 0, this.swidth, this.sheight);
                this.internalImage.src = this.spriteCanvas.toDataURL("image/png");
                this.pixelsLoaded = true;
            }
        };
        /**
         * Adds a new {{#crossLink Effects.ISpriteEffect}}{{/crossLink}} to this drawing.
         * @method addEffect
         * @param effect {Effects.ISpriteEffect} Effect to add to the this drawing
         */
        Sprite.prototype.addEffect = function (effect) {
            this.effects.push(effect);
            // We must check if the texture and the backing sprite pixels are loaded as well before 
            // an effect can be applied
            if (!this.texture.isLoaded() || !this.pixelsLoaded) {
                this.dirtyEffect = true;
            }
            else {
                this.applyEffects();
            }
        };
        Sprite.prototype.removeEffect = function (param) {
            var indexToRemove = null;
            if (typeof param === 'number') {
                indexToRemove = param;
            }
            else {
                indexToRemove = this.effects.indexOf(param);
            }
            this.effects.splice(indexToRemove, 1);
            // We must check if the texture and the backing sprite pixels are loaded as well before 
            // an effect can be applied
            if (!this.texture.isLoaded() || !this.pixelsLoaded) {
                this.dirtyEffect = true;
            }
            else {
                this.applyEffects();
            }
        };
        Sprite.prototype.applyEffects = function () {
            var _this = this;
            var clamp = ex.Util.clamp;
            var naturalWidth = this.texture.image.naturalWidth || 0;
            var naturalHeight = this.texture.image.naturalHeight || 0;
            this.spriteCtx.clearRect(0, 0, this.swidth, this.sheight);
            this.spriteCtx.drawImage(this.texture.image, clamp(this.sx, 0, naturalWidth), clamp(this.sy, 0, naturalHeight), clamp(this.swidth, 0, naturalWidth), clamp(this.sheight, 0, naturalHeight), 0, 0, this.swidth, this.sheight);
            this.pixelData = this.spriteCtx.getImageData(0, 0, this.swidth, this.sheight);
            this.effects.forEach(function (effect) {
                for (var y = 0; y < _this.sheight; y++) {
                    for (var x = 0; x < _this.swidth; x++) {
                        effect.updatePixel(x, y, _this.pixelData);
                    }
                }
            });
            this.spriteCtx.clearRect(0, 0, this.swidth, this.sheight);
            this.spriteCtx.putImageData(this.pixelData, 0, 0);
            this.internalImage.src = this.spriteCanvas.toDataURL("image/png");
        };
        /**
         * Clears all effects from the drawing and return it to its original state.
         * @method clearEffects
         */
        Sprite.prototype.clearEffects = function () {
            this.effects.length = 0;
            this.applyEffects();
        };
        /**
         * Sets the point about which to apply transformations to the drawing relative to the
         * top left corner of the drawing.
         * @method transformAbotPoint
         * @param point {Point} The point about which to apply transformations
         */
        Sprite.prototype.transformAboutPoint = function (point) {
            this.transformPoint = point;
        };
        /**
         * Sets the current rotation transformation for the drawing.
         * @method setRotation
         * @param radians {number} The rotation to apply to the drawing.
         */
        Sprite.prototype.setRotation = function (radians) {
            this.rotation = radians;
        };
        /**
         * Returns the current rotation for the drawing in radians.
         * @method getRotation
         * @returns number
         */
        Sprite.prototype.getRotation = function () {
            return this.rotation;
        };
        /**
         * Sets the scale trasformation in the x direction
         * @method setScale
         * @param scale {number} The magnitude to scale the drawing in the x direction
         */
        Sprite.prototype.setScaleX = function (scaleX) {
            this.scaleX = scaleX;
        };
        /**
         * Sets the scale trasformation in the x direction
         * @method setScale
         * @param scale {number} The magnitude to scale the drawing in the x direction
         */
        Sprite.prototype.setScaleY = function (scaleY) {
            this.scaleY = scaleY;
        };
        /**
         * Returns the current magnitude of the drawing's scale in the x direction
         * @method getScale
         * @returns number
         */
        Sprite.prototype.getScaleX = function () {
            return this.scaleX;
        };
        /**
         * Returns the current magnitude of the drawing's scale in the y direction
         * @method getScale
         * @returns number
         */
        Sprite.prototype.getScaleY = function () {
            return this.scaleY;
        };
        /**
         * Resets the internal state of the drawing (if any)
         * @method reset
         */
        Sprite.prototype.reset = function () {
            // do nothing
        };
        /**
         * Draws the sprite appropriately to the 2D rendering context, at an x and y coordinate.
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The 2D rendering context
         * @param x {number} The x coordinate of where to draw
         * @param y {number} The y coordinate of where to draw
         */
        Sprite.prototype.draw = function (ctx, x, y) {
            if (this.dirtyEffect) {
                this.applyEffects();
                this.dirtyEffect = false;
            }
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.rotation);
            if (this.flipHorizontal) {
                ctx.translate(this.swidth, 0);
                ctx.scale(-1, 1);
            }
            if (this.flipVertical) {
                ctx.translate(0, this.sheight);
                ctx.scale(1, -1);
            }
            if (this.internalImage) {
                ctx.drawImage(this.internalImage, 0, 0, this.swidth, this.sheight, -(this.transformPoint.x * this.swidth) * this.scaleX, -(this.transformPoint.y * this.sheight) * this.scaleY, this.swidth * this.scaleX, this.sheight * this.scaleY);
            }
            ctx.restore();
        };
        /**
         * Produces a copy of the current sprite
         * @method clone
         * @returns Sprite
         */
        Sprite.prototype.clone = function () {
            var result = new Sprite(this.texture, this.sx, this.sy, this.swidth, this.sheight);
            result.scaleX = this.scaleX;
            result.scaleY = this.scaleY;
            result.rotation = this.rotation;
            result.flipHorizontal = this.flipHorizontal;
            result.flipVertical = this.flipVertical;
            this.effects.forEach(function (e) {
                result.addEffect(e);
            });
            return result;
        };
        return Sprite;
    })();
    ex.Sprite = Sprite;
})(ex || (ex = {}));
/// <reference path="Sprite.ts" />
var ex;
(function (ex) {
    /**
     * SpriteSheets are a useful mechanism for slicing up image resources into
     * separate sprites or for generating in game animations. Sprites are organized
     * in row major order in the SpriteSheet.
     * @class SpriteSheet
     * @constructor
     * @param image {Texture} The backing image texture to build the SpriteSheet
     * @param columns {number} The number of columns in the image texture
     * @param rows {number} The number of rows in the image texture
     * @param spWidth {number} The width of each individual sprite in pixels
     * @param spHeight {number} The height of each individual sprite in pixels
     */
    var SpriteSheet = (function () {
        function SpriteSheet(image, columns, rows, spWidth, spHeight) {
            this.image = image;
            this.columns = columns;
            this.rows = rows;
            this.sprites = [];
            this.internalImage = image.image;
            this.sprites = new Array(columns * rows);
            // TODO: Inspect actual image dimensions with preloading
            /*if(spWidth * columns > this.internalImage.naturalWidth){
               throw new Error("SpriteSheet specified is wider than image width");
            }
   
            if(spHeight * rows > this.internalImage.naturalHeight){
               throw new Error("SpriteSheet specified is higher than image height");
            }*/
            var i = 0;
            var j = 0;
            for (i = 0; i < rows; i++) {
                for (j = 0; j < columns; j++) {
                    this.sprites[j + i * columns] = new ex.Sprite(this.image, j * spWidth, i * spHeight, spWidth, spHeight);
                }
            }
        }
        /**
         * Create an animation from the this SpriteSheet by listing out the
         * sprite indices. Sprites are organized in row major order in the SpriteSheet.
         * @method getAnimationByIndices
         * @param engine {Engine} Reference to the current game Engine
         * @param indices {number[]} An array of sprite indices to use in the animation
         * @param speed {number} The number in milliseconds to display each frame in the animation
         * @returns Animation
         */
        SpriteSheet.prototype.getAnimationByIndices = function (engine, indices, speed) {
            var _this = this;
            var images = indices.map(function (index) {
                return _this.sprites[index];
            });
            images = images.map(function (i) {
                return i.clone();
            });
            return new ex.Animation(engine, images, speed);
        };
        /**
         * Create an animation from the this SpriteSheet by specifing the range of
         * images with the beginning and ending index
         * @method getAnimationBetween
         * @param engine {Engine} Reference to the current game Engine
         * @param beginIndex {number} The index to start taking frames
         * @param endIndex {number} The index to stop taking frames
         * @param speed {number} The number in milliseconds to display each frame in the animation
         * @returns Animation
         */
        SpriteSheet.prototype.getAnimationBetween = function (engine, beginIndex, endIndex, speed) {
            var images = this.sprites.slice(beginIndex, endIndex);
            images = images.map(function (i) {
                return i.clone();
            });
            return new ex.Animation(engine, images, speed);
        };
        /**
         * Treat the entire SpriteSheet as one animation, organizing the frames in
         * row major order.
         * @method getAnimationForAll
         * @param engine {Engine} Reference to the current game Engine
         * @param speed {number} The number in milliseconds to display each frame the animation
         * @returns Animation
         */
        SpriteSheet.prototype.getAnimationForAll = function (engine, speed) {
            var sprites = this.sprites.map(function (i) {
                return i.clone();
            });
            return new ex.Animation(engine, sprites, speed);
        };
        /**
         * Retreive a specific sprite from the SpriteSheet by its index. Sprites are organized
         * in row major order in the SpriteSheet.
         * @method getSprite
         * @param index {number} The index of the sprite
         * @returns Sprite
         */
        SpriteSheet.prototype.getSprite = function (index) {
            if (index >= 0 && index < this.sprites.length) {
                return this.sprites[index];
            }
        };
        return SpriteSheet;
    })();
    ex.SpriteSheet = SpriteSheet;
    /**
     * SpriteFonts are a used in conjunction with a {{#crossLink Label}}{{/crossLink}} to specify
     * a particular bitmap as a font.
     * @class SpriteFont
     * @extends SpriteSheet
     * @constructor
     * @param image {Texture} The backing image texture to build the SpriteFont
     * @param alphabet {string} A string representing all the charaters in the image, in row major order.
     * @param caseInsensitve {boolean} Indicate whether this font takes case into account
     * @param columns {number} The number of columns of characters in the image
     * @param rows {number} The number of rows of characters in the image
     * @param spWdith {number} The width of each character in pixels
     * @param spHeight {number} The height of each character in pixels
     */
    var SpriteFont = (function (_super) {
        __extends(SpriteFont, _super);
        function SpriteFont(image, alphabet, caseInsensitive, columns, rows, spWidth, spHeight) {
            _super.call(this, image, columns, rows, spWidth, spHeight);
            this.image = image;
            this.alphabet = alphabet;
            this.caseInsensitive = caseInsensitive;
            this.spriteLookup = {};
            this.colorLookup = {};
            this._currentColor = ex.Color.Black;
        }
        /**
         * Returns a dictionary that maps each character in the alphabet to the appropriate Sprite.
         * @method getTextSprites
         * @returns {Object}
         */
        SpriteFont.prototype.getTextSprites = function () {
            var lookup = {};
            for (var i = 0; i < this.alphabet.length; i++) {
                var char = this.alphabet[i];
                if (this.caseInsensitive) {
                    char = char.toLowerCase();
                }
                lookup[char] = this.sprites[i].clone();
            }
            return lookup;
        };
        return SpriteFont;
    })(SpriteSheet);
    ex.SpriteFont = SpriteFont;
})(ex || (ex = {}));
/// <reference path="Engine.ts" />
/// <reference path="SpriteSheet.ts" />
var ex;
(function (ex) {
    var TileSprite = (function () {
        function TileSprite(spriteSheetKey, spriteId) {
            this.spriteSheetKey = spriteSheetKey;
            this.spriteId = spriteId;
        }
        return TileSprite;
    })();
    ex.TileSprite = TileSprite;
    /**
     * A light-weight object that occupies a space in a collision map. Generally
     * created by a CollisionMap.
     * @class Cell
     * @constructor
     * @param x {number}
     * @param y {number}
     * @param width {number}
     * @param height {number}
     * @param index {number}
     * @param [solid=false] {boolean}
     * @param [spriteId=-1] {number}
     */
    var Cell = (function () {
        function Cell(
            /**
             * Gets or sets x coordinate of the cell in world coordinates
             * @property x {number}
             */
            x, 
            /**
             * Gets or sets y coordinate of the cell in world coordinates
             * @property y {number}
             */
            y, 
            /**
             * Gets or sets the width of the cell
             * @property width {number}
             */
            width, 
            /**
             * Gets or sets the height of the cell
             * @property height {number}
             */
            height, 
            /**
             * The index of the cell in row major order
             * @property index {number}
             */
            index, 
            /**
             * Gets or sets whether this cell is solid
             * @property solid {boolean}
             */
            solid, 
            /**
             * The index of the sprite to use from the CollisionMap SpriteSheet, if -1 is specified nothing is drawn.
             * @property number {number}
             */
            sprites) {
            if (solid === void 0) { solid = false; }
            if (sprites === void 0) { sprites = []; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.index = index;
            this.solid = solid;
            this.sprites = sprites;
            this._bounds = new ex.BoundingBox(this.x, this.y, this.x + this.width, this.y + this.height);
        }
        /**
         * Returns the bounding box for this cell
         * @method getBounds
         * @returns BoundingBox
         */
        Cell.prototype.getBounds = function () {
            return this._bounds;
        };
        Cell.prototype.getCenter = function () {
            return new ex.Vector(this.x + this.width / 2, this.y + this.height / 2);
        };
        Cell.prototype.pushSprite = function (tileSprite) {
            this.sprites.push(tileSprite);
        };
        Cell.prototype.removeSprite = function (tileSprite) {
            var index = -1;
            if ((index = this.sprites.indexOf(tileSprite)) > -1) {
                this.sprites.splice(index, 1);
            }
        };
        Cell.prototype.clearSprites = function () {
            this.sprites.length = 0;
        };
        return Cell;
    })();
    ex.Cell = Cell;
    /**
     * The CollisionMap object provides a lightweight way to do large complex scenes with collision
     * without the overhead of actors.
     * @class CollisionMap
     * @constructor
     * @param x {number} The x coordinate to anchor the collision map's upper left corner (should not be changed once set)
     * @param y {number} The y coordinate to anchor the collision map's upper left corner (should not be changed once set)
     * @param cellWidth {number} The individual width of each cell (in pixels) (should not be changed once set)
     * @param cellHeight {number} The individual height of each cell (in pixels) (should not be changed once set)
     * @param rows {number} The number of rows in the collision map (should not be changed once set)
     * @param cols {number} The number of cols in the collision map (should not be changed once set)
     * @param spriteSheet {SpriteSheet} The spriteSheet to use for drawing
     */
    var TileMap = (function () {
        function TileMap(x, y, cellWidth, cellHeight, rows, cols) {
            var _this = this;
            this.x = x;
            this.y = y;
            this.cellWidth = cellWidth;
            this.cellHeight = cellHeight;
            this.rows = rows;
            this.cols = cols;
            this._collidingX = -1;
            this._collidingY = -1;
            this._onScreenXStart = 0;
            this._onScreenXEnd = 9999;
            this._onScreenYStart = 0;
            this._onScreenYEnd = 9999;
            this._spriteSheets = {};
            this.logger = ex.Logger.getInstance();
            this.data = [];
            this.data = new Array(rows * cols);
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    (function () {
                        var cd = new Cell(i * cellWidth + x, j * cellHeight + y, cellWidth, cellHeight, i + j * cols);
                        _this.data[i + j * cols] = cd;
                    })();
                }
            }
        }
        TileMap.prototype.registerSpriteSheet = function (key, spriteSheet) {
            this._spriteSheets[key] = spriteSheet;
        };
        /**
         * Returns the intesection vector that can be used to resolve collisions with actors. If there
         * is no collision null is returned.
         * @method collides
         * @param actor {Actor}
         * @returns Vector
         */
        TileMap.prototype.collides = function (actor) {
            var points = [];
            var width = actor.x + actor.getWidth();
            var height = actor.y + actor.getHeight();
            var actorBounds = actor.getBounds();
            var overlaps = [];
            for (var x = actorBounds.left; x <= width; x += Math.min(actor.getWidth() / 2, this.cellWidth / 2)) {
                for (var y = actorBounds.top; y <= height; y += Math.min(actor.getHeight() / 2, this.cellHeight / 2)) {
                    var cell = this.getCellByPoint(x, y);
                    if (cell && cell.solid) {
                        var overlap = actorBounds.collides(cell.getBounds());
                        var dir = actor.getCenter().minus(cell.getCenter());
                        if (overlap && overlap.dot(dir) > 0) {
                            overlaps.push(overlap);
                        }
                    }
                }
            }
            if (overlaps.length === 0) {
                return null;
            }
            // Return the smallest change other than zero
            var result = overlaps.reduce(function (accum, next) {
                var x = accum.x;
                var y = accum.y;
                if (Math.abs(accum.x) < Math.abs(next.x)) {
                    x = next.x;
                }
                if (Math.abs(accum.y) < Math.abs(next.y)) {
                    y = next.y;
                }
                return new ex.Vector(x, y);
            });
            return result;
        };
        /*
        public collidesActor(actor: Actor): boolean{
           
           var points: Point[] = [];
           var width = actor.x + actor.getWidth();
           var height = actor.y + actor.getHeight();
           for(var x = actor.x; x <= width; x += Math.min(actor.getWidth()/2,this.cellWidth/2)){
              for(var y = actor.y; y <= height; y += Math.min(actor.getHeight()/2, this.cellHeight/2)){
                 points.push(new Point(x,y))
              }
           }
  
           var result = points.some((p) => {
              return this.collidesPoint(p.x, p.y);
           });
  
           return result;
  
        }*/
        /*
        public collidesPoint(x: number, y: number): boolean{
           var x = Math.floor(x/this.cellWidth);// - Math.floor(this.x/this.cellWidth);
           var y = Math.floor(y/this.cellHeight);
  
  
           var cell = this.getCell(x, y);
           if(x >= 0 && y >= 0 && x < this.cols && y < this.rows && cell){
              if(cell.solid){
                 this._collidingX = x;
                 this._collidingY = y;
              }
              return cell.solid;
           }
  
  
  
           
           return false;
        }*/
        /**
         * Returns the cell by index (row major order)
         * @method getCellByIndex
         * @param index {number}
         * @returns Cell
         */
        TileMap.prototype.getCellByIndex = function (index) {
            return this.data[index];
        };
        /**
         * Returns the cell by it's x and y coordinates
         * @method getCell
         * @param x {number}
         * @param y {number}
         * @returns Cell
         */
        TileMap.prototype.getCell = function (x, y) {
            if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) {
                return null;
            }
            return this.data[x + y * this.cols];
        };
        /**
         * Returns the cell by testing a point in global coordinates,
         * returns null if no cell was found.
         * @method getCellByPoint
         * @param x {number}
         * @param y {number}
         * @returns Cell
         */
        TileMap.prototype.getCellByPoint = function (x, y) {
            var x = Math.floor((x - this.x) / this.cellWidth); // - Math.floor(this.x/this.cellWidth);
            var y = Math.floor((y - this.y) / this.cellHeight);
            var cell = this.getCell(x, y);
            if (x >= 0 && y >= 0 && x < this.cols && y < this.rows && cell) {
                return cell;
            }
            return null;
        };
        TileMap.prototype.update = function (engine, delta) {
            var worldCoordsUpperLeft = engine.screenToWorldCoordinates(new ex.Point(0, 0));
            var worldCoordsLowerRight = engine.screenToWorldCoordinates(new ex.Point(engine.width, engine.height));
            this._onScreenXStart = Math.max(Math.floor(worldCoordsUpperLeft.x / this.cellWidth) - 2, 0);
            this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - this.y) / this.cellHeight) - 2, 0);
            this._onScreenXEnd = Math.max(Math.floor(worldCoordsLowerRight.x / this.cellWidth) + 2, 0);
            this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - this.y) / this.cellHeight) + 2, 0);
        };
        /**
         * Draws the collision map to the screen. Called by the Scene.
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The current rendering context
         * @param delta {number} The number of milliseconds since the last draw
         */
        TileMap.prototype.draw = function (ctx, delta) {
            var _this = this;
            ctx.save();
            ctx.translate(this.x, this.y);
            for (var x = this._onScreenXStart; x < Math.min(this._onScreenXEnd, this.cols); x++) {
                for (var y = this._onScreenYStart; y < Math.min(this._onScreenYEnd, this.rows); y++) {
                    this.getCell(x, y).sprites.filter(function (s) {
                        return s.spriteId > -1;
                    }).forEach(function (ts) {
                        var ss = _this._spriteSheets[ts.spriteSheetKey];
                        if (ss) {
                            var sprite = ss.getSprite(ts.spriteId);
                            if (sprite) {
                                sprite.draw(ctx, x * _this.cellWidth, y * _this.cellHeight);
                            }
                            else {
                                _this.logger.warn("Sprite does not exist for id", ts.spriteId, "in sprite sheet", ts.spriteSheetKey, sprite, ss);
                            }
                        }
                        else {
                            _this.logger.warn("Sprite sheet", ts.spriteSheetKey, "does not exist", ss);
                        }
                    });
                }
            }
            ctx.restore();
        };
        /**
         * Draws all the collision map's debug info. Called by the Scene.
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The current rendering context
         */
        TileMap.prototype.debugDraw = function (ctx) {
            var width = this.cols * this.cellWidth;
            var height = this.rows * this.cellHeight;
            ctx.save();
            ctx.strokeStyle = ex.Color.Red.toString();
            for (var x = 0; x < this.cols + 1; x++) {
                ctx.beginPath();
                ctx.moveTo(this.x + x * this.cellWidth, this.y);
                ctx.lineTo(this.x + x * this.cellWidth, this.y + height);
                ctx.stroke();
            }
            for (var y = 0; y < this.rows + 1; y++) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + y * this.cellHeight);
                ctx.lineTo(this.x + width, this.y + y * this.cellHeight);
                ctx.stroke();
            }
            var solid = ex.Color.Red.clone();
            solid.a = .3;
            this.data.filter(function (cell) {
                return cell.solid;
            }).forEach(function (cell) {
                ctx.fillStyle = solid.toString();
                ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
            });
            if (this._collidingY > -1 && this._collidingX > -1) {
                ctx.fillStyle = ex.Color.Cyan.toString();
                ctx.fillRect(this.x + this._collidingX * this.cellWidth, this.y + this._collidingY * this.cellHeight, this.cellWidth, this.cellHeight);
            }
            ctx.restore();
        };
        return TileMap;
    })();
    ex.TileMap = TileMap;
})(ex || (ex = {}));
/// <reference path="../Algebra.ts" />
var ex;
(function (ex) {
    (function (CollisionStrategy) {
        CollisionStrategy[CollisionStrategy["Naive"] = 0] = "Naive";
        CollisionStrategy[CollisionStrategy["DynamicAABBTree"] = 1] = "DynamicAABBTree";
        CollisionStrategy[CollisionStrategy["SeparatingAxis"] = 2] = "SeparatingAxis";
    })(ex.CollisionStrategy || (ex.CollisionStrategy = {}));
    var CollisionStrategy = ex.CollisionStrategy;
    /**
     * Axis Aligned collision primitive for Excalibur.
     * @class BoundingBox
     * @constructor
     * @param left {number} x coordinate of the left edge
     * @param top {number} y coordinate of the top edge
     * @param right {number} x coordinate of the right edge
     * @param bottom {number} y coordinate of the bottom edge
     */
    var BoundingBox = (function () {
        function BoundingBox(left, top, right, bottom) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            if (right === void 0) { right = 0; }
            if (bottom === void 0) { bottom = 0; }
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
        /**
         * Returns the calculated width of the bounding box
         * @method getWidth
         * @returns number
         */
        BoundingBox.prototype.getWidth = function () {
            return this.right - this.left;
        };
        /**
         * Returns the calculated height of the bounding box
         * @method getHeight
         * @returns number
         */
        BoundingBox.prototype.getHeight = function () {
            return this.bottom - this.top;
        };
        /**
         * Returns the perimeter of the bounding box
         * @method getPerimeter
         * @returns number
         */
        BoundingBox.prototype.getPerimeter = function () {
            var wx = this.getWidth();
            var wy = this.getHeight();
            return 2 * (wx + wy);
        };
        BoundingBox.prototype.contains = function (val) {
            if (val instanceof ex.Point) {
                return (this.left <= val.x && this.top <= val.y && this.bottom >= val.y && this.right >= val.x);
            }
            else if (val instanceof BoundingBox) {
                if (this.left < val.left && this.top < val.top && val.bottom < this.bottom && val.right < this.right) {
                    return true;
                }
                return false;
            }
            return false;
        };
        /**
         * Combines this bounding box and another together returning a new bounding box
         * @method combine
         * @param other {BoundingBox} The bounding box to combine
         * @returns BoundingBox
         */
        BoundingBox.prototype.combine = function (other) {
            var compositeBB = new BoundingBox(Math.min(this.left, other.left), Math.min(this.top, other.top), Math.max(this.right, other.right), Math.max(this.bottom, other.bottom));
            return compositeBB;
        };
        /**
         * Test wether this bounding box collides with another returning,
         * the intersection vector that can be used to resovle the collision. If there
         * is no collision null is returned.
         * @method collides
         * @param collidable {ICollidable} Other collidable to test
         * @returns Vector
         */
        BoundingBox.prototype.collides = function (collidable) {
            if (collidable instanceof BoundingBox) {
                var other = collidable;
                var totalBoundingBox = this.combine(other);
                // If the total bounding box is less than the sum of the 2 bounds then there is collision
                if (totalBoundingBox.getWidth() < other.getWidth() + this.getWidth() && totalBoundingBox.getHeight() < other.getHeight() + this.getHeight()) {
                    // collision
                    var overlapX = 0;
                    if (this.right >= other.left && this.right <= other.right) {
                        overlapX = other.left - this.right;
                    }
                    else {
                        overlapX = other.right - this.left;
                    }
                    var overlapY = 0;
                    if (this.top <= other.bottom && this.top >= other.top) {
                        overlapY = other.bottom - this.top;
                    }
                    else {
                        overlapY = other.top - this.bottom;
                    }
                    if (Math.abs(overlapX) < Math.abs(overlapY)) {
                        return new ex.Vector(overlapX, 0);
                    }
                    else {
                        return new ex.Vector(0, overlapY);
                    }
                }
                else {
                    return null;
                }
            }
            return null;
        };
        BoundingBox.prototype.debugDraw = function (ctx) {
            ctx.lineWidth = 2;
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        };
        return BoundingBox;
    })();
    ex.BoundingBox = BoundingBox;
    var SATBoundingBox = (function () {
        function SATBoundingBox(points) {
            this._points = points.map(function (p) { return p.toVector(); });
        }
        SATBoundingBox.prototype.getSides = function () {
            var lines = [];
            var len = this._points.length;
            for (var i = 0; i < len; i++) {
                lines.push(new ex.Line(this._points[i], this._points[(i + 1) % len]));
            }
            return lines;
        };
        SATBoundingBox.prototype.getAxes = function () {
            var axes = [];
            var len = this._points.length;
            for (var i = 0; i < len; i++) {
                axes.push(this._points[i].minus(this._points[(i + 1) % len]).normal());
            }
            return axes;
        };
        SATBoundingBox.prototype.project = function (axis) {
            var scalars = [];
            var len = this._points.length;
            for (var i = 0; i < len; i++) {
                scalars.push(this._points[i].dot(axis));
            }
            return new ex.Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
        };
        /**
         * Returns the calculated width of the bounding box, by generating an axis aligned box around the current
         * @method getWidth
         * @returns number
         */
        SATBoundingBox.prototype.getWidth = function () {
            var left = this._points.reduce(function (accum, p, i, arr) {
                return Math.min(accum, p.x);
            }, Infinity);
            var right = this._points.reduce(function (accum, p, i, arr) {
                return Math.max(accum, p.x);
            }, -Infinity);
            return right - left;
        };
        /**
         * Returns the calculated height of the bounding box, by generating an axis aligned box around the current
         * @method getHeight
         * @returns number
         */
        SATBoundingBox.prototype.getHeight = function () {
            var top = this._points.reduce(function (accum, p, i, arr) {
                return Math.min(accum, p.y);
            }, Infinity);
            var bottom = this._points.reduce(function (accum, p, i, arr) {
                return Math.max(accum, p.y);
            }, -Infinity);
            return top - bottom;
        };
        /**
         * Tests wether a point is contained within the bounding box, using the PIP algorithm
         * http://en.wikipedia.org/wiki/Point_in_polygon
         * @method contains
         * @param p {Point} The point to test
         * @returns boolean
         */
        SATBoundingBox.prototype.contains = function (p) {
            // Always cast to the right, as long as we cast in a consitent fixed direction we
            // will be fine
            var testRay = new ex.Ray(p, new ex.Vector(1, 0));
            var intersectCount = this.getSides().reduce(function (accum, side, i, arr) {
                if (testRay.intersect(side) >= 0) {
                    return accum + 1;
                }
                return accum;
            }, 0);
            if (intersectCount % 2 === 0) {
                return false;
            }
            return true;
        };
        SATBoundingBox.prototype.collides = function (collidable) {
            if (collidable instanceof SATBoundingBox) {
                var other = collidable;
                var axes = this.getAxes();
                axes = other.getAxes().concat(axes);
                var minOverlap = 99999;
                var minAxis = null;
                for (var i = 0; i < axes.length; i++) {
                    var proj1 = this.project(axes[i]);
                    var proj2 = other.project(axes[i]);
                    var overlap = proj1.getOverlap(proj2);
                    if (overlap === 0) {
                        return null;
                    }
                    else {
                        if (overlap <= minOverlap) {
                            minOverlap = overlap;
                            minAxis = axes[i];
                        }
                    }
                }
                if (minAxis) {
                    return minAxis.normalize().scale(minOverlap);
                }
                else {
                    return null;
                }
            }
            return null;
        };
        SATBoundingBox.prototype.debugDraw = function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            // Iterate through the supplied points and contruct a 'polygon'
            var firstPoint = this._points[0];
            ctx.moveTo(firstPoint.x, firstPoint.y);
            this._points.forEach(function (point) {
                ctx.lineTo(point.x, point.y);
            });
            ctx.lineTo(firstPoint.x, firstPoint.y);
            ctx.closePath();
            ctx.strokeStyle = ex.Color.Blue.toString();
            ctx.stroke();
        };
        return SATBoundingBox;
    })();
    ex.SATBoundingBox = SATBoundingBox;
})(ex || (ex = {}));
/// <reference path="Events.ts" />
var ex;
(function (ex) {
    /**
     * Excalibur base class
     * @class Class
     * @constructor
     */
    var Class = (function () {
        function Class() {
            this.eventDispatcher = new ex.EventDispatcher(this);
        }
        /**
         * Add an event listener. You can listen for a variety of
         * events off of the engine; see the events section below for a complete list.
         * @method addEventListener
         * @param eventName {string} Name of the event to listen for
         * @param handler {event=>void} Event handler for the thrown event
         */
        Class.prototype.addEventListener = function (eventName, handler) {
            this.eventDispatcher.subscribe(eventName, handler);
        };
        /**
         * Removes an event listener. If only the eventName is specified
         * it will remove all handlers registered for that specific event. If the eventName
         * and the handler instance are specified just that handler will be removed.
         *
         * @method removeEventListener
         * @param eventName {string} Name of the event to listen for
         * @param [handler=undefined] {event=>void} Event handler for the thrown event
         */
        Class.prototype.removeEventListener = function (eventName, handler) {
            this.eventDispatcher.unsubscribe(eventName, handler);
        };
        /**
         * Alias for "addEventListener". You can listen for a variety of
         * events off of the engine; see the events section below for a complete list.
         * @method on
         * @param eventName {string} Name of the event to listen for
         * @param handler {event=>void} Event handler for the thrown event
         */
        Class.prototype.on = function (eventName, handler) {
            this.eventDispatcher.subscribe(eventName, handler);
        };
        /**
         * Alias for "removeEventListener". If only the eventName is specified
         * it will remove all handlers registered for that specific event. If the eventName
         * and the handler instance are specified only that handler will be removed.
         *
         * @method off
         * @param eventName {string} Name of the event to listen for
         * @param [handler=undefined] {event=>void} Event handler for the thrown event
         */
        Class.prototype.off = function (eventName, handler) {
            this.eventDispatcher.unsubscribe(eventName, handler);
        };
        /**
         * You may wish to extend native Excalibur functionality. Any method on
         * actor may be extended to support additional functionaliy. In the
         * example below we create a new type called "MyActor"
         * <br/><b>Example</b><pre>var MyActor = Actor.extend({
     constructor : function(){
        this.newprop = 'something';
        Actor.apply(this, arguments);
     },
     update : function(engine, delta){
        // Implement custom update
  
           // Call super constructor update
           Actor.prototype.update.call(this, engine, delta);
           console.log("Something cool!");
     }
  });
  var myActor = new MyActor(100, 100, 100, 100, Color.Azure);</pre>
         * @method extend
         * @static
         * @param methods {any}
         */
        Class.extend = function (methods) {
            var parent = this;
            var child;
            if (methods && methods.hasOwnProperty('constructor')) {
                child = methods.constructor;
            }
            else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            // Using constructor allows JS to lazily instantiate super classes
            var Super = function () {
                this.constructor = child;
            };
            Super.prototype = parent.prototype;
            child.prototype = new Super;
            if (methods) {
                for (var prop in methods) {
                    if (methods.hasOwnProperty(prop)) {
                        child.prototype[prop] = methods[prop];
                    }
                }
            }
            // Make subclasses extendable
            child.extend = Class.extend;
            return child;
        };
        return Class;
    })();
    ex.Class = Class;
})(ex || (ex = {}));
var ex;
(function (ex) {
    var Timer = (function () {
        /**
         * The Excalibur timer hooks into the internal timer and fires callbacks, after a certain interval, optionally repeating.
         *
         * @class Timer
         * @constructor
         * @param callback {callback} The callback to be fired after the interval is complete.
         * @param [repeats=false] {boolean} Indicates whether this call back should be fired only once, or repeat after every interval as completed.
         */
        function Timer(fcn, interval, repeats) {
            this.id = 0;
            this.interval = 10;
            this.fcn = function () {
            };
            this.repeats = false;
            this.elapsedTime = 0;
            this._totalTimeAlive = 0;
            this.complete = false;
            this.scene = null;
            this.id = Timer.id++;
            this.interval = interval || this.interval;
            this.fcn = fcn || this.fcn;
            this.repeats = repeats || this.repeats;
        }
        /**
         * Updates the timer after a certain number of milliseconds have elapsed. This is used internally by the engine.
         * @method update
         * @param delta {number} Number of elapsed milliseconds since the last update.
         */
        Timer.prototype.update = function (delta) {
            this._totalTimeAlive += delta;
            this.elapsedTime += delta;
            if (this.elapsedTime > this.interval) {
                this.fcn.call(this);
                if (this.repeats) {
                    this.elapsedTime = 0;
                }
                else {
                    this.complete = true;
                }
            }
        };
        Timer.prototype.getTimeRunning = function () {
            return this._totalTimeAlive;
        };
        /**
         * Cancels the timer, preventing any further executions.
         * @method cancel
         */
        Timer.prototype.cancel = function () {
            if (this.scene) {
                this.scene.cancelTimer(this);
            }
        };
        Timer.id = 0;
        return Timer;
    })();
    ex.Timer = Timer;
})(ex || (ex = {}));
/// <reference path="../Actor.ts"/>
/// <reference path="Side.ts"/>
/// <reference path="ICollisionResolver.ts"/> 
var ex;
(function (ex) {
    var NaiveCollisionResolver = (function () {
        function NaiveCollisionResolver() {
        }
        NaiveCollisionResolver.prototype.register = function (target) {
            // pass
        };
        NaiveCollisionResolver.prototype.remove = function (tartet) {
            // pass
        };
        NaiveCollisionResolver.prototype.evaluate = function (targets) {
            // Retrieve the list of potential colliders, exclude killed, prevented, and self
            var potentialColliders = targets.filter(function (other) {
                return !other.isKilled() && other.collisionType !== 0 /* PreventCollision */;
            });
            var actor1;
            var actor2;
            var collisionPairs = [];
            for (var j = 0, l = potentialColliders.length; j < l; j++) {
                actor1 = potentialColliders[j];
                for (var i = j + 1; i < l; i++) {
                    actor2 = potentialColliders[i];
                    var minimumTranslationVector;
                    if (minimumTranslationVector = actor1.collides(actor2)) {
                        var side = actor1.getSideFromIntersect(minimumTranslationVector);
                        var collisionPair = new ex.CollisionPair(actor1, actor2, minimumTranslationVector, side);
                        if (!collisionPairs.some(function (cp) {
                            return cp.equals(collisionPair);
                        })) {
                            collisionPairs.push(collisionPair);
                        }
                    }
                }
            }
            collisionPairs.forEach(function (p) { return p.evaluate(); });
            return collisionPairs;
        };
        NaiveCollisionResolver.prototype.update = function (targets) {
            return 0;
        };
        NaiveCollisionResolver.prototype.debugDraw = function (ctx, delta) {
        };
        return NaiveCollisionResolver;
    })();
    ex.NaiveCollisionResolver = NaiveCollisionResolver;
})(ex || (ex = {}));
/// <reference path="BoundingBox.ts"/>
var ex;
(function (ex) {
    var TreeNode = (function () {
        function TreeNode(parent) {
            this.parent = parent;
            this.parent = parent || null;
            this.actor = null;
            this.bounds = new ex.BoundingBox();
            this.left = null;
            this.right = null;
            this.height = 0;
        }
        TreeNode.prototype.isLeaf = function () {
            return (!this.left && !this.right);
        };
        return TreeNode;
    })();
    ex.TreeNode = TreeNode;
    var DynamicTree = (function () {
        function DynamicTree() {
            this.root = null;
            this.nodes = {};
        }
        DynamicTree.prototype.insert = function (leaf) {
            // If there are no nodes in the tree, make this the root leaf
            if (this.root === null) {
                this.root = leaf;
                this.root.parent = null;
                return;
            }
            // Search the tree for a node that is not a leaf and find the best place to insert
            var leafAABB = leaf.bounds;
            var currentRoot = this.root;
            while (!currentRoot.isLeaf()) {
                var left = currentRoot.left;
                var right = currentRoot.right;
                var area = currentRoot.bounds.getPerimeter();
                var combinedAABB = currentRoot.bounds.combine(leafAABB);
                var combinedArea = combinedAABB.getPerimeter();
                // Calculate cost heuristic for creating a new parent and leaf
                var cost = 2 * combinedArea;
                // Minimum cost of pushing the leaf down the tree
                var inheritanceCost = 2 * (combinedArea - area);
                // Cost of descending
                var leftCost = 0;
                var leftCombined = leafAABB.combine(left.bounds);
                var newArea;
                var oldArea;
                if (left.isLeaf()) {
                    leftCost = leftCombined.getPerimeter() + inheritanceCost;
                }
                else {
                    oldArea = left.bounds.getPerimeter();
                    newArea = leftCombined.getPerimeter();
                    leftCost = (newArea - oldArea) + inheritanceCost;
                }
                var rightCost = 0;
                var rightCombined = leafAABB.combine(right.bounds);
                if (right.isLeaf()) {
                    rightCost = rightCombined.getPerimeter() + inheritanceCost;
                }
                else {
                    oldArea = right.bounds.getPerimeter();
                    newArea = rightCombined.getPerimeter();
                    rightCost = (newArea - oldArea) + inheritanceCost;
                }
                // cost is acceptable
                if (cost < leftCost && cost < rightCost) {
                    break;
                }
                // Descend to the depths
                if (leftCost < rightCost) {
                    currentRoot = left;
                }
                else {
                    currentRoot = right;
                }
            }
            // Create the new parent node and insert into the tree
            var oldParent = currentRoot.parent;
            var newParent = new TreeNode(oldParent);
            newParent.bounds = leafAABB.combine(currentRoot.bounds);
            newParent.height = currentRoot.height + 1;
            if (oldParent !== null) {
                // The sibling node was not the root
                if (oldParent.left === currentRoot) {
                    oldParent.left = newParent;
                }
                else {
                    oldParent.right = newParent;
                }
                newParent.left = currentRoot;
                newParent.right = leaf;
                currentRoot.parent = newParent;
                leaf.parent = newParent;
            }
            else {
                // The sibling node was the root
                newParent.left = currentRoot;
                newParent.right = leaf;
                currentRoot.parent = newParent;
                leaf.parent = newParent;
                this.root = newParent;
            }
            // Walk up the tree fixing heights and AABBs
            var currentNode = leaf.parent;
            while (currentNode) {
                currentNode = this.balance(currentNode);
                if (!currentNode.left) {
                    throw new Error("Parent of current leaf cannot have a null left child" + currentNode);
                }
                if (!currentNode.right) {
                    throw new Error("Parent of current leaf cannot have a null right child" + currentNode);
                }
                currentNode.height = 1 + Math.max(currentNode.left.height, currentNode.right.height);
                currentNode.bounds = currentNode.left.bounds.combine(currentNode.right.bounds);
                currentNode = currentNode.parent;
            }
        };
        DynamicTree.prototype.remove = function (leaf) {
            if (leaf === this.root) {
                this.root = null;
                return;
            }
            var parent = leaf.parent;
            var grandParent = parent.parent;
            var sibling;
            if (parent.left === leaf) {
                sibling = parent.right;
            }
            else {
                sibling = parent.left;
            }
            if (grandParent) {
                if (grandParent.left === parent) {
                    grandParent.left = sibling;
                }
                else {
                    grandParent.right = sibling;
                }
                sibling.parent = grandParent;
                var currentNode = grandParent;
                while (currentNode) {
                    currentNode = this.balance(currentNode);
                    currentNode.bounds = currentNode.left.bounds.combine(currentNode.right.bounds);
                    currentNode.height = 1 + Math.max(currentNode.left.height, currentNode.right.height);
                    currentNode = currentNode.parent;
                }
            }
            else {
                this.root = sibling;
                sibling.parent = null;
            }
        };
        DynamicTree.prototype.registerActor = function (actor) {
            var node = new TreeNode();
            node.actor = actor;
            node.bounds = actor.getBounds();
            node.bounds.left -= 2;
            node.bounds.top -= 2;
            node.bounds.right += 2;
            node.bounds.bottom += 2;
            this.nodes[actor.id] = node;
            this.insert(node);
        };
        DynamicTree.prototype.updateActor = function (actor) {
            var node = this.nodes[actor.id];
            if (!node)
                return;
            var b = actor.getBounds();
            if (node.bounds.contains(b)) {
                return false;
            }
            this.remove(node);
            b.left -= 5;
            b.top -= 5;
            b.right += 5;
            b.bottom += 5;
            var multdx = actor.dx * 2;
            var multdy = actor.dy * 2;
            if (multdx < 0) {
                b.left += multdx;
            }
            else {
                b.right += multdx;
            }
            if (multdy < 0) {
                b.top += multdy;
            }
            else {
                b.bottom += multdy;
            }
            node.bounds = b;
            this.insert(node);
            return true;
        };
        DynamicTree.prototype.removeActor = function (actor) {
            var node = this.nodes[actor.id];
            if (!node)
                return;
            this.remove(node);
            this.nodes[actor.id] = null;
            delete this.nodes[actor.id];
        };
        DynamicTree.prototype.balance = function (node) {
            if (node === null) {
                throw new Error("Cannot balance at null node");
            }
            if (node.isLeaf() || node.height < 2) {
                return node;
            }
            var left = node.left;
            var right = node.right;
            var a = node;
            var b = left;
            var c = right;
            var d = left.left;
            var e = left.right;
            var f = right.left;
            var g = right.right;
            var balance = c.height - b.height;
            // Rotate c node up
            if (balance > 1) {
                // Swap the right node with it's parent
                c.left = a;
                c.parent = a.parent;
                a.parent = c;
                // The original node's old parent should point to the right node
                // this is mega confusing
                if (c.parent) {
                    if (c.parent.left === a) {
                        c.parent.left = c;
                    }
                    else {
                        c.parent.right = c;
                    }
                }
                else {
                    this.root = c;
                }
                // Rotate
                if (f.height > g.height) {
                    c.right = f;
                    a.right = g;
                    g.parent = a;
                    a.bounds = b.bounds.combine(g.bounds);
                    c.bounds = a.bounds.combine(f.bounds);
                    a.height = 1 + Math.max(b.height, g.height);
                    c.height = 1 + Math.max(a.height, f.height);
                }
                else {
                    c.right = g;
                    a.right = f;
                    f.parent = a;
                    a.bounds = b.bounds.combine(f.bounds);
                    c.bounds = a.bounds.combine(g.bounds);
                    a.height = 1 + Math.max(b.height, f.height);
                    c.height = 1 + Math.max(a.height, g.height);
                }
                return c;
            }
            // Rotate left node up
            if (balance < -1) {
                // swap
                b.left = a;
                b.parent = a.parent;
                a.parent = b;
                // node's old parent should point to b
                if (b.parent) {
                    if (b.parent.left === a) {
                        b.parent.left = b;
                    }
                    else {
                        if (b.parent.right !== a)
                            throw "Error rotating Dynamic Tree";
                        b.parent.right = b;
                    }
                }
                else {
                    this.root = b;
                }
                // rotate
                if (d.height > e.height) {
                    b.right = d;
                    a.left = e;
                    e.parent = a;
                    a.bounds = c.bounds.combine(e.bounds);
                    b.bounds = a.bounds.combine(d.bounds);
                    a.height = 1 + Math.max(c.height, e.height);
                    b.height = 1 + Math.max(a.height, d.height);
                }
                else {
                    b.right = e;
                    a.left = d;
                    d.parent = a;
                    a.bounds = c.bounds.combine(d.bounds);
                    b.bounds = a.bounds.combine(e.bounds);
                    a.height = 1 + Math.max(c.height, d.height);
                    b.height = 1 + Math.max(a.height, e.height);
                }
                return b;
            }
            return node;
        };
        DynamicTree.prototype.getHeight = function () {
            if (this.root === null) {
                return 0;
            }
            return this.root.height;
        };
        DynamicTree.prototype.query = function (actor, callback) {
            var bounds = actor.getBounds();
            var helper = function (currentNode) {
                if (currentNode && currentNode.bounds.collides(bounds)) {
                    if (currentNode.isLeaf() && currentNode.actor !== actor) {
                        if (callback.call(actor, currentNode.actor)) {
                            return true;
                        }
                    }
                    else {
                        return helper(currentNode.left) || helper(currentNode.right);
                    }
                }
                else {
                    return null;
                }
            };
            return helper(this.root);
        };
        DynamicTree.prototype.rayCast = function (ray, max) {
            // todo implement
            return null;
        };
        DynamicTree.prototype.getNodes = function () {
            var helper = function (currentNode) {
                if (currentNode) {
                    return [currentNode].concat(helper(currentNode.left), helper(currentNode.right));
                }
                else {
                    return [];
                }
            };
            return helper(this.root);
        };
        DynamicTree.prototype.debugDraw = function (ctx, delta) {
            // draw all the nodes in the Dynamic Tree
            var helper = function (currentNode) {
                if (currentNode) {
                    if (currentNode.isLeaf()) {
                        ctx.strokeStyle = 'green';
                    }
                    else {
                        ctx.strokeStyle = 'white';
                    }
                    currentNode.bounds.debugDraw(ctx);
                    if (currentNode.left)
                        helper(currentNode.left);
                    if (currentNode.right)
                        helper(currentNode.right);
                }
            };
            helper(this.root);
        };
        return DynamicTree;
    })();
    ex.DynamicTree = DynamicTree;
})(ex || (ex = {}));
/// <reference path="ICollisionResolver.ts"/>
/// <reference path="DynamicTree.ts"/>
var ex;
(function (ex) {
    var DynamicTreeCollisionResolver = (function () {
        function DynamicTreeCollisionResolver() {
            this._dynamicCollisionTree = new ex.DynamicTree();
        }
        DynamicTreeCollisionResolver.prototype.register = function (target) {
            this._dynamicCollisionTree.registerActor(target);
        };
        DynamicTreeCollisionResolver.prototype.remove = function (target) {
            this._dynamicCollisionTree.removeActor(target);
        };
        DynamicTreeCollisionResolver.prototype.evaluate = function (targets) {
            // Retrieve the list of potential colliders, exclude killed, prevented, and self
            var potentialColliders = targets.filter(function (other) {
                return !other.isKilled() && other.collisionType !== 0 /* PreventCollision */;
            });
            var actor;
            var collisionPairs = [];
            for (var j = 0, l = potentialColliders.length; j < l; j++) {
                actor = potentialColliders[j];
                this._dynamicCollisionTree.query(actor, function (other) {
                    if (other.collisionType === 0 /* PreventCollision */ || other.isKilled())
                        return false;
                    var minimumTranslationVector;
                    if (minimumTranslationVector = actor.collides(other)) {
                        var side = actor.getSideFromIntersect(minimumTranslationVector);
                        var collisionPair = new ex.CollisionPair(actor, other, minimumTranslationVector, side);
                        if (!collisionPairs.some(function (cp) {
                            return cp.equals(collisionPair);
                        })) {
                            collisionPairs.push(collisionPair);
                        }
                        return true;
                    }
                    return false;
                });
            }
            collisionPairs.forEach(function (p) { return p.evaluate(); });
            return collisionPairs;
        };
        DynamicTreeCollisionResolver.prototype.update = function (targets) {
            var _this = this;
            var updated = 0;
            targets.forEach(function (a) {
                if (_this._dynamicCollisionTree.updateActor(a)) {
                    updated++;
                }
            });
            return updated;
        };
        DynamicTreeCollisionResolver.prototype.debugDraw = function (ctx, delta) {
            this._dynamicCollisionTree.debugDraw(ctx, delta);
        };
        return DynamicTreeCollisionResolver;
    })();
    ex.DynamicTreeCollisionResolver = DynamicTreeCollisionResolver;
})(ex || (ex = {}));
var ex;
(function (ex) {
    /**
     * Collision pairs are used internally by Excalibur to resolve collision between actors. The
     * Pair prevents collisions from being evaluated more than one time
     * @class CollisionPair
     * @constructor
     * @param left {Actor} The first actor in the collision pair
     * @param right {Actor} The second actor in the collision pair
     * @param intersect {Vector} The minimum translation vector to separate the actors from the perspective of the left actor
     * @param side {Side} The side on which the collision occured from the perspective of the left actor
     */
    var CollisionPair = (function () {
        function CollisionPair(left, right, intersect, side) {
            this.left = left;
            this.right = right;
            this.intersect = intersect;
            this.side = side;
        }
        /**
         * Determines if this collision pair and another are equivalent.
         * @method equals
         * @param collisionPair {CollisionPair}
         * @returns boolean
         */
        CollisionPair.prototype.equals = function (collisionPair) {
            return (collisionPair.left === this.left && collisionPair.right === this.right) || (collisionPair.right === this.left && collisionPair.left === this.right);
        };
        /**
         * Evaluates the collision pair, performing collision resolution and event publishing appropriate to each collision type.
         * @method evaluate
         */
        CollisionPair.prototype.evaluate = function () {
            // todo fire collision events on left and right actor
            // todo resolve collisions                  
            // Publish collision events on both participants
            this.left.eventDispatcher.publish('collision', new ex.CollisionEvent(this.left, this.right, this.side, this.intersect));
            this.right.eventDispatcher.publish('collision', new ex.CollisionEvent(this.right, this.left, ex.Util.getOppositeSide(this.side), this.intersect.scale(-1.0)));
            // If the actor is active push the actor out if its not passive
            var leftSide = this.side;
            if ((this.left.collisionType === 2 /* Active */ || this.left.collisionType === 3 /* Elastic */) && this.right.collisionType !== 1 /* Passive */) {
                this.left.y += this.intersect.y;
                this.left.x += this.intersect.x;
                // Naive elastic bounce
                if (this.left.collisionType === 3 /* Elastic */) {
                    if (leftSide === 3 /* Left */) {
                        this.left.dx = Math.abs(this.left.dx);
                    }
                    else if (leftSide === 4 /* Right */) {
                        this.left.dx = -Math.abs(this.left.dx);
                    }
                    else if (leftSide === 1 /* Top */) {
                        this.left.dy = Math.abs(this.left.dy);
                    }
                    else if (leftSide === 2 /* Bottom */) {
                        this.left.dy = -Math.abs(this.left.dy);
                    }
                }
            }
            var rightSide = ex.Util.getOppositeSide(this.side);
            var rightIntersect = this.intersect.scale(-1.0);
            if ((this.right.collisionType === 2 /* Active */ || this.right.collisionType === 3 /* Elastic */) && this.left.collisionType !== 1 /* Passive */) {
                this.right.y += rightIntersect.y;
                this.right.x += rightIntersect.x;
                // Naive elastic bounce
                if (this.right.collisionType === 3 /* Elastic */) {
                    if (rightSide === 3 /* Left */) {
                        this.right.dx = Math.abs(this.right.dx);
                    }
                    else if (rightSide === 4 /* Right */) {
                        this.right.dx = -Math.abs(this.right.dx);
                    }
                    else if (rightSide === 1 /* Top */) {
                        this.right.dy = Math.abs(this.right.dy);
                    }
                    else if (rightSide === 2 /* Bottom */) {
                        this.right.dy = -Math.abs(this.right.dy);
                    }
                }
            }
        };
        return CollisionPair;
    })();
    ex.CollisionPair = CollisionPair;
})(ex || (ex = {}));
/// <reference path="Engine.ts" />
/// <reference path="Algebra.ts" />
var ex;
(function (ex) {
    /**
    * A base implementation of a camera. This class is meant to be extended.
    * @class Camera
    * @constructor
    * @param engine {Engine} Reference to the current engine
    */
    var BaseCamera = (function () {
        function BaseCamera() {
            this.focus = new ex.Point(0, 0);
            this.lerp = false;
            this._cameraMoving = false;
            this._currentLerpTime = 0;
            this._lerpDuration = 1 * 1000; // 5 seconds
            this._totalLerpTime = 0;
            this._lerpStart = null;
            this._lerpEnd = null;
            //camera effects
            this.isShaking = false;
            this.shakeMagnitudeX = 0;
            this.shakeMagnitudeY = 0;
            this.shakeDuration = 0;
            this.elapsedShakeTime = 0;
            this.isZooming = false;
            this.currentZoomScale = 1;
            this.maxZoomScale = 1;
            this.zoomDuration = 0;
            this.elapsedZoomTime = 0;
            this.zoomIncrement = 0.01;
        }
        BaseCamera.prototype.easeInOutCubic = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            currentTime /= duration / 2;
            if (currentTime < 1)
                return endValue / 2 * currentTime * currentTime * currentTime + startValue;
            currentTime -= 2;
            return endValue / 2 * (currentTime * currentTime * currentTime + 2) + startValue;
        };
        /**
        * Sets the {{#crossLink Actor}}{{/crossLink}} to follow with the camera
        * @method setActorToFollow
        * @param actor {Actor} The actor to follow
        */
        BaseCamera.prototype.setActorToFollow = function (actor) {
            this.follow = actor;
        };
        /**
        * Returns the focal point of the camera
        * @method getFocus
        * @returns Point
        */
        BaseCamera.prototype.getFocus = function () {
            return this.focus;
        };
        /**
        * Sets the focal point of the camera. This value can only be set if there is no actor to be followed.
        * @method setFocus
        * @param x {number} The x coordinate of the focal point
        * @param y {number} The y coordinate of the focal point
        */
        BaseCamera.prototype.setFocus = function (x, y) {
            if (!this.follow && !this.lerp) {
                this.focus.x = x;
                this.focus.y = y;
            }
            if (this.lerp) {
                this._lerpStart = this.focus.clone();
                this._lerpEnd = new ex.Point(x, y);
                this._currentLerpTime = 0;
                this._cameraMoving = true;
            }
        };
        /**
        * Sets the camera to shake at the specified magnitudes for the specified duration
        * @method shake
        * @param magnitudeX {number} the x magnitude of the shake
        * @param magnitudeY {number} the y magnitude of the shake
        * @param duration {number} the duration of the shake
        */
        BaseCamera.prototype.shake = function (magnitudeX, magnitudeY, duration) {
            this.isShaking = true;
            this.shakeMagnitudeX = magnitudeX;
            this.shakeMagnitudeY = magnitudeY;
            this.shakeDuration = duration;
        };
        /**
        * Zooms the camera in or out by the specified scale over the specified duration.
        * If no duration is specified, it will zoom by a set amount until the scale is reached.
        * @method zoom
        * @param scale {number} the scale of the zoom
        * @param [duration] {number} the duration of the zoom
        */
        BaseCamera.prototype.zoom = function (scale, duration) {
            this.isZooming = true;
            this.maxZoomScale = scale;
            this.zoomDuration = duration | 0;
            if (duration) {
                this.zoomIncrement = Math.abs(this.maxZoomScale - this.currentZoomScale) / duration * 1000;
            }
            if (this.maxZoomScale < 1) {
                if (duration) {
                    this.zoomIncrement = -1 * this.zoomIncrement;
                }
                else {
                    this.isZooming = false;
                    this.setCurrentZoomScale(this.maxZoomScale);
                }
            }
            else {
                if (!duration) {
                    this.isZooming = false;
                    this.setCurrentZoomScale(this.maxZoomScale);
                }
            }
            // console.log("zoom increment: " + this.zoomIncrement);
        };
        /**
        * gets the current zoom scale
        * @method getZoom
        * @returns {Number} the current zoom scale
        */
        BaseCamera.prototype.getZoom = function () {
            return this.currentZoomScale;
        };
        BaseCamera.prototype.setCurrentZoomScale = function (zoomScale) {
            this.currentZoomScale = zoomScale;
        };
        /**
        * Applies the relevant transformations to the game canvas to "move" or apply effects to the Camera
        * @method update
        * @param delta {number} The number of milliseconds since the last update
        */
        BaseCamera.prototype.update = function (ctx, delta) {
            var focus = this.getFocus();
            var xShake = 0;
            var yShake = 0;
            var canvasWidth = ctx.canvas.width;
            var canvasHeight = ctx.canvas.height;
            var newCanvasWidth = canvasWidth * this.getZoom();
            var newCanvasHeight = canvasHeight * this.getZoom();
            if (this.lerp) {
                if (this._currentLerpTime < this._lerpDuration && this._cameraMoving) {
                    if (this._lerpEnd.x < this._lerpStart.x) {
                        this.focus.x = this._lerpStart.x - (this.easeInOutCubic(this._currentLerpTime, this._lerpEnd.x, this._lerpStart.x, this._lerpDuration) - this._lerpEnd.x);
                    }
                    else {
                        this.focus.x = this.easeInOutCubic(this._currentLerpTime, this._lerpStart.x, this._lerpEnd.x, this._lerpDuration);
                    }
                    if (this._lerpEnd.y < this._lerpStart.y) {
                        this.focus.y = this._lerpStart.y - (this.easeInOutCubic(this._currentLerpTime, this._lerpEnd.y, this._lerpStart.y, this._lerpDuration) - this._lerpEnd.y);
                    }
                    else {
                        this.focus.y = this.easeInOutCubic(this._currentLerpTime, this._lerpStart.y, this._lerpEnd.y, this._lerpDuration);
                    }
                    this._currentLerpTime += delta;
                }
                else {
                    this._lerpStart = null;
                    this._lerpEnd = null;
                    this._currentLerpTime = 0;
                    this._cameraMoving = false;
                }
            }
            if (this.isDoneShaking()) {
                this.isShaking = false;
                this.elapsedShakeTime = 0;
                this.shakeMagnitudeX = 0;
                this.shakeMagnitudeY = 0;
                this.shakeDuration = 0;
            }
            else {
                this.elapsedShakeTime += delta;
                xShake = (Math.random() * this.shakeMagnitudeX | 0) + 1;
                yShake = (Math.random() * this.shakeMagnitudeY | 0) + 1;
            }
            ctx.translate(-focus.x + xShake + (newCanvasWidth / 2), -focus.y + yShake + (newCanvasHeight / 2));
            if (this.isDoneZooming()) {
                this.isZooming = false;
                this.elapsedZoomTime = 0;
                this.zoomDuration = 0;
                this.setCurrentZoomScale(this.maxZoomScale);
            }
            else {
                this.elapsedZoomTime += delta;
                this.setCurrentZoomScale(this.getZoom() + this.zoomIncrement * delta / 1000);
            }
            ctx.scale(this.getZoom(), this.getZoom());
        };
        BaseCamera.prototype.debugDraw = function (ctx) {
            var focus = this.getFocus();
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(focus.x, focus.y, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        };
        BaseCamera.prototype.isDoneShaking = function () {
            return !(this.isShaking) || (this.elapsedShakeTime >= this.shakeDuration);
        };
        BaseCamera.prototype.isDoneZooming = function () {
            if (this.zoomDuration != 0) {
                return (this.elapsedZoomTime >= this.zoomDuration);
            }
            else {
                if (this.maxZoomScale < 1) {
                    return (this.currentZoomScale <= this.maxZoomScale);
                }
                else {
                    return (this.currentZoomScale >= this.maxZoomScale);
                }
            }
        };
        return BaseCamera;
    })();
    ex.BaseCamera = BaseCamera;
    /**
    * An extension of BaseCamera that is locked vertically; it will only move side to side.
    * @class SideCamera
    * @extends BaseCamera
    * @constructor
    * @param engine {Engine} Reference to the current engine
    */
    var SideCamera = (function (_super) {
        __extends(SideCamera, _super);
        function SideCamera() {
            _super.apply(this, arguments);
        }
        SideCamera.prototype.getFocus = function () {
            if (this.follow) {
                return new ex.Point(this.follow.x + this.follow.getWidth() / 2, this.focus.y);
            }
            else {
                return this.focus;
            }
        };
        return SideCamera;
    })(BaseCamera);
    ex.SideCamera = SideCamera;
    /**
    * An extension of BaseCamera that is locked to an actor or focal point; the actor will appear in the center of the screen.
    * @class TopCamera
    * @extends BaseCamera
    * @constructor
    * @param engine {Engine} Reference to the current engine
    */
    var TopCamera = (function (_super) {
        __extends(TopCamera, _super);
        function TopCamera() {
            _super.apply(this, arguments);
        }
        TopCamera.prototype.getFocus = function () {
            if (this.follow) {
                return new ex.Point(this.follow.x + this.follow.getWidth() / 2, this.follow.y + this.follow.getHeight() / 2);
            }
            else {
                return this.focus;
            }
        };
        return TopCamera;
    })(BaseCamera);
    ex.TopCamera = TopCamera;
})(ex || (ex = {}));
/// <reference path="Class.ts" />
/// <reference path="Timer.ts" />
/// <reference path="Collision/NaiveCollisionResolver.ts"/>
/// <reference path="Collision/DynamicTreeCollisionResolver.ts"/>
/// <reference path="CollisionPair.ts" />
/// <reference path="Camera.ts" />
var ex;
(function (ex) {
    /**
     * Actors are composed together into groupings called Scenes in
     * Excalibur. The metaphor models the same idea behind real world
     * actors in a scene. Only actors in scenes will be updated and drawn.
     * @class Scene
     * @constructor
     */
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(engine) {
            _super.call(this);
            /**
             * The actors in the current scene
             * @property children {Actor[]}
             */
            this.children = [];
            this.tileMaps = [];
            this.uiActors = [];
            this._collisionResolver = new ex.DynamicTreeCollisionResolver();
            this._killQueue = [];
            this._timers = [];
            this._cancelQueue = [];
            this._isInitialized = false;
            this.camera = new ex.BaseCamera();
            if (engine) {
                this.camera.setFocus(engine.width / 2, engine.height / 2);
            }
        }
        /**
         * This is called when the scene is made active and started. It is meant to be overriden,
         * this is where you should setup any DOM UI or event handlers needed for the scene.
         * @method onActivate
         */
        Scene.prototype.onActivate = function () {
            // will be overridden
        };
        /**
         * This is called when the scene is made transitioned away from and stopped. It is meant to be overriden,
         * this is where you should cleanup any DOM UI or event handlers needed for the scene.
         * @method onDeactivate
         */
        Scene.prototype.onDeactivate = function () {
            // will be overridden
        };
        /**
         * This is called before the first update of the actor. This method is meant to be
         * overridden. This is where initialization of child actors should take place.
         * @method onInitialize
         * @param engine {Engine}
         */
        Scene.prototype.onInitialize = function (engine) {
            // will be overridden
        };
        /**
         * Publish an event to all actors in the scene
         * @method publish
         * @param eventType {string} The name of the event to publish
         * @param event {GameEvent} The event object to send
         */
        Scene.prototype.publish = function (eventType, event) {
            this.children.forEach(function (actor) {
                actor.triggerEvent(eventType, event);
            });
        };
        /**
         * Updates all the actors and timers in the Scene. Called by the Engine.
         * @method update
         * @param engine {Engine} Reference to the current Engine
         * @param delta {number} The number of milliseconds since the last update
         */
        Scene.prototype.update = function (engine, delta) {
            if (!this._isInitialized) {
                this.onInitialize(engine);
                this.eventDispatcher.publish('initialize', new ex.InitializeEvent(engine));
                this._isInitialized = true;
            }
            this.uiActors.forEach(function (ui) {
                ui.update(engine, delta);
            });
            this.tileMaps.forEach(function (cm) {
                cm.update(engine, delta);
            });
            var len = 0;
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].update(engine, delta);
            }
            // Run collision resolution strategy
            if (this._collisionResolver) {
                this._collisionResolver.update(this.children);
                this._collisionResolver.evaluate(this.children);
            }
            // Remove actors from scene graph after being killed
            var actorIndex = 0;
            for (var i = 0, len = this._killQueue.length; i < len; i++) {
                actorIndex = this.children.indexOf(this._killQueue[i]);
                if (actorIndex > -1) {
                    this.children.splice(actorIndex, 1);
                }
            }
            this._killQueue.length = 0;
            // Remove timers in the cancel queue before updating them
            var timerIndex = 0;
            for (var i = 0, len = this._cancelQueue.length; i < len; i++) {
                this.removeTimer(this._cancelQueue[i]);
            }
            this._cancelQueue.length = 0;
            // Cycle through timers updating timers
            var that = this;
            this._timers = this._timers.filter(function (timer) {
                timer.update(delta);
                return !timer.complete;
            });
        };
        /**
         * Draws all the actors in the Scene. Called by the Engine.
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The current rendering context
         * @param delta {number} The number of milliseconds since the last draw
         */
        Scene.prototype.draw = function (ctx, delta) {
            ctx.save();
            if (this.camera) {
                this.camera.update(ctx, delta);
            }
            this.tileMaps.forEach(function (cm) {
                cm.draw(ctx, delta);
            });
            var len = 0;
            var start = 0;
            var end = 0;
            var actor;
            for (var i = 0, len = this.children.length; i < len; i++) {
                actor = this.children[i];
                // only draw actors that are visible
                if (actor.visible) {
                    this.children[i].draw(ctx, delta);
                }
            }
            if (this.engine && this.engine.isDebug) {
                ctx.strokeStyle = 'yellow';
                this.debugDraw(ctx);
            }
            ctx.restore();
            this.uiActors.forEach(function (ui) {
                if (ui.visible) {
                    ui.draw(ctx, delta);
                }
            });
            if (this.engine && this.engine.isDebug) {
                this.uiActors.forEach(function (ui) {
                    ui.debugDraw(ctx);
                });
            }
        };
        /**
         * Draws all the actors' debug information in the Scene. Called by the Engine.
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The current rendering context
         */
        Scene.prototype.debugDraw = function (ctx) {
            this.tileMaps.forEach(function (map) {
                map.debugDraw(ctx);
            });
            this.children.forEach(function (actor) {
                actor.debugDraw(ctx);
            });
            // todo possibly enable this with excalibur flags features?
            //this._collisionResolver.debugDraw(ctx, 20);
            //this.camera.debugDraw(ctx);
        };
        Scene.prototype.add = function (entity) {
            if (entity instanceof ex.UIActor) {
                this.addUIActor(entity);
                return;
            }
            if (entity instanceof ex.Actor) {
                this.addChild(entity);
            }
            if (entity instanceof ex.Timer) {
                this.addTimer(entity);
            }
            if (entity instanceof ex.TileMap) {
                this.addTileMap(entity);
            }
        };
        Scene.prototype.remove = function (entity) {
            if (entity instanceof ex.UIActor) {
                this.removeUIActor(entity);
                return;
            }
            if (entity instanceof ex.Actor) {
                this._collisionResolver.remove(entity);
                this.removeChild(entity);
            }
            if (entity instanceof ex.Timer) {
                this.removeTimer(entity);
            }
            if (entity instanceof ex.TileMap) {
                this.removeTileMap(entity);
            }
        };
        /**
         * Adds an actor to act as a piece of UI, meaning it is always positioned
         * in screen coordinates. UI actors do not participate in collisions
         * @method addUIActor
         * @param actor {Actor}
         */
        Scene.prototype.addUIActor = function (actor) {
            this.uiActors.push(actor);
        };
        /**
         * Removes an actor as a piec of UI
         * @method removeUIActor
         * @param actor {Actor}
         */
        Scene.prototype.removeUIActor = function (actor) {
            var index = this.uiActors.indexOf(actor);
            if (index > -1) {
                this.uiActors.splice(index, 1);
            }
        };
        /**
         * Adds an actor to the Scene, once this is done the actor will be drawn and updated.
         * @method addChild
         * @param actor {Actor}
         */
        Scene.prototype.addChild = function (actor) {
            this._collisionResolver.register(actor);
            actor.scene = this;
            this.children.push(actor);
            actor.parent = this.actor;
        };
        /**
         * Adds a TileMap to the Scene, once this is done the TileMap will be drawn and updated.
         * @method addTileMap
         * @param tileMap {TileMap}
         */
        Scene.prototype.addTileMap = function (tileMap) {
            this.tileMaps.push(tileMap);
        };
        /**
         * Removes a TileMap from the Scene, it willno longer be drawn or updated.
         * @method removeTileMap
         * @param tileMap {TileMap}
         */
        Scene.prototype.removeTileMap = function (tileMap) {
            var index = this.tileMaps.indexOf(tileMap);
            if (index > -1) {
                this.tileMaps.splice(index, 1);
            }
        };
        /**
         * Removes an actor from the Scene, it will no longer be drawn or updated.
         * @method removeChild
         * @param actor {Actor} The actor to remove
         */
        Scene.prototype.removeChild = function (actor) {
            this._collisionResolver.remove(actor);
            this._killQueue.push(actor);
            actor.parent = null;
        };
        /**
         * Adds a timer to the Scene
         * @method addTimer
         * @param timer {Timer} The timer to add
         * @returns Timer
         */
        Scene.prototype.addTimer = function (timer) {
            this._timers.push(timer);
            timer.scene = this;
            return timer;
        };
        /**
         * Removes a timer to the Scene, can be dangerous
         * @method removeTimer
         * @private
         * @param timer {Timer} The timer to remove
         * @returns Timer
         */
        Scene.prototype.removeTimer = function (timer) {
            var i = this._timers.indexOf(timer);
            if (i !== -1) {
                this._timers.splice(i, 1);
            }
            return timer;
        };
        /**
         * Cancels a timer, removing it from the scene nicely
         * @method cancelTimer
         * @param timer {Timer} The timer to cancel
         * @returns Timer
         */
        Scene.prototype.cancelTimer = function (timer) {
            this._cancelQueue.push(timer);
            return timer;
        };
        /**
         * Tests whether a timer is active in the scene
         * @method isTimerActive
         * @param timer {Timer}
         * @returns boolean
         */
        Scene.prototype.isTimerActive = function (timer) {
            return (this._timers.indexOf(timer) > -1);
        };
        return Scene;
    })(ex.Class);
    ex.Scene = Scene;
})(ex || (ex = {}));
/// <reference path="Algebra.ts" />
/// <reference path="Engine.ts" />
/// <reference path="Actor.ts" />
var ex;
(function (ex) {
    var Internal;
    (function (Internal) {
        var Actions;
        (function (Actions) {
            var EaseTo = (function () {
                function EaseTo(actor, x, y, duration, easingFcn) {
                    this.actor = actor;
                    this.easingFcn = easingFcn;
                    this._currentLerpTime = 0;
                    this._lerpDuration = 1 * 1000; // 5 seconds
                    this._lerpStart = new ex.Point(0, 0);
                    this._lerpEnd = new ex.Point(0, 0);
                    this._initialized = false;
                    this._stopped = false;
                    this._distance = 0;
                    this._lerpDuration = duration;
                    this._lerpEnd = new ex.Point(x, y);
                }
                EaseTo.prototype._initialize = function () {
                    this._lerpStart = new ex.Point(this.actor.x, this.actor.y);
                    this._currentLerpTime = 0;
                    this._distance = this._lerpStart.toVector().distance(this._lerpEnd.toVector());
                };
                EaseTo.prototype.update = function (delta) {
                    if (!this._initialized) {
                        this._initialize();
                        this._initialized = true;
                    }
                    var newX = this.actor.x;
                    var newY = this.actor.y;
                    if (this._currentLerpTime < this._lerpDuration) {
                        if (this._lerpEnd.x < this._lerpStart.x) {
                            newX = this._lerpStart.x - (this.easingFcn(this._currentLerpTime, this._lerpEnd.x, this._lerpStart.x, this._lerpDuration) - this._lerpEnd.x);
                        }
                        else {
                            newX = this.easingFcn(this._currentLerpTime, this._lerpStart.x, this._lerpEnd.x, this._lerpDuration);
                        }
                        if (this._lerpEnd.y < this._lerpStart.y) {
                            newY = this._lerpStart.y - (this.easingFcn(this._currentLerpTime, this._lerpEnd.y, this._lerpStart.y, this._lerpDuration) - this._lerpEnd.y);
                        }
                        else {
                            newY = this.easingFcn(this._currentLerpTime, this._lerpStart.y, this._lerpEnd.y, this._lerpDuration);
                        }
                        this.actor.x = newX;
                        this.actor.y = newY;
                        this._currentLerpTime += delta;
                    }
                    else {
                        this.actor.x = this._lerpEnd.x;
                        this.actor.y = this._lerpEnd.y;
                    }
                };
                EaseTo.prototype.isComplete = function (actor) {
                    return this._stopped || (new ex.Vector(actor.x, actor.y)).distance(this._lerpStart.toVector()) >= this._distance;
                };
                EaseTo.prototype.reset = function () {
                    this._initialized = false;
                };
                EaseTo.prototype.stop = function () {
                    this._stopped = true;
                };
                return EaseTo;
            })();
            Actions.EaseTo = EaseTo;
            var MoveTo = (function () {
                function MoveTo(actor, destx, desty, speed) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.end = new ex.Vector(destx, desty);
                    this.speed = speed;
                }
                MoveTo.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.start = new ex.Vector(this.actor.x, this.actor.y);
                        this.distance = this.start.distance(this.end);
                        this.dir = this.end.minus(this.start).normalize();
                    }
                    var m = this.dir.scale(this.speed);
                    this.actor.dx = m.x;
                    this.actor.dy = m.y;
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.x = this.end.x;
                        this.actor.y = this.end.y;
                        this.actor.dy = 0;
                        this.actor.dx = 0;
                    }
                };
                MoveTo.prototype.isComplete = function (actor) {
                    return this._stopped || (new ex.Vector(actor.x, actor.y)).distance(this.start) >= this.distance;
                };
                MoveTo.prototype.stop = function () {
                    this.actor.dy = 0;
                    this.actor.dx = 0;
                    this._stopped = true;
                };
                MoveTo.prototype.reset = function () {
                    this._started = false;
                };
                return MoveTo;
            })();
            Actions.MoveTo = MoveTo;
            var MoveBy = (function () {
                function MoveBy(actor, destx, desty, time) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.end = new ex.Vector(destx, desty);
                    if (time <= 0) {
                        ex.Logger.getInstance().error("Attempted to moveBy time less than or equal to zero : " + time);
                        throw new Error("Cannot move in time <= 0");
                    }
                    this.time = time;
                }
                MoveBy.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.start = new ex.Vector(this.actor.x, this.actor.y);
                        this.distance = this.start.distance(this.end);
                        this.dir = this.end.minus(this.start).normalize();
                        this.speed = this.distance / (this.time / 1000);
                    }
                    var m = this.dir.scale(this.speed);
                    this.actor.dx = m.x;
                    this.actor.dy = m.y;
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.x = this.end.x;
                        this.actor.y = this.end.y;
                        this.actor.dy = 0;
                        this.actor.dx = 0;
                    }
                };
                MoveBy.prototype.isComplete = function (actor) {
                    return this._stopped || (new ex.Vector(actor.x, actor.y)).distance(this.start) >= this.distance;
                };
                MoveBy.prototype.stop = function () {
                    this.actor.dy = 0;
                    this.actor.dx = 0;
                    this._stopped = true;
                };
                MoveBy.prototype.reset = function () {
                    this._started = false;
                };
                return MoveBy;
            })();
            Actions.MoveBy = MoveBy;
            var Follow = (function () {
                function Follow(actor, actorToFollow, followDistance) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.actorToFollow = actorToFollow;
                    this.current = new ex.Vector(this.actor.x, this.actor.y);
                    this.end = new ex.Vector(actorToFollow.x, actorToFollow.y);
                    this.maximumDistance = (followDistance != undefined) ? followDistance : this.current.distance(this.end);
                    this.speed = 0;
                }
                Follow.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.distanceBetween = this.current.distance(this.end);
                        this.dir = this.end.minus(this.current).normalize();
                    }
                    var actorToFollowSpeed = Math.sqrt(Math.pow(this.actorToFollow.dx, 2) + Math.pow(this.actorToFollow.dy, 2));
                    if (actorToFollowSpeed != 0) {
                        this.speed = actorToFollowSpeed;
                    }
                    this.current.x = this.actor.x;
                    this.current.y = this.actor.y;
                    this.end.x = this.actorToFollow.x;
                    this.end.y = this.actorToFollow.y;
                    this.distanceBetween = this.current.distance(this.end);
                    this.dir = this.end.minus(this.current).normalize();
                    if (this.distanceBetween >= this.maximumDistance) {
                        var m = this.dir.scale(this.speed);
                        this.actor.dx = m.x;
                        this.actor.dy = m.y;
                    }
                    else {
                        this.actor.dx = 0;
                        this.actor.dy = 0;
                    }
                    if (this.isComplete(this.actor)) {
                        // TODO this should never occur
                        this.actor.x = this.end.x;
                        this.actor.y = this.end.y;
                        this.actor.dy = 0;
                        this.actor.dx = 0;
                    }
                };
                Follow.prototype.stop = function () {
                    this.actor.dy = 0;
                    this.actor.dx = 0;
                    this._stopped = true;
                };
                Follow.prototype.isComplete = function (actor) {
                    // the actor following should never stop unless specified to do so
                    return this._stopped;
                };
                Follow.prototype.reset = function () {
                    this._started = false;
                };
                return Follow;
            })();
            Actions.Follow = Follow;
            var Meet = (function () {
                function Meet(actor, actorToMeet, speed) {
                    this._started = false;
                    this._stopped = false;
                    this._speedWasSpecified = false;
                    this.actor = actor;
                    this.actorToMeet = actorToMeet;
                    this.current = new ex.Vector(this.actor.x, this.actor.y);
                    this.end = new ex.Vector(actorToMeet.x, actorToMeet.y);
                    this.speed = speed || 0;
                    if (speed != undefined) {
                        this._speedWasSpecified = true;
                    }
                }
                Meet.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.distanceBetween = this.current.distance(this.end);
                        this.dir = this.end.minus(this.current).normalize();
                    }
                    var actorToMeetSpeed = Math.sqrt(Math.pow(this.actorToMeet.dx, 2) + Math.pow(this.actorToMeet.dy, 2));
                    if ((actorToMeetSpeed != 0) && (!this._speedWasSpecified)) {
                        this.speed = actorToMeetSpeed;
                    }
                    this.current.x = this.actor.x;
                    this.current.y = this.actor.y;
                    this.end.x = this.actorToMeet.x;
                    this.end.y = this.actorToMeet.y;
                    this.distanceBetween = this.current.distance(this.end);
                    this.dir = this.end.minus(this.current).normalize();
                    var m = this.dir.scale(this.speed);
                    this.actor.dx = m.x;
                    this.actor.dy = m.y;
                    if (this.isComplete(this.actor)) {
                        // console.log("meeting is complete")
                        this.actor.x = this.end.x;
                        this.actor.y = this.end.y;
                        this.actor.dy = 0;
                        this.actor.dx = 0;
                    }
                };
                Meet.prototype.isComplete = function (actor) {
                    return this._stopped || (this.distanceBetween <= 1);
                };
                Meet.prototype.stop = function () {
                    this.actor.dy = 0;
                    this.actor.dx = 0;
                    this._stopped = true;
                };
                Meet.prototype.reset = function () {
                    this._started = false;
                };
                return Meet;
            })();
            Actions.Meet = Meet;
            var RotateTo = (function () {
                function RotateTo(actor, angleRadians, speed) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.end = angleRadians;
                    this.speed = speed;
                }
                RotateTo.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.start = this.actor.rotation;
                        this.distance = Math.abs(this.end - this.start);
                    }
                    this.actor.rx = this.speed;
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.rotation = this.end;
                        this.actor.rx = 0;
                    }
                };
                RotateTo.prototype.isComplete = function (actor) {
                    return this._stopped || (Math.abs(this.actor.rotation - this.start) >= this.distance);
                };
                RotateTo.prototype.stop = function () {
                    this.actor.rx = 0;
                    this._stopped = true;
                };
                RotateTo.prototype.reset = function () {
                    this._started = false;
                };
                return RotateTo;
            })();
            Actions.RotateTo = RotateTo;
            var RotateBy = (function () {
                function RotateBy(actor, angleRadians, time) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.end = angleRadians;
                    this.time = time;
                    this.speed = (this.end - this.actor.rotation) / time * 1000;
                }
                RotateBy.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.start = this.actor.rotation;
                        this.distance = Math.abs(this.end - this.start);
                    }
                    this.actor.rx = this.speed;
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.rotation = this.end;
                        this.actor.rx = 0;
                    }
                };
                RotateBy.prototype.isComplete = function (actor) {
                    return this._stopped || (Math.abs(this.actor.rotation - this.start) >= this.distance);
                };
                RotateBy.prototype.stop = function () {
                    this.actor.rx = 0;
                    this._stopped = true;
                };
                RotateBy.prototype.reset = function () {
                    this._started = false;
                };
                return RotateBy;
            })();
            Actions.RotateBy = RotateBy;
            var ScaleTo = (function () {
                function ScaleTo(actor, scaleX, scaleY, speedX, speedY) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.endX = scaleX;
                    this.endY = scaleY;
                    this.speedX = speedX;
                    this.speedY = speedY;
                }
                ScaleTo.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.startX = this.actor.scale.x;
                        this.startY = this.actor.scale.y;
                        this.distanceX = Math.abs(this.endX - this.startX);
                        this.distanceY = Math.abs(this.endY - this.startY);
                    }
                    if (!(Math.abs(this.actor.scale.x - this.startX) >= this.distanceX)) {
                        var directionX = this.endY < this.startY ? -1 : 1;
                        this.actor.sx = this.speedX * directionX;
                    }
                    else {
                        this.actor.sx = 0;
                    }
                    if (!(Math.abs(this.actor.scale.y - this.startY) >= this.distanceY)) {
                        var directionY = this.endY < this.startY ? -1 : 1;
                        this.actor.sy = this.speedY * directionY;
                    }
                    else {
                        this.actor.sy = 0;
                    }
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.scale.x = this.endX;
                        this.actor.scale.y = this.endY;
                        this.actor.sx = 0;
                        this.actor.sy = 0;
                    }
                };
                ScaleTo.prototype.isComplete = function (actor) {
                    return this._stopped || ((Math.abs(this.actor.scale.y - this.startX) >= this.distanceX) && (Math.abs(this.actor.scale.y - this.startY) >= this.distanceY));
                };
                ScaleTo.prototype.stop = function () {
                    this.actor.sx = 0;
                    this.actor.sy = 0;
                    this._stopped = true;
                };
                ScaleTo.prototype.reset = function () {
                    this._started = false;
                };
                return ScaleTo;
            })();
            Actions.ScaleTo = ScaleTo;
            var ScaleBy = (function () {
                function ScaleBy(actor, scaleX, scaleY, time) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.endX = scaleX;
                    this.endY = scaleY;
                    this.time = time;
                    this.speedX = (this.endX - this.actor.scale.x) / time * 1000;
                    this.speedY = (this.endY - this.actor.scale.y) / time * 1000;
                }
                ScaleBy.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                        this.startX = this.actor.scale.x;
                        this.startY = this.actor.scale.y;
                        this.distanceX = Math.abs(this.endX - this.startX);
                        this.distanceY = Math.abs(this.endY - this.startY);
                    }
                    var directionX = this.endX < this.startX ? -1 : 1;
                    var directionY = this.endY < this.startY ? -1 : 1;
                    this.actor.sx = this.speedX * directionX;
                    this.actor.sy = this.speedY * directionY;
                    //Logger.getInstance().log("Pos x: " + this.actor.x +"  y:" + this.actor.y, Log.DEBUG);
                    if (this.isComplete(this.actor)) {
                        this.actor.scale.x = this.endX;
                        this.actor.scale.y = this.endY;
                        this.actor.sx = 0;
                        this.actor.sy = 0;
                    }
                };
                ScaleBy.prototype.isComplete = function (actor) {
                    return this._stopped || ((Math.abs(this.actor.scale.x - this.startX) >= this.distanceX) && (Math.abs(this.actor.scale.y - this.startY) >= this.distanceY));
                };
                ScaleBy.prototype.stop = function () {
                    this.actor.sx = 0;
                    this.actor.sy = 0;
                    this._stopped = true;
                };
                ScaleBy.prototype.reset = function () {
                    this._started = false;
                };
                return ScaleBy;
            })();
            Actions.ScaleBy = ScaleBy;
            var Delay = (function () {
                function Delay(actor, delay) {
                    this.elapsedTime = 0;
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.delay = delay;
                }
                Delay.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                    }
                    this.x = this.actor.x;
                    this.y = this.actor.y;
                    this.elapsedTime += delta;
                };
                Delay.prototype.isComplete = function (actor) {
                    return this._stopped || (this.elapsedTime >= this.delay);
                };
                Delay.prototype.stop = function () {
                    this._stopped = true;
                };
                Delay.prototype.reset = function () {
                    this.elapsedTime = 0;
                    this._started = false;
                };
                return Delay;
            })();
            Actions.Delay = Delay;
            var Blink = (function () {
                function Blink(actor, timeVisible, timeNotVisible, numBlinks) {
                    if (numBlinks === void 0) { numBlinks = 1; }
                    this.timeVisible = 0;
                    this.timeNotVisible = 0;
                    this.elapsedTime = 0;
                    this.totalTime = 0;
                    this._stopped = false;
                    this._started = false;
                    this.actor = actor;
                    this.timeVisible = timeVisible;
                    this.timeNotVisible = timeNotVisible;
                    this.duration = (timeVisible + timeNotVisible) * numBlinks;
                }
                Blink.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                    }
                    this.elapsedTime += delta;
                    this.totalTime += delta;
                    if (this.actor.visible && this.elapsedTime >= this.timeVisible) {
                        this.actor.visible = false;
                        this.elapsedTime = 0;
                    }
                    if (!this.actor.visible && this.elapsedTime >= this.timeNotVisible) {
                        this.actor.visible = true;
                        this.elapsedTime = 0;
                    }
                    if (this.isComplete(this.actor)) {
                        this.actor.visible = true;
                    }
                };
                Blink.prototype.isComplete = function (actor) {
                    return this._stopped || (this.totalTime >= this.duration);
                };
                Blink.prototype.stop = function () {
                    this.actor.visible = true;
                    this._stopped = true;
                };
                Blink.prototype.reset = function () {
                    this._started = false;
                    this.elapsedTime = 0;
                    this.totalTime = 0;
                };
                return Blink;
            })();
            Actions.Blink = Blink;
            var Fade = (function () {
                function Fade(actor, endOpacity, speed) {
                    this.multiplyer = 1;
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                    this.endOpacity = endOpacity;
                    this.speed = speed;
                    if (endOpacity < actor.opacity) {
                        this.multiplyer = -1;
                    }
                }
                Fade.prototype.update = function (delta) {
                    if (!this._started) {
                        this._started = true;
                    }
                    if (this.speed > 0) {
                        this.actor.opacity += this.multiplyer * (Math.abs(this.actor.opacity - this.endOpacity) * delta) / this.speed;
                    }
                    this.speed -= delta;
                    ex.Logger.getInstance().debug("actor opacity: " + this.actor.opacity);
                    if (this.isComplete(this.actor)) {
                        this.actor.opacity = this.endOpacity;
                    }
                };
                Fade.prototype.isComplete = function (actor) {
                    return this._stopped || (Math.abs(this.actor.opacity - this.endOpacity) < 0.05);
                };
                Fade.prototype.stop = function () {
                    this._stopped = true;
                };
                Fade.prototype.reset = function () {
                    this._started = false;
                };
                return Fade;
            })();
            Actions.Fade = Fade;
            var Die = (function () {
                function Die(actor) {
                    this._started = false;
                    this._stopped = false;
                    this.actor = actor;
                }
                Die.prototype.update = function (delta) {
                    this.actor.actionQueue.clearActions();
                    this.actor.kill();
                    this._stopped = true;
                };
                Die.prototype.isComplete = function () {
                    return this._stopped;
                };
                Die.prototype.stop = function () {
                };
                Die.prototype.reset = function () {
                };
                return Die;
            })();
            Actions.Die = Die;
            var CallMethod = (function () {
                function CallMethod(actor, method) {
                    this._method = null;
                    this._actor = null;
                    this._hasBeenCalled = false;
                    this._actor = actor;
                    this._method = method;
                }
                CallMethod.prototype.update = function (delta) {
                    this._method.call(this._actor);
                    this._hasBeenCalled = true;
                };
                CallMethod.prototype.isComplete = function (actor) {
                    return this._hasBeenCalled;
                };
                CallMethod.prototype.reset = function () {
                    this._hasBeenCalled = false;
                };
                CallMethod.prototype.stop = function () {
                    this._hasBeenCalled = true;
                };
                return CallMethod;
            })();
            Actions.CallMethod = CallMethod;
            var Repeat = (function () {
                function Repeat(actor, repeat, actions) {
                    var _this = this;
                    this._stopped = false;
                    this.actor = actor;
                    this.actionQueue = new ActionQueue(actor);
                    this.repeat = repeat;
                    this.originalRepeat = repeat;
                    actions.forEach(function (action) {
                        action.reset();
                        _this.actionQueue.add(action);
                    });
                }
                Repeat.prototype.update = function (delta) {
                    this.x = this.actor.x;
                    this.y = this.actor.y;
                    if (!this.actionQueue.hasNext()) {
                        this.actionQueue.reset();
                        this.repeat--;
                    }
                    this.actionQueue.update(delta);
                };
                Repeat.prototype.isComplete = function () {
                    return this._stopped || (this.repeat <= 0);
                };
                Repeat.prototype.stop = function () {
                    this._stopped = true;
                };
                Repeat.prototype.reset = function () {
                    this.repeat = this.originalRepeat;
                };
                return Repeat;
            })();
            Actions.Repeat = Repeat;
            var RepeatForever = (function () {
                function RepeatForever(actor, actions) {
                    var _this = this;
                    this._stopped = false;
                    this.actor = actor;
                    this.actionQueue = new ActionQueue(actor);
                    actions.forEach(function (action) {
                        action.reset();
                        _this.actionQueue.add(action);
                    });
                }
                RepeatForever.prototype.update = function (delta) {
                    this.x = this.actor.x;
                    this.y = this.actor.y;
                    if (this._stopped) {
                        return;
                    }
                    if (!this.actionQueue.hasNext()) {
                        this.actionQueue.reset();
                    }
                    this.actionQueue.update(delta);
                };
                RepeatForever.prototype.isComplete = function () {
                    return this._stopped;
                };
                RepeatForever.prototype.stop = function () {
                    this._stopped = true;
                    this.actionQueue.clearActions();
                };
                RepeatForever.prototype.reset = function () {
                };
                return RepeatForever;
            })();
            Actions.RepeatForever = RepeatForever;
            var ActionQueue = (function () {
                function ActionQueue(actor) {
                    this._actions = [];
                    this._completedActions = [];
                    this.actor = actor;
                }
                ActionQueue.prototype.add = function (action) {
                    this._actions.push(action);
                };
                ActionQueue.prototype.remove = function (action) {
                    var index = this._actions.indexOf(action);
                    this._actions.splice(index, 1);
                };
                ActionQueue.prototype.clearActions = function () {
                    this._actions.length = 0;
                    this._completedActions.length = 0;
                    this._currentAction.stop();
                };
                ActionQueue.prototype.getActions = function () {
                    return this._actions.concat(this._completedActions);
                };
                ActionQueue.prototype.hasNext = function () {
                    return this._actions.length > 0;
                };
                ActionQueue.prototype.reset = function () {
                    this._actions = this.getActions();
                    this._actions.forEach(function (action) {
                        action.reset();
                    });
                    this._completedActions = [];
                };
                ActionQueue.prototype.update = function (delta) {
                    if (this._actions.length > 0) {
                        this._currentAction = this._actions[0];
                        this._currentAction.update(delta);
                        if (this._currentAction.isComplete(this.actor)) {
                            //Logger.getInstance().log("Action complete!", Log.DEBUG);
                            this._completedActions.push(this._actions.shift());
                        }
                    }
                };
                return ActionQueue;
            })();
            Actions.ActionQueue = ActionQueue;
        })(Actions = Internal.Actions || (Internal.Actions = {}));
    })(Internal = ex.Internal || (ex.Internal = {}));
})(ex || (ex = {}));
var ex;
(function (ex) {
    var EasingFunctions = (function () {
        function EasingFunctions() {
        }
        /*
       easeInQuad: function (t) { return t * t },
       // decelerating to zero velocity
       easeOutQuad: function (t) { return t * (2 - t) },
       // acceleration until halfway, then deceleration
       easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
       // accelerating from zero velocity
       easeInCubic: function (t) { return t * t * t },
       // decelerating to zero velocity
       easeOutCubic: function (t) { return (--t) * t * t + 1 },
       // acceleration until halfway, then deceleration
       easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
       // accelerating from zero velocity
       easeInQuart: function (t) { return t * t * t * t },
       // decelerating to zero velocity
       easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
       // acceleration until halfway, then deceleration
       easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
       // accelerating from zero velocity
       easeInQuint: function (t) { return t * t * t * t * t },
       // decelerating to zero velocity
       easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
       // acceleration until halfway, then deceleration
       easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
        */
        EasingFunctions.Linear = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            return endValue * currentTime / duration + startValue;
        };
        EasingFunctions.EaseInQuad = function (currentTime, startValue, endValue, duration) {
            //endValue = (endValue - startValue);
            currentTime /= duration;
            return endValue * currentTime * currentTime + startValue;
        };
        EasingFunctions.EaseOutQuad = function (currentTime, startValue, endValue, duration) {
            //endValue = (endValue - startValue);
            currentTime /= duration;
            return -endValue * currentTime * (currentTime - 2) + startValue;
        };
        EasingFunctions.EaseInOutQuad = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            currentTime /= duration / 2;
            if (currentTime < 1)
                return endValue / 2 * currentTime * currentTime + startValue;
            currentTime--;
            return -endValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
        };
        EasingFunctions.EaseInCubic = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            currentTime /= duration;
            return endValue * currentTime * currentTime * currentTime + startValue;
        };
        EasingFunctions.EaseOutCubic = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            currentTime /= duration;
            return endValue * (currentTime * currentTime * currentTime + 1) + startValue;
        };
        EasingFunctions.EaseInOutCubic = function (currentTime, startValue, endValue, duration) {
            endValue = (endValue - startValue);
            currentTime /= duration / 2;
            if (currentTime < 1)
                return endValue / 2 * currentTime * currentTime * currentTime + startValue;
            currentTime -= 2;
            return endValue / 2 * (currentTime * currentTime * currentTime + 2) + startValue;
        };
        return EasingFunctions;
    })();
    ex.EasingFunctions = EasingFunctions;
})(ex || (ex = {}));
/// <reference path="Interfaces/IDrawable.ts" />
/// <reference path="Modules/MovementModule.ts" />
/// <reference path="Modules/OffscreenCullingModule.ts" />
/// <reference path="Modules/CapturePointerModule.ts" />
/// <reference path="Modules/CollisionDetectionModule.ts" />
/// <reference path="Collision/Side.ts" />
/// <reference path="Algebra.ts" />
/// <reference path="Util.ts" />
/// <reference path="TileMap.ts" />
/// <reference path="Collision/BoundingBox.ts" />
/// <reference path="Scene.ts" />
/// <reference path="Action.ts" />
/// <reference path="EasingFunctions.ts"/>
var ex;
(function (ex) {
    /**
     * An enum that describes the types of collisions actors can participate in
     * @class CollisionType
     */
    (function (CollisionType) {
        /**
         * Actors with the PreventCollision setting do not participate in any
         * collisions and do not raise collision events.
         * @property PreventCollision {CollisionType}
         * @static
         */
        CollisionType[CollisionType["PreventCollision"] = 0] = "PreventCollision";
        /**
         * Actors with the Passive setting only raise collision events, but are not
         * influenced or moved by other actors and do not influence or move other actors.
         * @property Passive {CollisionType}
         * @static
         */
        CollisionType[CollisionType["Passive"] = 1] = "Passive";
        /**
         * Actors with the Active setting raise collision events and participate
         * in collisions with other actors and will be push or moved by actors sharing
         * the Active or Fixed setting.
         * @property Active {CollisionType}
         * @static
         */
        CollisionType[CollisionType["Active"] = 2] = "Active";
        /**
         * Actors with the Elastic setting will behave the same as Active, except that they will
         * "bounce" in the opposite direction given their velocity dx/dy. This is a naive implementation meant for
         * prototyping, for a more robust elastic collision listen to the "collision" event and perform your custom logic.
         * @property Elastic {CollisionType}
         * @static
         */
        CollisionType[CollisionType["Elastic"] = 3] = "Elastic";
        /**
         * Actors with the Fixed setting raise collision events and participate in
         * collisions with other actors. Actors with the Fixed setting will not be
         * pushed or moved by other actors sharing the Fixed or Actors. Think of Fixed
         * actors as "immovable/onstoppable" objects. If two Fixed actors meet they will
         * not be pushed or moved by each other, they will not interact except to throw
         * collision events.
         * @property Fixed {CollisionType}
         * @static
         */
        CollisionType[CollisionType["Fixed"] = 4] = "Fixed";
    })(ex.CollisionType || (ex.CollisionType = {}));
    var CollisionType = ex.CollisionType;
    /**
     * The most important primitive in Excalibur is an "Actor." Anything that
     * can move on the screen, collide with another Actor, respond to events,
     * or interact with the current scene, must be an actor. An Actor <b>must</b>
     * be part of a {{#crossLink "Scene"}}{{/crossLink}} for it to be drawn to the screen.
     * @class Actor
     * @extends Class
     * @constructor
     * @param [x=0.0] {number} The starting x coordinate of the actor
     * @param [y=0.0] {number} The starting y coordinate of the actor
     * @param [width=0.0] {number} The starting width of the actor
     * @param [height=0.0] {number} The starting height of the actor
     * @param [color=undefined] {Color} The starting color of the actor
     */
    var Actor = (function (_super) {
        __extends(Actor, _super);
        function Actor(x, y, width, height, color) {
            _super.call(this);
            /**
             * The unique identifier for the actor
             */
            this.id = Actor.maxId++;
            /**
             * The x coordinate of the actor (left edge)
             * @property x {number}
             */
            this.x = 0;
            /**
             * The y coordinate of the actor (top edge)
             * @property y {number}
             */
            this.y = 0;
            this.height = 0;
            this.width = 0;
            /**
             * The rotation of the actor in radians
             * @property rotation {number}
             */
            this.rotation = 0; // radians
            /**
             * The rotational velocity of the actor in radians/second
             * @property rx {number}
             */
            this.rx = 0; //radions/sec
            /**
             * The scale vector of the actor
             * @property scale
             */
            this.scale = new ex.Vector(1, 1);
            /**
             * The x scalar velocity of the actor in scale/second
             * @property sx {number}
             */
            this.sx = 0; //scale/sec
            /**
             * The y scalar velocity of the actor in scale/second
             * @property sy {number}
             */
            this.sy = 0; //scale/sec
            /**
             * The x velocity of the actor in pixels/second
             * @property dx {number}
             */
            this.dx = 0; // pixels/sec
            /**
             * The x velocity of the actor in pixels/second
             * @property dx {number}
             */
            this.dy = 0;
            /**
             * The x acceleration of the actor in pixels/second^2
             * @property ax {number}
             */
            this.ax = 0; // pixels/sec/sec
            /**
             * The y acceleration of the actor in pixels/second^2
             * @property ay {number}
             */
            this.ay = 0;
            /**
             * Indicates wether the actor is physically in the viewport
             * @property isOffScreen {boolean}
             */
            this.isOffScreen = false;
            /**
             * The visibility of an actor
             * @property visible {boolean}
             */
            this.visible = true;
            /**
             * The opacity of an actor
             * @property opacity {number}
             */
            this.opacity = 1;
            this.previousOpacity = 1;
            /**
             * Convenience reference to the global logger
             * @property logger {Logger}
             */
            this.logger = ex.Logger.getInstance();
            /**
            * The scene that the actor is in
            * @property scene {Scene}
            */
            this.scene = null; //formerly "parent"
            /**
            * The parent of this actor
            * @property parent {Actor}
            */
            this.parent = null;
            /**
             * Gets or sets the current collision type of this actor. By
             * default all actors participate in Active collisions.
             * @property collisionType {CollisionType}
             */
            this.collisionType = 0 /* PreventCollision */;
            this.collisionGroups = [];
            this._collisionHandlers = {};
            this._isInitialized = false;
            this.frames = {};
            /**
             * Access to the current drawing on for the actor, this can be an {{#crossLink "Animation"}}{{/crossLink}},
             * {{#crossLink "Sprite"}}{{/crossLink}}, or {{#crossLink "Polygon"}}{{/crossLink}}.
             * Set drawings with the {{#crossLink "Actor/setDrawing:method"}}{{/crossLink}}.
             * @property currentDrawing {IDrawable}
             */
            this.currentDrawing = null;
            this.centerDrawingX = false;
            this.centerDrawingY = false;
            /**
             * Modify the current actor update pipeline.
             *
             *
             */
            this.pipeline = [];
            /**
             * Whether or not to enable the CapturePointer trait that propogates pointer events to this actor
             * @property [enableCapturePointer=false] {boolean}
             */
            this.enableCapturePointer = false;
            /**
             * Configuration for CapturePointer trait
             * @property capturePointer {ICapturePointerConfig}
             */
            this.capturePointer = {
                captureMoveEvents: false
            };
            this._isKilled = false;
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
            if (color) {
                this.color = color.clone();
                // set default opacity of an actor to the color
                this.opacity = color.a;
            }
            // Build default pipeline
            this.pipeline.push(new ex.MovementModule());
            //this.pipeline.push(new ex.CollisionDetectionModule());
            this.pipeline.push(new ex.OffscreenCullingModule());
            this.pipeline.push(new ex.CapturePointerModule());
            this.actionQueue = new ex.Internal.Actions.ActionQueue(this);
            this.sceneNode = new ex.Scene();
            this.sceneNode.actor = this;
            this.anchor = new ex.Point(.5, .5);
        }
        /**
         * This is called before the first update of the actor. This method is meant to be
         * overridden. This is where initialization of child actors should take place.
         * @method onInitialize
         * @param engine {Engine}
         */
        Actor.prototype.onInitialize = function (engine) {
        };
        Actor.prototype._checkForPointerOptIn = function (eventName) {
            if (eventName && (eventName.toLowerCase() === 'pointerdown' || eventName.toLowerCase() === 'pointerdown' || eventName.toLowerCase() === 'pointermove')) {
                this.enableCapturePointer = true;
                if (eventName.toLowerCase() === 'pointermove') {
                    this.capturePointer.captureMoveEvents = true;
                }
            }
        };
        /**
        * Add an event listener. You can listen for a variety of
        * events off of the engine; see the events section below for a complete list.
        * @method addEventListener
        * @param eventName {string} Name of the event to listen for
        * @param handler {event=>void} Event handler for the thrown event
        */
        Actor.prototype.addEventListener = function (eventName, handler) {
            this._checkForPointerOptIn(eventName);
            _super.prototype.addEventListener.call(this, eventName, handler);
        };
        /**
         * Alias for "addEventListener". You can listen for a variety of
         * events off of the engine; see the events section below for a complete list.
         * @method on
         * @param eventName {string} Name of the event to listen for
         * @param handler {event=>void} Event handler for the thrown event
         */
        Actor.prototype.on = function (eventName, handler) {
            this._checkForPointerOptIn(eventName);
            this.eventDispatcher.subscribe(eventName, handler);
        };
        /**
         * If the current actors is a member of the scene. This will remove
         * it from the scene graph. It will no longer be drawn or updated.
         * @method kill
         */
        Actor.prototype.kill = function () {
            if (this.scene) {
                this.scene.removeChild(this);
                this._isKilled = true;
            }
            else {
                this.logger.warn("Cannot kill actor, it was never added to the Scene");
            }
        };
        /**
         * Indicates wether the actor has been killed.
         * @method isKilled
         * @returns boolean
         */
        Actor.prototype.isKilled = function () {
            return this._isKilled;
        };
        /**
         * Adds a child actor to this actor. All movement of the child actor will be
         * relative to the parent actor. Meaning if the parent moves the child will
         * move with
         * @method addChild
         * @param actor {Actor} The child actor to add
         */
        Actor.prototype.addChild = function (actor) {
            actor.collisionType = 0 /* PreventCollision */;
            this.sceneNode.addChild(actor);
        };
        /**
         * Removes a child actor from this actor.
         * @method removeChild
         * @param actor {Actor} The child actor to remove
         */
        Actor.prototype.removeChild = function (actor) {
            this.sceneNode.removeChild(actor);
        };
        /**
         * Sets the current drawing of the actor to the drawing correspoding to
         * the key.
         * @method setDrawing
         * @param key {string} The key of the drawing
         */
        Actor.prototype.setDrawing = function (key) {
            if (this.currentDrawing != this.frames[key]) {
                this.frames[key].reset();
            }
            this.currentDrawing = this.frames[key];
        };
        Actor.prototype.addDrawing = function (args) {
            if (arguments.length === 2) {
                this.frames[arguments[0]] = arguments[1];
                if (!this.currentDrawing) {
                    this.currentDrawing = arguments[1];
                }
            }
            else {
                if (arguments[0] instanceof ex.Sprite) {
                    this.addDrawing("default", arguments[0]);
                }
                if (arguments[0] instanceof ex.Texture) {
                    this.addDrawing("default", arguments[0].asSprite());
                }
            }
        };
        /**
         * Artificially trigger an event on an actor, useful when creating custom events.
         * @method triggerEvent
         * @param eventName {string} The name of the event to trigger
         * @param [event=undefined] {GameEvent} The event object to pass to the callback
         */
        Actor.prototype.triggerEvent = function (eventName, event) {
            this.eventDispatcher.publish(eventName, event);
        };
        /**
         * Adds an actor to a collision group. Actors with no named collision group are
         * considered to be in every collision group.
         *
         * Once in a collision group(s) actors will only collide with other actors in
         * that group.
         *
         * @method addCollisionGroup
         * @param name {string} The name of the collision group
         */
        Actor.prototype.addCollisionGroup = function (name) {
            this.collisionGroups.push(name);
        };
        /**
         * Remove an actor from a collision group.
         * @method removeCollisionGroup
         * @param name {string} The name of the collision group
         */
        Actor.prototype.removeCollisionGroup = function (name) {
            var index = this.collisionGroups.indexOf(name);
            if (index !== -1) {
                this.collisionGroups.splice(index, 1);
            }
        };
        /**
         * Get the center point of an actor
         * @method getCenter
         * @returns Vector
         */
        Actor.prototype.getCenter = function () {
            var anchor = this._getCalculatedAnchor();
            return new ex.Vector(this.x + this.getWidth() / 2, this.y + this.getHeight() / 2);
        };
        /**
         * Gets the calculated width of an actor
         * @method getWidth
         * @returns number
         */
        Actor.prototype.getWidth = function () {
            return this.width * this.scale.x;
        };
        /**
         * Sets the width of an actor, factoring in the current scale
         * @method setWidth
         */
        Actor.prototype.setWidth = function (width) {
            this.width = width / this.scale.x;
        };
        /**
         * Gets the calculated height of an actor
         * @method getHeight
         * @returns number
         */
        Actor.prototype.getHeight = function () {
            return this.height * this.scale.y;
        };
        /**
         * Sets the height of an actor, factoring in the current scale
         * @method setHeight
         */
        Actor.prototype.setHeight = function (height) {
            this.height = height / this.scale.y;
        };
        /**
         * Centers the actor's drawing around the center of the actor's bounding box
         * @method setCenterDrawing
         * @param center {boolean} Indicates to center the drawing around the actor
         */
        Actor.prototype.setCenterDrawing = function (center) {
            this.centerDrawingY = center;
            this.centerDrawingX = center;
        };
        /**
         * Gets the left edge of the actor
         * @method getLeft
         * @returns number
         */
        Actor.prototype.getLeft = function () {
            return this.x;
        };
        /**
         * Gets the right edge of the actor
         * @method getRight
         * @returns number
         */
        Actor.prototype.getRight = function () {
            return this.x + this.getWidth();
        };
        /**
         * Gets the top edge of the actor
         * @method getTop
         * @returns number
         */
        Actor.prototype.getTop = function () {
            return this.y;
        };
        /**
         * Gets the bottom edge of the actor
         * @method getBottom
         * @returns number
         */
        Actor.prototype.getBottom = function () {
            return this.y + this.getHeight();
        };
        /**
        * Gets the x value of the Actor in global coordinates
        * @method getGlobalX
        * @returns number
        */
        Actor.prototype.getGlobalX = function () {
            if (!this.parent)
                return this.x;
            return this.x * this.parent.scale.y + this.parent.getGlobalX();
        };
        /**
        * Gets the y value of the Actor in global coordinates
        * @method getGlobalY
        * @returns number
        */
        Actor.prototype.getGlobalY = function () {
            if (!this.parent)
                return this.y;
            return this.y * this.parent.scale.y + this.parent.getGlobalY();
        };
        /**
         * Gets the global scale of the Actor
         * @method getGlobalScale
         * @returns Point
         */
        Actor.prototype.getGlobalScale = function () {
            if (!this.parent)
                return new ex.Point(this.scale.x, this.scale.y);
            var parentScale = this.parent.getGlobalScale();
            return new ex.Point(this.scale.x * parentScale.x, this.scale.y * parentScale.y);
        };
        /**
         * Returns the actor's bounding box calculated for this instant.
         * @method getBounds
         * @returns BoundingBox
         */
        Actor.prototype.getBounds = function () {
            var anchor = this._getCalculatedAnchor();
            return new ex.BoundingBox(this.getGlobalX() - anchor.x, this.getGlobalY() - anchor.y, this.getGlobalX() + this.getWidth() - anchor.x, this.getGlobalY() + this.getHeight() - anchor.y);
        };
        /**
         * Tests whether the x/y specified are contained in the actor
         * @method contains
         * @param x {number} X coordinate to test (in world coordinates)
         * @param y {number} Y coordinate to test (in world coordinates)
         */
        Actor.prototype.contains = function (x, y) {
            return this.getBounds().contains(new ex.Point(x, y));
        };
        /**
         * Returns the side of the collision based on the intersection
         * @method getSideFromIntersect
         * @param intersect {Vector} The displacement vector returned by a collision
         * @returns Side
        */
        Actor.prototype.getSideFromIntersect = function (intersect) {
            if (intersect) {
                if (Math.abs(intersect.x) > Math.abs(intersect.y)) {
                    if (intersect.x < 0) {
                        return 4 /* Right */;
                    }
                    return 3 /* Left */;
                }
                else {
                    if (intersect.y < 0) {
                        return 2 /* Bottom */;
                    }
                    return 1 /* Top */;
                }
            }
            return 0 /* None */;
        };
        /**
         * Test whether the actor has collided with another actor, returns the side of the current actor that collided.
         * @method collides
         * @param actor {Actor} The other actor to test
         * @returns Side
         */
        Actor.prototype.collidesWithSide = function (actor) {
            var separationVector = this.collides(actor);
            if (!separationVector) {
                return 0 /* None */;
            }
            if (Math.abs(separationVector.x) > Math.abs(separationVector.y)) {
                if (this.x < actor.x) {
                    return 4 /* Right */;
                }
                else {
                    return 3 /* Left */;
                }
            }
            else {
                if (this.y < actor.y) {
                    return 2 /* Bottom */;
                }
                else {
                    return 1 /* Top */;
                }
            }
            return 0 /* None */;
        };
        /**
         * Test whether the actor has collided with another actor, returns the intersection vector on collision. Returns
         * null when there is no collision;
         * @method collides
         * @param actor {Actor} The other actor to test
         * @returns Vector
         */
        Actor.prototype.collides = function (actor) {
            var bounds = this.getBounds();
            var otherBounds = actor.getBounds();
            var intersect = bounds.collides(otherBounds);
            return intersect;
        };
        /**
         * Register a handler to fire when this actor collides with another in a specified group
         * @method onCollidesWith
         * @param group {string} The group name to listen for
         * @param func {callback} The callback to fire on collision with another actor from the group. The callback is passed the other actor.
         */
        Actor.prototype.onCollidesWith = function (group, func) {
            if (!this._collisionHandlers[group]) {
                this._collisionHandlers[group] = [];
            }
            this._collisionHandlers[group].push(func);
        };
        Actor.prototype.getCollisionHandlers = function () {
            return this._collisionHandlers;
        };
        /**
         * Removes all collision handlers for this group on this actor
         * @method removeCollidesWith
         * @param group {string} Group to remove all handlers for on this actor.
         */
        Actor.prototype.removeCollidesWith = function (group) {
            this._collisionHandlers[group] = [];
        };
        /**
         * Returns true if the two actors are less than or equal to the distance specified from each other
         * @method within
         * @param actor {Actor} Actor to test
         * @param distance {number} Distance in pixels to test
         * @returns boolean
         */
        Actor.prototype.within = function (actor, distance) {
            return Math.sqrt(Math.pow(this.x - actor.x, 2) + Math.pow(this.y - actor.y, 2)) <= distance;
        };
        /**
         * Clears all queued actions from the Actor
         * @method clearActions
         */
        Actor.prototype.clearActions = function () {
            this.actionQueue.clearActions();
        };
        Actor.prototype.easeTo = function (x, y, duration, easingFcn) {
            if (easingFcn === void 0) { easingFcn = ex.EasingFunctions.Linear; }
            this.actionQueue.add(new ex.Internal.Actions.EaseTo(this, x, y, duration, easingFcn));
            return this;
        };
        /**
         * This method will move an actor to the specified x and y position at the
         * speed specified (in pixels per second) and return back the actor. This
         * method is part of the actor 'Action' fluent API allowing action chaining.
         * @method moveTo
         * @param x {number} The x location to move the actor to
         * @param y {number} The y location to move the actor to
         * @param speed {number} The speed in pixels per second to move
         * @returns Actor
         */
        Actor.prototype.moveTo = function (x, y, speed) {
            this.actionQueue.add(new ex.Internal.Actions.MoveTo(this, x, y, speed));
            return this;
        };
        /**
         * This method will move an actor to the specified x and y position by a
         * certain time (in milliseconds). This method is part of the actor
         * 'Action' fluent API allowing action chaining.
         * @method moveBy
         * @param x {number} The x location to move the actor to
         * @param y {number} The y location to move the actor to
         * @param time {number} The time it should take the actor to move to the new location in milliseconds
         * @returns Actor
         */
        Actor.prototype.moveBy = function (x, y, time) {
            this.actionQueue.add(new ex.Internal.Actions.MoveBy(this, x, y, time));
            return this;
        };
        /**
         * This method will rotate an actor to the specified angle at the speed
         * specified (in radians per second) and return back the actor. This
         * method is part of the actor 'Action' fluent API allowing action chaining.
         * @method rotateTo
         * @param angleRadians {number} The angle to rotate to in radians
         * @param speed {number} The angular velocity of the rotation specified in radians per second
         * @returns Actor
         */
        Actor.prototype.rotateTo = function (angleRadians, speed) {
            this.actionQueue.add(new ex.Internal.Actions.RotateTo(this, angleRadians, speed));
            return this;
        };
        /**
         * This method will rotate an actor to the specified angle by a certain
         * time (in milliseconds) and return back the actor. This method is part
         * of the actor 'Action' fluent API allowing action chaining.
         * @method rotateBy
         * @param angleRadians {number} The angle to rotate to in radians
         * @param time {number} The time it should take the actor to complete the rotation in milliseconds
         * @returns Actor
         */
        Actor.prototype.rotateBy = function (angleRadians, time) {
            this.actionQueue.add(new ex.Internal.Actions.RotateBy(this, angleRadians, time));
            return this;
        };
        /**
         * This method will scale an actor to the specified size at the speed
         * specified (in magnitude increase per second) and return back the
         * actor. This method is part of the actor 'Action' fluent API allowing
         * action chaining.
         * @method scaleTo
         * @param size {number} The scaling factor to apply
         * @param speed {number} The speed of scaling specified in magnitude increase per second
         * @returns Actor
         */
        Actor.prototype.scaleTo = function (sizeX, sizeY, speedX, speedY) {
            this.actionQueue.add(new ex.Internal.Actions.ScaleTo(this, sizeX, sizeY, speedX, speedY));
            return this;
        };
        /**
         * This method will scale an actor to the specified size by a certain time
         * (in milliseconds) and return back the actor. This method is part of the
         * actor 'Action' fluent API allowing action chaining.
         * @method scaleBy
         * @param size {number} The scaling factor to apply
         * @param time {number} The time it should take to complete the scaling in milliseconds
         * @returns Actor
         */
        Actor.prototype.scaleBy = function (sizeX, sizeY, time) {
            this.actionQueue.add(new ex.Internal.Actions.ScaleBy(this, sizeX, sizeY, time));
            return this;
        };
        /**
         * This method will cause an actor to blink (become visible and not
         * visible). Optionally, you may specify the number of blinks. Specify the amount of time
         * the actor should be visible per blink, and the amount of time not visible.
         * This method is part of the actor 'Action' fluent API allowing action chaining.
         * @method blink
         * @param timeVisible {number} The amount of time to stay visible per blink in milliseconds
         * @param timeNotVisible {number} The amount of time to stay not visible per blink in milliseconds
         * @param [numBlinks] {number} The number of times to blink
         * @returns Actor
         */
        Actor.prototype.blink = function (timeVisible, timeNotVisible, numBlinks) {
            if (numBlinks === void 0) { numBlinks = 1; }
            this.actionQueue.add(new ex.Internal.Actions.Blink(this, timeVisible, timeNotVisible, numBlinks));
            return this;
        };
        /**
         * This method will cause an actor's opacity to change from its current value
         * to the provided value by a specified time (in milliseconds). This method is
         * part of the actor 'Action' fluent API allowing action chaining.
         * @method fade
         * @param opacity {number} The ending opacity
         * @param time {number} The time it should take to fade the actor (in milliseconds)
         * @returns Actor
         */
        Actor.prototype.fade = function (opacity, time) {
            this.actionQueue.add(new ex.Internal.Actions.Fade(this, opacity, time));
            return this;
        };
        /**
         * This method will delay the next action from executing for a certain
         * amount of time (in milliseconds). This method is part of the actor
         * 'Action' fluent API allowing action chaining.
         * @method delay
         * @param time {number} The amount of time to delay the next action in the queue from executing in milliseconds
         * @returns Actor
         */
        Actor.prototype.delay = function (time) {
            this.actionQueue.add(new ex.Internal.Actions.Delay(this, time));
            return this;
        };
        /**
         * This method will add an action to the queue that will remove the actor from the
         * scene once it has completed its previous actions. Any actions on the
         * action queue after this action will not be executed.
         * @method die
         * @returns Actor
         */
        Actor.prototype.die = function () {
            this.actionQueue.add(new ex.Internal.Actions.Die(this));
            return this;
        };
        /**
         * This method allows you to call an arbitrary method as the next action in the
         * action queue. This is useful if you want to execute code in after a specific
         * action, i.e An actor arrives at a destinatino after traversing a path
         * @method callMethod
         * @returns Actor
         */
        Actor.prototype.callMethod = function (method) {
            this.actionQueue.add(new ex.Internal.Actions.CallMethod(this, method));
            return this;
        };
        /**
         * This method will cause the actor to repeat all of the previously
         * called actions a certain number of times. If the number of repeats
         * is not specified it will repeat forever. This method is part of
         * the actor 'Action' fluent API allowing action chaining
         * @method repeat
         * @param [times=undefined] {number} The number of times to repeat all the previous actions in the action queue. If nothing is specified the actions will repeat forever
         * @returns Actor
         */
        Actor.prototype.repeat = function (times) {
            if (!times) {
                this.repeatForever();
                return this;
            }
            this.actionQueue.add(new ex.Internal.Actions.Repeat(this, times, this.actionQueue.getActions()));
            return this;
        };
        /**
         * This method will cause the actor to repeat all of the previously
         * called actions forever. This method is part of the actor 'Action'
         * fluent API allowing action chaining.
         * @method repeatForever
         * @returns Actor
         */
        Actor.prototype.repeatForever = function () {
            this.actionQueue.add(new ex.Internal.Actions.RepeatForever(this, this.actionQueue.getActions()));
            return this;
        };
        /**
         * This method will cause the actor to follow another at a specified distance
         * @method follow
         * @param actor {Actor} The actor to follow
         * @param [followDistance=currentDistance] {number} The distance to maintain when following, if not specified the actor will follow at the current distance.
         * @returns Actor
         */
        Actor.prototype.follow = function (actor, followDistance) {
            if (followDistance == undefined) {
                this.actionQueue.add(new ex.Internal.Actions.Follow(this, actor));
            }
            else {
                this.actionQueue.add(new ex.Internal.Actions.Follow(this, actor, followDistance));
            }
            return this;
        };
        /**
         * This method will cause the actor to move towards another until they
         * collide "meet" at a specified speed.
         * @method meet
         * @param actor {Actor} The actor to meet
         * @param [speed=0] {number} The speed in pixels per second to move, if not specified it will match the speed of the other actor
         * @returns Actor
         */
        Actor.prototype.meet = function (actor, speed) {
            if (speed == undefined) {
                this.actionQueue.add(new ex.Internal.Actions.Meet(this, actor));
            }
            else {
                this.actionQueue.add(new ex.Internal.Actions.Meet(this, actor, speed));
            }
            return this;
        };
        /**
         * Returns a promise that resolves when the current action queue up to now
         * is finished.
         * @method asPromise
         * @returns Promise
         */
        Actor.prototype.asPromise = function () {
            var complete = new ex.Promise();
            this.callMethod(function () {
                complete.resolve();
            });
            return complete;
        };
        Actor.prototype._getCalculatedAnchor = function () {
            return new ex.Point(this.getWidth() * this.anchor.x, this.getHeight() * this.anchor.y);
        };
        /**
         * Called by the Engine, updates the state of the actor
         * @method update
         * @param engine {Engine} The reference to the current game engine
         * @param delta {number} The time elapsed since the last update in milliseconds
         */
        Actor.prototype.update = function (engine, delta) {
            if (!this._isInitialized) {
                this.onInitialize(engine);
                this.eventDispatcher.publish('initialize', new ex.InitializeEvent(engine));
                this._isInitialized = true;
            }
            var eventDispatcher = this.eventDispatcher;
            // Update action queue
            this.actionQueue.update(delta);
            for (var i = 0; i < this.pipeline.length; i++) {
                this.pipeline[i].update(this, engine, delta);
            }
            eventDispatcher.publish(ex.EventType[5 /* Update */], new ex.UpdateEvent(delta));
        };
        /**
         * Called by the Engine, draws the actor to the screen
         * @method draw
         * @param ctx {CanvasRenderingContext2D} The rendering context
         * @param delta {number} The time since the last draw in milliseconds
         */
        Actor.prototype.draw = function (ctx, delta) {
            if (this.isOffScreen) {
                return;
            }
            var anchorPoint = this._getCalculatedAnchor();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale.x, this.scale.y);
            // calculate changing opacity
            if (this.previousOpacity != this.opacity) {
                for (var drawing in this.frames) {
                    this.frames[drawing].addEffect(new ex.Effects.Opacity(this.opacity));
                }
                this.previousOpacity = this.opacity;
            }
            if (this.currentDrawing) {
                var xDiff = 0;
                var yDiff = 0;
                if (this.centerDrawingX) {
                    xDiff = (this.currentDrawing.width * this.currentDrawing.getScaleX() - this.getWidth()) / 2;
                }
                if (this.centerDrawingY) {
                    yDiff = (this.currentDrawing.height * this.currentDrawing.getScaleY() - this.getHeight()) / 2;
                }
                this.currentDrawing.draw(ctx, -xDiff - anchorPoint.x, -yDiff - anchorPoint.y);
            }
            else {
                if (this.color) {
                    ctx.fillStyle = this.color.toString();
                    ctx.fillRect(-anchorPoint.x, -anchorPoint.y, this.width, this.height);
                }
            }
            this.sceneNode.draw(ctx, delta);
            ctx.restore();
        };
        /**
         * Called by the Engine, draws the actors debugging to the screen
         * @method debugDraw
         * @param ctx {CanvasRenderingContext2D} The rendering context
         */
        Actor.prototype.debugDraw = function (ctx) {
            var bb = this.getBounds();
            bb.debugDraw(ctx);
            ctx.fillStyle = ex.Color.Yellow.toString();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        };
        /**
         * Indicates the next id to be set
         */
        Actor.maxId = 0;
        return Actor;
    })(ex.Class);
    ex.Actor = Actor;
})(ex || (ex = {}));
var ex;
(function (ex) {
    /**
     * Logging level that Excalibur will tag
     * @class LogLevel
     */
    (function (LogLevel) {
        /**
         @property Debug {LogLevel}
         @static
         @final
         */
        /**
        @property Info {LogLevel}
        @static
        @final
        */
        /**
        @property Warn {LogLevel}
        @static
        @final
        */
        /**
        @property Error {LogLevel}
        @static
        @final
        */
        /**
        @property Fatal {LogLevel}
        @static
        @final
        */
        LogLevel[LogLevel["Debug"] = 0] = "Debug";
        LogLevel[LogLevel["Info"] = 1] = "Info";
        LogLevel[LogLevel["Warn"] = 2] = "Warn";
        LogLevel[LogLevel["Error"] = 3] = "Error";
        LogLevel[LogLevel["Fatal"] = 4] = "Fatal";
    })(ex.LogLevel || (ex.LogLevel = {}));
    var LogLevel = ex.LogLevel;
    /**
     * Static singleton that represents the logging facility for Excalibur.
     * Excalibur comes built-in with a ConsoleAppender and ScreenAppender.
     * Derive from IAppender to create your own logging appenders.
     * @class Logger
     * @static
     */
    var Logger = (function () {
        function Logger() {
            this.appenders = [];
            /**
             * Gets or sets the default logging level. Excalibur will only log
             * messages if equal to or above this level.
             * @property defaultLevel {LogLevel}
             */
            this.defaultLevel = 1 /* Info */;
            if (Logger._instance) {
                throw new Error("Logger is a singleton");
            }
            Logger._instance = this;
            // Default console appender
            Logger._instance.addAppender(new ConsoleAppender());
            return Logger._instance;
        }
        /**
         * Gets the current static instance of Logger
         * @method getInstance
         * @static
         * @returns Logger
         */
        Logger.getInstance = function () {
            if (Logger._instance == null) {
                Logger._instance = new Logger();
            }
            return Logger._instance;
        };
        /**
         * Adds a new IAppender to the list of appenders to write to
         * @method addAppender
         * @param appender {IAppender} Appender to add
         */
        Logger.prototype.addAppender = function (appender) {
            this.appenders.push(appender);
        };
        /**
         * Clears all appenders from the logger
         * @method clearAppenders
         */
        Logger.prototype.clearAppenders = function () {
            this.appenders.length = 0;
        };
        /**
         * Logs a message at a given LogLevel
         * @method _log
         * @private
         * @param level {LogLevel}The LogLevel`to log the message at
         * @param args An array of arguments to write to an appender
         */
        Logger.prototype._log = function (level, args) {
            var _this = this;
            if (level == null) {
                level = this.defaultLevel;
            }
            this.appenders.forEach(function (appender) {
                if (level >= _this.defaultLevel) {
                    appender.log(level, args);
                }
            });
        };
        /**
         * Writes a log message at the LogLevel.Debug level
         * @method debug
         * @param ...args Accepts any number of arguments
         */
        Logger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._log(0 /* Debug */, args);
        };
        /**
         * Writes a log message at the LogLevel.Info level
         * @method info
         * @param ...args Accepts any number of arguments
         */
        Logger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._log(1 /* Info */, args);
        };
        /**
         * Writes a log message at the LogLevel.Warn level
         * @method warn
         * @param ...args Accepts any number of arguments
         */
        Logger.prototype.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._log(2 /* Warn */, args);
        };
        /**
         * Writes a log message at the LogLevel.Error level
         * @method error
         * @param ...args Accepts any number of arguments
         */
        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._log(3 /* Error */, args);
        };
        /**
         * Writes a log message at the LogLevel.Fatal level
         * @method fatal
         * @param ...args Accepts any number of arguments
         */
        Logger.prototype.fatal = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._log(4 /* Fatal */, args);
        };
        Logger._instance = null;
        return Logger;
    })();
    ex.Logger = Logger;
    /**
     * Console appender for browsers (i.e. console.log)
     * @class ConsoleAppender
     * @constructor
     * @extends IAppender
     */
    var ConsoleAppender = (function () {
        function ConsoleAppender() {
        }
        ConsoleAppender.prototype.log = function (level, args) {
            // Check for console support
            if (!console && !console.log && console.warn && console.error) {
                // todo maybe do something better than nothing
                return;
            }
            // Create a new console args array
            var consoleArgs = [];
            consoleArgs.unshift.apply(consoleArgs, args);
            consoleArgs.unshift("[" + LogLevel[level] + "] : ");
            if (level < 2 /* Warn */) {
                // Call .log for Debug/Info
                if (console.log.apply) {
                    // this is required on some older browsers that don't support apply on console.log :(
                    console.log.apply(console, consoleArgs);
                }
                else {
                    console.log(consoleArgs.join(' '));
                }
            }
            else if (level < 3 /* Error */) {
                // Call .warn for Warn
                if (console.warn.apply) {
                    console.warn.apply(console, consoleArgs);
                }
                else {
                    console.warn(consoleArgs.join(' '));
                }
            }
            else {
                // Call .error for Error/Fatal
                if (console.error.apply) {
                    console.error.apply(console, consoleArgs);
                }
                else {
                    console.error(consoleArgs.join(' '));
                }
            }
        };
        return ConsoleAppender;
    })();
    ex.ConsoleAppender = ConsoleAppender;
    /**
     * On-screen (canvas) appender
     * @todo Clean this up
     * @class ScreenAppender
     * @extends IAppender
     * @constructor
     * @param width {number} Width of the screen appender in pixels
     * @param height {number} Height of the screen appender in pixels
     */
    var ScreenAppender = (function () {
        function ScreenAppender(width, height) {
            this._messages = [];
            this.canvas = document.createElement('canvas');
            this.canvas.width = width || window.innerWidth;
            this.canvas.height = height || window.innerHeight;
            this.canvas.style.position = 'absolute';
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
        }
        ScreenAppender.prototype.log = function (level, args) {
            var message = args.join(",");
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._messages.unshift("[" + LogLevel[level] + "] : " + message);
            var pos = 10;
            var opacity = 1.0;
            for (var i = 0; i < this._messages.length; i++) {
                this.ctx.fillStyle = 'rgba(255,255,255,' + opacity.toFixed(2) + ')';
                this.ctx.fillText(this._messages[i], 200, pos);
                pos += 10;
                opacity = opacity > 0 ? opacity - .05 : 0;
            }
        };
        return ScreenAppender;
    })();
    ex.ScreenAppender = ScreenAppender;
})(ex || (ex = {}));
/// <reference path="Engine.ts" />
/// <reference path="Actor.ts" />
/// <reference path="Log.ts" />
var ex;
(function (ex) {
    /**
     * An enum representing all of the built in event types for Excalibur
     * @class EventType
     */
    (function (EventType) {
        /**
        @property UserEvent {EventType}
        @static
        @final
        */
        /**
        @property Blur {EventType}
        @static
        @final
        */
        /**
        @property Focus {EventType}
        @static
        @final
        */
        /**
        @property Update {EventType}
        @static
        @final
        */
        /**
        @property EnterViewPort {EventType}
        @static
        @final
        */
        /**
        @property ExitViewPort {EventType}
        @static
        @final
        */
        /**
        @property Activate {EventType}
        @static
        @final
        */
        /**
        @property Deactivate {EventType}
        @static
        @final
        */
        /**
        @property Initialize {EventType}
        @static
        @final
        */
        EventType[EventType["Collision"] = 0] = "Collision";
        EventType[EventType["EnterViewPort"] = 1] = "EnterViewPort";
        EventType[EventType["ExitViewPort"] = 2] = "ExitViewPort";
        EventType[EventType["Blur"] = 3] = "Blur";
        EventType[EventType["Focus"] = 4] = "Focus";
        EventType[EventType["Update"] = 5] = "Update";
        EventType[EventType["Activate"] = 6] = "Activate";
        EventType[EventType["Deactivate"] = 7] = "Deactivate";
        EventType[EventType["Initialize"] = 8] = "Initialize";
    })(ex.EventType || (ex.EventType = {}));
    var EventType = ex.EventType;
    /**
     * Base event type in Excalibur that all other event types derive from.
     *
     * @class GameEvent
     * @constructor
     * @param target {any} Events can have target game object, like the Engine, or an Actor.
     */
    var GameEvent = (function () {
        function GameEvent() {
        }
        return GameEvent;
    })();
    ex.GameEvent = GameEvent;
    /**
     * Event received by the Engine when the browser window is visible
     *
     * @class VisibleEvent
     * @extends GameEvent
     * @constructor
     */
    var VisibleEvent = (function (_super) {
        __extends(VisibleEvent, _super);
        function VisibleEvent() {
            _super.call(this);
        }
        return VisibleEvent;
    })(GameEvent);
    ex.VisibleEvent = VisibleEvent;
    /**
     * Event received by the Engine when the browser window is hidden
     *
     * @class HiddenEvent
     * @extends GameEvent
     * @constructor
     */
    var HiddenEvent = (function (_super) {
        __extends(HiddenEvent, _super);
        function HiddenEvent() {
            _super.call(this);
        }
        return HiddenEvent;
    })(GameEvent);
    ex.HiddenEvent = HiddenEvent;
    /**
     * Event thrown on an actor when a collision has occured
     *
     * @class CollisionEvent
     * @extends GameEvent
     * @constructor
     * @param actor {Actor} The actor the event was thrown on
     * @param other {Actor} The actor that was collided with
     * @param side {Side} The side that was collided with
     */
    var CollisionEvent = (function (_super) {
        __extends(CollisionEvent, _super);
        function CollisionEvent(actor, other, side, intersection) {
            _super.call(this);
            this.actor = actor;
            this.other = other;
            this.side = side;
            this.intersection = intersection;
        }
        return CollisionEvent;
    })(GameEvent);
    ex.CollisionEvent = CollisionEvent;
    /**
     * Event thrown on a game object on Excalibur update
     *
     * @class UpdateEvent
     * @extends GameEvent
     * @constructor
     * @param delta {number} The number of milliseconds since the last update
     */
    var UpdateEvent = (function (_super) {
        __extends(UpdateEvent, _super);
        function UpdateEvent(delta) {
            _super.call(this);
            this.delta = delta;
        }
        return UpdateEvent;
    })(GameEvent);
    ex.UpdateEvent = UpdateEvent;
    /**
     * Event thrown on an Actor only once before the first update call
     *
     * @class InitializeEvent
     * @extends GameEvent
     * @constructor
     * @param engine {Engine} The reference to the current engine
     */
    var InitializeEvent = (function (_super) {
        __extends(InitializeEvent, _super);
        function InitializeEvent(engine) {
            _super.call(this);
            this.engine = engine;
        }
        return InitializeEvent;
    })(GameEvent);
    ex.InitializeEvent = InitializeEvent;
    /**
     * Event thrown on a Scene on activation
     *
     * @class ActivateEvent
     * @extends GameEvent
     * @constructor
     * @param oldScene {Scene} The reference to the old scene
     */
    var ActivateEvent = (function (_super) {
        __extends(ActivateEvent, _super);
        function ActivateEvent(oldScene) {
            _super.call(this);
            this.oldScene = oldScene;
        }
        return ActivateEvent;
    })(GameEvent);
    ex.ActivateEvent = ActivateEvent;
    /**
     * Event thrown on a Scene on deactivation
     *
     * @class DeactivateEvent
     * @extends GameEvent
     * @constructor
     * @param newScene {Scene} The reference to the new scene
     */
    var DeactivateEvent = (function (_super) {
        __extends(DeactivateEvent, _super);
        function DeactivateEvent(newScene) {
            _super.call(this);
            this.newScene = newScene;
        }
        return DeactivateEvent;
    })(GameEvent);
    ex.DeactivateEvent = DeactivateEvent;
    /**
     * Event thrown on an Actor when it completely leaves the screen.
     * @class ExitViewPortEvent
     * @constructor
     */
    var ExitViewPortEvent = (function (_super) {
        __extends(ExitViewPortEvent, _super);
        function ExitViewPortEvent() {
            _super.call(this);
        }
        return ExitViewPortEvent;
    })(GameEvent);
    ex.ExitViewPortEvent = ExitViewPortEvent;
    /**
     * Event thrown on an Actor when it completely leaves the screen.
     * @class EnterViewPortEvent
     * @constructor
     */
    var EnterViewPortEvent = (function (_super) {
        __extends(EnterViewPortEvent, _super);
        function EnterViewPortEvent() {
            _super.call(this);
        }
        return EnterViewPortEvent;
    })(GameEvent);
    ex.EnterViewPortEvent = EnterViewPortEvent;
    /**
     * Enum representing the different mouse buttons
     * @class MouseButton
     */
    (function (MouseButton) {
        /**
         * @property Left
         * @static
         */
        MouseButton[MouseButton["Left"] = 0] = "Left";
        /**
         * @property Left
         * @static
         */
        MouseButton[MouseButton["Middle"] = 1] = "Middle";
        /**
         * @property Left
         * @static
         */
        MouseButton[MouseButton["Right"] = 2] = "Right";
    })(ex.MouseButton || (ex.MouseButton = {}));
    var MouseButton = ex.MouseButton;
})(ex || (ex = {}));
/// <reference path="Events.ts" />
var ex;
(function (ex) {
    /**
     * Excalibur's internal event dispatcher implementation. Callbacks are fired immediately after an event is published
     * @class EventDispatcher
     * @constructor
     * @param target {any} The object that will be the recipient of events from this event dispatcher
     */
    var EventDispatcher = (function () {
        function EventDispatcher(target) {
            this._handlers = {};
            this.log = ex.Logger.getInstance();
            this.target = target;
        }
        /**
         * Publish an event for target
         * @method publish
         * @param eventName {string} The name of the event to publish
         * @param [event=undefined] {GameEvent} Optionally pass an event data object to the handler
         */
        EventDispatcher.prototype.publish = function (eventName, event) {
            if (!eventName) {
                // key not mapped
                return;
            }
            eventName = eventName.toLowerCase();
            var target = this.target;
            if (!event) {
                event = new ex.GameEvent();
            }
            event.target = target;
            if (this._handlers[eventName]) {
                this._handlers[eventName].forEach(function (callback) {
                    callback.call(target, event);
                });
            }
        };
        /**
         * Subscribe an event handler to a particular event name, multiple handlers per event name are allowed.
         * @method subscribe
         * @param eventName {string} The name of the event to subscribe to
         * @param handler {GameEvent=>void} The handler callback to fire on this event
         */
        EventDispatcher.prototype.subscribe = function (eventName, handler) {
            eventName = eventName.toLowerCase();
            if (!this._handlers[eventName]) {
                this._handlers[eventName] = [];
            }
            this._handlers[eventName].push(handler);
        };
        /**
         * Unsubscribe a event handler(s) from an event. If a specific handler
         * is specified for an event, only that handler will be unsubscribed.
         * Otherwise all handlers will be unsubscribed for that event.
         * @method unsubscribe
         * @param eventName {string} The name of the event to unsubscribe
         * @param [handler=undefined] Optionally the specific handler to unsubscribe
         *
         */
        EventDispatcher.prototype.unsubscribe = function (eventName, handler) {
            eventName = eventName.toLowerCase();
            var eventHandlers = this._handlers[eventName];
            if (eventHandlers) {
                // if no explicit handler is give with the event name clear all handlers
                if (!handler) {
                    this._handlers[eventName].length = 0;
                }
                else {
                    var index = eventHandlers.indexOf(handler);
                    if (index < 0)
                        return;
                    this._handlers[eventName].splice(index, 1);
                }
            }
        };
        return EventDispatcher;
    })();
    ex.EventDispatcher = EventDispatcher;
})(ex || (ex = {}));
var ex;
(function (ex) {
    var Color = (function () {
        /**
         * Creates a new instance of Color from an r, g, b, a
         *
         * @class Color
         * @constructor
         * @param r {number} The red component of color (0-255)
         * @param g {number} The green component of color (0-255)
         * @param b {number} The blue component of color (0-255)
         * @param [a=1] {number} The alpha component of color (0-1.0)
         */
        function Color(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            this.a = (a != null ? a : 1);
        }
        /**
         * Creates a new instance of Color from an r, g, b, a
         *
         * @method fromRGB
         * @static
         * @param r {number} The red component of color (0-255)
         * @param g {number} The green component of color (0-255)
         * @param b {number} The blue component of color (0-255)
         * @param [a=1] {number} The alpha component of color (0-1.0)
         */
        Color.fromRGB = function (r, g, b, a) {
            return new Color(r, g, b, a);
        };
        /**
         * Creates a new inscance of Color from a hex string
         *
         * @method fromHex
         * @static
         * @param hex {string} CSS color string of the form #ffffff, the alpha component is optional
         */
        Color.fromHex = function (hex) {
            var hexRegEx = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
            var match = null;
            if (match = hex.match(hexRegEx)) {
                var r = parseInt(match[1], 16);
                var g = parseInt(match[2], 16);
                var b = parseInt(match[3], 16);
                var a = 1;
                if (match[4]) {
                    a = parseInt(match[4], 16) / 255;
                }
                return new Color(r, g, b, a);
            }
            else {
                throw new Error("Invalid hex string: " + hex);
            }
        };
        /**
         * Returns a CSS string representation of a color.
         * @method toString
         * @returns string
         */
        Color.prototype.toString = function () {
            var result = String(this.r.toFixed(0)) + ", " + String(this.g.toFixed(0)) + ", " + String(this.b.toFixed(0));
            if (this.a !== undefined || this.a !== null) {
                return "rgba(" + result + ", " + String(this.a) + ")";
            }
            return "rgb(" + result + ")";
        };
        /**
         * Returns a CSS string representation of a color.
         * @method fillStyle
         * @returns string
         */
        Color.prototype.fillStyle = function () {
            return this.toString();
        };
        /**
         * Returns a clone of the current color.
         * @method clone
         * @returns Color
         */
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        /**
         * Color constant
         * @property Black {ex.Color}
         * @static
         * @final
         */
        Color.Black = Color.fromHex('#000000');
        /**
         * Color constant
         * @property White {ex.Color}
         * @static
         * @final
         */
        Color.White = Color.fromHex('#FFFFFF');
        /**
         * Color constant
         * @property Gray {ex.Color}
         * @static
         * @final
         */
        Color.Gray = Color.fromHex('#808080');
        /**
         * Color constant
         * @property LightGray {ex.Color}
         * @static
         * @final
         */
        Color.LightGray = Color.fromHex('#D3D3D3');
        /**
         * Color constant
         * @property DarkGray {ex.Color}
         * @static
         * @final
         */
        Color.DarkGray = Color.fromHex('#A9A9A9');
        /**
         * Color constant
         * @property Yellow {ex.Color}
         * @static
         * @final
         */
        Color.Yellow = Color.fromHex('#FFFF00');
        /**
         * Color constant
         * @property Orange {ex.Color}
         * @static
         * @final
         */
        Color.Orange = Color.fromHex('#FFA500');
        /**
         * Color constant
         * @property Red {ex.Color}
         * @static
         * @final
         */
        Color.Red = Color.fromHex('#FF0000');
        /**
         * Color constant
         * @property Vermillion {ex.Color}
         * @static
         * @final
         */
        Color.Vermillion = Color.fromHex('#FF5B31');
        /**
         * Color constant
         * @property Rose {ex.Color}
         * @static
         * @final
         */
        Color.Rose = Color.fromHex('#FF007F');
        /**
         * Color constant
         * @property Magenta {ex.Color}
         * @static
         * @final
         */
        Color.Magenta = Color.fromHex('#FF00FF');
        /**
         * Color constant
         * @property Violet {ex.Color}
         * @static
         * @final
         */
        Color.Violet = Color.fromHex('#7F00FF');
        /**
         * Color constant
         * @property Blue {ex.Color}
         * @static
         * @final
         */
        Color.Blue = Color.fromHex('#0000FF');
        /**
         * Color constant
         * @property Azure {ex.Color}
         * @static
         * @final
         */
        Color.Azure = Color.fromHex('#007FFF');
        /**
         * Color constant
         * @property Cyan {ex.Color}
         * @static
         * @final
         */
        Color.Cyan = Color.fromHex('#00FFFF');
        /**
         * Color constant
         * @property Viridian {ex.Color}
         * @static
         * @final
         */
        Color.Viridian = Color.fromHex('#59978F');
        /**
         * Color constant
         * @property Green {ex.Color}
         * @static
         * @final
         */
        Color.Green = Color.fromHex('#00FF00');
        /**
         * Color constant
         * @property Chartreuse {ex.Color}
         * @static
         * @final
         */
        Color.Chartreuse = Color.fromHex('#7FFF00');
        /**
         * Color constant
         * @property Transparent {ex.Color}
         * @static
         * @final
         */
        Color.Transparent = Color.fromHex('#FFFFFF00');
        return Color;
    })();
    ex.Color = Color;
})(ex || (ex = {}));
/// <reference path="Actor.ts" />
var ex;
(function (ex) {
    /**
     * Helper Actor primitive for drawing UI's, optimized for UI drawing. Does
     * not participate in collisions.
     * @class UIActor
     * @extends Actor
     * @constructor
     * @param [x=0.0] {number} The starting x coordinate of the actor
     * @param [y=0.0] {number} The starting y coordinate of the actor
     * @param [width=0.0] {number} The starting width of the actor
     * @param [height=0.0] {number} The starting height of the actor
     */
    var UIActor = (function (_super) {
        __extends(UIActor, _super);
        function UIActor(x, y, width, height) {
            _super.call(this, x, y, width, height);
            this.pipeline = [];
            this.pipeline.push(new ex.MovementModule());
            this.pipeline.push(new ex.CapturePointerModule());
            this.anchor.setTo(0, 0);
            this.collisionType = 0 /* PreventCollision */;
            this.enableCapturePointer = true;
        }
        UIActor.prototype.onInitialize = function (engine) {
            this._engine = engine;
        };
        UIActor.prototype.contains = function (x, y, useWorld) {
            if (useWorld === void 0) { useWorld = true; }
            if (useWorld)
                return _super.prototype.contains.call(this, x, y);
            var coords = this._engine.worldToScreenCoordinates(new ex.Point(x, y));
            return _super.prototype.contains.call(this, coords.x, coords.y);
        };
        return UIActor;
    })(ex.Actor);
    ex.UIActor = UIActor;
})(ex || (ex = {}));
/// <reference path="Actor.ts" />
/// <reference path="Engine.ts" />
var ex;
(function (ex) {
    /**
     * Triggers a method of firing arbitrary code on collision. These are useful
     * as 'buttons', 'switches', or to trigger effects in a game. By defualt triggers
     * are invisible, and can only be seen with debug mode enabled on the Engine.
     * @class Trigger
     * @constructor
     * @param [x=0] {number} The x position of the trigger
     * @param [y=0] {number} The y position of the trigger
     * @param [width=0] {number} The width of the trigger
     * @param [height=0] {number} The height of the trigger
     * @param [action=null] {()=>void} Callback to fire when trigger is activated
     * @param [repeats=1] {number} The number of times that this trigger should fire, by default it is 1, if -1 is supplied it will fire indefinitely
     */
    var Trigger = (function (_super) {
        __extends(Trigger, _super);
        function Trigger(x, y, width, height, action, repeats) {
            _super.call(this, x, y, width, height);
            this.action = function () {
            };
            this.repeats = 1;
            this.target = null;
            this.repeats = repeats || this.repeats;
            this.action = action || this.action;
            this.collisionType = 0 /* PreventCollision */;
            this.eventDispatcher = new ex.EventDispatcher(this);
            this.actionQueue = new ex.Internal.Actions.ActionQueue(this);
        }
        Trigger.prototype.update = function (engine, delta) {
            // Update action queue
            this.actionQueue.update(delta);
            // Update placements based on linear algebra
            this.x += this.dx * delta / 1000;
            this.y += this.dy * delta / 1000;
            this.rotation += this.rx * delta / 1000;
            this.scale.x += this.sx * delta / 1000;
            this.scale.y += this.sy * delta / 1000;
            // check for trigger collisions
            if (this.target) {
                if (this.collides(this.target)) {
                    this.dispatchAction();
                }
            }
            else {
                for (var i = 0; i < engine.currentScene.children.length; i++) {
                    var other = engine.currentScene.children[i];
                    if (other !== this && other.collisionType !== 0 /* PreventCollision */ && this.collides(other)) {
                        this.dispatchAction();
                    }
                }
            }
            // remove trigger if its done, -1 repeat forever
            if (this.repeats === 0) {
                this.kill();
            }
        };
        Trigger.prototype.dispatchAction = function () {
            this.action.call(this);
            this.repeats--;
        };
        Trigger.prototype.draw = function (ctx, delta) {
            // does not draw
            return;
        };
        Trigger.prototype.debugDraw = function (ctx) {
            _super.prototype.debugDraw.call(this, ctx);
            // Meant to draw debug information about actors
            ctx.save();
            ctx.translate(this.x, this.y);
            var bb = this.getBounds();
            bb.left = bb.left - this.getGlobalX();
            bb.right = bb.right - this.getGlobalX();
            bb.top = bb.top - this.getGlobalY();
            bb.bottom = bb.bottom - this.getGlobalY();
            // Currently collision primitives cannot rotate 
            // ctx.rotate(this.rotation);
            ctx.fillStyle = ex.Color.Violet.toString();
            ctx.strokeStyle = ex.Color.Violet.toString();
            ctx.fillText('Trigger', 10, 10);
            bb.debugDraw(ctx);
            ctx.restore();
        };
        return Trigger;
    })(ex.Actor);
    ex.Trigger = Trigger;
})(ex || (ex = {}));
/// <reference path="Engine.ts" />
/// <reference path="Algebra.ts" />
/// <reference path="Util.ts" />
/// <reference path="Actor.ts" />
var ex;
(function (ex) {
    /**
     * An enum that represents the types of emitter nozzles
     * @class EmitterType
     */
    (function (EmitterType) {
        /**
         * Constant for the circular emitter type
         * @property Circle {EmitterType}
         */
        EmitterType[EmitterType["Circle"] = 0] = "Circle";
        /**
         * Constant for the rectangular emitter type
         * @property Rectangle {EmitterType}
         */
        EmitterType[EmitterType["Rectangle"] = 1] = "Rectangle";
    })(ex.EmitterType || (ex.EmitterType = {}));
    var EmitterType = ex.EmitterType;
    var Particle = (function () {
        function Particle(emitter, life, opacity, beginColor, endColor, position, velocity, acceleration, startSize, endSize) {
            this.position = new ex.Vector(0, 0);
            this.velocity = new ex.Vector(0, 0);
            this.acceleration = new ex.Vector(0, 0);
            this.particleRotationalVelocity = 0;
            this.currentRotation = 0;
            this.focus = null;
            this.focusAccel = 0;
            this.opacity = 1;
            this.beginColor = ex.Color.White.clone();
            this.endColor = ex.Color.White.clone();
            // Life is counted in ms
            this.life = 300;
            this.fadeFlag = false;
            // Color transitions
            this.rRate = 1;
            this.gRate = 1;
            this.bRate = 1;
            this.aRate = 0;
            this.currentColor = ex.Color.White.clone();
            this.emitter = null;
            this.particleSize = 5;
            this.particleSprite = null;
            this.sizeRate = 0;
            this.elapsedMultiplier = 0;
            this.emitter = emitter;
            this.life = life || this.life;
            this.opacity = opacity || this.opacity;
            this.endColor = endColor || this.endColor.clone();
            this.beginColor = beginColor || this.beginColor.clone();
            this.currentColor = this.beginColor.clone();
            this.position = position || this.position;
            this.velocity = velocity || this.velocity;
            this.acceleration = acceleration || this.acceleration;
            this.rRate = (this.endColor.r - this.beginColor.r) / this.life;
            this.gRate = (this.endColor.g - this.beginColor.g) / this.life;
            this.bRate = (this.endColor.b - this.beginColor.b) / this.life;
            this.aRate = this.opacity / this.life;
            this.startSize = startSize || 0;
            this.endSize = endSize || 0;
            if ((this.endSize > 0) && (this.startSize > 0)) {
                this.sizeRate = (this.endSize - this.startSize) / this.life;
                this.particleSize = this.startSize;
            }
        }
        Particle.prototype.kill = function () {
            this.emitter.removeParticle(this);
        };
        Particle.prototype.update = function (delta) {
            this.life = this.life - delta;
            this.elapsedMultiplier = this.elapsedMultiplier + delta;
            if (this.life < 0) {
                this.kill();
            }
            if (this.fadeFlag) {
                this.opacity = ex.Util.clamp(this.aRate * this.life, 0.0001, 1);
            }
            if ((this.startSize > 0) && (this.endSize > 0)) {
                this.particleSize = ex.Util.clamp(this.sizeRate * delta + this.particleSize, Math.min(this.startSize, this.endSize), Math.max(this.startSize, this.endSize));
            }
            this.currentColor.r = ex.Util.clamp(this.currentColor.r + this.rRate * delta, 0, 255);
            this.currentColor.g = ex.Util.clamp(this.currentColor.g + this.gRate * delta, 0, 255);
            this.currentColor.b = ex.Util.clamp(this.currentColor.b + this.bRate * delta, 0, 255);
            this.currentColor.a = ex.Util.clamp(this.opacity, 0.0001, 1);
            if (this.focus) {
                var accel = this.focus.minus(this.position).normalize().scale(this.focusAccel).scale(delta / 1000);
                this.velocity = this.velocity.add(accel);
            }
            else {
                this.velocity = this.velocity.add(this.acceleration.scale(delta / 1000));
            }
            this.position = this.position.add(this.velocity.scale(delta / 1000));
            if (this.particleRotationalVelocity) {
                this.currentRotation = (this.currentRotation + this.particleRotationalVelocity * delta / 1000) % (2 * Math.PI);
            }
        };
        Particle.prototype.draw = function (ctx) {
            if (this.particleSprite) {
                this.particleSprite.setRotation(this.currentRotation);
                this.particleSprite.setScaleX(this.particleSize);
                this.particleSprite.setScaleY(this.particleSize);
                this.particleSprite.draw(ctx, this.position.x, this.position.y);
                return;
            }
            this.currentColor.a = ex.Util.clamp(this.opacity, 0.0001, 1);
            ctx.fillStyle = this.currentColor.toString();
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.particleSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        };
        return Particle;
    })();
    ex.Particle = Particle;
    /**
     * Using a particle emitter is a great way to create interesting effects
     * in your game, like smoke, fire, water, explosions, etc. Particle Emitters
     * extend Actor allowing you to use all of the features that come with Actor
     * @class ParticleEmitter
     * @constructor
     * @param [x=0] {number} The x position of the emitter
     * @param [y=0] {number} The y position of the emitter
     * @param [width=0] {number} The width of the emitter
     * @param [height=0] {number} The height of the emitter
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        function ParticleEmitter(x, y, width, height) {
            _super.call(this, x, y, width, height, ex.Color.White);
            this._particlesToEmit = 0;
            this.numParticles = 0;
            /**
             * Gets or sets the isEmitting flag
             * @property isEmitting {boolean}
             */
            this.isEmitting = true;
            /**
             * Gets or sets the backing particle collection
             * @property particles {Util.Collection&lt;Particle&gt;}
             */
            this.particles = null;
            /**
             * Gets or sets the backing deadParticle collection
             * @property particles {Util.Collection&lt;Particle&gt;}
             */
            this.deadParticles = null;
            /**
             * Gets or sets the minimum partical velocity
             * @property [minVel=0] {number}
             */
            this.minVel = 0;
            /**
             * Gets or sets the maximum partical velocity
             * @property [maxVel=0] {number}
             */
            this.maxVel = 0;
            /**
             * Gets or sets the acceleration vector for all particles
             * @property [acceleration=new Vector(0,0)] {Vector}
             */
            this.acceleration = new ex.Vector(0, 0);
            /**
             * Gets or sets the minimum angle in radians
             * @property [minAngle=0] {number}
             */
            this.minAngle = 0;
            /**
             * Gets or sets the maximum angle in radians
             * @property [maxAngle=0] {number}
             */
            this.maxAngle = 0;
            /**
             * Gets or sets the emission rate for particles (particles/sec)
             * @property [emitRate=1] {number}
             */
            this.emitRate = 1; //particles/sec
            /**
             * Gets or sets the life of each particle in milliseconds
             * @property [particleLife=2000] {number}
             */
            this.particleLife = 2000;
            /**
             * Gets or sets the opacity of each particle from 0 to 1.0
             * @property [opacity=1.0] {number}
             */
            this.opacity = 1;
            /**
             * Gets or sets the fade flag which causes particles to gradually fade out over the course of their life.
             * @property [fade=false] {boolean}
             */
            this.fadeFlag = false;
            /**
             * Gets or sets the optional focus where all particles should accelerate towards
             * @property [focus=null] {Vector}
             */
            this.focus = null;
            /**
             * Gets or sets the acceleration for focusing particles if a focus has been specified
             * @property [focusAccel=1] {number}
             */
            this.focusAccel = 1;
            /*
             * Gets or sets the optional starting size for the particles
             * @property [startSize=null] {number}
             */
            this.startSize = null;
            /*
             * Gets or sets the optional ending size for the particles
             * @property [endSize=null] {number}
             */
            this.endSize = null;
            /**
             * Gets or sets the minimum size of all particles
             * @property [minSize=5] {number}
             */
            this.minSize = 5;
            /**
             * Gets or sets the maximum size of all particles
             * @property [maxSize=5] {number}
             */
            this.maxSize = 5;
            /**
             * Gets or sets the beginning color of all particles
             * @property [beginColor=Color.White] {Color}
             */
            this.beginColor = ex.Color.White;
            /**
             * Gets or sets the ending color of all particles
             * @property [endColor=Color.White] {Color}
             */
            this.endColor = ex.Color.White;
            /**
             * Gets or sets the sprite that a particle should use
             * @property [particleSprite=null] {Sprite}
             */
            this.particleSprite = null;
            /**
             * Gets or sets the emitter type for the particle emitter
             * @property [emitterType=EmitterType.Rectangle] {EmitterType}
             */
            this.emitterType = 1 /* Rectangle */;
            /**
             * Gets or sets the emitter radius, only takes effect when the emitterType is Circle
             * @property [radius=0] {number}
             */
            this.radius = 0;
            /**
             * Gets or sets the particle rotational speed velocity
             * @property [particleRotationalVelocity=0] {number}
             */
            this.particleRotationalVelocity = 0;
            /**
             * Indicates whether particles should start with a random rotation
             * @property [randomRotation=false] {boolean}
             */
            this.randomRotation = false;
            this.collisionType = 0 /* PreventCollision */;
            this.particles = new ex.Util.Collection();
            this.deadParticles = new ex.Util.Collection();
        }
        ParticleEmitter.prototype.removeParticle = function (particle) {
            this.deadParticles.push(particle);
        };
        /**
         * Causes the emitter to emit particles
         * @method emit
         * @param particleCount {number} Number of particles to emit right now
         */
        ParticleEmitter.prototype.emit = function (particleCount) {
            for (var i = 0; i < particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        };
        ParticleEmitter.prototype.clearParticles = function () {
            this.particles.clear();
        };
        // Creates a new particle given the contraints of the emitter
        ParticleEmitter.prototype.createParticle = function () {
            // todo implement emitter contraints;
            var ranX = 0;
            var ranY = 0;
            var angle = ex.Util.randomInRange(this.minAngle, this.maxAngle);
            var vel = ex.Util.randomInRange(this.minVel, this.maxVel);
            var size = this.startSize || ex.Util.randomInRange(this.minSize, this.maxSize);
            var dx = vel * Math.cos(angle);
            var dy = vel * Math.sin(angle);
            if (this.emitterType === 1 /* Rectangle */) {
                ranX = ex.Util.randomInRange(this.x, this.x + this.getWidth());
                ranY = ex.Util.randomInRange(this.y, this.y + this.getHeight());
            }
            else if (this.emitterType === 0 /* Circle */) {
                var radius = ex.Util.randomInRange(0, this.radius);
                ranX = radius * Math.cos(angle) + this.x;
                ranY = radius * Math.sin(angle) + this.y;
            }
            var p = new Particle(this, this.particleLife, this.opacity, this.beginColor, this.endColor, new ex.Vector(ranX, ranY), new ex.Vector(dx, dy), this.acceleration, this.startSize, this.endSize);
            p.fadeFlag = this.fadeFlag;
            p.particleSize = size;
            if (this.particleSprite) {
                p.particleSprite = this.particleSprite;
            }
            p.particleRotationalVelocity = this.particleRotationalVelocity;
            if (this.randomRotation) {
                p.currentRotation = ex.Util.randomInRange(0, Math.PI * 2);
            }
            if (this.focus) {
                p.focus = this.focus.add(new ex.Vector(this.x, this.y));
                p.focusAccel = this.focusAccel;
            }
            return p;
        };
        ParticleEmitter.prototype.update = function (engine, delta) {
            var _this = this;
            _super.prototype.update.call(this, engine, delta);
            if (this.isEmitting) {
                this._particlesToEmit += this.emitRate * (delta / 1000);
                var numParticles = Math.ceil(this.emitRate * delta / 1000);
                if (this._particlesToEmit > 1.0) {
                    this.emit(Math.floor(this._particlesToEmit));
                    this._particlesToEmit = this._particlesToEmit - Math.floor(this._particlesToEmit);
                }
            }
            this.particles.forEach(function (particle, index) {
                particle.update(delta);
            });
            this.deadParticles.forEach(function (particle, index) {
                _this.particles.removeElement(particle);
            });
            this.deadParticles.clear();
        };
        ParticleEmitter.prototype.draw = function (ctx, delta) {
            this.particles.forEach(function (particle, index) {
                // todo is there a more efficient to draw 
                // possibly use a webgl offscreen canvas and shaders to do particles?
                particle.draw(ctx);
            });
        };
        ParticleEmitter.prototype.debugDraw = function (ctx) {
            _super.prototype.debugDraw.call(this, ctx);
            ctx.fillStyle = ex.Color.Black.toString();
            ctx.fillText("Particles: " + this.particles.count(), this.x, this.y + 20);
            if (this.focus) {
                ctx.fillRect(this.focus.x + this.x, this.focus.y + this.y, 3, 3);
                ex.Util.drawLine(ctx, "yellow", this.focus.x + this.x, this.focus.y + this.y, _super.prototype.getCenter.call(this).x, _super.prototype.getCenter.call(this).y);
                ctx.fillText("Focus", this.focus.x + this.x, this.focus.y + this.y);
            }
        };
        return ParticleEmitter;
    })(ex.Actor);
    ex.ParticleEmitter = ParticleEmitter;
})(ex || (ex = {}));
var ex;
(function (ex) {
    /**
     * Animations allow you to display a series of images one after another,
     * creating the illusion of change. Generally these images will come from a sprite sheet source.
     * @class Animation
     * @extends IDrawable
     * @constructor
     * @param engine {Engine} Reference to the current game engine
     * @param images {Sprite[]} An array of sprites to create the frames for the animation
     * @param speed {number} The number in milliseconds to display each frame in the animation
     * @param [loop=false] {boolean} Indicates whether the animation should loop after it is completed
     */
    var Animation = (function () {
        function Animation(engine, images, speed, loop) {
            this.currIndex = 0;
            this.oldTime = Date.now();
            this.rotation = 0.0;
            this.scaleX = 1.0;
            this.scaleY = 1.0;
            /**
             * Indicates whether the animation should loop after it is completed
             * @property [loop=false] {boolean}
             */
            this.loop = false;
            this.freezeFrame = -1;
            this.flipVertical = false;
            this.flipHorizontal = false;
            this.width = 0;
            this.height = 0;
            this.sprites = images;
            this.speed = speed;
            this.engine = engine;
            if (loop != null) {
                this.loop = loop;
            }
            this.height = images[0] ? images[0].height : 0;
            this.width = images[0] ? images[0].width : 0;
        }
        Animation.prototype.addEffect = function (effect) {
            for (var i in this.sprites) {
                this.sprites[i].addEffect(effect);
            }
        };
        Animation.prototype.removeEffect = function (param) {
            for (var i in this.sprites) {
                this.sprites[i].removeEffect(param);
            }
        };
        Animation.prototype.clearEffects = function () {
            for (var i in this.sprites) {
                this.sprites[i].clearEffects();
            }
        };
        Animation.prototype.transformAboutPoint = function (point) {
            for (var i in this.sprites) {
                this.sprites[i].transformAboutPoint(point);
            }
        };
        Animation.prototype.setRotation = function (radians) {
            this.rotation = radians;
            for (var i in this.sprites) {
                this.sprites[i].setRotation(radians);
            }
        };
        Animation.prototype.getRotation = function () {
            return this.rotation;
        };
        Animation.prototype.setScaleX = function (scaleX) {
            this.scaleX = scaleX;
            for (var i in this.sprites) {
                this.sprites[i].setScaleX(scaleX);
            }
        };
        Animation.prototype.setScaleY = function (scaleY) {
            this.scaleY = scaleY;
            for (var i in this.sprites) {
                this.sprites[i].setScaleY(scaleY);
            }
        };
        Animation.prototype.getScaleX = function () {
            return this.scaleX;
        };
        Animation.prototype.getScaleY = function () {
            return this.scaleY;
        };
        /**
         * Resets the animation to first frame.
         * @method reset
         */
        Animation.prototype.reset = function () {
            this.currIndex = 0;
        };
        /**
         * Indicates whether the animation is complete, animations that loop are never complete.
         * @method isDone
         * @returns boolean
         */
        Animation.prototype.isDone = function () {
            return (!this.loop && this.currIndex >= this.sprites.length);
        };
        /**
         * Not meant to be called by game developers. Ticks the animation forward internally an
         * calculates whether to change to teh frame.
         * @method tick
         */
        Animation.prototype.tick = function () {
            var time = Date.now();
            if ((time - this.oldTime) > this.speed) {
                this.currIndex = (this.loop ? (this.currIndex + 1) % this.sprites.length : this.currIndex + 1);
                this.oldTime = time;
            }
        };
        /**
         * Skips ahead a specified number of frames in the animation
         * @method skip
         * @param frames {number} Frames to skip ahead
         */
        Animation.prototype.skip = function (frames) {
            this.currIndex = (this.currIndex + frames) % this.sprites.length;
        };
        Animation.prototype.draw = function (ctx, x, y) {
            this.tick();
            if (this.currIndex < this.sprites.length) {
                var currSprite = this.sprites[this.currIndex];
                if (this.flipVertical) {
                    currSprite.flipVertical = this.flipVertical;
                }
                if (this.flipHorizontal) {
                    currSprite.flipHorizontal = this.flipHorizontal;
                }
                currSprite.draw(ctx, x, y);
            }
            if (this.freezeFrame !== -1 && this.currIndex >= this.sprites.length) {
                var currSprite = this.sprites[ex.Util.clamp(this.freezeFrame, 0, this.sprites.length - 1)];
                currSprite.draw(ctx, x, y);
            }
        };
        /**
         * Plays an animation at an arbitrary location in the game.
         * @method play
         * @param x {number} The x position in the game to play
         * @param y {number} The y position in the game to play
         */
        Animation.prototype.play = function (x, y) {
            this.reset();
            this.engine.playAnimation(this, x, y);
        };
        return Animation;
    })();
    ex.Animation = Animation;
})(ex || (ex = {}));
/// <reference path="MonkeyPatch.ts" />
/// <reference path="Util.ts" />
/// <reference path="Log.ts" />
var ex;
(function (ex) {
    var Internal;
    (function (Internal) {
        var FallbackAudio = (function () {
            function FallbackAudio(path, volume) {
                this.log = ex.Logger.getInstance();
                this.onload = function () {
                };
                this.onprogress = function () {
                };
                this.onerror = function () {
                };
                if (window.AudioContext) {
                    this.log.debug("Using new Web Audio Api for " + path);
                    this.soundImpl = new WebAudio(path, volume);
                }
                else {
                    this.log.debug("Falling back to Audio Element for " + path);
                    this.soundImpl = new AudioTag(path, volume);
                }
            }
            FallbackAudio.prototype.setVolume = function (volume) {
                this.soundImpl.setVolume(volume);
            };
            FallbackAudio.prototype.setLoop = function (loop) {
                this.soundImpl.setLoop(loop);
            };
            FallbackAudio.prototype.load = function () {
                this.soundImpl.onload = this.onload;
                this.soundImpl.onprogress = this.onprogress;
                this.soundImpl.onerror = this.onerror;
                this.soundImpl.load();
            };
            FallbackAudio.prototype.isPlaying = function () {
                return this.soundImpl.isPlaying();
            };
            FallbackAudio.prototype.play = function () {
                return this.soundImpl.play();
            };
            FallbackAudio.prototype.pause = function () {
                this.soundImpl.pause();
            };
            FallbackAudio.prototype.stop = function () {
                this.soundImpl.stop();
            };
            return FallbackAudio;
        })();
        Internal.FallbackAudio = FallbackAudio;
        var AudioTag = (function () {
            function AudioTag(path, volume) {
                var _this = this;
                this.path = path;
                this.audioElements = new Array(5);
                this._loadedAudio = null;
                this.isLoaded = false;
                this.index = 0;
                this.log = ex.Logger.getInstance();
                this._isPlaying = false;
                this._currentOffset = 0;
                this.onload = function () {
                };
                this.onprogress = function () {
                };
                this.onerror = function () {
                };
                for (var i = 0; i < this.audioElements.length; i++) {
                    (function (i) {
                        _this.audioElements[i] = new Audio();
                    })(i);
                }
                if (volume) {
                    this.setVolume(ex.Util.clamp(volume, 0, 1.0));
                }
                else {
                    this.setVolume(1.0);
                }
            }
            AudioTag.prototype.isPlaying = function () {
                return this._isPlaying;
            };
            AudioTag.prototype.audioLoaded = function () {
                this.isLoaded = true;
            };
            AudioTag.prototype.setVolume = function (volume) {
                this.audioElements.forEach(function (a) {
                    a.volume = volume;
                });
            };
            AudioTag.prototype.setLoop = function (loop) {
                this.audioElements.forEach(function (a) {
                    a.loop = loop;
                });
            };
            AudioTag.prototype.getLoop = function () {
                this.audioElements.some(function (a) { return a.loop; });
            };
            AudioTag.prototype.load = function () {
                var _this = this;
                var request = new XMLHttpRequest();
                request.open("GET", this.path, true);
                request.responseType = 'blob';
                request.onprogress = this.onprogress;
                request.onerror = this.onerror;
                request.onload = function (e) {
                    if (request.status !== 200) {
                        _this.log.error("Failed to load audio resource ", _this.path, " server responded with error code", request.status);
                        _this.onerror(request.response);
                        _this.isLoaded = false;
                        return;
                    }
                    _this._loadedAudio = URL.createObjectURL(request.response);
                    _this.audioElements.forEach(function (a) {
                        a.src = _this._loadedAudio;
                    });
                    _this.onload(e);
                };
                request.send();
            };
            AudioTag.prototype.play = function () {
                var _this = this;
                this.audioElements[this.index].load();
                //this.audioElements[this.index].currentTime = this._currentOffset;
                this.audioElements[this.index].play();
                this._currentOffset = 0;
                var done = new ex.Promise();
                this._isPlaying = true;
                if (!this.getLoop()) {
                    this.audioElements[this.index].addEventListener('ended', function () {
                        _this._isPlaying = false;
                        done.resolve(true);
                    });
                }
                this.index = (this.index + 1) % this.audioElements.length;
                return done;
            };
            AudioTag.prototype.pause = function () {
                this.index = (this.index - 1 + this.audioElements.length) % this.audioElements.length;
                this._currentOffset = this.audioElements[this.index].currentTime;
                this.audioElements.forEach(function (a) {
                    a.pause();
                });
                this._isPlaying = false;
            };
            AudioTag.prototype.stop = function () {
                this.audioElements.forEach(function (a) {
                    a.pause();
                    //a.currentTime = 0;
                });
                this._isPlaying = false;
            };
            return AudioTag;
        })();
        Internal.AudioTag = AudioTag;
        if (window.AudioContext) {
            var audioContext = new window.AudioContext();
        }
        var WebAudio = (function () {
            function WebAudio(soundPath, volume) {
                this.context = audioContext;
                this.volume = this.context.createGain();
                this.buffer = null;
                this.sound = null;
                this.path = "";
                this.isLoaded = false;
                this.loop = false;
                this._isPlaying = false;
                this._isPaused = false;
                this._currentOffset = 0;
                this.logger = ex.Logger.getInstance();
                this.onload = function () {
                };
                this.onprogress = function () {
                };
                this.onerror = function () {
                };
                this.path = soundPath;
                if (volume) {
                    this.volume.gain.value = ex.Util.clamp(volume, 0, 1.0);
                }
                else {
                    this.volume.gain.value = 1.0; // max volume
                }
            }
            WebAudio.prototype.setVolume = function (volume) {
                this.volume.gain.value = volume;
            };
            WebAudio.prototype.load = function () {
                var _this = this;
                var request = new XMLHttpRequest();
                request.open('GET', this.path);
                request.responseType = 'arraybuffer';
                request.onprogress = this.onprogress;
                request.onerror = this.onerror;
                request.onload = function () {
                    if (request.status !== 200) {
                        _this.logger.error("Failed to load audio resource ", _this.path, " server responded with error code", request.status);
                        _this.onerror(request.response);
                        _this.isLoaded = false;
                        return;
                    }
                    _this.context.decodeAudioData(request.response, function (buffer) {
                        _this.buffer = buffer;
                        _this.isLoaded = true;
                        _this.onload(_this);
                    }, function (e) {
                        _this.logger.error("Unable to decode " + _this.path + " this browser may not fully support this format, or the file may be corrupt, " + "if this is an mp3 try removing id3 tags and album art from the file.");
                        _this.isLoaded = false;
                        _this.onload(_this);
                    });
                };
                try {
                    request.send();
                }
                catch (e) {
                    console.error("Error loading sound! If this is a cross origin error, you must host your sound with your html and javascript.");
                }
            };
            WebAudio.prototype.setLoop = function (loop) {
                this.loop = loop;
            };
            WebAudio.prototype.isPlaying = function () {
                return this._isPlaying;
            };
            WebAudio.prototype.play = function () {
                var _this = this;
                if (this.isLoaded) {
                    this.sound = this.context.createBufferSource();
                    this.sound.buffer = this.buffer;
                    this.sound.loop = this.loop;
                    this.sound.connect(this.volume);
                    this.volume.connect(this.context.destination);
                    this.sound.start(0, this._currentOffset % this.buffer.duration);
                    this._currentOffset = 0;
                    var done;
                    if (!this._isPaused || !this._playPromise) {
                        done = new ex.Promise();
                    }
                    else {
                        done = this._playPromise;
                    }
                    this._isPaused = false;
                    this._isPlaying = true;
                    if (!this.loop) {
                        this.sound.onended = (function () {
                            _this._isPlaying = false;
                            if (!_this._isPaused) {
                                done.resolve(true);
                            }
                        }).bind(this);
                    }
                    this._playPromise = done;
                    return done;
                }
                else {
                    return ex.Promise.wrap(true);
                }
            };
            WebAudio.prototype.pause = function () {
                if (this._isPlaying) {
                    try {
                        window.clearTimeout(this._playingTimer);
                        this.sound.stop(0);
                        this._currentOffset = this.context.currentTime;
                        this._isPlaying = false;
                        this._isPaused = true;
                    }
                    catch (e) {
                        this.logger.warn("The sound clip", this.path, "has already been paused!");
                    }
                }
            };
            WebAudio.prototype.stop = function () {
                if (this.sound) {
                    try {
                        window.clearTimeout(this._playingTimer);
                        this._currentOffset = 0;
                        this.sound.stop(0);
                        this._isPlaying = false;
                        this._isPaused = false;
                    }
                    catch (e) {
                        this.logger.warn("The sound clip", this.path, "has already been stopped!");
                    }
                }
            };
            return WebAudio;
        })();
        Internal.WebAudio = WebAudio;
    })(Internal = ex.Internal || (ex.Internal = {}));
})(ex || (ex = {}));
/// <reference path="Log.ts" />
// Promises/A+ Spec http://promises-aplus.github.io/promises-spec/
var ex;
(function (ex) {
    /**
     * Valid states for a promise to be in
     * @class PromiseState
     */
    (function (PromiseState) {
        /**
        @property Resolved {PromiseState}
        */
        PromiseState[PromiseState["Resolved"] = 0] = "Resolved";
        /**
        @property Rejected {PromiseState}
        */
        PromiseState[PromiseState["Rejected"] = 1] = "Rejected";
        /**
        @property Pending {PromiseState}
        */
        PromiseState[PromiseState["Pending"] = 2] = "Pending";
    })(ex.PromiseState || (ex.PromiseState = {}));
    var PromiseState = ex.PromiseState;
    /**
     * Promises/A+ spec implementation of promises
     * @class Promise
     * @constructor
     */
    var Promise = (function () {
        function Promise() {
            this._state = 2 /* Pending */;
            this.successCallbacks = [];
            this.rejectCallback = function () {
            };
            this.logger = ex.Logger.getInstance();
        }
        /**
         * Wrap a value in a resolved promise
         * @method wrap<T>
         * @param [value=undefined] {T} An optional value to wrap in a resolved promise
         * @returns Promise&lt;T&gt;
         */
        Promise.wrap = function (value) {
            var promise = (new Promise()).resolve(value);
            return promise;
        };
        /**
         * Returns a new promise that resolves when all the promises passed to it resolve, or rejects
         * when at least 1 promise rejects.
         * @param promises {Promise[]}
         * @returns Promise
         */
        Promise.join = function () {
            var promises = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                promises[_i - 0] = arguments[_i];
            }
            var joinedPromise = new Promise();
            if (!promises) {
                return joinedPromise.resolve();
            }
            var total = promises.length;
            var successes = 0;
            var rejects = 0;
            var errors = [];
            promises.forEach(function (p) {
                p.then(function () {
                    successes += 1;
                    if (successes === total) {
                        joinedPromise.resolve();
                    }
                    else if (successes + rejects + errors.length === total) {
                        joinedPromise.reject(errors);
                    }
                }, function () {
                    rejects += 1;
                    if (successes + rejects + errors.length === total) {
                        joinedPromise.reject(errors);
                    }
                }).error(function (e) {
                    errors.push(e);
                    if ((errors.length + successes + rejects) === total) {
                        joinedPromise.reject(errors);
                    }
                });
            });
            return joinedPromise;
        };
        /**
         * Chain success and reject callbacks after the promise is resovled
         * @method then
         * @param successCallback {T=>any} Call on resolution of promise
         * @param rejectCallback {any=>any} Call on rejection of promise
         * @returns Promise&lt;T&gt;
         */
        Promise.prototype.then = function (successCallback, rejectCallback) {
            if (successCallback) {
                this.successCallbacks.push(successCallback);
                // If the promise is already resovled call immediately
                if (this.state() === 0 /* Resolved */) {
                    try {
                        successCallback.call(this, this.value);
                    }
                    catch (e) {
                        this.handleError(e);
                    }
                }
            }
            if (rejectCallback) {
                this.rejectCallback = rejectCallback;
                // If the promise is already rejected call immediately
                if (this.state() === 1 /* Rejected */) {
                    try {
                        rejectCallback.call(this, this.value);
                    }
                    catch (e) {
                        this.handleError(e);
                    }
                }
            }
            return this;
        };
        /**
         * Add an error callback to the promise
         * @method error
         * @param errorCallback {any=>any} Call if there was an error in a callback
         * @returns Promise&lt;T&gt;
         */
        Promise.prototype.error = function (errorCallback) {
            if (errorCallback) {
                this.errorCallback = errorCallback;
            }
            return this;
        };
        /**
         * Resolve the promise and pass an option value to the success callbacks
         * @method resolve
         * @param [value=undefined] {T} Value to pass to the success callbacks
         */
        Promise.prototype.resolve = function (value) {
            var _this = this;
            if (this._state === 2 /* Pending */) {
                this.value = value;
                try {
                    this._state = 0 /* Resolved */;
                    this.successCallbacks.forEach(function (cb) {
                        cb.call(_this, _this.value);
                    });
                }
                catch (e) {
                    this.handleError(e);
                }
            }
            else {
                throw new Error('Cannot resolve a promise that is not in a pending state!');
            }
            return this;
        };
        /**
         * Reject the promise and pass an option value to the reject callbacks
         * @method reject
         * @param [value=undefined] {T} Value to pass to the reject callbacks
         */
        Promise.prototype.reject = function (value) {
            if (this._state === 2 /* Pending */) {
                this.value = value;
                try {
                    this._state = 1 /* Rejected */;
                    this.rejectCallback.call(this, this.value);
                }
                catch (e) {
                    this.handleError(e);
                }
            }
            else {
                throw new Error('Cannot reject a promise that is not in a pending state!');
            }
            return this;
        };
        /**
         * Inpect the current state of a promise
         * @method state
         * @returns PromiseState
         */
        Promise.prototype.state = function () {
            return this._state;
        };
        Promise.prototype.handleError = function (e) {
            if (this.errorCallback) {
                this.errorCallback.call(this, e);
            }
            else {
                throw e;
            }
        };
        return Promise;
    })();
    ex.Promise = Promise;
})(ex || (ex = {}));
/// <reference path="Interfaces/ILoadable.ts" />
var ex;
(function (ex) {
    /**
     * The Resource type allows games built in Excalibur to load generic resources.
     * For any type of remote resource it is recome
     * @class Resource
     * @extend ILoadable
     * @constructor
     * @param path {string} Path to the remote resource
     */
    var Resource = (function () {
        function Resource(path, responseType, bustCache) {
            if (bustCache === void 0) { bustCache = true; }
            this.path = path;
            this.responseType = responseType;
            this.bustCache = bustCache;
            this.data = null;
            this.logger = ex.Logger.getInstance();
            this.onprogress = function () {
            };
            this.oncomplete = function () {
            };
            this.onerror = function () {
            };
        }
        /**
         * Returns true if the Resource is completely loaded and is ready
         * to be drawn.
         * @method isLoaded
         * @returns boolean
         */
        Resource.prototype.isLoaded = function () {
            return !!this.data;
        };
        Resource.prototype.wireEngine = function (engine) {
            this._engine = engine;
        };
        Resource.prototype.cacheBust = function (uri) {
            var query = /\?\w*=\w*/;
            if (query.test(uri)) {
                uri += ("&__=" + Date.now());
            }
            else {
                uri += ("?__=" + Date.now());
            }
            return uri;
        };
        Resource.prototype._start = function (e) {
            this.logger.debug("Started loading resource " + this.path);
        };
        /**
         * Begin loading the resource and returns a promise to be resolved on completion
         * @method load
         * @returns Promise&lt;any&gt;
         */
        Resource.prototype.load = function () {
            var _this = this;
            var complete = new ex.Promise();
            var request = new XMLHttpRequest();
            request.open("GET", this.bustCache ? this.cacheBust(this.path) : this.path, true);
            request.responseType = this.responseType;
            request.onloadstart = function (e) {
                _this._start(e);
            };
            request.onprogress = this.onprogress;
            request.onerror = this.onerror;
            request.onload = function (e) {
                if (request.status !== 200) {
                    _this.logger.error("Failed to load resource ", _this.path, " server responded with error code", request.status);
                    _this.onerror(request.response);
                    complete.resolve(request.response);
                    return;
                }
                _this.data = _this.processDownload(request.response);
                _this.oncomplete();
                _this.logger.debug("Completed loading resource", _this.path);
                complete.resolve(_this.data);
            };
            request.send();
            return complete;
        };
        /**
         * Returns the loaded data once the resource is loaded
         * @method GetData
         * @returns any
         */
        Resource.prototype.getData = function () {
            return this.data;
        };
        /**
         * This method is meant to be overriden to handle any additional
         * processing. Such as decoding downloaded audio bits.
         * @method ProcessDownload
         */
        Resource.prototype.processDownload = function (data) {
            // Handle any additional loading after the xhr has completed.
            return URL.createObjectURL(data);
        };
        return Resource;
    })();
    ex.Resource = Resource;
})(ex || (ex = {}));
/// <reference path="Sound.ts" />
/// <reference path="Util.ts" />
/// <reference path="Promises.ts" />
/// <reference path="Resource.ts" />
/// <reference path="Interfaces/ILoadable.ts" />
var ex;
(function (ex) {
    /**
     * The Texture object allows games built in Excalibur to load image resources.
     * It is generally recommended to preload images using the "Texture" object.
     * @class Texture
     * @extend Resource
     * @constructor
     * @param path {string} Path to the image resource
     * @param [bustCache=true] {boolean} Optionally load texture with cache busting
     */
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(path, bustCache) {
            if (bustCache === void 0) { bustCache = true; }
            _super.call(this, path, 'blob', bustCache);
            this.path = path;
            this.bustCache = bustCache;
            this.loaded = new ex.Promise();
            this._isLoaded = false;
            this._sprite = null;
            this._sprite = new ex.Sprite(this, 0, 0, 0, 0);
        }
        /**
         * Returns true if the Texture is completely loaded and is ready
         * to be drawn.
         * @method isLoaded
         * @returns boolean
         */
        Texture.prototype.isLoaded = function () {
            return this._isLoaded;
        };
        /**
         * Begins loading the texture and returns a promise to be resolved on completion
         * @method load
         * @returns Promise&lt;HTMLImageElement&gt;
         */
        Texture.prototype.load = function () {
            var _this = this;
            var complete = new ex.Promise();
            var loaded = _super.prototype.load.call(this);
            loaded.then(function () {
                _this.image = new Image();
                _this.image.addEventListener("load", function () {
                    _this._isLoaded = true;
                    _this.width = _this._sprite.swidth = _this._sprite.width = _this.image.naturalWidth;
                    _this.height = _this._sprite.sheight = _this._sprite.height = _this.image.naturalHeight;
                    _this.loaded.resolve(_this.image);
                    complete.resolve(_this.image);
                });
                _this.image.src = _super.prototype.getData.call(_this);
            }, function () {
                complete.reject("Error loading texture.");
            });
            return complete;
        };
        Texture.prototype.asSprite = function () {
            return this._sprite;
        };
        return Texture;
    })(ex.Resource);
    ex.Texture = Texture;
    /**
     * The Sound object allows games built in Excalibur to load audio
     * components, from soundtracks to sound effects. It is generally
     * recommended to load sound resources when using Excalibur
     * @class Sound
     * @extend Resource
     * @constructor
     * @param ...paths {string[]} A list of audio sources (clip.wav, clip.mp3, clip.ogg) for this audio clip. This is done for browser compatibility.
     */
    var Sound = (function () {
        function Sound() {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i - 0] = arguments[_i];
            }
            this.logger = ex.Logger.getInstance();
            this.onprogress = function () {
            };
            this.oncomplete = function () {
            };
            this.onerror = function () {
            };
            this.onload = function () {
            };
            this._isLoaded = false;
            this._selectedFile = "";
            this._wasPlayingOnHidden = false;
            /* Chrome : MP3, WAV, Ogg
             * Firefox : WAV, Ogg,
             * IE : MP3, WAV coming soon
             * Safari MP3, WAV, Ogg
             */
            this._selectedFile = "";
            for (var i = 0; i < paths.length; i++) {
                if (Sound.canPlayFile(paths[i])) {
                    this._selectedFile = paths[i];
                    break;
                }
            }
            if (!this._selectedFile) {
                this.logger.warn("This browser does not support any of the files specified");
                this._selectedFile = paths[0]; // select the first specified
            }
            this.sound = new ex.Internal.FallbackAudio(this._selectedFile, 1.0);
        }
        Sound.canPlayFile = function (file) {
            try {
                var a = new Audio();
                var filetype = /.*\.([A-Za-z0-9]+)$/;
                var type = file.match(filetype)[1];
                if (a.canPlayType('audio/' + type)) {
                    return true;
                }
                {
                    return false;
                }
            }
            catch (e) {
                ex.Logger.getInstance().warn("Cannot determine audio support, assuming no support for the Audio Tag", e);
                return false;
            }
        };
        Sound.prototype.wireEngine = function (engine) {
            var _this = this;
            if (engine) {
                this._engine = engine;
                this._engine.on('hidden', function () {
                    if (engine.pauseAudioWhenHidden && _this.isPlaying()) {
                        _this._wasPlayingOnHidden = true;
                        _this.pause();
                    }
                });
                this._engine.on('visible', function () {
                    if (engine.pauseAudioWhenHidden && _this._wasPlayingOnHidden) {
                        _this.play();
                        _this._wasPlayingOnHidden = false;
                    }
                });
            }
        };
        /**
         * Sets the volume of the sound clip
         * @method setVolume
         * @param volume {number} A volume value between 0-1.0
         */
        Sound.prototype.setVolume = function (volume) {
            if (this.sound)
                this.sound.setVolume(volume);
        };
        /**
         * Indicates whether the clip should loop when complete
         * @method setLoop
         * @param loop {boolean} Set the looping flag
         */
        Sound.prototype.setLoop = function (loop) {
            if (this.sound)
                this.sound.setLoop(loop);
        };
        Sound.prototype.isPlaying = function () {
            if (this.sound)
                return this.sound.isPlaying();
        };
        /**
         * Play the sound, returns a promise that resolves when the sound is done playing
         * @method play
         * @return ex.Promise
         */
        Sound.prototype.play = function () {
            if (this.sound)
                return this.sound.play();
        };
        /**
         * Stop the sound, and do not rewind
         * @method pause
         */
        Sound.prototype.pause = function () {
            if (this.sound)
                this.sound.pause();
        };
        /**
         * Stop the sound and rewind
         * @method stop
         */
        Sound.prototype.stop = function () {
            if (this.sound)
                this.sound.stop();
        };
        /**
         * Returns true if the sound is loaded
         * @method isLoaded
         */
        Sound.prototype.isLoaded = function () {
            return this._isLoaded;
        };
        /**
         * Begins loading the sound and returns a promise to be resolved on completion
         * @method load
         * @returns Promise&lt;Sound&gt;
         */
        Sound.prototype.load = function () {
            var _this = this;
            var complete = new ex.Promise();
            this.logger.debug("Started loading sound", this._selectedFile);
            this.sound.onprogress = this.onprogress;
            this.sound.onload = function () {
                _this.oncomplete();
                _this._isLoaded = true;
                _this.logger.debug("Completed loading sound", _this._selectedFile);
                complete.resolve(_this.sound);
            };
            this.sound.onerror = function (e) {
                _this.onerror(e);
                complete.resolve(e);
            };
            this.sound.load();
            return complete;
        };
        return Sound;
    })();
    ex.Sound = Sound;
    /**
     * The loader provides a mechanism to preload multiple resources at
     * one time. The loader must be passed to the engine in order to
     * trigger the loading progress bar
     * @class Loader
     * @extend ILoadable
     * @constructor
     * @param [loadables=undefined] {ILoadable[]} Optionally provide the list of resources you want to load at constructor time
     */
    var Loader = (function () {
        function Loader(loadables) {
            this.resourceList = [];
            this.index = 0;
            this.resourceCount = 0;
            this.numLoaded = 0;
            this.progressCounts = {};
            this.totalCounts = {};
            this.onprogress = function () {
            };
            this.oncomplete = function () {
            };
            this.onerror = function () {
            };
            if (loadables) {
                this.addResources(loadables);
            }
        }
        Loader.prototype.wireEngine = function (engine) {
            this._engine = engine;
        };
        /**
         * Add a resource to the loader to load
         * @method addResource
         * @param loadable {ILoadable} Resource to add
         */
        Loader.prototype.addResource = function (loadable) {
            var key = this.index++;
            this.resourceList.push(loadable);
            this.progressCounts[key] = 0;
            this.totalCounts[key] = 1;
            this.resourceCount++;
        };
        /**
         * Add a list of resources to the loader to load
         * @method addResources
         * @param loadables {ILoadable[]} The list of resources to load
         */
        Loader.prototype.addResources = function (loadables) {
            var _this = this;
            loadables.forEach(function (l) {
                _this.addResource(l);
            });
        };
        Loader.prototype.sumCounts = function (obj) {
            var sum = 0;
            var prev = 0;
            for (var i in obj) {
                sum += obj[i] | 0;
            }
            return sum;
        };
        /**
         * Returns true if the loader has completely loaded all resources
         * @method isLoaded
         */
        Loader.prototype.isLoaded = function () {
            return this.numLoaded === this.resourceCount;
        };
        /**
         * Begin loading all of the supplied resources, returning a promise that resolves when loading of all is complete
         * @method load
         * @returns Promsie&lt;any&gt;
         */
        Loader.prototype.load = function () {
            var _this = this;
            var complete = new ex.Promise();
            var me = this;
            if (this.resourceList.length === 0) {
                me.oncomplete.call(me);
                return complete;
            }
            var progressArray = new Array(this.resourceList.length);
            var progressChunks = this.resourceList.length;
            this.resourceList.forEach(function (r, i) {
                if (_this._engine) {
                    r.wireEngine(_this._engine);
                }
                r.onprogress = function (e) {
                    var total = e.total;
                    var loaded = e.loaded;
                    progressArray[i] = { loaded: ((loaded / total) * (100 / progressChunks)), total: 100 };
                    var progressResult = progressArray.reduce(function (accum, next) {
                        return { loaded: (accum.loaded + next.loaded), total: 100 };
                    }, { loaded: 0, total: 100 });
                    me.onprogress.call(me, progressResult);
                };
                r.oncomplete = r.onerror = function () {
                    me.numLoaded++;
                    if (me.numLoaded === me.resourceCount) {
                        me.onprogress.call(me, { loaded: 100, total: 100 });
                        me.oncomplete.call(me);
                        complete.resolve();
                    }
                };
            });
            function loadNext(list, index) {
                if (!list[index])
                    return;
                list[index].load().then(function () {
                    loadNext(list, index + 1);
                });
            }
            loadNext(this.resourceList, 0);
            return complete;
        };
        return Loader;
    })();
    ex.Loader = Loader;
})(ex || (ex = {}));
/// <reference path="Promises.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Log.ts" />
var ex;
(function (ex) {
    /**
     * Excalibur's built in templating class, it is a loadable that will load
     * and html fragment from a url. Excalibur templating is very basic only
     * allowing bindings of the type data-text="this.obj.someprop",
     * data-style="color:this.obj.color.toString()". Bindings allow all valid
     * javascript expressions.
     * @class Template
     * @extends ILoadable
     * @constructor
     * @param path {string} Location of the html template
     */
    var Template = (function () {
        function Template(path) {
            this.path = path;
            this._isLoaded = false;
            this.logger = ex.Logger.getInstance();
            this.onprogress = function () {
            };
            this.oncomplete = function () {
            };
            this.onerror = function () {
            };
            this._innerElement = document.createElement('div');
            this._innerElement.className = "excalibur-template";
        }
        Template.prototype.wireEngine = function (engine) {
            this._engine = engine;
        };
        /**
         * Returns the full html template string once loaded.
         * @method getTemplateString
         * @returns string
         */
        Template.prototype.getTemplateString = function () {
            if (!this._isLoaded)
                return "";
            return this._htmlString;
        };
        Template.prototype._compile = function () {
            this._innerElement.innerHTML = this._htmlString;
            this._styleElements = this._innerElement.querySelectorAll('[data-style]');
            this._textElements = this._innerElement.querySelectorAll('[data-text]');
        };
        Template.prototype._evaluateExpresion = function (expression, ctx) {
            var func = new Function("return " + expression + ";");
            var val = func.call(ctx);
            return val;
        };
        /**
         * Applies any ctx object you wish and evaluates the template.
         * Overload this method to include your favorite template library.
         * You may return either an HTML string or a Dom node.
         * @method apply
         * @param ctx {any} Any object you wish to apply to the template
         * @returns any
         */
        Template.prototype.apply = function (ctx) {
            var _this = this;
            for (var j = 0; j < this._styleElements.length; j++) {
                (function () {
                    // poor man's json parse for things that aren't exactly json :(
                    // Extract style expressions
                    var styles = {};
                    _this._styleElements[j].dataset["style"].split(";").forEach(function (s) {
                        if (s) {
                            var vals = s.split(":");
                            styles[vals[0].trim()] = vals[1].trim();
                        }
                    });
                    for (var style in styles) {
                        (function () {
                            var expression = styles[style];
                            _this._styleElements[j].style[style] = _this._evaluateExpresion(expression, ctx);
                        })();
                    }
                })();
            }
            for (var i = 0; i < this._textElements.length; i++) {
                (function () {
                    // Evaluate text expressions
                    var expression = _this._textElements[i].dataset["text"];
                    _this._textElements[i].innerText = _this._evaluateExpresion(expression, ctx);
                })();
            }
            // If the template HTML has a root element return that, otherwise use constructed root
            if (this._innerElement.children.length === 1) {
                this._innerElement = this._innerElement.firstChild;
            }
            return this._innerElement;
        };
        /**
         * Begins loading the template. Returns a promise that resolves with the template string when loaded.
         * @method load
         * @returns {Promise}
         */
        Template.prototype.load = function () {
            var _this = this;
            var complete = new ex.Promise();
            var request = new XMLHttpRequest();
            request.open("GET", this.path, true);
            request.responseType = "text";
            request.onprogress = this.onprogress;
            request.onerror = this.onerror;
            request.onload = function (e) {
                if (request.status !== 200) {
                    _this.logger.error("Failed to load html template resource ", _this.path, " server responded with error code", request.status);
                    _this.onerror(request.response);
                    _this._isLoaded = false;
                    complete.resolve("error");
                    return;
                }
                _this._htmlString = request.response;
                _this.oncomplete();
                _this.logger.debug("Completed loading template", _this.path);
                _this._compile();
                _this._isLoaded = true;
                complete.resolve(_this._htmlString);
            };
            if (request.overrideMimeType) {
                request.overrideMimeType('text/plain; charset=x-user-defined');
            }
            request.send();
            return complete;
        };
        /**
         * Indicates whether the template has been loaded
         * @method isLoaded
         * @returns {boolean}
         */
        Template.prototype.isLoaded = function () {
            return this._isLoaded;
        };
        return Template;
    })();
    ex.Template = Template;
    /**
     * Excalibur's binding library that allows you to bind an html
     * template to the dom given a certain context. Excalibur bindings are only updated
     * when the update() method is called
     * @class Binding
     * @constructor
     * @param parentElementId {string} The id of the element in the dom to attach the template binding
     * @param template {Template} The template you wish to bind
     * @param ctx {any} The context of the binding, which can be any object
     */
    var Binding = (function () {
        function Binding(parentElementId, template, ctx) {
            this.parent = document.getElementById(parentElementId);
            this.template = template;
            this._ctx = ctx;
            this.update();
        }
        /**
         * Listen to any arbitrary object's events to update this binding
         * @method listen
         * @param obj {any} Any object that supports addEventListener
         * @param events {string[]} A list of events to listen for
         * @param [hander=defaultHandler] {callback} A optional handler to fire on any event
         */
        Binding.prototype.listen = function (obj, events, handler) {
            var _this = this;
            // todo
            if (!handler) {
                handler = function () {
                    _this.update();
                };
            }
            if (obj.addEventListener) {
                events.forEach(function (e) {
                    obj.addEventListener(e, handler);
                });
            }
        };
        /**
         * Update this template binding with the latest values from the ctx reference passed to the constructor
         * @method update
         */
        Binding.prototype.update = function () {
            var html = this._applyTemplate(this.template, this._ctx);
            if (html instanceof String) {
                this.parent.innerHTML = html;
            }
            if (html instanceof Node) {
                if (this.parent.lastChild !== html) {
                    this.parent.appendChild(html);
                }
            }
        };
        Binding.prototype._applyTemplate = function (template, ctx) {
            if (template.isLoaded()) {
                return template.apply(ctx);
            }
        };
        return Binding;
    })();
    ex.Binding = Binding;
})(ex || (ex = {}));
/// <reference path="Actor.ts" />
var ex;
(function (ex) {
    /**
     * Enum representing the different horizontal text alignments
     * @class TextAlign
     */
    (function (TextAlign) {
        /**
         * The text is left-aligned.
         * @property Left
         * @static
         */
        TextAlign[TextAlign["Left"] = 0] = "Left";
        /**
         * The text is right-aligned.
         * @property Right
         * @static
         */
        TextAlign[TextAlign["Right"] = 1] = "Right";
        /**
         * The text is centered.
         * @property Center
         * @static
         */
        TextAlign[TextAlign["Center"] = 2] = "Center";
        /**
         * The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
         * @property Start
         * @static
         */
        TextAlign[TextAlign["Start"] = 3] = "Start";
        /**
         * The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
         * @property End
         * @static
         */
        TextAlign[TextAlign["End"] = 4] = "End";
    })(ex.TextAlign || (ex.TextAlign = {}));
    var TextAlign = ex.TextAlign;
    /**
     * Enum representing the different baseline text alignments
     * @class BaseAlign
     */
    (function (BaseAlign) {
        /**
         * The text baseline is the top of the em square.
         * @property Top
         * @static
         */
        BaseAlign[BaseAlign["Top"] = 0] = "Top";
        /**
         * The text baseline is the hanging baseline.  Currently unsupported; this will act like alphabetic.
         * @property Hanging
         * @static
         */
        BaseAlign[BaseAlign["Hanging"] = 1] = "Hanging";
        /**
         * The text baseline is the middle of the em square.
         * @property Middle
         * @static
         */
        BaseAlign[BaseAlign["Middle"] = 2] = "Middle";
        /**
         * The text baseline is the normal alphabetic baseline.
         * @property Alphabetic
         * @static
         */
        BaseAlign[BaseAlign["Alphabetic"] = 3] = "Alphabetic";
        /**
         * The text baseline is the ideographic baseline; this is the bottom of
         * the body of the characters, if the main body of characters protrudes
         * beneath the alphabetic baseline.  Currently unsupported; this will
         * act like alphabetic.
         * @property Ideographic
         * @static
         */
        BaseAlign[BaseAlign["Ideographic"] = 4] = "Ideographic";
        /**
         * The text baseline is the bottom of the bounding box.  This differs
         * from the ideographic baseline in that the ideographic baseline
         * doesn't consider descenders.
         * @property Bottom
         * @static
         */
        BaseAlign[BaseAlign["Bottom"] = 5] = "Bottom";
    })(ex.BaseAlign || (ex.BaseAlign = {}));
    var BaseAlign = ex.BaseAlign;
    /**
     * Labels are the way to draw small amounts of text to the screen in Excalibur. They are
     * actors and inherit all of the benifits and capabilities.
     * @class Label
     * @extends Actor
     * @constructor
     * @param [text=empty] {string} The text of the label
     * @param [x=0] {number} The x position of the label
     * @param [y=0] {number} The y position of the label
     * @param [font=sans-serif] {string} Use any valid css font string for the label's font. Default is "10px sans-serif".
     * @param [spriteFont=undefined] {SpriteFont} Use an Excalibur sprite font for the label's font, if a SpriteFont is provided it will take precendence over a css font.
     *
     */
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text, x, y, font, spriteFont) {
            _super.call(this, x, y);
            /**
             * Gets or sets the letter spacing on a Label. Only supported with Sprite Fonts.
             * @property [letterSpacing=0] {number}
             */
            this.letterSpacing = 0; //px
            this.caseInsensitive = true;
            this._textShadowOn = false;
            this._shadowOffsetX = 0;
            this._shadowOffsetY = 0;
            this._shadowColor = ex.Color.Black.clone();
            this._shadowColorDirty = false;
            this._textSprites = {};
            this._shadowSprites = {};
            this._color = ex.Color.Black.clone();
            this.text = text || "";
            this.color = ex.Color.Black.clone();
            this.spriteFont = spriteFont;
            this.collisionType = 0 /* PreventCollision */;
            this.font = font || "10px sans-serif"; // coallesce to default canvas font
            if (spriteFont) {
                this._textSprites = spriteFont.getTextSprites();
            }
        }
        /**
         * Returns the width of the text in the label (in pixels);
         * @method getTextWidth {number}
         * @param ctx {CanvasRenderingContext2D} Rending context to measure the string with
         */
        Label.prototype.getTextWidth = function (ctx) {
            var oldFont = ctx.font;
            ctx.font = this.font;
            var width = ctx.measureText(this.text).width;
            ctx.font = oldFont;
            return width;
        };
        // TypeScript doesn't support string enums :(
        Label.prototype._lookupTextAlign = function (textAlign) {
            switch (textAlign) {
                case 0 /* Left */:
                    return "left";
                    break;
                case 1 /* Right */:
                    return "right";
                    break;
                case 2 /* Center */:
                    return "center";
                    break;
                case 4 /* End */:
                    return "end";
                    break;
                case 3 /* Start */:
                    return "start";
                    break;
                default:
                    return "start";
                    break;
            }
        };
        Label.prototype._lookupBaseAlign = function (baseAlign) {
            switch (baseAlign) {
                case 3 /* Alphabetic */:
                    return "alphabetic";
                    break;
                case 5 /* Bottom */:
                    return "bottom";
                    break;
                case 1 /* Hanging */:
                    return "hangin";
                    break;
                case 4 /* Ideographic */:
                    return "ideographic";
                    break;
                case 2 /* Middle */:
                    return "middle";
                    break;
                case 0 /* Top */:
                    return "top";
                    break;
                default:
                    return "alphabetic";
                    break;
            }
        };
        /**
         * Sets the text shadow for sprite fonts
         * @method setTextShadow
         * @param offsetX {number} The x offset in pixels to place the shadow
         * @param offsetY {number} The y offset in pixles to place the shadow
         * @param shadowColor {Color} The color of the text shadow
         */
        Label.prototype.setTextShadow = function (offsetX, offsetY, shadowColor) {
            this._textShadowOn = true;
            this._shadowOffsetX = offsetX;
            this._shadowOffsetY = offsetY;
            this._shadowColor = shadowColor.clone();
            this._shadowColorDirty = true;
            for (var character in this._textSprites) {
                this._shadowSprites[character] = this._textSprites[character].clone();
            }
        };
        /**
         * Clears the current text shadow
         * @method clearTextShadow
         */
        Label.prototype.clearTextShadow = function () {
            this._textShadowOn = false;
            this._shadowOffsetX = 0;
            this._shadowOffsetY = 0;
            this._shadowColor = ex.Color.Black.clone();
        };
        Label.prototype.update = function (engine, delta) {
            _super.prototype.update.call(this, engine, delta);
            if (this.spriteFont && this._color !== this.color) {
                for (var character in this._textSprites) {
                    this._textSprites[character].clearEffects();
                    this._textSprites[character].addEffect(new ex.Effects.Fill(this.color.clone()));
                    this._color = this.color;
                }
            }
            if (this.spriteFont && this._textShadowOn && this._shadowColorDirty && this._shadowColor) {
                for (var character in this._shadowSprites) {
                    this._shadowSprites[character].clearEffects();
                    this._shadowSprites[character].addEffect(new ex.Effects.Fill(this._shadowColor.clone()));
                }
                this._shadowColorDirty = false;
            }
        };
        Label.prototype.draw = function (ctx, delta) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.scale.x, this.scale.y);
            ctx.rotate(this.rotation);
            if (this._textShadowOn) {
                ctx.save();
                ctx.translate(this._shadowOffsetX, this._shadowOffsetY);
                this._fontDraw(ctx, delta, this._shadowSprites);
                ctx.restore();
            }
            this._fontDraw(ctx, delta, this._textSprites);
            _super.prototype.draw.call(this, ctx, delta);
            ctx.restore();
        };
        Label.prototype._fontDraw = function (ctx, delta, sprites) {
            if (this.spriteFont) {
                var currX = 0;
                for (var i = 0; i < this.text.length; i++) {
                    var character = this.text[i];
                    if (this.caseInsensitive) {
                        character = character.toLowerCase();
                    }
                    try {
                        var charSprite = sprites[character];
                        if (this.previousOpacity !== this.opacity) {
                            charSprite.clearEffects();
                            charSprite.addEffect(new ex.Effects.Opacity(this.opacity));
                        }
                        charSprite.draw(ctx, currX, 0);
                        currX += (charSprite.swidth + this.letterSpacing);
                    }
                    catch (e) {
                        ex.Logger.getInstance().error("SpriteFont Error drawing char " + character);
                    }
                }
                if (this.previousOpacity !== this.opacity) {
                    this.previousOpacity = this.opacity;
                }
            }
            else {
                var oldAlign = ctx.textAlign;
                var oldTextBaseline = ctx.textBaseline;
                ctx.textAlign = this._lookupTextAlign(this.textAlign);
                ctx.textBaseline = this._lookupBaseAlign(this.baseAlign);
                if (this.color) {
                    this.color.a = this.opacity;
                }
                ctx.fillStyle = this.color.toString();
                ctx.font = this.font;
                if (this.maxWidth) {
                    ctx.fillText(this.text, 0, 0, this.maxWidth);
                }
                else {
                    ctx.fillText(this.text, 0, 0);
                }
                ctx.textAlign = oldAlign;
                ctx.textBaseline = oldTextBaseline;
            }
        };
        Label.prototype.debugDraw = function (ctx) {
            _super.prototype.debugDraw.call(this, ctx);
        };
        return Label;
    })(ex.Actor);
    ex.Label = Label;
})(ex || (ex = {}));
/// <reference path="../Events.ts"/>
var ex;
(function (ex) {
    var Input;
    (function (Input) {
        (function (PointerType) {
            PointerType[PointerType["Touch"] = 0] = "Touch";
            PointerType[PointerType["Mouse"] = 1] = "Mouse";
            PointerType[PointerType["Pen"] = 2] = "Pen";
            PointerType[PointerType["Unknown"] = 3] = "Unknown";
        })(Input.PointerType || (Input.PointerType = {}));
        var PointerType = Input.PointerType;
        (function (PointerButton) {
            PointerButton[PointerButton["Left"] = 0] = "Left";
            PointerButton[PointerButton["Middle"] = 1] = "Middle";
            PointerButton[PointerButton["Right"] = 2] = "Right";
            PointerButton[PointerButton["Unknown"] = 3] = "Unknown";
        })(Input.PointerButton || (Input.PointerButton = {}));
        var PointerButton = Input.PointerButton;
        var PointerEvent = (function (_super) {
            __extends(PointerEvent, _super);
            function PointerEvent(x, y, index, pointerType, button, ev) {
                _super.call(this);
                this.x = x;
                this.y = y;
                this.index = index;
                this.pointerType = pointerType;
                this.button = button;
                this.ev = ev;
            }
            return PointerEvent;
        })(ex.GameEvent);
        Input.PointerEvent = PointerEvent;
        ;
        /**
         * Handles pointer events (mouse, touch, stylus, etc.) and normalizes to W3C Pointer Events.
         * There is always at least one pointer available (primary).
         *
         * @class Pointers
         * @extends Class
         * @constructor
         */
        var Pointers = (function (_super) {
            __extends(Pointers, _super);
            function Pointers(engine) {
                _super.call(this);
                this._pointerDown = [];
                this._pointerUp = [];
                this._pointerMove = [];
                this._pointerCancel = [];
                this._pointers = [];
                this._activePointers = [];
                this._engine = engine;
                this._pointers.push(new Pointer());
                this._activePointers = [-1];
                this.primary = this._pointers[0];
            }
            /**
             * Initializes pointer event listeners
             */
            Pointers.prototype.init = function () {
                // Touch Events
                document.addEventListener('touchstart', this._handleTouchEvent("down", this._pointerDown));
                document.addEventListener('touchend', this._handleTouchEvent("up", this._pointerUp));
                document.addEventListener('touchmove', this._handleTouchEvent("move", this._pointerMove));
                document.addEventListener('touchcancel', this._handleTouchEvent("cancel", this._pointerCancel));
                // W3C Pointer Events
                // Current: IE11, IE10
                if (window.PointerEvent) {
                    // IE11
                    this._engine.canvas.style.touchAction = "none";
                    document.addEventListener('pointerdown', this._handlePointerEvent("down", this._pointerDown));
                    document.addEventListener('pointerup', this._handlePointerEvent("up", this._pointerUp));
                    document.addEventListener('pointermove', this._handlePointerEvent("move", this._pointerMove));
                    document.addEventListener('pointercancel', this._handlePointerEvent("cancel", this._pointerMove));
                }
                else if (window.MSPointerEvent) {
                    // IE10
                    this._engine.canvas.style.msTouchAction = "none";
                    document.addEventListener('MSPointerDown', this._handlePointerEvent("down", this._pointerDown));
                    document.addEventListener('MSPointerUp', this._handlePointerEvent("up", this._pointerUp));
                    document.addEventListener('MSPointerMove', this._handlePointerEvent("move", this._pointerMove));
                    document.addEventListener('MSPointerCancel', this._handlePointerEvent("cancel", this._pointerMove));
                }
                else {
                    // Mouse Events
                    document.addEventListener('mousedown', this._handleMouseEvent("down", this._pointerDown));
                    document.addEventListener('mouseup', this._handleMouseEvent("up", this._pointerUp));
                    document.addEventListener('mousemove', this._handleMouseEvent("move", this._pointerMove));
                }
            };
            Pointers.prototype.update = function (delta) {
                this._pointerUp.length = 0;
                this._pointerDown.length = 0;
                this._pointerMove.length = 0;
                this._pointerCancel.length = 0;
            };
            /**
             * Safely gets a Pointer at a specific index and initializes one if it doesn't yet exist
             * @param index {number} The pointer index to retrieve
             */
            Pointers.prototype.at = function (index) {
                if (index >= this._pointers.length) {
                    for (var i = this._pointers.length - 1, max = index; i < max; i++) {
                        this._pointers.push(new Pointer());
                        this._activePointers.push(-1);
                    }
                }
                return this._pointers[index];
            };
            /**
             * Get number of pointers being watched
             */
            Pointers.prototype.count = function () {
                return this._pointers.length;
            };
            /**
             * Propogates events to actor if necessary
             */
            Pointers.prototype.propogate = function (actor) {
                var isUIActor = actor instanceof ex.UIActor;
                this._pointerUp.forEach(function (e) {
                    if (actor.contains(e.x, e.y, !isUIActor)) {
                        actor.eventDispatcher.publish("pointerup", e);
                    }
                });
                this._pointerDown.forEach(function (e) {
                    if (actor.contains(e.x, e.y, !isUIActor)) {
                        actor.eventDispatcher.publish("pointerdown", e);
                    }
                });
                if (actor.capturePointer.captureMoveEvents) {
                    this._pointerMove.forEach(function (e) {
                        if (actor.contains(e.x, e.y, !isUIActor)) {
                            actor.eventDispatcher.publish("pointermove", e);
                        }
                    });
                }
                this._pointerCancel.forEach(function (e) {
                    if (actor.contains(e.x, e.y, !isUIActor)) {
                        actor.eventDispatcher.publish("pointercancel", e);
                    }
                });
            };
            Pointers.prototype._handleMouseEvent = function (eventName, eventArr) {
                var _this = this;
                return function (e) {
                    e.preventDefault();
                    var x = e.pageX - ex.Util.getPosition(_this._engine.canvas).x;
                    var y = e.pageY - ex.Util.getPosition(_this._engine.canvas).y;
                    var transformedPoint = _this._engine.screenToWorldCoordinates(new ex.Point(x, y));
                    var pe = new PointerEvent(transformedPoint.x, transformedPoint.y, 0, 1 /* Mouse */, e.button, e);
                    eventArr.push(pe);
                    _this.at(0).eventDispatcher.publish(eventName, pe);
                };
            };
            Pointers.prototype._handleTouchEvent = function (eventName, eventArr) {
                var _this = this;
                return function (e) {
                    e.preventDefault();
                    for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                        var index = _this._pointers.length > 1 ? _this._getPointerIndex(e.changedTouches[i].identifier) : 0;
                        if (index === -1)
                            continue;
                        var x = e.changedTouches[i].pageX - ex.Util.getPosition(_this._engine.canvas).x;
                        var y = e.changedTouches[i].pageY - ex.Util.getPosition(_this._engine.canvas).y;
                        var transformedPoint = _this._engine.screenToWorldCoordinates(new ex.Point(x, y));
                        var pe = new PointerEvent(transformedPoint.x, transformedPoint.y, index, 0 /* Touch */, 3 /* Unknown */, e);
                        eventArr.push(pe);
                        _this.at(index).eventDispatcher.publish(eventName, pe);
                        // only with multi-pointer
                        if (_this._pointers.length > 1) {
                            if (eventName === "up") {
                                // remove pointer ID from pool when pointer is lifted
                                _this._activePointers[index] = -1;
                            }
                            else if (eventName === "down") {
                                // set pointer ID to given index
                                _this._activePointers[index] = e.changedTouches[i].identifier;
                            }
                        }
                    }
                };
            };
            Pointers.prototype._handlePointerEvent = function (eventName, eventArr) {
                var _this = this;
                return function (e) {
                    e.preventDefault();
                    // get the index for this pointer ID if multi-pointer is asked for
                    var index = _this._pointers.length > 1 ? _this._getPointerIndex(e.pointerId) : 0;
                    if (index === -1)
                        return;
                    var x = e.pageX - ex.Util.getPosition(_this._engine.canvas).x;
                    var y = e.pageY - ex.Util.getPosition(_this._engine.canvas).y;
                    var transformedPoint = _this._engine.screenToWorldCoordinates(new ex.Point(x, y));
                    var pe = new PointerEvent(transformedPoint.x, transformedPoint.y, index, _this._stringToPointerType(e.pointerType), e.button, e);
                    eventArr.push(pe);
                    _this.at(index).eventDispatcher.publish(eventName, pe);
                    // only with multi-pointer
                    if (_this._pointers.length > 1) {
                        if (eventName === "up") {
                            // remove pointer ID from pool when pointer is lifted
                            _this._activePointers[index] = -1;
                        }
                        else if (eventName === "down") {
                            // set pointer ID to given index
                            _this._activePointers[index] = e.pointerId;
                        }
                    }
                };
            };
            /**
             * Gets the index of the pointer specified for the given pointer ID or finds the next empty pointer slot available.
             * This is required because IE10/11 uses incrementing pointer IDs so we need to store a mapping of ID => idx
             * @private
             */
            Pointers.prototype._getPointerIndex = function (pointerId) {
                var idx;
                if ((idx = this._activePointers.indexOf(pointerId)) > -1) {
                    return idx;
                }
                for (var i = 0; i < this._activePointers.length; i++) {
                    if (this._activePointers[i] === -1)
                        return i;
                }
                // ignore pointer because game isn't watching
                return -1;
            };
            Pointers.prototype._stringToPointerType = function (s) {
                switch (s) {
                    case "touch":
                        return 0 /* Touch */;
                    case "mouse":
                        return 1 /* Mouse */;
                    case "pen":
                        return 2 /* Pen */;
                    default:
                        return 3 /* Unknown */;
                }
            };
            return Pointers;
        })(ex.Class);
        Input.Pointers = Pointers;
        /**
         * Captures and dispatches PointerEvents
         * @class Pointer
         * @constructor
         * @extends Class
         */
        var Pointer = (function (_super) {
            __extends(Pointer, _super);
            function Pointer() {
                _super.apply(this, arguments);
            }
            return Pointer;
        })(ex.Class);
        Input.Pointer = Pointer;
    })(Input = ex.Input || (ex.Input = {}));
})(ex || (ex = {}));
var ex;
(function (ex) {
    var Input;
    (function (Input) {
        /**
        * Enum representing input key codes
        * @class Keys
        *
        */
        (function (Keys) {
            /**
            @property Num1 {Keys}
            */
            /**
            @property Num2 {Keys}
            */
            /**
            @property Num3 {Keys}
            */
            /**
            @property Num4 {Keys}
            */
            /**
            @property Num5 {Keys}
            */
            /**
            @property Num6 {Keys}
            */
            /**
            @property Num7 {Keys}
            */
            /**
            @property Num8 {Keys}
            */
            /**
            @property Num9 {Keys}
            */
            /**
            @property Num0 {Keys}
            */
            Keys[Keys["Num1"] = 97] = "Num1";
            Keys[Keys["Num2"] = 98] = "Num2";
            Keys[Keys["Num3"] = 99] = "Num3";
            Keys[Keys["Num4"] = 100] = "Num4";
            Keys[Keys["Num5"] = 101] = "Num5";
            Keys[Keys["Num6"] = 102] = "Num6";
            Keys[Keys["Num7"] = 103] = "Num7";
            Keys[Keys["Num8"] = 104] = "Num8";
            Keys[Keys["Num9"] = 105] = "Num9";
            Keys[Keys["Num0"] = 96] = "Num0";
            /**
            @property Numlock {Keys}
            */
            Keys[Keys["Numlock"] = 144] = "Numlock";
            /**
            @property Semicolon {Keys}
            */
            Keys[Keys["Semicolon"] = 186] = "Semicolon";
            /**
            @property A {Keys}
            */
            /**
            @property B {Keys}
            */
            /**
            @property C {Keys}
            */
            /**
            @property D {Keys}
            */
            /**
            @property E {Keys}
            */
            /**
            @property F {Keys}
            */
            /**
            @property G {Keys}
            */
            /**
            @property H {Keys}
            */
            /**
            @property I {Keys}
            */
            /**
            @property J {Keys}
            */
            /**
            @property K {Keys}
            */
            /**
            @property L {Keys}
            */
            /**
            @property M {Keys}
            */
            /**
            @property N {Keys}
            */
            /**
            @property O {Keys}
            */
            /**
            @property P {Keys}
            */
            /**
            @property Q {Keys}
            */
            /**
            @property R {Keys}
            */
            /**
            @property S {Keys}
            */
            /**
            @property T {Keys}
            */
            /**
            @property U {Keys}
            */
            /**
            @property V {Keys}
            */
            /**
            @property W {Keys}
            */
            /**
            @property X {Keys}
            */
            /**
            @property Y {Keys}
            */
            /**
            @property Z {Keys}
            */
            Keys[Keys["A"] = 65] = "A";
            Keys[Keys["B"] = 66] = "B";
            Keys[Keys["C"] = 67] = "C";
            Keys[Keys["D"] = 68] = "D";
            Keys[Keys["E"] = 69] = "E";
            Keys[Keys["F"] = 70] = "F";
            Keys[Keys["G"] = 71] = "G";
            Keys[Keys["H"] = 72] = "H";
            Keys[Keys["I"] = 73] = "I";
            Keys[Keys["J"] = 74] = "J";
            Keys[Keys["K"] = 75] = "K";
            Keys[Keys["L"] = 76] = "L";
            Keys[Keys["M"] = 77] = "M";
            Keys[Keys["N"] = 78] = "N";
            Keys[Keys["O"] = 79] = "O";
            Keys[Keys["P"] = 80] = "P";
            Keys[Keys["Q"] = 81] = "Q";
            Keys[Keys["R"] = 82] = "R";
            Keys[Keys["S"] = 83] = "S";
            Keys[Keys["T"] = 84] = "T";
            Keys[Keys["U"] = 85] = "U";
            Keys[Keys["V"] = 86] = "V";
            Keys[Keys["W"] = 87] = "W";
            Keys[Keys["X"] = 88] = "X";
            Keys[Keys["Y"] = 89] = "Y";
            Keys[Keys["Z"] = 90] = "Z";
            /**
            @property Shift {Keys}
            */
            /**
            @property Alt {Keys}
            */
            /**
            @property Up {Keys}
            */
            /**
            @property Down {Keys}
            */
            /**
            @property Left {Keys}
            */
            /**
            @property Right {Keys}
            */
            /**
            @property Space {Keys}
            */
            /**
            @property Esc {Keys}
            */
            Keys[Keys["Shift"] = 16] = "Shift";
            Keys[Keys["Alt"] = 18] = "Alt";
            Keys[Keys["Up"] = 38] = "Up";
            Keys[Keys["Down"] = 40] = "Down";
            Keys[Keys["Left"] = 37] = "Left";
            Keys[Keys["Right"] = 39] = "Right";
            Keys[Keys["Space"] = 32] = "Space";
            Keys[Keys["Esc"] = 27] = "Esc";
        })(Input.Keys || (Input.Keys = {}));
        var Keys = Input.Keys;
        ;
        /**
         * Event thrown on a game object for a key event
         *
         * @class KeyEvent
         * @extends GameEvent
         * @constructor
         * @param key {InputKey} The key responsible for throwing the event
         */
        var KeyEvent = (function (_super) {
            __extends(KeyEvent, _super);
            function KeyEvent(key) {
                _super.call(this);
                this.key = key;
            }
            return KeyEvent;
        })(ex.GameEvent);
        Input.KeyEvent = KeyEvent;
        /**
         * Manages Keyboard input events that you can query or listen for events on
         *
         * @class Keyboard
         * @extends Class
         * @constructor
         *
         */
        var Keyboard = (function (_super) {
            __extends(Keyboard, _super);
            function Keyboard(engine) {
                _super.call(this);
                this._keys = [];
                this._keysUp = [];
                this._keysDown = [];
                this._engine = engine;
            }
            /**
             * Initialize Keyboard event listeners
             */
            Keyboard.prototype.init = function () {
                var _this = this;
                window.addEventListener('blur', function (ev) {
                    _this._keys.length = 0; // empties array efficiently
                });
                // key up is on window because canvas cannot have focus
                window.addEventListener('keyup', function (ev) {
                    var key = _this._keys.indexOf(ev.keyCode);
                    _this._keys.splice(key, 1);
                    _this._keysUp.push(ev.keyCode);
                    var keyEvent = new KeyEvent(ev.keyCode);
                    _this.eventDispatcher.publish("up", keyEvent);
                });
                // key down is on window because canvas cannot have focus
                window.addEventListener('keydown', function (ev) {
                    if (_this._keys.indexOf(ev.keyCode) === -1) {
                        _this._keys.push(ev.keyCode);
                        _this._keysDown.push(ev.keyCode);
                        var keyEvent = new KeyEvent(ev.keyCode);
                        _this.eventDispatcher.publish("down", keyEvent);
                    }
                });
            };
            Keyboard.prototype.update = function (delta) {
                // Reset keysDown and keysUp after update is complete
                this._keysDown.length = 0;
                this._keysUp.length = 0;
            };
            /**
             * Gets list of keys being pressed down
             */
            Keyboard.prototype.getKeys = function () {
                return this._keys;
            };
            /**
             *  Tests if a certain key is down.
             * @method isKeyDown
             * @param key {Keys} Test wether a key is down
             * @returns boolean
             */
            Keyboard.prototype.isKeyDown = function (key) {
                return this._keysDown.indexOf(key) > -1;
            };
            /**
             *  Tests if a certain key is pressed.
             * @method isKeyPressed
             * @param key {Keys} Test wether a key is pressed
             * @returns boolean
             */
            Keyboard.prototype.isKeyPressed = function (key) {
                return this._keys.indexOf(key) > -1;
            };
            /**
             *  Tests if a certain key is up.
             * @method isKeyUp
             * @param key {Keys} Test wether a key is up
             * @returns boolean
             */
            Keyboard.prototype.isKeyUp = function (key) {
                return this._keysUp.indexOf(key) > -1;
            };
            return Keyboard;
        })(ex.Class);
        Input.Keyboard = Keyboard;
    })(Input = ex.Input || (ex.Input = {}));
})(ex || (ex = {}));
var ex;
(function (ex) {
    var Input;
    (function (Input) {
        /**
         * Manages Gamepad API input. You can query the gamepads that are connected
         * or listen to events ("button" and "axis").
         * @class Gamepads
         * @extends Class
         * @param pads {Gamepad[]} The connected gamepads.
         * @param supported {boolean} Whether or not the Gamepad API is present
         */
        var Gamepads = (function (_super) {
            __extends(Gamepads, _super);
            function Gamepads(engine) {
                _super.call(this);
                /**
                 * Whether or not to poll for Gamepad input (default: false)
                 * @property enabled {boolean}
                 */
                this.enabled = false;
                /**
                 * Whether or not Gamepad API is supported
                 * @property supported {boolean}
                 */
                this.supported = !!navigator.getGamepads;
                this._gamePadTimeStamps = [0, 0, 0, 0];
                this._oldPads = [];
                this._pads = [];
                this._initSuccess = false;
                this._navigator = navigator;
                this._engine = engine;
            }
            Gamepads.prototype.init = function () {
                if (!this.supported)
                    return;
                if (this._initSuccess)
                    return;
                // In Chrome, this will return 4 undefined items until a button is pressed
                // In FF, this will not return any items until a button is pressed
                this._oldPads = this._clonePads(this._navigator.getGamepads());
                if (this._oldPads.length && this._oldPads[0]) {
                    this._initSuccess = true;
                }
            };
            /**
             * Updates Gamepad state and publishes Gamepad events
             */
            Gamepads.prototype.update = function (delta) {
                if (!this.enabled || !this.supported)
                    return;
                this.init();
                var gamepads = this._navigator.getGamepads();
                for (var i = 0; i < gamepads.length; i++) {
                    if (!gamepads[i]) {
                        // Reset connection status
                        this.at(i).connected = false;
                        continue;
                    }
                    else {
                        // Set connection status
                        this.at(i).connected = true;
                    }
                    ;
                    // Only supported in Chrome
                    if (gamepads[i].timestamp && gamepads[i].timestamp === this._gamePadTimeStamps[i]) {
                        continue;
                    }
                    this._gamePadTimeStamps[i] = gamepads[i].timestamp;
                    // Buttons
                    var b, a, value, buttonIndex, axesIndex;
                    for (b in Buttons) {
                        if (typeof Buttons[b] !== "number")
                            continue;
                        buttonIndex = Buttons[b];
                        value = gamepads[i].buttons[buttonIndex].value;
                        if (value !== this._oldPads[i].getButton(buttonIndex)) {
                            if (gamepads[i].buttons[buttonIndex].pressed) {
                                this.at(i).updateButton(buttonIndex, value);
                                this.at(i).eventDispatcher.publish("button", new GamepadButtonEvent(buttonIndex, value));
                            }
                            else {
                                this.at(i).updateButton(buttonIndex, 0);
                            }
                        }
                    }
                    for (a in Axes) {
                        if (typeof Axes[a] !== "number")
                            continue;
                        axesIndex = Axes[a];
                        value = gamepads[i].axes[axesIndex];
                        if (value !== this._oldPads[i].getAxes(axesIndex)) {
                            this.at(i).updateAxes(axesIndex, value);
                            this.at(i).eventDispatcher.publish("axis", new GamepadAxisEvent(axesIndex, value));
                        }
                    }
                    this._oldPads[i] = this._clonePad(gamepads[i]);
                }
            };
            /**
             * Safely retrieves a Gamepad at a specific index and creates one if it doesn't yet exist
             */
            Gamepads.prototype.at = function (index) {
                if (index >= this._pads.length) {
                    for (var i = this._pads.length - 1, max = index; i < max; i++) {
                        this._pads.push(new Gamepad());
                        this._oldPads.push(new Gamepad());
                    }
                }
                return this._pads[index];
            };
            /**
             * Gets the number of connected gamepads
             */
            Gamepads.prototype.count = function () {
                return this._pads.filter(function (p) { return p.connected; }).length;
            };
            Gamepads.prototype._clonePads = function (pads) {
                var arr = [];
                for (var i = 0, len = pads.length; i < len; i++) {
                    arr.push(this._clonePad(pads[i]));
                }
                return arr;
            };
            /**
             * Fastest way to clone a known object is to do it yourself
             */
            Gamepads.prototype._clonePad = function (pad) {
                var i, len;
                var clonedPad = new Gamepad();
                if (!pad)
                    return clonedPad;
                for (i = 0, len = pad.buttons.length; i < len; i++) {
                    clonedPad.updateButton(i, pad.buttons[i].value);
                }
                for (i = 0, len = pad.axes.length; i < len; i++) {
                    clonedPad.updateAxes(i, pad.axes[i]);
                }
                return clonedPad;
            };
            /**
             * The minimum value an axis has to move before considering it a change
             * @property MinAxisMoveThreshold {number}
             * @static
             */
            Gamepads.MinAxisMoveThreshold = 0.05;
            return Gamepads;
        })(ex.Class);
        Input.Gamepads = Gamepads;
        /**
         * Individual state for a Gamepad
         * @class Gamepad
         * @extends Class
         */
        var Gamepad = (function (_super) {
            __extends(Gamepad, _super);
            function Gamepad() {
                _super.call(this);
                this.connected = false;
                this._buttons = new Array(16);
                this._axes = new Array(4);
                var i;
                for (i = 0; i < this._buttons.length; i++) {
                    this._buttons[i] = 0;
                }
                for (i = 0; i < this._axes.length; i++) {
                    this._axes[i] = 0;
                }
            }
            /**
             * Whether or not the given button is pressed
             * @param button {Buttons}
             * @param [threshold=1] {number} The threshold over which the button is considered to be pressed
             */
            Gamepad.prototype.isButtonPressed = function (button, threshold) {
                if (threshold === void 0) { threshold = 1; }
                return this._buttons[button] >= threshold;
            };
            /**
             * Gets the given button value
             * @param button {Buttons}
             */
            Gamepad.prototype.getButton = function (button) {
                return this._buttons[button];
            };
            /**
             * Gets the given axis value
             * @param axes {Axes}
             */
            Gamepad.prototype.getAxes = function (axes) {
                var value = this._axes[axes];
                if (Math.abs(value) < Gamepads.MinAxisMoveThreshold) {
                    return 0;
                }
                else {
                    return value;
                }
            };
            Gamepad.prototype.updateButton = function (buttonIndex, value) {
                this._buttons[buttonIndex] = value;
            };
            Gamepad.prototype.updateAxes = function (axesIndex, value) {
                this._axes[axesIndex] = value;
            };
            return Gamepad;
        })(ex.Class);
        Input.Gamepad = Gamepad;
        /**
         * Gamepad Buttons enumeration
         * @class Buttons
         */
        (function (Buttons) {
            /**
             * Face 1 button (e.g. A)
             * @property Face1 {Buttons}
             * @static
             */
            /**
             * Face 2 button (e.g. B)
             * @property Face2 {Buttons}
             * @static
             */
            /**
             * Face 3 button (e.g. X)
             * @property Face3 {Buttons}
             * @static
             */
            /**
             * Face 4 button (e.g. Y)
             * @property Face4 {Buttons}
             * @static
             */
            Buttons[Buttons["Face1"] = 0] = "Face1";
            Buttons[Buttons["Face2"] = 1] = "Face2";
            Buttons[Buttons["Face3"] = 2] = "Face3";
            Buttons[Buttons["Face4"] = 3] = "Face4";
            /**
             * Left bumper button
             * @property LeftBumper {Buttons}
             * @static
             */
            /**
             * Right bumper button
             * @property RightBumper {Buttons}
             * @static
             */
            Buttons[Buttons["LeftBumper"] = 4] = "LeftBumper";
            Buttons[Buttons["RightBumper"] = 5] = "RightBumper";
            /**
             * Left trigger button
             * @property LeftTrigger {Buttons}
             * @static
             */
            /**
             * Right trigger button
             * @property RightTrigger {Buttons}
             * @static
             */
            Buttons[Buttons["LeftTrigger"] = 6] = "LeftTrigger";
            Buttons[Buttons["RightTrigger"] = 7] = "RightTrigger";
            /**
             * Select button
             * @property Select {Buttons}
             * @static
             */
            /**
             * Start button
             * @property Start {Buttons}
             * @static
             */
            Buttons[Buttons["Select"] = 8] = "Select";
            Buttons[Buttons["Start"] = 9] = "Start";
            /**
             * Left analog stick press (e.g. L3)
             * @property LeftStick {Buttons}
             * @static
             */
            /**
             * Right analog stick press (e.g. R3)
             * @property Start {Buttons}
             * @static
             */
            Buttons[Buttons["LeftStick"] = 10] = "LeftStick";
            Buttons[Buttons["RightStick"] = 11] = "RightStick";
            /**
             * D-pad up
             * @property DpadUp {Buttons}
             * @static
             */
            /**
             * D-pad down
             * @property DpadDown {Buttons}
             * @static
             */
            /**
             * D-pad left
             * @property DpadLeft {Buttons}
             * @static
             */
            /**
             * D-pad right
             * @property DpadRight {Buttons}
             * @static
             */
            Buttons[Buttons["DpadUp"] = 12] = "DpadUp";
            Buttons[Buttons["DpadDown"] = 13] = "DpadDown";
            Buttons[Buttons["DpadLeft"] = 14] = "DpadLeft";
            Buttons[Buttons["DpadRight"] = 15] = "DpadRight";
        })(Input.Buttons || (Input.Buttons = {}));
        var Buttons = Input.Buttons;
        /**
         * Gamepad Axes enumeration
         * @class Axes
         */
        (function (Axes) {
            /**
             * Left analogue stick X direction
             * @property LeftStickX {Axes}
             * @static
             */
            /**
             * Left analogue stick Y direction
             * @property LeftStickY {Axes}
             * @static
             */
            /**
             * Right analogue stick X direction
             * @property RightStickX {Axes}
             * @static
             */
            /**
             * Right analogue stick Y direction
             * @property RightStickY {Axes}
             * @static
             */
            Axes[Axes["LeftStickX"] = 0] = "LeftStickX";
            Axes[Axes["LeftStickY"] = 1] = "LeftStickY";
            Axes[Axes["RightStickX"] = 2] = "RightStickX";
            Axes[Axes["RightStickY"] = 3] = "RightStickY";
        })(Input.Axes || (Input.Axes = {}));
        var Axes = Input.Axes;
        var GamepadButtonEvent = (function (_super) {
            __extends(GamepadButtonEvent, _super);
            function GamepadButtonEvent(button, value) {
                _super.call(this);
                this.button = button;
                this.value = value;
            }
            return GamepadButtonEvent;
        })(ex.GameEvent);
        Input.GamepadButtonEvent = GamepadButtonEvent;
        var GamepadAxisEvent = (function (_super) {
            __extends(GamepadAxisEvent, _super);
            function GamepadAxisEvent(axis, value) {
                _super.call(this);
                this.axis = axis;
                this.value = value;
            }
            return GamepadAxisEvent;
        })(ex.GameEvent);
        Input.GamepadAxisEvent = GamepadAxisEvent;
    })(Input = ex.Input || (ex.Input = {}));
})(ex || (ex = {}));
/// <reference path="MonkeyPatch.ts" />
/// <reference path="Events.ts" />
/// <reference path="EventDispatcher.ts" />
/// <reference path="Class.ts" />
/// <reference path="Color.ts" />
/// <reference path="Log.ts" />
/// <reference path="Collision/Side.ts" />
/// <reference path="Scene.ts" />
/// <reference path="Actor.ts" />
/// <reference path="UIActor.ts" />
/// <reference path="Trigger.ts" />
/// <reference path="Particles.ts" />
/// <reference path="Animation.ts" />
/// <reference path="Camera.ts" />
/// <reference path="Sound.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Promises.ts" />
/// <reference path="Util.ts" />
/// <reference path="Binding.ts" />
/// <reference path="TileMap.ts" />
/// <reference path="Label.ts" />
/// <reference path="PostProcessing/IPostProcessor.ts"/>
/// <reference path="Input/IEngineInput.ts"/>
/// <reference path="Input/Pointer.ts"/>
/// <reference path="Input/Keyboard.ts"/>
/// <reference path="Input/Gamepad.ts"/>
var ex;
(function (ex) {
    /**
     * Enum representing the different display modes available to Excalibur
     * @class DisplayMode
     */
    (function (DisplayMode) {
        /**
         * Show the game as full screen
         * @property FullScreen {DisplayMode}
         */
        DisplayMode[DisplayMode["FullScreen"] = 0] = "FullScreen";
        /**
         * Scale the game to the parent DOM container
         * @property Container {DisplayMode}
         */
        DisplayMode[DisplayMode["Container"] = 1] = "Container";
        /**
         * Show the game as a fixed size
         * @Property Fixed {DisplayMode}
         */
        DisplayMode[DisplayMode["Fixed"] = 2] = "Fixed";
    })(ex.DisplayMode || (ex.DisplayMode = {}));
    var DisplayMode = ex.DisplayMode;
    // internal
    var AnimationNode = (function () {
        function AnimationNode(animation, x, y) {
            this.animation = animation;
            this.x = x;
            this.y = y;
        }
        return AnimationNode;
    })();
    /**
     * The 'Engine' is the main driver for a game. It is responsible for
     * starting/stopping the game, maintaining state, transmitting events,
     * loading resources, and managing the scene.
     *
     * @class Engine
     * @constructor
     * @param [width] {number} The width in pixels of the Excalibur game viewport
     * @param [height] {number} The height in pixels of the Excalibur game viewport
     * @param [canvasElementId] {string} If this is not specified, then a new canvas will be created and inserted into the body.
     * @param [displayMode] {DisplayMode} If this is not specified, then it will fall back to fixed if a height and width are specified, else the display mode will be FullScreen.
     */
    var Engine = (function (_super) {
        __extends(Engine, _super);
        function Engine(width, height, canvasElementId, displayMode) {
            _super.call(this);
            /**
             * Sets or gets the collision strategy for Excalibur
             * @property collisionStrategy {CollisionStrategy}
             */
            this.collisionStrategy = 1 /* DynamicAABBTree */;
            this.hasStarted = false;
            this.fps = 0;
            this.postProcessors = [];
            this.sceneHash = {};
            this.animations = [];
            /**
             * Indicates whether the engine is set to fullscreen or not
             * @property isFullscreen {boolean}
             */
            this.isFullscreen = false;
            /**
             * Indicates the current DisplayMode of the engine.
             * @property [displayMode=FullScreen] {DisplayMode}
             */
            this.displayMode = 0 /* FullScreen */;
            /**
             * Indicates whether audio should be paused when the game is no longer visible.
             * @property [pauseAudioWhenHidden=true] {boolean}
             */
            this.pauseAudioWhenHidden = true;
            /**
             * Indicates whether the engine should draw with debug information
             * @property [isDebug=false] {boolean}
             */
            this.isDebug = false;
            this.debugColor = new ex.Color(255, 255, 255);
            /**
             * Sets the background color for the engine.
             * @property [backgroundColor=new Color(0, 0, 100)] {Color}
             */
            this.backgroundColor = new ex.Color(0, 0, 100);
            this.isSmoothingEnabled = true;
            this.isLoading = false;
            this.progress = 0;
            this.total = 1;
            this.logger = ex.Logger.getInstance();
            this.logger.info("Powered by Excalibur.js visit", "http://excaliburjs.com", "for more information.");
            this.logger.debug("Building engine...");
            this.canvasElementId = canvasElementId;
            if (canvasElementId) {
                this.logger.debug("Using Canvas element specified: " + canvasElementId);
                this.canvas = document.getElementById(canvasElementId);
            }
            else {
                this.logger.debug("Using generated canvas element");
                this.canvas = document.createElement('canvas');
            }
            if (width && height) {
                if (displayMode == undefined) {
                    this.displayMode = 2 /* Fixed */;
                }
                this.logger.debug("Engine viewport is size " + width + " x " + height);
                this.width = width;
                this.canvas.width = width;
                this.height = height;
                this.canvas.height = height;
            }
            else if (!displayMode) {
                this.logger.debug("Engine viewport is fullscreen");
                this.displayMode = 0 /* FullScreen */;
            }
            this.loader = new ex.Loader();
            this.initialize();
            this.rootScene = this.currentScene = new ex.Scene(this);
            this.addScene('root', this.rootScene);
        }
        /**
         * Plays a sprite animation on the screen at the specified x and y
         * (in game coordinates, not screen pixels). These animations play
         * independent of actors, and will be cleaned up internally as soon
         * as they are complete. Note animations that loop will never be
         * cleaned up.
         * @method playAnimation
         * @param animation {Animation} Animation to play
         * @param x {number} x game coordinate to play the animation
         * @param y {number} y game coordinate to play the animation
         */
        Engine.prototype.playAnimation = function (animation, x, y) {
            this.animations.push(new AnimationNode(animation, x, y));
        };
        /**
         * Adds an actor to the current scene of the game. This is synonymous
         * to calling engine.currentScene.addChild(actor : Actor).
         *
         * Actors can only be drawn if they are a member of a scene, and only
         * the 'currentScene' may be drawn or updated.
         * @method addChild
         * @param actor {Actor} The actor to add to the current scene
         */
        Engine.prototype.addChild = function (actor) {
            this.currentScene.addChild(actor);
        };
        /**
         * Removes an actor from the currentScene of the game. This is synonymous
         * to calling engine.currentScene.removeChild(actor : Actor).
         * Actors that are removed from a scene will no longer be drawn or updated.
         *
         * @method removeChild
         * @param actor {Actor} The actor to remove from the current scene.
         */
        Engine.prototype.removeChild = function (actor) {
            this.currentScene.removeChild(actor);
        };
        /**
         * Adds a TileMap to the Scene, once this is done the TileMap will be drawn and updated.
         * @method addTileMap
         * @param tileMap {TileMap}
         */
        Engine.prototype.addTileMap = function (tileMap) {
            this.currentScene.addTileMap(tileMap);
        };
        /**
         * Removes a TileMap from the Scene, it willno longer be drawn or updated.
         * @method removeTileMap
         * @param tileMap {TileMap}
         */
        Engine.prototype.removeTileMap = function (tileMap) {
            this.currentScene.removeTileMap(tileMap);
        };
        /**
         * Adds an excalibur timer to the current scene.
         * @param timer {Timer} The timer to add to the current scene.
         * @method addTimer
         */
        Engine.prototype.addTimer = function (timer) {
            return this.currentScene.addTimer(timer);
        };
        /**
         * Removes an excalibur timer from the current scene.
         * @method removeTimer
         * @param timer {Timer} The timer to remove to the current scene.
         */
        Engine.prototype.removeTimer = function (timer) {
            return this.currentScene.removeTimer(timer);
        };
        /**
         * Adds a scene to the engine, think of scenes in excalibur as you
         * would scenes in a play.
         * @method addScene
         * @param name {string} The name of the scene, must be unique
         * @param scene {Scene} The scene to add to the engine
         */
        Engine.prototype.addScene = function (name, scene) {
            if (this.sceneHash[name]) {
                this.logger.warn("Scene", name, "already exists overwriting");
            }
            this.sceneHash[name] = scene;
            scene.engine = this;
        };
        Engine.prototype.removeScene = function (entity) {
            if (entity instanceof ex.Scene) {
                for (var key in this.sceneHash) {
                    if (this.sceneHash.hasOwnProperty(key)) {
                        if (this.sceneHash[key] === entity) {
                            delete this.sceneHash[key];
                        }
                    }
                }
            }
            if (typeof entity === "string") {
                // remove scene
                delete this.sceneHash[entity];
            }
        };
        Engine.prototype.add = function (entity) {
            if (entity instanceof ex.UIActor) {
                this.currentScene.addUIActor(entity);
                return;
            }
            if (entity instanceof ex.Actor) {
                this.addChild(entity);
            }
            if (entity instanceof ex.Timer) {
                this.addTimer(entity);
            }
            if (entity instanceof ex.TileMap) {
                this.addTileMap(entity);
            }
            if (arguments.length === 2) {
                this.addScene(arguments[0], arguments[1]);
            }
        };
        Engine.prototype.remove = function (entity) {
            if (entity instanceof ex.UIActor) {
                this.currentScene.removeUIActor(entity);
                return;
            }
            if (entity instanceof ex.Actor) {
                this.removeChild(entity);
            }
            if (entity instanceof ex.Timer) {
                this.removeTimer(entity);
            }
            if (entity instanceof ex.TileMap) {
                this.removeTileMap(entity);
            }
            if (entity instanceof ex.Scene) {
                this.removeScene(entity);
            }
            if (typeof entity === "string") {
                this.removeScene(entity);
            }
        };
        /**
         * Changes the currently updating and drawing scene to a different,
         * named scene.
         * @method goToScene
         * @param name {string} The name of the scene to trasition to.
         */
        Engine.prototype.goToScene = function (name) {
            if (this.sceneHash[name]) {
                this.currentScene.onDeactivate.call(this.currentScene);
                var oldScene = this.currentScene;
                this.currentScene = this.sceneHash[name];
                oldScene.eventDispatcher.publish('deactivate', new ex.DeactivateEvent(this.currentScene));
                this.currentScene.onActivate.call(this.currentScene);
                this.currentScene.eventDispatcher.publish('activate', new ex.ActivateEvent(oldScene));
            }
            else {
                this.logger.error("Scene", name, "does not exist!");
            }
        };
        /**
         * Returns the width of the engines drawing surface in pixels.
         * @method getWidth
         * @returns number The width of the drawing surface in pixels.
         */
        Engine.prototype.getWidth = function () {
            if (this.currentScene && this.currentScene.camera) {
                return this.width / this.currentScene.camera.getZoom();
            }
            return this.width;
        };
        /**
         * Returns the height of the engines drawing surface in pixels.
         * @method getHeight
         * @returns number The height of the drawing surface in pixels.
         */
        Engine.prototype.getHeight = function () {
            if (this.currentScene && this.currentScene.camera) {
                return this.height / this.currentScene.camera.getZoom();
            }
            return this.height;
        };
        /**
         * Transforms the current x, y from screen coordinates to world coordinates
         * @method screenToWorldCoordinates
         * @param point {Point} screen coordinate to convert
         */
        Engine.prototype.screenToWorldCoordinates = function (point) {
            // todo set these back this.canvas.clientWidth
            var newX = point.x;
            var newY = point.y;
            if (this.currentScene && this.currentScene.camera) {
                var focus = this.currentScene.camera.getFocus();
                newX = focus.x + (point.x - (this.getWidth() / 2));
                newY = focus.y + (point.y - (this.getHeight() / 2));
            }
            newX = Math.floor((newX / this.canvas.clientWidth) * this.getWidth());
            newY = Math.floor((newY / this.canvas.clientHeight) * this.getHeight());
            return new ex.Point(newX, newY);
        };
        /**
         * Transforms a world coordinate, to a screen coordinate
         * @method worldToScreenCoordinates
         * @param point {Point} world coordinate to convert
         *
         */
        Engine.prototype.worldToScreenCoordinates = function (point) {
            // todo set these back this.canvas.clientWidth
            // this isn't correct on zoom
            var screenX = point.x;
            var screenY = point.y;
            if (this.currentScene && this.currentScene.camera) {
                var focus = this.currentScene.camera.getFocus();
                screenX = (point.x - focus.x) + (this.getWidth() / 2); //(this.getWidth() / this.canvas.clientWidth);
                screenY = (point.y - focus.y) + (this.getHeight() / 2); // (this.getHeight() / this.canvas.clientHeight);
            }
            screenX = Math.floor((screenX / this.getWidth()) * this.canvas.clientWidth);
            screenY = Math.floor((screenY / this.getHeight()) * this.canvas.clientHeight);
            return new ex.Point(screenX, screenY);
        };
        /**
         * Sets the internal canvas height based on the selected display mode.
         * @method setHeightByDisplayMode
         * @private
         */
        Engine.prototype.setHeightByDisplayMode = function (parent) {
            if (this.displayMode === 1 /* Container */) {
                this.width = this.canvas.width = parent.clientWidth;
                this.height = this.canvas.height = parent.clientHeight;
            }
            if (this.displayMode === 0 /* FullScreen */) {
                document.body.style.margin = '0px';
                document.body.style.overflow = 'hidden';
                this.width = this.canvas.width = parent.innerWidth;
                this.height = this.canvas.height = parent.innerHeight;
            }
        };
        /**
         * Initializes the internal canvas, rendering context, displaymode, and native event listeners
         * @method initialize
         * @private
         */
        Engine.prototype.initialize = function () {
            var _this = this;
            if (this.displayMode === 0 /* FullScreen */ || this.displayMode === 1 /* Container */) {
                var parent = (this.displayMode === 1 /* Container */ ? (this.canvas.parentElement || document.body) : window);
                this.setHeightByDisplayMode(parent);
                window.addEventListener('resize', function (ev) {
                    _this.logger.debug("View port resized");
                    _this.setHeightByDisplayMode(parent);
                    _this.logger.info("parent.clientHeight " + parent.clientHeight);
                    _this.setAntialiasing(_this.isSmoothingEnabled);
                });
            }
            // initialize inputs
            this.input = {
                keyboard: new ex.Input.Keyboard(this),
                pointers: new ex.Input.Pointers(this),
                gamepads: new ex.Input.Gamepads(this)
            };
            this.input.keyboard.init();
            this.input.pointers.init();
            this.input.gamepads.init();
            // Issue #385 make use of the visibility api
            // https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
            document.addEventListener("visibilitychange", function () {
                if (document.hidden || document.msHidden) {
                    _this.eventDispatcher.publish('hidden', new ex.HiddenEvent());
                    _this.logger.debug("Window hidden");
                }
                else {
                    _this.eventDispatcher.publish('visible', new ex.VisibleEvent());
                    _this.logger.debug("Window visible");
                }
            });
            /*
            // DEPRECATED in favor of visibility api
            window.addEventListener('blur', () => {
               this.eventDispatcher.publish(EventType[EventType.Blur], new BlurEvent());
            });
   
            window.addEventListener('focus', () => {
               this.eventDispatcher.publish(EventType[EventType.Focus], new FocusEvent());
            });*/
            this.ctx = this.canvas.getContext('2d');
            if (!this.canvasElementId) {
                document.body.appendChild(this.canvas);
            }
        };
        /**
         * If supported by the browser, this will set the antialiasing flag on the
         * canvas. Set this to false if you want a 'jagged' pixel art look to your
         * image resources.
         * @method setAntialiasing
         * @param isSmooth {boolean} Set smoothing to true or false
         */
        Engine.prototype.setAntialiasing = function (isSmooth) {
            this.isSmoothingEnabled = isSmooth;
            this.ctx.imageSmoothingEnabled = isSmooth;
            this.ctx.webkitImageSmoothingEnabled = isSmooth;
            this.ctx.mozImageSmoothingEnabled = isSmooth;
            this.ctx.msImageSmoothingEnabled = isSmooth;
        };
        /**
         *  Return the current smoothing status of the canvas
         * @method getAntialiasing
         * @returns boolean
         */
        Engine.prototype.getAntialiasing = function () {
            return this.ctx.imageSmoothingEnabled || this.ctx.webkitImageSmoothingEnabled || this.ctx.mozImageSmoothingEnabled || this.ctx.msImageSmoothingEnabled;
        };
        /**
         * Updates the entire state of the game
         * @method update
         * @private
         * @param delta {number} Number of milliseconds elapsed since the last update.
         */
        Engine.prototype.update = function (delta) {
            if (this.isLoading) {
                // suspend updates untill loading is finished
                return;
            }
            // process engine level events
            this.currentScene.update(this, delta);
            // update animations
            this.animations = this.animations.filter(function (a) {
                return !a.animation.isDone();
            });
            // Update input listeners
            this.input.keyboard.update(delta);
            this.input.pointers.update(delta);
            this.input.gamepads.update(delta);
            // Publish update event
            this.eventDispatcher.publish(ex.EventType[5 /* Update */], new ex.UpdateEvent(delta));
        };
        /**
         * Draws the entire game
         * @method draw
         * @private
         * @param draw {number} Number of milliseconds elapsed since the last draw.
         */
        Engine.prototype.draw = function (delta) {
            var ctx = this.ctx;
            if (this.isLoading) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, this.width, this.height);
                this.drawLoadingBar(ctx, this.progress, this.total);
                // Drawing nothing else while loading
                return;
            }
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = this.backgroundColor.toString();
            ctx.fillRect(0, 0, this.width, this.height);
            this.currentScene.draw(this.ctx, delta);
            // todo needs to be a better way of doing this
            this.animations.forEach(function (a) {
                a.animation.draw(ctx, a.x, a.y);
            });
            this.fps = 1.0 / (delta / 1000);
            // Draw debug information
            if (this.isDebug) {
                this.ctx.font = "Consolas";
                this.ctx.fillStyle = this.debugColor.toString();
                var keys = this.input.keyboard.getKeys();
                for (var j = 0; j < keys.length; j++) {
                    this.ctx.fillText(keys[j].toString() + " : " + (ex.Input.Keys[keys[j]] ? ex.Input.Keys[keys[j]] : "Not Mapped"), 100, 10 * j + 10);
                }
                this.ctx.fillText("FPS:" + this.fps.toFixed(2).toString(), 10, 10);
            }
            for (var i = 0; i < this.postProcessors.length; i++) {
                this.postProcessors[i].process(this.ctx.getImageData(0, 0, this.width, this.height), this.ctx);
            }
            //ctx.drawImage(currentImage, 0, 0, this.width, this.height);
        };
        /**
         * Starts the internal game loop for Excalibur after loading
         * any provided assets.
         * @method start
         * @param [loader=undefined] {ILoadable} Optional resources to load before
         * starting the mainloop. Some loadable such as a Loader collection, Sound, or Texture.
         * @returns Promise
         */
        Engine.prototype.start = function (loader) {
            var loadingComplete;
            if (loader) {
                loader.wireEngine(this);
                loadingComplete = this.load(loader);
            }
            else {
                loadingComplete = ex.Promise.wrap();
            }
            if (!this.hasStarted) {
                this.hasStarted = true;
                this.logger.debug("Starting game...");
                // Mainloop
                var lastTime = Date.now();
                var game = this;
                (function mainloop() {
                    if (!game.hasStarted) {
                        return;
                    }
                    window.requestAnimationFrame(mainloop);
                    // Get the time to calculate time-elapsed
                    var now = Date.now();
                    var elapsed = Math.floor(now - lastTime) || 1;
                    // Resolves issue #138 if the game has been paused, or blurred for 
                    // more than a 200 milliseconds, reset elapsed time to 1. This improves reliability 
                    // and provides more expected behavior when the engine comes back
                    // into focus
                    if (elapsed > 200) {
                        elapsed = 1;
                    }
                    game.update(elapsed);
                    game.draw(elapsed);
                    lastTime = now;
                })();
                this.logger.debug("Game started");
            }
            else {
            }
            return loadingComplete;
        };
        /**
         * Stops Excalibur's mainloop, useful for pausing the game.
         * @method stop
         */
        Engine.prototype.stop = function () {
            if (this.hasStarted) {
                this.hasStarted = false;
                this.logger.debug("Game stopped");
            }
        };
        /**
         * Takes a screen shot of the current viewport and returns it as an
         * HTML Image Element.
         * @method screenshot
         * @returns HTMLImageElement
         */
        Engine.prototype.screenshot = function () {
            var result = new Image();
            var raw = this.canvas.toDataURL("image/png");
            result.src = raw;
            return result;
        };
        /**
         * Draws the Excalibur loading bar
         * @method drawLoadingBar
         * @private
         * @param ctx {CanvasRenderingContext2D} The canvas rendering context
         * @param loaded {number} Number of bytes loaded
         * @param total {number} Total number of bytes to load
         */
        Engine.prototype.drawLoadingBar = function (ctx, loaded, total) {
            if (this.loadingDraw) {
                this.loadingDraw(ctx, loaded, total);
                return;
            }
            var y = this.canvas.height / 2;
            var width = this.canvas.width / 3;
            var x = width;
            // loading image
            var image = new Image();
            // 64 bit string encoding of the excalibur logo
            image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAEsCAYAAAA7Ldc6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjenhJ3MAAA6Y0lEQVR4Xu3dUagkWZ3ncUEEQYSiRXBdmi2KdRUZxgJZhmV9qOdmkWJYlmYYhkKWcWcfpEDQFx9K2O4Fm6UaVhoahi4GF2wWh1pnYawHoXzxpVu6Gimatqni0kpTiGLhgy++3Pn9Mk6kkXlPZp4TGSfiROT3A39aq25EnMi6GfH/ZcSJ/BAAAAAAAAAAAAAAYAw/+9nPLqluqO6rroc/BgAAAIDhhNBxV3Ue6mn4KwAAAAA4nkLGddUdh40QOrp1J/wYAAAAAPSjYHHV4UIVCx3duhoWAQAAAIB0DhOq26qzEC4O1VlYFAAAAAAOU4i4rLrpMBFCxYV66623zt99993z999///ydd97p/t3tsBoAAAAAiFNwaEPHgxAkotWGjt/85jer+vWvf739M9x+BQAAAOAihYX2sbndJ1hdKF/hODs7W4WNNni09fjx4+7PPgirBgAAAICGgsLB0PHzn/98Z+joln+us9zNsAkAAAAAp0zhYN9jc1flMOErGk+ePImGje3yz22t43LYHAAAAIBTo0Bw8LG5b7/99vl7772XHDq6xe1XAAAAwIlTEDj42Nw2dHzwwQfRYJFaXk9nvTfCEAAAAAAsmZr/rMfmxsJEbjm8bG3jUhgOAAAAgKVRw9/rsblDla+gdLZzNwwLAAAAwFKo0T/6sblDFbdfAQAAAAvlBl81yGNzh6hf/epX3W17gju3XwEAAABzpqZ+8MfmDlW+raszjjthyAAAAADmRM180cfmDlWe0N4Z0/UwfAAAAAC1UwM/2mNzhyhPaO+M7WnYDQAAAAC1UwPvuR3dhn5dQz82d6ji9isAAABghtS8R8NHjaGjLU9w3xrv1bA7AAAAAGqlxn0jfPhqx1hPsDqmPMbOuM/C7gAAAAColRr3C+GjhrkdKeXvF+mM/XbYJQAAAAA1UtM+2/DB7VcAAADAjKhhn234cPn7RjrjfxB2CwAAAEBt1LDPOny4/KWHnX24GXYNAAAAQE3UrM8+fPhLD7v7oLocdg8AAABALdSozz58uB49etQNH9x+BQAAANRGjfpG+PAtTHMMHy5/E3tnX26EXQQAAABQAzfpnYZ9FT5q/46PXeXQ1N0X1aWwmwAAAACmpgZ9MeHD9d5773XDx92wmwAAAACmpgZ9UeHDxe1XAAAAQIXcnHca9UWEj/fff78bPp6quP0KAAAAmJoa88WFD9e7777bDSB3wu4CAAAAmIoa80WGD5cfG9zZt+thlwEAAABMQU35YsPH9u1XYZcBAAAATEFN+WLDh+udd97pBpDbYbcBAAAAjE0N+aLDh/elu3+qq2HXAQAAAIxJzfiiw4fr7OysGz7Owq4DAAAAGJOa8cWHDxe3XwEAAAATUyN+EuHjyZMn3fDhuhxeAgAAAABjUBN+EuHD9fjx4274eBBeAgAAAABjUBN+MuHD5f3r7O/N8DIAAAAAKE0N+EmFD26/AgAAACai5vukwofr0aNH3fBxP7wUAAAAAEpS831y4cP19ttvdwPIjfByAAAAACjFjXenCT+Z8PHBBx90w4frUnhJAAAAAJSgpvskw4frvffe64aPu+ElAQAAAFCCmu6TDR8ubr8CAAAARuKGu9N8n1z4eP/997vh42l4WQAAAAAMTQ33SYcP17vvvtsNIHfCSwMAAABgSGq2Tz58uN56661uALkeXh4AAAAAQ1GjTfhQPX78uBs+uP0KAAAAGJoabcKH6uzsrBs+XLfDSwQAAABgCGqyCR+qSPh4oOK7PwAAAIChqMEmfKgIHwAAAEBharAJHyrCBwAAAFCYGmzCh4rwAQAAABSmBpvwoSJ8AAAAAIWpwSZ8qAgfAAAAQGFqsAkfKsIHAAAAUJgabMKHivABAAAAFKYGm/ChInwAAAAAhanBvt1puAkffyrCBwAAADAkNdh3Og034eNPRfgAAAAAhqQGm/ChInwAAAAAhanBJnyoCB8AAABAYWqwCR8qwgcAAABQmBpswoeK8AEAAAAUpgab8KEifAAAAACFqcEmfKgIHwAAAEBharAJHyrCBwAAAFCYGmzCh4rwAQAAABSmBpvwoSJ8AAAAAIWpwSZ8qAgfAAAAQGFqsAkfKsIHAAAAUJgabMKHivABAAAAFKYGm/ChInwAAAAAhanBJnyoCB8AAABAYWqwCR8qwgcAAABQmBpswoeK8AEAAAAUpgab8KEifAAAAACFqcEmfKgIHwAAAEBharAJHyrCBwAAAFCYGmzCh4rwAQAAABSmBpvwoSJ8AAAAAIWpwSZ8qB49etQNHi7CBwAAADAkNdiED9W7777bDR4uwgcAAAAwJDXYhA8V4QMAAAAoTA024UNF+AAAAAAKU4NN+FARPgAAAIDC1GATPlSEDwAAAKAwNdiEDxXhAwAAAChMDTbhQ0X4AAAAAApTg034UBE+AAAAgMLUYBM+VIQPAAAAoDA12IQPFeEDAAAAKEwNNuFDRfgAAAAAClODTfhQET4AAACAwtRgEz5UhA8AAACgMDXYhA8V4QMAAAAoTA024UNF+AAAAAAKU4NN+FARPgAAAIDC1GATPlSEDwAAAKAwNdiEDxXhAwAAAChMDTbhQ0X4AAAAAApTg034UBE+AAAAgMLUYBM+VIQPAAAAoDA12IQPFeEDAAAAKEwNNuFDRfgAMHfn5+ffUCULixWh1b/QbCXJm2GxIrT+e81mktwLiwEASlCDTfhQET4ALIGa5yoCiFb9pWYLWV4Iiw9O6yaAAEAN1GBvhI+HDx8SPpoaLXz4RNec7xbhG2G3AEzE78Pm7ZgmLDY4rfrNZgvZroRVDErrJYAAwNTUYG+EDzfhseZ86TX1lQ+f6Jrz3SIQQICJ+X3YvB3ThMUGpdVeadbey1fDagal9RJAAGBKarAJH6oabrvyia453y0CAQSYmN+HzdsxTVhsUFptn9uvWq+E1QxK6yWAAMBU1GATPlQ1hA/zia453y0CAQSYmN+HzdsxTVhsUFrtMQGkSPPv9TarT0IAAYChqMEmfKhqCR/mE11zvlsEAggwMb8Pm7djmrDYoLRaroAAAAgfbdUUPswnuuZ8twgEEGBifh82b8c0YbFBabXMAQGAU6cGm/Chqi18mE90zfluEQggwMT8PmzejmnCYoPTqh81W8jGU7AAYO7UYBM+VDWGD/OJrjnfLQIBBJiY34fN2zFNWGxwWvVzzRayFDuGaN0EEAAYgxpswoeq1vBhPtE157tFIIAAE/P7sHk7pgmLFaHVv9JsJQnfhA4Ac6cGm/Chqjl8mE90zfluEQggwMT8PmzejmnCYsVoEynjcVD5RFikCK2fAAIAJanBJnyoag8f5hNdc75bBAIIMDG/D5u3Y5qwWFHajCelv6Dqfju654g4eHwp/FhR2g4BBABKUYNN+FDNIXyYT3TN+S5NWAwAonSYqC6A1EC7SgABgBLUYBM+VHMJH+YTXXO+SxMWA4AoHSYIIBHaVQIIAAxNDTbhQzWn8GE+0TXnuzRhMQCI0mGCABKhXSWAAMCQ1GATPlRzCx/mE11zvksTFgOAKB0mCCAR2lUCCAAMRQ024UM1x/BhPtE157s0YTEAiNJhggASoV0lgADAENRgEz5Ucw0f5hNdc75LExYDgCgdJgggEdpVAggAHEsNNuFDNefwYT7RNee7NGExAIjSYYIAEqFdJYAAwDHUYBM+VHMPH+YTXXO+SxMWA4AoHSYIIBHaVQIIAPSlBpvwoVpC+DCf6JrzXZqwGABE6TBBAInQrhJAAKAPNdiED9VSwof5RNec79KExQAgSocJAkiEdpUAAgC51GATPlRLCh/mE11zvksTFgOAKB0mCCAR2lUCCADkUINN+FBFwsd91WzDh/lE15zv0oTFACBKhwkCSIR2lQACAKnUYBM+VJHwcSe8RLPmE11zvksTFgOAKB0mCCAR2lUCCIDy/unvPnRZdS2hbiXUHdX9Tt0ImynKTXa36SZ8LCt8mE90zfkuTVgMAKJ0mCCARGhXCSAALlJT7zCw3ejvqvOJ61YYdjFusrtNN+FjeeHDfKJrzndpwmIAEKXDBAEkQruac6wlgACnwk39VpNfc90Nwy7CTXa36SZ8LDN8mE90zfkuTVgMAKJ0mCCARGhXc461BBDgVKipHzSA/OhrHz7/6bc+drAevvTM+S9e/uTeevzdT62qs/77YdiDc5PdbboJH8sNH+YTXXO+SxMWAwajX6svqZ5XuXH176PrkWoX/137c17Gy34hrK56Gqv396th7O1+vKna5Xeq2exvGGOysNjiaVf975dqkACi9XxB5d+XF7zOULvM5ncM86LfpSsqH/NeV8WOde0x7hWVf+5KWPQ0qKlfB5AHL146/+33Lu+sP/7ws+fn//z5UesPP/jMamxthWEPyk12t+kmfCw7fFh40ycLiwG96dfITVHbfA/N66zmBKZxfEL1nMon1n0how+ftL3e58LmqqDxEEAitKs5v++9A4iWdcD178W+EJ/K66judwzzoN8b/y72Oc6f1hVANfXrAOKrDrEQMHW14wt1OQx9EG6yu0034WP54cP8Rm/e72nCYrOnXfEnMm7gcj0fVjEpjcONbe74Jzuoa9t+vf0p7BBNUSo3/P4k9xNhGKPw9sJ2/WnfWPy6uvEfdV9jwjiShcWK0Opzjm9F3x9ef7OZJNlj0TL+nSv5/vK6He5r+B2b9XlLQ8p6j8iXwqKD07oH/73Uz/lDpqx/oy0EkNrKt2y1Y1RdD0M/mpvsbtNN+DiN8GF+ozfv9zRhsUXQ7vhkmutRWHxSGoeb+RwOK6NfFdA2/QnYmI14jPf9G2FIxWgbDln+tLhPsB2Ktz1pSNb2CSARXn+zmSTJY9HPlg4e22r4HZv1eUtDWmwA0c/0Oa9uO7kA4idgnbs83yIWAKYu3xrWjlE1yJOw3GR3m27Cx+mED/MbvXm/pwmLLYZ2KWv/g+LN7D7avj9dyvXVsPgotD03431e22LC0AanVfe9zaAkj2eST6q1XQJIhNffbCZJSqM39XvMVxgnmSei7Wbtd1isGhrSIgOI/t4fwAzh5ALI+vG6nucRCwBT1y9f/fRqfKGOnojuJrvbdBM+Tit8mN/ozfs9TVhsMbRLfZp5fwI42W0I2nbWv5mMdjDXtnz7Ue7VmVGEIQ5Gq2yveNTKv6ejN4jaJgEkwutvNpPkUKPneUVTXmlrTXI1RNuc9XlLQ1pcANHfDXksJIDUVr9//cpqfKGehqH34ia723QTPk4vfJjf6M37PU1YbFG0W7knA3slLD4qbde3W+RwgzDKrVfajsPcmLeCZAnDHIRW1+d3ZgqjhxBtjwAS4fU3m0myr9HLPQaMYdSrwtrerM9bGtKiAoj+fOgPYgggNZYf79uOU3U1DD+Lm+xu0034OM3wYX6jN+/3NGGxxdGu9XlC0diNXZ+J56PceqXt1NgUbQhDPZpW5Vuu5mS0EGraFgEkwutvNpNkrEZvSKN9KKNtzfq8pSEtJoDoz4aY87GNAFJjvfHtj6/GGOpmGH4SNdiXVPc7DTfh4091cuHD/EZv3u9pwmKLo13r01SOepDU9nJvbRplfNpOzU3RWhju0bSquQUQezMMvzhtiwAS4fU3m0kSa/Rym9YpvBCGW5S2M+vzloa0iACi/9/nFuYUo55bJ6dmfhYBpO8XEqrBdvh40Gm4CR9/qpMMH+Y3evN+TxMWWyTtXp+5C6M8H1/byT3Qj/Kpt7Yxi/BhYchH06rmGEBslNtkvJ1mc2nCYkVo9TnHt2oDiP5/9VcYO4rPCdE2Zn3e0pCWEkCG/m6jFgGkxtr+QkLVpbALO6nBJnyEInxs8hu9eb+nCYstknbPtzjlzmEY5bG82k7Wv5MUv/VK2xgyfDgw+XG9PjG7wY+ecPXnDmL+e1/29/aT/73CKo6mVR0bQDzmdl89mdjru/BQA/9Z+Dvvq38+9/a7mDFCKQEkwutvNpNkPRb97z6fMvt3zB+oOLj4d+jCv7v/LPxd+14a4verVfT2VK1/1uctDWn2AUT/u8StVy0CSK31469/ZDXOUDfCLkSpwSZ8hCJ8XOQ3evN+TxMWWyztohvCXEWbfa0/d0zFD97axlDhw+s56iqSlncj5ZPh3jASfvxoWlWfAOIA4WawdwDQsu0XHOaG5K7i9+lrGwSQCK+/2UyS1Vj035wPRRwg/Nof8zvmY80Q39vjMRd7UqDWPevzloY06wCi/+bMR/Tvk4/PF/ZBf9Z+yOLjWvcDJQJIrfXwpWdW4wx1N+zCBWqwCR+hCB9xfqM37/c0YbFF027mnoB9IC5ysvV6VTkNp8dS9FNurT/35BnjdQz+mmmdPplFf6fDjxxNq0oNIP5384l30P30+lTHBMCqfj/CYkVo9TnHtxoDSMqxaBU8VhsZiNbnqy5Z54aIYvNBtO5Zn7c0pLkHkJTx+xiVfazRMg7Bo8wlqkanoV/d5hRr/GuprcfxuqK3YanJvtttugkfhI9teqPfUyULiy2adjPn051WkQOm1pt7oqrtasw2N1RFG2DTNi4EkfBXR9OqDgUQ3xc9xn3wfecFFD25a/0EkAivv9lMEv9synvN76eSVxqOvc2myK1YWu+sz1sa0twDyL4Pxfx3o3//0Kx1G/pY019bpdyGpUb7Vrfx/vWvfx1t0JdchI/9dKC4tzpkJAqLLZ52tU9zN2hj7fU1q01WuoHqE8xaXm6KLyzzv+NqzOGPjqZV7QogPvGOuo/aXm4jY78Lixeh9RNAIrz+ZjNJHGIPXfkc6xHbvhrS931f5DX1epvVpwmLVUNDmm0AUe0Lxv77YoF4sTrNfLThr622bsOKPg1LzbZvwXraNt+PHj2KNulLLcLHYeGAkSwsdhK0u1mvjQx6svX6mtUmcYNQ+taa3Nej5bFN9omYtu3gNNi/jdYVCyBuKCY58Wq7ff5dSjY0BJAIr7/ZzCDGDrrHhJDBf9e0zqzXMixWDQ1pzgFk122Br4dVIlenmY82/LVV5GlYl8OubFDTvb4K8tZbb53MVRDCRxodNO41x440YbGToN31FYjck+4gJwqtJ/dWp1pvvfInucVvuRqT9qcbQCa/3cDbX40kT7FH8nrdzSbShMWK0Opzjm9zCSCjX0k0bbfP75kN/rp6nc2q04TFqqEhzTWA7Loq5+M8Vz766jbzsYa/xvrptz62HrPqdtiVDWq8T+4qCOEjnQ4a91aHj/kq+t0GXn+zmWRHP5ZX68ideF66cep761XxqzJT0D61AaTo/fc5NI7cSenFfme0bgJIhNffbOYok4SPlrbfd07I0LenZr2WYbFqaEhzDSAxizzOj6rTyEeb/Rrrl69+ej1m1VPVrsnoG3NBnjx5Em3cl1CEjzw6cNxbHULmq/iXq2kbuV+2dFSToOVzTk7FD/5af+7J0jyuRU5E1H45gIxy/30qjSf7ClVYdHBaNQEkwutvNtNb8Ucop9A4+uzHoA8+0PqyxhAWq4aGtKQAMsqX8S5ap5GPNvu11tZk9Jthdy5QI37WNuXvvPNOtHmfexE+8ungca85hszWGAEk99YDN9+9PhnXcrkTz0vfetX36gcnpZHpNc/9dyr1hCICSITX32ymF18RreVqW59bUwd98IHWl/VahsWqoSEtJYAUfc+cjE4TH230a61fvPzJ9bhVZ2F3LlAzfr3bnP/qV7+KNvFzLcJHPz6ANMeR2SoeQMzbaTaXrNe4tFzOv0fxg7+2kbvfdlrPcK+EXvfc27CKNDVaLwEkwutvNtNLsQa0D42nz3FhsA8ltK6s1zIsVg0NaSkBhFuvjqXG/VKniY82+rXWH3/42fMffe3D67Grdn4zupry+22D/vbbby9mQjrhoz8dQO41x5HZGiuA5M7LsKyDs34+5zYafwJZ/OCvbeTuczWf1J4ave659+cXee94vc3q04TFitDqc45vtQaQ6j5l1ph8PMw12AcTWlfWaxkWq4aGtIQAUsUtgbOnpv1a28B7Ynes0a+5Mq6CXFatJ6S/99570YZ+TkX4OI4OIn0PPrUYJYCYtrXr+x92SX4soX42N+AUn4OgbfR58tWkk2RPmV773N9PAsimWgNIVVc/WhpX7hW3ox/Q0dK6sl7LsFg1NKQlBBC+bHAIatpnHUAiV0FuhV27QA36xoT0Od+KRfg4ng4ifQ8+tRgtgJi2V+Q2F/1czglplE9EtZ1dz3vfZbAGA/n0+ud+Kl3Ft/eHxYrQ6nOObzUGkOqufrQ0tj6P5R3kqq3Wk/VahsWqoSHNPYC8GRbHsdSwzzqAuLaugux8IpapUX/QNu1z/W4QwscwdCDpc/CpydgBJHdS9sEDtX4mZ1LnWLde9bnFgqsfEwv/DqmKNLdaLwEkwutvNpOl6veUxpd7i+Yg80C0nqzXMixWDQ1p7gGkqqcAzpqa9dkHkMhVkOj3gpia9auq9a1Yc3sqFuFjODqQ9Dn41GTUAGLaZu6tSXubCP19zpWGUQ782s7zzeaScfWjAvp3yAnHBJBNNQaQqudTaXy5V4QHOV5rPVmvZVisGhrS3AMIt18NRc367AOI6/F3P7Xah05dDbt4gZr2m90mfi5fUEj4GJYOJPea48lsjR5ATNvNCQ07J2brz3Pu2x/tdgxtK7ex4MlXFdC/Q877mQCyqbYAMtr7vS+NMfeDikH2yetpVpcmLFYNDWnOAYQPm4akRn0RAcT1k29+dLUfoe6HXYxS836328zXPh+E8DE8HUxyDz61mSqA5D4LPzpO/XnqLQyj3HrV0rZyb63gE7EK6N8h5/1MANlUWwCZ5NiWQ2PM/d6iQZpXrSfrtQyLVUNDmnMASX64ChKoUV9MAPnt9y6v9qNT+76c8JJqYz7IBx98EG3+py7CRxk6mNxrjilpwmIQvRw5jz11gNi4CqL/n3MSGu2eW21rkqYC6fSa+8qZbwX075CvVvl9nBOIjQCyqbYAUqzpHFIYa7Kw2FG0mlmftzSkOQeQ6oPxrKhJX0wAcT148dJqX0J5QvrlsKsXqJHfmA/y85//vKpJ6R6L56i04wtF+BiIDiZZB5+wGAK9JDmv3/q56frfOVdQijZG27S93DkuPA++AL2uQ4SMfQggm2oLILP4Ph2NM3e/jr6Sq3VkbTMsVg0Nac4BZBbBeDbUoN9oG/Y3vv3xaFM/p4pMSD90K9bGt6TXEkI8Bo+lOzYV4WNAOphkHXzCYgj0kuQ+inJ18tV/U+eQjHrrlWl7uSdHnn7Vk1670iFjHwLIpqoCSFisehpq7uO6j25gtY5Zv5Ya0pwDyKjno8VTg36rbdb9ONtYUz+3evLas6v96dTO7wYxNfY3uo3+w4cPo6FgrCJ8jEMHk3vNMSVNWAwdellyTiZuMnMmno/+uENtM7ehYP7HAX6NVL5l7wWV33NjhYx9CCCbagogs/meBY119GZa65j1eUtDmm0ACYthKG7O20Z9KQHE9fClZ1b71KlrYZej3OB3G37Pu4iFg9JF+BiPjif3msNKmrAYtuilebN5hZKkNp+TNCHaLr8TR9LL4u9R8ROCHOZqCBsxBJBNNQWQomMZksZKAMmkIRFA0FBjvsgA4luxtp6KtfcLCs2NfrfxHzuEED7GpeMJB58B6KXJuaqRapIrC2HbqZiA3qHXw7dT5V5BmgoBZBMBpAeNNbeZPnoSs9Yx6/OWhjTXADKb38vZUFO+yADi+v3rV7bngzwIu72TG/5uAHAIGWNOCOFjfD6gNMeVNGExROjl8e01Q5nsSSNh+6k4IYleB1/tyH108dQIIJsIID1orASQTBoSAQQNNeWLDSCuX7766dW+depgU+/GvxsEHAxKhhDCxzR8QGmOK2nCYojQy+PbboZoQie7/1vb9j7kOOkTkvbfV77mFjxaBJBNBJAeNFYCSCYNiQCChhryRQcQV2Q+yN5J6eYA0A0EpUII4WM6PqA0x5U0YTHsoJco9xG2MZNN6ta2c28lO8lvQNd+O6gNecVrCgSQTQSQHjRWAkgmDYkAgoab8bYxX2oAcfkRw+1+hroRXoKdHAS6wWDoLyskfEzLB5TmuJImLIY99DIdMwdgsluvTNvPDSCTjncK2meHj5yHDpTg961/z9zI+PYv/7t5XDnvZwLIJgJIDxorASSThkQAQUON+DqA+IsI/W3if/jBZ6JN/JwrMindlRJCbnUDgkPI2dlZNFDkFOFjej6gNMeVNGEx7KGXKfc2pq5Jv3xM2yeA7KH99eN0x3iqlbfh96Yf27wRMsJQovT3Oe9nAsgmAkgPGisBJJOGRABBQ0343a2mfF0OJL59yd+r4QY+1tjPqbwPP/76R7b3MyWEbHxPiOuYJ2QRPurgA0pzXEkTFsMeepn8fQ99TXpLk7ZPANlB++pgOXT48JWUNmT49r2jGg0tn/N+JoBsIoD0oLGO3kxrHbM+b2lIBBA01IDf32rId5avILSBJNbgz6EiT8ZypYSQq6qnncCwChG5t2QRPurhA0pzXEkTFsMOeolyvxk9ptjJ5hBvuxlCslMKIEPcduV1uPko8m+s9ea8nwkgmwggPWisBJBMGhIBBA0131dV11W+FeuOKjmQeF6FnzI1t6sjR4SQS6oHneCwuiXr8ePH0bCxXYSPuviA0hxX0oTFsINeoiGaVD9VaZJbsbTd3AByEick7ecxE8797+mG40pYXTHaRs77mQCyiQDSg8aaO+eNAEIAwSFqyB1Mbqhuqx6ozvfVgxcvzerKSN8QYgoNt7dCxPnDhw/Pnzx5Eg0eLsJHfXxAaY4racJiiNDLk3tS2WeSW7G0XQLIFu1j36tavl3r+bCaUWh7Oe9nAsgmAkgPHmsz5GRHB3GtY9bnLQ2JAII8as4vqXylxFdJzlTnsfIcCz9Naw5XRXaEkKRQoPBwTXXWCROrevTo0SpsED7q5wNKc1xJExbDFr00uY17imInnV20zdwJ9KcQQLLeI4E/FR79Kpa2mTNWAsgmAkgPGmvW9+CExY6i1cz6vKUhEUBwHDXqvkLiqyPRMOLG3ldFan+i1o6nY/k2tEthV3dSiPAtWRuP6nW9/fbb5++//z7ho3I+oDTHlTRhMXToZXHTXuLL6Ca5FavZdLqw2CJp9/pc/XglLD46bTvn/UwA2UQA6SGMN9XvwmJH0Xpmfd7SkAggGI6a9WsqXxk5j1XtQWRHCPFtZ1fDLu6lQBG9GuLbsggf9fIBpTmupAmLoUMvi59ilMonnpywMvqtWNpm7pOeJn10cEnat5x/W5v0BO3tN8NIQgDZRADJpHFOcsum1pM1JyssVg0NiQCC4alh921aN1XRqyK1BxGPb2vMT1Wp80J8NcTfGbLxpKytInxUxAeU5riSJiyGQC9JzjefvxmW8Xc65Bj1VixtL+t3Qka/VWws2rfcMFZ8ovk+2n7OeAkgmwggmTTO3EeOD/KBitZTze9YHxoSAQRluXFXXZi87luzap4j8vi7n9oYbyh/V8rBW7JMIeOyg0YndBA+KuUDSnNcSRMWg+jlyP1eiC+ERb1sztOyRr0VS9vK/dR/kY/i1X7lfro72a1XrTCOVASQTTUFkEdhsappnLnHiq+GRY+i9cw9gOQ+VY8Agn7UuPv2rAtXRDxZvdanZvnb4COT070P18JuHaTA4e8NuU/4qJcPKM1xJU1YDKKXI+fxkxuf/On/5za3o92KpW3lfjq3yJOS9iv3dXguLDoJbf9KM4xkBJBNNQWQWRxrNczcuW/rD2GOofXkvjerukqr8WT9LggBBMdR8+4rIheCiL9LpMarIR6Tvwl+e7wqz3VJuhpiDiLhf6IyPqA0x5U0YbGTp5ci59YDXyW5cAVDf5b76eEoJ1Fvp9lclsXNA9E+Zb03ZNLXQNuf5H78bVovASTC6282k2yQZr0Uj68ZZrqw6NG0qrkHkNxbOwkgGIaad3/hoedWnLflqw21Xg3xLVmRqyHJc0NQLx9QmuNKmrDYSdPL4E+ac04g0e+C0J/nrme0W7GazWUZ9fsuxqB9yvl0d/JbZjSG3KaMALKptgAyyO1KpWh8ubcRDfb6al25v+vV3CaqseReqTQCCIaj5v2y6sI3rtd6NcQT53dcDfEcl+TbslAXH1Ca40qasNhJ08uQM39j7wFbfz/JJM5DtJ2s3wtZ3Ikp7FeqyfffY2iGkqzImLVeAkiE199sJtnrYdEqaXy5t18NFqi0rtnNz2ppLLkPITECCNL8q+f+x+XwPw9S8+4vNty4GuK5If6CwFgQmLp2XA1xOUwRRGbGB5TmuJImLHay9BLkfvJ28KlI+pmcQGPFbyfQNnKDkVV9y0gO7cusvpBR288drxFANtUWQKzKWxs1rj63aQ52fNC6cre/egJhDTSWnLmDLQIIDlP4uKU6D/9Nmiehxt2P7r1wNeSXr346GgKmLl+hiTyuty2CyIz4gNIcV9KExU6Sdj/3nueky/76udyTafFbsbT+PrcJVPMp47G0L1XMp0il7fcJjASQTTUGkCpvbdS4cpvoQW9R1Pr6BO7Jw5zH0AwlGwEE+ylwXA/ho62nqpvhrw9S4+7vD3ETvy43+rEQUEP5Ks2O27JcDiLXw66hUj6gNMeVNGGxk6Nd94mj2KNz9bO5E9KL34qlbeRembFFXAXRfswtgOTeDmMEkE01BpDqHserMfX5cGLwORhaZ+5E7snDnMaQewW9RQDBbgoaV0Pg6AaQth6okp4Epab9qmrjSVlu8mv9zhCXH9m7J4h4XzzpPvm2NIzHB5TmuJImLHZytOtFn9uun3fAqebJKKb197lXeREnKO3HbAKItt3n38kIIJtqDCBW1VUQjafPfgz+BZ1aZ+44Jp1To+33Oca3CCCIU7i4FELGKnD86//0P1fV/v9O3VYdvC1Lzbpvydr4AsOffPOjVYcQ14Eg4vJVET+KOPkRvijLB5TmuJImLHZStNu5zWivE52Wy72NpuitWF63qs8Js+qn96TQPuTebjfJJ9Xarv+N+lz9MALIploDiN+DVcwF0TieW40oT6nfs9wPhWzwIJRK2+579cMIIIhTqLjbCRnnX/zK98//w3/7f+efe/7VbvhoK+dqiL9vw437qjz5u9bJ6d3yE7N869iOyeptOYz4ljOujEzIB5TmuJImLHYytMu5Tbh/tvdJTsvm3vZU9FYsrb/vSXP2t2KF/cgxenOjbfZpwloEkE21BhCb/IlYGkPfDySKNM9ab58wNMnjeLVd37bW57VrEUBwkcJEO+l8VX/216+d/8f//v/X5TDyb67/r24AaetWWMVeoUl3w76quYQQl6/YeCK9r9509yFSvk3LYctXR/jSwhH5gNIcV9KExU6Gdjl3suVRn/5r+dyrLVby5NS36fAysw4hzW5kGbW50fb6/K50EUA21RxAbNJbsbT9Pk9vKvaaat0+NuU66gOivrTNPvPpuggg2KQQsTHp/N/9l1c2wke3Pv9Xf98NH23dV6XckuXG3I36quYUQtryVZGHLz2zesRwd1/2lK+Q3FZ5/sg1FcGkAB9QmuNKmrDYSdDu5n7CNsijHrWe3E+1S9+K1fcqiMc12S0Px9LYs94b4uZmlFtltB3fInbMJ6pGANlUewCx58LqRqXt5j4ko1WscTatv09jP+rVJG2v72vXRQDBnyg4bEw691UO33YVCx9t/fv/+n/Pn/3yd7ZDyJnqYHOtBnz2IaQthxF/n8iB+SLRCi8HBuIDSnNcSRMWWzztap9L5oN84q/19LnqUOxWLK3b4+k7z8D7MemVEG9flf36eBlVrjGeTjZE+DACyKY5BBD/uxdt6rdpe30b6OLNqrbR5/HTNsrVJG2n7/i2EUDQUGC4MOn8L/72H6OhY7scUnylpF02lIPMjbD6ndSAXwghtU9MTylPXv/Fy59cBZID80YIIAPzAaU5rqQJiy2edjXrdZFBG0+tr7Zvyz3mdh83TZPcPqLtts1w9olTy/S5x9yK7avWPVT4MALIpjkEkNZYDfQxn94X/+BB2/AHRX0VfQ21/r5XjmMIIGgoLFyYdB4LG/vKc0W66wh18DtD1IRvhJA5PB0rt3yF5Mlrz65CyRvf/vh6X1X3w8uAgfiA0hxX0oTFFk27mfuplRvCwW+90Tqz/m2k9K1Yx0x4Nt9DPtYtSg5w3as2fQJIn3vMW4M3N16nal/48N/lhBMCyKY5BRDz+7HI+0nrdWN/zHhHmw+lbfWZm9Iq8T71cePQmHI/RCCA4PCk85zyLVmRx/XeCZvaSY34hRASa+SXUL460tlXAsjAfEBpjiuL0vsgqWX7fMJc5L5srddjyVX6qVjHTqb0a+sGtURg84l/O3i0ev1OaLljPgEepAnTelKbQb+uOe9nAsimmgKIf4dTjkP+ucGaaK3L7yH/++UeA7sGmQuXSts79mEMg30wovX4qmns+NPlv896jwgB5NQpHCRPOk8t37oVeUpWSgjZeDpWzd+YfkwRQMryAaU5rizKMQEkt8Eu3bT0uepQ8mTVZ27MLm7ujw5vXkdY175x9fp30nLHNje9G0Qt522nBqBV06f/5ryfi/zuar0EkAivv9lMEv9szuu4+j1T9WqktZzf18cGD/PyUzxl6tjzmMft/e81di3n1z51DH5fE0CQTqEge9J5ank9PUPIxveE+JG3sSZ+zkUAKcsHlOa4sih9m83ck4IVPdlq/f5EMrcpcDNS7FYnrXvIeQjmdfn30K+/w4RP0BfG7z8Lf+ef8c/m/O72PnF62WYVR/E+Oky4UbnQTOjP2n3z3/vnDn2Kum11v73+O8prso/Wm/U+CosVodVP/nq0vP5mM0lWY9F/+1xx9Hb8b+DfpwvzMPRn3d81f8Bx7FXNrqme0tXnavEufj3aY9G+18+36vrqSc6xcHWFWv/Neo8IAeRUKQz0nnSeWjsmp6eEED+u9rytuT4Za1cRQMryAaU5rixK9kFSy/iEkmuU+5y1HTcKuUrfijV0CCmt94lTyw7Z3JSw/u4Z/e+c93ORZkLrJYBEeP3NZpKsxqL/DnnFsbSik7oP0faPnaNWmoPN6oMV/ZcAgjQKAkdPOk+t3BCipvySyl/kd+7y92wsaVI6AaQsH1Ca48qiZB0k9fP+RCv3E+dHYfFRaHt9/p2KnbRM659TCDnqxKnlcxuGsbwShrii/5/ze1KkmdB6CSARXn+zmSTrseh/+5P42k0aPloax5BXc4bk4+T6aor+NwEEhykADDbpPLV6hJCrnSZ99eSoWDM/xyKAlOUDSnNcWZSsg6R+vqp5FjHanj8JzVX0VizT+h1CcsPbFI4+cWodxzxtp4QL++Q/a/4qSZFmQuslgER4/c1mkmyMRf+/z1XQsVQRPkxj8YdJNX4osnG+0P8ngGA/Nf6DTzpPrUgI2fuIXjXnG5PS/UV/sYZ+bkUAKcsHlOa4sijJB0n9bJ9PFzc+dR6LttvnU/gxvhjPJ/3af4+OPnFqHd7PWj5h9esdmyeT8+9QpJnQegkgEV5/s5kkF8aiP6sthLjRryZ8tDSm2q7MXniN9GcEEOymhr/YpPOU2jExfe+XFapBv9s26/5CP3+fRqypn1M5SLX7pDo4JwZ5fEBpjiuLknSQ1M/1+bTMP1/0qsIu3q6qz9WGUa7WaDuelFnjp482yIlT66khhOwMwPq7nPdzkWZC6yWARHj9zWaSRMeiP68lhPg9UPyLBvvy2FRTX5n1sTD6GunPCSCIU6NffNJ5SkVCiAPR1TDMC9Sgez7I07Zh9zeLx5r6OZW/jLDdH9WtsKsYiA8ozXFlUZIOkvq5PrfUrCf8TkHb73PFpvitWC1tx7eK1fY75fEM+rQyrW+KCa9uaPb+/unvc157Asim6gOI6e+mbq5H+5LBY2icU16ZdUDbeczR3xFAEKcmf7RJ54fKwWfrywrPVJfCUC9Qk36907CvvlE81tjPpQggZfmA0hxXFuXgQVI/k/tt51bFwdfjaIaTpfitWF3anp8qNvXvlrdf8sTtMDhWI+h9ORiiws+lKvL7rPUSQCK8/mYzSfaORX/v5nrsEOzHQxd97HgJGrOvGo11ZdbbORjQ/DOrn05HADkFau5Hn3R+qPyN6d0xqfbOhVCjvr4Va+5PxSKAlOUDSnNcWZRDJ+++j7as4pYDjaPPhHQb5VasLm3Tn9Ye+pLAITkQuDEbrVHSttxMlAoifn8m/7uFn09FANk0mwDS0s/5WJD6ZZV9+H07y+DRpfE7sPn3stRxKOt10s8RQLBJjf1kk84P1Z//zT90A4hrZzOuRv2yan0rlpv4WHM/hyKAAMugk5evGPgkPXSz7tsdHDomDYjavvcv94vJYtpmptp77FEX/a44iAwVhNvfv+ommA9B+9Ueh4YIIz72+Gr6JPMCsRBq6CeddJ5SkSdj7ZsPcqvTuM92QjoBBFgenbDdMLkRcNPkpv2eat/kbjdW/hmXl/FJf/QrOqk8tjBGNzr79q3dL/+cf57QgaPod8jvLd925FC+73fPDXj3PeVlTur3z/ur8vuufa1cu3RfKx+7CB04nhr5KiadHyoHome//J1uADk0H2T9BYUPXrwUbfBrLwIIAAAAFkdNfDWTzg9VZD7I7bAbF6hh35iQPserIAQQAAAALIoa+OomnR+qz//V33cDiGvfrVj32wZ+jldBHr70DAEEAAAAy6DGvdpJ54dq6/tBHoRdukBN+7VOAz+7qyD+LpPO+K+F3QIAAADmRU179ZPO91XkVqybYdcuUOM+26sgBBAAAADMnpr1C5PO3dDHGv2aK/It6dEJ6WrcZzsXhAACAACA2VOjvjHp/OqN/xNt8GstX6m58pcvd8OHywHkctjFC9S8r5+INafvBSGAAAAAYNbUpG9MOveE7liTX2v5Ss3Wo3hdvpqzM3yYmvcbbSPvb0ePNfs1FgEEAAAAs6UmfWPS+b/9z/872uTXWv42dN8u1t0H1R3Vzu8Caal5v6Rafzv6k9eejTb8tRUBBAAAALOkJn3Wk84/9/yr28HDtXPieYwa+DttM//Gtz8ebfhrKwIIAAAAZkeN+mwnne+Z77Hzuz92UQN/tdPMn//xh5+NNv01FQEEAAAAs6NmfZaTzvfM9zh4y9UuauLXk9F/+eqno01/TfWjr324G0D2znMBAAAAJqdmfZaTznfN9wi71Zua+NttQz+H27DasbrCLgAAAAB1UsM+y0nn/kb27rhD3Qi7dRQ18rO6Das71rALAAAAQH3UsM9u0rnHt/Xlgq5e8z32UTO/vg2r9qdhteN0heEDAAAAdVHDPrtJ5x5f5Jaro+Z77KJmfn0b1oMXL0Ub/1qqHacrDB8AAACoi5r2WU0693yP7nhDHT3fYxc189fbpr72LyVsx+kKwwcAAADqocZ9VpPOS8732Kfb2P/hB5+JNv81VHecYegAAABAHdS4z2bS+Y75HmeqQed77KKG/n7b2Nf8ON52jK4wdAAAAGB6btxVs5h0vmO+x33V4PM9dlFDf6tt7B++9Ey0+Z+6/ISudoyuMHQAAABgWm7cVbOYdL5jvsftsCujUUO/ngfibxuPBYCp67ffu9wNIPfD0AEAAIBpqYGvftK5r8ZE5nv4ik3x+R4xaugvd5r7aACYugggAAAAqI4a+Judhr7KSed/8bf/OOl8j13U1D9tG/zfv34lGgKmLAIIAAAAqqIG/lqnoa9y0vkXv/L9yed77OKmvm3wa/xCQgIIAAAAqqEG/rKq6knnf/bXr20HD9fo8z12UVO/8YWEbvgP1ePvfur8Fy9/8mB5Xsmh+sk3P9oNGIeKAAIAAIBpqImvetJ5bfM9dlFTv34S1gyKAAIAAIBpqJG/02nsq5p0Xut8jxg19de2mvxay3NVqrlyBAAAgBOiRr7aSec1z/eIUVPfDSBu8j0n5FDdUfnKyaHyY369/r0VhgIAAADUR418tZPOd8z3uBWGDgAAAGBO1MxXOel8z3yP62HoAAAAAOZEzXyVk853zPfwOKub7wEAAAAgkRr66iadewyR+R7+RvYq53sAAAAASKCGvrpJ5x5Dd0yhmO8BAAAAzJma+qomnXu+h8fQHZOK+R4AAADA3Kmpr2rSueecMN8DAAAAWCA19RuTzl3+jo1YMBijmO8BAAAALJga+41J5y4HAM+9GPsqCPM9AAAAgIVTg++5Hw4h61uw2nr2y98Z5SlYe+Z78O3dAAAAwBKp2fetWH4K1plqIwz4y/9KXQ3ZM9/jchgaAAAAgKVS4+8gcku1cUXEIWHoLyTcMd/DV2OY7wEAAACcEoUAPxnrfggFqxryW9E/9/yr3dDR1s2weQAAAACnSKHAV0PWIeHYEOJbua785cvd0OFivgcAAAAwV//0dx+6prquutWpmyr/efbcCoWDGyEkHBVCvIwntrfrCcV8DwAAAGBOHCpCwLivOk+op6o7quRvFVdIuKraCCE5E9P//G/+gfkeAAAAwJwpQDh4OEjEQkZqnaluhFXupbDgELIOEJ6YHgsb28V8DwAAAGDGFBguqW6HAHGhfvz1j5z/9FsfO3/40jPnv3j5k6t68OKl1Z/Ffj6Ug8jBeRgKDr4dax0k/OWBsdDhYr4HAAAAMHMKCVdVD0JoWNdPvvnR88ff/dT5H37wmfPzf/783nry2rOrQPKjr314Yx2hbodN7aQAcbsTKKLzQZjvAQAAAMycwoHDh+dvrAODr3b89nuXo0HjUP3xh59dXR3pri+U55LsnJuhEOHvCll/YaGvcnTDx675HmFxAAAAALVTILgQPhweYsEit3zVxFdQuutW+SrLvhByrRswvviV76/Cx475HklzTAAAAABUQEFgI3z41qm+Vz32lW/LarcRau9VCwULP8VqFTJ8FcST0tv/H8rzPa6GHwcAAABQO4UATzhfz/lw+Pj961eiAWKIioSQnU+rUrjwt6Vvh462PN+DR+wCAAAAc6IAsPG0qxJXPrbrjW9/vBtAXDsnjitkrK+CdIr5HgAAAMDcuPHvBoGh5nwcKk9O9+T2zrbvhyFdoLCxMRdExXwPAAAAYI7U+K+/ZNCTxGNhoVT5Sku77VA7v7tDocNPxGK+BwAAADBXavg3rn6McevVdm19ceHO26oUPK6rmO8BAAAAzJUa/ptt8z/21Y+2IldBCBkAAADAEqnZXz/5yt9wHgsIY9TWXBDmdwAAAABL1Gn6V18UGAsHY9TDl57pBpDbYXgAAAAAlkKN/rW26fcViFgwGKuevPZsN4DsfBoWAAAAgJlSo3+jbfo9ETwWDMYqX31px+IKQwQAAACwFGr0b7UN/1jf/bGv2rG4whABAAAALIUafQIIAAAAgHGo0SeAAAAAABiHGv11APFTqGKhYMxqx+IKQwQAAACwFGr010/BmnoS+taXEZ6FIQIAAABYCjX6V9um/0df+3A0GIxVv3z1090AwmN4AQAAgCVSs/+0bfx///qVaDgYo9749se7AeRWGB4AAACAJVGzf7dt/KeaB/LHH352dQWmHYfqahgeAAAAgCVRs7/+MkKHAIeBWEgoWVu3XzH/AwAAAFgyNf3r27DGfhyvA8+Pv/6RbgDh9isAAABgydz0twHAV0H+8IPPRMNCiXLgabetchC6FIYFAAAAYInc9KvOQggY7ZG8nvTebjMUVz8AAACAU6Dm/3o3DDx48VI0NAxVvsqyNfH8QRgKAAAAgFOgEHCnEwiKhRCHj59886Pd8OFbr3jyFQAAAHBqFAQedILBKoQM+WQs33a1deXDdSNsHgAAAMApURjwfJCNEOKrFb/93uVooMiprQnnbRE+AAAAgFOmUOAQcr8TElblqyG535buqyf+no+tR+22RfgAAAAA0FBAWD+et1u+IuKrGb4qErs9yyHFocOBJXK7lctP3GLOBwAAAIBNDgqqC1dDepYnmzvU8F0fAAAAAHZTaLimuquKBYtDRfAAAAAAkM8hQnVD5Uf2bkxW75QDh6+aOHRcC4sCAAAAAAAAAAAAAAAAAAAAAAAg1Yc+9C+CyYFQsnpjxgAAAABJRU5ErkJggg==';
            var imageHeight = width * 3 / 8;
            var oldAntialias = this.getAntialiasing();
            this.setAntialiasing(true);
            ctx.drawImage(image, 0, 0, 800, 300, x, y - imageHeight - 20, width, imageHeight);
            // loading box
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, 20);
            var progress = width * (loaded / total);
            ctx.fillStyle = 'white';
            var margin = 5;
            var width = progress - margin * 2;
            var height = 20 - margin * 2;
            ctx.fillRect(x + margin, y + margin, width > 0 ? width : 0, height);
            this.setAntialiasing(oldAntialias);
        };
        /**
         * Sets the loading screen draw function if you want to customize the draw
         * @method setLoadingDrawFunction
         * @param fcn {ctx: CanvasRenderingContext2D, loaded: number, total: number) => void}
         * Callback to draw the loading screen which is passed a rendering context, the number of bytes loaded, and the total number of bytes to load.
         */
        Engine.prototype.setLoadingDrawFunction = function (fcn) {
            this.loadingDraw = fcn;
        };
        /**
         * Another option available to you to load resources into the game.
         * Immediately after calling this the game will pause and the loading screen
         * will appear.
         * @method load
         * @param loader {ILoadable} Some loadable such as a Loader collection, Sound, or Texture.
         */
        Engine.prototype.load = function (loader) {
            var _this = this;
            var complete = new ex.Promise();
            this.isLoading = true;
            loader.onprogress = function (e) {
                _this.progress = e.loaded;
                _this.total = e.total;
                _this.logger.debug('Loading ' + (100 * _this.progress / _this.total).toFixed(0));
            };
            loader.oncomplete = function () {
                setTimeout(function () {
                    _this.isLoading = false;
                    complete.resolve();
                }, 500);
            };
            loader.load();
            return complete;
        };
        return Engine;
    })(ex.Class);
    ex.Engine = Engine;
    ;
})(ex || (ex = {}));
//# sourceMappingURL=excalibur-0.2.5.js.map
;
// Concatenated onto excalibur after build
// Exports the excalibur module so it can be used with browserify
// https://github.com/excaliburjs/Excalibur/issues/312
if (typeof module !== 'undefined') {module.exports = ex;}
},{}],"/home/a/odesk/snake/lib/food.js":[function(require,module,exports){
/*jslint node:true,nomen:true*/
var _ = require('lodash');

module.exports = function (opts) {
    'use strict';
    var
        parts = opts.parts,
        randPart = parts[_.random(0, parts.length - 1)],
        x = randPart.x,
        y = randPart.y,
        ex = opts.ex,
        game = opts.game,
        color = opts.color,
        w = game.width,
        h = game.height,
        size = opts.size,
        findX = function () {
            var r;
            if (w - x > 2 * size) {
                r = x + size * _.random(1, Math.floor((w - x) / size - 1));
            } else if (x > size) {
                r = size * _.random(0, Math.floor((x - size) / size));
            }
            return _.pluck(parts, 'x').indexOf(r) === -1 ? r : findX();
        },
        findY = function () {
            var r;
            if (h - y > 2 * size) {
                r = y + size * _.random(1, Math.floor((h - y) / size - 1));
            } else if (y > size) {
                r = size * _.random(0, Math.floor((y - size) / size));
            }
            return _.pluck(parts, 'y').indexOf(r) === -1 ? r : findY();
        },
        actor = new ex.Actor(findX(), findY(), size, size, color);
    this.eat = function () {
        actor.kill();
    };
    this.actor = actor;
    game.add(actor);
};

},{"lodash":"/home/a/odesk/snake/node_modules/lodash/index.js"}],"/home/a/odesk/snake/lib/snake.js":[function(require,module,exports){
/*jslint node:true,nomen:true*/
var Food = require('./food'),
    _ = require('lodash');

module.exports = function (opts) {
    'use strict';
    var
        self = this,
        v = {},
        running = false,
        speed = 150,
        game = opts.game,
        size = Math.floor(Math.min(game.width, game.height) / 32),
        ex = opts.ex,
        color = opts.color,
        getFood = function () {
            return false;//TODO
        },
        part = function (x, y, color) {
            var actor = new ex.Actor(x, y, size, size, color);
            game.add(actor);
            return actor;
        },
        startPlaceRandX = _.random(2, Math.floor(game.width / size) - 2),
        startPlaceRandY = _.random(2, Math.floor(game.height / size) - 2),
        parts = [
            part((startPlaceRandX + 1) * size, startPlaceRandY * size, color.body),
            part(startPlaceRandX * size, startPlaceRandY * size, color.body)
        ],
        food = new Food({
            ex: ex,
            game: game,
            color: color.food,
            parts: parts,
            size: size
        }),
        cutTail = function () {
            var last = parts.pop(),
                prelast = parts[parts.length - 1];
            last.moveTo(
                prelast.x,
                prelast.y,
                2 * speed
            );
            return last;
        },
        addNeck = function (time) {
            var firstPart = parts[0],
                x = firstPart.x,
                y =  firstPart.y,
                newPart = part(x, y, color.body);
            parts.unshift(newPart);
            newPart.moveTo(
                x + v.x * size,
                y + v.y * size,
                speed
            );
            newPart.on('exitviewport', function () {
                self.onLose();
            });
            newPart.on('collision', function (e) {
                if (e.other.color !== color.food) {
                    self.onLose();
                }
            });
            return newPart;
        },
        step = function () {
            addNeck().callMethod(function () {
                if (this.within(food.actor, size / 2)) {
                    speed += 50;
                    food.eat();
                    food = new Food({
                        ex: ex,
                        game: game,
                        color: color.food,
                        parts: parts,
                        size: size
                    });
                    step();
                } else {
                    cutTail().callMethod(function () {
                        this.kill();
                        document.title = 'Score: ' + (parts.length - 2);
                        step();
                    });
                }
            });
        };
    this.right = function () {
        v.x = 1;
        v.y = 0;
    };
    this.left = function () {
        v.x = -1;
        v.y = 0;
    };
    this.up = function () {
        v.x = 0;
        v.y = -1;
    };
    this.down = function () {
        v.x = 0;
        v.y = 1;
    };
    this.run = function (obj) {
        v.x = obj.x || 0;
        v.y = obj.y || 0;
        step();
    };
    this.kill = function (v) {
        food.actor.kill();
        parts.forEach(function (part) {part.kill(); });
    };
};

},{"./food":"/home/a/odesk/snake/lib/food.js","lodash":"/home/a/odesk/snake/node_modules/lodash/index.js"}],"/home/a/odesk/snake/node_modules/domready/ready.js":[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],"/home/a/odesk/snake/node_modules/lodash/index.js":[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.1.0';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      REARG_FLAG = 128,
      ARY_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 0,
      LAZY_MAP_FLAG = 1,
      LAZY_WHILE_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /**
   * Used to match ES template delimiters.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-template-literal-lexical-components)
   * for more details.
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect named functions. */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect hexadecimal string values. */
  var reHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /**
   * Used to match `RegExp` special characters.
   * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
   * for more details.
   */
  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to detect functions containing a `this` reference. */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '{2,}(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to detect and test for whitespace. */
  var whitespace = (
    // Basic whitespace characters.
    ' \t\x0b\f\xa0\ufeff' +

    // Line terminators.
    '\n\r\u2028\u2029' +

    // Unicode category "Zs" space separators.
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'document',
    'isFinite', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    'window', 'WinRTError'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used as an internal `_.debounce` options object by `_.throttle`. */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = (objectTypes[typeof window] && window !== (this && this.window)) ? window : this;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare to `other`.
   * @param {*} other The value to compare to `value`.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsReflexive = value === value,
          othIsReflexive = other === other;

      if (value > other || !valIsReflexive || (typeof value == 'undefined' && othIsReflexive)) {
        return 1;
      }
      if (value < other || !othIsReflexive || (typeof other == 'undefined' && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = (fromIndex || 0) - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.sortBy` and `_.sortByAll` which uses `comparer`
   * to define the sort order of `array` and replaces criteria objects with their
   * corresponding values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * Converts `value` to a string if it is not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.max` and `_.min` as the default callback for string values.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the code unit of the first character of the string.
   */
  function charAtCallback(string) {
    return string.charCodeAt(0);
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare to `other`.
   * @param {Object} other The object to compare to `object`.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByAll` to compare multiple properties of each element
   * in a collection and stable sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare to `other`.
   * @param {Object} other The object to compare to `object`.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultipleAscending(object, other) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        return result;
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   * If `fromRight` is provided elements of `array` are iterated from right to left.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} [fromIndex] The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromRight ? (fromIndex || length) : ((fromIndex || 0) - 1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return (value && typeof value == 'object') || false;
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'add': function(a, b) { return a + b; } });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'sub': function(a, b) { return a - b; } });
   *
   * _.isFunction(_.add);
   * // => true
   * _.isFunction(_.sub);
   * // => false
   *
   * lodash.isFunction(lodash.add);
   * // => false
   * lodash.isFunction(lodash.sub);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype;

    /** Used to detect DOM support. */
    var document = (document = context.window) && document.document;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to the length of n-tuples for `_.unzip`. */
    var getLength = baseProperty('length');

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the `toStringTag` of values.
     * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
     * for more details.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = context._;

    /** Used to detect if a method is native. */
    var reNative = RegExp('^' +
      escapeRegExp(objToString)
      .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer,
        bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
        ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        push = arrayProto.push,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = isNative(Set = context.Set) && Set,
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array,
        unshift = arrayProto.unshift,
        WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap;

    /** Used to clone array buffers. */
    var Float64Array = (function() {
      // Safari 5 errors when using an array buffer to initialize a typed array
      // where the array buffer's `byteLength` is not a multiple of the typed
      // array's `BYTES_PER_ELEMENT`.
      try {
        var func = isNative(func = context.Float64Array) && func,
            result = new func(new ArrayBuffer(10), 0, 1) && func;
      } catch(e) {}
      return result;
    }());

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsFinite = context.isFinite,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = isNative(nativeNow = Date.now) && nativeNow,
        nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1,
        MAX_ARRAY_INDEX =  MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /** Used as the size, in bytes, of each `Float64Array` element. */
    var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

    /**
     * Used as the maximum length of an array-like value.
     * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
     * for more details.
     */
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable intuitive chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that return a boolean or single value will
     * automatically end the chain returning the unwrapped value. Explicit chaining
     * may be enabled using `_.chain`. The execution of chained methods is lazy,
     * that is, execution is deferred until `_#value` is implicitly or explicitly
     * called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization that merges iteratees to avoid creating intermediate
     * arrays and reduce the number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * The wrapper functions that support shortcut fusion are:
     * `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`, `first`,
     * `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`, `slice`,
     * `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `where`
     *
     * The chainable wrapper functions are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `compact`, `concat`, `constant`, `countBy`,
     * `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`, `difference`,
     * `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`, `flatten`,
     * `flattenDeep`, `flow`, `flowRight`, `forEach`, `forEachRight`, `forIn`,
     * `forInRight`, `forOwn`, `forOwnRight`, `functions`, `groupBy`, `indexBy`,
     * `initial`, `intersection`, `invert`, `invoke`, `keys`, `keysIn`, `map`,
     * `mapValues`, `matches`, `memoize`, `merge`, `mixin`, `negate`, `noop`,
     * `omit`, `once`, `pairs`, `partial`, `partialRight`, `partition`, `pick`,
     * `pluck`, `property`, `propertyOf`, `pull`, `pullAt`, `push`, `range`,
     * `rearg`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `sortByAll`, `splice`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`,
     * `where`, `without`, `wrap`, `xor`, `zip`, and `zipObject`
     *
     * The wrapper functions that are **not** chainable by default are:
     * `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
     * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
     * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
     * `identity`, `includes`, `indexOf`, `isArguments`, `isArray`, `isBoolean`,
     * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`,
     * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
     * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
     * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
     * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
     * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
     * `startCase`, `startsWith`, `template`, `trim`, `trimLeft`, `trimRight`,
     * `trunc`, `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper function `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, n) { return sum + n; });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) { return n * n; });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return new LodashWrapper(value.__wrapped__, value.__chain__, arrayCopy(value.__actions__));
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    (function(x) {

      /**
       * Detect if functions can be decompiled by `Function#toString`
       * (all but Firefox OS certified apps, older Opera mobile browsers, and
       * the PlayStation 3; forced `false` for Windows 8 apps).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

      /**
       * Detect if `Function#name` is supported (all but IE).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.funcNames = typeof Function.name == 'string';

      /**
       * Detect if the DOM is supported.
       *
       * @memberOf _.support
       * @type boolean
       */
      try {
        support.dom = document.createDocumentFragment().nodeType === 11;
      } catch(e) {
        support.dom = false;
      }

      /**
       * Detect if `arguments` object indexes are non-enumerable.
       *
       * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
       * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
       * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
       * checks for indexes that exceed their function's formal parameters with
       * associated values of `0`.
       *
       * @memberOf _.support
       * @type boolean
       */
      try {
        support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
      } catch(e) {
        support.nonEnumArgs = true;
      }
    }(0, 0));

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.actions = null;
      this.dir = 1;
      this.dropCount = 0;
      this.filtered = false;
      this.iteratees = null;
      this.takeCount = POSITIVE_INFINITY;
      this.views = null;
      this.wrapped = value;
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var actions = this.actions,
          iteratees = this.iteratees,
          views = this.views,
          result = new LazyWrapper(this.wrapped);

      result.actions = actions ? arrayCopy(actions) : null;
      result.dir = this.dir;
      result.dropCount = this.dropCount;
      result.filtered = this.filtered;
      result.iteratees = iteratees ? arrayCopy(iteratees) : null;
      result.takeCount = this.takeCount;
      result.views = views ? arrayCopy(views) : null;
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.filtered) {
        var result = new LazyWrapper(this);
        result.dir = -1;
        result.filtered = true;
      } else {
        result = this.clone();
        result.dir *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.wrapped.value();
      if (!isArray(array)) {
        return baseWrapperValue(array, this.actions);
      }
      var dir = this.dir,
          isRight = dir < 0,
          view = getView(0, array.length, this.views),
          start = view.start,
          end = view.end,
          length = end - start,
          dropCount = this.dropCount,
          takeCount = nativeMin(length, this.takeCount - dropCount),
          index = isRight ? end : start - 1,
          iteratees = this.iteratees,
          iterLength = iteratees ? iteratees.length : 0,
          resIndex = 0,
          result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              computed = iteratee(value, index, array),
              type = data.type;

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        if (dropCount) {
          dropCount--;
        } else {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Adds `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * A specialized version of `_.max` for arrays without support for iteratees.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     */
    function arrayMax(array) {
      var index = -1,
          length = array.length,
          result = NEGATIVE_INFINITY;

      while (++index < length) {
        var value = array[index];
        if (value > result) {
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.min` for arrays without support for iteratees.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     */
    function arrayMin(array) {
      var index = -1,
          length = array.length,
          result = POSITIVE_INFINITY;

      while (++index < length) {
        var value = array[index];
        if (value < result) {
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return typeof objectValue == 'undefined' ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This method is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (typeof objectValue == 'undefined' || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize assigning values.
     * @returns {Object} Returns the destination object.
     */
    function baseAssign(object, source, customizer) {
      var props = keys(source);
      if (!customizer) {
        return baseCopy(source, object, props);
      }
      var index = -1,
          length = props.length

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? result !== value : value === value) ||
            (typeof value == 'undefined' && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.at` without support for strings and individual
     * key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} [props] The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          length = collection.length,
          isArr = isLength(length),
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          key = parseFloat(key);
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = collection[key];
        }
      }
      return result;
    }

    /**
     * Copies the properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Array} props The property names to copy.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, object, props) {
      if (!props) {
        props = object;
        object = {};
      }
      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.bindAll` without support for individual
     * method name arguments.
     *
     * @private
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {string[]} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     */
    function baseBindAll(object, methodNames) {
      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return (typeof thisArg != 'undefined' && isBindable(func))
          ? bindCallback(func, thisArg, argCount)
          : func;
      }
      if (func == null) {
        return identity;
      }
      // Handle "_.property" and "_.matches" style callback shorthands.
      return type == 'object'
        ? baseMatches(func)
        : baseProperty(func + '');
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (typeof result != 'undefined') {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseCopy(value, result, keys(value));
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || context.Object();
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The `arguments` object to slice and provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args, fromIndex) {
      if (!isFunction(func)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, baseSlice(args, fromIndex)); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = isCommon && values.length >= 200 && createCache(values),
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    function baseEach(collection, iteratee) {
      var length = collection ? collection.length : 0;
      if (!isLength(length)) {
        return baseForOwn(collection, iteratee);
      }
      var index = -1,
          iterable = toObject(collection);

      while (++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    }

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    function baseEachRight(collection, iteratee) {
      var length = collection ? collection.length : 0;
      if (!isLength(length)) {
        return baseForOwnRight(collection, iteratee);
      }
      var iterable = toObject(collection);
      while (length--) {
        if (iteratee(iterable[length], length, iterable) === false) {
          break;
        }
      }
      return collection;
    }

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            value = baseFlatten(value, isDeep, isStrict);
          }
          var valIndex = -1,
              valLength = value.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[++resIndex] = value[valIndex];
          }
        } else if (!isStrict) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iterator functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    function baseFor(object, iteratee, keysFunc) {
      var index = -1,
          iterable = toObject(object),
          props = keysFunc(object),
          length = props.length;

      while (++index < length) {
        var key = props[index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    function baseForRight(object, iteratee, keysFunc) {
      var iterable = toObject(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[length];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invoke` which requires additional arguments
     * to be provided as an array of arguments rather than individually.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {Array} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     */
    function baseInvoke(collection, methodName, args) {
      var index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = isLength(length) ? Array(length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? methodName : (value != null && value[methodName]);
        result[++index] = func ? func.apply(value, args) : undefined;
      });
      return result;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isWhere] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
      // Exit early for identical values.
      if (value === other) {
        // Treat `+0` vs. `-0` as not equal.
        return value !== 0 || (1 / value == 1 / other);
      }
      var valType = typeof value,
          othType = typeof other;

      // Exit early for unlike primitive values.
      if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
          value == null || other == null) {
        // Return `false` unless both values are `NaN`.
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isWhere] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (valWrapped || othWrapped) {
        return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands or `this` binding.
     *
     * @private
     * @param {Object} source The object to inspect.
     * @param {Array} props The source property names to match.
     * @param {Array} values The source values to match.
     * @param {Array} strictCompareFlags Strict comparison flags for source values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      var index = -1,
          noCustomizer = !customizer;

      while (++index < length) {
        if ((noCustomizer && strictCompareFlags[index])
              ? values[index] !== object[props[index]]
              : !hasOwnProperty.call(object, props[index])
            ) {
          return false;
        }
      }
      index = -1;
      while (++index < length) {
        var key = props[index];
        if (noCustomizer && strictCompareFlags[index]) {
          var result = hasOwnProperty.call(object, key);
        } else {
          var objValue = object[key],
              srcValue = values[index];

          result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (typeof result == 'undefined') {
            result = baseIsEqual(srcValue, objValue, customizer, true);
          }
        }
        if (!result) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * or `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var result = [];
      baseEach(collection, function(value, key, collection) {
        result.push(iteratee(value, key, collection));
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which supports specifying whether
     * `source` should be cloned.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var props = keys(source),
          length = props.length;

      if (length == 1) {
        var key = props[0],
            value = source[key];

        if (isStrictComparable(value)) {
          return function(object) {
            return object != null && value === object[key] && hasOwnProperty.call(object, key);
          };
        }
      }
      var values = Array(length),
          strictCompareFlags = Array(length);

      while (length--) {
        value = source[props[length]];
        values[length] = value;
        strictCompareFlags[length] = isStrictComparable(value);
      }
      return function(object) {
        return baseIsMatch(object, props, values, strictCompareFlags);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns the destination object.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));

      (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          return baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        var value = object[key],
            result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
            isCommon = typeof result == 'undefined';

        if (isCommon) {
          result = srcValue;
        }
        if ((isSrcArr || typeof result != 'undefined') &&
            (isCommon || (result === result ? result !== value : value === value))) {
          object[key] = result;
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = typeof result == 'undefined';

      if (isCommon) {
        result = srcValue;
        if (isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (value ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? result !== value : value === value) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` which does not coerce `key` to a string.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     */
    function basePullAt(array, indexes) {
      var length = indexes.length,
          result = baseAt(array, indexes);

      indexes.sort(baseCompareAscending);
      while (length--) {
        var index = parseFloat(indexes[length]);
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands or `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection)
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (typeof end == 'undefined' || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end - start) >>> 0;
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * or `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= 200,
          seen = isLarge && createCache(),
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * returned by `keysFunc`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved unwrapped value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var args = [result],
            action = actions[index];

        push.apply(args, action.args);
        result = action.func.apply(action.thisArg, args);
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest, instead
     *  of the lowest, index at which a value should be inserted into `array`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (retHighest ? (computed <= value) : (computed < value)) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest, instead
     *  of the lowest, index at which a value should be inserted into `array`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsUndef = typeof value == 'undefined';

      while (low < high) {
        var mid = floor((low + high) / 2),
            computed = iteratee(array[mid]),
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || typeof computed != 'undefined');
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (typeof thisArg == 'undefined') {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      return bufferSlice.call(buffer, 0);
    }
    if (!bufferSlice) {
      // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
      bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
        var byteLength = buffer.byteLength,
            floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
            offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
            result = new ArrayBuffer(byteLength);

        if (floatLength) {
          var view = new Float64Array(result, 0, floatLength);
          view.set(new Float64Array(buffer, 0, floatLength));
        }
        if (byteLength != offset) {
          view = new Uint8Array(result, offset);
          view.set(new Uint8Array(buffer, offset));
        }
        return result;
      };
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(argsLength + leftLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var pad = argsIndex;
      while (++rightIndex < rightLength) {
        result[pad + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[pad + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an accumulator
     * object composed from the results of running each element in the collection
     * through an iteratee. The `setter` sets the keys and values of the accumulator
     * object. If `initializer` is provided initializes the accumulator object.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that assigns properties of source object(s) to a given
     * destination object.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return function() {
        var length = arguments.length,
            object = arguments[0];

        if (length < 2 || object == null) {
          return object;
        }
        if (length > 3 && isIterateeCall(arguments[1], arguments[2], arguments[3])) {
          length = 2;
        }
        // Juggle arguments.
        if (length > 3 && typeof arguments[length - 2] == 'function') {
          var customizer = bindCallback(arguments[--length - 1], arguments[length--], 5);
        } else if (length > 2 && typeof arguments[length - 1] == 'function') {
          customizer = arguments[--length];
        }
        var index = 0;
        while (++index < length) {
          var source = arguments[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        return (this instanceof wrapper ? Ctor : func).apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
      return new SetCache(values);
    };

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, arguments);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that gets the extremum value of a collection.
     *
     * @private
     * @param {Function} arrayFunc The function to get the extremum value from an array.
     * @param {boolean} [isMin] Specify returning the minimum, instead of the maximum,
     *  extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(arrayFunc, isMin) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = null;
        }
        var func = getCallback(),
            noIteratee = iteratee == null;

        if (!(func === baseCallback && noIteratee)) {
          noIteratee = false;
          iteratee = func(iteratee, thisArg, 3);
        }
        if (noIteratee) {
          var isArr = isArray(collection);
          if (!isArr && isString(collection)) {
            iteratee = charAtCallback;
          } else {
            return arrayFunc(isArr ? collection : toIterable(collection));
          }
        }
        return extremumBy(collection, iteratee, isMin);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG;

      var Ctor = !isBindKey && createCtorWrapper(func),
          key = func;

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : null,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : null,
                newHoldersRight = isCurry ? null : argsHolders,
                newPartials = isCurry ? args : null,
                newPartialsRight = isCurry ? null : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this;
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        return (this instanceof wrapper ? (Ctor || createCtorWrapper(func)) : func).apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the pad required for `string` based on the given padding length.
     * The `chars` string may be truncated if the number of padding characters
     * exceeds the padding length.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPad(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(argsLength + leftLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return (this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && !isFunction(func)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = null;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = null;
      }
      var data = !isBindKey && getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data && data !== true) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(null, newData);
      } else {
        result = createHybridWrapper.apply(null, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isWhere] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length,
          result = true;

      if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
        return false;
      }
      // Deep compare the contents, ignoring non-numeric properties.
      while (result && ++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        result = undefined;
        if (customizer) {
          result = isWhere
            ? customizer(othValue, arrValue, index)
            : customizer(arrValue, othValue, index);
        }
        if (typeof result == 'undefined') {
          // Recursively compare arrays (susceptible to call stack limits).
          if (isWhere) {
            var othIndex = othLength;
            while (othIndex--) {
              othValue = other[othIndex];
              result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
              if (result) {
                break;
              }
            }
          } else {
            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
          }
        }
      }
      return !!result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} value The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            // But, treat `-0` vs. `+0` as not equal.
            : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isWhere] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isWhere) {
        return false;
      }
      var hasCtor,
          index = -1;

      while (++index < objLength) {
        var key = objProps[index],
            result = hasOwnProperty.call(other, key);

        if (result) {
          var objValue = object[key],
              othValue = other[key];

          result = undefined;
          if (customizer) {
            result = isWhere
              ? customizer(othValue, objValue, key)
              : customizer(objValue, othValue, key);
          }
          if (typeof result == 'undefined') {
            // Recursively compare objects (susceptible to call stack limits).
            result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
          }
        }
        if (!result) {
          return false;
        }
        hasCtor || (hasCtor = key == 'constructor');
      }
      if (!hasCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments; (value, index, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [isMin] Specify returning the minimum, instead of the
     *  maximum, extremum value.
     * @returns {*} Returns the extremum value.
     */
    function extremumBy(collection, iteratee, isMin) {
      var exValue = isMin ? POSITIVE_INFINITY : NEGATIVE_INFINITY,
          computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = iteratee(value, index, collection);
        if ((isMin ? current < computed : current > computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} [transforms] The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms ? transforms.length : 0;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Checks if `func` is eligible for `this` binding.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is eligible, else `false`.
     */
    function isBindable(func) {
      var support = lodash.support,
          result = !(support.funcNames ? func.name : support.funcDecomp);

      if (!result) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          result = !reFuncName.test(source);
        }
        if (!result) {
          // Check if `func` references the `this` keyword and store the result.
          result = reThis.test(source) || isNative(func);
          baseSetData(func, result);
        }
      }
      return result;
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = +value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number') {
        var length = object.length,
            prereq = isLength(length) && isIndex(index, length);
      } else {
        prereq = type == 'string' && index in object;
      }
      return prereq && object[index] === value;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on ES `ToLength`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
     * for more details.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask;

      var arityFlags = ARY_FLAG | REARG_FLAG,
          bindFlags = BIND_FLAG | BIND_KEY_FLAG,
          comboFlags = arityFlags | bindFlags | CURRY_BOUND_FLAG | CURRY_RIGHT_FLAG;

      var isAry = bitmask & ARY_FLAG && !(srcBitmask & ARY_FLAG),
          isRearg = bitmask & REARG_FLAG && !(srcBitmask & REARG_FLAG),
          argPos = (isRearg ? data : source)[7],
          ary = (isAry ? data : source)[8];

      var isCommon = !(bitmask >= REARG_FLAG && srcBitmask > bindFlags) &&
        !(bitmask > bindFlags && srcBitmask >= REARG_FLAG);

      var isCombo = (newBitmask >= arityFlags && newBitmask <= comboFlags) &&
        (bitmask < REARG_FLAG || ((isRearg || isAry) && argPos.length <= ary));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * A specialized version of `_.pick` that picks `object` properties specified
     * by the `props` array.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` that picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `_.isPlainObject` which checks if `value`
     * is an object created by the `Object` constructor or has a `[[Prototype]]`
     * of `null`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var Ctor,
          support = lodash.support;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag) ||
          (!hasOwnProperty.call(value, 'constructor') &&
            (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length,
          support = lodash.support;

      var allowIndexes = length && isLength(length) &&
        (isArray(object) || (support.nonEnumArgs && isArguments(object)));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it is not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isLength(value.length)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it is not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {numer} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(+size || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(ceil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using
     * `SameValueZero` for equality comparisons.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [5, 2, 10]);
     * // => [1, 3]
     */
    function difference() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var value = arguments[index];
        if (isArray(value) || isArguments(value)) {
          break;
        }
      }
      return baseDifference(value, baseFlatten(arguments, false, true, ++index));
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per element.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) { return n > 1; });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'status': 'busy', 'active': false },
     *   { 'user': 'fred',    'status': 'busy', 'active': true },
     *   { 'user': 'pebbles', 'status': 'away', 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'status': 'away' }), 'user');
     * // => ['barney', 'fred']
     */
    function dropRightWhile(array, predicate, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      predicate = getCallback(predicate, thisArg, 3);
      while (length-- && predicate(array[length], length, array)) {}
      return baseSlice(array, 0, length + 1);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per element.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) { return n < 3; });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'status': 'busy', 'active': true },
     *   { 'user': 'fred',    'status': 'busy', 'active': false },
     *   { 'user': 'pebbles', 'status': 'away', 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.dropWhile(users, { 'status': 'busy' }), 'user');
     * // => ['pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var index = -1;
      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length && predicate(array[index], index, array)) {}
      return baseSlice(array, index);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for, instead of the element itself.
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.findIndex(users, function(chr) { return chr.age < 40; });
     * // => 0
     *
     * // using the "_.matches" callback shorthand
     * _.findIndex(users, { 'age': 1 });
     * // => 2
     *
     * // using the "_.property" callback shorthand
     * _.findIndex(users, 'active');
     * // => 1
     */
    function findIndex(array, predicate, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) { return chr.age < 40; });
     * // => 2
     *
     * // using the "_.matches" callback shorthand
     * _.findLastIndex(users, { 'age': 40 });
     * // => 1
     *
     * // using the "_.property" callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, thisArg) {
      var length = array ? array.length : 0;
      predicate = getCallback(predicate, thisArg, 3);
      while (length--) {
        if (predicate(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, [[4]]];
     *
     * // using `isDeep`
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, 4];
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using `SameValueZero` for equality comparisons. If `fromIndex` is negative,
     * it is used as the offset from the end of `array`. If `array` is sorted
     * providing `true` for `fromIndex` performs a faster binary search.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * // performing a binary search
     * _.indexOf([4, 4, 5, 5, 6, 6], 5, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      } else if (fromIndex) {
        var index = binaryIndex(array, value),
            other = array[index];

        return (value === value ? value === other : other !== other) ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values in all provided arrays using `SameValueZero`
     * for equality comparisons.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = [],
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf;

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(isCommon && value.length >= 120 && createCache(argsIndex && value));
        }
      }
      argsLength = args.length;
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [],
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value)) < 0) {
          argsIndex = argsLength;
          while (--argsIndex) {
            var cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([4, 4, 5, 5, 6, 6], 5, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        return (value === value ? value === other : other !== other) ? index : -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using `SameValueZero` for equality
     * comparisons.
     *
     * **Notes:**
     *  - Unlike `_.without`, this method mutates `array`.
     *  - `SameValueZero` comparisons are like strict equality comparisons, e.g. `===`,
     *    except that `NaN` matches `NaN`. See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     *    for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var array = arguments[0];
      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = arguments.length;

      while (++index < length) {
        var fromIndex = 0,
            value = arguments[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    function pullAt(array) {
      return basePullAt(array || [], baseFlatten(arguments, false, false, 1));
    }

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) { return n % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This function is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5, 6, 6], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the "_.property" callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    function sortedIndex(array, value, iteratee, thisArg) {
      var func = getCallback(iteratee);
      return (func === baseCallback && iteratee == null)
        ? binaryIndex(array, value)
        : binaryIndexBy(array, value, func(iteratee, thisArg, 1));
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5, 6, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value, iteratee, thisArg) {
      var func = getCallback(iteratee);
      return (func === baseCallback && iteratee == null)
        ? binaryIndex(array, value, true)
        : binaryIndexBy(array, value, func(iteratee, thisArg, 1), true);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per element.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) { return n > 1; });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'status': 'busy', 'active': false },
     *   { 'user': 'fred',    'status': 'busy', 'active': true },
     *   { 'user': 'pebbles', 'status': 'away', 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'status': 'away' }), 'user');
     * // => ['pebbles']
     */
    function takeRightWhile(array, predicate, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      predicate = getCallback(predicate, thisArg, 3);
      while (length-- && predicate(array[length], length, array)) {}
      return baseSlice(array, length + 1);
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per element.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) { return n < 3; });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'status': 'busy', 'active': true },
     *   { 'user': 'fred',    'status': 'busy', 'active': false },
     *   { 'user': 'pebbles', 'status': 'away', 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => ['barney']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.takeWhile(users, { 'status': 'busy' }), 'user');
     * // => ['barney', 'fred']
     */
    function takeWhile(array, predicate, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var index = -1;
      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length && predicate(array[index], index, array)) {}
      return baseSlice(array, 0, index);
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * `SameValueZero` for equality comparisons.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, false, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using `SameValueZero`
     * for equality comparisons. Providing `true` for `isSorted` performs a faster
     * search algorithm for sorted arrays. If an iteratee function is provided it
     * is invoked for each value in the array to generate the criterion by which
     * uniqueness is computed. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     *  If a property name or object is provided it is used to create a "_.property"
     *  or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1]);
     * // => [1, 2]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) { return this.floor(n); }, Math);
     * // => [1, 2.5]
     *
     * // using the "_.property" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      // Juggle arguments.
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted;
        isSorted = false;
      }
      var func = getCallback();
      if (!(func === baseCallback && iteratee == null)) {
        iteratee = func(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-`_.zip`
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      var index = -1,
          length = (array && array.length && arrayMax(arrayMap(array, getLength))) >>> 0,
          result = Array(length);

      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * Creates an array excluding all provided values using `SameValueZero` for
     * equality comparisons.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, baseSlice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Symmetric_difference) for
     * more details.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseDifference(result, array).concat(baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var length = arguments.length,
          array = Array(length);

      while (length--) {
        array[length] = arguments[length];
      }
      return unzip(array);
    }

    /**
     * Creates an object composed from arrays of property names and values. Provide
     * either a single two dimensional array, e.g. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of property names and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` object.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) { return chr.user + ' is ' + chr.age; })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _([1, 2, 3])
     *  .last()
     *  .thru(function(value) { return [value]; })
     *  .value();
     * // => [3]
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {*} Returns the `lodash` object.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` object.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        if (this.__actions__.length) {
          value = new LazyWrapper(this);
        }
        return new LodashWrapper(value.reverse());
      }
      return this.thru(function(value) {
        return value.reverse();
      });
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var length = collection ? collection.length : 0;
      if (isLength(length)) {
        collection = toIterable(collection);
      }
      return baseAt(collection, baseFlatten(arguments, false, false, 1));
    }

    /**
     * Checks if `value` is in `collection` using `SameValueZero` for equality
     * comparisons. If `fromIndex` is negative, it is used as the offset from
     * the end of `collection`.
     *
     * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
     * e.g. `===`, except that `NaN` matches `NaN`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
     * for more details.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex) {
      var length = collection ? collection.length : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (!length) {
        return false;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      } else {
        fromIndex = 0;
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1)
        : (getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) { return Math.floor(n); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) { return this.floor(n); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.every(users, 'age');
     * // => true
     *
     * // using the "_.matches" callback shorthand
     * _.every(users, { 'age': 36 });
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4], function(n) { return n % 2 == 0; });
     * // => [2, 4]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['fred']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.filter(users, { 'age': 36 }), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.result(_.find(users, function(chr) { return chr.age < 40; }), 'user');
     * // => 'barney'
     *
     * // using the "_.matches" callback shorthand
     * _.result(_.find(users, { 'age': 1 }), 'user');
     * // => 'pebbles'
     *
     * // using the "_.property" callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'fred'
     */
    function find(collection, predicate, thisArg) {
      if (isArray(collection)) {
        var index = findIndex(collection, predicate, thisArg);
        return index > -1 ? collection[index] : undefined;
      }
      predicate = getCallback(predicate, thisArg, 3);
      return baseFind(collection, predicate, baseEach);
    }

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) { return n % 2 == 1; });
     * // => 3
     */
    function findLast(collection, predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 3);
      return baseFind(collection, predicate, baseEachRight);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'status': 'busy' },
     *   { 'user': 'fred',   'age': 40, 'status': 'busy' }
     * ];
     *
     * _.result(_.findWhere(users, { 'status': 'busy' }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40 }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Iterator functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(n) { console.log(n); }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(n, key) { console.log(n, key); });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    function forEach(collection, iteratee, thisArg) {
      return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
        ? arrayEach(collection, iteratee)
        : baseEach(collection, bindCallback(iteratee, thisArg, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(n) { console.log(n); }).join(',');
     * // => logs each value from right to left and returns the array
     */
    function forEachRight(collection, iteratee, thisArg) {
      return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
        ? arrayEachRight(collection, iteratee)
        : baseEachRight(collection, bindCallback(iteratee, thisArg, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) { return Math.floor(n); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) { return this.floor(n); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the "_.property" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) { return String.fromCharCode(object.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) { return this.fromCharCode(object.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in `collection`,
     * returning an array of the results of each invoked method. Any additional
     * arguments are provided to each invoked method. If `methodName` is a function
     * it is invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      return baseInvoke(collection, methodName, baseSlice(arguments, 2));
    }

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * _.map([1, 2, 3], function(n) { return n * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(n) { return n * 3; });
     * // => [3, 6, 9] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     *  If a property name or object is provided it is used to create a "_.property"
     *  or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) { return chr.age; });
     * // => { 'user': 'fred', 'age': 40 };
     *
     * // using the "_.property" callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 };
     */
    var max = createExtremum(arrayMax);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     *  If a property name or object is provided it is used to create a "_.property"
     *  or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) { return chr.age; });
     * // => { 'user': 'barney', 'age': 36 };
     *
     * // using the "_.property" callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 };
     */
    var min = createExtremum(arrayMin, true);

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) { return n % 2; });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) { return this.floor(n) % 2; }, Math);
     * // => [[1, 3], [2]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * // using the "_.matches" callback shorthand
     * _.map(_.partition(users, { 'age': 1 }), function(array) { return _.pluck(array, 'user'); });
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the "_.property" callback shorthand
     * _.map(_.partition(users, 'active'), function(array) { return _.pluck(array, 'user'); });
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the value of `key` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} key The key of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, key) {
      return map(collection, baseProperty(key + ''));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg`and invoked with four arguments;
     * (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, n) { return sum + n; });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator, thisArg) {
      var func = isArray(collection) ? arrayReduce : baseReduce;
      return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     * _.reduceRight(array, function(flattened, other) { return flattened.concat(other); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator, thisArg) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce;
      return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4], function(n) { return n % 2 == 0; });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     *
     * // using the "_.matches" callback shorthand
     * _.pluck(_.reject(users, { 'age': 36 }), 'user');
     * // => ['fred']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(n < 0 ? 0 : (+n || 0), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See [Wikipedia](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      collection = toIterable(collection);

      var index = -1,
          length = collection.length,
          result = Array(length);

      while (++index < length) {
        var rand = baseRandom(0, index);
        if (index != rand) {
          result[index] = result[rand];
        }
        result[rand] = collection[index];
      }
      return result;
    }

    /**
     * Gets the size of `collection` by returning `collection.length` for
     * array-like values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.some(users, 'active');
     * // => true
     *
     * // using the "_.matches" callback shorthand
     * _.some(users, { 'age': 1 });
     * // => false
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity] The function
     *  invoked per iteration. If a property name or an object is provided it is
     *  used to create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) { return Math.sin(n); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) { return this.sin(n); }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the "_.property" callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = isLength(length) ? Array(length) : [];

      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = null;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      baseEach(collection, function(value, key, collection) {
        result[++index] = { 'criteria': iteratee(value, key, collection), 'index': index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it sorts by property names
     * instead of an iteratee function.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(string|string[])} props The property names to sort by,
     *  specified as individual property names or arrays of property names.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 26 },
     *   { 'user': 'fred',   'age': 30 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortByAll(collection) {
      var args = arguments;
      if (args.length > 3 && isIterateeCall(args[1], args[2], args[3])) {
        args = [collection, args[1]];
      }
      var index = -1,
          length = collection ? collection.length : 0,
          props = baseFlatten(args, false, false, 1),
          result = isLength(length) ? Array(length) : [];

      baseEach(collection, function(value, key, collection) {
        var length = props.length,
            criteria = Array(length);

        while (length--) {
          criteria[length] = value == null ? undefined : value[props[length]];
        }
        result[++index] = { 'criteria': criteria, 'index': index, 'value': value };
      });
      return baseSortBy(result, compareMultipleAscending);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'status': 'busy', 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'status': 'busy', 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36 }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     *
     * _.pluck(_.where(users, { 'status': 'busy' }), 'user');
     * // => ['barney', 'fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) { console.log(_.now() - stamp); }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        if (isFunction(n)) {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = null;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, null, null, null, null, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (!isFunction(func)) {
        if (isFunction(n)) {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        } else {
          func = null;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the `length`
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [args] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    function bind(func, thisArg) {
      var bitmask = BIND_FLAG;
      if (arguments.length > 2) {
        var partials = baseSlice(arguments, 2),
            holders = replaceHolders(partials, bind.placeholder);

        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the `length` property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    function bindAll(object) {
      return baseBindAll(object,
        arguments.length > 1
          ? baseFlatten(arguments, false, false, 1)
          : functions(object)
      );
    }

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [args] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (arguments.length > 2) {
        var partials = baseSlice(arguments, 2),
            holders = replaceHolders(partials, bindKey.placeholder);

        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    }

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the `length` property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      if (guard && isIterateeCall(func, arity, guard)) {
        arity = null;
      }
      var result = createWrapper(func, CURRY_FLAG, null, null, null, null, null, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the `length` property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      if (guard && isIterateeCall(func, arity, guard)) {
        arity = null;
      }
      var result = createWrapper(func, CURRY_RIGHT_FLAG, null, null, null, null, null, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a function that delays invoking `func` until after `wait` milliseconds
     * have elapsed since the last time it was invoked. The created function comes
     * with a `cancel` method to cancel delayed invocations. Provide an options
     * object to indicate that `func` should be invoked on the leading and/or
     * trailing edge of the `wait` timeout. Subsequent calls to the debounced
     * function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : wait;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      return baseDelay(func, 1, arguments, 1);
    }

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      return baseDelay(func, wait, arguments, 2);
    }

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function add(x, y) {
     *   return x + y;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(add, square);
     * addSquare(1, 2);
     * // => 9
     */
    function flow() {
      var funcs = arguments,
          length = funcs.length;

      if (!length) {
        return function() {};
      }
      if (!arrayEvery(funcs, isFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var index = 0,
            result = funcs[index].apply(this, arguments);

        while (++index < length) {
          result = funcs[index].call(this, result);
        }
        return result;
      };
    }

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function add(x, y) {
     *   return x + y;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, add);
     * addSquare(1, 2);
     * // => 9
     */
    function flowRight() {
      var funcs = arguments,
          fromIndex = funcs.length - 1;

      if (fromIndex < 0) {
        return function() {};
      }
      if (!arrayEvery(funcs, isFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var index = fromIndex,
            result = funcs[index].apply(this, arguments);

        while (index--) {
          result = funcs[index].call(this, result);
        }
        return result;
      };
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the ES `Map` method interface
     * of `get`, `has`, and `set`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-properties-of-the-map-prototype-object)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (!isFunction(func) || (resolver && !isFunction(resolver))) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : arguments[0];

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, arguments);
        cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (!isFunction(predicate)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(func, 2);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the `length` property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [args] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    function partial(func) {
      var partials = baseSlice(arguments, 1),
          holders = replaceHolders(partials, partial.placeholder);

      return createWrapper(func, PARTIAL_FLAG, null, partials, holders);
    }

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the `length` property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [args] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    function partialRight(func) {
      var partials = baseSlice(arguments, 1),
          holders = replaceHolders(partials, partialRight.placeholder);

      return createWrapper(func, PARTIAL_RIGHT_FLAG, null, partials, holders);
    }

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) { return n * 3; }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    function rearg(func) {
      var indexes = baseFlatten(arguments, false, false, 1);
      return createWrapper(func, REARG_FLAG, null, null, null, indexes);
    }

    /**
     * Creates a function that only invokes `func` at most once per every `wait`
     * milliseconds. The created function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the throttled function return the result of the last
     * `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * var throttled =  _.throttle(renewToken, 300000, { 'trailing': false })
     * jQuery('.interactive').on('click', throttled);
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = +wait;
      debounceOptions.trailing = trailing;
      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, null, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the structured clone algorithm.
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var body = _.clone(document.body, function(value) {
     *   return _.isElement(value) ? value.cloneNode(false) : undefined;
     * });
     *
     * body === document.body
     * // => false
     * body.nodeName
     * // => BODY
     * body.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      // Juggle arguments.
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = customizer;
        customizer = isIterateeCall(value, isDeep, thisArg) ? null : isDeep;
        isDeep = false;
      }
      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
      return baseClone(value, isDeep, customizer);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the structured clone algorithm.
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * body === document.body
     * // => false
     * body.nodeName
     * // => BODY
     * body.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
      return baseClone(value, true, customizer);
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })();
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      var length = isObjectLike(value) ? value.length : undefined;
      return (isLength(length) && objToString.call(value) == argsTag) || false;
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return (value === true || value === false || isObjectLike(value) && objToString.call(value) == boolTag) || false;
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return (isObjectLike(value) && objToString.call(value) == dateTag) || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return (value && value.nodeType === 1 && isObjectLike(value) &&
        objToString.call(value).indexOf('Element') > -1) || false;
    }
    // Fallback for environments without DOM support.
    if (!support.dom) {
      isElement = function(value) {
        return (value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value)) || false;
      };
    }

    /**
     * Checks if a value is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      var length = value.length;
      if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments; (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
      if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
        return value === other;
      }
      var result = customizer ? customizer(value, other) : undefined;
      return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return (isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag) || false;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on ES `Number.isFinite`. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    var isFinite = nativeNumIsFinite || function(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    };

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // Avoid a Chakra JIT bug in compatibility modes of IE 11.
      // See https://github.com/jashkenas/underscore/issues/1621 for more details.
      return typeof value == 'function' || false;
    }
    // Fallback for environments that return incorrect `typeof` operator results.
    if (isFunction(/x/) || (Uint8Array && !isFunction(Uint8Array))) {
      isFunction = function(value) {
        // The use of `Object#toString` avoids issues with the `typeof` operator
        // in older versions of Chrome and Safari which return 'function' for regexes
        // and Safari 8 equivalents which return 'object' for typed array constructors.
        return objToString.call(value) == funcTag;
      };
    }

    /**
     * Checks if `value` is the language type of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return type == 'function' || (value && type == 'object') || false;
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments; (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} source The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      var props = keys(source),
          length = props.length;

      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
      if (!customizer && length == 1) {
        var key = props[0],
            value = source[key];

        if (isStrictComparable(value)) {
          return object != null && value === object[key] && hasOwnProperty.call(object, key);
        }
      }
      var values = Array(length),
          strictCompareFlags = Array(length);

      while (length--) {
        value = values[length] = source[props[length]];
        strictCompareFlags[length] = isStrictComparable(value);
      }
      return baseIsMatch(object, props, values, strictCompareFlags, customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as native `isNaN` which returns `true`
     * for `undefined` and other non-numeric values. See the [ES5 spec](https://es5.github.io/#x15.1.2.4)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (objToString.call(value) == funcTag) {
        return reNative.test(fnToString.call(value));
      }
      return (isObjectLike(value) && reHostCtor.test(value)) || false;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag) || false;
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && objToString.call(value) == objectTag)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return (isObjectLike(value) && objToString.call(value) == regexpTag) || false;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3);
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? value.length : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments;
     * (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return typeof value == 'undefined' ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(baseAssign);

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = null;
      }
      return properties ? baseCopy(properties, result, keys(properties)) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property are ignored.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    function defaults(object) {
      if (object == null) {
        return object;
      }
      var args = arrayCopy(arguments);
      args.push(assignDefaults);
      return assign.apply(undefined, args);
    }

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element `predicate` returns truthy for, instead of the element itself.
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) { return chr.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the "_.matches" callback shorthand
     * _.findKey(users, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using the "_.property" callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 3);
      return baseFind(object, predicate, baseForOwn, true);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) { return chr.age < 40; });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the "_.matches" callback shorthand
     * _.findLastKey(users, { 'age': 36 });
     * // => 'barney'
     *
     * // using the "_.property" callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 3);
      return baseFind(object, predicate, baseForOwnRight, true);
    }

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments; (value, key, object). Iterator functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    function forIn(object, iteratee, thisArg) {
      if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
        iteratee = bindCallback(iteratee, thisArg, 3);
      }
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    function forInRight(object, iteratee, thisArg) {
      iteratee = bindCallback(iteratee, thisArg, 3);
      return baseForRight(object, iteratee, keysIn);
    }

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments; (value, key, object). Iterator functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(n, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (iteration order is not guaranteed)
     */
    function forOwn(object, iteratee, thisArg) {
      if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
        iteratee = bindCallback(iteratee, thisArg, 3);
      }
      return baseForOwn(object, iteratee);
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(n, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, iteratee, thisArg) {
      iteratee = bindCallback(iteratee, thisArg, 3);
      return baseForRight(object, iteratee, keys);
    }

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Checks if `key` exists as a direct property of `object` instead of an
     * inherited property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {string} key The key to check.
     * @returns {boolean} Returns `true` if `key` is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     *
     * // without `multiValue`
     * _.invert({ 'first': 'fred', 'second': 'barney', 'third': 'fred' });
     * // => { 'fred': 'third', 'barney': 'second' }
     *
     * // with `multiValue`
     * _.invert({ 'first': 'fred', 'second': 'barney', 'third': 'fred' }, true);
     * // => { 'fred': ['first', 'third'], 'barney': ['second'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = null;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (object) {
        var Ctor = object.constructor,
            length = object.length;
      }
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
         (typeof object != 'function' && (length && isLength(length)))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype == object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created "_.property"
     * style callback returns the property value of the given element.
     *
     * If an object is provided for `iteratee` the created "_.matches" style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration. If a property name or object is provided it is used to
     *  create a "_.property" or "_.matches" style callback respectively.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(n) { return n * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the "_.property" callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee, thisArg) {
      var result = {};
      iteratee = getCallback(iteratee, thisArg, 3);

      baseForOwn(object, function(value, key, object) {
        result[key] = iteratee(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments; (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If `predicate` is provided it is invoked for each property
     * of `object` omitting the properties `predicate` returns truthy for. The
     * predicate is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    function omit(object, predicate, thisArg) {
      if (object == null) {
        return {};
      }
      if (typeof predicate != 'function') {
        var props = arrayMap(baseFlatten(arguments, false, false, 1), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      predicate = bindCallback(predicate, thisArg, 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    }

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments; (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    function pick(object, predicate, thisArg) {
      if (object == null) {
        return {};
      }
      return typeof predicate == 'function'
        ? pickByCallback(object, bindCallback(predicate, thisArg, 3))
        : pickByArray(object, baseFlatten(arguments, false, false, 1));
    }

    /**
     * Resolves the value of property `key` on `object`. If the value of `key` is
     * a function it is invoked with the `this` binding of `object` and its result
     * is returned, else the property value is returned. If the property value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to resolve.
     * @param {*} [defaultValue] The value returned if the property value
     *  resolves to `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'user': 'fred', 'age': _.constant(40) };
     *
     * _.result(object, 'user');
     * // => 'fred'
     *
     * _.result(object, 'age');
     * // => 40
     *
     * _.result(object, 'status', 'busy');
     * // => 'busy'
     *
     * _.result(object, 'status', _.constant('busy'));
     * // => 'busy'
     */
    function result(object, key, defaultValue) {
      var value = object == null ? undefined : object[key];
      if (typeof value == 'undefined') {
        value = defaultValue;
      }
      return isFunction(value) ? value.call(object) : value;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments; (accumulator, value, key, object). Iterator functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6], function(result, n) {
     *   n *= n;
     *   if (n % 2) {
     *     return result.push(n) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(typeof Ctor == 'function' && Ctor.prototype);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = null;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to camel case.
     * See [Wikipedia](https://en.wikipedia.org/wiki/CamelCase) for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting latin-1 supplementary letters to basic latin letters.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter);
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = (typeof position == 'undefined' ? length : nativeMin(position < 0 ? 0 : (+position || 0), length)) - target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and '`', in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't require escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#102](https://html5sec.org/#102),
     * [#108](https://html5sec.org/#108), and [#133](https://html5sec.org/#133) of
     * the [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
     *
     * When working with HTML you should always quote attribute values to reduce
     * XSS vectors. See [Ryan Grove's article](http://wonko.com/post/html-escaping)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
     * "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, '\\$&')
        : string;
    }

    /**
     * Converts `string` to kebab case (a.k.a. spinal case).
     * See [Wikipedia](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles) for
     * more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it is shorter then the given
     * padding length. The `chars` string may be truncated if the number of padding
     * characters can't be evenly divided by the padding length.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = floor(mid),
          rightLength = ceil(mid);

      chars = createPad('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it is shorter then the given padding
     * length. The `chars` string may be truncated if the number of padding
     * characters exceeds the padding length.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    function padLeft(string, length, chars) {
      string = baseToString(string);
      return string && (createPad(string, length, chars) + string);
    }

    /**
     * Pads `string` on the right side if it is shorter then the given padding
     * length. The `chars` string may be truncated if the number of padding
     * characters exceeds the padding length.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    function padRight(string, length, chars) {
      string = baseToString(string);
      return string && (string + createPad(string, length, chars));
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the ES5 implementation of `parseInt`.
     * See the [ES5 spec](https://es5.github.io/#E) for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard && isIterateeCall(string, radix, guard)) {
        radix = 0;
      }
      return nativeParseInt(string, radix);
    }
    // Fallback for environments with pre-ES5 implementations.
    if (nativeParseInt(whitespace + '08') != 8) {
      parseInt = function(string, radix, guard) {
        // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
        // Chrome fails to trim leading <BOM> whitespace characters.
        // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
        if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        string = trim(string);
        return nativeParseInt(string, radix || (reHexPrefix.test(string) ? 16 : 10));
      };
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = floor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to snake case.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Snake_case) for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to start case.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null ? 0 : nativeMin(position < 0 ? 0 : (+position || 0), string.length);
      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes sourceURLs for easier debugging.
     * See the [HTML5 Rocks article on sourcemaps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for more details.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '';
     *   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = null;
      }
      string = baseToString(string);
      options = baseAssign(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = baseAssign(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar]
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string))
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1)
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it is longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', { 'length': 24, 'separator': ' ' });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', { 'length': 24, 'separator': /,? +/ });
     * //=> 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', { 'omission': ' [...]' });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = null;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? +options.length || 0 : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = null;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught
     * error object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function() {
     *   return document.querySelectorAll(selector);
     * });
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    function attempt(func) {
      try {
        return func();
      } catch(e) {
        return isError(e) ? e : Error(e);
      }
    }

    /**
     * Creates a function bound to an optional `thisArg`. If `func` is a property
     * name the created callback returns the property value for a given element.
     * If `func` is an object the created callback returns `true` for elements
     * that contain the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = null;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function which performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * var matchesAge = _.matches({ 'age': 36 });
     *
     * _.filter(users, matchesAge);
     * // => [{ 'user': 'barney', 'age': 36 }]
     *
     * _.find(users, matchesAge);
     * // => { 'user': 'barney', 'age': 36 }
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=this] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj && keys(source),
            methodNames = props && props.length && baseFunctions(source, props);

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__);
                (result.__actions__ = arrayCopy(this.__actions__)).push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              var args = [this.value()];
              push.apply(args, arguments);
              return func.apply(object, args);
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function which returns the property value of `key` on a given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'barney' }
     * ];
     *
     * var getName = _.property('user');
     *
     * _.map(users, getName);
     * // => ['fred', barney']
     *
     * _.pluck(_.sortBy(users, getName), 'user');
     * // => ['barney', 'fred']
     */
    function property(key) {
      return baseProperty(key + '');
    }

    /**
     * The inverse of `_.property`; this method creates a function which returns
     * the property value of a given key on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to inspect.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40, 'active': true };
     * _.map(['active', 'user'], _.propertyOf(object));
     * // => [true, 'fred']
     *
     * var object = { 'a': 3, 'b': 1, 'c': 2 };
     * _.sortBy(['a', 'b', 'c'], _.propertyOf(object));
     * // => ['b', 'c', 'a']
     */
    function propertyOf(object) {
      return function(key) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `start` is less than `end` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = null;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(ceil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = +n;

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    // Ensure `new LodashWrapper` is an instance of `lodash`.
    LodashWrapper.prototype = lodash.prototype;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var isFilter = index == LAZY_FILTER_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone(),
            filtered = result.filtered,
            iteratees = result.iteratees || (result.iteratees = []);

        result.filtered = filtered || isFilter || (index == LAZY_WHILE_FLAG && result.dir < 0);
        iteratees.push({ 'iteratee': getCallback(iteratee, thisArg, 3), 'type': index });
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      var countName = methodName + 'Count',
          whileName = methodName + 'While';

      LazyWrapper.prototype[methodName] = function(n) {
        n = n == null ? 1 : nativeMax(+n || 0, 0);

        var result = this.clone();
        if (result.filtered) {
          var value = result[countName];
          result[countName] = index ? nativeMin(value, n) : (value + n);
        } else {
          var views = result.views || (result.views = []);
          views.push({ 'size': n, 'type': methodName + (result.dir < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };

      LazyWrapper.prototype[methodName + 'RightWhile'] = function(predicate, thisArg) {
        return this.reverse()[whileName](predicate, thisArg).reverse();
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right': '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : baseProperty;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(index ? value : (value + '')));
      };
    });

    LazyWrapper.prototype.dropWhile = function(iteratee, thisArg) {
      var done,
          lastIndex,
          isRight = this.dir < 0;

      iteratee = getCallback(iteratee, thisArg, 3);
      return this.filter(function(value, index, array) {
        done = done && (isRight ? index < lastIndex : index > lastIndex);
        lastIndex = index;
        return done || (done = !iteratee(value, index, array));
      });
    };

    LazyWrapper.prototype.reject = function(iteratee, thisArg) {
      iteratee = getCallback(iteratee, thisArg, 3);
      return this.filter(function(value, index, array) {
        return !iteratee(value, index, array);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);
      var result = start < 0 ? this.takeRight(-start) : this.drop(start);

      if (typeof end != 'undefined') {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName],
          retUnwrapped = /^(?:first|last)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = arguments,
            chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          return onlyLazy
            ? func.call(value)
            : lodashFunc.call(lodash, this.value());
        }
        var interceptor = function(value) {
          var otherArgs = [value];
          push.apply(otherArgs, args);
          return lodashFunc.apply(lodash, otherArgs);
        };
        if (isLazy || isArray(value)) {
          var wrapper = onlyLazy ? value : new LazyWrapper(this),
              result = func.apply(wrapper, args);

          if (!retUnwrapped && (isHybrid || result.actions)) {
            var actions = result.actions || (result.actions = []);
            actions.push({ 'func': thru, 'args': [interceptor], 'thisArg': lodash });
          }
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array.prototype` functions to `lodash.prototype`.
    arrayEach(['concat', 'join', 'pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the lodash wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the lodash wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Narwhal or Rhino -require.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},["/home/a/odesk/snake/index.js"])