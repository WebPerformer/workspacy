import { Blend, CircleDollarSign, Gamepad2, BookMarked } from "lucide-react";

import financialTracker from "@/public/images/project1.jpg";
import bookingScheduling from "@/public/images/project2.jpg";
import gameHub from "@/public/images/project3.jpg";


export const projects = {
    projectsMain: [
        {
          title: "Recent Projects",
          url: "#",
          icon: Blend,
          isActive: true,
          items: [
            {
              title: "Financial Tracker",
              url: "#",
              icon: CircleDollarSign,
              image: financialTracker,
            },
            {
              title: "Booking Scheduling",
              url: "#",
              icon: BookMarked,
              image: bookingScheduling,
            },
            {
              title: "GameHub",
              url: "#",
              icon: Gamepad2,
              image: gameHub,
            },
          ],
        },
      ]
}