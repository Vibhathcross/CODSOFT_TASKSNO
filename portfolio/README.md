<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=22D3EE&center=true&vCenter=true&width=700&lines=Vibhath+Cross+%7C+Portfolio;AI+Developer+%2B+WebGL+Designer;Software+Engineering+Student" alt="Typing SVG" />

<br/>

[![Live Site](https://img.shields.io/badge/Live_Site-Portfolio-22d3ee?style=for-the-badge&logo=vercel&logoColor=white)](https://vibhathcross.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Vibhathcross-181717?style=for-the-badge&logo=github)](https://github.com/Vibhathcross)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org)

</div>

---

## ✦ Overview

**Vibhath Cross** — Software Engineering student, AI developer, and WebGL designer from Idukki, Kerala. This is the source code for my personal portfolio website, built with a full 3D WebGL experience, immersive animations, and a cyberpunk-meets-minimal design language.

> *Pioneering highly interactive 3D WebGL interfaces, complex local AI workflows, and robust backends — activated from 9.849°N, 76.979°E.*

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16, React 19 |
| **3D / WebGL** | Three.js, React Three Fiber, React Three Drei, Spline |
| **Animation** | Framer Motion |
| **Styling** | Tailwind CSS v4 |
| **Backend / DB** | Supabase |
| **Icons** | Lucide React |
| **Physics** | React Three Cannon |

---

## 🗂️ Project Structure

```
vibhath-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout, metadata, fonts
│   │   ├── page.js            # Main page entry
│   │   └── globals.css        # Global styles & design tokens
│   └── components/
│       ├── HeroSection.jsx        # 3D Spline hero with typing effect
│       ├── AboutCenter.jsx        # About / bio section
│       ├── TechStack3D.jsx        # Interactive 3D tech stack globe
│       ├── ProjectsArsenal.jsx    # Projects showcase
│       ├── ContactUplink.jsx      # Contact form (Supabase-backed)
│       ├── CanvasContainer.jsx    # Three.js canvas wrapper
│       ├── ClientCanvasWrapper.jsx# Client-only canvas mount
│       └── ProfileBadge3D.jsx     # 3D floating profile badge
├── public/                        # Static assets & video files
├── package.json
└── next.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**

### Installation

```bash
# Clone the repo
git clone https://github.com/Vibhathcross/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase keys in .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
# → Opens at http://localhost:3050
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎬 Features

- **Full 3D Hero** — Real-time WebGL Spline scene embedded in the hero section
- **Typing Effect** — Animated role cycling: *Software Engineering Student → AI Developer → WebGL Designer*
- **Interactive Tech Stack** — 3D floating tech orbs powered by Three.js
- **Project Arsenal** — Filterable showcase of work
- **Secure Contact Uplink** — Form submissions saved to Supabase database
- **Glassmorphism UI** — Frosted-glass cards with cyber-glow aesthetics
- **Fully Responsive** — Optimised for desktop, tablet, and mobile
- **Dark-First Design** — Deep space `#030303` base with cyan accent system

---

## 🌐 Deployment

This project is optimized for **Vercel** (recommended) or any Node.js host.

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com).

---

## 📄 License

This project is **not open source**. All design, content, and code are the intellectual property of **Vibhath Cross**.

© 2026 Vibhath Cross — All Rights Reserved.

---

<div align="center">

*Built with 🩵 from Kerala, India*

</div>
