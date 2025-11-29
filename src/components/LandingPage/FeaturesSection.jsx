import { memo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	Shield,
	Zap,
	Globe,
	Lock,
	CheckCircle,
	Send,
} from "lucide-react";

const FeaturesSection = memo(() => {
	return (
		<section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-[#0b0b0b]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-10 sm:mb-12 md:mb-16"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
						Why Choose{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							SMS4U
						</span>
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:border-[#6EE7B7] dark:hover:border-[#6EE7B7] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#10b981]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							Registration Required
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							Before using our service, you must
							register. Completing registration
							allows access to all features.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#3B82F6]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							Instant Delivery
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							Receive SMS codes in seconds.
							Average delivery time is just 5
							seconds.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 hover:border-[#6EE7B7] dark:hover:border-[#6EE7B7] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 dark:bg-teal-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<Globe className="w-6 h-6 sm:w-8 sm:h-8 text-[#14b8a6]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							Worldwide Coverage
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							Access numbers from 150+ countries.
							Verify accounts from anywhere in the
							world.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B5CF6]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							Secure & Private
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							Your privacy is our priority. All
							messages are encrypted and
							auto-deleted.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 hover:border-[#f59e0b] dark:hover:border-[#f59e0b] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 dark:bg-amber-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#f59e0b]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							Pay Only for What You Use
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							No monthly fees or subscriptions.
							Pay per verification or top up your
							balance.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.5 }}
						className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 hover:border-[#ec4899] dark:hover:border-[#ec4899] transition-all hover:shadow-lg"
					>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-100 dark:bg-pink-800/50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
							<Send className="w-6 h-6 sm:w-8 sm:h-8 text-[#ec4899]" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
							3000+ Services Supported
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
							From social media to messaging apps,
							we support all major platforms
							including Facebook, WhatsApp,
							Telegram, and more.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
