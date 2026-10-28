// --- CONFIGURAÇÕES INICIAIS ---
const ADMIN_PASSWORD = "891";
let chatHistory = JSON.parse(localStorage.getItem('trux_history')) || [];
let aiBrain = JSON.parse(localStorage.getItem('trux_brain')) || {
    personality: "Você é a TRUX AI, uma inteligência artificial prestativa e técnica.",
    rules: "Formate códigos com ```.",
    responses: {
        "oi": "Olá! Eu sou a TRUX AI. Como posso ajudar?",
        "quem é você": "Sou a TRUX AI, sua assistente pessoal avançada."
    }
};

// --- NAVEGAÇÃO E LOGIN ---
function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    
    // Verifica se é o Admin (Senha 891)
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        // Abre o painel secreto automaticamente
        setTimeout(() => { openAdmin(); }, 500);
    } 
    // Login normal (Simulado)
    else if (email !== "" && pass !== "") {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
    } else {
        alert("Preencha e-mail e senha (ou use a senha master).");
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
}

// --- LÓGICA DO CHAT ---
function sendSuggestion(text) {
    document.getElementById('user-input').value = text;
    sendMessage();
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // Esconder tela de boas-vindas, mostrar chat
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('chat-view').classList.remove('hidden');

    // Adicionar mensagem do usuário
    addMessageToChat('user', text);
    input.value = '';

    // Simular pensamento da I.A (Digitando...)
    setTimeout(() => {
        const response = generateAIResponse(text);
        addMessageToChat('ai', response);
    }, 1000);
}

function addMessageToChat(role, text) {
    const chatView = document.getElementById('chat-view');
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    let iconHTML = role === 'ai' ? `<div class="msg-icon ai">T</div>` : '';
    
    // Suporte básico a quebra de linha
    let formattedText = text.replace(/\n/g, '<br>');
    // Suporte a blocos de código (Simples)
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre style="background:#000;padding:10px;border-radius:6px;margin-top:10px;overflow-x:auto;"><code>$1</code></pre>');

    msgDiv.innerHTML = `
        ${iconHTML}
        <div class="msg-content">${formattedText}</div>
    `;
    
    chatView.appendChild(msgDiv);
    chatView.scrollTop = chatView.scrollHeight;
}

// --- CÉREBRO DA I.A (BASEADO NO PAINEL ADMIN) ---
function generateAIResponse(userText) {
    const lowerText = userText.toLowerCase();
    const responses = aiBrain.responses;

    // Verifica se existe uma resposta exata no painel
    if (responses[lowerText]) {
        return responses[lowerText];
    }

    // Verifica se existe palavra-chave
    for (let key in responses) {
        if (lowerText.includes(key.toLowerCase())) {
            return responses[key];
        }
    }

    // Se for pedido de imagem
    if (lowerText.includes('imagem') || lowerText.includes('gato') || lowerText.includes('desenhe')) {
        return "Aqui está a imagem que você pediu (Simulação do Painel Admin):\n\n[Imagem Gerada: " + userText + "]\n\n*Nota: O sistema de imagens está em modo de simulação.*";
    }

    // Se for código
    if (lowerText.includes('código') || lowerText.includes('javascript') || lowerText.includes('cpf')) {
        return `Com certeza! Aqui está o código JavaScript para validar CPF conforme as regras da TRUX:\n\n\`\`\`javascript\nfunction validarCPF(cpf) {\n    cpf = cpf.replace(/[^\\d]+/g, '');\n    if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) return false;\n    let soma = 0;\n    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);\n    let rev = 11 - (soma % 11);\n    if (rev === 10 || rev === 11) rev = 0;\n    if (rev !== parseInt(cpf.charAt(9))) return false;\n    soma = 0;\n    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);\n    rev = 11 - (soma % 11);\n    if (rev === 10 || rev === 11) rev = 0;\n    return rev === parseInt(cpf.charAt(10));\n}\n\`\`\`\n\n*Dica:* Sempre valide no backend também!`;
    }

    // Resposta Padrão usando a Personalidade definida no Admin
    return `[Processando com base na personalidade: "${aiBrain.personality}"]\n\nEntendi sua mensagem: "${userText}". Como a inteligência artificial é baseada no painel de controle, não encontrei uma resposta específica para isso. Acesse o Painel Admin para adicionar a resposta exata!`;
}

// --- MODAIS E ADMIN ---
function openSettings() { document.getElementById('settings-modal').classList.remove('hidden'); }
function closeSettings() { document.getElementById('settings-modal').classList.add('hidden'); }
function setTheme(theme) { alert('Tema ' + theme + ' aplicado (Simulação).'); }

// Painel Admin (Abre se clicar no nome do usuário 3 vezes ou via login 891)
let adminClicks = 0;
document.querySelector('.user-profile').addEventListener('click', () => {
    adminClicks++;
    if (adminClicks >= 3) {
        openAdmin();
        adminClicks = 0;
    }
});

function openAdmin() { 
    document.getElementById('admin-panel').classList.remove('hidden'); 
    // Carregar dados salvos
    document.getElementById('admin-personality').value = aiBrain.personality;
    document.getElementById('admin-rules').value = aiBrain.rules;
    document.getElementById('admin-responses').value = JSON.stringify(aiBrain.responses, null, 2);
}

function closeAdmin() { document.getElementById('admin-panel').classList.add('hidden'); }

function saveAdminSettings() {
    try {
        const newPersonality = document.getElementById('admin-personality').value;
        const newRules = document.getElementById('admin-rules').value;
        const newResponses = JSON.parse(document.getElementById('admin-responses').value);

        aiBrain = {
            personality: newPersonality,
            rules: newRules,
            responses: newResponses
        };

        localStorage.setItem('trux_brain', JSON.stringify(aiBrain));
        
        const status = document.getElementById('admin-status');
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 3000);
    } catch (e) {
        alert("Erro no formato do JSON de respostas. Verifique as aspas e chaves.");
    }
}

function newChat() {
    document.getElementById('chat-view').innerHTML = '';
    document.getElementById('chat-view').classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('hidden');
}