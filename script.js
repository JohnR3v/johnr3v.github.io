const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado do Jogador (John)
let player = {
    x: 100,
    y: 300,
    size: 24,
    speed: 3.5,
    dir: 'down'
};

// Cenas: 'outdoor' ou 'indoor_desafios'
let currentScene = 'outdoor';

// Controles
let keys = {};
let touchInput = { up: false, down: false, left: false, right: false, action: false };

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
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); touchInput[keyName] = true; if(keyName === 'action') checkInteraction(); });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); touchInput[keyName] = false; });
    btn.addEventListener("mousedown", () => { touchInput[keyName] = true; if(keyName === 'action') checkInteraction(); });
    btn.addEventListener("mouseup", () => { touchInput[keyName] = false; });
}

setupTouchButton("btn-up", "up");
setupTouchButton("btn-down", "down");
setupTouchButton("btn-left", "left");
setupTouchButton("btn-right", "right");
setupTouchButton("btn-action", "action");

function update() {
    // Movimentação
    let dx = 0;
    let dy = 0;

    if (keys["arrowup"] || keys["w"] || touchInput.up) { dy = -player.speed; player.dir = 'up'; }
    if (keys["arrowdown"] || keys["s"] || touchInput.down) { dy = player.speed; player.dir = 'down'; }
    if (keys["arrowleft"] || keys["a"] || touchInput.left) { dx = -player.speed; player.dir = 'left'; }
    if (keys["arrowright"] || keys["d"] || touchInput.right) { dx = player.speed; player.dir = 'right'; }

    player.x += dx;
    player.y += dy;

    // Limites e Transições de Cenas
    if (currentScene === 'outdoor') {
        // Limites da tela externa
        player.x = Math.max(20, Math.min(canvas.width - 40, player.x));
        player.y = Math.max(60, Math.min(canvas.height - 40, player.y));

        // Checar entrada na casa "Desafios" (X: 520-620, Y: 320-380)
        if (player.x > 520 && player.x < 620 && player.y > 320 && player.y < 380) {
            currentScene = 'indoor_desafios';
            player.x = 400; // Posição inicial dentro da casa (perto da porta)
            player.y = 500;
            document.getElementById("location-text").innerText = "Local: Casa - Desafios";
            document.getElementById("objective-text").innerText = "Objetivo: Acesse os terminais de hacking";
        }
    } 
    else if (currentScene === 'indoor_desafios') {
        // Limites internos da casa
        player.x = Math.max(80, Math.min(canvas.width - 100, player.x));
        player.y = Math.max(120, Math.min(canvas.height - 60, player.y));

        // Checar saída na porta inferior (X: 360-440, Y: 530+)
        if (player.x > 360 && player.x < 440 && player.y >= 530) {
            currentScene = 'outdoor';
            player.x = 570; // Retorna na frente da casa externa
            player.y = 390;
            document.getElementById("location-text").innerText = "Local: Campo Externo";
            document.getElementById("objective-text").innerText = "Objetivo: Explore o mapa e encontre as casas";
        }
    }
}

function checkInteraction() {
    if (currentScene === 'indoor_desafios') {
        // Posições dos 4 terminais no interior (X aproximados para cada terminal)
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

// Renderização Gráfica
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentScene === 'outdoor') {
        renderOutdoor();
    } else if (currentScene === 'indoor_desafios') {
        renderIndoorDesafios();
    }

    renderPlayer();
}

function renderOutdoor() {
    // Grama e Caminho
    ctx.fillStyle = "#162e16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1e3a1e";
    ctx.fillRect(350, 0, 100, 600); // Trilha vertical

    // Casa "Desafios" (Lado Direito)
    ctx.fillStyle = "#1b4332";
    ctx.fillRect(500, 200, 240, 180);
    ctx.fillStyle = "#081c15";
    ctx.fillRect(520, 320, 60, 60); // Porta

    // Placa Letreiro da Casa
    ctx.fillStyle = "#00ffcc";
    ctx.font = "bold 16px Courier New";
    ctx.fillText("DESAFIOS", 570, 250);
}

function renderIndoorDesafios() {
    // Piso de escritório / laboratório
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Parede superior
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(60, 60, 680, 100);

    // 4 Terminais Hacking
    const termX = [140, 260, 380, 500];
    termX.forEach((x, i) => {
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(x - 25, 90, 50, 40);
        ctx.fillStyle = "#050811";
        ctx.font = "11px Courier New";
        ctx.fillText(`SQL/L${i+1}`, x - 22, 115);
    });

    // Porta de saída (inferior)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(360, 530, 80, 20);
    ctx.fillStyle = "#fff";
    ctx.font = "12px Courier New";
    ctx.fillText("SAÍDA", 380, 545);
}

function renderPlayer() {
    // Chama o renderizador modular do sprite do John
    drawPlayer(ctx, player);
}

// Loop Principal do Jogo
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();