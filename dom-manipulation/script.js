const quotes = [];
const categories = ['All Categories'];

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes.push(...JSON.parse(storedQuotes));
    } else {
        quotes.push(
            {text: "Be the change you wish to see in the world.", category: "Inspirational"},
            {text: "The only way to do great work is to love what you do.", category: "Motivational"},
            {text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life"}
        );
        saveQuotes();
    }
    populateCategories();
    restoreLastCategory();
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
    const uniqueCategories = ['All Categories', ...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '';
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function restoreLastCategory() {
    const lastCategory = localStorage.getItem('lastCategory') || 'All Categories';
    document.getElementById('categoryFilter').value = lastCategory;
    filterQuotes();
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategory', selectedCategory);

    let filteredQuotes = quotes;
    if (selectedCategory !== 'All Categories') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    }

    updateDisplayedQuotes(filteredQuotes);
}

function updateDisplayedQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `
        <p><strong>${quote.text}</strong></p>
        <p><em>Category: ${quote.category}</em></p>
        `;
        sessionStorage.setItem('lastQuote', JSON.stringify(quote)); 
    } else {
        quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
    }
}
    

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;


    if (newQuoteText && newQuoteCategory) {
        const newQuote = {text: newQuoteText, category: newQuoteCategory};
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        postQuoteToServer(newQuote);
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
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
        updateDisplayedQuotes([lastQuote]);
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
                populateCategories();
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

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(item => ({
            text: item.body,
            category: item.title.split(' ')[0]
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: quote.category,
                body: quote.text,
                userId: 1,
            }),
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Quote posted to server:', data);
        showNotification('Quote posted to server successfully');
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

async function syncQuotes() {
    showNotification('Syncing quotes...');
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];


    const mergedQuotes = [...localQuotes,...serverQuotes];
    const uniqueQuotes = Array.from(new Set(mergedQuotes.map(JSON.stringify))).map(JSON.parse);


    localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
    quotes.length = 0;
    quotes.push(...uniqueQuotes);

    populateCategories();
    filterQuotes();
    showNotification('Quotes synced with server');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);

}

function setupPeriodicSync() {
    setInterval(syncQuotes, 60000);
}

document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm();
    restoreLastCategory();
    setupPeriodicSync();

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

    const syncButton = document.createElement('button');
    syncButton.textContent = 'Sync Quotes';
    syncButton.addEventListener('click', syncQuotes);
    document.body.appendChild(syncButton);
});

window.onload = function() {
    console.log('All resources have finished loading!');
};