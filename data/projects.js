import {
  Blend,
  CircleDollarSign,
  BookMarked,
  Gamepad2,
  ClipboardList,
  UtensilsCrossed,
  Dumbbell,
  Wallet,
  PawPrint,
  Music,
  Languages,
  Briefcase,
  Newspaper,
  CloudSun,
  ShoppingCart,
  PiggyBank,
  Film,
  Map,
  Leaf,
  CalendarDays,
  Timer,
} from "lucide-react";

import project1 from "@/public/images/project1.jpg";
import project2 from "@/public/images/project2.jpg";
import project3 from "@/public/images/project3.jpg";
import project4 from "@/public/images/project4.jpg";

export const projects = {
  projectsMain: [
    {
      title: "Recent Projects",
      url: "#",
      icon: Blend,
      isActive: true,
      items: [
        {
          id: 1,
          title: "Financial Tracker",
          url: "#",
          icon: CircleDollarSign,
          image: project1,
          description: "Track your expenses, income, and financial goals in one place with intuitive charts and analysis.",
          createdAt: "2024-09-01",
          category: "Finance"
        },
        {
          id: 2,
          title: "Booking Scheduling",
          url: "#",
          icon: BookMarked,
          image: project2,
          description: "Online scheduling system for booking services with an interactive calendar and automatic notifications.",
          createdAt: "2024-08-15",
          category: "Productivity"
        },
        {
          id: 3,
          title: "GameHub",
          url: "#",
          icon: Gamepad2,
          image: project3,
          description: "A platform that brings together games, news, and gaming communities in one personalized experience.",
          createdAt: "2024-07-10",
          category: "Entertainment"
        },
        {
          id: 4,
          title: "Task Manager",
          url: "#",
          icon: ClipboardList,
          image: project1,
          description: "Organize tasks, set priorities, and track your productivity with a simple and effective task manager.",
          createdAt: "2024-07-25",
          category: "Productivity"
        },
        {
          id: 5,
          title: "Recipe App",
          url: "#",
          icon: UtensilsCrossed,
          image: project2,
          description: "Discover and save recipes with step-by-step instructions, videos, and cooking tips.",
          createdAt: "2024-06-18",
          category: "Lifestyle"
        },
        {
          id: 6,
          title: "Fitness Tracker",
          url: "#",
          icon: Dumbbell,
          image: project3,
          description: "Monitor workouts, track physical progress, and get personalized exercise suggestions.",
          createdAt: "2024-06-01",
          category: "Health & Fitness"
        },
        {
          id: 7,
          title: "Crypto Wallet",
          url: "#",
          icon: Wallet,
          image: project4,
          description: "Securely manage your cryptocurrencies, view balances, transactions, and market trends.",
          createdAt: "2024-05-12",
          category: "Finance"
        },
        {
          id: 8,
          title: "Pet Adoption",
          url: "#",
          icon: PawPrint,
          image: project1,
          description: "Find pets for adoption near you with detailed profiles and integrated interest forms.",
          createdAt: "2024-04-22",
          category: "Social / Community"
        },
        {
          id: 9,
          title: "Music Streamer",
          url: "#",
          icon: Music,
          image: project2,
          description: "Stream music, create custom playlists, and discover new artists with smart recommendations.",
          createdAt: "2024-04-10",
          category: "Entertainment"
        },
        {
          id: 10,
          title: "Language Tutor",
          url: "#",
          icon: Languages,
          image: project3,
          description: "Learn new languages with interactive lessons, quizzes, and personalized feedback.",
          createdAt: "2024-03-30",
          category: "Education"
        },
        {
          id: 11,
          title: "Portfolio Builder",
          url: "#",
          icon: Briefcase,
          image: project4,
          description: "Create and customize professional portfolios to showcase your work and experience.",
          createdAt: "2024-03-01",
          category: "Professional Tools"
        },
        {
          id: 12,
          title: "News Aggregator",
          url: "#",
          icon: Newspaper,
          image: project1,
          description: "Stay updated with real-time news from multiple sources, organized by category and interest.",
          createdAt: "2024-02-14",
          category: "Media"
        },
        {
          id: 13,
          title: "Weather App",
          url: "#",
          icon: CloudSun,
          image: project2,
          description: "Check current weather conditions, forecasts, and alerts with a clean, user-friendly interface.",
          createdAt: "2024-01-22",
          category: "Utilities"
        },
        {
          id: 14,
          title: "E-commerce Store",
          url: "#",
          icon: ShoppingCart,
          image: project3,
          description: "A complete e-commerce solution with product listings, shopping cart, and secure checkout.",
          createdAt: "2023-12-10",
          category: "E-commerce"
        },
        {
          id: 15,
          title: "Budget Planner",
          url: "#",
          icon: PiggyBank,
          image: project4,
          description: "Plan and manage your monthly budget with tracking tools, spending categories, and savings goals.",
          createdAt: "2023-11-05",
          category: "Finance"
        },
        {
          id: 16,
          title: "Movie Finder",
          url: "#",
          icon: Film,
          image: project1,
          description: "Search for movies, view trailers, ratings, and discover what's trending or upcoming.",
          createdAt: "2023-10-15",
          category: "Entertainment"
        },
        {
          id: 17,
          title: "Travel Guide",
          url: "#",
          icon: Map,
          image: project2,
          description: "Explore destinations, plan itineraries, and find travel tips and local highlights.",
          createdAt: "2023-09-08",
          category: "Travel"
        },
        {
          id: 18,
          title: "Plant Care",
          url: "#",
          icon: Leaf,
          image: project3,
          description: "Get reminders, tips, and guidance to help you care for your indoor and outdoor plants.",
          createdAt: "2023-08-12",
          category: "Lifestyle"
        },
        {
          id: 19,
          title: "Study Timer",
          url: "#",
          icon: Timer,
          image: project4,
          description: "Boost focus and productivity with a customizable timer based on the Pomodoro technique.",
          createdAt: "2023-07-20",
          category: "Productivity"
        }
      ]
    }
  ]
};



