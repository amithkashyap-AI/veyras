# 🏛️ Veyra's Construction and Interiors
> **Building Spaces • Creating Lifestyles**  
> Premium Architectural Turnkey Construction, Luxury Residential Interiors & Modern Landscape Studio in Bengaluru, Karnataka.

[![Maintained by AalgoLabs](https://img.shields.io/badge/Maintained%20by-AalgoLabs%20(OPC)%20PVT.%20LTD.-0284c7?style=flat-square)](https://aalgolabs.com)
[![Security: TLS 256-Bit SSL](https://img.shields.io/badge/Security-TLS%20256--Bit%20SSL-10b981?style=flat-square)](#-security-architecture)
[![OTP Expiry](https://img.shields.io/badge/Email%20OTP-10%20Min%20(600s)-f97316?style=flat-square)](#-security-architecture)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Ollama%20(Llama%203.2)-8b5cf6?style=flat-square)](#-ollama-ai-social-media-intelligence)

---

## 🌟 Overview

**Veyra's Construction and Interiors** is an enterprise-grade full-stack portal built with modern web technologies and local AI intelligence. It delivers end-to-end management of architectural construction, interior design, timber patio spaces, customer enquiries, dynamic services management, and social media AI intelligence.

- **Corporate Office**: `#98, 1Main, 4th Cross, Manjunatha Nagar, Rajajinagar-560010, Bengaluru, Karnataka`
- **Contact / WhatsApp**: `089213 36363`
- **Email**: `contact@veyrasinteriors.com`
- **Engineered & Maintained by**: **AalgoLabs (OPC) PVT. LTD.**

---

## 🚀 Key Features

### 1. 🏗️ Public Services & Portfolio Portal
- **Turnkey Architectural Construction**: Structural engineering, approvals, foundation-to-finish execution.
- **Luxury Residential Interiors**: Modular kitchens, Italian marble, master suites, bespoke wardrobes.
- **Modern Courtyards & Landscaping**: Pergolas, water bodies, drought-resistant garden layouts.
- **Modern Timber Decks & Patios**: Weather-resistant teak/ipe timber lounges and outdoor living spaces.
- **Dynamic Area Cost Estimator**: Real-time sq.ft rate calculator (e.g., ₹1,850/sq.ft to ₹2,250/sq.ft) with immediate WhatsApp consultation triggers.

### 2. 🛡️ Security Architecture
- **TLS 256-Bit SSL**: Secure endpoint encryption across all API transactions.
- **Timed Email OTP (600s)**: High-security 10-minute expiring OTP with live synchronized circular countdown timer (`10:00` to `00:00`).
- **Mandatory First-Time Password Change**: Real users logging in for the first time are strictly gated with mandatory password reset and policy validation.
- **Role-Based Access Control (RBAC)**: Strict segregation between client portal users and company administrators. Normal users are isolated to public browsing, wishlists, and enquiries; administrative CMS and analytics are guarded strictly under `/#admin-login`.

### 3. ⚙️ Dynamic CMS & Services Dashboard
- Admin portal to create, update, and manage dynamic navigation menus and nested submenus.
- Services management: Create custom service packages, configure per-sq.ft rates, upload hero images, define inclusions, and toggle direct WhatsApp and enquiry buttons.

### 4. 🧠 Ollama AI Social Media Intelligence
- **Local LLM Integration**: Directly connects to local Ollama daemon (`http://localhost:11434`) running models like `llama3.2:3b`, `llama3.2:1b`, or `qwen:latest`.
- **Cross-Platform Social Analytics**: Ingests feeds from Instagram, Facebook, and architectural portals.
- **Multi-Vector Insights**:
  - Positive / Neutral / Negative sentiment breakdown.
  - Trending architectural styles (e.g., Biophilic Courtyards, Japandi Minimalist, Exposed Timber).
  - Price sensitivity & budget objection analysis.
  - Strategic AI recommendations for upcoming marketing campaigns.
- **Interactive AI Architectural Chat**: Live streaming chat assistant for interior design consultation and quote formulation.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js & Express with TypeScript.
- **Database**: PostgreSQL with Prisma ORM.
- **AI / LLM**: Ollama local daemon (Llama 3.2 / Qwen models).
- **Styling & Aesthetics**: High-contrast modern dark palette with vibrant accents (`#1e3a8a` Navy Blue, `#ea580c` Safety Orange, `#10b981` Emerald Green).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `>= 18.0.0`
- PostgreSQL running locally or via Docker
- Ollama (`ollama run llama3.2:3b`)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/amithkashyap-AI/veyras.git
cd veyras

# 2. Install all dependencies (concurrently, server, client)
npm run install:all

# 3. Configure environment variables
cp .env.example .env

# 4. Push Prisma schema & seed initial database
cd server
npx prisma db push
npx tsx prisma/seed.ts
cd ..

# 5. Start development servers (Vite :5173 + Express :5001)
npm run dev
```

---

## 📄 License & Attribution

Copyright © 2026 **Veyra's Construction and Interiors**. All Rights Reserved.  
Maintained & Engineered by **AalgoLabs (OPC) PVT. LTD.**
