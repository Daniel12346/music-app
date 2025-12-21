import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        //images are stored in supabase storage buckets
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL!.replace("https://", ""),
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
