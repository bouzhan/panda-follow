const tg = window.Telegram.WebApp;
let coin = 123;

tg.ready();
tg.expand();

document.getElementById("btn").onclick = () => {
  tg.openTelegramLink("https://t.me/persian_drive/374");

  document.getElementById("btn").disabled = true;
  time = 10;
  startTimer();
};

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) {
    document.getElementById("para").innerHTML = coin;
  }
});

let timer;
let time = 10;

function startTimer() {
  timer = setInterval(() => {
    document.getElementById("para").innerHTML = time;
    time--;

    if (time < 0) {
      clearInterval(timer);
      document.getElementById("btn").disabled = false;
    }
  }, 1000);
}
