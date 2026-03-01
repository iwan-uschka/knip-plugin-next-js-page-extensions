import withBundleAnalyzerPlugin from "@next/bundle-analyzer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withBundleAnalyzer = withBundleAnalyzerPlugin({
  enabled: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  pageExtensions: ["page.ts", "page.tsx", "api.ts"],
  compress: false,
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: [
    "@opentelemetry/api",
    "@opentelemetry/exporter-prometheus",
    "@opentelemetry/host-metrics",
    "@opentelemetry/instrumentation-http",
    "@opentelemetry/instrumentation-runtime-node",
    "@opentelemetry/instrumentation",
    "@opentelemetry/resources",
    "@opentelemetry/sdk-metrics",
    "@opentelemetry/sdk-trace-node",
    "@opentelemetry/semantic-conventions",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
});

export default nextConfig;
