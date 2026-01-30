// Style categories
const styleCategories = [
    { name: "Toxic ☣", color: "green", icon: "skull" },
    { name: "Pro ⚡", color: "blue", icon: "bolt" },
    { name: "Girl Gamer ♡", color: "pink", icon: "favorite" },
    { name: "Legendary ♛", color: "amber", icon: "military_tech" },
    { name: "Cyberpunk 🤖", color: "purple", icon: "memory" },
    { name: "Minimalist", color: "slate", icon: "minimize" }
];

// Pagination settings
const STYLES_PER_PAGE = 50;
const TOTAL_PAGES = 7;
let currentPage = 1;
let currentName = "SHADOW";
let favorites = JSON.parse(localStorage.getItem('styleFavorites')) || [];

// DOM Elements
const nameInput = document.getElementById('nameInput');
const stylesGrid = document.getElementById('stylesGrid');
const applyAllBtn = document.getElementById('applyAllBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const pageBtns = document.querySelectorAll('.page-btn');
const toast = document.getElementById('toast');
const currentStylesEl = document.getElementById('currentStyles');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const pageNumberDisplay = document.getElementById('pageNumberDisplay');
const stylesRangeDisplay = document.getElementById('stylesRangeDisplay');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalPagesEl.textContent = TOTAL_PAGES;
    generatePage(currentPage);
    updatePageDisplay();
    setupEventListeners();
    animateStats();
});

function setupEventListeners() {
    // Name input
    nameInput.addEventListener('input', (e) => {
        currentName = e.target.value.trim() || "SHADOW";
        generatePage(currentPage);
    });
    
    // Apply all button
    applyAllBtn.addEventListener('click', () => {
        if (nameInput.value.trim() === "") {
            nameInput.value = "SHADOW";
            currentName = "SHADOW";
        }
        generatePage(currentPage);
        showToast("Applied!", "All styles updated with your name");
        animateButton(applyAllBtn);
    });
    
    // Refresh button
    refreshBtn.addEventListener('click', () => {
        generatePage(currentPage);
        showToast("Refreshed!", "All styles regenerated");
        animateButton(refreshBtn);
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterStyles(searchTerm);
    });
    
    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
            animateButton(prevPageBtn);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < TOTAL_PAGES) {
            changePage(currentPage + 1);
            animateButton(nextPageBtn);
        }
    });
    
    loadMoreBtn.addEventListener('click', () => {
        if (currentPage < TOTAL_PAGES) {
            changePage(currentPage + 1);
        } else {
            changePage(1);
        }
        animateButton(loadMoreBtn);
    });
    
    // Page buttons
    pageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(btn.dataset.page);
            changePage(page);
            animateButton(e.target);
        });
    });
    
    // Scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        animateButton(scrollToTopBtn);
    });
}

function changePage(page) {
    if (page < 1 || page > TOTAL_PAGES) return;
    
    currentPage = page;
    generatePage(currentPage);
    updatePageButtons();
    updatePageDisplay();
    
    // Update stats
    currentPageEl.textContent = currentPage;
    const stylesOnPage = getStylesCountForPage(currentPage);
    currentStylesEl.textContent = stylesOnPage;
    
    // Update pagination controls
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === TOTAL_PAGES;
    
    // Change button text if last page
    if (currentPage === TOTAL_PAGES) {
        loadMoreBtn.innerHTML = `<span class="material-symbols-outlined animate-wave">refresh</span> Back to Page 1`;
    } else {
        loadMoreBtn.innerHTML = `Load Next Page <span class="material-symbols-outlined animate-wave">expand_more</span>`;
    }
    
    // Animate page change
    animatePageTransition();
}

function updatePageButtons() {
    pageBtns.forEach(btn => {
        btn.classList.remove('active', 'bg-primary');
        btn.classList.add('bg-[#2e2839]');
        if (parseInt(btn.dataset.page) === currentPage) {
            btn.classList.add('active', 'bg-primary');
            btn.classList.remove('bg-[#2e2839]');
        }
    });
}

function updatePageDisplay() {
    pageNumberDisplay.textContent = currentPage;
    
    let startIndex = (currentPage - 1) * STYLES_PER_PAGE + 1;
    let endIndex = startIndex + getStylesCountForPage(currentPage) - 1;
    
    if (currentPage === TOTAL_PAGES) {
        endIndex = allStyleTemplates.length;
    }
    
    stylesRangeDisplay.textContent = `${startIndex}-${endIndex}`;
}

function getStylesCountForPage(page) {
    if (page <= 6) {
        return 50;
    } else {
        return 60; // Page 7 has 60 styles
    }
}

function generatePage(page) {
    stylesGrid.innerHTML = '';
    
    const startIndex = (page - 1) * STYLES_PER_PAGE;
    let endIndex = startIndex + STYLES_PER_PAGE;
    
    if (page === TOTAL_PAGES) {
        endIndex = allStyleTemplates.length; // 360
    }
    
    const stylesForPage = allStyleTemplates.slice(startIndex, endIndex);
    
    stylesForPage.forEach((template, index) => {
        const globalIndex = startIndex + index;
        const styledName = template.replace(/{name}/g, currentName);
        const categoryIndex = globalIndex % styleCategories.length;
        const category = styleCategories[categoryIndex];
        
        createStyleCard(styledName, category, globalIndex + 1, globalIndex);
    });
    
    currentStylesEl.textContent = stylesForPage.length;
}

function createStyleCard(styledName, category, index, globalIndex) {
    const colorClass = {
        green: { bg: 'from-green-900/40', text: 'text-green-400', badge: 'bg-green-500/10 text-green-500 border-green-500/20' },
        blue: { bg: 'from-blue-900/40', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
        pink: { bg: 'from-pink-900/40', text: 'text-pink-400', badge: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
        amber: { bg: 'from-amber-900/40', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        purple: { bg: 'from-purple-900/40', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
        slate: { bg: 'from-slate-800', text: 'text-white', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
    }[category.color];
    
    const isFavorite = favorites.includes(globalIndex);
    
    const card = document.createElement('div');
    card.className = `group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-[#1f1b27] border border-slate-200 dark:border-[#2e2839] card-glow transition-all duration-300 animate-card-enter`;
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
        <div class="h-28 lg:h-32 w-full relative bg-gradient-to-br ${colorClass.bg} to-slate-900 overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${category.color}-500 via-transparent to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl lg:text-4xl font-black text-${category.color}-500/30 blur-sm select-none">STYLE ${index}</span>
            </div>
        </div>
        <div class="p-4 lg:p-6">
            <div class="flex justify-between items-start mb-3 lg:mb-4">
                <span class="px-2 py-1 rounded ${colorClass.badge} text-[10px] font-bold uppercase tracking-widest">
                    ${category.name}
                </span>
                <div class="flex gap-2">
                    <button class="p-2 rounded-lg bg-slate-200 dark:bg-[#2e2839] text-[#a69cba] hover:text-white transition-all hover:scale-110 animate-scale-in favorite-btn" data-index="${globalIndex}">
                        <span class="material-symbols-outlined text-[18px] lg:text-[20px]" style="font-variation-settings: 'FILL' ${isFavorite ? '1' : '0'}">favorite</span>
                    </button>
                </div>
            </div>
            <!-- PERFECT CENTER NAME DISPLAY -->
            <div class="perfect-center">
                <div class="name-display ${colorClass.text} auto-resize-text" style="font-size: ${calculateFontSize(styledName)};" data-text="${styledName}">
                    ${styledName}
                </div>
            </div>
            <div class="flex gap-2 lg:gap-3 mt-3 lg:mt-4">
                <button class="flex-1 bg-primary text-white font-bold py-2 rounded-lg text-xs lg:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-1 lg:gap-2 copy-btn hover:animate-pulse" data-text="${styledName}">
                    <span class="material-symbols-outlined text-xs lg:text-sm">content_copy</span> Copy
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const copyBtn = card.querySelector('.copy-btn');
    const favoriteBtn = card.querySelector('.favorite-btn');
    
    copyBtn.addEventListener('click', () => {
        const textToCopy = copyBtn.getAttribute('data-text');
        copyToClipboard(textToCopy, copyBtn);
    });
    
    favoriteBtn.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite-btn');
        const index = parseInt(btn.dataset.index);
        const icon = btn.querySelector('.material-symbols-outlined');
        
        if (favorites.includes(index)) {
            // Remove from favorites
            favorites = favorites.filter(fav => fav !== index);
            icon.style.fontVariationSettings = "'FILL' 0";
            showToast("Removed", "Style removed from favorites");
        } else {
            // Add to favorites
            favorites.push(index);
            icon.style.fontVariationSettings = "'FILL' 1";
            showToast("Added!", "Style added to favorites");
        }
        
        // Save to localStorage
        localStorage.setItem('styleFavorites', JSON.stringify(favorites));
        
        // Animate the button
        animateButton(btn);
    });
    
    stylesGrid.appendChild(card);
}

function calculateFontSize(text) {
    // Calculate optimal font size based on text length
    const length = text.length;
    let fontSize = '1.25rem'; // Default for desktop
    
    if (length > 30) fontSize = '1rem';
    if (length > 40) fontSize = '0.9rem';
    if (length > 50) fontSize = '0.8rem';
    if (length > 60) fontSize = '0.7rem';
    if (length > 70) fontSize = '0.6rem';
    
    // Mobile adjustments
    if (window.innerWidth < 768) {
        if (length > 20) fontSize = '0.9rem';
        if (length > 30) fontSize = '0.8rem';
        if (length > 40) fontSize = '0.7rem';
        if (length > 50) fontSize = '0.6rem';
    }
    
    if (window.innerWidth < 480) {
        if (length > 15) fontSize = '0.8rem';
        if (length > 25) fontSize = '0.7rem';
        if (length > 35) fontSize = '0.6rem';
    }
    
    return fontSize;
}

function filterStyles(searchTerm) {
    const cards = document.querySelectorAll('#stylesGrid > div');
    cards.forEach(card => {
        const styleText = card.querySelector('.name-display').textContent.toLowerCase();
        const categoryText = card.querySelector('span').textContent.toLowerCase();
        
        if (styleText.includes(searchTerm) || categoryText.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('animate-scale-in');
        } else {
            card.style.display = 'none';
        }
    });
}

function copyToClipboard(text, button) {
    // First try modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Show success feedback
                showToast("Copied!", "Style copied to clipboard");
                animateCopyButton(button);
            })
            .catch(err => {
                // Fallback to old method if modern API fails
                fallbackCopyText(text, button);
            });
    } else {
        // Use fallback method for non-secure contexts
        fallbackCopyText(text, button);
    }
}

function fallbackCopyText(text, button) {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    
    // Focus and select the text
    textArea.focus();
    textArea.select();
    
    try {
        // Try to execute the copy command
        const successful = document.execCommand('copy');
        if (successful) {
            showToast("Copied!", "Style copied to clipboard");
            animateCopyButton(button);
        } else {
            showToast("Failed", "Please copy manually: " + text.substring(0, 30) + "...");
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast("Error", "Failed to copy to clipboard");
    } finally {
        // Clean up
        document.body.removeChild(textArea);
    }
}

function animateCopyButton(button) {
    if (!button) return;
    
    const originalText = button.innerHTML;
    const originalBg = button.style.background;
    
    // Change to success state
    button.innerHTML = '<span class="material-symbols-outlined text-xs lg:text-sm">check</span> Copied!';
    button.classList.add('animate-copy-success');
    button.style.background = '#00b894';
    
    // Revert after 2 seconds
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('animate-copy-success');
        button.style.background = originalBg;
    }, 2000);
}

function showToast(title, message) {
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
    }, 3000);
}

function animateButton(button) {
    button.classList.add('scale-105');
    setTimeout(() => {
        button.classList.remove('scale-105');
    }, 300);
}

function animatePageTransition() {
    const grid = document.getElementById('stylesGrid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        grid.style.transition = 'all 0.4s ease-out';
    }, 100);
}

function animateStats() {
    const stats = document.querySelectorAll('.glass-panel');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.classList.add('animate-scale-in');
        }, index * 100);
    });
}

// Auto-resize font on window resize
window.addEventListener('resize', () => {
    const nameDisplays = document.querySelectorAll('.name-display');
    nameDisplays.forEach(display => {
        const text = display.textContent;
        display.style.fontSize = calculateFontSize(text);
    });
});

// Initialize first page
changePage(1);
