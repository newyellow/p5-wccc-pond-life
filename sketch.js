
let lilis = [];
let tempBG;

let waterBaseTall = 300;
let _mainColorSet;

let paintType = 'PORTRAIT';
let paintXRange = [0.2, 0.8];
let paintYRange = [-0.1, 1.4];

async function setup() {

  createCanvas(windowWidth, windowHeight);
  // createCanvas(800, 800);
  colorMode(HSB);

  _mainColorSet = getRandomColorSet();
  console.log(_mainColorSet);

  tempBG = createGraphics(width, height);
  tempBG.colorMode(HSB);
  tempBG.background(_mainColorSet.waterColor.color());

  background(0, 0, 95);

  let plantCount = random(30, 200);

  for (let i = 0; i < plantCount; i++) {
    let newX = random(-0.2, 1.2) * width;
    let newY = random(-0.2, 1.2) * height;

    let sameSpotCount = int(random(1, 6));
    for (let j = 0; j < sameSpotCount; j++) {
      newX += random(-10, 10);
      newY += random(-10, 10);
      lilis.push(new PlantLili(newX, newY, waterBaseTall));
    }
  }

  // draw plant branch
  let totalSteps = int(waterBaseTall / 0.6);

  for (let i = 0; i < totalSteps; i++) {
    for (let j = 0; j < lilis.length; j++) {
      lilis[j].drawStep();
    }

    if (i % 20 == 0) {
      tempBG.clear();
      drawFlowBG(i);
      image(tempBG, 0, 0);

      // background(230, 40, 10, 0.16);
    }

    await sleep(1);
  }

  // draw leaf
  for (let i = 0; i < lilis.length; i++) {
    if (lilis[i].type == 'LEAF')
      lilis[i].drawLeaf();
  }

  // draw unfinished branch
  for(let i=0; i< lilis.length; i++)
  {
    while(lilis[i].drawStep())
    {
      ;
    }
  }

  while (true) {
    let allFinished = true;
    for (let i = 0; i < lilis.length; i++) {
      if (lilis[i].drawStep())
        allFinished = false;
    }

    if (allFinished)
      break;

    await sleep(1);
  }

  // draw flowers
  for (let i = 0; i < lilis.length; i++) {
    if (lilis[i].type == 'FLOWER')
      lilis[i].drawFlower();
  }
}

async function draw() {

}

async function PondBGLayer(_nowTall) {

  let lineLength = 8;
  let xCount = int(width / 8);
  let yCount = int(height / 2);

  let mainHue = 220;
  let mainSat = 46;
  let mainBri = 100;

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let nowX = x * 8;
      let nowY = y * 2;

      let nowHue = mainHue + random(-10, 10);
      let nowSat = mainSat + random(-10, 10);
      let nowBri = mainBri + random(-10, 10);

      let weightNoise = noise(nowX * 0.001, (nowY - _nowTall) * 0.001, (_nowTall + 100) * 0.001);
      let nowThickness = lerp(-4, 4, weightNoise);
      if (nowThickness <= 0)
        continue;

      strokeWeight(nowThickness);
      stroke(nowHue, nowSat, nowBri, 0.1);

      let lengthNoise = noise(nowX * 0.01, (nowY - _nowTall) * 0.01, (_nowTall + 600) * 0.01);
      lineLength = lerp(6, 16, lengthNoise);

      let rotNoise = noise(nowX * 0.01, (nowY - _nowTall) * 0.01, (_nowTall + 1234) * 0.01);
      let nowRot = lerp(-60, 60, rotNoise);

      push();
      translate(nowX, nowY);
      rotate(radians(nowRot));
      line(-0.5 * lineLength, 0, 0.5 * lineLength, 0);
      pop();
    }
  }
}




// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}