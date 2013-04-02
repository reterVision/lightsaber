var canvas;

var global = {};
global.context = null;
global.starList = [];

var clicked_color = null;
var score = 0;
var refresh_rate = 1000;

var SCREEN_WIDTH = innerWidth;
var SCREEN_HEIGHT = innerHeight;
var STAR_MAX_NUM = 20;

var COLOR_COUNT = 4;
var COLORS = [
    "hsla(0, 93%, 50%, 0.75)",
    "hsla(30, 97%, 52%, 0.95)",
    "hsla(120, 93%, 52%, 0.87)",
    "hsla(240, 93%, 65%, 0.60)"
];

window.onload = function() {

   init();
   run();
};

/**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {

    canvas = document.getElementById("mycanvas");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    canvas.addEventListener("mousedown", getPosition, false);
    global.context = canvas.getContext("2d");

    // Generate stars.
    for(var i=0; i<STAR_MAX_NUM; ++i) {

        global.starList.push(new Star(
            Math.random() * SCREEN_WIDTH,
            Math.random() * SCREEN_HEIGHT,
            COLORS[getRandomInt(0, COLOR_COUNT-1)]
        ));
    }
}

function getPosition(event) {

    var x = event.x;
    var y = event.y;

    var canvas = document.getElementById("mycanvas");

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    for (var i=0, len=global.starList.length; i<len; ++i)
    {
        if (global.starList[i].click(x, y)) {

            current_color = global.starList[i].color;

            if (clicked_color === null) {
                clicked_color = current_color;
            } else if (clicked_color == current_color) {
                // Scored!
                score += 100;
                clicked_color = null;
                if (score % 500 === 0) {
                    refresh_rate = refresh_rate > 50 ? refresh_rate - 50 : 50;
                }
                if (score % 1500 === 0) {
                    STAR_MAX_NUM = STAR_MAX_NUM > 5 ? STAR_MAX_NUM - 1 : 5;
                }
            } else {
                // Not scored, reset color.
                clicked_color = null;
            }
            break;
        }
    }
}

function run() {

    var _run = function() {

        update();
        draw();

        setTimeout(_run, refresh_rate);
    };

    setTimeout(_run, refresh_rate);
}

function update() {

    for(var i=0, len=global.starList.length; i<len; ++i)
    {
        global.starList[i].update();
    }
}

function draw() {

    var ctx = global.context;
    ctx.fillStyle = "hsla(60, 100%, 90%, 0.98)";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "gold";
    text = score;
    size = 50;
    font ="bold "+ size +"px serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillText(text, SCREEN_WIDTH / 2, 50);

    ctx.save();
    // Draw stars.
    for(var i=0, len=global.starList.length; i<len; ++i)
    {
        global.starList[i].draw(ctx);
    }
    ctx.restore();
}

/*
    Star class
*/
var Star = function(x, y, color) {

    this.x = x || 0;
    this.y = y || 0;
    this.color = color || "yellow";
};

Star.prototype = {

    x: null,
    y: null,
    color: null,
    radius: 55,

    draw: function(ctx) {

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    },

    update: function() {

        this.x = Math.random() * SCREEN_WIDTH;
        this.y = Math.random() * SCREEN_HEIGHT;
        this.color = COLORS[getRandomInt(0, COLOR_COUNT-1)];
    },

    click: function(x, y) {

        dist = Math.sqrt(
            (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
        return dist <= this.radius;
    }
};
