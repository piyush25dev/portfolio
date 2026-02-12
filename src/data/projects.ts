export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  detailedDescription?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  github?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  // {
  //   id: 'e-commerce-platform',
  //   title: 'E-commerce Platform',
  //   description: 'A full-featured online store with cart functionality, user authentication, and payment processing.',
  //   technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  //   image: '/images/javascript.svg',
  //   link: '#',
  //   detailedDescription: 'A comprehensive e-commerce solution built with a React frontend and Node.js backend. The platform includes user authentication, product catalog, shopping cart, checkout process, and integration with Stripe for payment processing.',
  //   features: [
  //     'User authentication and profile management',
  //     'Product catalog with filtering and search',
  //     'Shopping cart and wishlist functionality',
  //     'Secure checkout process with Stripe integration',
  //     'Order history and tracking',
  //     'Admin dashboard for product management'
  //   ],
  //   challenges: [
  //     'Implementing secure payment processing',
  //     'Creating a responsive design for all device sizes',
  //     'Optimizing database queries for performance'
  //   ],
  //   solutions: [
  //     "Used Stripe's secure API for handling sensitive payment information",
  //     'Implemented responsive design with Material UI and custom CSS',
  //     'Created efficient MongoDB queries with proper indexing'
  //   ],
  //   github: 'https://github.com/yourusername/ecommerce-platform',
  //   demoUrl: 'https://ecommerce-demo.example.com'
  // },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description:
      "A responsive portfolio website with animations and interactive elements.",
    technologies: ["Next.js", "Material UI", "TypeScript", "Framer Motion"],
    image: "/images/portfolio.png",
    link: "#",
    detailedDescription:
      "A modern portfolio website built using Next.js to showcase my projects and skills. The site features smooth animations, interactive elements, and a responsive design that works across all devices.",
    features: [
      "Responsive design that adapts to all screen sizes",
      "Smooth page transitions and scroll animations",
      "Dark/light mode toggle",
      "Contact form with validation",
      "Project showcase with filtering capabilities",
    ],
    challenges: [
      "Creating smooth animations without affecting performance",
      "Implementing a seamless dark/light mode transition",
      "Optimizing images for fast loading",
    ],
    solutions: [
      "Used Framer Motion for performant animations",
      "Implemented theme context with smooth transitions",
      "Optimized images with Next.js Image component and proper sizing",
    ],
    github: "https://github.com/piyush25dev/portfolio",
    demoUrl: "https://portfolio-six-beta-17.vercel.app",
  },
  {
    id: "hems-corporation",
    title: "Hems Corporation",
    description:
      "A dynamic construction services website with interactive project showcases and client communication tools.",
    technologies: [
      "React.js",
      "Material-UI",
      "Framer Motion",
      "JavaScript",
      "EmailJS",
    ],
    image: "/images/hems.png", // Replace with actual image path
    link: "#",
    detailedDescription:
      "A modern website for Hems Corporation featuring smooth animations, a project portfolio gallery, and seamless contact form integration with EmailJS for instant client inquiries.",
    features: [
      "Animated project showcases with Framer Motion",
      "Material-UI design system for consistent styling",
      "EmailJS integration for instant form submissions",
      "Interactive service catalog with expandable details",
      "Mobile-responsive layout for on-site contractors",
    ],
    challenges: [
      "Balancing heavy construction imagery with performance",
      "Creating intuitive touch controls for mobile users",
      "Implementing reliable email notifications without a backend",
    ],
    solutions: [
      "Used Material-UI’s lazy-loading components for images",
      "Designed touch-friendly carousels with Framer Motion gestures",
      "Integrated EmailJS for direct client-to-email workflows",
    ],
    github: "https://github.com/piyush25dev/hems-website",
    demoUrl: "https://hems-website.vercel.app/",
  },
  {
    id: "realtime-self-destruct-chat",
    title: "Realtime Self-Destruct Chat",
    description:
      "A secure real-time chat application where rooms automatically self-destruct after 10 minutes, ensuring temporary conversations and enhanced privacy.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Elysia",
      "Upstash Redis",
      "Upstash Realtime",
      "React Query",
      "Zod",
      "Tailwind CSS",
    ],
    image: "/images/realtime-chat.png",
    link: "#",
    detailedDescription:
      "Realtime Self-Destruct Chat is a privacy-focused web application that enables users to create temporary chat rooms with automatic expiration. Each room is destroyed after 10 minutes, deleting all associated messages and metadata from the database. The application leverages Redis TTL for automatic cleanup, real-time messaging with Upstash Realtime, and a modern responsive UI built with Next.js and Tailwind CSS. The system ensures minimal data persistence while maintaining seamless real-time communication.",
    features: [
      "Create secure chat rooms with automatic 10-minute expiration",
      "Real-time messaging using WebSocket-based event system",
      "Automatic room and message deletion using Redis TTL",
      "Manual “Destroy Now” option to instantly delete a room",
      "Live countdown timer showing remaining room lifetime",
      "Responsive dark-themed UI with modern design",
      "Token-based room access validation using middleware",
    ],
    challenges: [
      "Implementing reliable room expiration using Redis TTL without data leaks",
      "Synchronizing real-time events across multiple connected users",
      "Handling automatic redirection when a room expires or is destroyed",
      "Maintaining clean separation between room metadata and message storage",
    ],
    solutions: [
      "Used Redis key expiration (TTL) to automatically clean room metadata and messages",
      "Integrated Upstash Realtime channels to broadcast chat.message and chat.destroy events",
      "Implemented middleware-based authentication to validate room access",
      "Designed modular backend routes using Elysia with Zod validation for type safety",
      "Optimized frontend data fetching and cache synchronization using React Query",
    ],
    github: "https://github.com/piyush25dev/realtime_chat-app",
    demoUrl: "https://realtime-chat-app-eosin-mu.vercel.app/",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "Real-time weather information with interactive maps and forecasts.",
    technologies: ["React", "JavaScript", "OpenWeather API"],
    image: "/images/weather.png",
    link: "#",
    detailedDescription:
      "A weather dashboard that provides real-time weather information, forecasts, and interactive maps. The application uses the OpenWeather API to fetch accurate weather data and presents it in an intuitive interface.",
    features: [
      "Current weather conditions display",
      "Five-day forecast with hourly breakdowns",
      "Interactive map with weather layers",
      "Location search and favorites",
      "Weather alerts and notifications",
      "Historical weather data charts",
    ],
    challenges: [
      "Processing and displaying complex weather data",
      "Creating interactive and informative visualizations",
      "Handling API rate limits and optimizing requests",
    ],
    solutions: [
      "Implemented data processing utilities for API responses",
      "Used chart.js for clear data visualization",
      "Created intelligent caching to minimize API calls",
    ],
    github: "https://github.com/piyush25dev/weather-dashboard",
    demoUrl: "https://weather-dashboard-ecru-five.vercel.app/",
  },
  {
    id: "oss-website",
    title: "One Stop Service",
    description:
      "A solar panel information and service website with contact support.",
    technologies: ["React", "JavaScript", "Material UI", "Framer Motion"],
    image: "/images/oss.png",
    link: "#",
    detailedDescription:
      "A static website showcasing solar panel products and services. The platform provides detailed information about solar panels, their benefits, and allows users to directly contact the seller via email for queries.",
    features: [
      "Informative sections about solar panels and their benefits",
      "Static data display for solar panel products and services",
      "Contact form integration to send queries via email",
      "Clean and modern UI with responsive design",
      "Smooth animations using Framer Motion",
    ],
    challenges: [
      "Presenting technical solar panel data in a user-friendly format",
      "Ensuring responsiveness across devices",
      "Building a reliable contact system for user queries",
    ],
    solutions: [
      "Structured data into clear sections with visual emphasis",
      "Implemented responsive layouts using Material UI",
      "Integrated mail functionality for direct user-to-seller communication",
    ],
    github: "https://github.com/piyush25dev/OSS",
    demoUrl: "https://oss-website.netlify.app/",
  },
  {
    id: "uniklinger",
    title: "Uniklinger",
    description:
      "A corporate website for Uniklinger, showcasing precision-engineered valves, steam traps, and fluid control solutions with global reach and advanced manufacturing capabilities.",
    technologies: [
      "React.js",
      "Material-UI",
      "Framer Motion",
      "JavaScript",
      "EmailJS",
    ],
    image: "/images/ukl.png",
    link: "#",
    detailedDescription:
      "Uniklinger’s website highlights their expertise in fluid control, sealing, steam engineering, and safety valves. Featuring smooth animations, an extensive product catalog, and integrated contact forms for inquiries, it emphasizes global service, advanced solutions, and sustainable engineering practices.",
    features: [
      "Interactive product catalog for valves, steam traps, and fluid control systems",
      "Material-UI design for a professional and consistent look",
      "EmailJS-powered inquiry forms for instant customer communication",
      "Detailed service sections for greenfield and brownfield project support",
      "Mobile-responsive layout optimized for global users and distributors",
    ],
    challenges: [
      "Presenting complex industrial solutions in an intuitive format",
      "Ensuring fast performance despite heavy technical content and imagery",
      "Providing real-time inquiry options without a dedicated backend infrastructure",
    ],
    solutions: [
      "Utilized lazy-loading and optimized assets to enhance site speed",
      "Crafted user-friendly navigation with expandable sections for detailed products",
      "Integrated EmailJS to enable seamless communication between clients and technical experts",
    ],
    github: "https://github.com/piyush25dev/ukl-frontend",
    demoUrl: "https://www.uniklinger.com",
  },
  {
    id: "travel",
    title: "Travel",
    description:
      "A modern booking platform for hotels, flights, and destination packages, helping users plan and enjoy their trips with ease and confidence.",
    technologies: [
      "Next.js",
      "Material-UI",
      "Framer Motion",
      "JavaScript",
      "EmailJS",
    ],
    image: "/images/travel.png",
    link: "#",
    detailedDescription:
      "Travel’s website offers users a seamless experience to explore and book hotels, flights, and destination packages. With engaging animations, intuitive navigation, and quick inquiry forms, it aims to inspire adventure and simplify the booking process for travelers worldwide.",
    features: [
      "Search and filter for hotels, flights, and destination packages",
      "Material-UI design for a sleek and responsive user interface",
      "Framer Motion animations for smooth transitions and interactions",
      "EmailJS-powered booking inquiries and contact forms",
      "Mobile-friendly layout to support travelers on the go",
    ],
    challenges: [
      "Creating an easy-to-use interface for multiple booking options",
      "Maintaining fast load times with rich imagery and animations",
      "Handling user interactions without a complex backend setup",
    ],
    solutions: [
      "Implemented lazy loading and optimized media assets to improve performance",
      "Designed modular components with Material-UI for consistency and scalability",
      "Used EmailJS for instant communication, reducing dependency on backend infrastructure",
    ],
    github: "https://github.com/piyush25dev/travel",
    demoUrl: "https://travel-bay-seven.vercel.app/",
  },
  {
    id: "texkart",
    title: "Texkart",
    description:
      "An e-commerce platform for buying textiles, offering users an intuitive dashboard to manage orders, track quantities, and explore a wide range of products with ease.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Material-UI",
      "Tailwind CSS",
      "Framer Motion",
    ],
    image: "/images/texkart.png",
    link: "#",
    detailedDescription:
      "Texkart provides a streamlined experience for textile shopping, allowing users to browse products, manage orders, and track purchase quantities through an interactive dashboard. The platform combines modern design elements, responsive layouts, and engaging animations to enhance the user’s shopping journey.",
    features: [
      "Browse and purchase textile products with detailed information",
      "User dashboard for tracking orders and quantities",
      "Material-UI and Tailwind CSS for a responsive and sleek design",
      "Framer Motion animations for smooth user interactions",
      "TypeScript for type safety and improved developer experience",
    ],
    challenges: [
      "Designing a user-friendly interface for managing orders and product details",
      "Integrating multiple technologies while maintaining performance and responsiveness",
      "Ensuring scalability and maintainability with a type-safe codebase",
    ],
    solutions: [
      "Created modular components using Material-UI and Tailwind CSS for consistency and flexibility",
      "Leveraged TypeScript to catch errors early and streamline development workflows",
      "Implemented Framer Motion animations to enhance user experience without compromising load times",
    ],
    github: "https://github.com/piyush25dev/texkart",
    demoUrl: "https://texkart-ze13.vercel.app/",
  },
  {
    id: "dashboard",
    title: "Admin Dashboard",
    description:
      "A comprehensive admin dashboard with multi-level authorization system, featuring role-based access control for Super Admin, Admin, and Editor roles with full user management capabilities.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Material-UI",
      "React Context",
      "Local Storage API",
    ],
    image: "/images/dashboard.png",
    link: "#",
    detailedDescription:
      "This admin dashboard provides a robust multi-tier authorization system with three distinct user roles: Super Admin, Admin, and Editor. Super Admins have complete control over the system including creating and deleting users of all roles, while Admins can manage Editors and Viewers. The platform features a modern, responsive design with secure route protection and real-time user management capabilities.",
    features: [
      "Multi-level role-based authorization (Super Admin, Admin, Editor, Viewer)",
      "Complete user management with create, edit, and delete functionalities",
      "Secure route protection and permission-based access control",
      "Real-time user session management with local storage persistence",
      "Responsive Material-UI design with customizable sidebar navigation",
      "Role-specific dashboard views and accessible features",
      "User activity tracking with login history and join dates",
    ],
    challenges: [
      "Implementing a secure and scalable role-based access control system",
      "Managing complex permission hierarchies across different user roles",
      "Creating a flexible navigation system that adapts to user permissions",
      "Ensuring data persistence and security using client-side storage",
      "Preventing unauthorized access to sensitive administrative functions",
    ],
    solutions: [
      "Developed a hierarchical role system with permission inheritance using TypeScript enums",
      "Implemented React Context for global state management of authentication and user data",
      "Created reusable permission hooks for component-level access control",
      "Designed a dynamic navigation system that shows/hides menu items based on user roles",
      "Used Material-UI theming and components for consistent, accessible UI across all devices",
    ],
    github: "https://github.com/piyush25dev/my-dashboard",
    demoUrl: "https://my-dashboard-xi-seven.vercel.app/login",
  },
  {
    id: "video-size-reducer",
    title: "Video Size Reducer",
    description:
      "A web-based tool that allows users to reduce video file sizes efficiently through an intuitive and responsive interface, making video sharing and storage easier.",
    technologies: ["Next.js", "JavaScript", "Material-UI", "Iconify"],
    image: "/images/video-compress.png",
    link: "#",
    detailedDescription:
      "The Video Size Reducer is a modern web application designed to help users compress videos quickly and effortlessly. Users can upload videos, choose compression levels, and download optimized files through a clean and responsive UI. The project focuses on usability, performance, and reusable component architecture.",
    features: [
      "Upload videos directly from the browser with instant preview",
      "Multiple compression levels for flexible size optimization",
      "Responsive and user-friendly interface using Material-UI",
      "Reusable component-based architecture in Next.js",
      "Iconify icons for a consistent and modern visual experience",
    ],
    challenges: [
      "Designing a clean and intuitive workflow for video upload and compression",
      "Managing large media files efficiently in a frontend-focused application",
      "Ensuring responsiveness and accessibility across different devices",
    ],
    solutions: [
      "Built modular and reusable components to keep the codebase clean and scalable",
      "Implemented optimized UI flows to guide users through upload, compression, and download steps",
      "Used Material-UI’s responsive system to ensure consistent design across screen sizes",
    ],
    github: "https://github.com/piyush25dev/video-compress",
    demoUrl: "https://video-compress-rho.vercel.app/",
  },
];
