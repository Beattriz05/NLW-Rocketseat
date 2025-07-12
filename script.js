const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.querySelector('button');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const perguntarAI = async (question, game,apiKey) => {
    const model = "gemini-2.5-flash";
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const pergunta = `
    Você é um especialista em ${game}. Responda a pergunta de forma clara e objetiva, com base no conhecimento mais recente sobre o jogo. Pergunta: ${question}
    `
    const contents = [{
        parts: [{
            text: pergunta
        }]
    }];

    // Chamada para a API Gemini
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents
        })
    })

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

const enviarFormulario = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if(apiKey == ''|| game == '' || question == '') {
       alert('Por favor, preencha todos os campos.');
       return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add = 'loading';

    // Envia a pergunta para IA
    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = text;
    } catch (error) {
        console.log('Erro ao enviar a pergunta:', error);
    } finally {
      askButton.disabled = false;
      askButton.textContent = 'Perguntar';
      askButton.classList.remove('loading');
    }

    const data = await response.json();
    console.log({data})
    return 
}

form.addEventListener('submit', enviarFormulario);