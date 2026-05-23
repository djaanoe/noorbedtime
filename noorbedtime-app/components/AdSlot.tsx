"use client";
import { useEffect } from "react";

interface Props {
  id: string;
  className?: string;
  format?: "rectangle" | "banner" | "in-article";
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ id, className = "", format = "rectangle" }: Props) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [clientId]);

  if (!clientId) {
    return (
      <div
        id={id}
        className={`border border-dashed border-gray-700/50 rounded-lg flex items-center justify-center text-gray-600 text-xs ${
          format === "banner" ? "h-16 w-full" : "h-[250px] w-full"
        } ${className}`}
      >
        Ad Slot [{id}]
      </div>
    );
  }

  return (
    <div id={id} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={id}
        data-ad-format={format === "in-article" ? "fluid" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
