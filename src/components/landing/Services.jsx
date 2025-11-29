// import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";

const Services = () => {
	const services = [
		{
			name: "Facebook",
			color: "from-blue-500 to-blue-600",
			icon: "📘",
		},
		{
			name: "WhatsApp",
			color: "from-green-500 to-green-600",
			icon: "💬",
		},
		{
			name: "Telegram",
			color: "from-blue-400 to-blue-500",
			icon: "✈️",
		},
		{
			name: "Instagram",
			color: "from-pink-500 to-purple-600",
			icon: "📷",
		},
		{
			name: "Twitter",
			color: "from-sky-400 to-sky-500",
			icon: "🐦",
		},
		{
			name: "TikTok",
			color: "from-gray-800 to-gray-900",
			icon: "🎵",
		},
		{
			name: "Google",
			color: "from-red-500 to-yellow-500",
			icon: "🔍",
		},
		{
			name: "Discord",
			color: "from-indigo-500 to-purple-600",
			icon: "💜",
		},
		{
			name: "Snapchat",
			color: "from-yellow-400 to-orange-500",
			icon: "👻",
		},
		{
			name: "LinkedIn",
			color: "from-blue-600 to-blue-700",
			icon: "💼",
		},
		{
			name: "Spotify",
			color: "from-green-600 to-green-700",
			icon: "🎧",
		},
		{
			name: "Uber",
			color: "from-gray-800 to-black",
			icon: "🚗",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5,
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
						Supported Services
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Get temporary phone numbers for all
						your favorite platforms. From social
						media to banking apps, we support them
						all.
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{services.map((service, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
						>
							<Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
								<CardContent className="p-6 text-center">
									<motion.div
										className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<span className="text-2xl">
											{service.icon}
										</span>
									</motion.div>

									<h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">
										{service.name}
									</h3>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Additional Services Text */}
				<motion.div
					className="text-center mt-12"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{
						duration: 0.8,
						delay: 0.5,
					}}
					viewport={{ once: true }}
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full">
						<span className="text-2xl">➕</span>
						<span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
							And 100+ more services
						</span>
					</div>
					<p className="text-gray-500 dark:text-gray-400 mt-4">
						Can't find your service? Contact us
						and we'll add it within 24 hours.
					</p>
				</motion.div>
			</div>
		</section>
	);
};

export default Services;








