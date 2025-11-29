import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			"@": path.resolve(__dirname, "./src"),
		},
		dedupe: ["react", "react-dom"],
	},
	plugins: [
		react({
			babel: {
				plugins: [
					["babel-plugin-react-compiler"],
				],
			},
		}),
		tailwindcss(),
		// Gzip compression for smaller file sizes
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240, // Only compress files > 10KB
			algorithm: "gzip",
			ext: ".gz",
		}),
		// Brotli compression (better than gzip)
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240,
			algorithm: "brotliCompress",
			ext: ".br",
		}),
		// Bundle analyzer (comment out in production)
		visualizer({
			open: false,
			gzipSize: true,
			brotliSize: true,
			filename: "dist/stats.html",
		}),
	],
	optimizeDeps: {
		include: ["next-themes"],
	},
	build: {
		// Enable minification and tree-shaking
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.log in production
				drop_debugger: true,
			},
		},
		// Optimize chunk sizes
		chunkSizeWarningLimit: 1000,
		// Enable source maps for debugging (can disable in production)
		sourcemap: false,
		rollupOptions: {
			output: {
				// Smart chunking strategy that doesn't break lucide-react
				manualChunks(id) {
					if (id.includes("node_modules")) {
						// React core - keep together
						if (
							id.includes("react/") ||
							id.includes("react-dom/") ||
							id.includes("scheduler/")
						) {
							return "vendor-react";
						}
						// React Router
						if (
							id.includes("react-router-dom/")
						) {
							return "vendor-router";
						}
						// Heavy animation libraries
						if (
							id.includes("framer-motion/") ||
							id.includes("@tsparticles/") ||
							id.includes("tsparticles/")
						) {
							return "vendor-animation";
						}
						// Charts
						if (
							id.includes("recharts/") ||
							id.includes("d3-")
						) {
							return "vendor-charts";
						}
						// Radix UI components
						if (id.includes("@radix-ui/")) {
							return "vendor-ui";
						}
						// DO NOT manually chunk lucide-react!
						// Let Vite tree-shake it automatically
						// This prevents breaking its barrel exports
					}
				},
				// Optimize asset file naming
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name
						.split(".")
						.at(1);
					if (
						/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(
							extType,
						)
					) {
						extType = "img";
					} else if (
						/woff|woff2|ttf|eot/i.test(extType)
					) {
						extType = "fonts";
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames:
					"assets/js/[name]-[hash].js",
				entryFileNames:
					"assets/js/[name]-[hash].js",
			},
		},
	},
	server: {
		port: 3333,
		strictPort: false,
		// open: true,
		historyApiFallback: true,
		host: "0.0.0.0",
	},
	preview: {
		port: 3333,
		strictPort: false,
		// open: true,
		historyApiFallback: true,
		host: "0.0.0.0",
	},
});
