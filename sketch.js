//學習2程式碼所在
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
  createCanvas(windowWidth, windowHeight);
  generateQuestions();
  updateLayout();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

// 產生 5 題隨機個位數加法題目
function generateQuestions() {
  questions = [];
  for (let i = 0; i < totalQuestions; i++) {
    let num1 = floor(random(0, 10));
    let num2 = floor(random(0, 10));
    let correctAns = num1 + num2;

    let optionsSet = new Set();
    optionsSet.add(correctAns);

    while (optionsSet.size < 4) {
      let wrongAns = floor(random(0, 19));
      optionsSet.add(wrongAns);
    }

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

// 依據目前視窗尺寸動態計算 UI 與 4 個選項按鈕的位置/大小
function updateLayout() {
  optionButtons = [];

  // 計算響應式卡片區域 (中央最大 600px 寬或視窗 90% 寬)
  let cardW = min(width * 0.9, 600);
  let startX = (width - cardW) / 2;

  // 按鈕寬高與間距
  let gap = min(width * 0.03, 15);
  let btnWidth = (cardW - gap) / 2;
  let btnHeight = min(height * 0.08, 60);

  let startY = height * 0.45;

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);

    let x = startX + col * (btnWidth + gap);
    let y = startY + row * (btnHeight + gap);

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

  // 1. 卡片基準範圍計算
  let cardW = min(width * 0.9, 600);
  let centerX = width / 2;

  // 2. 頂部資訊欄（進度與得分）
  textAlign(LEFT, CENTER);
  textSize(constrain(width * 0.025, 14, 18));
  fill(100);
  text(`第 ${currentQ + 1} / ${totalQuestions} 題`, centerX - cardW / 2, height * 0.08);

  textAlign(RIGHT, CENTER);
  text(`目前答對：${score} 題`, centerX + cardW / 2, height * 0.08);

  // 3. 題目框
  let qBoxY = height * 0.14;
  let qBoxH = min(height * 0.25, 120);

  stroke(220);
  fill(255);
  rect(centerX - cardW / 2, qBoxY, cardW, qBoxH, 12);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(constrain(width * 0.06, 24, 38));
  fill(40);
  text(`${q.num1} + ${q.num2} = ?`, centerX, qBoxY + qBoxH / 2);

  // 4. 繪製 4 個選項按鈕
  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                  mouseY > btn.y && mouseY < btn.y + btn.h;

    if (answered && i === selectedOption) {
      fill(isCorrect ? "#4CAF50" : "#F44336");
    } else if (!answered && isHover) {
      fill("#E3F2FD");
    } else {
      fill(255);
    }

    stroke(200);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();

    if (answered && i === selectedOption) {
      fill(255);
    } else {
      fill(50);
    }
    textSize(constrain(btn.h * 0.45, 16, 24));
    text(q.options[i], btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  // 5. 反饋提示與跳頁邏輯
  if (answered) {
    textAlign(CENTER, CENTER);
    textSize(constrain(width * 0.035, 18, 24));
    let feedbackY = height * 0.82;

    if (isCorrect) {
      fill("#2E7D32");
      text("答對了！🎉", centerX, feedbackY);
    } else {
      fill("#C62828");
      text(`答錯了！正確答案是：${q.correctAns}`, centerX, feedbackY);
    }

    if (frameCount - feedbackTimer > 60) {
      nextQuestion();
    }
  }
}

// 繪製結算畫面
function drawEndScreen() {
  let cardW = min(width * 0.85, 450);
  let cardH = min(height * 0.6, 320);
  let centerX = width / 2;
  let centerY = height / 2;

  stroke(220);
  fill(255);
  rect(centerX - cardW / 2, centerY - cardH / 2, cardW, cardH, 16);
  noStroke();

  textAlign(CENTER, CENTER);

  textSize(constrain(cardW * 0.08, 22, 32));
  fill(40);
  text("測驗結束！", centerX, centerY - cardH * 0.25);

  textSize(constrain(cardW * 0.06, 16, 22));
  fill(80);
  text(`您的總得分： ${score} / ${totalQuestions} 題`, centerX, centerY - cardH * 0.02);

  // 重新開始按鈕
  let btnW = cardW * 0.5;
  let btnH = min(cardH * 0.18, 50);
  let btnX = centerX - btnW / 2;
  let btnY = centerY + cardH * 0.2;

  let isHover = mouseX > btnX && mouseX < btnX + btnW &&
                mouseY > btnY && mouseY < btnY + btnH;

  fill(isHover ? "#1976D2" : "#2196F3");
  rect(btnX, btnY, btnW, btnH, 8);

  fill(255);
  textSize(constrain(btnH * 0.4, 14, 20));
  text("再試一次", centerX, btnY + btnH / 2);
}

function mousePressed() {
  if (gameState === "QUIZ" && !answered) {
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
    let cardW = min(width * 0.85, 450);
    let cardH = min(height * 0.6, 320);
    let centerX = width / 2;
    let centerY = height / 2;

    let btnW = cardW * 0.5;
    let btnH = min(cardH * 0.18, 50);
    let btnX = centerX - btnW / 2;
    let btnY = centerY + cardH * 0.2;

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
  updateLayout();
}