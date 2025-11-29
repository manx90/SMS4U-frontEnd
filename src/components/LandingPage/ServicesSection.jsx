/* eslint-disable no-unused-vars */
import { memo } from "react";
import { motion } from "framer-motion";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { RiDiscordLine } from "react-icons/ri";
import { FaSnapchat } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { FaUber } from "react-icons/fa";

const services = [
	{
		name: "Facebook",
		icon: FaFacebookSquare,
		color: "#1877F2",
	},
	{
		name: "WhatsApp",
		icon: IoLogoWhatsapp,
		color: "#25D366",
	},
	{
		name: "Telegram",
		icon: FaTelegramPlane,
		color: "#0088cc",
	},
	{
		name: "Instagram",
		icon: FaInstagram,
		color: "#E4405F",
	},
	{
		name: "Twitter",
		icon: FaTwitter,
		color: "#1DA1F2",
	},
	{
		name: "Google",
		icon: FaGoogle,
		color: "#EA4335",
	},
	{
		name: "LinkedIn",
		icon: FaLinkedin,
		color: "#0A66C2",
	},
	{
		name: "Discord",
		icon: RiDiscordLine,
		color: "#5865F2",
	},
	{
		name: "Snapchat",
		icon: FaSnapchat,
		color: "#FFFC00",
	},
	{
		name: "Spotify",
		icon: FaSpotify,
		color: "#1DB954",
	},
	{ name: "Uber", icon: FaUber, color: null },
];

const ServicesSection = memo(() => {
	return (
		<section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#0b0b0b] dark:to-black/50 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-8 sm:mb-10 md:mb-12"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
						Supported{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							Services
						</span>
					</h2>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
						Works with all major platforms and
						apps
					</p>
				</motion.div>

				{/* Moving cards container */}
				<div className="relative space-y-3 sm:space-y-4">
					{/* First row - moving left to right */}
					<div className="flex gap-3 sm:gap-4 overflow-hidden">
						<motion.div
							className="flex gap-3 sm:gap-4 flex-shrink-0"
							animate={{
								x: [0, -1000],
							}}
							transition={{
								x: {
									repeat: Infinity,
									repeatType: "loop",
									duration: 25,
									ease: "linear",
								},
							}}
						>
							{[...services, ...services].map(
								(service, index) => {
									const Icon = service.icon;
									return (
										<div
											key={`left-${index}`}
											className="flex-shrink-0 w-32 sm:w-36 md:w-40 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#6EE7B7] dark:hover:border-[#3B82F6] transition-all shadow-sm hover:shadow-lg cursor-pointer"
										>
											{service.name === "Uber" ? (
												<Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-black dark:text-white" />
											) : (
												<Icon
													className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3"
													style={{
														color: service.color,
													}}
												/>
											)}
											<p className="text-center text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
												{service.name}
											</p>
										</div>
									);
								},
							)}
						</motion.div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="text-center mt-6 sm:mt-8 px-4"
				>
					<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
						+3000 more services including Google,
						Twitter, Discord, LinkedIn, and many
						others
					</p>
				</motion.div>
			</div>
		</section>
	);
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
