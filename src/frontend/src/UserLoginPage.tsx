import { ChevronLeft, Loader2, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function UserLoginPage() {
  const {
    login,
    clear,
    loginStatus,
    identity,
    isLoggingIn,
    isInitializing,
    isLoginError,
  } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";

  // Force-enable the button if login attempt is stuck for > 30 seconds
  const [forceEnabled, setForceEnabled] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoggingIn) {
      setForceEnabled(false);
      setTimedOut(false);
      timeoutRef.current = setTimeout(() => {
        setForceEnabled(true);
        setTimedOut(true);
      }, 30000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setForceEnabled(false);
      setTimedOut(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoggingIn]);

  const isButtonDisabled = (isLoggingIn || isInitializing) && !forceEnabled;

  const handleLogin = () => {
    setForceEnabled(false);
    setTimedOut(false);
    login();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.008 210) 0%, oklch(0.22 0.010 210) 60%, oklch(0.20 0.018 50) 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.20 0.008 210 / 90%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.72 0.095 75 / 18%)",
        }}
      >
        <a
          href="/"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "oklch(0.65 0.010 85)", letterSpacing: "0.1em" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color =
              "oklch(0.72 0.095 75)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color =
              "oklch(0.65 0.010 85)";
          }}
          data-ocid="login.link"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Site
        </a>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-0.5">
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{ background: "oklch(0.72 0.095 75)" }}
            />
            <div
              className="w-1 h-1 rotate-45"
              style={{ background: "oklch(0.72 0.095 75 / 50%)" }}
            />
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{ background: "oklch(0.72 0.095 75)" }}
            />
          </div>
          <span
            className="font-display text-sm"
            style={{ color: "oklch(0.95 0.010 85)", letterSpacing: "0.3em" }}
          >
            LUXE PARFUM
          </span>
        </div>

        <div className="w-24" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Decorative line */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.095 75 / 30%)" }}
            />
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rotate-45"
                  style={{
                    width: i === 1 ? "8px" : "5px",
                    height: i === 1 ? "8px" : "5px",
                    background:
                      i === 1
                        ? "oklch(0.72 0.095 75)"
                        : "oklch(0.72 0.095 75 / 40%)",
                  }}
                />
              ))}
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.095 75 / 30%)" }}
            />
          </div>

          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{
              background: "oklch(0.25 0.010 210 / 90%)",
              border: "1px solid oklch(0.72 0.095 75 / 20%)",
              boxShadow: "0 32px 80px oklch(0.10 0.008 210 / 60%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {!isLoggedIn ? (
              /* Login form */
              <div className="text-center" data-ocid="login.panel">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: "oklch(0.72 0.095 75 / 15%)",
                    border: "1px solid oklch(0.72 0.095 75 / 35%)",
                  }}
                >
                  <User
                    className="w-7 h-7"
                    style={{ color: "oklch(0.72 0.095 75)" }}
                  />
                </div>

                <h1
                  className="font-display text-2xl sm:text-3xl mb-3"
                  style={{
                    color: "oklch(0.95 0.010 85)",
                    letterSpacing: "0.1em",
                  }}
                >
                  MY ACCOUNT
                </h1>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "oklch(0.65 0.010 85)" }}
                >
                  Sign in to access your Luxe Parfum account, track orders, and
                  manage your fragrance collection.
                </p>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isButtonDisabled}
                  className="w-full py-3.5 px-6 rounded-lg flex items-center justify-center gap-3 text-sm font-medium transition-all"
                  style={{
                    background: isButtonDisabled
                      ? "oklch(0.60 0.070 75)"
                      : "oklch(0.72 0.095 75)",
                    color: "oklch(0.18 0.008 210)",
                    letterSpacing: "0.1em",
                    border: "none",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                    opacity: isButtonDisabled ? 0.7 : 1,
                    pointerEvents: isButtonDisabled ? "none" : "auto",
                  }}
                  data-ocid="login.primary_button"
                >
                  {isInitializing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isLoggingIn && !forceEnabled ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                  {isInitializing
                    ? "Initializing..."
                    : isLoggingIn && !forceEnabled
                      ? "Signing in..."
                      : "SIGN IN WITH INTERNET IDENTITY"}
                </button>

                {/* Error states */}
                {isLoginError && (
                  <p
                    className="mt-3 text-xs"
                    style={{ color: "oklch(0.65 0.18 25)" }}
                    data-ocid="login.error_state"
                  >
                    Login failed. Please try again.
                  </p>
                )}
                {timedOut && (
                  <p
                    className="mt-3 text-xs"
                    style={{ color: "oklch(0.72 0.095 75)" }}
                    data-ocid="login.error_state"
                  >
                    Login is taking longer than expected. You may try again.
                  </p>
                )}

                <p
                  className="mt-6 text-xs"
                  style={{ color: "oklch(0.50 0.008 85)" }}
                >
                  Secured by Internet Identity — no passwords required
                </p>
              </div>
            ) : (
              /* Logged in state */
              <div data-ocid="login.panel">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "oklch(0.72 0.095 75 / 15%)",
                      border: "1px solid oklch(0.72 0.095 75 / 35%)",
                    }}
                  >
                    <User
                      className="w-6 h-6"
                      style={{ color: "oklch(0.72 0.095 75)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{
                        color: "oklch(0.65 0.010 85)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      WELCOME BACK
                    </p>
                    <h2
                      className="font-display text-lg"
                      style={{
                        color: "oklch(0.95 0.010 85)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      MY ACCOUNT
                    </h2>
                  </div>
                </div>

                {/* Account info */}
                <div
                  className="rounded-lg p-4 mb-6"
                  style={{
                    background: "oklch(0.22 0.008 210)",
                    border: "1px solid oklch(0.72 0.095 75 / 15%)",
                  }}
                >
                  <p
                    className="text-xs mb-2"
                    style={{
                      color: "oklch(0.65 0.010 85)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    PRINCIPAL ID
                  </p>
                  <p
                    className="font-mono text-sm break-all"
                    style={{ color: "oklch(0.85 0.010 85)" }}
                  >
                    {principal.slice(0, 10)}...{principal.slice(-6)}
                  </p>
                </div>

                {/* Account sections */}
                <div className="space-y-3 mb-8">
                  {[
                    {
                      icon: "📦",
                      label: "Order History",
                      desc: "View your past orders",
                    },
                    {
                      icon: "💛",
                      label: "Wishlist",
                      desc: "Your saved fragrances",
                    },
                    {
                      icon: "⚙️",
                      label: "Preferences",
                      desc: "Manage your account settings",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 p-3.5 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: "oklch(0.22 0.008 210)",
                        border: "1px solid oklch(0.72 0.095 75 / 10%)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "oklch(0.72 0.095 75 / 30%)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "oklch(0.72 0.095 75 / 10%)";
                      }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: "oklch(0.90 0.010 85)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.55 0.008 85)" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={clear}
                  className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-sm transition-all"
                  style={{
                    background: "transparent",
                    border: "1px solid oklch(0.72 0.095 75 / 30%)",
                    color: "oklch(0.72 0.095 75)",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.72 0.095 75 / 10%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                  data-ocid="login.secondary_button"
                >
                  <LogOut className="w-4 h-4" />
                  SIGN OUT
                </button>
              </div>
            )}
          </div>

          {/* Decorative footer */}
          <p
            className="text-center mt-8 text-xs"
            style={{ color: "oklch(0.40 0.005 85)", letterSpacing: "0.05em" }}
          >
            © {new Date().getFullYear()} Luxe Parfum. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.55 0.008 85)" }}
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
