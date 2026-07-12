# Prompts for ForesightCS

## Prompt 1
You are a Senior Frontend Architect and UI/UX Expert. Your task is to build the complete frontend for "ForesightCS", a premium B2B SaaS platform that predicts customer churn and manages account health for SMBs. You must use the latest versions of Next.js, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Lucide-React. For 3D elements, use `@react-three/fiber` and `@react-three/drei` and whatever library or framework you use, search for the most latest version of it and use that version. Do not use older versions. Here are the details you need to follow:

**1. AUTONOMY & PRODUCT RESEARCH:**
Act as a Product Architect. Do your own internal analysis of what top-tier Customer Success and Churn Prediction tools (like Gainsight, ChurnZero, or modern micro-SaaS equivalents) require. Proactively design and implement any additional frontend features, UI widgets, data visualizations, or micro-interactions you think would make this product exceptional and highly marketable. Don't just stick to the basics. surprise me with industry-standard add-ons. 

**2. DESIGN SYSTEM & UI/UX (CRITICAL):**
Do NOT use generic, signature AI-generated Tailwind designs (like basic blue buttons and flat gray backgrounds). I want a highly premium, custom design inspired by top-tier SaaS companies like Linear, Vercel, and Stripe. 
- Theme: Deep Dark Mode with subtle glowing accents (emerald/purple or whatever fits a "predictive/foresight" brand). 
- Effects: Heavy use of Glassmorphism (backdrop-blur, translucent borders) for cards, sidebars, and dropdowns. 
- Motion: Implement Framer Motion for smooth page routing, staggering list items, hover micro-interactions, and smooth scrolling. 
- 3D Element: On the pre-login Landing Page, implement a premium 3D geometric element (like a glowing orb, abstract wireframe, or predictive data mesh) using React Three Fiber that subtly rotates and reacts/scrolls along with the user's cursor. 
Ensure consistency across the whole design. 

**3. MODULAR ARCHITECTURE:**
To make debugging easy and the codebase scalable, you must heavily modularize the code. Do not put everything in `page.tsx`. Use this strict structure: 
- `/components/ui/` (Reusable base components: Button, Input, Modal, GlassCard, Badges, all styled beautifully). 
- `/components/layout/` (Sidebar, Navbar, Footer, PageWrappers). 
- `/components/features/` (Complex chunks: CustomerTable, MetricCharts, RuleBuilderForm, AI-Insights widget). 
- `/lib/` (Utility functions like `cn` for Tailwind merge, Zod schemas, formatters). 
- `/services/` (Mock API fetch functions to simulate backend communication). 

**4. NEXT.JS SPECIFIC IMPLEMENTATIONS:**
Utilize the absolute latest Next.js App Router features: 
- Strictly separate Server Components (for data fetching, SEO, and initial renders) and Client Components (`"use client"` for Framer Motion, 3D, Forms, and interactive charts). 
- Implement Next.js caching logic appropriately (e.g., using `revalidate` tags or `cache: 'no-store'` in fetch calls). 
- Use `loading.tsx` to show premium animated skeleton loaders that match the exact shape of the incoming data. 
- Use `error.tsx` for graceful, beautifully designed error handling boundaries. 

**5. REQUIRED SCREENS & LOGIC:**
Build the following screens with correct logic (and add anything else your research suggests): 
PRE-LOGIN: 
1. Landing Page (`/`): High-converting hero section with the 3D cursor-tracking element, glassmorphic feature cards, Framer Motion scroll-reveal effects, and dynamic pricing tiers. 
2. Auth Pages (`/login`, `/register`): Beautiful glassmorphic forms with React Hook Form + Zod validation. 

POST-LOGIN (Requires a shared Layout with a Glassmorphic Sidebar): 
3. Command Center / Dashboard (`/dashboard`): Calls a mock API to fetch realistic SaaS customer data. Displays high-level metric cards, interactive charts, and a Framer Motion animated data table showing customers (Healthy, At-Risk, Critical). Implement complex state-managed filtering and sorting. 
4. Rule Builder (`/dashboard/rules/new`): A complex form where users configure predictive churn rules. Strict Zod validation (e.g., weights, valid metric types), dynamic error messages, and controlled inputs. 
5. Customer 360 (`/dashboard/customer/[id]`): Dynamic route showing detailed customer telemetry data, timeline of events, and billing status. 

EXECUTION INSTRUCTIONS FOR COPILOT AUTO: 
Do not try to build this all in one single file or one single step. Execute this in the following modular phases. Pause and wait for my confirmation after each phase: 
- PHASE 1: Install all necessary dependencies (`framer-motion`, `@react-three/fiber`, `clsx`, `tailwind-merge`, etc.) and set up the modular folder structure. 
- PHASE 2: Create the premium UI components (`/components/ui`) and the sophisticated mock data service (`/services/api.ts`). 
- PHASE 3: Build the Pre-Login screens (Landing Page with 3D effects + Auth). 
- PHASE 4: Build the Post-Login shared layout, Sidebar, and the main Dashboard with mock API integration, advanced data viz, and Next.js loading/error states. 
- PHASE 5: Build the Customer 360 view and the complex Rule Builder form with Zod validation. 

Begin with PHASE 1 now. 

## Prompt 2
When i logged in, it crashed. you need to fix these. The whole application has one home page and then dashboard after login (There is no option to log out as well). You need to make multiple pages like pricing, contact us etc (every SPA should have) and you need to keep the design consistent for the complete website. you also need to add some other, a better and relevant 3d obect in the hero section and You need to fix all these issues and all the things and data being showed on the screen should not be hard-coded infact should be fetched from any json file or anything to the frontend

## Prompt 3
3D element in the background is so distracting and doesn't feel good. You need to take inspiration from the websites like vercel, nextjs and such top companies websites, see how things are being arranged and presented in these websites and you need to make the website like them. You also need to refer to the relevant websites of this niche and see how features are being built and decided in these websites and you need to distribute and design everything according to them. (micro-cs platforms to predict churn or users have possibility to leave the platform). You have to use 3D elements in the website but in a way that doesn't feel awkward and weird and you need to design the website that doesn't seems like your signature design (everything you have in your every website) and should look like a professional and designed by UI/UX designer.
You also need to implement all kind of authentication, validation and everything needs to be implemented on frontend and use features to optimize and make this website perfect.

## Prompt 4
Current design has many flaws like the data that should only be visible in the user's dashboard and should be private, it is still being shown in the pre-login landing page and it is violating the privacy and security rules so you need to fix these issues. You need to refer to the relevant websites like "https://www.gainsight.com/", "https://churnzero.com/" and all the relevant websites, check how these websites are being designed and how the screens and data are being distributed and shown in the different screens and sections and you need to design the website accordingly and no data should be hard-coded and should be fetched by a json file and should be shown on the screen  and even after logging in, all pages and links are not working and the links which are working, everything seems and feels so scattered that it feels difficult to understand these things. You need to polish the design according to the UI/UX principles, analyze the websites mentioned check how everything is being structured and shown in these websites (just take inspiration, do not copy the exact design) and design the website like a professional and user friendly UI. All the links should be working and all the screens should be designed keeping the overall theme and design of the website consistent and professional

## Prompt 5
landing page is good but doesn't feel like the ultimate perfect landing page. you need to do something that the table you showed here in the hero section about stats, you need to refer to the hero section of the webstite "https://www.gainsight.com/" there's a video in it. analyze that video and build something relevant to that thing. also the 3d object you have used doesn't feel relevant to the project. try to add something relevant to the platform and all the buttons with button variant=theme or primary buttons have some issues like the text is not visible inside the white background of the button. you need to keep the buttons consistent throughout the design and make a button relevant ot he the theme and beautiful.
Also content on the landing page should be enhaned a bit as current content seems so boring and useless to the audience. add some content that help visitors and viewers know about the platform and present it in a way seems amazing.

## Prompt 6
Check the terminal and fix all the issues there and you need to refer to the similar platforms lke these already existing there in the market, check what elements, features and thins are they offering, check if anything is missing from my application then implement it as well and do a deep analysis of the whole webste, think deeply for any improvements can be made (either feature, UI, design or anything else) and if found then implement those changes efficiently

## Prompt 7
add some 3d moving elements moving around, getting scrolled with cursor and doing such things making this website more beautiful and amazing