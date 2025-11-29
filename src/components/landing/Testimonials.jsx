// import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Digital Marketer",
			avatar: "👩‍💼",
			rating: 5,
			text: "This service saved me so much time! I needed phone numbers for multiple social media campaigns and got them instantly. The SMS delivery is super fast and reliable.",
			country: "USA",
		},
		{
			name: "Ahmed Hassan",
			role: "App Developer",
			avatar: "👨‍💻",
			rating: 5,
			text: "Perfect for app testing! I can verify accounts across different countries without needing real phone numbers. The global coverage is amazing.",
			country: "Egypt",
		},
		{
			name: "Maria Rodriguez",
			role: "Business Owner",
			avatar: "👩‍💼",
			rating: 5,
			text: "I use this for all my business verification needs. WhatsApp, Facebook, everything works perfectly. The pricing is fair and the service is lightning fast.",
			country: "Spain",
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
						What Our Users Say
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Join thousands of satisfied users who
						trust us for their temporary phone
						number needs.
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{testimonials.map(
						(testimonial, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
							>
								<Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 h-full">
									<CardContent className="p-8">
										{/* Quote Icon */}
										<div className="mb-4">
											<Quote className="w-8 h-8 text-purple-500 opacity-20" />
										</div>

										{/* Rating */}
										<div className="flex gap-1 mb-4">
											{[
												...Array(
													testimonial.rating,
												),
											].map((_, i) => (
												<Star
													key={i}
													className="w-4 h-4 fill-yellow-400 text-yellow-400"
												/>
											))}
										</div>

										{/* Testimonial Text */}
										<p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
											"{testimonial.text}"
										</p>

										{/* User Info */}
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-2xl">
												{testimonial.avatar}
											</div>
											<div>
												<h4 className="font-semibold text-gray-900 dark:text-white">
													{testimonial.name}
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{testimonial.role} •{" "}
													{testimonial.country}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						),
					)}
				</motion.div>

				{/* Trust Stats */}
				<motion.div
					className="mt-16 text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{
						duration: 0.8,
						delay: 0.5,
					}}
					viewport={{ once: true }}
				>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="text-4xl font-bold text-purple-600 mb-2">
								10,000+
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Happy Users
							</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								50,000+
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Numbers Generated
							</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-indigo-600 mb-2">
								4.9/5
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Average Rating
							</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-green-600 mb-2">
								99.9%
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Success Rate
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Testimonials;








