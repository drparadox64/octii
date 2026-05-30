/*
<=== NED'S HUNT ===>
BY DRPARADOX64, BRINGER OF DOOM!
*/
// Constants & canvas setup

const PATH = "/"
import {
    TILE_SIZE,
    MAP_SIZE,
    TILE_SPACING,
    VIEWPORT_SIZE,
    DIR_RUNS,
    ASSET_NAMES,
    CHECK_ORDER_GLIDER,
    ENTITY_INFO,
    CHECK_ORDER_FIREBALL,
    REVERSE_DIRECTIONS,
    MONSTER_BLOCK_TILES,
    PLAYER_BLOCK_TILES,
    KEYS,
    KEY_NAMES,
    POWERUPS,
    POWERUP_NAMES
} from "https://cdn.jsdelivr.net/gh/drparadox64/octii@master/data.js"
import { tmx2map, mapmeta } from "/https://cdn.jsdelivr.net/gh/drparadox64/octii@master/tmx2map.js";

const GameCanvas = document.getElementById("gamecanvas");
const ctx = GameCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let ASSETS = []
// Viewport & Level
let gameover = false;
let plrkeys = [];
let plrpwps = [];
let chips = 9;
let gamestep = 0;
let vpx = 0;
let vpy = 0;
let layer1 = [];
let layer2 = [];
let entities = [];
let meta;
// Basic entity class
class Entity {
    constructor(type, x, y, dir, graphic) {
        this.type = type,
        this.x = x,
        this.y = y,
        this.dir = dir,
        this.graphic = graphic
    }
}

function pushHint(hinttext) {
    document.getElementById("help").innerHTML = hinttext;
}
function compileAssets() {
    ASSET_NAMES.forEach(element => {
        let img = new Image();
        img.src = PATH + element;
        ASSETS.push(img);
    });
}
function entityExistsAt(x, y) {
    return entities.some(e => e.x === x && e.y === y);
}
function entityTypeAt(x, y) {
    return entities.find(e => e.x === x && e.y === y);
}
function generateLevel() {
    for (let y = 0; y < MAP_SIZE; y++) {
        let row = [];
        for (let x = 0; x < MAP_SIZE; x++) {
            let tile = 0;
            let ALLOWED_TILES = [
                1, 5, 6, 7
            ]
            tile = ALLOWED_TILES[Math.floor(Math.random()*ALLOWED_TILES.length)];
            row.push(tile);
        }
        layer1.push(row);
    }
    for (let y = 0; y < MAP_SIZE; y++) {
        let row = [];
        for (let x = 0; x < MAP_SIZE; x++) {
            let tile = 0;
            row.push(tile);
        }
        layer2.push(row);
    }
}


function drawGameOver() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.65";
    ctx.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
}
// Draw function, looks like dogsh*t just as always
function draw() {
    ctx.clearRect(0, 0, GameCanvas.width, GameCanvas.height);
    for (let i = vpy; i<vpy+VIEWPORT_SIZE; i++) {
        for (let j = vpx; j<vpx+VIEWPORT_SIZE; j++) {
            let tx = (j-vpx)*(TILE_SIZE+TILE_SPACING);
            let ty = (i-vpy)*(TILE_SIZE+TILE_SPACING);
            let tile = layer1[i][j];
            let img = ASSETS[layer1[i][j]];
            if (img) {
                ctx.drawImage(
                    img,
                    tx,
                    ty,
                    TILE_SIZE,
                    TILE_SIZE
                );
            }
            
            // Draw top layer
            if (player.x === j && player.y === i) {
                img = ASSETS[2];
                let bob = Math.sin(performance.now()*0.0025)*2.5;
                ctx.drawImage(
                    img,
                    tx,
                    ty+bob,
                    TILE_SIZE,
                    TILE_SIZE
                );
            }
            entities.forEach(element => {
                if (element.x == j && element.y == i) {
                    if (ENTITY_INFO[element.type].rotate) {
                        ctx.save();
                        ctx.translate(
                            tx+TILE_SIZE/2,
                            ty+TILE_SIZE/2
                        )
                        ctx.rotate((element.dir*90)*Math.PI/180);
                        ctx.drawImage(
                            ASSETS[element.graphic],
                            -TILE_SIZE/2,
                            -TILE_SIZE/2,
                            TILE_SIZE,
                            TILE_SIZE
                        );
                        ctx.restore();
                    } else {
                        ctx.drawImage(
                            ASSETS[element.graphic],
                            tx,
                            ty,
                            TILE_SIZE,
                            TILE_SIZE
                        );
                    }

                }
            });   
        }
    }
}
let moveintent = null;
document.onkeydown = function(k) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k.code)) {
        k.preventDefault();
    }
    if (k.code == "ArrowLeft") {
        moveintent = 3;
    }
    if (k.code == "ArrowRight") {
        moveintent = 1;
    }
    if (k.code == "ArrowUp") {
        moveintent = 0;
    }
    if (k.code == "ArrowDown") {
        moveintent = 2;
    }
    player.dir = moveintent;
}
function doPlayerMove(intent) {
    let dx = player.x;
    let dy = player.y;
    if (intent==null) return;
    player.x = player.x + DIR_RUNS[intent].x;
    player.y = player.y + DIR_RUNS[intent].y;
    if (!playerStep(player.x, player.y)) {
        player.x = dx;
        player.y = dy;
    }
    center_on(player.x, player.y);
    plrClamp();   
    moveintent = null;
}
function isValid(x, y) {
    return (
        x >=0 &&
        y >=0 &&
        x < MAP_SIZE &&
        y < MAP_SIZE &&
        !MONSTER_BLOCK_TILES.includes(layer1[y][x])
    );
}
let gameloop = 0;
function createEntity(x, y, dir, type) {
    let ne = new Entity(type, x, y, dir, type)
    entities.push(ne);
}


function center_on(x, y) {
    vpx = x - Math.floor(VIEWPORT_SIZE / 2);
    vpy = y - Math.floor(VIEWPORT_SIZE / 2);
    if (vpx < 0) vpx = 0;
    if (vpy < 0) vpy = 0;
    if (vpx > MAP_SIZE - VIEWPORT_SIZE) {
        vpx = MAP_SIZE - VIEWPORT_SIZE;
    }
    if (vpy > MAP_SIZE - VIEWPORT_SIZE) {
        vpy = MAP_SIZE - VIEWPORT_SIZE;
    }
}
function plrClamp() {
    if (player.x > MAP_SIZE) player.x = MAP_SIZE-1;
    if (player.y > MAP_SIZE) player.y = MAP_SIZE-1;
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
}

function entityStep(e, nd, allowentities=false) {
    let nx = e.x + DIR_RUNS[nd].x;
    let ny = e.y + DIR_RUNS[nd].y;
    if (!isValid(nx, ny)) {
        return false;
    }
    if (!allowentities && entityExistsAt(nx, ny)) {
        return false;
    }

    e.dir = nd;
    e.x = nx;
    e.y = ny;

    if (layer1[ny][nx] == 5) {
        toggleWalls();
    }
    if (layer1[ny][nx] == 26) {
        entities.splice(entities.indexOf(e), 1);
        layer1[e.y][e.x] = 0;
    }
    return true;
}

function ballTic(e) {
    if(layer1[ny][nx] == 1) {
        e.dir = REVERSE_DIRECTIONS[e.dir];
        nx = e.x + DIR_RUNS[e.dir].x;
        ny = e.y + DIR_RUNS[e.dir].y;
    }
    if(isValid(nx, ny)) {
        e.x = nx;
        e.y = ny;
    }
}
function gliderTic(e) {
    for (let t = 0; t < CHECK_ORDER_GLIDER.length; t++) {
        let nd = (e.dir+CHECK_ORDER_GLIDER[t])%4;
        if(entityStep(e, nd)) {
            break;
        }
    }
}
function slimeTic(e) {
    if(gamestep%2==0) return;
    let newdir = Math.floor(Math.random()*4);
    entityStep(e, newdir);
}
function fireballTic(e) {
    for (let t = 0; t < CHECK_ORDER_FIREBALL.length; t++) {
        let nd = (e.dir+CHECK_ORDER_FIREBALL[t])%4;
        let nx = e.x + DIR_RUNS[nd].x;
        let ny = e.y + DIR_RUNS[nd].y;
        if(isValid(nx, ny) && !entityExistsAt(nx, ny)) {
            e.dir = nd;
            e.x = nx;
            e.y = ny;
            break;
        }
    }
}

function toggleWalls() {
    for (let i = 0; i < layer1.length; i++) {
        for (let j = 0; j < layer1[i].length; j++) {
            if (layer1[i][j] == 6) {
                layer1[i][j] = 7;
            } else if (layer1[i][j] == 7) {
                layer1[i][j] = 6;
            }
        }
    }
}

function boxTic(e) {
    if (!entityStep(e, player.dir)) {
        return false;
    }
    if (layer1[e.y][e.x] == 12) {
        entities.splice(entities.indexOf(e), 1);
        layer1[e.y][e.x] = 13;
    }
    return true;
}

function ticEntities(e) {
    for(let i = 0; i < entities.length; i++) {
        let e = entities[i];

        if (e.type==3) {
            gliderTic(e);
        }
        if (e.type==4) {
            fireballTic(e);
        }
        if (e.type==8) {
            slimeTic(e);
        }
        if (e.type==9) {
            ballTic(e);
        }
    }
}

function playerStep(x, y) {
    let step = layer1[y][x];
    let ent = entityTypeAt(x, y);
    if (PLAYER_BLOCK_TILES.includes(step)) {
        if (step > 17 && step < 22) {
            if (plrkeys.includes(KEY_NAMES[step-18])) {
                if (KEY_NAMES[step-18] != "gk") {
                    plrkeys.splice(plrkeys.indexOf(KEY_NAMES[step-18], 1))
                    document.getElementById(KEY_NAMES[step-18]).className = "invisible";
                }
                layer1[y][x] = 0;
                return true;
            }
        }
        if (step == 23) {
            if (chips == 0) {
                layer1[y][x] = 0;
                return true;
            }
        }
        return false;
    }
    if (ent) {
        if (entityTypeAt(x, y).type == 11) {
            if (!boxTic(ent)) {
                return false;
            }
            
        } else {
            return false;
        }
    }
    if (step==5) {
        toggleWalls();
    }
    if (step==10) {
        chips--;
        document.getElementById("chips").innerHTML = "Chips: " + chips;
        if (chips==0) {
            document.getElementById("chips").style = "color: #FFFF00;";
        }
        
        layer1[y][x] = 0;
    }
    if (step==13) {
        layer1[y][x] = 0;
    }
    if (step > 13 && step < 18) {
        document.getElementById(KEY_NAMES[step-14]).className = "visible";
        plrkeys.push(KEY_NAMES[step-14]);
        layer1[y][x] = 0;
    }
    if (step == 22) {
        console.log("You Win!");
    }
    pushHint("");
    if (step == 24) {
        pushHint(meta.mapHelp);
    }
    if (step == 25) {
        layer1[y][x] = 1;
    }

    if (step == 12) {
        if (!plrpwps.includes("ws")) {
            gameover = true;
        }
        
    }
    if (step == 26) {
        gameover = true;
    }
    if (step > 26 && step < 31) {
        document.getElementById(POWERUP_NAMES[step-27]).className = "visible";
        plrpwps.push(POWERUP_NAMES[step-27]);
        layer1[y][x] = 0;
    }
    return true;
}
let lasttick = performance.now();
function gameLoop() {
    draw();
    let now = performance.now();
    if (gameover) {
        drawGameOver();
        return;
    }
    if (now-lasttick >= 100) {
        lasttick = now;
        gamestep++;
        ticEntities();
        doPlayerMove(moveintent)
        
        
    }
    
}
async function loadMap(gamemapname) {
    gameover = false;
    plrkeys = [];
    plrpwps = [];
    gamestep = 0;
    layer1 = [];
    entities = [];
    meta = await mapmeta(gamemapname);
    layer1 = await tmx2map(gamemapname);
    for (let i = 0; i < layer1.length; i++) {
        for (let j = 0; j < layer1.length; j++) {
            if (ENTITY_INFO[layer1[i][j]]) {
                if (layer1[i][j] != 2) {
                    createEntity(j, i, 0, layer1[i][j]);
                } else {
                    player.x = j;
                    player.y = i;
                }
                center_on(player.x, player.y);
                layer1[i][j] = 0;
            }
        }
    }
    chips = meta.mapChips;
    document.getElementById("chips").innerHTML = "Chips: " + chips;
    document.title = meta.mapName + " | Octii";
    document.getElementById("name").innerHTML = meta.mapName;
}
let player = new Entity(2, 1, 1, 0, 2);
async function init() {
    compileAssets();
    await loadMap("octii_basics/lesson1")
    for (let i = 0; i < KEYS.length; i++) {
        let kdelement = document.createElement("img");
        kdelement.className = "invisible";
        kdelement.id = KEY_NAMES[i];
        kdelement.src = KEYS[i];
        document.getElementById("keydisp").appendChild(kdelement);
    }
    for (let i = 0; i < POWERUPS.length; i++) {
        let kdelement = document.createElement("img");
        kdelement.className = "invisible";
        kdelement.id = POWERUP_NAMES[i];
        kdelement.src = POWERUPS[i];
        document.getElementById("keydisp").appendChild(kdelement);
    }

}

init();
setInterval(gameLoop, 1000/60);