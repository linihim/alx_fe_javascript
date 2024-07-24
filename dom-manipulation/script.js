let quotes = [];

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            {text: "Be the change you wish to see in the world.", category: "Inspirational"},
            {text: "The only way to do great work is to love what you do.", category: "Motivational"},
            {text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life"}
        ];
        saveQuotes();
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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

window.onload = function() {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
};
   

function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const filereader = new FileReader();
    filereader.onload = function(event) {
        try{
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            showRandomQuotes();
        } catch (error) {
            alert('Error importing quotes. Please check the file format.');
        }
    };
    filereader.readAsText(event.target.files[0]);
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>Category: ${quote.category}</em></p>
    `;

    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function showLastQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
        <p><strong>${lastQuote.text}</strong></p>
        <p><em>Category: ${lastQuote.category}</em></p>
        `;
    } else {
        alert('No last quote found in this session.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', showRandomQuote);
    }

    const showLastQuoteButton = document.createElement('button');
    showLastQuoteButton.textContent = 'Show Last Quote';
    document.body.appendChild(showLastQuoteButton);

    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
});

