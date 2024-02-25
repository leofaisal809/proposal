/************* SHIM ************************/
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const setDimensions = () => {
  const height = document.body.offsetHeight;
  const width = document.body.offsetWidth;

  canvas.style.height = height + "px";
  canvas.style.width = width + "px";
  canvas.height = height;
  canvas.width = width;

  return { height, width };
};

/********************************************/
var canvas = document.getElementById("cvs");

var dimensions = setDimensions();
var height = dimensions.height;
var width = dimensions.width;

var ctx = canvas.getContext("2d"),
  collection = [],
  num_drops = 30, // number of drops
  gravity = 2, // gravity multiplier
  windForce = 0, // yea i'd just leave this
  windMultiplier = 0.007, // this freaks out on large numbers
  maxSpeed = 10, // this is so you never run too fast (it is a multiplier not raw)
  gutter = 0.005; // the percentage distance to travel off screen before wrapping

function Drop() {
  this.x;
  this.y;
  this.radius;
  this.distance;
  this.color;
  this.speed;
  this.vx;
  this.vy;
}

Drop.prototype = {
  constructor: Drop,

  random_x: function () {
    var n = width * (1 + gutter);
    return 1 - (1 + gutter) + Math.random() * n;
  },

  draw: function (ctx) {
    ctx.fillStyle = this.color;
    ctx.drawImage(svgEl, this.x, this.y);
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // ctx.closePath();
    // ctx.fill();
  },
};

function draw_frame() {
  // this was recommended (see comments)
  // check it out, just comment out the
  // ctx.clearRect(0, 0, width, height);
  // line and uncomment the three below:

  //ctx.globalCompositeOperation="darker";
  //ctx.fillStyle="rgba(0,0,0,0.5)";
  //ctx.fillRect(0,0,width,height);
  ctx.clearRect(0, 0, width, height);

  // in a previous attempt I even go as far
  // as to ensure i'm drawing the furthest particles
  // first for the z-index overlay.
  // in this run I felt it was unneeded
  collection.forEach(function (drop) {
    // costly but ultimately I think it's worth it for now
    // I muck with the opacity to help with the illusion of depth
    ctx.globalAlpha = (drop.distance + 1) / 10;
    drop.draw(ctx);
    ctx.globalAlpha = 1;
    drop.x += drop.vx;
    drop.y += drop.vy;
    var lx = drop.vx + windForce;
    lx < maxSpeed && lx > 1 - maxSpeed && (drop.vx = lx);
    if (drop.y > height + 30) {
      drop.y = Math.random() * -drop.radius * (num_drops / 10);
      drop.x = drop.random_x();
    }
    if (drop.x > width * (1 + gutter)) {
      drop.x = 1 - width * gutter;
    }
    if (drop.x < 1 - width * gutter) {
      drop.x = width * (1 + gutter);
    }
  });
}

function animate() {
  requestAnimFrame(animate);
  draw_frame();
}

function windTimer() {
  // this is a super cheap way to do this,
  // i will need to look into how to properly
  // emulate wind
  windForce = Math.random() > 0.5 ? windMultiplier : -windMultiplier;
  setTimeout(windTimer, Math.random() * (1000 * 30));
}

function init() {
  collection = [];
  while (num_drops--) {
    var drop = new Drop(); // todo: make constructor do this shit
    drop.color = "blue";
    drop.distance = (Math.random() * 10) | 0;
    drop.speed = Math.random() * (drop.distance / 10) + gravity;
    drop.vx = 0;
    drop.vy = Math.random() * drop.speed + drop.speed / 2;
    drop.radius = ((drop.distance + 1) / 16) * 3;
    drop.x = drop.random_x();
    drop.y = (-1 * (Math.random() * height)) / 2;
    collection.push(drop);
  }
  //   windTimer();
  animate();
  window.onresize = function () {
    const dimensions = setDimensions();
    height = dimensions.height;
    width = dimensions.width;
  };
}

const svgEl = document.getElementById("svg");
init();
