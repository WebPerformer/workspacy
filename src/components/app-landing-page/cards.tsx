import Image from "next/image";
import { Figtree } from "next/font/google";
import LocalFont from "next/font/local";

import images from "@/src/data/images";

import { Badge } from "../../components/ui/badge";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const seriously = LocalFont({
  src: "../../../public/fonts/SeriouslyNostalgicFnIt-Reg.otf",
  display: "swap",
});

export default function Cards() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <Badge variant="outline" className="text-muted-foreground">
          Powering the next generation of digital products
        </Badge>
        <h1
          className={`text-6xl ${figtree.className} font-medium max-w-[750px] text-center`}
        >
          Developing{" "}
          <span className={`${seriously.className} font-normal`}>
            masterful
          </span>{" "}
          apps in the{" "}
          <span className={`${seriously.className} font-normal`}>simplest</span>{" "}
          way
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="relative aspect-video rounded-lg bg-secondary overflow-clip flex justify-center border">
          <Image
            src={images.heroCards.hero_grid}
            alt="grid"
            className="absolute top-0 left-0 object-cover w-full h-full scale-125 opacity-5"
          />
          <Image
            src={images.heroCards.hero_rainbow_1}
            alt="rainbow"
            className="absolute bottom-0 left-0 object-cover w-full h-full"
          />
          <Image
            src={images.heroCards.hero_wireframe}
            alt="design"
            className="absolute -bottom-5 object-cover w-3/4 h-full rounded-lg"
          />
          <div className="absolute bottom-0 bg-card font-medium w-full px-4 py-2">
            Designing clean pages
          </div>
        </div>
        <div className="relative aspect-video rounded-lg bg-secondary overflow-clip flex justify-center border">
          <Image
            src={images.heroCards.hero_grid}
            alt="grid"
            className="absolute top-0 left-0 object-cover w-full h-full scale-125 opacity-5"
          />
          <Image
            src={images.heroCards.hero_rainbow_2}
            alt="rainbow"
            className="absolute bottom-0 left-0 object-cover w-full h-full"
          />
          <Image
            src={images.heroCards.hero_backend}
            alt="back"
            className="absolute -bottom-5 object-cover w-3/4 h-full rounded-lg"
          />
          <div className="absolute bottom-0 bg-card font-medium w-full px-4 py-2">
            Developing awesome features
          </div>
        </div>
        <div className="relative aspect-video rounded-lg bg-secondary overflow-clip flex justify-center">
          <Image
            src={images.heroCards.hero_grid}
            alt="grid"
            className="absolute top-0 left-0 object-cover w-full h-full scale-125 opacity-5"
          />
          <Image
            src={images.heroCards.hero_rainbow_3}
            alt="rainbow"
            className="absolute bottom-0 left-0 object-cover w-full h-full"
          />
          <Image
            src={images.heroCards.hero_frontend}
            alt="front"
            className="absolute -bottom-5 object-cover w-3/4 h-full rounded-lg"
          />
          <div className="absolute bottom-0 bg-card font-medium w-full px-4 py-2">
            Delivering amazing apps
          </div>
        </div>
      </div>
    </div>
  );
}
