const tg = window.Telegram.WebApp;
let coin = 123;

tg.ready();
tg.expand();

let links = [];
let links_id = 0;

let view_count = 0;
let timer;
let time;

fetch("links.json")
  .then((response) => response.json())
  .then((json) => {
    links = json;
  })
  .catch((error) => console.error(error));

document.getElementById("vfv-open-post").onclick = () => {
  tg.openTelegramLink(links[links_id]);

  document.getElementById("vfv-open-post").disabled = true;
  time = 10;
  startTimer();
};

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) {
    if (time != 0){
      document.getElementById("vfv-view-count").style.color = 'red';
      document.getElementById("vfv-view-count").innerHTML = "زود تر از زمان برگشتی از اول باید پست رو ببینی";
      document.getElementById("vfv-open-post").disabled = false;
      clearInterval(timer);
    }
  }
});

function startTimer() {

  timer = setInterval(() => {
    
    time--;
    document.getElementById("vfv-timer-counter").innerHTML = time;

    if (time <= 0) {
      clearInterval(timer);
      document.getElementById("vfv-open-post").disabled = false;
      links_id++;
      view_count++;

      document.getElementById("vfv-view-count").innerHTML = `تعداد بازی های شما: 0 از  ${view_count}`;
    }
  }, 1000);
}
