// player.js - Mapeamento para a Folha Clássica 4x3 do John

const playerImg = new Image();
// Certifique-se de salvar o arquivo com este nome exato na pasta imagens:
playerImg.src = "imagens/JohnPersonagem.png"; 

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
    console.log(`Sprite 4x3 carregado com sucesso! Frame: ${playerSpriteData.frameWidth}x${playerSpriteData.frameHeight}`);
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

    // Animação de passos alternando entre os quadros da linha (0 a 3)
    let animFrame = 0;
    if (player.isMoving) {
        animFrame = Math.floor(Date.now() / 140) % 4; 
    }

    // Mapeamento limpo para a grade 4x3:
    switch (player.dir) {
        case 'down':  
            row = 0; // 1ª Linha: Frente
            col = animFrame; 
            break;
        case 'up':    
            row = 1; // 2ª Linha: Costas
            col = animFrame; 
            break;
        case 'right': 
            row = 2; // 3ª Linha: Lados
            col = animFrame; 
            break;
        case 'left':  
            row = 2; // 3ª Linha: Lados (Espelhado para a esquerda)
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