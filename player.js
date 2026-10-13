const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagem1.png";

let playerSpriteData = {
    loaded: false,
    frameWidth: 0,
    frameHeight: 0,
    cols: 5, // 5 colunas na imagem
    rows: 6  // 6 linhas na imagem
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    playerSpriteData.frameWidth = playerImg.width / playerSpriteData.cols;
    playerSpriteData.frameHeight = playerImg.height / playerSpriteData.rows;
    console.log(`Sprite 6x6 carregado com sucesso! Frame: ${playerSpriteData.frameWidth}x${playerSpriteData.frameHeight}`);
};

// Fallback visual caso demore
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

    // Animação de passos alternando entre os quadros da linha (de 0 a 5)
    let animFrame = 0;
    if (player.isMoving) {
        animFrame = Math.floor(Date.now() / 130) % 6; 
    }

    // Mapeamento exato das linhas da matriz 6x6 para cada direção:
    switch (player.dir) {
        case 'down':  
            row = 0; // Primeira linha (Frente)
            col = animFrame; 
            break;
        case 'up':    
            row = 1; // Segunda linha (Costas / Cima)
            col = animFrame; 
            break;
        case 'right': 
            row = 2; // Terceira linha (Lateral direita)
            col = animFrame; 
            break;
        case 'left':  
            row = 2; // Usa a linha lateral direita, mas espelhamos para a esquerda
            col = animFrame; 
            flip = true;
            break;
        default:
            row = 0;
            col = 0;
    }

    let srcX = col * playerSpriteData.frameWidth;
    let srcY = row * playerSpriteData.frameHeight;

    ctx.save();

    if (flip) {
        // Espelha o sprite horizontalmente para o movimento à esquerda
        ctx.translate(player.x + (playerSpriteData.frameWidth / 2), 0);
        ctx.scale(-1, 1);
        ctx.drawImage(
            playerImg,
            srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
            0, player.y - 32, 48, 64
        );
    } else {
        // Desenho padrão centralizado
        ctx.drawImage(
            playerImg,
            srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
            player.x - 24, player.y - 32, 48, 64
        );
    }

    ctx.restore();
}