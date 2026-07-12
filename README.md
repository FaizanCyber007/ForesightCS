# ForesightCS

ForesightCS is a premium B2B SaaS platform designed to predict customer churn and manage account health for SMBs (Small and Medium-sized Businesses). It provides a comprehensive Customer Success (CS) command center with actionable insights, detailed metrics, and a rule builder for predictive churn analysis.

## Features

- **Pre-Login Landing Page**: A high-converting hero section with interactive 3D elements, smooth scroll-reveal effects, and dynamic pricing tiers.
- **Authentication**: Beautiful glassmorphic forms for login and registration with validation.
- **Dashboard / Command Center**: A comprehensive overview of customer health, high-level metric cards, interactive charts, and an animated data table showing healthy, at-risk, and critical customers.
- **Customer 360 View**: Detailed customer telemetry data, timeline of events, and billing status for individual accounts.
- **Rule Builder**: An advanced interface to configure predictive churn rules based on various weights and metrics.
- **Dynamic Data Integration**: Data throughout the application is fetched dynamically, simulating a real-world backend API integration.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion
- **3D Graphics**: `@react-three/fiber`, `@react-three/drei`
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide-React

## Design System

The platform features a highly premium, custom design inspired by top-tier SaaS companies.
- **Theme**: Deep Dark Mode with subtle glowing accents.
- **UI Elements**: Extensive use of Glassmorphism (backdrop-blur, translucent borders) for cards, sidebars, and dropdowns.
- **Micro-interactions**: Smooth page routing, staggering list items, and hover effects powered by Framer Motion.

## Getting Started

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `/frontend/app`: Next.js App Router pages and layouts.
- `/frontend/components`: Modular UI components.
  - `/ui`: Reusable base components (Buttons, Inputs, Cards).
  - `/layout`: Structural components (Sidebar, Navbar, Footer).
  - `/features`: Complex feature-specific components.
- `/frontend/lib`: Utility functions and schemas.
- `/frontend/services`: Mock API fetch functions for data simulation.
- `/frontend/public`: Static assets.

## About the Project

This project was built iteratively using AI assistance, focusing on modern web development practices, high-quality UI/UX design, and complex state management. The development process emphasizes modular architecture, component reusability, and Next.js best practices like the separation of Server and Client components. You can view the history of prompts used to generate this project in `prompts.md`.
