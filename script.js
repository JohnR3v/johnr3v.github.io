const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensões do Mundo Real (maior que a tela de 800x600)
const worldWidth = 1600;
const worldHeight = 1200;

// Estado do Jogador (John) - Começa no centro do mundo
let player = {
    x: 800,
    y: 600,
    size: 24,
    speed: 4,
    dir: 'down',
    isMoving: false
};

// Objeto da Câmera (Segue o jogador)
let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Cenas: 'outdoor' ou 'indoor_desafios'
let currentScene = 'outdoor';


// Desafios Hacker
const challenges = [
    {
        title: "Terminal 1: SQL Injection",
        question: "Qual payload clássico de SQLi costuma testar bypass de autenticação?",
        options: ["a) ' OR '1'='1", "b) <script>alert(1)</script>", "c) cat /etc/passwd"],
        correct: 0
    },
    {
        title: "Terminal 2: Análise de Logs",
        question: "Um pico súbito de pacotes SYN sem conclusão de handshake indica qual ataque?",
        options: ["a) Brute Force", "b) SYN Flood (DDoS)", "c) SQL Injection"],
        correct: 1
    },
    {
        title: "Terminal 3: MITRE ATT&CK",
        question: "Em qual tática do MITRE ATT&CK o invasor busca extrair dados confidenciais?",
        options: ["a) Exfiltration", "b) Initial Access", "c) Execution"],
        correct: 0
    },
    {
        title: "Terminal 4: Criptografia",
        question: "Qual algoritmo de hash de senha é considerado obsoleto devido a vulnerabilidades e colisões?",
        options: ["a) bcrypt", "b) Argon2", "c) MD5"],
        correct: 2
    }
];

let activeChallengeIndex = null;

// Ouvintes de Teclado
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "e" || e.key === "E" || e.key === " ") {
        checkInteraction();
    }
    if (e.key === "Escape") {
        closeChallenge();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Ouvintes Touch (Mobile D-Pad)
function setupTouchButton(id, keyName) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); touchInput[keyName] = true; if(keyName === 'action') checkInteraction(); }, {passive: false});
    btn.addEventListener("touchend", (e) => { e.preventDefault(); touchInput[keyName] = false; }, {passive: false});
    btn.addEventListener("mousedown", () => { touchInput[keyName] = true; if(keyName === 'action') checkInteraction(); });
    btn.addEventListener("mouseup", () => { touchInput[keyName] = false; });
}

setupTouchButton("btn-up", "up");
setupTouchButton("btn-down", "down");
setupTouchButton("btn-left", "left");
setupTouchButton("btn-right", "right");
setupTouchButton("btn-action", "action");

function update() {
    let dx = 0;
    let dy = 0;
    player.isMoving = false;

    if (keys["arrowup"] || keys["w"] || touchInput.up) { dy = -player.speed; player.dir = 'up'; player.isMoving = true; }
    if (keys["arrowdown"] || keys["s"] || touchInput.down) { dy = player.speed; player.dir = 'down'; player.isMoving = true; }
    if (keys["arrowleft"] || keys["a"] || touchInput.left) { dx = -player.speed; player.dir = 'left'; player.isMoving = true; }
    if (keys["arrowright"] || keys["d"] || touchInput.right) { dx = player.speed; player.dir = 'right'; player.isMoving = true; }

    player.x += dx;
    player.y += dy;

    // Limites de Movimentação no Mundo
    if (currentScene === 'outdoor') {
        player.x = Math.max(40, Math.min(worldWidth - 40, player.x));
        player.y = Math.max(40, Math.min(worldHeight - 40, player.y));

        // Checar entrada na casa "Desafios" (Posicionada em X: 900-1050, Y: 500-600)
        if (player.x > 900 && player.x < 1050 && player.y > 500 && player.y < 600) {
            currentScene = 'indoor_desafios';
            player.x = 400; // Posição interna da porta
            player.y = 500;
            document.getElementById("location-text").innerText = "Local: Casa - Desafios";
            document.getElementById("objective-text").innerText = "Objetivo: Acesse os terminais de hacking";
        }
    } 
    else if (currentScene === 'indoor_desafios') {
        // Dentro da casa, mantemos o tamanho padrão da tela (800x600) sem rolagem excessiva
        player.x = Math.max(80, Math.min(canvas.width - 100, player.x));
        player.y = Math.max(120, Math.min(canvas.height - 60, player.y));

        // Checar saída na porta inferior
        if (player.x > 360 && player.x < 440 && player.y >= 530) {
            currentScene = 'outdoor';
            player.x = 970; // Retorna na frente da casa externa
            player.y = 620;
            document.getElementById("location-text").innerText = "Local: Campo Externo";
            document.getElementById("objective-text").innerText = "Objetivo: Explore o mapa e encontre a Casa de Desafios";
        }
    }

    // Atualiza a Câmera para centralizar no Jogador (Apenas no mundo externo)
    if (currentScene === 'outdoor') {
        camera.x = player.x - camera.width / 2;
        camera.y = player.y - camera.height / 2;

        // Trava a câmera nos limites do mundo
        camera.x = Math.max(0, Math.min(worldWidth - camera.width, camera.x));
        camera.y = Math.max(0, Math.min(worldHeight - camera.height, camera.y));
    } else {
        camera.x = 0;
        camera.y = 0;
    }
}

function checkInteraction() {
    if (currentScene === 'indoor_desafios') {
        const terminals = [
            { x: 140, index: 0 },
            { x: 260, index: 1 },
            { x: 380, index: 2 },
            { x: 500, index: 3 }
        ];

        for (let term of terminals) {
            if (Math.abs(player.x - term.x) < 40 && player.y < 220) {
                openChallenge(term.index);
                break;
            }
        }
    }
}

function openChallenge(index) {
    activeChallengeIndex = index;
    const chal = challenges[index];
    document.getElementById("modal-title").innerText = chal.title;
    document.getElementById("modal-question").innerText = chal.question;
    
    const optionsDiv = document.getElementById("modal-options");
    optionsDiv.innerHTML = "";
    
    chal.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => answerChallenge(idx);
        optionsDiv.appendChild(btn);
    });

    document.getElementById("challenge-modal").classList.remove("hidden");
}

function answerChallenge(selectedIdx) {
    const chal = challenges[activeChallengeIndex];
    if (selectedIdx === chal.correct) {
        alert("Acesso Concedido! Resposta Correta 🛡️");
        closeChallenge();
    } else {
        alert("Acesso Negado! Tente novamente ❌");
    }
}

function closeChallenge() {
    document.getElementById("challenge-modal").classList.add("hidden");
    activeChallengeIndex = null;
}

// Renderização Gráfica com Suporte à Câmera
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Aplica o deslocamento da câmera no mundo externo
    if (currentScene === 'outdoor') {
        ctx.translate(-camera.x, -camera.y);
    }

    if (currentScene === 'outdoor') {
        renderOutdoor();
    } else if (currentScene === 'indoor_desafios') {
        renderIndoorDesafios();
    }

    renderPlayer();
    ctx.restore();
}

function renderOutdoor() {
    // Fundo do Mundo Amplo
    ctx.fillStyle = "#050b14";
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    // Grade cibernética no mundo todo
    ctx.strokeStyle = "rgba(0, 255, 204, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < worldWidth; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, worldHeight); ctx.stroke();
    }
    for (let y = 0; y < worldHeight; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(worldWidth, y); ctx.stroke();
    }

    // Ruas / Trilhas no Mundo
    ctx.fillStyle = "#0d1b2a";
    ctx.fillRect(750, 0, 150, worldHeight); // Estrada vertical central

    // Casa "Desafios" (Posicionada no mundo em X: 900, Y: 450)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(900, 450, 260, 180);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 3;
    ctx.strokeRect(900, 450, 260, 180);

    // Porta da Casa
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(990, 570, 70, 60);
    ctx.strokeStyle = "#ff007f";
    ctx.lineWidth = 2;
    ctx.strokeRect(990, 570, 70, 60);

    // Letreiro da Casa
    ctx.fillStyle = "rgba(0, 255, 204, 0.15)";
    ctx.fillRect(920, 470, 220, 35);
    ctx.strokeStyle = "#00ffcc";
    ctx.strokeRect(920, 470, 220, 35);

    ctx.fillStyle = "#00ffcc";
    ctx.font = "bold 15px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("⚡ CASA DE DESAFIOS ⚡", 1030, 493);
    ctx.textAlign = "left";
}

function renderIndoorDesafios() {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Painel de Servidores na Parede Superior
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(60, 50, 680, 110);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 50, 680, 110);

    // 4 Terminais Hacking
    const termX = [140, 260, 380, 500];
    const termNames = ["SQLi", "LOGS", "MITRE", "CRYPTO"];
    
    termX.forEach((x, i) => {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x - 30, 80, 60, 55);
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - 30, 80, 60, 55);

        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(x - 22, 88, 44, 28);

        ctx.fillStyle = "#030712";
        ctx.font = "bold 10px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText(termNames[i], x, 106);
        ctx.textAlign = "left";
    });

    // Porta de saída inferior
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(350, 530, 100, 30);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(350, 530, 100, 30);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("◄ SAÍDA [EXIT] ►", 400, 550);
    ctx.textAlign = "left";
}

function renderPlayer() {
    // Chama o renderizador do sprite do John (definido no player.js)
    if (typeof drawPlayer === 'function') {
        drawPlayer(ctx, player);
    }
}

// Loop Principal do Jogo
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();