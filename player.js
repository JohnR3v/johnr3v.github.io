// player.js - Mapeamento Ajustado para a Matriz 5x6 do John

const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagemS.png";

let playerSpriteData = {
    loaded: false,
    frameWidth: 0,
    frameHeight: 0,
    cols: 5, // 5 colunas horizontais na imagem
    rows: 6  // 6 linhas verticais na imagem
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    playerSpriteData.frameWidth = playerImg.width / playerSpriteData.cols;
    playerSpriteData.frameHeight = playerImg.height / playerSpriteData.rows;
    console.log(`Sprite 5x6 carregado com sucesso! Frame: ${playerSpriteData.frameWidth}x${playerSpriteData.frameHeight}`);
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

    // Animação de passos alternando entre os quadros da linha (máximo de 5 colunas)
    let animFrame = 0;
    if (player.isMoving) {
        animFrame = Math.floor(Date.now() / 130) % 5; 
    }

    // Mapeamento correto das linhas para cada direção:
    switch (player.dir) {
        case 'down':  
            row = 0; // 1ª linha (Frente)
            col = animFrame; 
            break;
        case 'up':    
            row = 1; // 2ª linha (Costas / Cima)
            col = animFrame; 
            break;
        case 'right': 
            row = 2; // 3ª linha (Lateral direita)
            col = animFrame; 
            break;
        case 'left':  
            row = 2; // Usa a linha lateral direita e espelha para a esquerda
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
        // Espelha horizontalmente para o movimento à esquerda
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