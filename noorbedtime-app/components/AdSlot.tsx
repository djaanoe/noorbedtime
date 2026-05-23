"use client";
import { useEffect } from "react";

interface Props {
  id: string;       // HTML element id (for targeting / layout)
  slotId?: string;  // AdSense numeric unit ID — get from AdSense dashboard → Ad units
  className?: string;
  format?: "rectangle" | "banner" | "in-article";
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const CLIENT_ID = "ca-pub-4772774051728006";

export default function AdSlot({ id, slotId, className = "", format = "rectangle" }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  // Dev: show placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        id={id}
        className={`border border-dashed border-gray-700/50 rounded-lg flex items-center justify-center text-gray-600 text-xs ${
          format === "banner" ? "h-16 w-full" : "h-[250px] w-full"
        } ${className}`}
      >
        Ad Slot [{id}]{slotId ? ` · unit ${slotId}` : " · no unit ID yet"}
      </div>
    );
  }

  return (
    <div id={id} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        {...(slotId ? { "data-ad-slot": slotId } : {})}
        data-ad-format={format === "in-article" ? "fluid" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
