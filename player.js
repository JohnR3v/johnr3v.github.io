// player.js - Gerenciamento do Sprite e Animação do John

const playerImg = new Image();
// Ajuste o caminho conforme o nome exato do arquivo que salvou na pasta Imagens
playerImg.src = "Imagens/johnPersonagem.jpeg"; 

let playerSpriteData = {
    loaded: false,
    // Como a folha tem uma grade (ex: 4 colunas x 3 linhas de sprites principais)
    // Vamos definir o tamanho estimado de cada sprite individual dentro da folha
    frameWidth: 0,
    frameHeight: 0
};

playerImg.onload = () => {
    playerSpriteData.loaded = true;
    // Calcula o tamanho de cada sprite dividindo a largura/altura total da imagem pelas colunas/linhas
    playerSpriteData.frameWidth = playerImg.width / 4; 
    playerSpriteData.frameHeight = playerImg.height / 3;
    console.log("Sprite do John carregado com sucesso!");
};

// Função para desenhar o John no Canvas
function drawPlayer(ctx, player) {
    if (!playerSpriteData.loaded) {
        // Fallback visual (desenha o retângulo antigo caso a imagem ainda esteja carregando)
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(player.x, player.y - 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(player.x - 8, player.y - 12, 16, 20);
        return;
    }

    // Mapeamento das linhas do Spritesheet de acordo com a direção
    // Linha 0: Frente, Linha 1: Costas, Linha 2: Lados (exemplo padrão de grid)
    let row = 0;
    if (player.dir === 'up') row = 1;
    else if (player.dir === 'left' || player.dir === 'right') row = 2;
    else row = 0; // 'down'

    let col = 0; // Coluna padrão (frame parado ou animação básica)
    
    // Se estiver em movimento, podemos alternar frames levemente (simulação de animação)
    if (player.isMoving) {
        col = Math.floor(Date.now / 150) % 3; // Alterna entre 3 frames de movimento
    }

    let srcX = col * playerSpriteData.frameWidth;
    let srcY = row * playerSpriteData.frameHeight;

    // Se estiver virado para a esquerda, poderíamos inverter, mas por ora desenhamos normal
    ctx.drawImage(
        playerImg,
        srcX, srcY, playerSpriteData.frameWidth, playerSpriteData.frameHeight,
        player.x - 24, player.y - 32, 48, 64 // Posição e tamanho renderizados no canvas do jogo
    );
}