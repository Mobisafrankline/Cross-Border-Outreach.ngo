# Data & Assets Documentation

This directory contains all centralized data for the Crossborders Outreach Ministry Inc website.

## File Structure

### `/src/data/content.ts`

Contains all data structures for:

#### 1. **Reports**
- Annual impact reports
- Financial reports
- Fields: id, year, title, type, category, size, pages, date, pdfUrl, description

#### 2. **Publications**
- Research papers, white papers, case studies, toolkits
- Fields: id, title, category, date, pages, size, pdfUrl, description, authors, tags

#### 3. **News Updates**
- Latest news and announcements
- Fields: id, title, excerpt, date, category, slug, image, content

#### 4. **Gallery Images**
- Images for the homepage carousel
- Fields: id, url, alt, category

#### 5. **Assets** (Organized Media Library)
Structured asset management system with the following categories:

##### **Heroes**
- Large banner/hero images for page headers
- Categories: hero
- Usage: Homepage hero, page banners

##### **Programs**
Organized by program type:
- `foodSupport`: Food distribution images
- `education`: Classroom and learning images
- `healthcare`: Medical outreach images
- `economic`: Economic empowerment images

##### **Team**
- Team photos and collaboration images
- Usage: Team page, about us sections

##### **Events**
- Event photos (galas, fundraisers, community gatherings)
- Usage: Events page, news items

##### **News/Press**
- Press conference and announcement images
- Usage: News articles, press releases

##### **Branding**
- Logo files and brand assets
- Includes: primary logo, white logo variations
- **Note**: Logo files should be placed in `/public/assets/` directory

#### 6. **Events**
Complete event management system with:
- Upcoming events
- Past events
- Fields: id, title, description, longDescription, date, time, location, address, category, status, ticketPrice, capacity, registered, image, organizer, contactEmail, contactPhone

## Asset Management Best Practices

### Adding New Images

1. **For External Images (Unsplash, etc.)**
   - Add URL directly to the appropriate asset category
   - Include descriptive title and tags

2. **For Uploaded Images**
   - Place files in `/public/assets/` directory
   - Reference as `/assets/filename.ext`
   - Update the assets object in `content.ts`

### Asset Categories

```typescript
assets: {
  heroes: []        // Banner images
  programs: {       // Program-specific images
    foodSupport: []
    education: []
    healthcare: []
    economic: []
  }
  team: []          // Team photos
  events: []        // Event photos
  news: []          // News/press images
  branding: []      // Logo and brand assets
}
```

### Using Assets in Components

```typescript
import { assets } from '../../data/content';

// Access specific asset
const heroImage = assets.heroes[0];
const educationImage = assets.programs.education[0];
const logo = assets.branding.find(asset => asset.id === 'logo-main');
```

## Data Update Guidelines

### Adding a Report
```typescript
{
  id: nextId,
  year: "2026",
  title: "Report Title",
  type: "Impact" | "Financial",
  category: "impact" | "financial",
  size: "2.4 MB",
  pages: 48,
  date: "Month Year",
  pdfUrl: "/reports/filename.pdf",
  description: "Brief description"
}
```

### Adding an Event
```typescript
{
  id: nextId,
  title: "Event Title",
  description: "Short description",
  longDescription: "Detailed description",
  date: "YYYY-MM-DD",
  time: "HH:MM AM/PM - HH:MM AM/PM",
  location: "Venue Name",
  address: "Full Address",
  category: "Fundraising" | "Community Outreach" | "Volunteer" | "Education" | "Food Program" | "Economic Development",
  status: "upcoming" | "past",
  ticketPrice: "Price or 'Free'",
  capacity: number,
  registered: number,
  image: "image-url",
  organizer: "Organization Name",
  contactEmail: "email@domain.com",
  contactPhone: "+1 (XXX) XXX-XXXX"
}
```

### Adding a News Item
```typescript
{
  id: nextId,
  title: "News Title",
  excerpt: "Brief excerpt",
  date: "Month DD, YYYY",
  category: "Category Name",
  slug: "url-friendly-slug",
  image: "image-url",
  content: "Full article content"
}
```

## Image Specifications

### Recommended Image Sizes

- **Hero Images**: 1920x600px minimum
- **Program Images**: 800x600px
- **Event Images**: 1200x800px
- **Gallery/Carousel**: 1080x1080px (square) or 1080x720px (landscape)
- **Team Photos**: 400x400px (square)
- **News Images**: 1200x675px (16:9 ratio)

### Image Optimization

- Use WebP format when possible for better compression
- Compress images before upload (target: < 200KB for most images)
- Use descriptive file names: `event-annual-gala-2026.jpg`
- Always include alt text for accessibility

## Translation Support

The website supports multiple languages. When adding content:
- Keep text concise for easier translation
- Avoid hardcoding text - use translation keys
- Test content in all supported languages (EN, ES, FR, PT)

## Maintenance Schedule

- **Monthly**: Update news items, add upcoming events
- **Quarterly**: Review and update program images
- **Annually**: Add new annual reports, update impact data
- **As needed**: Add publications, update team photos
