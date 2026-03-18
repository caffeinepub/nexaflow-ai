import { Toaster } from "@/components/ui/sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiPinterest } from "react-icons/si";
import AdminPanel from "./AdminPanel";
import ProductDetailPage from "./ProductDetailPage";
import SearchPage from "./SearchPage";
import UserLoginPage from "./UserLoginPage";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider, useCart } from "./contexts/CartContext";
import { useActor } from "./hooks/useActor";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Service {
  id: bigint;
  title: string;
  description: string;
  icon: string;
  colorKey: string;
}

interface Testimonial {
  id: bigint;
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
  colorKey: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

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

// ─── Static Data ───────────────────────────────────────────────────────────

const navLinks = ["COLLECTIONS", "SCENTS", "STORY", "CONTACT"];

const fragranceNotes = [
  {
    label: "TOP NOTES",
    icon: "🍊",
    title: "Citrus & Green",
    desc: "Bergamot, Sicilian lemon, green cardamom — bright, sparkling, ephemeral",
  },
  {
    label: "HEART NOTES",
    icon: "🌹",
    title: "Floral & Spice",
    desc: "Turkish rose, jasmine sambac, pink pepper — the soul of the composition",
  },
  {
    label: "BASE NOTES",
    icon: "🪵",
    title: "Wood & Musk",
    desc: "Sandalwood, vetiver, white musk — deep, enduring, skin-close warmth",
  },
];

// ─── Components ────────────────────────────────────────────────────────────

function Header() {
  const [active, setActive] = useState("COLLECTIONS");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalCount, openCart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "oklch(0.22 0.008 210)",
        borderBottom: "1px solid oklch(0.72 0.095 75 / 18%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
        {/* Brand row */}
        <div className="flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex md:hidden items-center justify-center w-8 h-8"
            style={{ color: "oklch(0.72 0.095 75)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Center brand */}
          <a
            href="/"
            className="flex flex-col items-center gap-0.5"
            data-ocid="nav.link"
          >
            <div className="flex items-center gap-1 mb-0.5">
              <div
                className="w-2 h-2 rotate-45"
                style={{ background: "oklch(0.72 0.095 75)" }}
              />
              <div
                className="w-1 h-1 rotate-45"
                style={{ background: "oklch(0.72 0.095 75 / 50%)" }}
              />
              <div
                className="w-2 h-2 rotate-45"
                style={{ background: "oklch(0.72 0.095 75)" }}
              />
            </div>
            <h1
              className="font-display text-xl sm:text-2xl"
              style={{ color: "oklch(0.95 0.010 85)", letterSpacing: "0.35em" }}
            >
              LUXE PARFUM
            </h1>
            <p
              className="font-body text-xs hidden sm:block"
              style={{
                color: "oklch(0.72 0.095 75)",
                letterSpacing: "0.5em",
                fontSize: "0.55rem",
              }}
            >
              MAISON DE PARFUMERIE
            </p>
          </a>

          {/* Right: search + cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop search */}
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none font-body text-xs w-36"
                  style={{
                    color: "oklch(0.88 0.010 85)",
                    caretColor: "oklch(0.72 0.095 75)",
                    borderBottom: "1px solid oklch(0.72 0.095 75 / 40%)",
                    paddingBottom: "2px",
                    letterSpacing: "0.05em",
                  }}
                  data-ocid="nav.search_input"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ color: "oklch(0.45 0.008 85)" }}
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="hidden md:flex items-center justify-center transition-colors"
                style={{ color: "oklch(0.55 0.010 85)" }}
                onClick={() => setSearchOpen(true)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.72 0.095 75)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.55 0.010 85)";
                }}
                aria-label="Open search"
                data-ocid="nav.button"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Mobile search icon */}
            <a
              href="/search"
              className="flex md:hidden items-center justify-center transition-colors"
              style={{ color: "oklch(0.55 0.010 85)" }}
              aria-label="Search"
              data-ocid="nav.link"
            >
              <Search className="w-4 h-4" />
            </a>

            {/* Cart */}
            <button
              type="button"
              className="flex items-center gap-1.5 font-body text-xs transition-colors relative"
              style={{ color: "oklch(0.65 0.010 85)", letterSpacing: "0.15em" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.72 0.095 75)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.65 0.010 85)";
              }}
              onClick={openCart}
              data-ocid="nav.button"
            >
              <span className="hidden sm:inline">CART</span>
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full font-body flex items-center justify-center"
                    style={{
                      background: "oklch(0.72 0.095 75)",
                      color: "oklch(0.18 0.008 210)",
                      fontSize: "0.55rem",
                      fontWeight: 600,
                    }}
                  >
                    {totalCount > 9 ? "9+" : totalCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Nav row */}
        <hr className="divider-gold my-3" />
        <nav className="hidden md:flex justify-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              className={`font-body text-xs transition-colors pb-1 ${active === link ? "nav-active" : ""}`}
              style={{
                color:
                  active === link
                    ? "oklch(0.72 0.095 75)"
                    : "oklch(0.65 0.010 85)",
                letterSpacing: "0.2em",
              }}
              onClick={() => {
                setActive(link);
                document
                  .getElementById(link.toLowerCase())
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              data-ocid="nav.tab"
            >
              {link}
            </button>
          ))}
          <a
            href="/login"
            className="font-body text-xs transition-colors pb-1"
            style={{ color: "oklch(0.72 0.095 75)", letterSpacing: "0.2em" }}
            data-ocid="nav.link"
          >
            LOGIN
          </a>
        </nav>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="flex md:hidden flex-col gap-1 pt-3 pb-1">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="font-body text-xs text-left py-2 transition-colors"
                style={{
                  color:
                    active === link
                      ? "oklch(0.72 0.095 75)"
                      : "oklch(0.65 0.010 85)",
                  letterSpacing: "0.2em",
                }}
                onClick={() => {
                  setActive(link);
                  setMenuOpen(false);
                  document
                    .getElementById(link.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-ocid="nav.tab"
              >
                {link}
              </button>
            ))}
            {/* Mobile search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 py-2"
            >
              <Search
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.45 0.008 85)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances..."
                className="bg-transparent outline-none font-body text-xs flex-1"
                style={{
                  color: "oklch(0.88 0.010 85)",
                  caretColor: "oklch(0.72 0.095 75)",
                  borderBottom: "1px solid oklch(0.72 0.095 75 / 30%)",
                  paddingBottom: "2px",
                  letterSpacing: "0.05em",
                }}
                data-ocid="nav.search_input"
              />
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.008 210) 0%, oklch(0.24 0.010 210) 60%, oklch(0.22 0.018 50) 100%)",
        minHeight: "90vh",
      }}
      data-ocid="hero.section"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 70% 50%, oklch(0.30 0.030 60 / 20%) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center min-h-[90vh] gap-8 py-16 md:py-0">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex-1 max-w-lg text-center md:text-left"
        >
          <p className="overline-gold mb-6" style={{ letterSpacing: "0.35em" }}>
            NEW COLLECTION — 2026
          </p>
          <h2
            className="font-display leading-none mb-6"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
              color: "oklch(0.72 0.095 75)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
            }}
          >
            NOBLE
            <br />
            ESSENCE
          </h2>
          <p
            className="font-serif text-base leading-relaxed mb-10 mx-auto md:mx-0"
            style={{
              color: "oklch(0.78 0.012 85)",
              fontSize: "1.05rem",
              maxWidth: "400px",
            }}
          >
            A rare composition of eastern amber, wild Bulgarian rose, and
            centuries-old sandalwood — bottled in singular luxury.
          </p>
          <button
            type="button"
            className="btn-gold-outline"
            onClick={() =>
              document
                .getElementById("collections")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.primary_button"
          >
            EXPLORE THE SCENT
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Right: hero bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
          className="flex-1 flex justify-center items-end animate-float w-full md:w-auto"
          style={{ maxWidth: "500px" }}
        >
          <img
            src="/assets/generated/hero-perfume-bottle.dim_600x800.jpg"
            alt="Noble Essence — Flagship Fragrance"
            className="object-contain drop-shadow-2xl"
            style={{
              maxHeight: "60vh",
              width: "auto",
              filter: "drop-shadow(0 30px 60px oklch(0.10 0.008 210 / 80%))",
            }}
          />
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.22 0.008 210))",
        }}
      />
    </section>
  );
}

function ServicesSection() {
  const { actor, isFetching } = useActor();
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getServices();
    },
    enabled: !!actor && !isFetching,
  });

  const loading = isLoading || isFetching;

  return (
    <section
      id="collections"
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.91 0.004 85)" }}
      data-ocid="collections.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="overline-gold mb-3" style={{ letterSpacing: "0.3em" }}>
            MAISON LUXE PARFUM
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: "oklch(0.22 0.008 210)", letterSpacing: "0.15em" }}
          >
            OUR COLLECTION
          </h2>
          <hr
            className="mx-auto mt-6"
            style={{
              width: "3rem",
              borderTop: "1px solid oklch(0.72 0.095 75 / 50%)",
            }}
          />
        </motion.div>

        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="collections.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="w-full aspect-square mb-4 rounded"
                  style={{ background: "oklch(0.80 0.004 85)" }}
                />
                <div
                  className="h-3 rounded mb-2"
                  style={{ background: "oklch(0.80 0.004 85)", width: "60%" }}
                />
                <div
                  className="h-3 rounded"
                  style={{ background: "oklch(0.80 0.004 85)", width: "80%" }}
                />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="collections.empty_state"
          >
            <p
              className="font-serif text-lg"
              style={{ color: "oklch(0.50 0.010 85)" }}
            >
              No collections available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={String(s.id)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
                data-ocid={`collections.item.${i + 1}`}
              >
                <div
                  className="overflow-hidden mb-4 flex items-center justify-center"
                  style={{
                    background: "oklch(0.95 0.006 85)",
                    border: "1px solid oklch(0.72 0.095 75 / 15%)",
                    aspectRatio: "1 / 1",
                  }}
                >
                  <span
                    className="text-6xl sm:text-7xl transition-transform duration-500 group-hover:scale-110"
                    role="img"
                    aria-label={s.title}
                  >
                    {s.icon}
                  </span>
                </div>
                <div className="px-1">
                  <h3
                    className="font-display text-sm mb-1"
                    style={{
                      color: colorKeyToOklch(s.colorKey),
                      letterSpacing: "0.15em",
                      fontSize: "0.75rem",
                    }}
                  >
                    {s.title.toUpperCase()}
                  </h3>
                  <p
                    className="font-serif text-xs mb-3 leading-relaxed"
                    style={{
                      color: "oklch(0.40 0.008 85)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {s.description}
                  </p>
                  <a
                    href={`/product/${String(s.id)}`}
                    className="font-body text-xs transition-colors"
                    style={{
                      color: "oklch(0.72 0.095 75)",
                      letterSpacing: "0.15em",
                      fontSize: "0.65rem",
                    }}
                    data-ocid={`collections.button.${i + 1}`}
                  >
                    DISCOVER →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section
      id="story"
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.27 0.055 45)" }}
      data-ocid="story.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p
            className="font-body text-xs mb-3"
            style={{
              color: "oklch(0.72 0.095 75 / 80%)",
              letterSpacing: "0.3em",
            }}
          >
            EST. 1892 · PARIS
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: "oklch(0.72 0.095 75)", letterSpacing: "0.15em" }}
          >
            THE LUXE STORY
          </h2>
          <hr
            className="mx-auto mt-6"
            style={{
              width: "3rem",
              borderTop: "1px solid oklch(0.72 0.095 75 / 35%)",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="absolute -top-3 -left-3 w-16 h-16 pointer-events-none"
              style={{ border: "1px solid oklch(0.72 0.095 75 / 35%)" }}
            />
            <img
              src="/assets/generated/perfume-heritage.dim_600x500.jpg"
              alt="The Luxe Parfum Atelier"
              className="w-full object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div
              className="absolute -bottom-3 -right-3 w-16 h-16 pointer-events-none"
              style={{ border: "1px solid oklch(0.72 0.095 75 / 35%)" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="overline-gold mb-4"
              style={{ letterSpacing: "0.3em" }}
            >
              OUR HERITAGE
            </p>
            <h3
              className="font-display text-xl sm:text-2xl mb-6"
              style={{ color: "oklch(0.92 0.010 85)", letterSpacing: "0.08em" }}
            >
              A CENTURY OF
              <br />
              OLFACTORY ARTISTRY
            </h3>
            <p
              className="font-serif leading-relaxed mb-6"
              style={{
                color: "oklch(0.80 0.020 75)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
              }}
            >
              Founded in the perfume quarter of Grasse, the Maison Luxe Parfum
              has for four generations pursued a singular obsession: the capture
              of fleeting beauty in permanent form.
            </p>
            <p
              className="font-serif leading-relaxed mb-8"
              style={{
                color: "oklch(0.68 0.018 75)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Today, every bottle that leaves our atelier carries 130 years of
              accumulated knowledge — crafted by master perfumers whose
              dedication to absolute quality has never wavered.
            </p>
            <button
              type="button"
              className="btn-gold-outline"
              onClick={() =>
                document
                  .getElementById("story")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="story.primary_button"
            >
              DISCOVER OUR STORY
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FragranceNotesSection() {
  return (
    <section
      id="scents"
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.96 0.015 85)" }}
      data-ocid="scents.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p
            className="font-body text-xs mb-3"
            style={{ color: "oklch(0.55 0.050 75)", letterSpacing: "0.3em" }}
          >
            THE COMPOSITION
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: "oklch(0.22 0.008 210)", letterSpacing: "0.15em" }}
          >
            FRAGRANCE NOTES
          </h2>
          <hr
            className="mx-auto mt-6"
            style={{
              width: "3rem",
              borderTop: "1px solid oklch(0.72 0.095 75 / 50%)",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {fragranceNotes.map((note, i) => (
            <motion.div
              key={note.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="text-center px-4 sm:px-6 py-8 sm:py-10"
              style={{
                background: "oklch(1 0 0 / 60%)",
                border: "1px solid oklch(0.72 0.095 75 / 15%)",
              }}
              data-ocid={`scents.item.${i + 1}`}
            >
              <div className="text-5xl mb-5">{note.icon}</div>
              <p
                className="overline-gold mb-2"
                style={{ letterSpacing: "0.25em" }}
              >
                {note.label}
              </p>
              <h3
                className="font-display text-lg mb-4"
                style={{
                  color: "oklch(0.22 0.008 210)",
                  letterSpacing: "0.08em",
                }}
              >
                {note.title}
              </h3>
              <hr
                className="mx-auto mb-5"
                style={{
                  width: "2rem",
                  borderTop: "1px solid oklch(0.72 0.095 75 / 40%)",
                }}
              />
              <p
                className="font-serif text-sm leading-relaxed"
                style={{
                  color: "oklch(0.40 0.010 85)",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
              >
                {note.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { actor, isFetching } = useActor();
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });

  const loading = isLoading || isFetching;

  if (!loading && testimonials.length === 0) return null;

  return (
    <section
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.22 0.008 210)" }}
      data-ocid="testimonials.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="overline-gold mb-3" style={{ letterSpacing: "0.3em" }}>
            FROM OUR CLIENTS
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: "oklch(0.95 0.010 85)", letterSpacing: "0.12em" }}
          >
            TESTIMONIALS
          </h2>
          <hr
            className="mx-auto mt-6"
            style={{
              width: "3rem",
              borderTop: "1px solid oklch(0.72 0.095 75 / 40%)",
            }}
          />
        </motion.div>

        {loading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="testimonials.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse p-6"
                style={{
                  background: "oklch(0.25 0.010 210)",
                  border: "1px solid oklch(0.72 0.095 75 / 15%)",
                }}
              >
                <div
                  className="h-4 rounded mb-3"
                  style={{ background: "oklch(0.30 0.008 210)", width: "90%" }}
                />
                <div
                  className="h-4 rounded mb-3"
                  style={{ background: "oklch(0.30 0.008 210)", width: "75%" }}
                />
                <div
                  className="h-4 rounded mb-6"
                  style={{ background: "oklch(0.30 0.008 210)", width: "60%" }}
                />
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ background: "oklch(0.30 0.008 210)" }}
                  />
                  <div className="flex-1">
                    <div
                      className="h-3 rounded mb-1"
                      style={{
                        background: "oklch(0.30 0.008 210)",
                        width: "50%",
                      }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{
                        background: "oklch(0.30 0.008 210)",
                        width: "70%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={String(t.id)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 sm:p-8 flex flex-col"
                style={{
                  background: "oklch(0.25 0.010 210)",
                  border: "1px solid oklch(0.72 0.095 75 / 15%)",
                }}
                data-ocid={`testimonials.item.${i + 1}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="oklch(0.72 0.095 75)"
                      aria-hidden="true"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="font-serif leading-relaxed flex-1 mb-6"
                  style={{
                    color: "oklch(0.80 0.012 85)",
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    fontStyle: "italic",
                  }}
                >
                  “{t.quote}”
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: "1px solid oklch(0.72 0.095 75 / 15%)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: colorKeyToOklch(t.colorKey),
                      color: "oklch(0.18 0.008 210)",
                    }}
                  >
                    <span
                      className="font-display text-xs"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-body text-xs font-medium"
                      style={{
                        color: "oklch(0.90 0.010 85)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="font-body text-xs"
                      style={{
                        color: "oklch(0.55 0.010 85)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t.title}
                      {t.company ? `, ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  const { actor, isFetching } = useActor();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).submitForm(data.name, data.email, data.message);
    },
    onSuccess: () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setFieldError("");
    },
    onError: () => {
      setFieldError("Something went wrong. Please try again.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFieldError("Please fill in all fields.");
      return;
    }
    mutation.mutate({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  }

  const isSubmitting = mutation.isPending || isFetching;

  return (
    <section
      id="contact"
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.19 0.008 210)" }}
      data-ocid="contact.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="overline-gold mb-3" style={{ letterSpacing: "0.3em" }}>
            REACH OUT
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: "oklch(0.95 0.010 85)", letterSpacing: "0.12em" }}
          >
            CONTACT US
          </h2>
          <hr
            className="mx-auto mt-6"
            style={{
              width: "3rem",
              borderTop: "1px solid oklch(0.72 0.095 75 / 40%)",
            }}
          />
          <p
            className="font-serif mt-6 mx-auto"
            style={{
              color: "oklch(0.60 0.010 85)",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: "480px",
            }}
          >
            We would love to hear from you. Send us a message and we will
            respond within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div
              className="flex flex-col items-center gap-4 py-16 text-center"
              data-ocid="contact.success_state"
            >
              <CheckCircle2
                className="w-12 h-12"
                style={{ color: "oklch(0.72 0.095 75)" }}
              />
              <h3
                className="font-display text-xl"
                style={{
                  color: "oklch(0.92 0.010 85)",
                  letterSpacing: "0.1em",
                }}
              >
                MESSAGE RECEIVED
              </h3>
              <p
                className="font-serif"
                style={{
                  color: "oklch(0.60 0.010 85)",
                  maxWidth: "360px",
                  lineHeight: 1.8,
                }}
              >
                Thank you for reaching out. We will be in touch shortly.
              </p>
              <button
                type="button"
                className="btn-gold-outline mt-4"
                onClick={() => setSubmitted(false)}
                data-ocid="contact.secondary_button"
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-body text-xs mb-2 block"
                  style={{
                    color: "oklch(0.55 0.008 85)",
                    letterSpacing: "0.15em",
                  }}
                >
                  FULL NAME
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(0.45 0.008 85)" }}
                  />
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="newsletter-input w-full pl-11"
                    style={{ borderRadius: 0 }}
                    data-ocid="contact.input"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="font-body text-xs mb-2 block"
                  style={{
                    color: "oklch(0.55 0.008 85)",
                    letterSpacing: "0.15em",
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(0.45 0.008 85)" }}
                  />
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input w-full pl-11"
                    style={{ borderRadius: 0 }}
                    data-ocid="contact.input"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs mb-2 block"
                  style={{
                    color: "oklch(0.55 0.008 85)",
                    letterSpacing: "0.15em",
                  }}
                >
                  MESSAGE
                </label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-4 top-4 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(0.45 0.008 85)" }}
                  />
                  <textarea
                    id="contact-message"
                    placeholder="Tell us how we can help you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                    className="newsletter-input w-full pl-11 pt-4 resize-none"
                    style={{ borderRadius: 0 }}
                    data-ocid="contact.textarea"
                  />
                </div>
              </div>

              {/* Error */}
              {fieldError && (
                <p
                  className="font-body text-xs"
                  style={{
                    color: "oklch(0.65 0.20 25)",
                    letterSpacing: "0.08em",
                  }}
                  data-ocid="contact.error_state"
                >
                  {fieldError}
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold-outline flex items-center gap-2"
                  data-ocid="contact.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>SEND MESSAGE</>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  }

  return (
    <section
      className="py-16 sm:py-20"
      style={{ background: "oklch(0.22 0.008 210)" }}
      data-ocid="newsletter.section"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="font-body text-xs mb-3"
            style={{ color: "oklch(0.72 0.095 75)", letterSpacing: "0.3em" }}
          >
            THE INNER CIRCLE
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl mb-4"
            style={{ color: "oklch(0.95 0.010 85)", letterSpacing: "0.12em" }}
          >
            STAY CONNECTED
          </h2>
          <p
            className="font-serif mb-10 mx-auto"
            style={{
              color: "oklch(0.60 0.010 85)",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: "400px",
            }}
          >
            Be the first to discover new collections, exclusive events, and the
            private stories behind each creation.
          </p>

          {submitted ? (
            <p
              className="font-serif text-lg"
              style={{ color: "oklch(0.72 0.095 75)" }}
              data-ocid="newsletter.success_state"
            >
              Thank you. You are now part of the Maison.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row justify-center gap-0 mx-auto max-w-md"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input flex-1 w-full"
                data-ocid="newsletter.input"
              />
              <button
                type="submit"
                className="btn-gold-solid rounded-none"
                style={{ padding: "0.75rem 1.5rem", borderRadius: 0 }}
                data-ocid="newsletter.submit_button"
              >
                SUBSCRIBE
              </button>
            </form>
          )}

          <div className="flex justify-center gap-6 mt-10">
            {(
              [
                { Icon: SiInstagram, label: "Instagram" },
                { Icon: SiFacebook, label: "Facebook" },
                { Icon: SiPinterest, label: "Pinterest" },
              ] as const
            ).map(({ Icon, label }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{
                  border: "1px solid oklch(0.72 0.095 75 / 35%)",
                  color: "oklch(0.65 0.010 85)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "oklch(0.72 0.095 75)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "oklch(0.72 0.095 75)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "oklch(0.65 0.010 85)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "oklch(0.72 0.095 75 / 35%)";
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const tiles = [
    {
      overline: "SIGNATURE COLLECTION",
      headline: "THE ART OF\nSCENT",
      sub: "Explore our twelve-piece core range, each a distinct chapter in the Maison's olfactory narrative.",
      cta: "EXPLORE NOW",
    },
    {
      overline: "PRIVATE APPOINTMENTS",
      headline: "BESPOKE\nFRAGRANCE",
      sub: "Commission a fragrance crafted solely for you — a private consultation with our master perfumer.",
      cta: "BOOK A VISIT",
    },
  ];

  return (
    <section
      className="py-0"
      style={{ background: "oklch(0.19 0.008 210)" }}
      data-ocid="feature.section"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.overline}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="px-8 sm:px-12 lg:px-16 py-16 sm:py-20 flex flex-col items-start"
            style={{
              borderTop: "1px solid oklch(0.72 0.095 75 / 12%)",
              borderBottom: "1px solid oklch(0.72 0.095 75 / 12%)",
              borderRight:
                i === 0 ? "1px solid oklch(0.72 0.095 75 / 12%)" : undefined,
            }}
            data-ocid={`feature.item.${i + 1}`}
          >
            <p
              className="overline-gold mb-5"
              style={{ letterSpacing: "0.3em" }}
            >
              {tile.overline}
            </p>
            <h3
              className="font-display text-2xl sm:text-3xl mb-5 whitespace-pre-line"
              style={{
                color: "oklch(0.95 0.010 85)",
                letterSpacing: "0.10em",
                lineHeight: 1.15,
              }}
            >
              {tile.headline}
            </h3>
            <p
              className="font-serif mb-8 leading-relaxed"
              style={{
                color: "oklch(0.55 0.010 85)",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                maxWidth: "340px",
              }}
            >
              {tile.sub}
            </p>
            <button
              type="button"
              className="btn-gold-outline"
              style={{ fontSize: "0.65rem" }}
              onClick={() =>
                document
                  .getElementById("collections")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid={`feature.button.${i + 1}`}
            >
              {tile.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    Collections: [
      "Noble Essence",
      "Ivory Soleil",
      "Amber Nocturne",
      "Rose Velour",
      "Cognac Opéra",
    ],
    Account: ["Sign In", "Wishlist", "Order History", "Loyalty Programme"],
    Contact: [
      "Paris Boutique",
      "London Store",
      "Online Enquiries",
      "Press & Media",
    ],
  };

  return (
    <footer
      className="py-12 sm:py-16"
      style={{
        background: "oklch(0.18 0.008 210)",
        borderTop: "1px solid oklch(0.72 0.095 75 / 15%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <div
                className="w-2 h-2 rotate-45"
                style={{ background: "oklch(0.72 0.095 75)" }}
              />
              <div
                className="w-1 h-1 rotate-45"
                style={{ background: "oklch(0.72 0.095 75 / 50%)" }}
              />
              <div
                className="w-2 h-2 rotate-45"
                style={{ background: "oklch(0.72 0.095 75)" }}
              />
            </div>
            <p
              className="font-display text-base mb-0.5"
              style={{
                color: "oklch(0.92 0.010 85)",
                letterSpacing: "0.25em",
                fontSize: "0.85rem",
              }}
            >
              LUXE PARFUM
            </p>
            <p
              className="font-body text-xs mb-6"
              style={{
                color: "oklch(0.72 0.095 75)",
                letterSpacing: "0.35em",
                fontSize: "0.5rem",
              }}
            >
              MAISON DE PARFUMERIE
            </p>
            <p
              className="font-serif text-sm leading-relaxed"
              style={{ color: "oklch(0.45 0.008 85)", lineHeight: 1.8 }}
            >
              Crafting timeless fragrances
              <br />
              since 1892 in Grasse, Provence.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4
                className="font-display text-xs mb-4 sm:mb-6"
                style={{
                  color: "oklch(0.72 0.095 75)",
                  letterSpacing: "0.2em",
                  fontSize: "0.65rem",
                }}
              >
                {title.toUpperCase()}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="/"
                      className="font-body text-xs transition-colors"
                      style={{
                        color: "oklch(0.45 0.008 85)",
                        letterSpacing: "0.05em",
                        fontSize: "0.8rem",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color =
                          "oklch(0.72 0.095 75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color =
                          "oklch(0.45 0.008 85)";
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={{ borderTop: "1px solid oklch(0.72 0.095 75 / 15%)" }} />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-8">
          <p
            className="font-body text-xs"
            style={{
              color: "oklch(0.35 0.005 85)",
              letterSpacing: "0.08em",
              fontSize: "0.72rem",
            }}
          >
            © {new Date().getFullYear()} Luxe Parfum. All rights reserved.
          </p>
          <p
            className="font-body text-xs"
            style={{
              color: "oklch(0.35 0.005 85)",
              letterSpacing: "0.05em",
              fontSize: "0.72rem",
            }}
          >
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.55 0.008 85)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.095 75)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.55 0.008 85)";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Public Site ────────────────────────────────────────────────────────────

function PerfumeSite() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.22 0.008 210)" }}
    >
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <BrandStorySection />
        <FragranceNotesSection />
        <TestimonialsSection />
        <ContactSection />
        <NewsletterSection />
        <FeatureStrip />
      </main>
      <Footer />
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return <AdminPanel />;
  if (path.startsWith("/login")) return <UserLoginPage />;
  if (path.startsWith("/product/")) {
    return (
      <CartProvider>
        <ProductDetailPage />
        <CartDrawer />
        <Toaster />
      </CartProvider>
    );
  }
  if (path.startsWith("/search")) {
    return (
      <CartProvider>
        <SearchPage />
        <CartDrawer />
        <Toaster />
      </CartProvider>
    );
  }
  return (
    <CartProvider>
      <PerfumeSite />
      <CartDrawer />
      <Toaster />
    </CartProvider>
  );
}
