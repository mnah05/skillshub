// Read version at build time via Next.js env
// Set in next.config.ts as env.NEXT_PUBLIC_APP_VERSION
export const APP_VERSION: string = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";
