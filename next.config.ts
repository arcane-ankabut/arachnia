import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 — сборка для GitHub Pages (превью): статический экспорт
 * с basePath репозитория; API-роут формы в этом режиме исключается скриптом
 * деплоя. Обычная сборка (Vercel/node) идёт без этих опций.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export" as const,
    basePath: "/arachnia",
    trailingSlash: true,
  }),
};

export default nextConfig;
