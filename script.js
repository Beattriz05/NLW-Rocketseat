const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.querySelector('button');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const eviarFormulario = (event) => {
    event.preventDefault();
    console.log(event);
}
form.addEventListener('submit', eviarFormulario);