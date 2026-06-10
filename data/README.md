# Data Directory

This directory contains the content data for the portfolio, organized by locale.

## Structure

```
data/
├── types.ts          # TypeScript interfaces for all content types
├── en/               # English content
│   ├── about.json    # Personal info (name, tagline, bio, passions)
│   ├── courses.json  # Completed courses and certifications
│   ├── projects.json # Portfolio projects
│   ├── skills.json   # Technical skills by category
│   └── social.json   # Social media and contact links
└── it/               # Italian content (mirrors English structure)
    ├── about.json
    ├── courses.json
    ├── projects.json
    ├── skills.json
    └── social.json
```

## TypeScript Types

All content types are defined in `types.ts`:

- **Project**: Portfolio project with slug, title, descriptions, technologies, features, images, and links
- **Course**: Completed course/certification with provider, skills, and optional certificate URL
- **Skill**: Technical skill with category (`automation` | `blockchain` | `graphics` | `stack`), name, and description
- **AboutContent**: Personal information with name, tagline, bio paragraphs, and passions
- **SocialLinks**: LinkedIn, GitHub, and email links
- **PortfolioData**: Aggregate type combining all of the above

## Adding Content

### New Project

Add an entry to `en/projects.json` (and `it/projects.json` for Italian):

```json
{
  "slug": "my-project",
  "title": "My Project",
  "shortDescription": "Brief summary.",
  "fullDescription": "Detailed description.",
  "problem": "The problem it solves.",
  "technologies": ["Next.js", "TypeScript"],
  "features": ["Feature 1", "Feature 2"],
  "images": {
    "hero": "/images/projects/my-project-hero.png",
    "screenshots": []
  },
  "links": {
    "live": "https://example.com",
    "github": "https://github.com/user/repo"
  },
  "order": 4
}
```

### New Skill

Add an entry to `en/skills.json`:

```json
{
  "category": "stack",
  "name": "Rust",
  "icon": "rust",
  "description": "Systems programming for performance-critical applications."
}
```

### New Course

Add an entry to `en/courses.json`:

```json
{
  "id": "course-id",
  "title": "Course Title",
  "provider": "Provider Name",
  "icon": "provider-icon",
  "skills": ["Skill 1", "Skill 2"],
  "completionDate": "2024-01-01",
  "certificateUrl": "https://certificate-url.com"
}
```

## Locale Guidelines

- Keep technical terms (technology names, skill names) in English across all locales
- Translate descriptions, titles, bio text, and passions
- Both locale directories must contain the same files with matching structures
