let quotes = [];
let categories = ['All Categories'];

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
    updateCategories();
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function updateCategories() {
    categories = ['All Categories', ...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = categories.map(category =>
        `<option value="${category}">${category}</option>`
    ).join('');

    const lastcategory = localStorage.getItem('lastCategory') || 'All Categories';
    categoryFilter.value = lastcategory;
}

function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastcategory', category);

    let filteredQuotes = quotes;
    if (category !== 'All Categories') {
        filteredQuotes = quotes.filter(quote => quote.category === category);

    }

    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() *filteredQuotes.length);
        displayQuote(filteredQuotes[randomIndex]);
    } else {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes found in this category.</p>';

    }
}

function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>Category: ${quote.category}</em></p>
    `;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;


    if (newQuoteText && newQuoteCategory) {
        quotes.push({text: newQuoteText, category: newQuotecategory});
        saveQuotes();
        updateCategories();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuotecategory').value = '';
        filterQuotes();
    } else {
        alert('please enter both the quote and its category.');
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
}

function showLastQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        displayQuote(lastQuote);
    } else {
        alert('No last quote found in this sessionStorage.');
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
            try {
                const importedQuotes = JSON.parse(e.target.result);
                quotes = quotes.concat(importedQuotes);
                saveQuotes();
                updateCategories();
                alert('Quotes imported successfully!');
                filterQuotes();
            } catch (error) {
                alert('Error importing quotes. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

function createAddQuoteForm() {
    const formHtml = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category"/>
    <button onclick= "addQuote()">Add Quote</button>
    `;

    const formContainer = document.getElementById('addQuoteForm');
    if (formContainer) {
        formContainer.innerHTML = formHtml;
    }
}


  

document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm();
    filterQuotes();

    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', filterQuotes);
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

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterQuotes);
    }
});

window.onload = function() {
    console.log('All resources have finished loading!');
};