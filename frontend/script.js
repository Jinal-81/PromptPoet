// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// DOM Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const poemForm = document.getElementById('poemForm');
const promptInput = document.getElementById('prompt');
const styleSelect = document.getElementById('style');
const moodSelect = document.getElementById('mood');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const btnSpinner = document.getElementById('btnSpinner');
const poemContentArea = document.getElementById('poemContentArea');
const poemMetadata = document.getElementById('poemMetadata');
const historyList = document.getElementById('historyList');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// PDF Elements
const pdfContent = document.getElementById('pdfContent');
const pdfBody = document.getElementById('pdfBody');

// State
let currentPoemText = '';
let currentPoemInfo = '';

// Initialize Theme
function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Toggle Theme
themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.theme = 'light';
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

initTheme();

// Prompt Suggestions
document.querySelectorAll('.prompt-suggestion').forEach(badge => {
    badge.addEventListener('click', (e) => {
        promptInput.value = e.target.innerText;
        promptInput.focus();
    });
});

// Show Toast Notification
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    const icon = toast.querySelector('i');
    
    if (isError) {
        icon.className = 'fa-solid fa-circle-exclamation text-red-400';
    } else {
        icon.className = 'fa-solid fa-circle-check text-green-400';
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Set Loading State
function setLoading(isLoading) {
    if (isLoading) {
        btnText.textContent = 'Generating...';
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        btnText.textContent = 'Generate Poem';
        btnIcon.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

// Display Poem
function displayPoem(poemData) {
    currentPoemText = poemData.content;
    
    let infoParts = [poemData.style];
    if (poemData.mood) infoParts.push(`Mood: ${poemData.mood}`);
    currentPoemInfo = infoParts.join(' • ');

    poemMetadata.textContent = currentPoemInfo;
    
    poemContentArea.innerHTML = `
        <div class="poem-text w-full max-w-2xl px-4 py-6">
            ${poemData.content}
        </div>
    `;

    // Show action buttons
    copyBtn.classList.remove('hidden');
    downloadBtn.classList.remove('hidden');
    shareBtn.classList.remove('hidden');
}

// Load History
async function fetchHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/poems`);
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const poems = await response.json();
        
        if (poems.length === 0) {
            historyList.innerHTML = '<div class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No poems generated yet.</div>';
            return;
        }

        historyList.innerHTML = '';
        poems.forEach(poem => {
            const date = new Date(poem.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            
            const item = document.createElement('div');
            item.className = 'history-item p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 cursor-pointer text-sm';
            item.innerHTML = `
                <div class="font-medium text-gray-800 dark:text-gray-200 truncate" title="${poem.prompt}">"${poem.prompt}"</div>
                <div class="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>${poem.style}</span>
                    <span>${date}</span>
                </div>
            `;
            
            item.addEventListener('click', () => {
                displayPoem(poem);
                // On mobile, scroll up to see poem
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            historyList.appendChild(item);
        });
    } catch (error) {
        historyList.innerHTML = `<div class="text-red-500 text-sm text-center py-4"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Error loading history</div>`;
        console.error('History error:', error);
    }
}

// Generate Form Submit
poemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const promptValue = promptInput.value.trim();
    const styleValue = styleSelect.value;
    const moodValue = moodSelect.value;
    
    if (!promptValue) return;

    setLoading(true);
    poemContentArea.innerHTML = `
        <div class="flex flex-col items-center text-primary dark:text-secondary animate-pulse gap-4">
            <i class="fa-solid fa-feather text-4xl mb-2"></i>
            <p>Composing verses...</p>
        </div>
    `;
    poemMetadata.textContent = 'Generating...';
    
    copyBtn.classList.add('hidden');
    downloadBtn.classList.add('hidden');
    shareBtn.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/generate-poem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptValue,
                style: styleValue,
                mood: moodValue || null
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        
        displayPoem(data);
        
        // Refresh history
        fetchHistory();
        
    } catch (error) {
        console.error('Generate Error:', error);
        poemContentArea.innerHTML = `
            <div class="text-center text-red-500 flex flex-col items-center">
                <i class="fa-solid fa-circle-exclamation text-4xl mb-2 text-red-400"></i>
                <p>Failed to generate poem. Please check backend connection.</p>
                <p class="text-sm mt-2 opacity-75">${error.message}</p>
            </div>
        `;
        poemMetadata.textContent = 'Generation Failed';
        showToast('Failed to generate poem.', true);
    } finally {
        setLoading(false);
    }
});

// Copy button
copyBtn.addEventListener('click', () => {
    if (!currentPoemText) return;
    
    navigator.clipboard.writeText(currentPoemText).then(() => {
        showToast('Poem copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy text', true);
        console.error('Copy error: ', err);
    });
});

// Download button (PDF)
downloadBtn.addEventListener('click', () => {
    if (!currentPoemText) return;
    
    // Prepare the PDF content container
    pdfBody.textContent = currentPoemText;
    let filename = `PromptPoet_${Date.now()}.pdf`;
    
    const opt = {
        margin:       1,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    pdfContent.classList.remove('hidden'); // unhide momentarily
    pdfContent.style.display = 'block';
    
    showToast('Preparing PDF...');
    
    html2pdf().set(opt).from(pdfContent).save().then(() => {
        pdfContent.style.display = 'none';
        pdfContent.classList.add('hidden');
        showToast('PDF Downloaded!');
    }).catch(err => {
        console.error('PDF error:', err);
        pdfContent.style.display = 'none';
        pdfContent.classList.add('hidden');
        showToast('Error generating PDF', true);
    });
});

// Share button
shareBtn.addEventListener('click', () => {
    if (!currentPoemText) return;
    
    const textToShare = encodeURIComponent(`Check out this poem I generated with AI on PromptPoet:\n\n"${currentPoemText.substring(0, 100)}..."\n`);
    const url = `https://twitter.com/intent/tweet?text=${textToShare}`;
    window.open(url, '_blank');
});

// Initial load
fetchHistory();
