const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let user_id = tg.initDataUnsafe.user?.id;
let first_name = tg.initDataUnsafe.user?.first_name;
let user_name = tg.initDataUnsafe.user?.username;

document.getElementById("name").textContent = "سلام " + first_name + " عزیز ! 🎃";
let questions = [];
let current_question;
let current_correct;
let corrects = 0;
let record;
let particles;
const channel_link = "https://t.me/chaap_aks";

let leader_board;

let menu = document.getElementById("menu");
let ad = document.getElementById("ad");
let game = document.getElementById("game");

const pop = new Audio("pop.mp3");
const song = new Audio("song.mp3");
const correct = new Audio("correct.mp3");
const game_over = new Audio("game-over.mp3");

get_record(6025961065);

fetch("questions.json")
  .then((response) => response.json())
  .then((json) => {
    questions = json.questions;
  })
  .catch((error) => console.error(error));

const data = {
    "rasool": 20,
    "ahmad": 12,
    "rasoodl": 90,
    "yeganeh": 32,
    "mahsa": 90,
    "jende": 43,
    "namoos": 90,
    "sag": 64,
    "binamoos": 90
};

const keys = Object.keys(data);
const items = document.querySelectorAll(".item");

for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const value = data[name];

    items[i].querySelector(".name").textContent = name;
    items[i].querySelector(".score").textContent = value;
}

function randomQuestion() {
  const index = Math.floor(Math.random() * questions.length);
  const q = questions[index];
  current_correct = q.answer;
  
  document.getElementById("q").textContent = q.question;
  document.getElementById("option1").querySelector(".option-text").textContent = q.options[0];
  document.getElementById("option2").querySelector(".option-text").textContent = q.options[1];
  document.getElementById("option3").querySelector(".option-text").textContent = q.options[2];
  document.getElementById("option4").querySelector(".option-text").textContent = q.options[3];
  
  document.getElementById("option1").style.backgroundColor = "#ffffff";
  document.getElementById("option2").style.backgroundColor = "#ffffff";
  document.getElementById("option3").style.backgroundColor = "#ffffff";
  document.getElementById("option4").style.backgroundColor = "#ffffff";
  
  document.getElementById("option1").style.pointerEvents = "auto";
  document.getElementById("option2").style.pointerEvents = "auto";
  document.getElementById("option3").style.pointerEvents = "auto";
  document.getElementById("option4").style.pointerEvents = "auto";
}

document.getElementById("show-ad").onclick = () => {
  menu.style.display = "none";
  ad.style.display = "block";
  document.getElementById("start").disabled = true;
  startAdTimer();
  const ads = [
    "ad1.jpg",
    "ad2.jpg",
    "ad32.jpg",
    "ad4.jpg",
    "ad5.jpg",
    "ad74.jpg"
  ];
  const randomIndex = Math.floor(Math.random() * ads.length);
  document.getElementById("ad-pic").src = ads[randomIndex];
  clearInterval(particles);
};

const ad_buttons = document.querySelectorAll(".channel");

ad_buttons.forEach(ad_button => {
    ad_button.addEventListener("click", () => {
      tg.openTelegramLink(channel_link);
    });
});


function startAdTimer() {
    let ad_time = 10;
    document.getElementById("start").textContent = "10";
    let ad_timer = setInterval(() => {

        ad_time--;
        document.getElementById("start").textContent = String(ad_time);
        if (ad_time <= 0) {
            clearInterval(ad_timer);
            console.log("زمان تمام شد");
            document.getElementById("start").textContent = "برو به بازی";
            document.getElementById("start").disabled = false;
        }

    }, 1000);
}

const ad_pic = document.getElementById("ad-pic");

ad_pic.addEventListener("click", () => {
    tg.openTelegramLink(channel_link);
});

document.getElementById("start").onclick = () => {
  ad.style.display = "none";
  game.style.display = "block";
  song.loop = true; 
  song.play();
  pop.currentTime = 0;
  pop.play();
  //playEffect();
  randomQuestion();
  corrects = 0;
  startTimer();
  particles = setInterval(createSquare, 100);
};

document.getElementById("home-leader-board").onclick = () => {
  document.getElementById("menu").style.display = "block";
  document.getElementById("leader-board").style.display = "none";
  pop.currentTime = 0;
  pop.play();
};

document.getElementById("leader-board-open").onclick = () =>{
  document.getElementById("leader-board").style.display = "block";
  document.getElementById("menu").style.display = "none";
  pop.currentTime = 0;
  pop.play();
};

document.getElementById("home-loose").onclick = () =>{
  document.getElementById("menu").style.display = "block";
  document.getElementById("loose").style.display = "none";
};

const options = [
    document.getElementById("option1"),
    document.getElementById("option2"),
    document.getElementById("option3"),
    document.getElementById("option4")
];

document.getElementById("option1").onclick = () => selectOption(0);
document.getElementById("option2").onclick = () => selectOption(1);
document.getElementById("option3").onclick = () => selectOption(2);
document.getElementById("option4").onclick = () => selectOption(3);

function selectOption(selected) {
  
  options[0].style.pointerEvents = "none";
  options[1].style.pointerEvents = "none";
  options[2].style.pointerEvents = "none";
  options[3].style.pointerEvents = "none";
  
  clearInterval(interval);

    if(selected + 1 != current_correct){
      options[selected].style.backgroundColor = "#ffc622";
      setTimeout(() => {
        options[selected].style.backgroundColor = "#ea2b66";
        options[current_correct - 1].style.background = "#7fdf5f";
        game_over.play();
      }, 1000);

      setTimeout(() => {
        loose();
      }, 3000);
    }else {
      options[selected].style.backgroundColor = "#ffc622";
      
      setTimeout(() => {
        options[selected].style.backgroundColor = "#7fdf5f";
        corrects++;
        correct.play();
      }, 1000);

      setTimeout(() => {
        randomQuestion();
        startTimer();
      }, 2000);
    }
}


async function send_score(record, user_id) {
  const url = "https://ghabile.bouzhan-saran.workers.dev/quiz";

  const data = {
    user_id: user_id,
    record: record
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("✅ پاسخ دریافت شد:", result);
    return result;

  } catch (error) {
    console.error("❌ خطا در ارسال درخواست:", error);
  }
}

async function get_record(user_id) {
  const url = "https://ghabile.bouzhan-saran.workers.dev/get_records";

  const data = {
    user_id: user_id,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    record = Number(result);
    document.getElementById("record").textContent = "بهترین رکورد امروزت: " + result;
    console.log("✅ پاسخ دریافت شد:", result);
    return result;

  } catch (error) {
    console.error("❌ خطا در ارسال درخواست:", error);
  }
}

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) {
  }
});

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead', '#ff6b6b', '#dda0dd', '#ff8a5c'];

function createSquare() {
  const square = document.createElement('div');
  square.className = 'square';
    
  square.style.background = colors[Math.floor(Math.random() * colors.length)];
    
  const size = Math.random() * 12 + 10;
  square.style.width = size + 'px';
  square.style.height = size + 'px';
    
  square.style.left = Math.random() * window.innerWidth + 'px';
     
  const duration = Math.random() * 3 + 2;
  square.style.animationDuration = duration + 's';
    
  square.style.animationDelay = Math.random() * 0.5 + 's';
    
  document.body.appendChild(square);
    
  setTimeout(() => {
    square.remove();
  }, duration * 1000 + 500);
}

particles = setInterval(createSquare, 100);

/*function playEffect(duration = 5000) {
  const interval = setInterval(createSquare, 50);

  setTimeout(() => {
    clearInterval(interval);
  }, duration);
}*/

const fill = document.getElementById("timerFill");

const totalTime = 10000;
let interval;

function startTimer() {

    clearInterval(interval);

    const start = Date.now();

    fill.style.width = "100%";

    interval = setInterval(() => {

        const elapsed = Date.now() - start;
        const percent = Math.max(0, 100 - (elapsed / totalTime) * 100);

        fill.style.width = percent + "%";

        if (percent <= 0) {
          clearInterval(interval);
          console.log("Time Over");
          loose();
        }

    }, 50);
}

function loose(){
  document.getElementById("loose").style.display = "block";
  document.getElementById("game").style.display = "none";
  document.getElementById("result").textContent = ": تعداد جواب های درست " + corrects + " ✅";
  if(corrects > record){
    record = corrects;
    document.getElementById("record").textContent = "بهترین رکورد امروزت: " + record;
    send_score(corrects, 6025961065);
  }
}
