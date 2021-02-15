async function fetchChatMessages() {
    const container = document.querySelector('#chat-messages');
    container.innerHTML = '<p>Loading...</p>';
    const response = await fetch('/chats/123');
    const messages = await response.json();
    container.innerHTML = '';

    for (const message of messages) {
        const element = document.createElement('p');
        element.innerText = message;
        container.appendChild(element);
    }
}

async function createChatMessage() {
    const inputText = document.querySelector('#chat-form-message');
    await fetch('/chats/123', {
        method: 'post',
        body: JSON.stringify({
            message: inputText.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    inputText.value = '';
    await fetchChatMessages();
}

window.addEventListener('load', fetchChatMessages);
document.querySelector('#chat-form').addEventListener('submit', event => {
    event.preventDefault();
    createChatMessage();
});