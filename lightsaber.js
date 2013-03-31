var canvas;

var global = {};
global.context = null;
global.starList = [];

var SCREEN_WIDTH = innerWidth;
var SCREEN_HEIGHT = innerHeight;
var STAR_MAX_NUM = 100;

window.onload = function() {

   init();
   run();
};

function init() {

    canvas = document.getElementById("mycanvas");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    global.context = canvas.getContext("2d");

    // Generate stars.
    for(var i=0; i<STAR_MAX_NUM; ++i) {

        global.starList.push(new Star(
            Math.random() * SCREEN_WIDTH,
            Math.random() * SCREEN_HEIGHT,
            "hsla(" + (360/STAR_MAX_NUM)*i +  ", 75%, 50%, 0.75)"
        ));
    }
}

function run() {

    var _run = function() {

        update();
        draw();

        setTimeout(_run, 300);
    };

    setTimeout(_run, 300);
}

function update() {

    for(var i=0, len=global.starList.length; i<len; ++i)
    {
        global.starList[i].update();
    }
}

function draw() {

    var ctx = global.context;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

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

    draw: function(ctx) {

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 55, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    },

    update: function() {

        this.x = Math.random() * SCREEN_WIDTH;
        this.y = Math.random() * SCREEN_HEIGHT;
        this.color = "hsla(" + Math.random()*100 +  ", 75%, 50%, 0.75)";
    }
};
