let grid = [];
for (let i = 0; i < 40; i++){
    grid.push([])
    for (let j = 0; j < 40; j++){
        grid[i].push("");
        const newItem = document.createElement("div");
        newItem.className = "cell";
        newItem.id = `${i}${j}`;
        document.getElementById("grid").appendChild(newItem);
    }
}

document.getElementById("2020").classList.add("creature");
grid[20][20] = "C"

setInterval()