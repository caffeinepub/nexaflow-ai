import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "oklch(0.05 0.005 210 / 70%)" }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full z-[70] flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "oklch(0.20 0.008 210)",
              borderLeft: "1px solid oklch(0.72 0.095 75 / 20%)",
            }}
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid oklch(0.72 0.095 75 / 15%)" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="w-4 h-4"
                  style={{ color: "oklch(0.72 0.095 75)" }}
                />
                <h2
                  className="font-display text-sm"
                  style={{
                    color: "oklch(0.92 0.010 85)",
                    letterSpacing: "0.2em",
                  }}
                >
                  YOUR CART
                </h2>
                {items.length > 0 && (
                  <span
                    className="font-body text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.72 0.095 75 / 20%)",
                      color: "oklch(0.72 0.095 75)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="transition-colors"
                style={{ color: "oklch(0.55 0.008 85)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.72 0.095 75)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.55 0.008 85)";
                }}
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-4"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag
                    className="w-12 h-12"
                    style={{ color: "oklch(0.35 0.008 85)" }}
                  />
                  <p
                    className="font-serif text-center"
                    style={{ color: "oklch(0.50 0.008 85)", fontSize: "1rem" }}
                  >
                    Your cart is empty.
                  </p>
                  <p
                    className="font-body text-xs text-center"
                    style={{
                      color: "oklch(0.38 0.005 85)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    EXPLORE OUR COLLECTIONS
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item, idx) => (
                    <li
                      key={item.productId}
                      className="flex gap-4"
                      style={{
                        paddingBottom: "1.25rem",
                        borderBottom:
                          idx < items.length - 1
                            ? "1px solid oklch(0.72 0.095 75 / 10%)"
                            : "none",
                      }}
                      data-ocid={`cart.item.${idx + 1}`}
                    >
                      {/* Image */}
                      <div
                        className="w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{
                          background: "oklch(0.25 0.010 210)",
                          border: "1px solid oklch(0.72 0.095 75 / 15%)",
                        }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag
                            className="w-7 h-7"
                            style={{ color: "oklch(0.35 0.008 85)" }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display text-xs mb-1 truncate"
                          style={{
                            color: "oklch(0.88 0.010 85)",
                            letterSpacing: "0.1em",
                            fontSize: "0.7rem",
                          }}
                        >
                          {item.name.toUpperCase()}
                        </p>
                        <p
                          className="font-serif text-sm mb-3"
                          style={{ color: "oklch(0.72 0.095 75)" }}
                        >
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="w-6 h-6 flex items-center justify-center transition-colors"
                            style={{
                              border: "1px solid oklch(0.72 0.095 75 / 30%)",
                              color: "oklch(0.65 0.010 85)",
                            }}
                            data-ocid={`cart.toggle.${idx + 1}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            className="font-body text-xs w-4 text-center"
                            style={{ color: "oklch(0.88 0.010 85)" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="w-6 h-6 flex items-center justify-center transition-colors"
                            style={{
                              border: "1px solid oklch(0.72 0.095 75 / 30%)",
                              color: "oklch(0.65 0.010 85)",
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                            className="ml-auto font-body text-xs transition-colors"
                            style={{
                              color: "oklch(0.45 0.008 85)",
                              letterSpacing: "0.08em",
                              fontSize: "0.6rem",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "oklch(0.65 0.100 25)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "oklch(0.45 0.008 85)";
                            }}
                            data-ocid={`cart.delete_button.${idx + 1}`}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-5"
                style={{ borderTop: "1px solid oklch(0.72 0.095 75 / 15%)" }}
              >
                <div className="flex justify-between items-baseline mb-5">
                  <span
                    className="font-body text-xs"
                    style={{
                      color: "oklch(0.55 0.008 85)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    SUBTOTAL
                  </span>
                  <span
                    className="font-serif text-xl"
                    style={{ color: "oklch(0.72 0.095 75)" }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full py-4 font-display text-xs transition-all"
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
                  onClick={() => toast.info("Checkout coming soon!")}
                  data-ocid="cart.primary_button"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
