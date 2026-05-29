// CONSTANTS

export const TILE_SIZE = 64;
export const MAP_SIZE = 32;
export const VIEWPORT_SIZE = 9;
export const TILE_SPACING = 0;
export const DIR_RUNS = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
]
export const ASSET_NAMES = [
    "gr/floor01.svg",
    "gr/wall01.svg",
    "gr/player.svg",
    "gr/glider.svg",
    "gr/fireball.png",
    "gr/grbutton.svg",
    "gr/grwall0.svg",
    "gr/grwall1.svg",
    "gr/slime.svg",
    "gr/ball.svg",
    "gr/chip.svg",
    "gr/box.svg",
    "gr/water.svg",
    "gr/dirt.svg",
    "gr/keys/rkey.svg",
    "gr/keys/gkey.svg",
    "gr/keys/bkey.svg",
    "gr/keys/ykey.svg",
    "gr/gates/rgate.svg",
    "gr/gates/ggate.svg",
    "gr/gates/bgate.svg",
    "gr/gates/ygate.svg",
    "gr/exit.svg",
    "gr/socket.svg",
    "gr/help.svg",
    "gr/popupw.svg",
    "gr/bomb.svg",
    "gr/powerups/firesh.svg",
    "gr/powerups/watersh.svg",
    "gr/powerups/forcesh.svg",
    "gr/powerups/icesh.svg",
    "gr/gravel.svg"
]
export const MONSTER_BLOCK_TILES = [
    1,
    13,
    31
]
export const PLAYER_BLOCK_TILES = [
    1,
    6,
    18,
    19,
    20,
    21,
    23
]
export const KEYS = [
    "gr/keys/rkey.svg",
    "gr/keys/gkey.svg",
    "gr/keys/bkey.svg",
    "gr/keys/ykey.svg"
]
export const POWERUPS = [
    "gr/powerups/firesh.svg",
    "gr/powerups/watersh.svg",
    "gr/powerups/forcesh.svg",
    "gr/powerups/icesh.svg"
]
export const POWERUP_NAMES = [
    "fs",
    "ws",
    "os",
    "is"
]
export const KEY_NAMES = [
    "yk",
    "gk",
    "bk",
    "rk"
]
export const CHECK_ORDER_GLIDER = [
    0,
    3,
    1,
    2
]
export const CHECK_ORDER_FIREBALL = [
    0,
    1,
    3,
    2
]
export const REVERSE_DIRECTIONS = [2,3,0,1];
export const ENTITY_INFO = {
    2: {
        rotate: false,
        name: "player"
    },
    3: {
        rotate: true,
        name: "glider"
    },
    4: {
        rotate: false,
        name: "fireball"
    },
    8: {
        rotate: false,
        name: "slime"
    },
    9: {
        rotate: false,
        name: "ball"
    },
    11: {
        rotate: false,
        name: "box"
    }
}