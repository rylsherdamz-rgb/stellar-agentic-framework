import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://stellar-agentic-framework.vercel.app/sitemap.xml",
  };
}
