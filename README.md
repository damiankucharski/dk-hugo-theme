# DK Hugo Theme

A clean, elegant Hugo theme designed for personal websites, blogs, and academic portfolios. Features a minimalist design with dark mode support, built-in search, syntax highlighting, and LaTeX support.

## Demo

[View Live Demo](https://damiankucharski.com/)

## Features

- Clean, responsive design
- Dark mode toggle
- Built-in search functionality
- Syntax highlighting with highlight.js
- LaTeX support for mathematical notation
- Tag taxonomy support
- RSS feed generation
- Mobile-friendly navigation
- Customizable menu

## Installation

### Option 1: Git Submodule (Recommended)

Navigate to your Hugo site directory and add the theme as a submodule:

```bash
git submodule add https://github.com/damiankucharski/dk-hugo-theme.git themes/dk-hugo-theme
```

### Option 2: Clone

Clone the theme directly into your themes directory:

```bash
cd themes
git clone https://github.com/damiankucharski/dk-hugo-theme.git
```

### Option 3: Download

Download the theme as a zip file and extract it into your `themes/` directory.

## Configuration

Update your site's `hugo.toml` (or `config.toml`) with the following configuration:

```toml
baseURL = 'https://example.com/'
languageCode = 'en-us'
theme = 'dk-hugo-theme'
title = "Your Site Title"

# Configure output formats
[outputs]
home = ["HTML", "RSS", "searchindex"]

[outputFormats.searchindex]
baseName = "searchindex"
mediaType = "application/json"
isPlainText = true

# Disable built-in syntax highlighting (using highlight.js instead)
[markup]
[markup.highlight]
codeFences = false
noClasses = false

# Enable LaTeX support
[markup.goldmark.renderer]
unsafe = true

# Configure table of contents
[markup.tableOfContents]
endLevel = 3
ordered = false
startLevel = 2

# Configure menu
[menu]
[[menu.main]]
identifier = "home"
name = "Home"
url = "/"
weight = 1

[[menu.main]]
identifier = "projects"
name = "Projects"
url = "/projects/"
weight = 2

[[menu.main]]
identifier = "posts"
name = "Posts"
url = "/posts/"
weight = 3

[[menu.main]]
identifier = "tags"
name = "Tags"
url = "/tags/"
weight = 4

# Configure taxonomies
[taxonomies]
category = "categories"
tag = "tags"

# Theme parameters
[params]
author = "Your Name"
description = "Your site description"
email = "your.email@example.com"
github = "https://github.com/yourusername"
linkedin = "https://www.linkedin.com/in/yourusername/"
# Optional parameters
# googlescholar = "https://scholar.google.com/citations?user=..."
# orcid = "0000-0000-0000-0000"
```

## Content Structure

Create content sections as needed:

```bash
hugo new posts/my-first-post.md
hugo new projects/my-project.md
hugo new papers/my-paper.md
```

### Front Matter Example

```yaml
---
title: "My First Post"
date: 2024-01-15
draft: false
tags: ["hugo", "web development"]
---

Your content here...
```

## Customization

### Colors and Styling

The theme uses CSS variables for easy customization. Edit `assets/css/main.css` to modify:

- Color scheme (light and dark modes)
- Typography
- Spacing and layout
- Transitions

### Dark Mode

The theme includes a built-in dark mode toggle. Users can switch between light and dark themes, and their preference is saved in localStorage.

### Search

The theme includes client-side search functionality powered by Fuse.js. The search index is automatically generated from your content.

## Content Types

The theme supports the following content types out of the box:

- **Home**: Landing page (`content/_index.md`)
- **Posts**: Blog posts (`content/posts/`)
- **Projects**: Project showcases (`content/projects/`)
- **Papers**: Academic papers (`content/papers/`)
- **Pages**: General pages

## Development

To run the theme locally for development:

```bash
hugo server -D
```

## License

This theme is released under the MIT License. See [LICENSE](LICENSE) for details.

## Support

If you encounter any issues or have questions:

- [Open an issue](https://github.com/damiankucharski/dk-hugo-theme/issues)
- [View documentation](https://github.com/damiankucharski/dk-hugo-theme)

## Credits

Created by [Damian Kucharski](https://damiankucharski.com/)
