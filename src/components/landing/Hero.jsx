// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Phone, Globe, Zap } from "lucide-react";

const Hero = ({ onGetNumber }) => {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
			{/* Animated Background Elements */}
			<div className="absolute inset-0">
				<motion.div
					className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
					animate={{
						y: [0, -20, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"
					animate={{
						y: [0, 20, 0],
						scale: [1, 0.9, 1],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
				<motion.div
					className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20"
					animate={{
						y: [0, -15, 0],
						x: [0, 10, 0],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{/* Main Headline */}
					<motion.h1
						className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.2,
						}}
					>
						Get Temporary Phone Numbers{" "}
						<span className="block">
							Instantly
						</span>
					</motion.h1>

					{/* Subheadline */}
					<motion.p
						className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.4,
						}}
					>
						Choose your country, select your
						service, get a number in seconds.
						Receive SMS messages for Facebook,
						WhatsApp, and 100+ other platforms.
					</motion.p>

					{/* CTA Button */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.6,
						}}
					>
						<Button
							onClick={onGetNumber}
							size="lg"
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
						>
							<Phone className="w-5 h-5 mr-2" />
							Get a Number Now
							<Zap className="w-5 h-5 ml-2" />
						</Button>
					</motion.div>

					{/* Trust Indicators */}
					<motion.div
						className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.8,
							delay: 0.8,
						}}
					>
						<div className="flex items-center gap-2">
							<Globe className="w-4 h-4" />
							<span>190+ Countries</span>
						</div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4" />
							<span>Instant Activation</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone className="w-4 h-4" />
							<span>10,000+ Users</span>
						</div>
					</motion.div>
				</motion.div>
			</div>

			{/* Floating Phone Visual */}
			<motion.div
				className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block"
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
			>
				<div className="relative">
					<motion.div
						className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl shadow-2xl flex items-center justify-center"
						animate={{
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<Phone className="w-16 h-16 text-white" />
					</motion.div>
					<motion.div
						className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
						animate={{
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<div className="w-2 h-2 bg-white rounded-full" />
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
};

export default Hero;
