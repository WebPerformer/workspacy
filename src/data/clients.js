import { Blend, User } from "lucide-react";

export const clients = {
  clientsMain: [
    {
      title: "Recent Clients",
      url: "#",
      icon: Blend,
      isActive: true,
      items: [
        {
          id: 1,
          title: "Luciana Almeida",
          url: "/clients/luciana-almeida",
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
