import { Blend, User } from "lucide-react";

export const customers = {
  customersMain: [
    {
      title: "Recent customers",
      url: "#",
      icon: Blend,
      isActive: true,
      items: [
        {
          id: 1,
          title: "Luciana Almeida",
          url: "/customers/luciana-almeida",
          icon: User,
          description:
            "Luciana is a photographer and a member of the National Union of Photographers (UNIPE).",
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01",
          category: "Photographer",
        },
      ],
    },
  ],
};
