// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"**.twimg.com",
        port:"",
        // pathname:"/sticky/**"

      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
        port:"",
        // pathname:"/sticky/**"

      },{
        protocol:"https",
        hostname:"lh3.googleusercontent.com",

        port:"",

      }
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
