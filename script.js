// script.js - Corrigido e Limpo (Sem conflitos de touchInput)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensões do Mundo Real (maior que a tela de 800x600)
const worldWidth = 1600;
const worldHeight = 1200;

// Estado do Jogador (John) - Começa no centro do mundo
let player = {
    x: 750,
    y: 680,
    speed: 2.1,
    dir: 'down',
    isMoving: false,
    health: 100,
    maxHealth: 100,
    invuln: 0
};

function loadIslandAsset(relativePath) {
    const img = new Image();
    img.src = encodeURI(relativePath);
    return img;
}

const islandAssets = {
    sky: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Background/Sky_Ruins_2D_Platformer_Tileset_Background - Layer 00.png'),
    back: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Background/Sky_Ruins_2D_Platformer_Tileset_Background - Layer 01.png'),
    grass: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Grass.png'),
    rock: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Rock 01.png'),
    rock2: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Rock 02.png'),
    stone: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Old stone.png'),
    wall: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Old brick wall.png'),
    tree: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Tree.png'),
    ground: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Platfromer/Sky_Ruins_2D_Platformer_Tileset_Platformer - Ground 01.png')
};

const cityWalls = [
    { x: 0, y: 0, w: worldWidth, h: 30 },
    { x: 0, y: worldHeight - 30, w: worldWidth, h: 30 },
    { x: 0, y: 0, w: 30, h: worldHeight },
    { x: worldWidth - 30, y: 0, w: 30, h: worldHeight }
];

const worldProps = [
    { type: 'tree', x: 130, y: 220, w: 58, h: 82, solid: true },
    { type: 'tree', x: 210, y: 300, w: 58, h: 82, solid: true },
    { type: 'tree', x: 330, y: 240, w: 58, h: 82, solid: true },
    { type: 'tree', x: 470, y: 320, w: 58, h: 82, solid: true },
    { type: 'tree', x: 600, y: 270, w: 58, h: 82, solid: true },
    { type: 'tree', x: 820, y: 260, w: 58, h: 82, solid: true },
    { type: 'tree', x: 980, y: 320, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1110, y: 260, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1280, y: 220, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1350, y: 340, w: 58, h: 82, solid: true },
    { type: 'tree', x: 120, y: 520, w: 58, h: 82, solid: true },
    { type: 'tree', x: 250, y: 610, w: 58, h: 82, solid: true },
    { type: 'tree', x: 420, y: 760, w: 58, h: 82, solid: true },
    { type: 'tree', x: 600, y: 820, w: 58, h: 82, solid: true },
    { type: 'tree', x: 770, y: 780, w: 58, h: 82, solid: true },
    { type: 'tree', x: 930, y: 860, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1110, y: 780, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1260, y: 840, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1400, y: 690, w: 58, h: 82, solid: true },
    { type: 'tree', x: 290, y: 920, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1040, y: 620, w: 58, h: 82, solid: true },
    { type: 'tree', x: 1190, y: 520, w: 58, h: 82, solid: true },
    { type: 'tree', x: 820, y: 600, w: 58, h: 82, solid: true },
    { type: 'tree', x: 710, y: 420, w: 58, h: 82, solid: true },
    { type: 'tree', x: 470, y: 520, w: 58, h: 82, solid: true },
    { type: 'rock', x: 470, y: 620, w: 44, h: 28, solid: true },
    { type: 'rock', x: 660, y: 540, w: 42, h: 28, solid: true },
    { type: 'rock', x: 920, y: 660, w: 46, h: 30, solid: true },
    { type: 'rock', x: 1170, y: 610, w: 42, h: 26, solid: true },
    { type: 'stone', x: 600, y: 760, w: 36, h: 36, solid: true },
    { type: 'stone', x: 890, y: 820, w: 36, h: 36, solid: true },
    { type: 'flower', x: 260, y: 700, w: 16, h: 16, solid: false },
    { type: 'flower', x: 320, y: 740, w: 16, h: 16, solid: false },
    { type: 'flower', x: 1220, y: 690, w: 16, h: 16, solid: false },
    { type: 'flower', x: 980, y: 760, w: 16, h: 16, solid: false }
];

const hazards = [];

function updateHealthUI() {
    const fill = document.getElementById('health-fill');
    const text = document.getElementById('health-text');
    if (!fill || !text) return;

    const ratio = Math.max(0, Math.min(1, player.health / player.maxHealth));
    fill.style.width = `${ratio * 100}%`;
    text.textContent = `${Math.max(0, Math.ceil(player.health))} / ${player.maxHealth}`;
}

function applyDamage(amount) {
    if (player.invuln > 0 || !gameStarted) return;

    player.health = Math.max(0, player.health - amount);
    player.invuln = 0.7;
    updateHealthUI();

    if (player.health <= 0) {
        player.health = player.maxHealth;
        player.x = 760;
        player.y = 640;
        updateHealthUI();
        if (interactionHint) {
            interactionHint.textContent = 'Você foi atingido. Volte ao ponto de entrada e recomece.';
        }
    }
}

function collidesWithSolid(x, y, radius = 16) {
    const solids = [...cityWalls, ...worldProps.filter((prop) => prop.solid)];

    return solids.some((solid) => {
        if (solid.w && solid.h) {
            const nearestX = Math.max(solid.x, Math.min(x, solid.x + solid.w));
            const nearestY = Math.max(solid.y, Math.min(y, solid.y + solid.h));
            const dx = x - nearestX;
            const dy = y - nearestY;
            return dx * dx + dy * dy < radius * radius;
        }

        const dx = x - solid.x;
        const dy = y - solid.y;
        return Math.sqrt(dx * dx + dy * dy) < (radius + (solid.radius || 18));
    });
}

function handleHazards() {
    hazards.forEach((hazard) => {
        const dx = player.x - hazard.x;
        const dy = player.y - hazard.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hazard.radius + 20) {
            applyDamage(hazard.damage);
        }
    });
}

function drawWorldProps() {
    const drawAsset = (asset, x, y, w, h, opacity = 1) => {
        if (asset && asset.complete) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.drawImage(asset, x, y, w, h);
            ctx.restore();
        }
    };

    worldProps.forEach((prop) => {
        if (prop.type === 'tree') {
            drawAsset(islandAssets.tree, prop.x, prop.y, prop.w, prop.h, 0.96);
        } else if (prop.type === 'rock') {
            drawAsset(islandAssets.rock, prop.x, prop.y, prop.w, prop.h, 0.92);
        } else if (prop.type === 'stone') {
            drawAsset(islandAssets.stone, prop.x, prop.y, prop.w, prop.h, 0.9);
        } else if (prop.type === 'fence') {
            ctx.save();
            ctx.fillStyle = '#8d5a33';
            ctx.fillRect(prop.x, prop.y, prop.w, prop.h);
            ctx.fillStyle = '#a97346';
            for (let i = 0; i <= prop.w; i += 20) {
                ctx.fillRect(prop.x + i, prop.y - 3, 4, prop.h + 6);
            }
            ctx.restore();
        } else if (prop.type === 'flower') {
            ctx.save();
            ctx.fillStyle = '#7fbf5b';
            ctx.fillRect(prop.x + 6, prop.y + 10, 4, 8);
            ctx.fillStyle = '#ff8ec7';
            ctx.beginPath();
            ctx.arc(prop.x + 8, prop.y + 6, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    const edgeStoneSize = 46;
    for (let x = 60; x < worldWidth - 60; x += edgeStoneSize) {
        drawAsset(islandAssets.rock2, x, 26, 42, 32, 0.9);
        drawAsset(islandAssets.rock2, x, worldHeight - 58, 42, 32, 0.9);
    }
    for (let y = 60; y < worldHeight - 60; y += edgeStoneSize) {
        drawAsset(islandAssets.rock, 20, y, 34, 30, 0.9);
        drawAsset(islandAssets.rock, worldWidth - 46, y, 34, 30, 0.9);
    }
}

let lastFrameTime = 0;
const touchState = typeof touchInput !== 'undefined' ? touchInput : {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false
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
let gameStarted = false;
let keys = {};

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const sceneViewBtn = document.getElementById("scene-view-btn");
const editorViewBtn = document.getElementById("editor-view-btn");
const interactionHint = document.getElementById("interaction-hint");
const isSceneViewerMode = new URLSearchParams(window.location.search).get("viewer") === "1";
const isEditorMode = new URLSearchParams(window.location.search).get("editor") === "1";

updateHealthUI();

function openSceneViewer() {
    const viewerWindow = window.open(
        "index.html?viewer=1",
        "cenario_interativo",
        "width=980,height=680,toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=no"
    );

    if (viewerWindow) {
        viewerWindow.focus();
    }
}

function openSceneEditor() {
    const editorWindow = window.open(
        "index.html?editor=1",
        "editor_cenario",
        "width=1200,height=760,toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=no"
    );

    if (editorWindow) {
        editorWindow.focus();
    }
}

function beginGame() {
    if (gameStarted) return;
    gameStarted = true;
    if (startScreen) startScreen.classList.add("hidden");
    document.getElementById("objective-text").innerText = "Objetivo: Entre na casa \"Desafios\" e acesse os terminais.";
    updateInteractionHint();
}

function updateInteractionHint() {
    if (!interactionHint) return;

    if (currentScene === 'outdoor') {
        const nearDoor = player.x > 720 && player.x < 820 && player.y > 530 && player.y < 620;
        interactionHint.textContent = nearDoor
            ? "Perto da casa. Pressione E para entrar."
            : "Explore o mapa e encontre a casa de desafios.";
        return;
    }

    const nearTerminal = [140, 260, 380, 500].some((x) => Math.abs(player.x - x) < 40 && player.y < 220);
    interactionHint.textContent = nearTerminal
        ? "Terminal acessível. Pressione E para interagir."
        : "Terminais ativos. Explore e resolva os desafios.";
}

// --- Carregamento Robusto de Imagens ---
let imagesLoaded = 0;
const totalImages = 1;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        console.log("Cenários carregados com sucesso. Iniciando loop do jogo...");
        requestAnimationFrame(gameLoop);
    }
}

const bgImage = new Image();
bgImage.src = "imagens/chaosite.png";
bgImage.onload = imageLoaded;
bgImage.onerror = () => console.error("Erro ao carregar imagens/chaosite.png");
// -------------------------------------

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
    const key = e.key.toLowerCase();

    if (!gameStarted && (e.key === "Enter" || key === " " || key === "e")) {
        beginGame();
    }

    keys[key] = true;
    if (e.key === "e" || e.key === "E" || e.key === " ") {
        checkInteraction();
    }
    if (e.key === "Escape") {
        closeChallenge();
    }
});

const editorTools = [
    { id: "tree", label: "Árvore", w: 56, h: 74 },
    { id: "bush", label: "Arbusto", w: 52, h: 42 },
    { id: "rock", label: "Pedra", w: 54, h: 40 },
    { id: "stone", label: "Rocha Grande", w: 68, h: 54 },
    { id: "crate", label: "Caixa", w: 52, h: 52 },
    { id: "barrel", label: "Barril", w: 42, h: 52 },
    { id: "pond", label: "Lago", w: 130, h: 90 },
    { id: "ruin", label: "Ruína", w: 60, h: 60 },
    { id: "house", label: "Casa", w: 110, h: 90 },
    { id: "flower", label: "Flor", w: 24, h: 24 },
    { id: "path", label: "Trilha", w: 120, h: 30 },
    { id: "road", label: "Rua", w: 180, h: 52 },
    { id: "fence", label: "Cerca", w: 120, h: 34 },
    { id: "sign", label: "Placa", w: 36, h: 54 },
    { id: "well", label: "Poço", w: 52, h: 52 },
    { id: "chest", label: "Cofre", w: 52, h: 52 }
];
const EDITOR_STORAGE_KEY = "stardew_scene_builder_state_v1";
const editorAssetPacks = ["Craftpix", "Rocks", "Objetos"];

let editorSelectedTool = "tree";
let editorObjects = [];
let editorSelectedObjectIndex = null;
let editorDraggingIndex = null;
let editorHint = null;
let editorPanel = null;

const editorImageAssets = {
    tree: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Tree.png'),
    bush: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Grass.png'),
    rock: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Rock 01.png'),
    stone: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Big stone.png'),
    crate: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Platfromer/Sky_Ruins_2D_Platformer_Tileset_Platformer - Wooden Box.png'),
    barrel: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Platfromer/Sky_Ruins_2D_Platformer_Tileset_Platformer - Wooden Barrel.png'),
    pond: null,
    ruin: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Abandoned columns.png'),
    house: loadIslandAsset('imagens/chaosite.png'),
    flower: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Magic stone 01.png'),
    path: null,
    road: null,
    fence: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Fence 01.png'),
    sign: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Signpost 01.png'),
    well: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Environment/Sky_Ruins_2D_Platformer_Tileset_Environment - Column.png'),
    chest: loadIslandAsset('assets/craftpix-net-499014-free-sky-ruins-2d-platformer-tileset/PNG/Platfromer/Sky_Ruins_2D_Platformer_Tileset_Platformer - Wooden Box.png')
};

function loadEditorScene() {
    try {
        const saved = localStorage.getItem(EDITOR_STORAGE_KEY);
        if (!saved) {
            editorObjects = [
                { id: "tree-1", type: "tree", x: 180, y: 180, w: 56, h: 74 },
                { id: "tree-2", type: "tree", x: 330, y: 270, w: 56, h: 74 },
                { id: "tree-3", type: "tree", x: 1100, y: 260, w: 56, h: 74 },
                { id: "bush-1", type: "bush", x: 490, y: 250, w: 52, h: 42 },
                { id: "pond-1", type: "pond", x: 260, y: 610, w: 150, h: 90 },
                { id: "path-1", type: "path", x: 560, y: 610, w: 360, h: 32 },
                { id: "road-1", type: "road", x: 680, y: 670, w: 180, h: 52 },
                { id: "rock-1", type: "rock", x: 760, y: 420, w: 54, h: 40 },
                { id: "stone-1", type: "stone", x: 980, y: 430, w: 68, h: 54 },
                { id: "fence-1", type: "fence", x: 840, y: 240, w: 120, h: 34 },
                { id: "house-1", type: "house", x: 760, y: 300, w: 110, h: 90 }
            ];
            return;
        }

        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            editorObjects = parsed.map((obj, index) => ({
                id: obj.id || `${obj.type}-${index + 1}`,
                type: obj.type,
                x: Number(obj.x) || 100,
                y: Number(obj.y) || 100,
                w: Number(obj.w) || 60,
                h: Number(obj.h) || 60
            }));
        }
    } catch (error) {
        console.warn("Falha ao carregar mapa salvo:", error);
        editorObjects = [];
    }
}

function saveEditorScene() {
    if (!isEditorMode) return;
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(editorObjects));
}

function snapToGrid(value) {
    return Math.round(value / 16) * 16;
}

function findObjectAt(x, y) {
    for (let i = editorObjects.length - 1; i >= 0; i--) {
        const obj = editorObjects[i];
        const left = obj.x - obj.w / 2;
        const right = obj.x + obj.w / 2;
        const top = obj.y - obj.h / 2;
        const bottom = obj.y + obj.h / 2;
        if (x >= left && x <= right && y >= top && y <= bottom) {
            return i;
        }
    }
    return -1;
}

function resizeSelectedObject(delta) {
    if (editorSelectedObjectIndex === null) return;
    const obj = editorObjects[editorSelectedObjectIndex];
    if (!obj) return;

    obj.w = Math.max(24, obj.w + delta);
    obj.h = Math.max(24, obj.h + delta);
    saveEditorScene();
}

function createEditorSidebar() {
    if (editorPanel) return;

    editorPanel = document.createElement("aside");
    editorPanel.id = "editor-panel";
    editorPanel.innerHTML = `
        <div class="editor-panel-header">
            <h3>Assets</h3>
        </div>
        <div class="editor-pack-list">Pacotes: ${editorAssetPacks.join(" • ")}</div>
        <div class="editor-asset-list"></div>
        <div class="editor-actions">
            <button id="editor-save-btn" class="editor-action-btn">Salvar</button>
            <button id="editor-clear-btn" class="editor-action-btn danger">Resetar</button>
        </div>
        <div class="editor-size-controls">
            <button id="editor-shrink-btn" class="editor-action-btn">- tamanho</button>
            <button id="editor-grow-btn" class="editor-action-btn">+ tamanho</button>
        </div>
    `;

    const assetList = editorPanel.querySelector(".editor-asset-list");
    editorTools.forEach((tool) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `editor-asset${tool.id === editorSelectedTool ? " active" : ""}`;
        btn.dataset.tool = tool.id;
        btn.innerHTML = `<span class="editor-swatch ${tool.id}"></span><span>${tool.label}</span>`;
        btn.addEventListener("click", () => {
            editorSelectedTool = tool.id;
            editorPanel.querySelectorAll(".editor-asset").forEach((el) => {
                el.classList.toggle("active", el.dataset.tool === editorSelectedTool);
            });
        });
        assetList.appendChild(btn);
    });

    editorPanel.querySelector("#editor-save-btn").addEventListener("click", saveEditorScene);
    editorPanel.querySelector("#editor-clear-btn").addEventListener("click", () => {
        editorObjects = [];
        editorSelectedObjectIndex = null;
        saveEditorScene();
    });
    editorPanel.querySelector("#editor-shrink-btn").addEventListener("click", () => resizeSelectedObject(-12));
    editorPanel.querySelector("#editor-grow-btn").addEventListener("click", () => resizeSelectedObject(12));

    document.body.appendChild(editorPanel);
}

function addEditorObject(x, y) {
    const tool = editorTools.find((item) => item.id === editorSelectedTool) || editorTools[0];
    const obj = {
        id: `${tool.id}-${Date.now()}`,
        type: tool.id,
        x: snapToGrid(x),
        y: snapToGrid(y),
        w: tool.w,
        h: tool.h
    };
    editorObjects.push(obj);
    editorSelectedObjectIndex = editorObjects.length - 1;
    saveEditorScene();
}

function drawEditorObject(obj) {
    const left = obj.x - obj.w / 2;
    const top = obj.y - obj.h / 2;
    const asset = editorImageAssets[obj.type];

    if (asset && asset.complete) {
        ctx.save();
        ctx.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.22))';
        ctx.drawImage(asset, left, top, obj.w, obj.h);
        ctx.restore();
    } else {
        if (obj.type === "tree") {
            ctx.fillStyle = "#4a2d1a";
            ctx.fillRect(left + obj.w * 0.4, top + obj.h * 0.64, obj.w * 0.2, obj.h * 0.34);
            ctx.beginPath();
            ctx.fillStyle = "#2f8f57";
            ctx.arc(obj.x, obj.y, Math.min(obj.w, obj.h) * 0.52, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type === "bush") {
            ctx.fillStyle = "#2f8f57";
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, Math.min(obj.w, obj.h) * 0.56, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type === "rock") {
            ctx.fillStyle = "#767d7f";
            ctx.beginPath();
            ctx.moveTo(left, top + obj.h * 0.7);
            ctx.lineTo(left + obj.w * 0.22, top);
            ctx.lineTo(left + obj.w * 0.55, top + obj.h * 0.18);
            ctx.lineTo(left + obj.w, top + obj.h * 0.72);
            ctx.lineTo(left + obj.w * 0.7, top + obj.h);
            ctx.lineTo(left + obj.w * 0.3, top + obj.h);
            ctx.closePath();
            ctx.fill();
        } else if (obj.type === "stone") {
            ctx.fillStyle = "#8f8f8f";
            ctx.fillRect(left, top, obj.w, obj.h);
        } else if (obj.type === "pond") {
            ctx.fillStyle = "#56c7f3";
            ctx.beginPath();
            ctx.ellipse(obj.x, obj.y, obj.w * 0.52, obj.h * 0.48, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            ctx.ellipse(obj.x - obj.w * 0.15, obj.y - obj.h * 0.12, obj.w * 0.25, obj.h * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type === "house") {
            ctx.fillStyle = "#d4b08f";
            ctx.fillRect(left, top + obj.h * 0.2, obj.w, obj.h * 0.8);
            ctx.fillStyle = "#8d5a33";
            ctx.beginPath();
            ctx.moveTo(left - 8, top + obj.h * 0.2);
            ctx.lineTo(obj.x, top - 8);
            ctx.lineTo(left + obj.w + 8, top + obj.h * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#f2d59b";
            ctx.fillRect(left + obj.w * 0.16, top + obj.h * 0.5, obj.w * 0.2, obj.h * 0.18);
            ctx.fillRect(left + obj.w * 0.62, top + obj.h * 0.5, obj.w * 0.2, obj.h * 0.18);
        } else if (obj.type === "flower") {
            ctx.fillStyle = "#7abf7a";
            ctx.fillRect(obj.x - 2, obj.y + obj.h * 0.2, 4, obj.h * 0.7);
            ctx.fillStyle = "#ff8ec7";
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.w * 0.6, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type === "path") {
            ctx.fillStyle = "#d3aa68";
            ctx.fillRect(left, top, obj.w, obj.h);
            ctx.fillStyle = "#b77d3b";
            ctx.fillRect(left + 10, top + 8, obj.w - 20, obj.h * 0.24);
        } else if (obj.type === "road") {
            ctx.fillStyle = "#a0a3a6";
            ctx.fillRect(left, top, obj.w, obj.h);
            ctx.fillStyle = "#7a7d80";
            for (let x = left; x < left + obj.w; x += 26) {
                ctx.fillRect(x, top + obj.h * 0.45, 16, 8);
            }
        } else if (obj.type === "fence") {
            ctx.fillStyle = "#8d5a33";
            ctx.fillRect(left, top, obj.w, obj.h);
            ctx.fillStyle = "#a97346";
            for (let x = left; x <= left + obj.w; x += 18) {
                ctx.fillRect(x, top - 3, 3, obj.h + 6);
            }
        } else if (obj.type === "sign") {
            ctx.fillStyle = "#b88a62";
            ctx.fillRect(left + obj.w * 0.4, top, obj.w * 0.2, obj.h);
            ctx.fillStyle = "#d9d0a4";
            ctx.fillRect(left + obj.w * 0.18, top + obj.h * 0.2, obj.w * 0.64, obj.h * 0.38);
        } else if (obj.type === "well") {
            ctx.fillStyle = "#7d7f83";
            ctx.fillRect(left + obj.w * 0.2, top + obj.h * 0.2, obj.w * 0.6, obj.h * 0.65);
            ctx.fillStyle = "#56c7f3";
            ctx.beginPath();
            ctx.ellipse(obj.x, obj.y + obj.h * 0.04, obj.w * 0.22, obj.h * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type === "chest") {
            ctx.fillStyle = "#8a5a2b";
            ctx.fillRect(left, top, obj.w, obj.h);
            ctx.fillStyle = "#d9ad5f";
            ctx.fillRect(left + obj.w * 0.18, top + obj.h * 0.18, obj.w * 0.64, obj.h * 0.24);
        }
    }

    if (editorSelectedObjectIndex !== null && editorObjects[editorSelectedObjectIndex]?.id === obj.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(left - 4, top - 4, obj.w + 8, obj.h + 8);
        ctx.setLineDash([]);
    }
}

function renderEditorMode() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const terrainGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    terrainGradient.addColorStop(0, "#456d39");
    terrainGradient.addColorStop(0.55, "#2e552d");
    terrainGradient.addColorStop(1, "#1a321d");
    ctx.fillStyle = terrainGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#5a7d45";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.7);
    ctx.lineTo(140, canvas.height * 0.56);
    ctx.lineTo(320, canvas.height * 0.62);
    ctx.lineTo(520, canvas.height * 0.5);
    ctx.lineTo(730, canvas.height * 0.6);
    ctx.lineTo(980, canvas.height * 0.52);
    ctx.lineTo(1120, canvas.height * 0.64);
    ctx.lineTo(canvas.width, canvas.height * 0.72);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7a9d5c";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.78);
    ctx.lineTo(220, canvas.height * 0.68);
    ctx.lineTo(420, canvas.height * 0.76);
    ctx.lineTo(620, canvas.height * 0.7);
    ctx.lineTo(860, canvas.height * 0.8);
    ctx.lineTo(1080, canvas.height * 0.72);
    ctx.lineTo(canvas.width, canvas.height * 0.82);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < 180; i++) {
        const x = (i * 53) % canvas.width;
        const y = (i * 79) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }

    const gridSize = 16;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    editorObjects.forEach((obj) => drawEditorObject(obj));
}

if (startBtn) {
    startBtn.addEventListener("click", beginGame);
}

if (sceneViewBtn) {
    sceneViewBtn.addEventListener("click", openSceneViewer);
}

if (editorViewBtn) {
    editorViewBtn.addEventListener("click", openSceneEditor);
}

if (isSceneViewerMode) {
    beginGame();
}

if (isEditorMode) {
    if (startScreen) startScreen.classList.add("hidden");
    canvas.width = 1200;
    canvas.height = 760;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    document.body.classList.add("editor-body");
    loadEditorScene();
    createEditorSidebar();
    initEditorMode();
}

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Ouvintes Touch (Mobile D-Pad unificados)
function setupTouchButton(id, keyName) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); keys[keyName] = true; if(keyName === 'e') checkInteraction(); }, {passive: false});
    btn.addEventListener("touchend", (e) => { e.preventDefault(); keys[keyName] = false; }, {passive: false});
    btn.addEventListener("mousedown", () => { keys[keyName] = true; if(keyName === 'e') checkInteraction(); });
    btn.addEventListener("mouseup", () => { keys[keyName] = false; });
}

setupTouchButton("btn-up", "w");
setupTouchButton("btn-down", "s");
setupTouchButton("btn-left", "a");
setupTouchButton("btn-right", "d");
setupTouchButton("btn-action", "e");

function update(timestamp) {
    const delta = lastFrameTime ? Math.min(2.2, (timestamp - lastFrameTime) / 16.67) : 1;
    lastFrameTime = timestamp;

    let dx = 0;
    let dy = 0;
    player.isMoving = false;

    const moveUp = keys["arrowup"] || keys["w"] || touchState.up;
    const moveDown = keys["arrowdown"] || keys["s"] || touchState.down;
    const moveLeft = keys["arrowleft"] || keys["a"] || touchState.left;
    const moveRight = keys["arrowright"] || keys["d"] || touchState.right;

    if (moveUp) { dy -= player.speed * delta; player.dir = 'up'; player.isMoving = true; }
    if (moveDown) { dy += player.speed * delta; player.dir = 'down'; player.isMoving = true; }
    if (moveLeft) { dx -= player.speed * delta; player.dir = 'left'; player.isMoving = true; }
    if (moveRight) { dx += player.speed * delta; player.dir = 'right'; player.isMoving = true; }

    if (dx !== 0 && dy !== 0) {
        const diagonal = Math.sqrt(2);
        dx /= diagonal;
        dy /= diagonal;
    }

    const previousX = player.x;
    const previousY = player.y;
    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (!collidesWithSolid(nextX, player.y, 16)) {
        player.x = nextX;
    }

    if (!collidesWithSolid(player.x, nextY, 16)) {
        player.y = nextY;
    }

    if (player.invuln > 0) {
        player.invuln = Math.max(0, player.invuln - 0.016 * delta);
    }

    handleHazards();

    if (currentScene === 'outdoor') {
        player.x = Math.max(40, Math.min(worldWidth - 40, player.x));
        player.y = Math.max(40, Math.min(worldHeight - 40, player.y));

        const houseX = 680;
        const houseY = 450;
        const doorX = houseX + 70;
        const doorY = houseY + 96;
        const doorWidth = 60;
        const doorHeight = 70;

        const nearDoor = player.x > doorX - 28 && player.x < doorX + doorWidth + 28 &&
            player.y > doorY - 20 && player.y < doorY + doorHeight + 20;

        updateInteractionHint();

        const actionPressed = keys["e"] || keys[" "] || touchState.action;
        if (nearDoor && actionPressed) {
            currentScene = 'indoor_desafios';
            player.x = 400;
            player.y = 500;
            document.getElementById("location-text").innerText = "Local: Casa - Desafios";
            document.getElementById("objective-text").innerText = "Objetivo: Acesse os terminais de hacking";
            updateInteractionHint();
        }
    }
    else if (currentScene === 'indoor_desafios') {
        const indoorWalls = [
            { x: 0, y: 0, w: canvas.width, h: 78 },
            { x: 0, y: 0, w: 30, h: canvas.height },
            { x: canvas.width - 30, y: 0, w: 30, h: canvas.height },
            { x: 0, y: canvas.height - 40, w: 280, h: 40 },
            { x: 520, y: canvas.height - 40, w: 280, h: 40 },
            { x: 120, y: 190, w: 90, h: 18 },
            { x: 590, y: 190, w: 90, h: 18 },
            { x: 250, y: 420, w: 90, h: 18 },
            { x: 460, y: 420, w: 90, h: 18 }
        ];

        const previousX = player.x;
        const previousY = player.y;

        player.x = Math.max(90, Math.min(canvas.width - 90, player.x));
        player.y = Math.max(120, Math.min(canvas.height - 60, player.y));

        for (const wall of indoorWalls) {
            const insideWall = player.x > wall.x && player.x < wall.x + wall.w &&
                player.y > wall.y && player.y < wall.y + wall.h;
            if (insideWall) {
                player.x = previousX;
                player.y = previousY;
                break;
            }
        }

        if (player.x > 350 && player.x < 450 && player.y >= 530) {
            currentScene = 'outdoor';

            const houseX = 680;
            const houseY = 450;
            player.x = houseX + 95;
            player.y = houseY + 170;
            document.getElementById("location-text").innerText = "Local: Campo Externo";
            document.getElementById("objective-text").innerText = "Objetivo: Explore o mapa e encontre a Casa de Desafios";
            updateInteractionHint();
        }
    }

    if (currentScene === 'outdoor') {
        const targetX = player.x - camera.width / 2;
        const targetY = player.y - camera.height / 2;

        camera.x += (targetX - camera.x) * 0.08;
        camera.y += (targetY - camera.y) * 0.08;

        camera.x = Math.max(0, Math.min(camera.x, worldWidth - canvas.width));
        camera.y = Math.max(0, Math.min(camera.y, worldHeight - canvas.height));
    } else {
        camera.x += (0 - camera.x) * 0.12;
        camera.y += (0 - camera.y) * 0.12;
    }
}

function checkInteraction() {
    if (currentScene === 'indoor_desafios') {
        const terminals = [
            { x: 170, index: 0 },
            { x: 310, index: 1 },
            { x: 450, index: 2 },
            { x: 590, index: 3 }
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

// Renderização Gráfica Completa
function initEditorMode() {
    if (!isEditorMode) return;

    const hint = document.createElement("div");
    hint.className = "editor-hint";
    hint.textContent = "Clique para adicionar • Arraste para mover • Roda do mouse para redimensionar • Clique com direito para remover";
    editorHint = hint;
    document.body.appendChild(hint);

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
        const hitIndex = findObjectAt(x, y);

        if (hitIndex >= 0) {
            editorSelectedObjectIndex = hitIndex;
            saveEditorScene();
            return;
        }

        addEditorObject(x, y);
    });

    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
        const hitIndex = findObjectAt(x, y);

        if (hitIndex >= 0) {
            editorObjects.splice(hitIndex, 1);
            if (editorSelectedObjectIndex === hitIndex) {
                editorSelectedObjectIndex = null;
            }
            saveEditorScene();
        }
    });

    canvas.addEventListener("pointerdown", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
        const hitIndex = findObjectAt(x, y);

        if (hitIndex >= 0) {
            editorSelectedObjectIndex = hitIndex;
            editorDraggingIndex = hitIndex;
        }
    });

    canvas.addEventListener("pointermove", (event) => {
        if (editorDraggingIndex === null) return;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
        const obj = editorObjects[editorDraggingIndex];
        if (!obj) return;

        obj.x = snapToGrid(x);
        obj.y = snapToGrid(y);
        saveEditorScene();
    });

    canvas.addEventListener("pointerup", () => {
        editorDraggingIndex = null;
    });

    canvas.addEventListener("pointerleave", () => {
        editorDraggingIndex = null;
    });

    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        if (editorSelectedObjectIndex === null) return;
        const delta = event.deltaY > 0 ? -12 : 12;
        resizeSelectedObject(delta);
    }, { passive: false });

    document.addEventListener("keydown", (event) => {
        if (!isEditorMode) return;

        if (event.key === "Delete" || event.key === "Backspace") {
            if (editorSelectedObjectIndex !== null) {
                editorObjects.splice(editorSelectedObjectIndex, 1);
                editorSelectedObjectIndex = null;
                saveEditorScene();
            }
        }

        if (event.key === "+" || event.key === "=") {
            resizeSelectedObject(12);
        }

        if (event.key === "-" || event.key === "_") {
            resizeSelectedObject(-12);
        }
    });
}

function render() {
    if (isEditorMode) {
        renderEditorMode();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
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
    ctx.fillStyle = '#3b7b3b';
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    for (let i = 0; i < 34; i++) {
        const x = 80 + (i * 47) % (worldWidth - 140);
        const y = 120 + (i * 71) % (worldHeight - 220);
        ctx.fillStyle = (i % 3 === 0) ? '#5ca55c' : '#4d8d4b';
        ctx.beginPath();
        ctx.ellipse(x, y, 30, 18, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Lago mais natural fora do caminho
    ctx.fillStyle = '#7bd4e8';
    ctx.beginPath();
    ctx.ellipse(260, 920, 180, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8fe1f4';
    ctx.beginPath();
    ctx.ellipse(285, 900, 72, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Estrada movida para a parte superior e lateral, sem cobrir o lago
    const pathPoints = [
        { x: 180, y: 920 },
        { x: 320, y: 860 },
        { x: 500, y: 760 },
        { x: 640, y: 690 },
        { x: 790, y: 630 },
        { x: 980, y: 610 },
        { x: 1150, y: 700 },
        { x: 1310, y: 860 },
        { x: 1410, y: 950 }
    ];

    ctx.strokeStyle = '#d3aa68';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    pathPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    ctx.strokeStyle = '#b77d3b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    pathPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    // Casa mais rústica e acolhedora
    const housePortal = { x: 680, y: 470, w: 150, h: 120 };
    ctx.fillStyle = '#d4b08f';
    ctx.fillRect(housePortal.x + 18, housePortal.y + 30, housePortal.w - 36, housePortal.h - 28);

    ctx.fillStyle = '#8d5a33';
    ctx.beginPath();
    ctx.moveTo(housePortal.x + 8, housePortal.y + 30);
    ctx.lineTo(housePortal.x + housePortal.w / 2, housePortal.y - 26);
    ctx.lineTo(housePortal.x + housePortal.w - 8, housePortal.y + 30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f0d9ad';
    ctx.fillRect(housePortal.x + 34, housePortal.y + 54, 18, 18);
    ctx.fillRect(housePortal.x + 92, housePortal.y + 54, 18, 18);
    ctx.fillStyle = '#59361a';
    ctx.fillRect(housePortal.x + 64, housePortal.y + 72, 22, 38);
    ctx.fillStyle = '#7abf7a';
    ctx.fillRect(housePortal.x + 54, housePortal.y + 30, 42, 12);
    ctx.fillStyle = '#f4d89a';
    ctx.fillRect(housePortal.x + 36, housePortal.y + 86, 76, 8);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(housePortal.x + 75, housePortal.y + 92, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff5d9';
    ctx.font = "bold 12px 'Courier New'";
    ctx.textAlign = 'center';
    ctx.fillText('E', housePortal.x + 75, housePortal.y + 96);
    ctx.fillText('ENTRAR', housePortal.x + 75, housePortal.y + 128);
    ctx.textAlign = 'left';

    // árvore em excesso para deixar a floresta viva
    for (let i = 0; i < 26; i++) {
        const treeX = 90 + (i * 53) % (worldWidth - 120);
        const treeY = 120 + ((i * 97) % 700);
        ctx.fillStyle = '#4a2d1a';
        ctx.fillRect(treeX + 8, treeY + 22, 12, 26);
        ctx.beginPath();
        ctx.fillStyle = '#2f8f57';
        ctx.arc(treeX + 14, treeY + 12, 22, 0, Math.PI * 2);
        ctx.fill();
    }

    drawWorldProps();

    // Borda externa de pedras naturais
    const boundaryStone = islandAssets.wall;
    const boundarySize = 58;
    const rockBorder = [
        ...Array.from({ length: 12 }, (_, i) => ({ x: 30 + i * boundarySize, y: 26, w: 52, h: 52 })),
        ...Array.from({ length: 12 }, (_, i) => ({ x: 30 + i * boundarySize, y: worldHeight - 78, w: 52, h: 52 })),
        ...Array.from({ length: 9 }, (_, i) => ({ x: 22, y: 90 + i * boundarySize, w: 52, h: 52 })),
        ...Array.from({ length: 9 }, (_, i) => ({ x: worldWidth - 74, y: 90 + i * boundarySize, w: 52, h: 52 }))
    ];

    rockBorder.forEach((rock) => {
        if (boundaryStone && boundaryStone.complete) {
            ctx.drawImage(boundaryStone, rock.x, rock.y, rock.w, rock.h);
        } else {
            ctx.fillStyle = '#868b8e';
            ctx.beginPath();
            ctx.moveTo(rock.x + 8, rock.y + rock.h);
            ctx.lineTo(rock.x + rock.w * 0.28, rock.y + rock.h * 0.22);
            ctx.lineTo(rock.x + rock.w * 0.66, rock.y + rock.h * 0.18);
            ctx.lineTo(rock.x + rock.w - 6, rock.y + rock.h);
            ctx.closePath();
            ctx.fill();
        }
    });
}

function renderIndoorDesafios() {
    ctx.fillStyle = '#020817';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 60);
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    ctx.fillStyle = '#111827';
    ctx.fillRect(70, 90, 660, 120);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 90, 660, 120);

    ctx.fillStyle = 'rgba(0, 255, 204, 0.2)';
    for (let i = 0; i < 14; i++) {
        ctx.fillRect(90 + i * 42, 105, 20, 90);
    }

    const terminalBlocks = [
        { x: 115, y: 250, w: 110, h: 190 },
        { x: 255, y: 250, w: 110, h: 190 },
        { x: 395, y: 250, w: 110, h: 190 },
        { x: 535, y: 250, w: 110, h: 190 }
    ];

    terminalBlocks.forEach((block, index) => {
        ctx.fillStyle = '#111827';
        ctx.fillRect(block.x, block.y, block.w, block.h);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(block.x, block.y, block.w, block.h);

        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(block.x + 22, block.y + 26, block.w - 44, 26);

        ctx.fillStyle = '#dbeafe';
        ctx.font = "bold 10px 'Courier New'";
        ctx.textAlign = 'center';
        ctx.fillText(['SQLi', 'LOGS', 'MITRE', 'CRYPTO'][index], block.x + block.w / 2, block.y + 70);

        ctx.fillStyle = '#67e8f9';
        ctx.fillText('E', block.x + block.w / 2, block.y + 150);
        ctx.font = "bold 9px 'Courier New'";
        ctx.fillText('ACESSAR', block.x + block.w / 2, block.y + 168);
    });

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(300, 500, 200, 60);
    ctx.strokeStyle = '#ef4444';
    ctx.strokeRect(300, 500, 200, 60);
    ctx.fillStyle = '#ef4444';
    ctx.font = "bold 12px 'Courier New'";
    ctx.textAlign = 'center';
    ctx.fillText('SAÍDA [EXIT]', 400, 538);
    ctx.textAlign = 'left';

    const roomWalls = [
        { x: 0, y: 0, w: canvas.width, h: 70 },
        { x: 0, y: 0, w: 30, h: canvas.height },
        { x: canvas.width - 30, y: 0, w: 30, h: canvas.height },
        { x: 0, y: canvas.height - 40, w: 270, h: 40 },
        { x: 530, y: canvas.height - 40, w: 270, h: 40 },
        { x: 180, y: 200, w: 120, h: 18 },
        { x: 500, y: 200, w: 120, h: 18 },
        { x: 260, y: 430, w: 120, h: 18 },
        { x: 420, y: 430, w: 120, h: 18 }
    ];

    ctx.strokeStyle = 'rgba(103, 232, 249, 0.2)';
    ctx.lineWidth = 2;
    for (const wall of roomWalls) {
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    }
}

function renderPlayer() {
    if (typeof drawPlayer === 'function') {
        drawPlayer(ctx, player);
    }
}

// Loop Principal do Jogo
function gameLoop(timestamp) {
    update(timestamp);
    render();
    requestAnimationFrame(gameLoop);
}