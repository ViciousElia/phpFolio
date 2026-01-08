# PHP Folio
**An experiment in PHP-powered static site generation with dynamic capabilities.**

## Overview
PHP Folio transforms FruitFolio into an Astro-like build experience using PHP for the codebase and structure. This hybrid approach combines the best of both worlds: the developer experience of modern static site generators with the flexibility and familiarity of PHP.

## Core Philosophy
**"Set and forget with PHP at the helm."** Create content in simple formats (Markdown + YAML), let PHP handle the rendering, and deploy a site that's both performant and maintainable.

## Architecture

### 🏗️ The Three-Layer System
```
Content Layer (.md files with YAML frontmatter)
    ↓
Processing Layer (PHP Validators + Parsers)
    ↓
Delivery Layer (Cached HTML + Optional Dynamic Routes)
```

### 🔄 Content Flow
1. **Authoring**: Write in Markdown with YAML metadata
2. **Caching**: PHP validators parse once, cache intelligently
3. **Rendering**: PHP templates with output buffering for clean HTML
4. **Serving**: Static HTML with optional PHP-powered dynamic features

## Key Components

### 📚 Content Types
- **Quickies**: Short-form content with tags, dates, word counts
- **Code Tools**: Utilities with multiple language implementations
- **Publications**: Books with metadata and Amazon links
- **Samples**: Professional writing samples with multiple formats

### 🧠 Smart Caching System
```php
// Auto-refresh logic:
1. Weekly full refresh (even if count matches)
2. File count mismatch → immediate refresh
3. Cache miss → rebuild on demand
4. File changes detected → auto-invalidate
```

### 🛣️ Routing System
- **Path-based routing**: Clean URLs without query parameters
- **File-driven routes**: Content exists → route exists
- **404/500 handling**: Graceful error pages with personality
- **Subdomain support**: Separate projects (like `rose.fruitfolio.com`)

## Technical Stack

### ✅ What It Uses
- **PHP 8+** (No frameworks, pure PHP)
- **Markdown** (via Parsedown)
- **YAML** (via Spyc)
- **JSON** (for caching and path management)
- **HTML/CSS** (Vanilla, no CSS frameworks)

### 🚫 What It Avoids
- JavaScript frameworks
- CSS frameworks (Bootstrap, Tailwind)
- Composer dependencies (except Parsedown/Spyc, which are bundled)
- Database systems
- Complex build tools

## Development Experience

### 📝 Authoring Content
Depending on the types of content being built, you can establish your own style, naming convention, relevant frontmatter, and more.

The two pre-config types are available, which support their own specific page variables and behaviour. When adding a new content type, one need only
- Extend the AbstractValidator class (`lib/AbstractValidator.php`)
- Create a new page renderer in `pages` (there's a rough template at `pages/templates/ZZ_ContentRendererTemplate.php`)
- Add the content type to `routes.php` (follow the examples there, customise for your needs)
- Optionally, add it to the navigation (`components/Navigation.php`)

Then you can start authoring content in the relevant path folder using a format such as:

```markdown
---
title: "My Quickie"
date: "2024-01-15"
tags: [php, web, experiment]
words: 450
---
# My Content

Write in Markdown, get a webpage.
```

### 🎨 Theming & Layout
- **Single layout system**: Consistent header/footer
- **CSS variables**: For theming
- **Component-based**: Reusable PHP components
- **Mobile-first**: Responsive design
- **Local CSS Snippets**: To prevent bloat

### ⚡ Performance Features
- **Lazy image loading**: Built into templates (don't know if I actually did this)
- **Intelligent caching**: Weekly validation
- **Minimal dependencies**: Fast server-side rendering
- **Progressive enhancement**: Works without JavaScript except when necessary (code tools)

## Project Structure
```
fruitfolio/
├── components/       # UI components
├── content/          # All content (Markdown + YAML)
│   ├── quickies/     # Short stories
│   ├── code/         # Code tools
│   ├── templates/    # Templates for content, generally
│   └── ...           # Other content types as needed
├── data/             # JSON cache files
├── lib/              # Libraries and non-component tools
├── pages/            # Page templates
│   └── templates/    # Templates for page renderers, generally
├── public/           # Static assets
└── styles/           # CSS
```

## Why This Approach?

### 🎯 Problem Being Solved
Traditional PHP sites often become spaghetti code. Modern JS frameworks add complexity. PHP Folio offers:
- **Simplicity**: Just PHP and Markdown
- **Maintainability**: Clear separation of concerns
- **Performance**: Cached rendering, minimal runtime
- **Portability**: No database, easy to deploy anywhere

### 🔄 Compared to Alternatives
- **vs WordPress**: No database, no plugins, just content
- **vs Astro/Next.js**: No Node.js, no build step, PHP knowledge transfers
- **vs Traditional PHP**: Structured, cache-aware, content-focused

## Getting Started

### 🚀 Quick Start
1. Clone the repository
2. Add content to `content/` directories
3. Start PHP server (or deploy to web)
4. Visit the site (cache builds automatically)
5. Customize templates as needed

### 📦 Deployment Options
- **Traditional hosting**: Any PHP-enabled host
- **Static export**: Pre-render to HTML (optional)
- **Docker**: Containerized PHP environment
- **GitHub Pages**: With PHP pre-rendering

## The Experiment

### 🧪 What We're Testing
1. **Can PHP compete with modern static site generators?**
2. **Is caching + Markdown sufficient for content sites?**
3. **Can we avoid JavaScript frameworks entirely?**
4. **Does this approach scale for personal/project sites?**

### 📈 Success Metrics
- **Developer happiness**: Less time fighting frameworks
- **Site performance**: Fast load times, good Lighthouse scores
- **Content velocity**: Easy to add/update content
- **Maintenance burden**: Low ongoing effort

## Roadmap

### 🗺️ Planned Features
- [ ] RSS/Atom feeds generation
- [ ] Sitemap auto-generation
- [ ] Image optimization pipeline
- [ ] Search functionality (static or dynamic)
- [ ] Comment system (optional, lightweight)
- [ ] Export to static HTML option
- [ ] Image Gallery functionality with lightbox if possible

### 🔄 Iteration Principles
1. **Start simple**: Add complexity only when needed
2. **PHP first**: Use PHP's strengths (templates, file handling)
3. **Cache intelligently**: Balance freshness with performance
4. **Keep it readable**: Code should be understandable at 3 AM (or commented well)

## Contributing

### 👥 Who This Is For
- **PHP developers** wanting a simple content system
- **Writers** who want control over their presentation
- **Experimenters** interested in alternative web approaches
- **Minimalists** who believe less is more

### 🤝 How to Contribute
1. Use it for your own site
2. Share your custom components
3. Suggest improvements to the caching system
   1. Currently, only caching routes, not served pages
   2. Currently, only updates when stale or counts mismatch
4. Create new content type validators
5. Suggest improvements to tools and components

## Philosophy

### 💭 Core Beliefs
- **Content is king**: Tools should get out of the way
- **Simplicity beats features**: Do one thing well
- **PHP is enough**: No need to jump to JavaScript for everything
- **Progressive enhancement**: Start static, add dynamic as needed

### 🎨 Design Principles
1. **Zero-config where possible**: Sensible defaults
2. **Explicit over implicit**: Clear what's happening
3. **Portable content**: Markdown + YAML = future-proof
4. **Graceful degradation**: Works even when things break

---

**PHP Folio**: Because sometimes the right tool for the job is the one you already know, used in a way you haven't tried before.