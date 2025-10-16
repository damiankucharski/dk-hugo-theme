document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let searchIndex = [];
  let searchDebounceTimeout = null;
  const MIN_SEARCH_LENGTH = 2;

  // Clear search results when clicking outside
  document.addEventListener('click', function(event) {
    if (event.target !== searchInput && event.target !== searchResults && !searchResults.contains(event.target)) {
      searchResults.style.display = 'none';
    }
  });

  // Show search results when input is focused and has value
  searchInput.addEventListener('focus', function() {
    if (this.value.length >= MIN_SEARCH_LENGTH) {
      searchResults.style.display = 'block';
    }
  });

  // Fetch the search index
  fetch(window.location.origin + '/searchindex.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch search index: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      searchIndex = data;
      console.log('Search index loaded with', searchIndex.length, 'items');
    })
    .catch(error => {
      console.error('Error fetching search index:', error);
    });

  // Handle input
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      
      // Clear previous timeout
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }
      
      // Hide results if query is too short
      if (query.length < MIN_SEARCH_LENGTH) {
        searchResults.style.display = 'none';
        return;
      }
      
      // Debounce search to avoid excessive filtering
      searchDebounceTimeout = setTimeout(() => {
        searchResults.innerHTML = ''; // Clear previous results
        searchResults.style.display = 'block';
        
        // Build regex from search terms for more flexible matching
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
        const searchRegexes = searchTerms.map(term => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        
        // Filter results by checking each regex against title, content, and tags
        const filteredResults = searchIndex.filter(item => {
          const titleMatch = searchRegexes.every(regex =>
            regex.test(item.title || '')
          );
          
          const contentMatch = searchRegexes.some(regex =>
            regex.test(item.contents || '') || regex.test(item.summary || '')
          );
          
          let tagMatch = false;
          if (item.tags && Array.isArray(item.tags)) {
            tagMatch = searchRegexes.some(regex =>
              item.tags.some(tag => regex.test(tag))
            );
          }
          
          return titleMatch || contentMatch || tagMatch;
        });

        // Sort results: title matches first, then content
        filteredResults.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          
          // First sort by title matches
          const aContainsQuery = aTitle.includes(query);
          const bContainsQuery = bTitle.includes(query);
          
          if (aContainsQuery && !bContainsQuery) return -1;
          if (!aContainsQuery && bContainsQuery) return 1;
          
          // Then alphabetically
          return aTitle.localeCompare(bTitle);
        });
        
        // Limit result count to avoid overwhelming the user
        const limitedResults = filteredResults.slice(0, 10);

        // Display results
        if (limitedResults.length > 0) {
          limitedResults.forEach(item => {
            const resultElement = document.createElement('div');
            
            // Create excerpt of matching content if available
            let excerpt = '';
            if (item.summary) {
              excerpt = item.summary.substring(0, 100).replace(/(<([^>]+)>)/gi, '') + '...';
            }
            
            // Determine item type based on permalink
            let itemType = 'page';
            if (item.permalink.includes('/posts/')) {
              itemType = 'post';
            } else if (item.permalink.includes('/papers/')) {
              itemType = 'paper';
            } else if (item.permalink.includes('/snippets/')) {
              itemType = 'snippet';
            } else if (item.permalink.includes('/projects/')) {
              itemType = 'project';
            }
            
            resultElement.innerHTML = `
              <a href="${item.permalink}">
                <strong>${item.title || 'Untitled'}</strong>
                <span class="search-result-type">${itemType}</span>
                ${excerpt ? `<div class="search-result-excerpt">${excerpt}</div>` : ''}
              </a>
            `;
            searchResults.appendChild(resultElement);
          });
          
          // Show how many results were found
          if (filteredResults.length > limitedResults.length) {
            const moreResults = document.createElement('div');
            moreResults.className = 'search-more-results';
            moreResults.textContent = `Showing top ${limitedResults.length} of ${filteredResults.length} results`;
            searchResults.appendChild(moreResults);
          }
        } else {
          searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        }
      }, 200); // 200ms debounce time
    });
  }
});