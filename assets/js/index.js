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
    document.querySelectorAll(".button")[0].style.display = "block";
    clearInterval(timer);
    for (let i = 0; i < document.querySelectorAll(".number").length; i++) {
      document.querySelectorAll(".number")[i].style.color = "brown";
    }
  } else {
    daysElement.innerHTML = Math.floor(d / day);
    hoursElement.innerHTML = Math.floor((d % day) / hour);
    minutesElement.innerHTML = Math.floor((d % hour) / minute);
    secondsElement.innerHTML = Math.floor((d % minute) / second);
  }
}
