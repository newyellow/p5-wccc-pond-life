
function drawFlowerSlice(_x, _y, _dir, _length, _thickness) {
    let strokeCount = _length / 2;

    for (let i = 0; i < strokeCount; i++) {
        let t = i / (strokeCount - 1);

        let offsetX = sin(radians(_dir)) * _length * t;
        let offsetY = -cos(radians(_dir)) * _length * t;

        let nowThickness = _thickness * easeInOutSine(t);

        if (t < 0.5)
            nowThickness = lerp(0, _thickness, easeOutSine(t * 2));
        else
            nowThickness = lerp(0.0, _thickness, easeOutSine((1.0 - t) * 2));

        strokeWeight(random(1, 4));
        stroke(0.0, 0.0, 100.0, 0.8);
        noFill();

        push();
        translate(_x, _y);

        arc(offsetX, offsetY, nowThickness, nowThickness / 2, radians(0), radians(180));
        pop();
    }
}

function drawNoiseLine(_x, _y, _dir, _length) {
    let dotCount = _length / 2;

    let nowX = _x;
    let nowY = _y;

    for (let i = 0; i < dotCount; i++) {
        let pointSizeNoise = noise(nowX * 0.01, nowY * 0.01, 666);
        let nowSize = lerp(0.1, 2.0, pointSizeNoise);
        nowSize += random(0.0, 1.0);

        strokeWeight(nowSize);

        let rotNoise = noise(nowX * 0.01, nowY * 0.01, 1234);
        let rotAdd = lerp(-60, 60, rotNoise);
        let nowRot = _dir + rotAdd;

        point(nowX, nowY);

        nowX += sin(radians(nowRot)) * 2;
        nowY += -cos(radians(nowRot)) * 2;
    }
}

function drawFlowBG(_yOffset) {
    let toColor = _mainColorSet.waterColor.copy();

    let waterColor = _mainColorSet.waterColor.color();
    waterColor.setAlpha(0.1);
    tempBG.background(waterColor);

    let flowColor = _mainColorSet.waterFlowColor;

    for (let i = 0; i < 300; i++) {
        let fromHue = processHue(flowColor.h + random(-10, 10));
        let fromSat = flowColor.s + random(-10, 10);
        let fromBri = flowColor.b + random(-20, 20);

        let fromColor = new NYColor(fromHue, fromSat, fromBri);

        let nowX = random(-0.2, 1.0) * width;
        let nowY = random(-0.2, 1.1) * height;

        let nowLength = random(0.03, 0.4) * min(width, height);
        let nowThickness = random(1.0, 3.0);

        if (random() < 0.5)
            drawFlowLine(nowX, nowY, nowLength, nowThickness, fromColor, toColor, _yOffset);
        else
            drawFlowLine(nowX, nowY, nowLength, nowThickness, toColor, fromColor, _yOffset)
    }
}

function drawFlowLine(_x, _y, _length, _thickness, _fromC, _toC, _offset) {
    let strokeCount = _length / 2;

    let nowX = _x;
    let nowY = _y;

    for (let i = 0; i < strokeCount; i++) {
        let t = i / (strokeCount - 1);

        let sizeNoise = noise(nowX * 0.01, (nowY + _offset) * 0.01, 4096);
        let rotNoise = noise(nowX * 0.01, (nowY + _offset) * 0.01, 6666);

        let nowSize = _thickness * lerp(0.6, 1.2, sizeNoise);
        let nowRot = 90 + lerp(-40, 40, rotNoise);

        nowX += sin(radians(nowRot)) * 2;
        nowY += -cos(radians(nowRot)) * 2;

        let nowColor = NYLerpColor(_fromC, _toC, t);

        tempBG.noStroke();
        tempBG.fill(nowColor.h, nowColor.s, nowColor.b, 0.6);

        tempBG.circle(nowX, nowY, nowSize);
    }
}