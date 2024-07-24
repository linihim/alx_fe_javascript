let quotes = [
    {text: "Be the change you wish to see in the world.", category: "Inspirational"},
    {text: "The only way to do great work is to love what you do.", category: "Motivational"},
    {text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life"}

];

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>Category: ${quote.category}</em></p>
    `;
}

function createAddQuoteForm() {
    const formHtml = `
    <h2>Add a new Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category"/>
    <button onclick="addQuote()">Add Quote</button>
    `;

    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHtml;
    document.body.appendChild(formContainer);
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;


    if (newQuoteText && newQuoteCategory) {
        quotes.push({text: newQuoteText, category: newQuoteCategory});
        alert('new quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuotes();
    } else {
        alert('please enter both the quote and its category.');
    }
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

window.onload = function() {
    createAddQuoteForm();
    showRandomQuote();
};