const tg = window.Telegram.WebApp;
//tg.openTelegramLink(links[links_id]);
tg.ready();
tg.expand();

let user_id = tg.initDataUnsafe.user?.id;
let first_name = tg.initDataUnsafe.user?.first_name;
let user_name = tg.initDataUnsafe.user?.username;

let questions = [];
let current_question;
let current_correct;
let corrects = 0;

const channel_link = "https://t.me/sticker_shops";

let leader_board;

let menu = document.getElementById("menu");
let ad = document.getElementById("ad");
let game = document.getElementById("game");

const pop = new Audio("pop.mp3");
const song = new Audio("song.mp3");
const correct = new Audio("correct.mp3");
const game_over = new Audio("game-over.mp3");

fetch("questions.json")
  .then((response) => response.json())
  .then((json) => {
    questions = json.questions;
  })
  .catch((error) => console.error(error));

const data = {
    "rasool": 20,
    "ahmad": 12,
    "rasool": 90,
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
};


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

function selectOption(button_id, id) {
  
  document.getElementById("option1").style.pointerEvents = "none";
  document.getElementById("option2").style.pointerEvents = "none";
  document.getElementById("option3").style.pointerEvents = "none";
  document.getElementById("option4").style.pointerEvents = "none";
  
  clearInterval(interval);

    if(id != current_correct){
      document.getElementById(button_id).style.backgroundColor = "#ffc622";
      
      setTimeout(() => {
        document.getElementById(button_id).style.backgroundColor = "#ea2b66";
        game_over.play();
      }, 1000);

      setTimeout(() => {
        loose();
      }, 2000);
    }else {
      document.getElementById(button_id).style.backgroundColor = "#ffc622";
      
      setTimeout(() => {
        document.getElementById(button_id).style.backgroundColor = "#7fdf5f";
        corrects++;
        correct.play();
      }, 1000);

      setTimeout(() => {
        randomQuestion();
        startTimer();
      }, 2000);
    }
}

document.getElementById("option1").onclick = () => selectOption("option1", 1);
document.getElementById("option2").onclick = () => selectOption("option2", 2);
document.getElementById("option3").onclick = () => selectOption("option3", 3);
document.getElementById("option4").onclick = () => selectOption("option4", 4);

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

    const result = await response.text();

    if (!response.ok) {
      document.getElementById("vfv-logs").textContent = result;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
    
  const size = Math.random() * 10 + 20;
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

setInterval(createSquare, 50);

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
}
