// player.js - Gerenciamento e Animação Limpa do John

const playerImg = new Image();
playerImg.src = "imagens/JohnPersonagem1.png"; // Certifique-se de usar a imagem LIMPA

let playerSpriteData = {
    loaded: false,
    // A nova folha limpa tem 2 colunas e 3 linhas principais
    frameWidth: 0,
    frameHeight: 0
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    // Define o tamanho de corte exato baseado na grade 2x3
    playerSpriteData.frameWidth = playerImg.width / 2;
    playerSpriteData.frameHeight = playerImg.height / 3;
    console.log("Sprite do John (Limpo) carregado. Grade: 2x3.");
};

// Fallback visual para garantir renderização caso a imagem demore
function drawPlayerFallback(ctx, player) {
    ctx.fillStyle = "#ffb703"; // Cabelo
    ctx.beginPath(); ctx.arc(player.x, player.y - 16, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#00ffcc"; // Hoodie
    ctx.fillRect(player.x - 8, player.y - 12, 16, 20);
}

// Função de renderização principal do John
function drawPlayer(ctx, player) {
    if (!playerSpriteData.loaded) {
        drawPlayerFallback(ctx, player);
        return;
    }

    // Mapeamento de direção para Linha (Row) e Coluna (Col) na grade
    let row = 0;
    let col = 0;
    let flipLeft = false; // Controle de espelhamento para olhar para a esquerda

    switch (player.dir) {
        case 'down':  row = 0; col = 0; break; // Frente (Frente/Down)
        case 'up':    row = 0; col = 1; break; // Costas (Costas/Up)
        case 'right': row = 1; col = 0; break; // Direita (Estático/Right)
        case 'left':  row = 1; col = 0; flipLeft = true; break; // Esquerda (Espelha o sprite Right)
        default:      row = 0; col = 0; // Padrão
    }

    // Calcula as coordenadas de corte na folha limpa
    let srcX = col * playerSpriteData.frameWidth;
    let srcY = row * playerSpriteData.frameHeight;

    ctx.save(); // Salva o estado do contexto

    // Se estiver olhando para a esquerda, espelhamos o contexto horizontalmente
    if (flipLeft) {
        ctx.translate(player.x + (playerSpriteData.frameWidth / 2) - 24, 0); // Ajuste fino de posição
        ctx.scale(-1, 1); // Espelha
        
        // Desenha o sprite espelhado
        ctx.drawImage(
            playerImg,
            srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
            0, player.y - 32, 48, 64 // Posição 0 relativa ao translate
        );
    } else {
        // Desenha o sprite normalmente (Frente, Costas, Direita)
        ctx.drawImage(
            playerImg,
            srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
            player.x - 24, player.y - 32, 48, 64 // Centraliza e define tamanho no canvas
        );
    }

    ctx.restore(); // Restaura o estado original (remove espelhamento)
}