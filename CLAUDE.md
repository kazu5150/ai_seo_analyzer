# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that analyzes websites using Playwright for web crawling and OpenAI API for intelligent SEO keyword generation. The application crawls websites recursively, extracts content, and generates contextual SEO keywords with explanations.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx playwright install` - Install Playwright browsers (required before first use)

## Environment Setup

Required environment variables in `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key
SHOW_BROWSER=true  # Optional: Controls default browser visibility
```

## Architecture

### Core Components

**Frontend** (`src/app/page.tsx`):
- Single-page React application with URL input and browser visibility toggle
- Displays keyword results in accordion format with expandable explanations
- Uses `KeywordWithReason` type for structured keyword data

**API Layer** (`src/app/api/analyze/route.ts`):
- Next.js API route handling POST requests with `url` and `showBrowser` parameters
- Calls the crawler service and returns JSON response

**Crawler Service** (`src/lib/crawler.ts`):
- Main orchestration function: `analyzeWebsite(url, showBrowserOverride?)`
- Uses Playwright to crawl websites recursively (max 5 pages, depth 2)
- Integrates with OpenAI API for intelligent keyword extraction
- Browser visibility controlled by parameter or environment variable
- Includes fallback keyword extraction using frequency analysis

**Progress System** (`src/lib/progress-emitter.ts`):
- Event emitter for real-time crawling progress updates
- Emits status messages during browser launch, page loading, and AI analysis

### Data Flow

1. User submits URL and browser visibility preference
2. Frontend sends POST to `/api/analyze` with parameters
3. API calls `analyzeWebsite()` with browser settings
4. Playwright crawls website collecting page content (titles, meta descriptions, headings, text)
5. Content sent to OpenAI API with specialized SEO prompt requesting JSON format
6. AI returns keywords with business-focused explanations
7. Results displayed in expandable UI with reasoning

### Browser Visualization

The application supports two modes:
- **Headless mode** (default): Playwright runs invisibly
- **Visual mode**: Browser window opens showing real-time crawling process with 300ms delays

Users can toggle this via checkbox, overriding the `SHOW_BROWSER` environment variable.

### OpenAI Integration

Uses GPT-3.5-turbo with specialized prompt engineering focusing on:
- Business value propositions
- Target customer search intent
- Long-tail keyword combinations
- Competitive analysis considerations

Fallback system uses frequency-based keyword extraction if OpenAI API fails.

## Key Type Definitions

- `KeywordWithReason`: Contains `keyword` string and `reason` explanation
- `PageContent`: Structured data from crawled pages (url, title, content, metaDescription, headings)

## Testing and Browser Setup

Before first use, run `npx playwright install` to download required browser binaries. The application will fail with clear error messages if browsers are not installed.