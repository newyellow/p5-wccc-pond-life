function getRandomColorSet() {
    let sets = [];

    sets.push({
        waterColor: new NYColor(220, 40, 10),
        waterFlowColor: new NYColor(192, 86, 90),
        plantColorA: new NYColor(100, 60, 60),
        plantColorB: new NYColor(220, 60, 60),
        plantContrastColor: new NYColor(40, 70, 80),
        flowerColorA: new NYColor(0, 0, 100),
        flowerColorB: new NYColor(300, 35, 100)
    });

    sets.push({
        waterColor: new NYColor(0, 0, 100),
        waterFlowColor: new NYColor(192, 86, 90),
        plantColorA: new NYColor(100, 60, 60),
        plantColorB: new NYColor(220, 60, 60),
        plantContrastColor: new NYColor(40, 70, 80),
        flowerColorA: new NYColor(0, 0, 100),
        flowerColorB: new NYColor(300, 35, 100)
    });

    return random(sets);
}