import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
  output: "standalone", // permet de servir l'app sans dépendre de node_modules complet
};

export default nextConfig;
