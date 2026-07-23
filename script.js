const tg = window.Telegram.WebApp;
let coin = 123;

tg.ready();
tg.expand();

//let user_id = tg.initDataUnsafe.user.id;

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

document.getElementById("vfv-req-sumbit").onclick = () => {
  let link = document.getElementById("vfv-req-link-input").value;
  if (!link.startsWith("https://t.me/")) {
    document.getElementById("vfv-logs").textContent = "فرمت لینک باید با https://t.me شروع شود";
    return;
  }

  SendLink(link);
};

async function SendLink(link, user_id) {
  const url = "https://ghabile.bouzhan-saran.workers.dev/vfv";

  const data = {
    user_id: user_id,
    link: link
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ پاسخ دریافت شد:", result);
    return result;

  } catch (error) {
    console.error("❌ خطا در ارسال درخواست:", error);
  }
}

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) {
    if (time != 0) {
      document.getElementById("vfv-view-count").style.color = "red";
      document.getElementById("vfv-view-count").innerHTML =
        "زود تر از زمان برگشتی از اول باید پست رو ببینی";
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

      document.getElementById("vfv-view-count").innerHTML =
        `تعداد بازدید های شما: ${view_count} از 100`;
      document.getElementById("vfv-view-count").style.color = "black";
    }
  }, 1000);
}
