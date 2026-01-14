/*
 * Predicted Wound - SDG14 Interaction Art
 * Copyright (C) 2025 [Kyoyoon Ahn]
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


class Organism {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ox = x; 
    this.oy = y;
    this.size = random(15, 40);
    this.active = 0; 
    this.off = random(1000); 
  }
}

let orgs = [];       
let currentL = [];   
let originL = [];    
let ripples = [0, 0, 0]; 
let timer = 0;       
let isDirty = false; 
let rippleGo = 0;    

// 사운드 변수
let bgm;        // underwaterambience
let whaleAmb;   // whale (배경음으로 사용)
let beepAmb;    // beep (배경음으로 사용)
let clickSnd;   // littering (클릭 시 효과음)
let bubbleAmb;  // bubble (배경음으로 사용)
let constructionAmb; // construction (배경음으로 사용)
let waveAmb;    // wave (배경음으로 사용)
let electromagneticAmb; // electromagnetic (배경음으로 사용)
let explosionSnd; // explosion (클릭 시 효과음)

// --- UI CONFIGURATION ---
let isMuted = false;        // Trạng thái âm thanh
const btnSize = 40;         // Kích thước nút
const btnY = 20;            // Vị trí Y (cách lề trên)
const btnSoundX = 20;       // Vị trí X nút Loa
const btnInfoX = 70;        // Vị trí X nút Info

// Biến âm thanh cho nút (nếu có)
// let buttonSound;

function preload() {
  bgm = loadSound('underwaterambience-sound.wav');
  whaleAmb = loadSound('whale-sound.wav');
  beepAmb = loadSound('beep-sound.wav');
  clickSnd = loadSound('littering-sound.wav');
  bubbleAmb = loadSound('bubble-sound.wav');
  constructionAmb = loadSound('construction.wav');
  waveAmb = loadSound('wave.wav');
  electromagneticAmb = loadSound('electromagnetic-sound.wav');
  explosionSnd = loadSound('explosion-sound.wav');

}


function setup() {
  createCanvas(windowWidth, windowHeight); 
  pixelDensity(2); // For high resolution displays
  frameRate(30); 

  // --- 모든 앰비언트 사운드를 루프(반복) 재생 ---
  bgm.loop();
  bgm.setVolume(0.3);

  whaleAmb.loop();
  whaleAmb.setVolume(0.1); 

  beepAmb.loop();
  beepAmb.setVolume(0.15); 

  bubbleAmb.loop();
  bubbleAmb.setVolume(0.1); 

  constructionAmb.loop();
  constructionAmb.setVolume(0.1); 

  waveAmb.loop();
  waveAmb.setVolume(0.1); 

  electromagneticAmb.loop();
  electromagneticAmb.setVolume(0.1); 

  // 유기체 및 선 초기화 로직
  for (let i = 0; i < 16; i++) {
    let r = random(200, 650); 
    currentL[i] = r;          
    originL[i] = r;           
  }

  for (let i = 0; i < 60; i++) {
    let a = random(TWO_PI);     
    let d = random(250, 450);   
    let px = width / 2 + cos(a) * d; 
    let py = height / 2 + sin(a) * d; 
    orgs[i] = new Organism(px, py); 
  }
}

function draw() {
  background(0); 
  let centerX = width / 2;
  let centerY = height / 2;

  // 중앙 원
  noFill();
  if (isDirty == true) {
    stroke(220, 30, 40); 
    strokeWeight(3);   
  } else {
    stroke(255, 255, 255);  
    strokeWeight(2);
  }
  ellipse(centerX, centerY, 200, 200);

  // 유기체 루프
  for (let i = 0; i < orgs.length; i++) {
    let o = orgs[i];
    o.x = o.ox + sin(frameCount * 0.03 + o.off) * 5;
    o.y = o.oy + cos(frameCount * 0.03 + o.off) * 5;

    if (ripples[0] > 0 || ripples[1] > 0 || ripples[2] > 0) {
      let d = dist(centerX, centerY, o.x, o.y);
      if (abs(d - ripples[0]/2) < 20) o.active = 1.0;
      if (abs(d - ripples[1]/2) < 20) o.active = 1.0;
      if (abs(d - ripples[2]/2) < 20) o.active = 1.0;
    }

    if (o.active > 0) {
      stroke(220, 30, 40, 255 * o.active); 
      fill(220, 30, 40, 100 * o.active);  
      o.active = o.active - 0.02; 
    } else {
      stroke(255, 255, 255); 
      fill(255, 50);    
    }
    
    let breath = sin(frameCount * 0.04 + o.off) * 3;
    strokeWeight(1.5);
    noFill(); 
    ellipse(o.x, o.y, o.size + breath);
    ellipse(o.x, o.y, (o.size + breath) * 1.3);

    if (o.active > 0) fill(220, 30, 40, 150 * o.active);
    else fill(255, 100);
    noStroke();
    ellipse(o.x, o.y, (o.size + breath) * 0.25); 
  }

  // 선 수축 애니메이션
  let finishedLines = 0; 
  for (let i = 0; i < 16; i++) {
    let angle = (TWO_PI / 16) * i; 

    if (isDirty == true) {
      if (currentL[i] > 100) currentL[i] = currentL[i] - 25; 
      else { currentL[i] = 100; finishedLines = finishedLines + 1; }
      stroke(255,255,255); 
      strokeWeight(3);   
    } else {
      if (currentL[i] < originL[i]) currentL[i] = currentL[i] + 5; 
      stroke(255, 255, 255, 150); 
      strokeWeight(1.5);         
      rippleGo = 0; 
    }
    line(centerX + cos(angle)*100, centerY + sin(angle)*100, 
         centerX + cos(angle)*currentL[i], centerY + sin(angle)*currentL[i]);
  }

  // 파동 발사
  if (isDirty == true && finishedLines == 16 && rippleGo == 0) {
    ripples[0] = 300; ripples[1] = 500; ripples[2] = 700;
    rippleGo = 1;              
  }

  for (let i = 0; i < 3; i++) {
    if (ripples[i] > 0) {
      stroke(220, 30, 40); noFill(); strokeWeight(3);
      ellipse(centerX, centerY, ripples[i], ripples[i]);
      ripples[i] = ripples[i] + 30; 
      if (ripples[i] > 2500) ripples[i] = 0;
    }
  }

  if (timer > 0) timer = timer - 1;
  else isDirty = false; 

  drawUI();
}
// ...
function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  // Check UI buttons
  if (mouseX > btnSoundX && mouseX < btnSoundX + btnSize && mouseY > btnY && mouseY < btnY + btnSize) {
    isMuted = !isMuted;
    // Toggle all sounds
    if (isMuted) {
      bgm.setVolume(0);
      whaleAmb.setVolume(0);
      beepAmb.setVolume(0);
      bubbleAmb.setVolume(0);
      constructionAmb.setVolume(0);
      waveAmb.setVolume(0);
      electromagneticAmb.setVolume(0);
    } else {
      bgm.setVolume(0.3);
      whaleAmb.setVolume(0.1);
      beepAmb.setVolume(0.15);
      bubbleAmb.setVolume(0.1);
      constructionAmb.setVolume(0.1);
      waveAmb.setVolume(0.1);
      electromagneticAmb.setVolume(0.1);
    }
  } else if (mouseX > btnInfoX && mouseX < btnInfoX + btnSize && mouseY > btnY && mouseY < btnY + btnSize) {
    // Info button - no action needed, tooltip shows on hover
  } else {
    // Existing interaction
    if (isDirty == false) { 
      isDirty = true;
      timer = 75; 
      //

      // 클릭 시에는 littering과 explosion 소리 재생
      if (!isMuted) {
        if (clickSnd.isLoaded()) {
          clickSnd.play();
        }
        if (explosionSnd.isLoaded()) {
          explosionSnd.play();
          explosionSnd.setVolume(0.1);
        }
      }
    }
  }
}

function drawUI() {
  push(); // Cô lập style để không ảnh hưởng bài chính
  noStroke();

  // --- VẼ NÚT SOUND ---
  let isHoverSound =
    mouseX > btnSoundX &&
    mouseX < btnSoundX + btnSize &&
    mouseY > btnY &&
    mouseY < btnY + btnSize;
    
  // Nền nút
  fill(isHoverSound ? 80 : 40, 200);
  rect(btnSoundX, btnY, btnSize, btnSize, 8);
  
  // Icon Loa / Mute
  fill(255);
  if (isMuted) {
    textAlign(CENTER, CENTER);
    textSize(10);
    textStyle(NORMAL);
    text("MUTE", btnSoundX + btnSize / 2, btnY + btnSize / 2);
    stroke(255, 0, 0);
    strokeWeight(2);
    line(btnSoundX + 5, btnY + 5, btnSoundX + btnSize - 5, btnY + btnSize - 5);
  } else {
    noStroke();
    beginShape();
    vertex(btnSoundX + 10, btnY + 14);
    vertex(btnSoundX + 18, btnY + 14);
    vertex(btnSoundX + 28, btnY + 8);
    vertex(btnSoundX + 28, btnY + 32);
    vertex(btnSoundX + 18, btnY + 26);
    vertex(btnSoundX + 10, btnY + 26);
    endShape(CLOSE);
  }

  // --- VẼ NÚT INFO ---
  noStroke();
  let isHoverInfo =
    mouseX > btnInfoX &&
    mouseX < btnInfoX + btnSize &&
    mouseY > btnY &&
    mouseY < btnY + btnSize;
  
  // Nền nút
  fill(isHoverInfo ? 80 : 40, 200);
  rect(btnInfoX, btnY, btnSize, btnSize, 8);
  
  // Chữ "i"
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text("i", btnInfoX + btnSize / 2, btnY + btnSize / 2);

  // Tooltip (Hiện bảng hướng dẫn khi rê chuột vào)
  if (isHoverInfo) {
    let tooltipX = mouseX + 15;
    let tooltipY = mouseY + 15;
    // Chặn tooltip tràn ra ngoài màn hình
    if (tooltipX + 220 > width) tooltipX = width - 230;
    
    // Khung tooltip
    fill(20, 240);
    stroke(255, 100);
    strokeWeight(1);
    rect(tooltipX, tooltipY, 220, 90, 5);
    
    // Nội dung text
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(NORMAL);
    text("GUIDELINE:", tooltipX + 10, tooltipY + 10);
    
    textSize(11);
    fill(200);
    textLeading(18);
    text(
      "- Click : interaction 1.",
      tooltipX + 10,
      tooltipY + 30
    );
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
