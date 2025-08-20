# Pillar Page - AI-Powered Article Platform

A modern, full-featured article publishing platform built with Next.js, Firebase, and AI integration. Features include article management, community discussions, AI reading assistance, and comprehensive admin tools.

## 🚀 Features

- **Article Management**: Create, edit, and publish articles with rich text editor
- **Advanced AI Reading Assistant**: Comprehensive AI features for enhanced reading experience
- **Smart Text Interaction**: Hover definitions and text highlighting with AI explanations
- **AI-Powered Recommendations**: Personalized article suggestions and smart bookmarks
- **Interactive Community**: User discussions, comments, and AI chat assistant
- **Mobile-First Design**: Fully responsive with touch-friendly interactions
- **Anonymous Access**: Read articles without registration required
- **Admin Dashboard**: Complete content management with analytics
- **Dark/Light Theme**: Theme switching with light as default
- **Performance Optimized**: Caching system and scroll-based animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Firestore, Firebase Auth
- **AI Integration**: Google Generative AI
- **Deployment**: Render (or Vercel/Netlify)

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd articles
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your Firebase and AI API keys to `.env.local`:
```
GOOGLE_GENAI_API_KEY=your_google_ai_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

## 🔧 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

### Vercel Deployment
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically

## 👤 Admin Access

Admin access is configured for: `jamexkarix583@gmail.com`

To change admin email, update `ADMIN_EMAIL` in `src/lib/admin.ts`

## 🎨 Customization

- **Theme**: Modify theme colors in `tailwind.config.js`
- **Fonts**: Update font imports in `src/app/layout.tsx`
- **Components**: Customize UI components in `src/components/ui/`

## 🤖 AI-Powered Reading Experience

### Text Interaction
- **Hover Definitions**: Hover over complex words for AI explanations
- **Text Highlighting**: Select paragraphs/sentences for instant AI analysis
- **Smart Tooltips**: Context-aware explanations with blue color theme
- **Draggable Popups**: Move AI explanation cards around the screen
- **Mobile Touch Support**: Full touch interaction support for smartphones

### Personalized Features
- **Reading Progress**: Track your reading journey
- **Smart Recommendations**: AI analyzes your interests for suggestions
- **Bookmark Intelligence**: AI identifies the most important passages
- **Vocabulary Building**: Personal glossary with difficulty levels
- **Export Options**: Download glossaries and bookmarks

### Interactive Elements
- **Scroll Animations**: Cards appear/disappear as you scroll
- **Welcome System**: Smart welcome bar with scroll-based hiding
- **Blinking Buttons**: Animated AI feature buttons for attention
- **Responsive Design**: Optimized for all screen sizes and devices

## 📱 Mobile Experience

- **Touch-Friendly**: 44px minimum touch targets for mobile accessibility
- **Responsive Layout**: Adaptive grid systems and typography
- **Mobile Navigation**: Collapsible menu with touch interactions
- **Drag Support**: Touch-enabled dragging for AI popups
- **Optimized Spacing**: Mobile-first padding and margins

## 📱 Features Overview

### Article System
- Rich text editor with markdown support
- Image uploads and media management
- Categories and tags
- Book recommendations and references
- View tracking and analytics

### AI Features
- **Smart Summaries**: Instant AI-generated article summaries on post cards and pages
- **Interactive Q&A**: Ask questions about articles and get intelligent answers
- **Text Highlighting**: Select any text to get AI explanations and references
- **Real-time Definitions**: Hover over words for instant AI-powered definitions
- **Reading Recommendations**: AI suggests related articles based on your interests
- **Smart Bookmarks**: AI identifies and highlights key passages worth saving
- **Personal Glossary**: AI builds vocabulary from your reading with exportable terms
- **Reference Finder**: AI finds online URLs for article references
- **Site Chat Assistant**: AI-powered chatbot for site navigation and content discovery
- **Content Analysis**: AI explains recent posts and site themes

### Community
- **Interactive Comments**: Engage in discussions with scroll-reveal animations
- **AI Chat Assistant**: Get help with site features and content discovery
- **Recent Posts Analysis**: AI-powered explanations of current content themes
- **Social Sharing**: Share articles across platforms
- **Anonymous Reading**: Access all content without registration
- **Coming Soon**: User profiles and reading groups

### Admin Panel
- Content management
- User analytics
- System statistics
- Post moderation

## 🔗 Links

- **GitHub**: [JKTK25](https://github.com/JKTK25)
- **X (Twitter)**: [@Kariuki__Ke](https://x.com/Kariuki__Ke)
- **ORCID**: [0009-0004-5033-5535](https://orcid.org/0009-0004-5033-5535)

## 📄 License

All Rights Reserved © 2024

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email jamexkarix583@gmail.com or create an issue in the repository.