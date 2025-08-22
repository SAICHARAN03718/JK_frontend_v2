# FlowBill - Luxurious Logistics Billing Automation Landing Page

A stunning, Apple-inspired React landing page for a logistics billing automation platform. Features glassmorphism design, smooth animations, and premium aesthetics targeting internal management at logistics companies.

## ✨ Features

- **Luxurious Design**: Apple-inspired aesthetics with glassmorphism effects
- **Smooth Animations**: Framer Motion powered interactions and scroll animations
- **Fully Responsive**: Perfect adaptation from 4K monitors to mobile devices
- **Premium Components**: Custom navbar, hero, features, and footer sections
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS, and Lucide React icons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Colors
- **Background**: Deep slate gray (`bg-slate-900`)
- **Text**: Off-white (`text-gray-200`) and pure white (`text-white`)
- **Accents**: Trustworthy blue (`bg-blue-600`)
- **Glassmorphism**: Semi-transparent white overlays with backdrop blur

### Typography
- **Font**: Inter (Google Fonts)
- **Headlines**: Bold with tight letter spacing
- **Body**: Regular weight with comfortable line height

### Layout
- **Rounded Corners**: Consistent use of `rounded-2xl` and `rounded-3xl`
- **Spacing**: Generous white space for clean, uncluttered feel
- **Responsiveness**: Mobile-first approach with Tailwind breakpoints

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Fixed glassmorphism navigation
│   ├── Hero.jsx        # Main headline with animated workflow
│   ├── HowItWorks.jsx  # Three-step automation process
│   ├── Features.jsx    # Feature grid with hover effects
│   └── Footer.jsx      # Clean, minimal footer
├── App.jsx             # Main application component
├── main.jsx           # React entry point
└── index.css          # Tailwind CSS imports
```

## 🔧 Component Details

### Navbar
- Fixed position with glassmorphism background
- FlowBill logo with lightning bolt icon
- "Access Dashboard" CTA button

### Hero
- Large, bold headline with gradient text
- Descriptive sub-headline
- Animated workflow visualization (Receive → Process → Bill)
- Primary "Get Started" CTA

### HowItWorks
- Three glassmorphism cards explaining the automation process
- Lucide React icons for each step
- Connecting arrows with subtle animations
- Scroll-triggered reveal animations

### Features
- Grid of 6 feature cards with unique hover effects
- Color-coded icons and gradient backgrounds
- Floating particle animations on hover
- Bottom CTA section

### Footer
- Centered logo and description
- Navigation links with hover effects
- Copyright notice with current year
- Minimal, clean design

## 🎭 Animations

All animations are powered by Framer Motion:
- **Page Load**: Fade in and scale up effects
- **Scroll Triggered**: Fade in and slide up on scroll
- **Hover Effects**: Scale, glow, and lift animations
- **Continuous**: Subtle rotating and floating elements

## 🛠 Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Professional animation library
- **Lucide React**: High-quality icon library
- **Inter Font**: Clean, professional typography

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- **Mobile**: 320px and up
- **Tablet**: 768px and up (`md:`)
- **Desktop**: 1024px and up (`lg:`)
- **Large**: 1280px and up (`xl:`)

## 🎯 Target Audience

Designed for internal management at logistics companies, conveying:
- **Trust**: Professional, reliable appearance
- **Efficiency**: Streamlined, automated processes
- **Sophistication**: Modern, high-end interface

## 📄 License

This project is created for demonstration purposes. Please ensure you have the right to use all assets and dependencies in your specific use case.

## 🤝 Contributing

This is a demo project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using React, Tailwind CSS, and Framer Motion
 
## Supabase configuration

1. Copy `.env.example` to `.env.local` and set your project values:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

2. Use the client in code:

```
import { supabase } from './src/lib/supabaseClient'
```