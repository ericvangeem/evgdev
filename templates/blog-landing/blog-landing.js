import { getMetadata } from '../../scripts/aem.js';

/**
 * Blog Landing Page Template JavaScript
 * Enhanced functionality for blog listing and discovery
 */

// Enhanced search functionality
let searchTimeout;
function initBlogSearch() {
  const searchInput = document.querySelector('.blog-search input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterBlogPosts(e.target.value);
    }, 300);
  });

  // Add search icon and clear button
  const searchContainer = searchInput.parentElement;
  searchContainer.style.position = 'relative';
  
  // Search icon
  const searchIcon = document.createElement('span');
  searchIcon.innerHTML = '🔍';
  searchIcon.style.cssText = `
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.6;
  `;
  searchContainer.appendChild(searchIcon);
  
  // Adjust input padding for icon
  searchInput.style.paddingLeft = '2.5rem';
  
  // Clear button
  const clearButton = document.createElement('button');
  clearButton.innerHTML = '✕';
  clearButton.type = 'button';
  clearButton.style.cssText = `
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--dark-color);
    cursor: pointer;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    filterBlogPosts('');
    searchInput.focus();
  });
  
  searchContainer.appendChild(clearButton);
  
  // Show/hide clear button
  searchInput.addEventListener('input', () => {
    clearButton.style.opacity = searchInput.value ? '0.6' : '0';
  });
  
  clearButton.addEventListener('mouseenter', () => {
    if (searchInput.value) clearButton.style.opacity = '1';
  });
  
  clearButton.addEventListener('mouseleave', () => {
    if (searchInput.value) clearButton.style.opacity = '0.6';
  });
}

// Filter blog posts based on search term
function filterBlogPosts(searchTerm) {
  const articles = document.querySelectorAll('.recent-blogs article');
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  articles.forEach(article => {
    const title = article.querySelector('h3')?.textContent?.toLowerCase() || '';
    const description = article.querySelector('p')?.textContent?.toLowerCase() || '';
    const tags = Array.from(article.querySelectorAll('.blog-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
    
    const matches = title.includes(normalizedSearch) || 
                   description.includes(normalizedSearch) || 
                   tags.includes(normalizedSearch);
    
    if (matches || !normalizedSearch) {
      article.style.display = '';
      article.classList.remove('filtered-out');
    } else {
      article.style.display = 'none';
      article.classList.add('filtered-out');
    }
  });
  
  // Update results count
  updateSearchResults(searchTerm);
}

// Update search results count
function updateSearchResults(searchTerm) {
  const articles = document.querySelectorAll('.recent-blogs article:not(.filtered-out)');
  const totalArticles = document.querySelectorAll('.recent-blogs article').length;
  
  let resultsElement = document.querySelector('.search-results');
  if (!resultsElement) {
    resultsElement = document.createElement('div');
    resultsElement.className = 'search-results';
    resultsElement.style.cssText = `
      text-align: center;
      margin: 1rem 0;
      color: var(--text-secondary);
      font-size: var(--body-font-size-s);
    `;
    
    const recentBlogsSection = document.querySelector('.recent-blogs');
    if (recentBlogsSection) {
      recentBlogsSection.insertBefore(resultsElement, recentBlogsSection.querySelector('article, .blog-grid'));
    }
  }
  
  if (searchTerm) {
    const visibleCount = articles.length;
    resultsElement.textContent = `Showing ${visibleCount} of ${totalArticles} posts for "${searchTerm}"`;
    resultsElement.style.display = 'block';
  } else {
    resultsElement.style.display = 'none';
  }
}

// Add reading time to blog posts
function addReadingTimeToCards() {
  const articles = document.querySelectorAll('.recent-blogs article');
  
  articles.forEach(article => {
    // Skip if already has reading time
    if (article.querySelector('.blog-post-read-time')) return;
    
    const description = article.querySelector('p')?.textContent || '';
    const wordCount = description.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 50)); // Faster reading for descriptions
    
    let metaContainer = article.querySelector('.blog-post-meta');
    if (!metaContainer) {
      metaContainer = document.createElement('div');
      metaContainer.className = 'blog-post-meta';
      article.appendChild(metaContainer);
    }
    
    const readingTimeElement = document.createElement('span');
    readingTimeElement.className = 'blog-post-read-time';
    readingTimeElement.textContent = `${readingTime} min read`;
    metaContainer.appendChild(readingTimeElement);
  });
}

// Add publication dates to blog posts (mock data for demo)
function addPublicationDates() {
  const articles = document.querySelectorAll('.recent-blogs article');
  
  articles.forEach((article, index) => {
    // Skip if already has publication date
    if (article.querySelector('.blog-post-date')) return;
    
    // Mock dates - in real implementation, this would come from metadata
    const daysAgo = (index + 1) * 7;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    let metaContainer = article.querySelector('.blog-post-meta');
    if (!metaContainer) {
      metaContainer = document.createElement('div');
      metaContainer.className = 'blog-post-meta';
      article.appendChild(metaContainer);
    }
    
    const dateElement = document.createElement('span');
    dateElement.className = 'blog-post-date';
    dateElement.textContent = formattedDate;
    metaContainer.insertBefore(dateElement, metaContainer.firstChild);
  });
}

// Lazy loading for blog posts
function initLazyLoading() {
  const loadMoreButton = document.querySelector('.load-more button');
  if (!loadMoreButton) return;
  
  let currentPage = 1;
  const postsPerPage = 6;
  
  loadMoreButton.addEventListener('click', () => {
    // Simulate loading more posts
    loadMoreButton.textContent = 'Loading...';
    loadMoreButton.disabled = true;
    
    setTimeout(() => {
      // In real implementation, this would fetch new posts
      currentPage++;
      loadMoreButton.textContent = 'Load More Posts';
      loadMoreButton.disabled = false;
      
      // Hide button after loading 3 pages (demo)
      if (currentPage >= 3) {
        loadMoreButton.parentElement.style.display = 'none';
      }
    }, 1000);
  });
}

// Keyboard navigation for blog posts
function initKeyboardNavigation() {
  const articles = document.querySelectorAll('.recent-blogs article');
  let currentIndex = -1;
  
  document.addEventListener('keydown', (e) => {
    // Only on blog landing pages
    if (!document.body.classList.contains('blog-landing')) return;
    
    // Arrow keys to navigate posts
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (e.key === 'ArrowDown') {
        currentIndex = Math.min(currentIndex + 1, articles.length - 1);
      } else {
        currentIndex = Math.max(currentIndex - 1, 0);
      }
      
      // Remove previous focus
      articles.forEach(article => article.classList.remove('keyboard-focused'));
      
      // Add focus to current article
      if (currentIndex >= 0 && articles[currentIndex]) {
        articles[currentIndex].classList.add('keyboard-focused');
        articles[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Enter to open focused post
    if (e.key === 'Enter' && currentIndex >= 0 && articles[currentIndex]) {
      const link = articles[currentIndex].querySelector('h3 a');
      if (link) link.click();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
      const searchInput = document.querySelector('.blog-search input');
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        filterBlogPosts('');
      }
    }
    
    // Forward slash to focus search
    if (e.key === '/' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      const searchInput = document.querySelector('.blog-search input');
      if (searchInput) searchInput.focus();
    }
  });
}

// Add visual enhancements
function addVisualEnhancements() {
  // Add intersection observer for animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('blog-post-enter');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all blog posts
  document.querySelectorAll('.recent-blogs article').forEach(article => {
    observer.observe(article);
  });
  
  // Add hover effects for better interactivity
  document.querySelectorAll('.recent-blogs article').forEach(article => {
    const link = article.querySelector('h3 a');
    if (link) {
      article.addEventListener('mouseenter', () => {
        link.style.color = 'var(--link-hover-color)';
      });
      
      article.addEventListener('mouseleave', () => {
        link.style.color = 'var(--text-color)';
      });
    }
  });
}

// Initialize blog grid layout
function initBlogGrid() {
  const articles = document.querySelectorAll('.recent-blogs article');
  if (articles.length <= 1) return;
  
  // Create grid container if multiple posts exist
  const recentBlogsSection = document.querySelector('.recent-blogs');
  const gridContainer = document.createElement('div');
  gridContainer.className = 'blog-grid';
  
  // Move articles to grid
  articles.forEach(article => {
    gridContainer.appendChild(article);
  });
  
  recentBlogsSection.appendChild(gridContainer);
}

// Add search controls if not present
function addSearchControls() {
  const recentBlogsSection = document.querySelector('.recent-blogs');
  if (!recentBlogsSection || document.querySelector('.blog-controls')) return;
  
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'blog-controls';
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'blog-search';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search blog posts...';
  searchInput.setAttribute('aria-label', 'Search blog posts');
  
  searchContainer.appendChild(searchInput);
  controlsContainer.appendChild(searchContainer);
  
  // Insert before the first article or grid
  const firstContent = recentBlogsSection.querySelector('article, .blog-grid');
  if (firstContent) {
    recentBlogsSection.insertBefore(controlsContainer, firstContent);
  }
}

// Initialize blog landing functionality
function decorate(main) {
  if (!document.body.classList.contains('blog-landing')) return;
  
  // Add search controls
  addSearchControls();
  
  // Initialize grid layout
  initBlogGrid();
  
  // Initialize search functionality
  initBlogSearch();
  
  // Add metadata to posts
  addReadingTimeToCards();
  addPublicationDates();
  
  // Initialize interactive features
  initLazyLoading();
  initKeyboardNavigation();
  addVisualEnhancements();
  
  // Add keyboard shortcuts info (optional)
  console.log('Blog Landing Keyboard Shortcuts:', {
    'Arrow Up/Down': 'Navigate posts',
    'Enter': 'Open focused post',
    '/': 'Focus search',
    'Escape': 'Clear search'
  });
}

// Export the decorate function for Edge Delivery Services
export default function decorateMain(main) {
  decorate(main);
}