
import { Card, CardContent } from "../ui/card";
import {
	Globe,
	Zap,
	Shield,
	Target,
} from "lucide-react";

const Features = () => {
	const features = [
		{
			icon: Globe,
			title: "Global Coverage",
			description:
				"Access phone numbers from 190+ countries worldwide. From USA to Japan, we've got you covered.",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			icon: Zap,
			title: "Instant Activation",
			description:
				"Get your temporary number in seconds, not minutes. No waiting, no delays, just instant access.",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			icon: Shield,
			title: "Trusted Numbers",
			description:
				"All numbers are verified and from legitimate providers. Your privacy and security are our priority.",
			gradient: "from-green-500 to-emerald-500",
		},
		{
			icon: Target,
			title: "Easy to Use",
			description:
				"Simple 3-step process. Choose country, select service, get number. It's that straightforward.",
			gradient: "from-orange-500 to-red-500",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
			},
		},
	};

	return (
		<section className="py-20 bg-white dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Why Choose Us
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						We make getting temporary phone
						numbers simple, fast, and reliable.
						Here's what sets us apart from the
						competition.
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={index}
								variants={itemVariants}
							>
								<Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
									<CardContent className="p-8 text-center">
										<motion.div
											className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
											whileHover={{ scale: 1.1 }}
										>
											<Icon className="w-8 h-8 text-white" />
										</motion.div>

										<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
											{feature.title}
										</h3>

										<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};

export default Features;








