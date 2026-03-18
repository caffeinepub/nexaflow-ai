import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

interface Service {
  id: bigint;
  title: string;
  description: string;
  icon: string;
  colorKey: string;
}

// Fallback products if none in backend
const FALLBACK_PRODUCTS: Service[] = [
  {
    id: BigInt(1),
    title: "Noble Essence",
    description:
      "A rare composition of eastern amber, wild Bulgarian rose, and centuries-old sandalwood — bottled in singular luxury.",
    icon: "🌹",
    colorKey: "gold",
  },
  {
    id: BigInt(2),
    title: "Midnight Oud",
    description:
      "Rich Arabian oud blended with dark vetiver, leather accord, and a whisper of black orchid. Commanding and timeless.",
    icon: "🌙",
    colorKey: "espresso",
  },
  {
    id: BigInt(3),
    title: "Lumière Blanche",
    description:
      "A radiant accord of white musk, iris absolute, and Comoros ylang-ylang — pure, luminous, unforgettable.",
    icon: "✨",
    colorKey: "cream",
  },
  {
    id: BigInt(4),
    title: "Santal Rare",
    description:
      "Mysore sandalwood, Tonka bean, and warm amber resin — an intimate skin scent of quiet sophistication.",
    icon: "🪵",
    colorKey: "brown",
  },
];

const FRAGRANCE_MAP: Record<
  string,
  { top: string; heart: string; base: string }
> = {
  "noble essence": {
    top: "Bergamot, Sicilian Lemon",
    heart: "Bulgarian Rose, Pink Pepper",
    base: "Sandalwood, White Musk",
  },
  "midnight oud": {
    top: "Black Pepper, Cardamom",
    heart: "Oud, Black Orchid",
    base: "Vetiver, Leather, Amber",
  },
  "lumière blanche": {
    top: "Citrus, Aldehydes",
    heart: "Iris, Ylang-Ylang",
    base: "White Musk, Cedarwood",
  },
  "santal rare": {
    top: "Bergamot, Grapefruit",
    heart: "Sandalwood, Jasmine",
    base: "Tonka Bean, Amber Resin",
  },
};

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

export default function ProductDetailPage() {
  const productId = window.location.pathname.split("/product/")[1];
  const { actor, isFetching } = useActor();
  const { addItem } = useCart();

  const { data: products = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getServices();
    },
    enabled: !!actor && !isFetching,
  });

  const allProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;
  const product = allProducts.find(
    (p) =>
      String(p.id) === productId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === productId,
  );

  const related = allProducts.filter((p) => p.id !== product?.id).slice(0, 3);
  const fragrance = product
    ? (FRAGRANCE_MAP[product.title.toLowerCase()] ?? {
        top: "Citrus, Bergamot",
        heart: "Rose, Jasmine",
        base: "Sandalwood, Musk",
      })
    : null;
  const price = product ? (PRICE_MAP[product.colorKey] ?? 275) : 275;

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "oklch(0.22 0.008 210)" }}
        data-ocid="product.error_state"
      >
        <p
          className="font-serif text-xl"
          style={{ color: "oklch(0.72 0.095 75)" }}
        >
          Product not found.
        </p>
        <a
          href="/"
          className="mt-6 font-body text-xs"
          style={{ color: "oklch(0.55 0.008 85)", letterSpacing: "0.2em" }}
          data-ocid="product.link"
        >
          ← BACK TO COLLECTIONS
        </a>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.22 0.008 210)" }}
    >
      {/* Mini header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "oklch(0.20 0.008 210)",
          borderBottom: "1px solid oklch(0.72 0.095 75 / 18%)",
        }}
      >
        <a
          href="/"
          className="flex items-center gap-2 font-body text-xs transition-colors"
          style={{ color: "oklch(0.55 0.008 85)", letterSpacing: "0.15em" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.72 0.095 75)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.55 0.008 85)";
          }}
          data-ocid="product.link"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK TO COLLECTIONS
        </a>
        <a
          href="/"
          className="font-display text-sm"
          style={{ color: "oklch(0.92 0.010 85)", letterSpacing: "0.3em" }}
        >
          LUXE PARFUM
        </a>
        <div className="w-24" />
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Product hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
            style={{
              background: "oklch(0.25 0.010 210)",
              border: "1px solid oklch(0.72 0.095 75 / 18%)",
              aspectRatio: "1 / 1",
            }}
          >
            <span
              className="text-9xl md:text-[10rem]"
              role="img"
              aria-label={product.title}
            >
              {product.icon}
            </span>
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <span
              className="font-body text-xs mb-4 inline-block px-3 py-1"
              style={{
                background: "oklch(0.72 0.095 75 / 12%)",
                color: "oklch(0.72 0.095 75)",
                letterSpacing: "0.2em",
                fontSize: "0.6rem",
                border: "1px solid oklch(0.72 0.095 75 / 25%)",
                width: "fit-content",
              }}
              data-ocid="product.card"
            >
              {product.colorKey.toUpperCase()}
            </span>

            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4"
              style={{
                color: colorKeyToOklch(product.colorKey),
                letterSpacing: "0.12em",
                lineHeight: 1.1,
              }}
            >
              {product.title.toUpperCase()}
            </h1>

            <p
              className="font-display text-2xl sm:text-3xl mb-6"
              style={{ color: "oklch(0.72 0.095 75)", letterSpacing: "0.05em" }}
            >
              ${price}
            </p>

            <p
              className="font-serif leading-relaxed mb-8"
              style={{
                color: "oklch(0.75 0.012 85)",
                fontSize: "1.05rem",
                lineHeight: 1.85,
              }}
            >
              {product.description}
            </p>

            {/* Fragrance notes */}
            {fragrance && (
              <div
                className="mb-8 p-5"
                style={{
                  background: "oklch(0.25 0.010 210)",
                  border: "1px solid oklch(0.72 0.095 75 / 15%)",
                }}
              >
                <p
                  className="font-body text-xs mb-4"
                  style={{
                    color: "oklch(0.72 0.095 75)",
                    letterSpacing: "0.25em",
                    fontSize: "0.6rem",
                  }}
                >
                  FRAGRANCE NOTES
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {(
                    [
                      ["TOP", "🍊", fragrance.top],
                      ["HEART", "🌹", fragrance.heart],
                      ["BASE", "🪵", fragrance.base],
                    ] as const
                  ).map(([label, icon, value]) => (
                    <div key={label}>
                      <p
                        className="font-body text-xs mb-1"
                        style={{
                          color: "oklch(0.45 0.008 85)",
                          letterSpacing: "0.15em",
                          fontSize: "0.58rem",
                        }}
                      >
                        {icon} {label}
                      </p>
                      <p
                        className="font-serif text-xs"
                        style={{
                          color: "oklch(0.80 0.012 85)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="flex items-center justify-center gap-3 py-4 font-display text-xs transition-all"
              style={{
                background: "oklch(0.72 0.095 75)",
                color: "oklch(0.18 0.008 210)",
                letterSpacing: "0.25em",
                fontSize: "0.7rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.80 0.095 75)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.72 0.095 75)";
              }}
              onClick={() => {
                addItem({
                  productId: String(product.id),
                  name: product.title,
                  price,
                  imageUrl: "",
                });
                toast.success(`${product.title} added to cart!`);
              }}
              data-ocid="product.primary_button"
            >
              <ShoppingBag className="w-4 h-4" />
              ADD TO CART
            </button>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <p
                className="font-body text-xs mb-3"
                style={{
                  color: "oklch(0.72 0.095 75 / 70%)",
                  letterSpacing: "0.3em",
                }}
              >
                YOU MAY ALSO LOVE
              </p>
              <h2
                className="font-display text-2xl"
                style={{
                  color: "oklch(0.88 0.010 85)",
                  letterSpacing: "0.15em",
                }}
              >
                RELATED FRAGRANCES
              </h2>
              <hr
                className="mx-auto mt-5"
                style={{
                  width: "2.5rem",
                  borderTop: "1px solid oklch(0.72 0.095 75 / 40%)",
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <motion.a
                  key={String(p.id)}
                  href={`/product/${String(p.id)}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group block"
                  data-ocid={`product.item.${i + 1}`}
                >
                  <div
                    className="flex items-center justify-center mb-4 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      background: "oklch(0.25 0.010 210)",
                      border: "1px solid oklch(0.72 0.095 75 / 15%)",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <span
                      className="text-6xl transition-transform duration-500 group-hover:scale-110"
                      role="img"
                      aria-label={p.title}
                    >
                      {p.icon}
                    </span>
                  </div>
                  <p
                    className="font-display text-xs mb-1"
                    style={{
                      color: colorKeyToOklch(p.colorKey),
                      letterSpacing: "0.15em",
                      fontSize: "0.7rem",
                    }}
                  >
                    {p.title.toUpperCase()}
                  </p>
                  <p
                    className="font-serif text-sm"
                    style={{ color: "oklch(0.72 0.095 75)" }}
                  >
                    ${PRICE_MAP[p.colorKey] ?? 275}
                  </p>
                </motion.a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        className="text-center py-8 mt-10"
        style={{ borderTop: "1px solid oklch(0.72 0.095 75 / 12%)" }}
      >
        <p
          className="font-body text-xs"
          style={{
            color: "oklch(0.35 0.005 85)",
            letterSpacing: "0.08em",
            fontSize: "0.72rem",
          }}
        >
          © {new Date().getFullYear()} Luxe Parfum. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.72 0.095 75)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
