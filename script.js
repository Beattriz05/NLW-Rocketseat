const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.querySelector('button');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

const perguntarAI = async (question, game,apiKey) => {
    const model = "gemini-2.5-flash";
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const pergunta = `
    ## Especialidade:
    Você é um especialista assistente de meta para o jogo ${game} e pode responder perguntas sobre o jogo.

    ## Tarefa:
    Responda a pergunta do usuário com base no seu conhecimento do jogo, estratégias,build e dicas, assim forneça informações úteis e relevantes.

    ## Regras:
    - Responda apenas com informações sobre o jogo.
    - Se você não souber a resposta, diga que 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não for sobre o jogo, responda com 'Não posso ajudar com isso'.
    - Se a pergunta não for clara, peça mais detalhes.
    - Use uma linguagem clara e objetiva.
    - Considere a data atual ${new Date().toLocaleDateString} e as atualizações mais recentes do jogo.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para fornecer informações precisas e relevantes.
    - Nunca responda itens que você não tem certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Pergunta do usuário: ${question}
    `
    const contents = [{
        role: 'user',
        parts: [{
            text: pergunta
        }]
    }];

    const tools = [{
        google_search: {}
    }];

    // Chamada para a API Gemini
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
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
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
        aiResponse.classList.remove('hidden');
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