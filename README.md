# Pillar Page - AI-Powered Article Platform

A modern, full-featured article publishing platform built with Next.js, Firebase, and AI integration. Features include article management, research papers, community discussions, AI reading assistance, and comprehensive admin tools.

## 🚀 Features

- **Article Management**: Create, edit, and publish articles with rich text editor
- **Research Papers**: Academic publishing with DOI assignment, peer review, plagiarism detection
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

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Firestore, Firebase Auth
- **AI Integration**: Google Generative AI (Gemini)
- **Deployment**: Render, Vercel, or Netlify

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
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI Configuration
GOOGLE_GENAI_API_KEY=your_google_ai_key

# Admin Configuration
ADMIN_EMAIL=your_admin_email@gmail.com
```

4. Run the development server:
```bash
npm run dev
```

## 🔧 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Add your domain to authorized domains
5. Create Firestore collections: `posts`, `research`, `reviews`, `comments`

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy

### Vercel Deployment
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically

### Netlify Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

## 👤 Admin Access

Admin access is configured via the `ADMIN_EMAIL` environment variable.

## 🎨 Customization

- **Theme**: Modify theme colors in `tailwind.config.js`
- **Fonts**: Update font imports in `src/app/layout.tsx`
- **Components**: Customize UI components in `src/components/ui/`

## 🤖 AI Features

### Research Papers
- **DOI Assignment**: Automatic DOI generation
- **Version Control**: Track paper revisions
- **Co-author Management**: Multi-author collaboration
- **Plagiarism Detection**: AI-powered similarity checking
- **Reference Validation**: Auto-verify citations
- **PDF/Word Export**: Download papers in multiple formats
- **Peer Review System**: Rating and comment system

### Reading Experience
- **Text Interaction**: Hover definitions and highlighting
- **Smart Summaries**: AI-generated article summaries
- **Interactive Q&A**: Ask questions about articles
- **Personalized Recommendations**: AI suggests relevant content
- **Smart Bookmarks**: AI identifies important passages

## 📱 Mobile Experience

- **Touch-Friendly**: 44px minimum touch targets
- **Responsive Layout**: Adaptive grid systems
- **Mobile Navigation**: Collapsible menu
- **Drag Support**: Touch-enabled interactions
- **Optimized Spacing**: Mobile-first design

## 🔗 Links

- **GitHub**: [JKTK25](https://github.com/JKTK25)
- **X (Twitter)**: [@Kariuki__Ke](https://x.com/Kariuki__Ke)

## 📄 License

All Rights Reserved © 2024

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email jamexkarix583@gmail.com or create an issue in the repository.