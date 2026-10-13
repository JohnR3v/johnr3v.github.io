// player.js - Gerenciamento Seguro do Sprite do John
const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagem.jpeg";

let playerSpriteData = {
    loaded: false,
    frameWidth: 0,
    frameHeight: 0
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    playerSpriteData.frameWidth = playerImg.width / 4; 
    playerSpriteData.frameHeight = playerImg.height / 3;
    console.log("Sprite do John carregado com sucesso!");
};

// Se falhar, avisa no console mas o jogo continua rodando normal com o boneco geométrico
playerImg.onerror = () => {
    console.warn("Aviso: Imagem não encontrada. Usando modo de fallback.");
};

function drawPlayer(ctx, player) {
    // Se a imagem não carregou, desenha o avatar em formas geométricas para o jogo nunca travar a tela
    if (!playerSpriteData.loaded) {
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(player.x, player.y - 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(player.x - 8, player.y - 12, 16, 20);
        return;
    }

    let row = 0; // Frente
    if (player.dir === 'up') row = 1;
    else if (player.dir === 'down') row = 2;
    else if (player.dir === 'left' || player.dir === 'right') row = 2;

    let col = 0;
    if (player.isMoving) {
        col = Math.floor(Date.now() / 150) % 3; 
    }

    let srcX = col * playerSpriteData.frameWidth;
    let srcY = row * playerSpriteData.frameHeight;

    ctx.drawImage(
        playerImg,
        srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
        player.x - 24, player.y - 32, 48, 64
    );
}