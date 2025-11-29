import { memo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import WorldMap from "../ui/world-map";
import { GlowingEffect } from "../ui/glowing-effect";
import { mapDots } from "./data";

const WorldMapSection = memo(() => {
	return (
		<section
			id="worldwide"
			className="relative py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-black/50"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-10 sm:mb-12 md:mb-16"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
						Available Worldwide{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							🌐
						</span>
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
						Get numbers from over 150 countries
					</p>
				</motion.div>

				<div className="relative ">
					<div className="relative p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
						<GlowingEffect
							blur={20}
							spread={40}
							disabled={false}
							borderWidth={2}
						/>
						<WorldMap
							dots={mapDots}
							lineColor="#3B82F6"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 md:mt-16">
					<div className="text-center">
						<div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
							100+
						</div>
						<div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							Countries Covered
						</div>
					</div>
					<div className="text-center">
						<div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
							10K+
						</div>
						<div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							Numbers Available
						</div>
					</div>
					<div className="text-center">
						<div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
							100K+
						</div>
						<div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							Users Served
						</div>
					</div>
				</div>
			</div>
		</section>
	);
});

WorldMapSection.displayName = "WorldMapSection";

export default WorldMapSection;
