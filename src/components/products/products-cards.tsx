import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "@/src/lib/products";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  metadata: {
    advantages_1?: string;
    advantages_2?: string;
    advantages_3?: string;
    advantages_4?: string;
    category?: string;
    included?: string;
    [key: string]: string | undefined;
  };
  price: {
    id: string;
    type: string;
    unit_amount: number;
    currency: string;
    recurring?: any;
  };
}

export default function ProductsCards() {
  const [selectedOption, setSelectedOption] = useState<string>("one_time");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getProducts();

      if (result?.success) {
        setProducts(result.data);
      } else {
        setError("Failed to fetch products");
        toast.error("Failed to fetch products");
      }
    } catch (err) {
      setError("An error occurred");
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const oneTimeProducts = products.filter(
    (product) => product.price?.type === "one_time"
  );
  const subscriptionProducts = products.filter(
    (product) => product.price?.type === "recurring"
  );

  const handleOpenDrawer = (product: Product) => {
    setSelectedProduct(product);
    setSelectedOption("one_time"); // Reset para compra avulsa
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-lg p-3 @[575px]:p-4 border">
            <div className="relative">
              <Skeleton className="w-full rounded-lg aspect-[12/9]" />
              <Skeleton className="absolute top-2 left-2 h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        ))}
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        575: {
          slidesPerView: 2.7,
          spaceBetween: 16,
        },
      }}
      className="w-full"
    >
      {oneTimeProducts.length > 0 ? (
        oneTimeProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="space-y-4 bg-card rounded-lg p-3 @[575px]:p-4 border h-full">
              <div>
                <Link
                  href="https://viral-sma.framer.website/?via=hxmzaehsan&utm_source=framer"
                  target="_blank"
                  className="relative group cursor-pointer"
                >
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover rounded-lg aspect-[12/9] w-full"
                    />
                  )}
                  <Badge
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 left-2"
                  >
                    <Eye />
                    <span className="text-xs">Pré-Visualizar</span>
                  </Badge>
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium leading-none">
                  {product.name}
                </h1>
                <p className="text-muted-foreground leading-none">
                  {product.metadata.included}
                </p>
              </div>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => handleOpenDrawer(product)}
                  >
                    Usar Template
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-md max-h-[70vh] flex flex-col">
                    <DrawerHeader>
                      <DrawerTitle>Opções de Compra</DrawerTitle>
                      <DrawerDescription>
                        Escolha como deseja adquirir {selectedProduct?.name}
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4">
                      <RadioGroup
                        value={selectedOption}
                        onValueChange={setSelectedOption}
                        className="space-y-4"
                      >
                        {/* Compra Avulsa */}
                        <label
                          htmlFor="one_time"
                          className={`rounded-lg p-4 space-y-2 cursor-pointer block transition-colors hover:bg-muted/40 ${
                            selectedOption === "one_time"
                              ? "border bg-muted/20 border-primary"
                              : "border border-transparent bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="one_time" id="one_time" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Compra Avulsa</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Adquira Permanentemente
                                  </p>
                                </div>
                                <Badge variant="secondary">
                                  {(
                                    (product.price.unit_amount || 0) / 100
                                  ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 flex-shrink-0" />
                            <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                              {Object.entries(product.metadata)
                                .filter(([key]) =>
                                  key.startsWith("advantages_")
                                )
                                .map(([key, value]) => (
                                  <li key={key}>
                                    <span className="text-green-400">✓</span>{" "}
                                    {value}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </label>

                        {/* Assinaturas Disponíveis */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm">
                            Ou inclua em uma assinatura:
                          </h3>
                          {subscriptionProducts.map((subscription) => (
                            <label
                              key={subscription.id}
                              htmlFor={subscription.id}
                              className={`rounded-lg p-4 space-y-2 cursor-pointer block transition-colors hover:bg-muted/40 ${
                                selectedOption === subscription.id
                                  ? "border bg-muted/20 border-primary"
                                  : "border border-transparent bg-muted/20"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value={subscription.id}
                                    id={subscription.id}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium">
                                          {subscription.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          {subscription.metadata.category}
                                        </p>
                                      </div>
                                      <Badge variant="secondary">
                                        {(
                                          (subscription.price.unit_amount ||
                                            0) / 100
                                        ).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                        {subscription.price.recurring
                                          ?.interval === "month" && "/mês"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 flex-shrink-0" />
                                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                                    {Object.entries(subscription.metadata)
                                      .filter(([key]) =>
                                        key.startsWith("advantages_")
                                      )
                                      .map(([key, value]) => (
                                        <li key={key}>
                                          <span className="text-green-400">
                                            ✓
                                          </span>{" "}
                                          {value}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <DrawerFooter className="mt-auto">
                      <Button className="w-full" size="lg">
                        {selectedOption === "one_time"
                          ? "Comprar Agora"
                          : "Assinar Plano"}
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </SwiperSlide>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum template encontrado</p>
        </div>
      )}
    </Swiper>
  );
}
