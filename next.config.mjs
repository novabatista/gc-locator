const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: 'bottom-left',
  },
  webpack(config) {
    // Scope @svgr/webpack to SVGs imported as components (not the ones Next handles
    // as static assets — those still go through the default file-loader rule).
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test instanceof RegExp && rule.test.test('.svg'),
    )

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/]},
          use: ['@svgr/webpack'],
        },
      )
      fileLoaderRule.exclude = /\.svg$/i
    } else {
      config.module.rules.push({test: /\.svg$/, use: ['@svgr/webpack']})
    }

    return config
  },
  images: {
    remotePatterns: [
      new URL('https://picsum.photos/id/**'),
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/staticmap/**',
      },
      ...(SUPABASE_HOST ? [{
        protocol: 'https',
        hostname: SUPABASE_HOST,
        pathname: '/storage/v1/object/public/**',
      }] : []),
    ],
  },
};

export default nextConfig;
