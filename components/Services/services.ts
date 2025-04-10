// data/services.ts
export interface ServiceData {
  id: number;
  title: string;
  description: string;
  gifUrl: string;
  points: string[];
}

export const services: ServiceData[] = [
  {
    id: 1,
    title: "Web Development",
    description:
      "We build beautiful, responsive websites that drive results for your business. Our web development services combine cutting-edge technologies with creative design to deliver exceptional online experiences.",
    gifUrl: "/images/service1.gif", // Replace with actual path in your project
    points: [
      "Custom website design and development",
      "E-commerce solutions with secure payment gateways",
      "Content management systems for easy updates",
      "Performance optimization for lightning-fast load times",
      "SEO-friendly architecture and responsive layouts",
      "Progressive Web Apps (PWA) development",
      "Accessibility and cross-browser compatibility",
    ],
  },
  {
    id: 2,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences. Our mobile development team creates intuitive, high-performance apps for iOS and Android platforms.",
    gifUrl: "/images/service2.gif", // Replace with actual path in your project
    points: [
      "iOS and Android native app development",
      "React Native and Flutter cross-platform expertise",
      "UI/UX design specifically optimized for mobile",
      "App store optimization and submission assistance",
      "Ongoing maintenance, updates, and support",
      "Integration with third-party services and APIs",
      "Offline functionality and data synchronization",
    ],
  },
  {
    id: 3,
    title: "Digital Marketing",
    description:
      "Strategic marketing campaigns that connect with your audience and drive conversions. Our data-driven approach ensures your marketing budget is invested for maximum ROI and business growth.",
    gifUrl: "/images/service3.gif", // Replace with actual path in your project
    points: [
      "Social media marketing and community management",
      "Email marketing campaigns with personalized content",
      "Pay-per-click advertising and retargeting strategies",
      "Content strategy, creation, and distribution",
      "Analytics setup, monitoring, and reporting",
      "Search engine optimization (SEO) and local SEO",
      "Conversion rate optimization and A/B testing",
    ],
  },
];

export default services;
