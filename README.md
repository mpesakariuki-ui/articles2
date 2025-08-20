# Pillar Page - AI-Powered Article Platform

A modern, full-featured article publishing platform built with Next.js, Firebase, and AI integration. Features include article management, community discussions, AI reading assistance, and comprehensive admin tools.

## 🚀 Features

- **Article Management**: Create, edit, and publish articles with rich text editor
- **AI Reading Assistant**: Interactive AI features for summaries, Q&A, and concept explanations
- **Community Hub**: User discussions and interactions around articles
- **Admin Dashboard**: Complete content management with analytics
- **User Authentication**: Firebase Auth integration
- **Mobile Responsive**: Optimized for all devices
- **Dark/Light Theme**: Theme switching with light as default
- **Caching System**: Improved performance with data caching

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

## 📱 Features Overview

### Article System
- Rich text editor with markdown support
- Image uploads and media management
- Categories and tags
- Book recommendations and references
- View tracking and analytics

### AI Features
- Article summarization
- Interactive Q&A about articles
- Concept explanations
- Discussion topic generation

### Community
- User discussions
- Comment system
- Community statistics
- User profiles

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