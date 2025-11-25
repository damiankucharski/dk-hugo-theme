// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const lightSyntaxTheme = document.getElementById('light-syntax-theme');
  const darkSyntaxTheme = document.getElementById('dark-syntax-theme');
  
  // Function to toggle syntax highlighting theme
  const toggleSyntaxTheme = (theme) => {
    if (theme === 'dark') {
      lightSyntaxTheme.disabled = true;
      darkSyntaxTheme.disabled = false;
    } else {
      lightSyntaxTheme.disabled = false;
      darkSyntaxTheme.disabled = true;
    }
  };
  
  if (themeToggle) {
    // Get current theme
    const getCurrentTheme = () => {
      return document.documentElement.getAttribute('data-theme');
    };

    // Set theme
    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      toggleSyntaxTheme(theme);
    };

    // Initialize syntax theme
    const currentTheme = getCurrentTheme();
    toggleSyntaxTheme(currentTheme);

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
      const currentTheme = getCurrentTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
  
  // Initialize KaTeX for LaTeX rendering if available
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
  
  // Add copy buttons to code blocks
  const addCopyButtons = () => {
    document.querySelectorAll('pre').forEach(pre => {
      // Only add button if it doesn't already have one
      if (!pre.querySelector('.copy-button')) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        
        button.addEventListener('click', () => {
          const code = pre.querySelector('code').textContent;
          navigator.clipboard.writeText(code).then(() => {
            // Visual feedback
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy: ', err);
            button.textContent = 'Error!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          });
        });
        
        pre.appendChild(button);
      }
    });
  };
  
  // Add copy buttons when the page loads
  addCopyButtons();
  
  // Re-add copy buttons when the theme changes (in case new content was loaded)
  document.addEventListener('themeChanged', addCopyButtons);
  
  // Citation popup functionality
  const setupCitationPopup = () => {
    // Create popup element if it doesn't exist
    if (!document.querySelector('.citation-popup')) {
      const popupHTML = `
        <div class="citation-popup">
          <div class="citation-content">
            <button class="citation-close">&times;</button>
            <h3 class="citation-title">BibTeX Citation</h3>
            <div class="citation-text"></div>
            <button class="copy-citation-button">Copy to Clipboard</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    const popup = document.querySelector('.citation-popup');
    const closeBtn = popup.querySelector('.citation-close');
    const copyBtn = popup.querySelector('.copy-citation-button');
    const citationText = popup.querySelector('.citation-text');
    
    // Close popup when clicking the close button
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
    });
    
    // Close popup when clicking outside the content
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('active');
      }
    });
    
    // Copy citation to clipboard
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(citationText.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        copyBtn.textContent = 'Error!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      });
    });
    
    // Helper function to extract first author's last name for citation key
    const getFirstAuthorLastName = (authorString) => {
      if (!authorString) return 'Unknown';

      // Split by 'and' or comma to get individual authors
      const firstAuthor = authorString
        .split(/\s+and\s+|,/i)[0]
        .trim();

      if (!firstAuthor) return 'Unknown';

      // Handle different name formats:
      // "First Last" -> "Last"
      // "Last, First" -> "Last"
      // "First Middle Last" -> "Last"
      // "von Last, First" -> "Last" (handles particles like 'van', 'von', 'de')

      if (firstAuthor.includes(',')) {
        // Format: "Last, First" or "von Last, First"
        return firstAuthor.split(',')[0].trim().split(' ').pop();
      } else {
        // Format: "First Last" or "First Middle Last"
        // Take the last word as the last name
        const parts = firstAuthor.split(/\s+/);
        return parts[parts.length - 1];
      }
    };

    // Add click event to all cite buttons
    document.querySelectorAll('.cite-button').forEach(button => {
      button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const authors = button.getAttribute('data-authors');
        const year = button.getAttribute('data-year');
        const journal = button.getAttribute('data-journal');
        const doi = button.getAttribute('data-doi');

        // Generate BibTeX citation key
        const authorLastName = getFirstAuthorLastName(authors);
        const citationKey = `${authorLastName}${year}`;

        const bibtex = `@article{${citationKey},
  title = {${title}},
  author = {${authors}},
  journal = {${journal}},
  year = {${year}}${doi ? `,
  doi = {${doi}}` : ''}
}`;

        // Update popup content and show it
        citationText.textContent = bibtex;
        popup.classList.add('active');
      });
    });
  };
  
  // Setup citation popup when the page loads
  setupCitationPopup();
});
