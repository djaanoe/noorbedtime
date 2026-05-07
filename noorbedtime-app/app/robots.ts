import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/auth"],
    },
    sitemap: "https://noorbedtime.com/sitemap.xml",
  };
}
