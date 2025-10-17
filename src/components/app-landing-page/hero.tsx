import Image from "next/image";
import { Figtree } from "next/font/google";
import LocalFont from "next/font/local";

import images from "@/src/data/images";
import { Badge } from "../../components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/button";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const seriously = LocalFont({
  src: "../../../public/fonts/SeriouslyNostalgicFnIt-Reg.otf",
  display: "swap",
});

export default function Hero() {
  return (
    <div className="relative flex items-end justify-between gap-12">
      <div className="relative flex flex-col gap-12 w-1/2">
        <div className="flex flex-col gap-8">
          <Badge>Welcome to Workspacy 👋</Badge>
          <h1
            className={`relative text-[clamp(4.7rem,4vw,6rem)] font-medium ${figtree.className} leading-[0.8] z-10`}
          >
            Our <span className={`${seriously.className}`}>digital</span> <br />
            playground
            <span className={`${seriously.className} text-[#FDC700]`}>.</span>
          </h1>
        </div>
        <div className="flex items-end justify-between gap-2 rounded-full">
          <div className="flex gap-3">
            <div className="flex items-center">
              <Image
                src={images.avatars.avatar_1}
                alt=""
                width={35}
                height={35}
                className="rounded-full"
              />
              <Image
                src={images.avatars.avatar_2}
                alt=""
                width={35}
                height={35}
                className="rounded-full -ml-3"
              />
              <Image
                src={images.avatars.avatar_3}
                alt=""
                width={35}
                height={35}
                className="rounded-full -ml-3"
              />
            </div>
            <div>
              <p className="text-base">We bring creative ideas to life</p>
              <p className="text-xs text-muted-foreground">
                With the help of{" "}
                <span className="text-foreground font-bold">7+ amazing</span>{" "}
                collaborators
              </p>
            </div>
          </div>
        </div>
        <Image
          src={images.abstractShapes.abstract_shape_1}
          alt="vector"
          width={100}
          height={100}
          className="absolute top-[90%] -left-[5%] w-18 rotate-260 animate-bounce"
        />
        <Image
          src={images.abstractShapes.abstract_shape_2}
          alt="vector-1"
          width={100}
          height={100}
          className="absolute top-[10%] right-[8%] w-12 rotate-80 animate-bounce-1"
        />
        <Image
          src={images.abstractShapes.abstract_shape_3}
          alt="vector-2"
          width={100}
          height={100}
          className="absolute right-[0%] top-[30%] w-12 rotate-80 animate-bounce-2"
        />
      </div>
      <div className="w-1/2">
        <div className="relative">
          <div className="relative w-full h-full aspect-video rounded-3xl overflow-clip">
            <Image
              src={images.abstractShapes.abstract_shape_4}
              alt="hero-card-bg"
              className="scale-110 opacity-15"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-5% to-background" />
            <div className="absolute top-0 left-2 p-4 flex flex-col justify-center h-full">
              <Image
                src={images.logos.logo_1}
                alt="logo"
                className="w-32 absolute top-4"
              />
              <h1
                className={`relative text-[clamp(2.25rem,2vw,3.1rem)] font-medium ${figtree.className} leading-none z-10`}
              >
                Be Comfy <br /> And Enjoy <br /> The Journey
              </h1>
            </div>
            <Image
              src={images.heroCards.woman_flat_design}
              alt="hero-card"
              className="absolute -top-8 -right-[35%] h-[150%]"
            />
          </div>
          <div className="tag pt-3 pr-3 flex items-center justify-center absolute left-0 bottom-0 bg-muted rounded-tr-3xl">
            <Button size="lg" className="rounded-full">
              <ArrowUpRight size={16} /> Explore Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
