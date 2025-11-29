/* eslint-disable no-unused-vars */
import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const HowItWorksSection = memo(() => {
	return (
		<section
			id="how-it-works"
			className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black/50 dark:to-[#0b0b0b]"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-10 sm:mb-12 md:mb-16"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
						How It{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							Works
						</span>
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
						Get your verification code in 3 simple
						steps
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					{/* Step 1 */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#6EE7B7] to-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
							1
						</div>
						<div className="ml-14 sm:ml-16 pt-1 sm:pt-2">
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
								Choose Service
							</h3>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
								Select the platform you need to
								verify from our list of about
								3000+ supported services including
								Facebook, WhatsApp, Telegram, and
								more.
							</p>
						</div>
					</motion.div>

					{/* Step 2 */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="relative"
					>
						<div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
							2
						</div>
						<div className="ml-14 sm:ml-16 pt-1 sm:pt-2">
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
								Get Number
							</h3>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
								Instantly receive a temporary
								phone number from your chosen
								country. The number is active and
								ready to receive SMS.
							</p>
						</div>
					</motion.div>

					{/* Step 3 */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
						className="relative"
					>
						<div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8B5CF6] to-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
							3
						</div>
						<div className="ml-14 sm:ml-16 pt-1 sm:pt-2">
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
								Receive Code
							</h3>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
								Your verification code arrives in
								seconds . Copy it and complete
								your registration. Simple as that!
							</p>
						</div>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6 }}
					className="mt-10 sm:mt-12 md:mt-16 text-center px-4"
				>
					<div className="inline-flex items-center gap-2 sm:gap-3 px-4  py-2  bg-gradient-to-r from-[#6EE7B7]/10 to-[#3B82F6]/10 dark:from-[#6EE7B7]/20 dark:to-[#3B82F6]/20 rounded-full border border-[#6EE7B7]/30 dark:border-[#3B82F6]/30">
						<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#6EE7B7] flex-shrink-0" />
						<span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
							registration required{" "}
							<span className="hidden sm:inline">
								•
							</span>{" "}
							<span className="block sm:inline">
								Pay only when you receive the SMS
							</span>
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
});

HowItWorksSection.displayName =
	"HowItWorksSection";

export default HowItWorksSection;
