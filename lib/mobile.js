/*jslint node:true,nomen:true*/
/*global window*/
module.exports = function (snake) {
    'use strict';
    var handleOrientation = function (event) {
        var y = event.beta,
            x = event.gamma,
            maxX = 30,
            maxY = 20;
        if (y > maxY) {
            snake.down();
        } else if (y < -maxY) {
            snake.up();
        } else if (x > maxX) {
            snake.right();
        } else if (x < -maxX) {
            snake.left();
        }
    };
    window.addEventListener('deviceorientation', handleOrientation);
};
