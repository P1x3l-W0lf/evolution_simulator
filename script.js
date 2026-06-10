let grid = [];
const genders = ["male", "female"];
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
let creatures = {};
let nextCreatureID = 1;
let openIDs = [];
let diseaseCells = [];
let speed = 1;
let move;

function createCreature(stats) {
    if (Object.keys(creatures).length <= 100) {
        let newID;
        if (openIDs.length === 0) {
            newID = nextCreatureID;
            nextCreatureID++;
        } else {
            newID = openIDs.pop();
        }
        creatures[`creature${newID}`] = new creature(genders[Math.floor(Math.random() * genders.length)], stats[0], stats[1], stats[2], stats[3], newID, null, 0);
        document.getElementById(`${creatures[`creature${newID}`].yPos},${creatures[`creature${newID}`].xPos}`).classList.add(creatures[`creature${newID}`].gender);
        grid[creatures[`creature${newID}`].yPos][creatures[`creature${newID}`].xPos] = `C${creatures[`creature${newID}`].id}`;
    }
}

function createFood() {
    const baseY = Math.floor(Math.random() * 39)+1;
    const baseX = Math.floor(Math.random() * 39);

    document.getElementById(`${baseY},${baseX}`).classList.add("food");
    document.getElementById(`${baseY-1},${baseX}`).classList.add("food");
    document.getElementById(`${baseY-1},${baseX+1}`).classList.add("food");
    document.getElementById(`${baseY},${baseX+1}`).classList.add("food");

    grid[baseY][baseX] = "F"
    grid[baseY-1][baseX] = "F"
    grid[baseY-1][baseX+1] = "F"
    grid[baseY][baseX+1] = "F"
}

function createWater() {
    const baseY = Math.floor(Math.random() * 39)+1;
    const baseX = Math.floor(Math.random() * 39);

    document.getElementById(`${baseY},${baseX}`).classList.add("water");
    document.getElementById(`${baseY-1},${baseX}`).classList.add("water");
    document.getElementById(`${baseY-1},${baseX+1}`).classList.add("water");
    document.getElementById(`${baseY},${baseX+1}`).classList.add("water");

    grid[baseY][baseX] = "W"
    grid[baseY-1][baseX] = "W"
    grid[baseY-1][baseX+1] = "W"
    grid[baseY][baseX+1] = "W"
}

function init() {
    for (let i = 0; i < 40; i++) {
        grid.push([])
        for (let j = 0; j < 40; j++) {
            grid[i].push("");
            const newItem = document.createElement("div");
            newItem.className = "cell";
            newItem.id = `${i},${j}`;
            document.getElementById("grid").appendChild(newItem);
        }
    }
    document.getElementById("speedDial").addEventListener("change", function(event){
        speed = event.target.value;
        document.getElementById("speedDisplay").innerHTML = speed;

        runSim();
    })
    for (let i = 0; i < 5; i++){
        let creatureYPos;
        let creatureXPos;

        do {
            creatureYPos = Math.floor(Math.random()*40);
            creatureXPos = Math.floor(Math.random()*40);
        } while (grid[creatureYPos][creatureXPos] !== "");

        createCreature([Math.floor(Math.random()*16)+5, Math.floor(Math.random()*17)+4, creatureXPos, creatureYPos]);
    }

    for (let i = 0; i < 3; i++) {
        createFood();
        createWater();
    }
}

function checkSurroundings(checker, item, stepMod) {
    checker.direction = null;
    for (let i = 1; i <= 5; i++) {
        if (checker.yPos - i >= 0 && grid[checker.yPos - i][checker.xPos].at(0) === item) {
            checker.direction = "N";
            checker.steps = i + stepMod;
            break;
        } else if (checker.yPos - i >= 0 && checker.xPos + i < 40 && grid[checker.yPos - i][checker.xPos + i].at(0) === item) {
            checker.direction = "NE";
            checker.steps = i + stepMod;
            break;
        } else if (checker.xPos + i < 40 && grid[checker.yPos][checker.xPos + i].at(0) === item) {
            checker.direction = "E";
            checker.steps = i + stepMod;
            break;
        } else if (checker.yPos + i < 40 && checker.xPos + i < 40 && grid[checker.yPos + i][checker.xPos + i].at(0) === item) {
            checker.direction = "SE";
            checker.steps = i + stepMod;
            break;
        } else if (checker.yPos + i < 40 && grid[checker.yPos + i][checker.xPos].at(0) === item) {
            checker.direction = "S";
            checker.steps = i + stepMod;
            break;
        } else if (checker.yPos + i < 40 && checker.xPos - i >= 0 && grid[checker.yPos + i][checker.xPos - i].at(0) === item) {
            checker.direction = "SW";
            checker.steps = i + stepMod;
            break;
        } else if (checker.xPos - i >= 0 && grid[checker.yPos][checker.xPos - i].at(0) === item) {
            checker.direction = "W";
            checker.steps = i + stepMod;
            break;
        } else if (checker.yPos - i >= 0 && checker.xPos - i >= 0 && grid[checker.yPos - i][checker.xPos - i].at(0) === item) {
            checker.direction = "NW";
            checker.steps = i + stepMod;
            break;
        }
    }
    if (!checker.direction) {
        checker.direction = directions[Math.floor(Math.random() * directions.length)];
        checker.steps = 3;
    }
}

class disease {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.steps = 0;
        grid[this.yPos][this.xPos] = "D";
        document.getElementById(`${this.yPos},${this.xPos}`).classList.add("disease")
    }

    spread() {
        if (this.steps <= 0) {
            this.direction = null;
            checkSurroundings(this, "C", 1);
        }

        let newYPos = this.yPos;
        let newXPos = this.xPos;
        if (this.direction === "N") {
            newYPos = this.yPos - 1;
        } else if (this.direction === "NE") {
            newYPos = this.yPos - 1;
            newXPos = this.xPos + 1;
        } else if (this.direction === "E") {
            newXPos = this.xPos + 1;
        } else if (this.direction === "SE") {
            newYPos = this.yPos + 1;
            newXPos = this.xPos + 1;
        } else if (this.direction === "S") {
            newYPos = this.yPos + 1;
        } else if (this.direction === "SW") {
            newYPos = this.yPos + 1;
            newXPos = this.xPos - 1;
        } else if (this.direction === "W") {
            newXPos = this.xPos - 1;
        } else if (this.direction === "NW") {
            newYPos = this.yPos - 1;
            newXPos = this.xPos - 1;
        }
        if (newYPos >= 0 && newYPos < 40 && newXPos >= 0 && newXPos < 40) {
            if (grid[newYPos][newXPos] === "" || grid[newYPos][newXPos].at(0) === "C") {
                let newSpaceOccupantID = grid[newYPos][newXPos].slice(1);
                document.getElementById(`${this.yPos},${this.xPos}`).classList.remove("disease");
                document.getElementById(`${newYPos},${newXPos}`).classList.add("disease");
                grid[newYPos][newXPos] = "D";
                grid[this.yPos][this.xPos] = "";
                this.xPos = newXPos;
                this.yPos = newYPos;
                if (newSpaceOccupantID) {
                    document.getElementById(`${this.yPos},${this.xPos}`).classList.remove(creatures[`creature${newSpaceOccupantID}`].gender)
                    openIDs.push(newSpaceOccupantID);
                    delete creatures[`creature${newSpaceOccupantID}`];
                }
            }
            this.steps -= 1;
            if (Object.keys(creatures).length < 15) {
                document.getElementById(`${this.yPos},${this.xPos}`).classList.remove("disease");
                grid[this.yPos][this.xPos] = "";
                diseaseCells.splice(diseaseCells.indexOf(this), 1);
            }
        } else {this.steps = 0}
    }
}

class creature {
    constructor(gender, hunger, thirst, xPos, yPos, id, direction, steps) {
        this.gender = gender;
        this.hunger = hunger;
        this.thirst = thirst;
        this.xPos = xPos;
        this.yPos = yPos;
        this.id = id;
        this.direction = direction;
        this.steps = steps;
        this.hungerMax = hunger;
        this.thirstMax = thirst;
        this.breedTimeout = 5;
    }

    walk(){
        if (this.steps <= 0) {
            this.hunger -= 1;
            this.thirst -= 0.5;
            this.breedTimeout -= 0.5;
            if (this.hunger > 3 && this.thirst > 2 && this.breedTimeout <= 0) {
                checkSurroundings(this, "C", -1);
            } else if (this.hunger <= 3) {
                checkSurroundings(this, "F", -1);
                this.hunger = this.hungerMax;
            } else if (this.thirst <= 2) {
                checkSurroundings(this, "W", -1);
                this.thirst = this.thirstMax;
            } else {
                this.direction = directions[Math.floor(Math.random() * directions.length)];
                this.steps = 3;
            }
        }
        let newYPos = this.yPos;
        let newXPos = this.xPos;
        if (this.direction === "N") {
            newYPos = this.yPos - 1;
        } else if (this.direction === "NE") {
            newYPos = this.yPos - 1;
            newXPos = this.xPos + 1;
        } else if (this.direction === "E") {
            newXPos = this.xPos + 1;
        } else if (this.direction === "SE") {
            newYPos = this.yPos + 1;
            newXPos = this.xPos + 1;
        } else if (this.direction === "S") {
            newYPos = this.yPos + 1;
        } else if (this.direction === "SW") {
            newYPos = this.yPos + 1;
            newXPos = this.xPos - 1;
        } else if (this.direction === "W") {
            newXPos = this.xPos - 1;
        } else if (this.direction === "NW") {
            newYPos = this.yPos - 1;
            newXPos = this.xPos - 1;
        }
        if (newYPos >= 0 && newYPos < 40 && newXPos >= 0 && newXPos < 40) {
            if (grid[newYPos][newXPos] === "") {
                document.getElementById(`${this.yPos},${this.xPos}`).classList.remove(this.gender);
                document.getElementById(`${newYPos},${newXPos}`).classList.add(this.gender);
                grid[newYPos][newXPos] = `C${this.id}`;
                grid[this.yPos][this.xPos] = "";
                this.xPos = newXPos;
                this.yPos = newYPos;
            }
            this.steps -= 1;
            if (this.hunger <= 0 || this.thirst <= 0) {
                document.getElementById(`${this.yPos},${this.xPos}`).classList.remove(this.gender);
                grid[this.yPos][this.xPos] = "";
                openIDs.push(this.id);
                delete creatures[`creature${this.id}`];
            }
        } else {this.steps = 0}
    }

    breed() {
        for (let i = this.yPos - 2; i <= this.yPos + 2; i++) {
            for (let j = this.xPos - 2; j <= this.xPos + 2; j++) {
                if (i < 0 || i >= 40 || j < 0 || j >= 40) {
                    continue;
                }

                if (this.gender === "male" && grid[i][j] !== `C${this.id}` && grid[i][j].at(0) === "C" && this.hunger > 3 && this.thirst > 2) {
                    if (document.getElementById(`${i},${j}`).classList.contains("female") && creatures[`creature${grid[i][j].slice(1)}`].breedTimeout <= 0) {
                        let otherID = grid[i][j].slice(1);
                        this.breedTimeout = 10;
                        creatures[`creature${otherID}`].breedTimeout = 10;
                        let spawnX;
                        let spawnY;
                        if (this.xPos + 1 < 40) {
                            spawnX = this.xPos + 1;
                        } else {
                            spawnX = this.xPos - 1;
                        }
                        if (this.yPos + 1 < 40) {
                            spawnY = this.yPos + 1;
                        } else {
                            spawnY = this.yPos - 1;
                        }

                        if (grid[spawnY][spawnX] === "") {
                            createCreature([Math.floor((this.hungerMax + creatures[`creature${otherID}`].hungerMax) / 2), Math.floor((this.thirstMax + creatures[`creature${otherID}`].thirstMax) / 2), spawnX, spawnY]);
                        }
                    }
                }
            }
        }
    }
}

function runSim() {
    if (move) clearInterval(move);

    move = setInterval(() => {
        let maleCount = 0;
        let femaleCount = 0;
        let hungerMaxSum = 0;
        let thirstMaxSum = 0;
        Object.keys(creatures).forEach((key) => {
            if (creatures[key]) {
                hungerMaxSum += creatures[key].hungerMax;
                thirstMaxSum += creatures[key].thirstMax;
                creatures[key].walk();
                if (creatures[key].gender === "male") {
                    maleCount++;
                    if (creatures[key].breedTimeout <= 0) {
                        creatures[key].breed();
                    }
                } else {
                    femaleCount++;
                }
            }
        })

        document.getElementById("creatureCount").innerHTML = Object.keys(creatures).length.toString();
        document.getElementById("genderRatio").innerHTML = `${maleCount}/${femaleCount}`;
        document.getElementById("avgHunger").innerHTML = (hungerMaxSum / Object.keys(creatures).length).toFixed(2);
        document.getElementById("avgThirst").innerHTML = (thirstMaxSum / Object.keys(creatures).length).toFixed(2);

        if (Object.keys(creatures).length > 50 && diseaseCells.length < 15) {
            for (let i = 0; i < (15 - diseaseCells.length); i++) {
                let diseaseYPos;
                let diseaseXPos;

                do {
                    diseaseYPos = Math.floor(Math.random() * 40);
                    diseaseXPos = Math.floor(Math.random() * 40);
                } while (grid[diseaseYPos][diseaseXPos] !== "");

                diseaseCells.push(new disease(i, diseaseXPos, diseaseYPos))
            }
        }
        if (diseaseCells.length > 0) {
            for (let i = 0; i < diseaseCells.length; ++i) {
                diseaseCells[i].spread()
            }
        }
    }, 1000/speed);
}

init()

runSim();