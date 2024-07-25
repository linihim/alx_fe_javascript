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
        saveQuotes();
        alert('new quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuote();
    } else {
        alert('please enter both the quote and its category.');
    }

}
   

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
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try{
                const importedQuotes = JSON.parse(e.target.result);
                quotes = quotes.concat(importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
                showRandomQuote();
            } catch (error) {
                alert('Error importing quotes. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
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
    console.log("showLastQuote function called");
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
        <p><strong>${lastQuote.text}</strong></p>
        <p><em>Category: ${lastQuote.category}</em></p>
        `;
    } else {
        console.log("No last quote found");
        alert('No last quote found in this session.');
    }
}


function createAddQuoteForm() {
    const formHtml = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category"/>
    <button onclick="addQuote()">Add Quote</button>

    `;

    const formContainer = document.getElementById('addQuoteForm');
    if (formContainer) {
        formContainer.innerHTML = formHtml;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();

    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', showRandomQuote);
    }

    const lastQuoteButton = document.getElementById('lastQuote');
    if (lastQuoteButton) {
        console.log("Last Quote button found, attaching event listener");
        lastQuoteButton.addEventListener('click', showLastQuote);
    }

    const exportButton = document.getElementById('exportQuotes');
    if (exportButton) {
        exportButton.addEventListener('click', exportToJson);
    }

    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', importFromJsonFile);
    }
});

window.onload = function() {
    console.log('All resources have finished loading!');
};