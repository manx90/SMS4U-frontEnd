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
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240,
			algorithm: "gzip",
			ext: ".gz",
		}),
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240,
			algorithm: "brotliCompress",
			ext: ".br",
		}),
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
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		chunkSizeWarningLimit: 1000,
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (
							id.includes("react/") ||
							id.includes("react-dom/") ||
							id.includes("scheduler/")
						) {
							return "vendor-react";
						}
						if (id.includes("react-router-dom/")) {
							return "vendor-router";
						}
						if (
							id.includes("framer-motion/") ||
							id.includes("@tsparticles/") ||
							id.includes("tsparticles/")
						) {
							return "vendor-animation";
						}
						if (
							id.includes("recharts/") ||
							id.includes("d3-")
						) {
							return "vendor-charts";
						}
						if (id.includes("@radix-ui/")) {
							return "vendor-ui";
						}
					}
				},
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".").at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = "img";
					} else if (/woff|woff2|ttf|eot/i.test(extType)) {
						extType = "fonts";
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
			},
		},
	},
	server: {
		port: 3334,
		strictPort: false,
		historyApiFallback: true,
		host: "0.0.0.0",
		allowedHosts: ['ski-1465.store', 'localhost', '127.0.0.1', 'api.sms4u.pro']
	},
	preview: {
		port: 3334,
		strictPort: false,
		historyApiFallback: true,
		host: "0.0.0.0",
		allowedHosts: ['ski-1465.store', 'localhost', '127.0.0.1', 'api.sms4u.pro']
	},
});
