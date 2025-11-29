// import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
	Check,
	Zap,
	Clock,
	Shield,
	MessageSquare,
} from "lucide-react";

const Pricing = ({ onGetNumber }) => {
	const features = [
		{
			icon: Zap,
			text: "Instant number delivery",
		},
		{
			icon: MessageSquare,
			text: "SMS forwarding to your dashboard",
		},
		{
			icon: Clock,
			text: "20-minute number validity",
		},
		{
			icon: Shield,
			text: "Secure and private",
		},
	];

	return (
		<section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Simple Pricing
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						No hidden fees, no subscriptions, no
						complicated plans. Just pay for what
						you use, when you use it.
					</p>
				</motion.div>

				<motion.div
					className="flex justify-center"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.8,
						delay: 0.2,
					}}
					viewport={{ once: true }}
				>
					<Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl max-w-md w-full">
						<CardHeader className="text-center pb-8">
							<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								Pay Per Number
							</CardTitle>
							<div className="mb-6">
								<span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
									$0.50
								</span>
								<span className="text-xl text-gray-600 dark:text-gray-300 ml-2">
									per number
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-300">
								One-time payment. No recurring
								charges.
							</p>
						</CardHeader>

						<CardContent className="space-y-6">
							<div className="space-y-4">
								{features.map(
									(feature, index) => {
										const Icon = feature.icon;
										return (
											<motion.div
												key={index}
												className="flex items-center gap-3"
												initial={{
													opacity: 0,
													x: -20,
												}}
												whileInView={{
													opacity: 1,
													x: 0,
												}}
												transition={{
													duration: 0.5,
													delay:
														0.3 + index * 0.1,
												}}
												viewport={{ once: true }}
											>
												<div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
													<Icon className="w-4 h-4 text-white" />
												</div>
												<span className="text-gray-700 dark:text-gray-300">
													{feature.text}
												</span>
											</motion.div>
										);
									},
								)}
							</div>

							<motion.div
								className="pt-6"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.7,
								}}
								viewport={{ once: true }}
							>
								<Button
									onClick={onGetNumber}
									className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
								>
									<Zap className="w-5 h-5 mr-2" />
									Start Now
								</Button>
							</motion.div>

							<p className="text-center text-sm text-gray-500 dark:text-gray-400">
								No credit card required for first
								number
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Additional Info */}
				<motion.div
					className="text-center mt-12"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{
						duration: 0.8,
						delay: 0.8,
					}}
					viewport={{ once: true }}
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600 mb-2">
								24/7
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Support
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 mb-2">
								99.9%
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Uptime
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-indigo-600 mb-2">
								190+
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Countries
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Pricing;
