// import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import {
	MapPin,
	Phone,
	MessageSquare,
	ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
	const steps = [
		{
			number: "01",
			icon: MapPin,
			title: "Select Country & Service",
			description:
				"Choose your preferred country from 190+ options and select the service you need (Facebook, WhatsApp, etc.)",
			gradient: "from-purple-500 to-indigo-500",
		},
		{
			number: "02",
			icon: Phone,
			title: "Get Temporary Number",
			description:
				"Receive your temporary phone number instantly. No waiting, no delays - just immediate access to your number.",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			number: "03",
			icon: MessageSquare,
			title: "Receive SMS Instantly",
			description:
				"Get SMS verification codes and messages directly in your dashboard. Fast, secure, and reliable.",
			gradient: "from-green-500 to-emerald-500",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
			},
		},
	};

	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						How It Works
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Getting your temporary phone number is
						as easy as 1-2-3. No complex setup, no
						waiting - just instant access.
					</p>
				</motion.div>

				<motion.div
					className="relative"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{/* Desktop Connection Lines */}
					<div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 transform -translate-y-1/2 z-0" />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isLast =
								index === steps.length - 1;

							return (
								<motion.div
									key={index}
									variants={itemVariants}
									className="relative"
								>
									<Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative z-10">
										<CardContent className="p-8 text-center">
											{/* Step Number */}
											<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
												<div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
													{step.number}
												</div>
											</div>

											{/* Icon */}
											<motion.div
												className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
												whileHover={{
													scale: 1.1,
												}}
											>
												<Icon className="w-10 h-10 text-white" />
											</motion.div>

											<h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
												{step.title}
											</h3>

											<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
												{step.description}
											</p>
										</CardContent>
									</Card>

									{/* Arrow for Mobile */}
									{!isLast && (
										<div className="lg:hidden flex justify-center mt-8">
											<motion.div
												animate={{
													y: [0, 10, 0],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											>
												<ArrowRight className="w-6 h-6 text-purple-500" />
											</motion.div>
										</div>
									)}
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default HowItWorks;
