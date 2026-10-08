---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿415730521＿　　姓名：＿＿＿鐘王誠＿＿＿＿＿

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習1截圖](請貼上截圖)
![動畫](https://hackmd.io/_uploads/Hy_Kc3ViGl.gif)

### 第一次問 AI

```tex!
我想用p5.js做一個互動網站，把程式只寫入sketch.js，其他不改。想法：產生一個選擇題測驗卷網站一次顯示一題、四個選項、每次答完會顯示對錯與總答對題數，題目為隨機個位數加法，5題，答完立即顯示對錯並進入下一題
//gemini3.6flash（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
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
```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習2截圖](請貼上截圖)
![動畫](https://hackmd.io/_uploads/HyKZj2VjGl.gif)

### 第一次問 AI

```tex!
更改程式，網頁設定為響應式網頁，視窗大小改變時版面自動調整
//gemini3.6flash（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
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
```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)
![動畫](https://hackmd.io/_uploads/ByiDjn4sMg.gif)

### 第一次問 AI

```tex!
修正程式，從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
//gemini3.6flash（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在
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
let customFontName = 'Noto Sans TC';

function preload() {
  // 動態嵌入 Google Fonts 繁體中文字型 (Noto Sans TC)
  let fontLink1 = document.createElement('link');
  fontLink1.rel = 'preconnect';
  fontLink1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fontLink1);

  let fontLink2 = document.createElement('link');
  fontLink2.rel = 'preconnect';
  fontLink2.href = 'https://fonts.gstatic.com';
  fontLink2.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink2);

  let fontLink3 = document.createElement('link');
  fontLink3.rel = 'stylesheet';
  fontLink3.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap';
  document.head.appendChild(fontLink3);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 設定 p5.js 使用預載入的字型
  textFont(customFontName);
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

  let cardW = min(width * 0.9, 600);
  let startX = (width - cardW) / 2;

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

  let cardW = min(width * 0.9, 600);
  let centerX = width / 2;

  // 1. 頂部資訊欄
  textAlign(LEFT, CENTER);
  textSize(constrain(width * 0.025, 14, 18));
  fill(100);
  text(`第 ${currentQ + 1} / ${totalQuestions} 題`, centerX - cardW / 2, height * 0.08);

  textAlign(RIGHT, CENTER);
  text(`目前答對：${score} 題`, centerX + cardW / 2, height * 0.08);

  // 2. 題目框
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

  // 3. 繪製 4 個選項按鈕
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

  // 4. 反饋提示與跳頁邏輯
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
```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)
![動畫](https://hackmd.io/_uploads/HknO334jze.gif)

### 第一次問 AI

```tex!
製作題庫，把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題
//gemini3.6flash（逐字貼上你第一次問 AI 的提示詞）（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

/*
////////////questions.csv//////////////////
////////////
num1,num2,option1,option2,option3,option4,correctAns
3,5,6,8,7,9,8
7,2,9,8,10,7,9
4,4,6,7,8,9,8
1,8,7,9,10,8,9
6,3,8,9,10,7,9
9,4,11,12,13,14,13
2,6,7,8,9,10,8
5,5,9,10,11,12,10
0,9,8,9,10,11,9
8,7,13,14,15,16,15
*/
////////////////////////////////////////////////////////
let table;             // 存放 CSV 載入的題庫資料
let questionBank = []; // 解析後的完整題庫
let questions = [];    // 每次隨機抽出的 5 題
let currentQ = 0;
let score = 0;
let totalQuestions = 5;
let gameState = "QUIZ"; // "QUIZ" 或 "FINISHED"

let selectedOption = -1;
let answered = false;
let isCorrect = false;
let feedbackTimer = 0;

let optionButtons = [];
let customFontName = 'Noto Sans TC';

function preload() {
  // 1. 動態嵌入 Google Fonts 繁體中文字型 (Noto Sans TC)
  let fontLink1 = document.createElement('link');
  fontLink1.rel = 'preconnect';
  fontLink1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fontLink1);

  let fontLink2 = document.createElement('link');
  fontLink2.rel = 'preconnect';
  fontLink2.href = 'https://fonts.gstatic.com';
  fontLink2.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink2);

  let fontLink3 = document.createElement('link');
  fontLink3.rel = 'stylesheet';
  fontLink3.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap';
  document.head.appendChild(fontLink3);

  // 2. 載入 CSV 題庫檔案 (標題列為 header)
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(customFontName);

  // 解析 CSV 資料轉存入題庫陣列
  parseCSVToBank();
  
  // 隨機抽取 5 題並初始化排版
  pickRandomQuestions();
  updateLayout();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

// 將 CSV 表格資料轉成物件陣列
function parseCSVToBank() {
  questionBank = [];
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let num1 = parseInt(row.get('num1'));
    let num2 = parseInt(row.get('num2'));
    let correctAns = parseInt(row.get('correctAns'));
    
    let options = [
      parseInt(row.get('option1')),
      parseInt(row.get('option2')),
      parseInt(row.get('option3')),
      parseInt(row.get('option4'))
    ];

    questionBank.push({
      num1: num1,
      num2: num2,
      correctAns: correctAns,
      options: options
    });
  }
}

// 從題庫中隨機抽出 5 題（不重複）
function pickRandomQuestions() {
  // 複製一份題庫陣列並洗牌
  let shuffledBank = shuffle([...questionBank]);
  // 取前 5 題（若題庫少於 5 題則取全部）
  questions = shuffledBank.slice(0, min(totalQuestions, shuffledBank.length));
  totalQuestions = questions.length;
}

// 依據目前視窗尺寸動態計算 UI 與 4 個選項按鈕的位置/大小
function updateLayout() {
  optionButtons = [];

  let cardW = min(width * 0.9, 600);
  let startX = (width - cardW) / 2;

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
  if (questions.length === 0) return;

  let q = questions[currentQ];

  let cardW = min(width * 0.9, 600);
  let centerX = width / 2;

  // 1. 頂部資訊欄
  textAlign(LEFT, CENTER);
  textSize(constrain(width * 0.025, 14, 18));
  fill(100);
  text(`第 ${currentQ + 1} / ${totalQuestions} 題`, centerX - cardW / 2, height * 0.08);

  textAlign(RIGHT, CENTER);
  text(`目前答對：${score} 題`, centerX + cardW / 2, height * 0.08);

  // 2. 題目框
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

  // 3. 繪製 4 個選項按鈕
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

  // 4. 反饋提示與跳頁邏輯
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
  pickRandomQuestions();
  updateLayout();
}
```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿淡小虎很卡，有時會向我確認我已經說明的事件＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
