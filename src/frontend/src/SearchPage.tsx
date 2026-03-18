import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

interface Service {
  id: bigint;
  title: string;
  description: string;
  icon: string;
  colorKey: string;
}

const FALLBACK_PRODUCTS: Service[] = [
  {
    id: BigInt(1),
    title: "Noble Essence",
    description:
      "A rare composition of eastern amber, wild Bulgarian rose, and centuries-old sandalwood.",
    icon: "🌹",
    colorKey: "gold",
  },
  {
    id: BigInt(2),
    title: "Midnight Oud",
    description:
      "Rich Arabian oud blended with dark vetiver, leather accord, and a whisper of black orchid.",
    icon: "🌙",
    colorKey: "espresso",
  },
  {
    id: BigInt(3),
    title: "Lumière Blanche",
    description:
      "A radiant accord of white musk, iris absolute, and Comoros ylang-ylang.",
    icon: "✨",
    colorKey: "cream",
  },
  {
    id: BigInt(4),
    title: "Santal Rare",
    description:
      "Mysore sandalwood, Tonka bean, and warm amber resin — an intimate skin scent.",
    icon: "🪵",
    colorKey: "brown",
  },
];

const PRICE_MAP: Record<string, number> = {
  gold: 295,
  espresso: 325,
  cream: 265,
  brown: 245,
  grey: 285,
  rose: 310,
};

function colorKeyToOklch(key: string): string {
  const map: Record<string, string> = {
    gold: "oklch(0.72 0.095 75)",
    brown: "oklch(0.40 0.050 45)",
    grey: "oklch(0.55 0.008 85)",
    espresso: "oklch(0.27 0.055 45)",
    cream: "oklch(0.88 0.020 85)",
    rose: "oklch(0.65 0.090 15)",
  };
  return map[key.toLowerCase()] ?? "oklch(0.72 0.095 75)";
}

export default function SearchPage() {
  const rawQ = new URLSearchParams(window.location.search).get("q") ?? "";
  const [query, setQuery] = useState(rawQ);
  const { actor, isFetching } = useActor();
  const { addItem } = useCart();

  const { data: products = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getServices();
    },
    enabled: !!actor && !isFetching,
  });

  const allProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filtered = query.trim()
    ? allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      )
    : allProducts;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.22 0.008 210)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          background: "oklch(0.20 0.008 210)",
          borderBottom: "1px solid oklch(0.72 0.095 75 / 18%)",
        }}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <a
            href="/"
            className="flex items-center gap-2 font-body text-xs transition-colors flex-shrink-0"
            style={{ color: "oklch(0.55 0.008 85)", letterSpacing: "0.15em" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.72 0.095 75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.55 0.008 85)";
            }}
            data-ocid="search.link"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">BACK</span>
          </a>

          <a
            href="/"
            className="font-display text-sm flex-shrink-0"
            style={{ color: "oklch(0.92 0.010 85)", letterSpacing: "0.3em" }}
          >
            LUXE PARFUM
          </a>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md"
            data-ocid="search.panel"
          >
            <div className="flex items-center gap-3">
              <Search
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "oklch(0.45 0.008 85)" }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fragrances..."
                className="flex-1 bg-transparent outline-none font-body text-sm"
                style={{
                  color: "oklch(0.88 0.010 85)",
                  caretColor: "oklch(0.72 0.095 75)",
                  borderBottom: "1px solid oklch(0.72 0.095 75 / 30%)",
                  paddingBottom: "0.25rem",
                  letterSpacing: "0.05em",
                }}
                data-ocid="search.search_input"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-8 py-12">
        {/* Query label */}
        <div className="mb-8">
          {query.trim() ? (
            <>
              <p
                className="font-body text-xs mb-1"
                style={{
                  color: "oklch(0.45 0.008 85)",
                  letterSpacing: "0.2em",
                }}
              >
                RESULTS FOR
              </p>
              <h1
                className="font-display text-2xl sm:text-3xl"
                style={{
                  color: "oklch(0.72 0.095 75)",
                  letterSpacing: "0.12em",
                }}
              >
                "{query}"
              </h1>
            </>
          ) : (
            <h1
              className="font-display text-2xl sm:text-3xl"
              style={{
                color: "oklch(0.88 0.010 85)",
                letterSpacing: "0.12em",
              }}
            >
              ALL FRAGRANCES
            </h1>
          )}
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="search.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="w-full aspect-square mb-4"
                  style={{ background: "oklch(0.28 0.008 210)" }}
                />
                <div
                  className="h-3 mb-2 rounded"
                  style={{ background: "oklch(0.28 0.008 210)", width: "60%" }}
                />
                <div
                  className="h-3 rounded"
                  style={{ background: "oklch(0.28 0.008 210)", width: "80%" }}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-5"
            data-ocid="search.empty_state"
          >
            <Search
              className="w-12 h-12"
              style={{ color: "oklch(0.30 0.008 85)" }}
            />
            <p
              className="font-serif text-xl text-center"
              style={{ color: "oklch(0.50 0.008 85)" }}
            >
              No fragrances found for "{query}"
            </p>
            <p
              className="font-body text-xs text-center"
              style={{
                color: "oklch(0.38 0.005 85)",
                letterSpacing: "0.1em",
              }}
            >
              TRY A DIFFERENT SEARCH TERM
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={String(p.id)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group"
                data-ocid={`search.item.${i + 1}`}
              >
                <a href={`/product/${String(p.id)}`} className="block">
                  <div
                    className="flex items-center justify-center mb-4 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      background: "oklch(0.25 0.010 210)",
                      border: "1px solid oklch(0.72 0.095 75 / 15%)",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <span
                      className="text-7xl transition-transform duration-500 group-hover:scale-110"
                      role="img"
                      aria-label={p.title}
                    >
                      {p.icon}
                    </span>
                  </div>
                  <h3
                    className="font-display text-xs mb-1"
                    style={{
                      color: colorKeyToOklch(p.colorKey),
                      letterSpacing: "0.15em",
                      fontSize: "0.72rem",
                    }}
                  >
                    {p.title.toUpperCase()}
                  </h3>
                  <p
                    className="font-serif text-xs mb-3 leading-relaxed"
                    style={{
                      color: "oklch(0.55 0.008 85)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {p.description.slice(0, 80)}...
                  </p>
                  <p
                    className="font-serif text-base"
                    style={{ color: "oklch(0.72 0.095 75)" }}
                  >
                    ${PRICE_MAP[p.colorKey] ?? 275}
                  </p>
                </a>
                <button
                  type="button"
                  className="mt-3 w-full py-2.5 font-body text-xs flex items-center justify-center gap-2 transition-all"
                  style={{
                    border: "1px solid oklch(0.72 0.095 75 / 40%)",
                    color: "oklch(0.72 0.095 75)",
                    letterSpacing: "0.2em",
                    fontSize: "0.62rem",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.72 0.095 75 / 10%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                  onClick={() => {
                    addItem({
                      productId: String(p.id),
                      name: p.title,
                      price: PRICE_MAP[p.colorKey] ?? 275,
                      imageUrl: "",
                    });
                    toast.success(`${p.title} added to cart!`);
                  }}
                  data-ocid={`search.secondary_button.${i + 1}`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  ADD TO CART
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
