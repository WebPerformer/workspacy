"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Drama, Trash } from "lucide-react";

import avatar3 from "@/public/images/avatars/3.svg";
import avatar4 from "@/public/images/avatars/4.svg";
import avatar5 from "@/public/images/avatars/5.svg";
import avatar6 from "@/public/images/avatars/6.svg";
import avatar7 from "@/public/images/avatars/7.svg";
import avatar8 from "@/public/images/avatars/8.svg";
import avatar9 from "@/public/images/avatars/9.svg";
import avatar10 from "@/public/images/avatars/10.svg";
import avatar11 from "@/public/images/avatars/11.svg";
import avatar25 from "@/public/images/avatars/25.svg";

import { UpdateProfileImage } from "@/src/lib/user";
import { Button } from "@/src/components/ui/button";
import { AuthContext } from "@/src/contexts/AuthContext";

function Avatar() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const router = useRouter();

  const avatars = [
    {
      image: avatar3,
      name: "3",
    },
    {
      image: avatar4,
      name: "4",
    },
    {
      image: avatar5,
      name: "5",
    },
    {
      image: avatar6,
      name: "6",
    },
    {
      image: avatar7,
      name: "7",
    },
    {
      image: avatar8,
      name: "8",
    },
    {
      image: avatar9,
      name: "9",
    },
    {
      image: avatar10,
      name: "10",
    },
    {
      image: avatar11,
      name: "11",
    },
    {
      image: avatar25,
      name: "25",
    },
  ];

  const { user, setUser } = useContext(AuthContext);

  async function handleSelectAvatar(avatar: string) {
    setSelectedAvatar(avatar);
  }

  async function handleUpdateProfileImage(avatar: string) {
    const { success, data } = await UpdateProfileImage({
      profileImage: avatar,
    });

    if (success) {
      toast.success(data.message);
      if (user) {
        setUser({
          ...user,
          profileImage: avatar,
        });
      }
      router.push("/");
    } else {
      toast.error(data.message);
    }
  }

  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Drama size={16} />
          <h3 className="text-lg font-medium">Pick Your Avatar</h3>
        </div>
        <Button
          variant="secondary"
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash />
          <p className="hidden @[275px]:block text-sm">Remove</p>
        </Button>
      </div>
      <div className="grid grid-cols-2 @[475px]:grid-cols-4 @[675px]:grid-cols-5 gap-2">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`bg-card rounded-lg cursor-pointer ${
              selectedAvatar === avatar.name
                ? "border-2 border-primary"
                : "hover:-translate-y-1 transition-all duration-300"
            }`}
            onClick={() => handleSelectAvatar(avatar.name)}
          >
            <Image
              src={avatar.image}
              alt="Avatar"
              className={`w-full h-full rounded-lg ${
                selectedAvatar === avatar.name && "scale-90"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          disabled={selectedAvatar === null}
          onClick={() => handleUpdateProfileImage(selectedAvatar!)}
        >
          Select This Character
        </Button>
        <Link href="/">
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
    </section>
  );
}

export default Avatar;
