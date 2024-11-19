import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "reelrecon",
        short_name: "rere",
        description: "A PWA built to aide identification and awareness of fish capturing",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/next.snv",
                sizes: "192x192",
                type: "image/svg+xml",
            },
            {
                src: "/next.svg",
                sizes: "512x512",
                type: "image/svg+xml",
            },
        ],
    };
}
