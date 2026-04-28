import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Do not webpack-bundle Supabase (pulls `ws` + optional native deps)
    serverComponentsExternalPackages: [
      "@supabase/supabase-js",
      "@supabase/realtime-js",
      "@supabase/postgrest-js",
      "@supabase/storage-js",
      "@supabase/functions-js",
      "@supabase/auth-js",
      "ws",
    ],
  },

  webpack(config, { isServer, dev }) {
    if (!isServer) return config;

    const outPath = (config.output?.path ?? "").replace(/\\/g, "/");

    // ── Dev mode: just disable splitChunks for all server compilers ──────────
    // This is the safest approach for dev: no chunks are created, so there is
    // nothing to mis-resolve. The bundle will be slightly larger but that is
    // acceptable for a local dev server.
    if (dev) {
      config.optimization = config.optimization ?? {};
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;
      return config;
    }

    // ── Production mode ───────────────────────────────────────────────────────
    // webpack-runtime.js lives at .next/server/webpack-runtime.js and contains
    //   require("./" + chunkId + ".js")
    // By default chunks land in .next/server/chunks/{id}.js, so the require
    // fails. Fix: emit chunks to .next/server/ (same dir as the runtime).
    //
    // outPath ends with "/server"  → chunkFilename = "[name].js"  (no subdir)
    // outPath ends with "/chunks"  → chunkFilename = "../[name].js" (go up one)
    if (outPath.endsWith("/server")) {
      config.output.chunkFilename = "[name].js";
    } else if (outPath.endsWith("/chunks")) {
      config.output.chunkFilename = "../[name].js";
    } else if (config.output?.libraryTarget === "commonjs2") {
      // Fallback: any other server-side Node.js compiler
      config.output.chunkFilename = "[name].js";
    }

    return config;
  },
};

export default nextConfig;
