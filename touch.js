// touch.js - Gerenciamento de Controles Mobile (D-Pad & Touch)

const touchInput = { 
    up: false, 
    down: false, 
    left: false, 
    right: false, 
    action: false 
};

function setupTouchButton(id, keyName) {
    const btn = document.getElementById(id);
    if (!btn) return;
    
    // Suporte a toque para celulares (evita zoom e comportamento padrão)
    btn.addEventListener("touchstart", (e) => { 
        e.preventDefault(); 
        touchInput[keyName] = true; 
        if (keyName === 'action' && typeof checkInteraction === 'function') {
            checkInteraction();
        } 
    }, { passive: false });

    btn.addEventListener("touchend", (e) => { 
        e.preventDefault(); 
        touchInput[keyName] = false; 
    }, { passive: false });

    // Suporte para testes no PC com o mouse
    btn.addEventListener("mousedown", () => { 
        touchInput[keyName] = true; 
        if (keyName === 'action' && typeof checkInteraction === 'function') {
            checkInteraction();
        } 
    });
    btn.addEventListener("mouseup", () => { 
        touchInput[keyName] = false; 
    });
}

// Inicializa os botões do D-Pad e de Ação
function initTouchControls() {
    setupTouchButton("btn-up", "up");
    setupTouchButton("btn-down", "down");
    setupTouchButton("btn-left", "left");
    setupTouchButton("btn-right", "right");
    setupTouchButton("btn-action", "action");
}

// Carrega os controles assim que o script for lido
initTouchControls();