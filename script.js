const tg = window.Telegram.WebApp;
let coin = 123;

tg.ready();
tg.expand();


let links = [];
let links_id = 0;

fetch("links.json")
  .then((response) => response.json())
  .then(json => {
    links = json;
  })
  .catch((error) => console.error(error));

document.getElementById("btn").onclick = () => {
  tg.openTelegramLink(links[links_id]);

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
let time;

function startTimer() {
  timer = setInterval(() => {
    time--;

    if (time < 0) {
      clearInterval(timer);
      document.getElementById("btn").disabled = false;
      links_id++;
    }
  }, 1000);
}



