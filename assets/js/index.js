const daysElement = document.querySelectorAll(".number")[0];
const hoursElement = document.querySelectorAll(".number")[1];
const minutesElement = document.querySelectorAll(".number")[2];
const secondsElement = document.querySelectorAll(".number")[3];

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

let theDay = new Date(2019, 6, 9, 0, 0, 0).getTime();
let timer = setInterval(update, 1000);

function update() {
  let today = new Date().getTime();
  let d = theDay - today;
  if (d < 0) {
    document.querySelectorAll(".button")[0].style.display = "flex";
    clearInterval(timer);
    for (let i = 0; i < document.querySelectorAll(".number").length; i++) {
      document.querySelectorAll(".number")[i].style.color = "brown";
      document.querySelector("header").innerHTML = "Happy Birthday ...";
    }
  } else {
    daysElement.innerHTML = Math.floor(d / day);
    hoursElement.innerHTML = Math.floor((d % day) / hour);
    minutesElement.innerHTML = Math.floor((d % hour) / minute);
    secondsElement.innerHTML = Math.floor((d % minute) / second);
  }
}

const button = document.querySelectorAll(".button")[0];
const counter = document.querySelectorAll("#counter")[0];
const celebration = document.querySelectorAll("#celebration")[0];

button.addEventListener("click", () => {
  counter.style.display = "none";
  celebration.style.display = "block";
});

// canvas code >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// helper functions
const PI2 = Math.PI * 2;
const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
const timestamp = _ => new Date().getTime();

// container
class Birthday {
  constructor() {
    this.resize();

    // create a lovely place to store the firework
    this.fireworks = [];
    this.counter = 0;
  }

  resize() {
    this.width = canvas.width = window.innerWidth;
    let center = (this.width / 2) | 0;
    this.spawnA = (center - center / 4) | 0;
    this.spawnB = (center + center / 4) | 0;

    this.height = canvas.height = window.innerHeight;
    this.spawnC = this.height * 0.1;
    this.spawnD = this.height * 0.5;
  }

  onClick(evt) {
    let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
    let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

    let count = random(3, 5);
    for (let i = 0; i < count; i++)
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 260),
          random(30, 110)
        )
      );

    this.counter = -1;
  }

  update(delta) {
    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";
    for (let firework of this.fireworks) firework.update(delta);

    // if enough time passed... create new new firework
    this.counter += delta * 3; // each second
    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)
        )
      );
      this.counter = 0;
    }

    // remove the dead fireworks
    if (this.fireworks.length > 1000)
      this.fireworks = this.fireworks.filter(firework => !firework.dead);
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    onloaded();
    this.dead = false;
    this.offsprings = offsprings;

    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;

    this.shade = shade;
    this.history = [];
  }
  update(delta) {
    if (this.dead) return;

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      // is still moving
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({
        x: this.x,
        y: this.y
      });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX =
            (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
          let targetY =
            (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

          birthday.fireworks.push(
            new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
          );
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
        ctx.arc(point.x, point.y, 1, 0, PI2, false);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }
  }
}

let canvas = document.getElementById("birthday");
let ctx = canvas.getContext("2d");

let then = timestamp();

let birthday = new Birthday();
window.onresize = () => birthday.resize();
document.onclick = evt => birthday.onClick(evt);
document.ontouchstart = evt => birthday.onClick(evt);

(function loop() {
  requestAnimationFrame(loop);

  let now = timestamp();
  let delta = now - then;

  then = now;
  birthday.update(delta / 1000);
})();

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function drawBackgroundImage(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = document.getElementById("salt-bae");
  ctx.drawImage(img, -250, -90, canvas.width + 600, canvas.height + 70);
}

function getRandomImageSize(min, max, width, height) {
  const ratio = width / height; // Used for aspect ratio
  width = getRandomInt(min, max);
  height = width / ratio;
  return { width, height };
}

function drawSalt(src, canvas, ctx) {
  // Create an image object. (Not part of the dom)
  const image = new Image();
  image.src = src;

  // After the image has loaded, draw it to the canvas
  // image.onload = function() {
  for (let i = 0; i < 4; i++) {
    const randomX = getRandomInt(10, canvas.width);
    const randomY = getRandomInt(canvas.height - 300, canvas.height);
    const dimensions = getRandomImageSize(20, 100, image.width, image.height);
    ctx.drawImage(image, randomX, randomY, dimensions.width, dimensions.height);
  }
  // };
  return image;
}

onloaded = function() {
  const canvas = document.getElementById("birthday");
  const ctx = canvas.getContext("2d");
  drawBackgroundImage(canvas, ctx);
  const saltImage = drawSalt(
    "https://pngimage.net/wp-content/uploads/2018/06/papillon-rose-png-6.png",
    canvas,
    ctx
  );
};
