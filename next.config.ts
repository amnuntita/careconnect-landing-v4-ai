import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a Cloudflare quick tunnel load the dev server for mobile preview.
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
