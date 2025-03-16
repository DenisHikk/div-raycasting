const WORLD = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
    [1,6,6,1,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const WIDTH = 160;
const HEIGHT = 160;
const WORLD_WIDTH = WORLD[0].length;
const WORLD_HEIGHT = WORLD.length;

const colors = {
    DEFAULT: "#ffffff",
    WALL: "#a88c32",
    SKY: "#329ea8",
    FLOOR: "#262523",
    ENEMY: "#ff0000"
}

const player = {
    posX: 2, 
    posY: 2, 
    angle: 1,
    fov: 60,
    speed: {
        movement: 0.3,
        rotation: 5.0
    }
}

player.halfFov =  player.fov / 2;

const settings = {
    halfWidth: Math.floor(WIDTH / 2),
    halfHeight: Math.floor(HEIGHT / 2),
    incerementAngle: player.fov / WIDTH,
    precision: 64,
}

const root = document.getElementById("root");
const PIXELS = [];

// y x
for(let h = 0; h < HEIGHT; h++) {
    const row = document.createElement("div");
    PIXELS[h] = row;
    row.setAttribute("class", "row");
    for (let w = 0; w < WIDTH; w++) {
        const pixel = document.createElement("div");
        pixel.setAttribute("class", "pixel");
        pixel.setAttribute("cord", `${h} ${w}`);
        row.appendChild(pixel);
        PIXELS[h][w] = pixel;
    }
    root.appendChild(row);
}

function degreeToRadians(degree) {
    return degree * (Math.PI / 180);
}

function clearMap() {
    for(let x = 0; x < WIDTH; x++) {
        for(let y = 0; y < HEIGHT; y++) {            
            PIXELS[x][y].style.backgroundColor = colors.DEFAULT;
        }
    }
}

// start x y end WIDTH HEIGHT 
function drawLine(x0, y0, x1, y1, color) {
    let steep = false;

    if (Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
        steep = true;
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    const dx = x1 - x0;
    const dy = y1 - y0;
    const derror = Math.abs(dy) * 2;
    let error = 0;
    let y = y0;

    for (let x = x0; x <= x1; x++) {
        
        if (steep) {
            drawPoint(y, x, color);
        } else {
            drawPoint(x, y, color);
        }

        error += derror;
        if (error > dx) {
            y += (y1 > y0) ? 1 : -1;
            error -= dx * 2;
        }
    }
}

function drawPoint(x, y, color) {
    if(x < HEIGHT && x >= 0 && y < WIDTH && y >= 0) {
        PIXELS[Math.floor(x)][Math.floor(y)].style.backgroundColor = color;
    }
}

//my
function castRays() {
    let rayAngle = player.angle - player.halfFov;
    for(let rayCount = 0; rayCount < WIDTH; rayCount++) {
        let ray = {
            x: player.posX,
            y: player.posY
        }

        const enemy = {
            enemyDistance: null,
            enemyX: null,
            enemyY: null
        }

        const angleRadians = degreeToRadians(rayAngle);
        let rayCos = Math.cos(angleRadians) / settings.precision;
        let raySin = Math.sin(angleRadians) / settings.precision;

        let wall = 0;
        while(wall == 0) {
            ray.x += rayCos;
            ray.y += raySin;
            const mapX = Math.floor(ray.x);
            const mapY = Math.floor(ray.y);

            if (mapX >= 0 && mapX < WORLD_WIDTH && mapY >= 0 && mapY < WORLD_HEIGHT) {
                wall = WORLD[mapX][mapY];
            } else {
                wall = 1;
            }
        }
        let distance = Math.sqrt(Math.pow(player.posX - ray.x, 2) + Math.pow(player.posY - ray.y, 2));
        distance = distance * Math.cos(degreeToRadians(rayAngle - player.angle)); //fix fish eye
        let wallHeight = Math.floor(settings.halfHeight / distance);
        drawLine(0, rayCount, settings.halfHeight - wallHeight, rayCount, colors.SKY);
        drawLine(settings.halfHeight - wallHeight, rayCount, settings.halfHeight + wallHeight, rayCount, colors.WALL);
        drawLine(settings.halfHeight + wallHeight, rayCount, HEIGHT, rayCount, colors.FLOOR);
        rayAngle += settings.incerementAngle;


    } 
}

function drawRectangle(x, y, width, height, color) {
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            drawPoint(i, j, color); // Функция для отрисовки пикселя
        }
    }
}

function drawRect(x0, y0, x1, y1, color) {
    drawLine(x0, y0, x1, x0, color);
    drawLine(x0, y0, x0, y1, color);
    drawLine(x1, y0, x1, y1, color);
    drawLine(x0, y1, x1, y1, color);
}

function drawCirlce(xc, yc, x, y, color) {
    
    drawPoint(xc + x, yc + y, color);
    drawPoint(xc - x, yc + y, color);
    drawPoint(xc + x, yc - y, color);
    drawPoint(xc - x, yc - y, color);
    drawPoint(xc + y, yc + x, color);
    drawPoint(xc - y, yc + x, color);
    drawPoint(xc + y, yc - x, color);
    drawPoint(xc - y, yc - x, color);
}

function circleBres(xc, yc, r, color) {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    while(y >= x) {
        if(d > 0) {
            y--;
            d = d + 4 * (x + y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        x++;
        drawCirlce(xc, yc, x, y, color);
    }
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "a": // Поворот влево
            player.angle -= player.speed.rotation;
            if (player.angle < 0) player.angle += 360;
            break;
        case "d": // Поворот вправо
            player.angle += player.speed.rotation;
            if (player.angle >= 360) player.angle -= 360;
            break;
        case "w": // Движение вперед
            player.posX += Math.cos(degreeToRadians(player.angle)) * player.speed.movement;
            player.posY += Math.sin(degreeToRadians(player.angle)) * player.speed.movement;
            break;
        case "s": // Движение назад
            player.posX -= Math.cos(degreeToRadians(player.angle)) * player.speed.movement;
            player.posY -= Math.sin(degreeToRadians(player.angle)) * player.speed.movement;
            break;
    }

    clearMap();
    castRays();
});

function loop() {
    let t = 60;
    setInterval(() => {
        clearMap();
        castRays();
    }, 1000 / t)
} 


loop();