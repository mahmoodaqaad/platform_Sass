import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["ui-avatars.com", "images.unsplash.com", "res.cloudinary.com"],
  },
};

export default withNextIntl(nextConfig);
