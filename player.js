// player.js - Renderização e Animação do John para a Nova Folha de Sprites

const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagem1.png";

let playerSpriteData = {
    loaded: false,
    frameWidth: 0,
    frameHeight: 0,
    // A nova folha possui uma grade maior (ex: 6 colunas por 8 linhas no total da imagem)
    cols: 6,
    rows: 8
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    playerSpriteData.frameWidth = playerImg.width / playerSpriteData.cols;
    playerSpriteData.frameHeight = playerImg.height / playerSpriteData.rows;
    console.log(`Sprite carregado! Dimensões do frame: ${playerSpriteData.frameWidth} x ${playerSpriteData.frameHeight}`);
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

    // Mapeamento de linha (row) e coluna (col) baseada na direção e animação
    let col = 0;
    let row = 0;
    let flip = false; // Espelhamento para o lado esquerdo se necessário

    // Animação de passos alternando frames (0, 1, 2...) quando o player estiver andando
    let animFrame = 0;
    if (player.isMoving) {
        animFrame = Math.floor(Date.now() / 130) % 3; // Alterna a cada 130ms entre 3 frames
    }

    switch (player.dir) {
        case 'down':
            row = 0; // Linha superior (frente)
            col = animFrame; 
            break;
        case 'up':
            row = 1; // Linha de costas
            col = animFrame;
            break;
        case 'right':
            row = 2; // Linha lateral direita
            col = animFrame;
            break;
        case 'left':
            row = 2; // Usa a mesma linha lateral, mas espelhamos o desenho
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
        // Desenho normal (Frente, Costas, Direita) com o tamanho correto (48x64 pixels no canvas)
        ctx.drawImage(
            playerImg,
            srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
            player.x - 24, player.y - 32, 48, 64
        );
    }

    ctx.restore();
}