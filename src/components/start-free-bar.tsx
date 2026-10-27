"use client";

import { useEffect, useState } from "react";
import { useAISearchContext } from "@/components/ai/search";
import { cn } from "@/lib/cn";

const SIGN_UP_URL = "https://app.xo.builders/sign-up?ref=docs.quirq.ai";
/** Hide the bar near the page end so the docs footer / social links stay reachable. */
const HIDE_NEAR_BOTTOM_PX = 160;
/** Matches bar content + vertical padding; reserved so content can scroll clear of the bar. */
const BAR_HEIGHT_PX = 60;

/**
 * Fixed bottom bar: Ask AI + Start Free. Client-only (scroll / AI context).
 * Always available after mount; hides near the document bottom so the site
 * footer and social links are not covered. Reserves bottom padding while shown.
 */
export function StartFreeBar() {
  const [awayFromFooter, setAwayFromFooter] = useState(true);
  const { open, setOpen } = useAISearchContext();

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const nearBottom =
        window.scrollY + window.innerHeight >=
        doc.scrollHeight - HIDE_NEAR_BOTTOM_PX;
      // The previous/next page links at the end of a docs page sit above the
      // near-bottom zone, so the bar would cover them; slide it away as soon
      // as they come into view.
      const pageNav = document.querySelector(
        '#nd-page [class^="@container grid"]',
      );
      const pageNavVisible =
        pageNav !== null &&
        pageNav.getBoundingClientRect().top <
          window.innerHeight - BAR_HEIGHT_PX;
      setAwayFromFooter(!nearBottom && !pageNavVisible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Slide away near the footer; hide entirely when the AI panel is open.
  // Padding stays reserved whenever the AI panel is closed so show/hide near
  // the footer does not change scrollHeight (avoids flicker).
  const showBar = awayFromFooter && !open;
  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.style.setProperty("--docs-bottom-bar-height", `${BAR_HEIGHT_PX}px`);
      root.style.paddingBottom = `${BAR_HEIGHT_PX}px`;
    } else {
      root.style.removeProperty("--docs-bottom-bar-height");
      root.style.paddingBottom = "";
    }
    return () => {
      root.style.removeProperty("--docs-bottom-bar-height");
      root.style.paddingBottom = "";
    };
  }, [open]);

  return (
    <section
      className={cn(
        // Canopy: a capsule that sprouts up from the bottom edge and settles.
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-2.5 origin-bottom transition-[translate,scale,opacity] duration-500 ease-grow",
        showBar
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-full scale-y-50 opacity-0",
      )}
      aria-label="Quick actions"
      aria-hidden={!showBar}
    >
      <div
        className={cn(
          "ms-auto flex w-fit items-center gap-1.5 rounded-full bg-pine p-1.5 shadow-[0_-10px_30px_-6px_rgba(5,31,32,0.45)] motion-safe:animate-[canopy-sprout_520ms_var(--ease-grow)]",
          showBar && "pointer-events-auto",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-mist ring-2 ring-inset ring-spruce transition-colors hover:bg-fir active:translate-y-px"
          tabIndex={showBar ? 0 : -1}
        >
          <span className="icon-[ph--chat-circle] size-4" aria-hidden="true" />
          Ask AI
        </button>
        <a
          href={SIGN_UP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-mist px-4 py-1.5 text-sm font-semibold text-understorey transition-colors hover:bg-[#c3e0cb] active:translate-y-px"
          tabIndex={showBar ? 0 : -1}
        >
          Start Free
        </a>
      </div>
    </section>
  );
}
