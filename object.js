
class NYColor {
    constructor(_h, _s, _b, _a = 1.0) {
        this.h = _h;
        this.s = _s;
        this.b = _b;
        this.a = _a;
    }

    copy() {
        return new NYColor(this.h, this.s, this.b, this.a);
    }

    slightRandomize(_hDiff = 10, _sDiff = 12, _bDiff = 12, _aDiff = 0.0) {
        this.h += random(-0.5 * _hDiff, 0.5 * _hDiff);
        this.s += random(-0.5 * _sDiff, 0.5 * _sDiff);
        this.b += random(-0.5 * _bDiff, 0.5 * _bDiff);
        this.a += random(-0.5 * _aDiff, 0.5 * _aDiff);
    }

    static newRandomColor(_mainHue) {
        let h = processHue(_mainHue + random(-30, 30));
        let s = random(40, 60);
        let b = random(80, 100);

        return new NYColor(h, s, b);
    }
}


class PlantLili {
    constructor(_x, _y, _tall) {
        this.x = _x;
        this.y = _y;
        this.tall = _tall;

        if (random() < 0.15)
            this.type = 'FLOWER';
        else
            this.type = 'LEAF';

        if (this.type == 'FLOWER') {
            this.tall += random(0.0, 1.2) * waterBaseTall;
        }

        this.xOffset = random(-200, 200);
        this.totalSteps = int(this.tall / 0.6);
        this.nowStep = 0;

        this.fromColor = new NYColor(60, 40, 40);
        this.toColor = new NYColor(120, 60, 60);

        this.fromX = _x;
        this.fromY = _y;

        this.toX = _x + this.xOffset;
        this.toY = _y - _tall * 0.6;

        let easingIndex = int(random(0, 8));

        if (easingIndex == 0)
            this.easingFunc = easeOutSine;
        else if (easingIndex == 1)
            this.easingFunc = easeInOutSine;
        else if (easingIndex == 2)
            this.easingFunc = easeOutQuad;
        else if (easingIndex == 3)
            this.easingFunc = easeInOutQuad;
        else if (easingIndex == 4)
            this.easingFunc = easeOutBack;
        else if (easingIndex == 5)
            this.easingFunc = easeInOutBack;
        else if (easingIndex == 6)
            this.easingFunc = easeOutCirc;
        else if (easingIndex == 7)
            this.easingFunc = easeInOutCirc;


        let sizeRandom = random();

        if (sizeRandom < 0.2)
            this.leafSize = random(0.2, 0.36) * min(width, height);
        else if (sizeRandom < 0.4)
            this.leafSize = random(0.03, 0.08) * min(width, height);
        else
            this.leafSize = random(0.06, 0.14) * min(width, height);
    }

    drawStep() {
        if (this.nowStep >= this.totalSteps)
            return false;

        let t = this.nowStep / this.totalSteps;
        let animatedT = this.easingFunc(t);

        // let rotNoise = noise(nowX * 0.001, nowY * 0.001) * 720;
        let nowColor = NYLerpColor(this.fromColor, this.toColor, t);

        noStroke();
        fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);

        let nowX = lerp(this.fromX, this.toX, animatedT);
        let nowY = lerp(this.fromY, this.toY, t);

        circle(nowX, nowY, 3);
        this.nowStep++;

        return true;
    }

    drawLeaf() {
        let nowHue = 120 + random(-30, 30);
        let nowSat = random(30, 60);
        let nowBri = random(30, 80);

        noStroke();
        fill(nowHue, nowSat, nowBri, 1.0);
        // ellipse(this.toX, this.toY, this.leafSize, this.leafSize * 0.6);

        let strokeCount = this.leafSize * random(0.6, 2.4);
        for (let i = 0; i < strokeCount; i++) {
            noFill();

            let arcHue = nowHue + random(-20, 20);
            let arcSat = nowSat + random(-10, 10);
            let arcBri = nowBri + random(-10, 10);

            if (random() < 0.08) {
                arcHue = processHue(arcHue - 80);
            }

            if (random() < 0.06) {
                arcSat = 0.0;
                arcBri = 100.0;
            }
            stroke(arcHue, arcSat, arcBri, 0.8);

            strokeWeight(random(1.0, 6.0));
            let arcSize = random() * this.leafSize;

            let arcAngleFrom = random(0, 360);
            let arcAngleTo = arcAngleFrom + random(12, 36);
            arc(this.toX, this.toY, arcSize, arcSize * 0.36, radians(arcAngleFrom), radians(arcAngleTo));
        }
        // circle(this.toX, this.toY, this.leafSize);
    }

    drawFlower() {

        let flowerSliceCount = int(random(3, 12));
        let flowerLeafLength = random(10, 60);

        // back half
        for (let i = 0; i < flowerSliceCount; i++) {
            let t = i / (flowerSliceCount - 1);
            let sliceDegree = lerp(-60, 60, t);
            sliceDegree += random(-10, 10);
            let nowLength = random(0.6, 1.2) * flowerLeafLength;
            let nowThickness = random(0.8, 1.2) * nowLength / 2;

            drawFlowerSlice(this.toX, this.toY, sliceDegree, nowLength, nowThickness);
        }

        // pistil
        let pistilCount = int(random(3, 12));
        for (let i = 0; i < pistilCount; i++) {
            let rotDegree = random(-60, 60);
            let spawnX = this.toX + random(-6, 6);
            let spawnY = this.toY + random(-3, 3);

            let length = flowerLeafLength * random(0.6, 1.2);

            stroke(52, 90, 95, 0.8);
            drawNoiseLine(spawnX, spawnY, rotDegree, length);
        }

        // front half
        for (let i = 0; i < flowerSliceCount; i++) {
            let t = i / (flowerSliceCount - 1);
            let sliceDegree = lerp(-80, 80, t);
            sliceDegree += random(-10, 10);

            let nowLength = random(0.3, 0.8) * flowerLeafLength;
            let nowThickness = random(0.8, 1.2) * nowLength / 2;

            drawFlowerSlice(this.toX, this.toY + 3, sliceDegree, nowLength, nowThickness);
        }
    }
}
