// player.js - Mapeamento exato para a folha de sprites 4x3 do John

const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagem.png"; // Caminho exato da nova imagem limpa

let playerSpriteData = {
    loaded: false,
    frameWidth: 0,
    frameHeight: 0,
    cols: 4, // 4 colunas horizontais
    rows: 3  // 3 linhas verticais
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    playerSpriteData.frameWidth = playerImg.width / playerSpriteData.cols;
    playerSpriteData.frameHeight = playerImg.height / playerSpriteData.rows;
    console.log(`Sprite 4x3 carregado! Frame: ${playerSpriteData.frameWidth}x${playerSpriteData.frameHeight}`);
};

// Fallback visual caso demore um instante
function drawPlayerFallback(ctx, player) {
    ctx.fillStyle = "#ffb703";
    ctx.beginPath(); ctx.arc(player.x, player.y - 16, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(player.x - 8, player.y - 12, 16, 20);
}

function drawPlayer(ctx, player) {
    if (!playerSpriteData.loaded) {
        drawPlayerFallback(ctx, player);
        return;
    }

    let col = 0;
    let row = 0;
    let flip = false;

    const animFrame = player.isMoving ? Math.floor(Date.now() / 150) : 0;

    switch (player.dir) {
        case 'down':
            row = 0;
            col = player.isMoving ? (animFrame % 4) : 0;
            break;
        case 'up':
            row = 1;
            col = player.isMoving ? (animFrame % 4) : 0;
            break;
        case 'left':
            row = 2;
            col = player.isMoving ? (animFrame % 2) : 0;
            break;
        case 'right':
            row = 2;
            col = player.isMoving ? (2 + (animFrame % 2)) : 3;
            break;
    }

    const srcX = col * playerSpriteData.frameWidth;
    const srcY = row * playerSpriteData.frameHeight;
    const spriteSize = 48;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
        playerImg,
        srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
        player.x - spriteSize / 2, player.y - 40, spriteSize, 56
    );
    ctx.restore();
}