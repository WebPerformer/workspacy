"use client";

import { Sparkle } from "lucide-react";
import ProductsCards from "../components/products/products-cards";

export default function AppIntroduction() {
  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={16} />
          <h3 className="text-lg font-medium line-clamp-1">Novos Templates</h3>
        </div>
      </div>
      <ProductsCards />
    </section>
  );
}
