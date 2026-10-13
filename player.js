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

    // Animação de passos (alterna entre 0 e 3 para frente/costas, ou 0 e 1 para os lados)
    let animFrame = 0;
    if (player.isMoving) {
        animFrame = Math.floor(Date.now() / 140);
    }

switch (player.dir) {
        case 'down':  
            row = 0; 
            col = player.isMoving ? (animFrame % 4) : 0; // Posição padrão quando parado na frente
            break;
        case 'up':    
            row = 1; 
            col = player.isMoving ? (animFrame % 4) : 0; // Posição padrão quando parado nas costas
            break;
        case 'left':  
            row = 2; 
            // Se estiver a andar, alterna entre 0 e 1. Se estiver parado, trava na coluna 1 (ou 0)
            col = player.isMoving ? (animFrame % 2) : 1; 
            break;
        case 'right': 
            row = 2; 
            // Se estiver a andar, alterna entre 2 e 3. Se estiver parado, trava exatamente na coluna 3 (a 4ª posição)
            col = player.isMoving ? (2 + (animFrame % 2)) : 3; 
            break;
    }

    let srcX = col * playerSpriteData.frameWidth;
    let srcY = row * playerSpriteData.frameHeight;

    ctx.save();

    // Desenho padrão centralizado (tamanho 48x64 no canvas)
    ctx.drawImage(
        playerImg,
        srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
        player.x - 24, player.y - 32, 48, 64
    );

    ctx.restore();
}