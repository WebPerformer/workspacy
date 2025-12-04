"use client";

import { ChevronLeft, ChevronRight, Sparkle } from "lucide-react";
import ProductsCards from "@/src/components/products/products-cards";
import { Button } from "@/src/components/ui/button";

export default function AppIntroduction() {
  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={16} />
          <h3 className="text-lg font-medium line-clamp-1">Novos Websites</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="swiper-button-prev">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" className="swiper-button-next">
            <ChevronRight />
          </Button>
        </div>
      </div>
      <ProductsCards />
    </section>
  );
}
