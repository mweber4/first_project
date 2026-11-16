import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Hebrew is the default language of the site.
    return [{ source: "/", destination: "/he", permanent: false }];
  },
};

export default nextConfig;
