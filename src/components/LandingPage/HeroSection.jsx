/* eslint-disable no-unused-vars */
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FaFacebookSquare } from "react-icons/fa";
// import { FaFacebookSquare } from "react-icons/fa";

import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { RiDiscordLine } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { FaUber } from "react-icons/fa";
import { WavyBackground } from "../ui/wavy-background";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { LayoutTextFlip } from "../ui/layout-text-flip";
import { Highlight } from "../ui/hero-highlight";
import { Meteors } from "../ui/meteors";
import {
	typewriterWords,
	serviceNamesData,
} from "./data";
import { useNavigate } from "react-router-dom";
// Icon mapping
const iconMap = {
	FaFacebookSquare,
	IoLogoWhatsapp,
	FaTelegramPlane,
	FaInstagram,
	FaGoogle,
	FaLinkedin,
	RiDiscordLine,
	FaTwitter,
	FaSnapchat,
	FaSpotify,
	FaUber,
};

const HeroSection = memo(({ isDarkMode }) => {
	const navigate = useNavigate();
	// Convert data to JSX elements
	const serviceNames = useMemo(
		() =>
			serviceNamesData.map((service) => {
				const IconComponent =
					iconMap[service.icon];
				return {
					icon:
						service.name === "Uber" ? (
							<IconComponent className="text-black dark:text-white" />
						) : (
							<IconComponent
								style={{ color: service.color }}
							/>
						),
					text: service.name,
				};
			}),
		[],
	);

	return (
		<section
			id="home"
			className="relative h-full pb-20 lg:pb-0 overflow-hidden"
		>
			{/* Wavy Background */}
			<div className="absolute inset-0 z-0">
				<WavyBackground
					containerClassName="h-full"
					colors={[
						"#6EE7B7",
						"#3B82F6",
						"#8B5CF6",
						"#6EE7B7",
					]}
					waveWidth={50}
					backgroundFill={
						isDarkMode ? "#0b0b0b" : "#f9fafb"
					}
					blur={10}
					speed="fast"
					waveOpacity={0.15}
				/>
			</div>

			{/* Meteors */}
			<div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
				<Meteors
					number={20}
					className="bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]"
				/>
			</div>

			{/* Content */}
			<div className="relative z-30 flex flex-col items-center justify-center h-full px-4 sm:px-6 pt-20 md:pt-24">
				<div className="max-w-6xl mx-auto w-full">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-8 md:mb-12"
					>
						{/* Headline with Typewriter */}
						<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
							<TypewriterEffectSmooth
								words={typewriterWords}
								className="mb-0"
								cursorClassName="bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]"
							/>
							<LayoutTextFlip
								text=""
								className="mb-0"
								words={serviceNames}
								duration={2000}
							/>
						</div>

						{/* Subheading */}
						<p className="text-sm font-playfair italic md:text-xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
							<Highlight className="text-gray-900 dark:text-white">
								Choose a service, get a number,
								receive the code
							</Highlight>{" "}
							— all in seconds.
						</p>

						{/* CTAs */}
						<div className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
							<button
								onClick={() => navigate("/login")}
								className="w-full cursor-pointer sm:w-auto p-2 md:px-4 bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-white rounded-full font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								Get a Number Now
							</button>
							<a
								href="#how-it-works"
								className="w-full sm:w-auto p-2 md:px-4 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold text-sm sm:text-lg hover:border-[#6EE7B7] dark:hover:border-[#3B82F6] transition-all"
							>
								See How It Works
							</a>
						</div>

						{/* Mock SMS UI */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.3,
								duration: 0.8,
							}}
							className="max-w-[280px] sm:max-w-xs md:max-w-sm mx-auto"
						>
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] rounded-full flex items-center justify-center">
										<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
									</div>
									<div>
										<div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
											+1 (555) 123-4567
										</div>
										<div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
											Active for 19:45
										</div>
									</div>
								</div>
								<div className="border-t border-gray-200 dark:border-gray-800 pt-3 sm:pt-4">
									<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
										📩 Your verification code is:
									</div>
									<div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] tracking-wider">
										284756
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
