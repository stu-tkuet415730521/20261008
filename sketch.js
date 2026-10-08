//學習1程式碼所在
let questions = [];
let currentQ = 0;
let score = 0;
let totalQuestions = 5;
let gameState = "QUIZ"; // "QUIZ" 或 "FINISHED"

let selectedOption = -1;
let answered = false;
let isCorrect = false;
let feedbackTimer = 0;

let optionButtons = [];

function setup() {
  createCanvas(600, 450);
  generateQuestions();
  setupOptionButtons();
}

// 產生 5 題隨機個位數加法題目
function generateQuestions() {
  questions = [];
  for (let i = 0; i < totalQuestions; i++) {
    let num1 = floor(random(0, 10));
    let num2 = floor(random(0, 10));
    let correctAns = num1 + num2;

    // 產生 3 個不重複的錯誤答案
    let optionsSet = new Set();
    optionsSet.add(correctAns);
    
    while (optionsSet.size < 4) {
      let wrongAns = floor(random(0, 19)); // 加法最大值為 18
      optionsSet.add(wrongAns);
    }

    // 將答案洗牌轉成陣列
    let options = Array.from(optionsSet);
    shuffle(options, true);

    questions.push({
      num1: num1,
      num2: num2,
      correctAns: correctAns,
      options: options
    });
  }
}

// 計算 4 個選項按鈕的位置
function setupOptionButtons() {
  optionButtons = [];
  let startY = 200;
  let btnWidth = 220;
  let btnHeight = 50;

  for (let i = 0; i < 4; i++) {
    let x = (i % 2 === 0) ? 60 : 320;
    let y = startY + floor(i / 2) * 70;
    optionButtons.push({ x: x, y: y, w: btnWidth, h: btnHeight });
  }
}

function draw() {
  background(245, 247, 250);

  if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "FINISHED") {
    drawEndScreen();
  }
}

// 繪製測驗畫面
function drawQuizScreen() {
  let q = questions[currentQ];

  // 1. 頂部資訊欄（進度與得分）
  textAlign(LEFT, CENTER);
  textSize(16);
  fill(100);
  text(`第 ${currentQ + 1} / ${totalQuestions} 題`, 40, 40);

  textAlign(RIGHT, CENTER);
  text(`目前答對：${score} 題`, width - 40, 40);

  // 2. 題目框
  stroke(220);
  fill(255);
  rect(40, 70, width - 80, 100, 12);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(40);
  text(`${q.num1} + ${q.num2} = ?`, width / 2, 120);

  // 3. 繪製 4 個選項
  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                  mouseY > btn.y && mouseY < btn.y + btn.h;

    // 按鈕背景顏色變換
    if (answered && i === selectedOption) {
      fill(isCorrect ? "#4CAF50" : "#F44336"); // 對：綠，錯：紅
    } else if (!answered && isHover) {
      fill("#E3F2FD"); // 滑鼠懸停
    } else {
      fill(255);
    }

    stroke(200);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();

    // 文字顏色
    if (answered && i === selectedOption) {
      fill(255);
    } else {
      fill(50);
    }
    textSize(20);
    text(q.options[i], btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  // 4. 答題後的暫停與跳頁邏輯
  if (answered) {
    // 顯示即時對錯提示
    textAlign(CENTER, CENTER);
    textSize(22);
    if (isCorrect) {
      fill("#2E7D32");
      text("答對了！🎉", width / 2, 360);
    } else {
      fill("#C62828");
      text(`答錯了！正確答案是：${q.correctAns}`, width / 2, 360);
    }

    // 延遲 1 秒（60 幀）後進入下一題
    if (frameCount - feedbackTimer > 60) {
      nextQuestion();
    }
  }
}

// 繪製結算畫面
function drawEndScreen() {
  // 結算卡片
  stroke(220);
  fill(255);
  rect(80, 60, width - 160, 330, 16);
  noStroke();

  textAlign(CENTER, CENTER);
  
  textSize(28);
  fill(40);
  text("測驗結束！", width / 2, 120);

  textSize(22);
  fill(80);
  text(`您的總得分： ${score} / ${totalQuestions} 題`, width / 2, 190);

  // 重新開始按鈕
  let btnX = width / 2 - 80;
  let btnY = 270;
  let btnW = 160;
  let btnH = 45;

  let isHover = mouseX > btnX && mouseX < btnX + btnW &&
                mouseY > btnY && mouseY < btnY + btnH;

  fill(isHover ? "#1976D2" : "#2196F3");
  rect(btnX, btnY, btnW, btnH, 8);

  fill(255);
  textSize(18);
  text("再試一次", width / 2, btnY + btnH / 2);
}

function mousePressed() {
  if (gameState === "QUIZ" && !answered) {
    // 檢查點擊區域
    for (let i = 0; i < 4; i++) {
      let btn = optionButtons[i];
      if (mouseX > btn.x && mouseX < btn.x + btn.w &&
          mouseY > btn.y && mouseY < btn.y + btn.h) {
        
        selectedOption = i;
        answered = true;
        feedbackTimer = frameCount;

        let selectedVal = questions[currentQ].options[i];
        if (selectedVal === questions[currentQ].correctAns) {
          isCorrect = true;
          score++;
        } else {
          isCorrect = false;
        }
        break;
      }
    }
  } else if (gameState === "FINISHED") {
    // 檢查點擊「再試一次」按鈕
    let btnX = width / 2 - 80;
    let btnY = 270;
    let btnW = 160;
    let btnH = 45;

    if (mouseX > btnX && mouseX < btnX + btnW &&
        mouseY > btnY && mouseY < btnY + btnH) {
      restartQuiz();
    }
  }
}

function nextQuestion() {
  answered = false;
  selectedOption = -1;
  currentQ++;

  if (currentQ >= totalQuestions) {
    gameState = "FINISHED";
  }
}

function restartQuiz() {
  score = 0;
  currentQ = 0;
  answered = false;
  selectedOption = -1;
  gameState = "QUIZ";
  generateQuestions();
}