/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        // Añade el loader para manejar archivos SVG
        config.module.rules.push({
            test: /\.svg$/i,
            use: [{ loader: '@svgr/webpack', options: { icon: true } }],
        });

        return config;
    },
};

export default nextConfig;
