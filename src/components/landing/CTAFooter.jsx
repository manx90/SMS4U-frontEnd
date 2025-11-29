// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
	Phone,
	Users,
	Globe,
	Zap,
} from "lucide-react";

const CTAFooter = ({ onGetNumber }) => {
	const stats = [
		{
			icon: Users,
			value: "10k+",
			label: "Active Users",
		},
		{
			icon: Globe,
			value: "190+",
			label: "Countries",
		},
		{
			icon: Zap,
			value: "99.9%",
			label: "Uptime",
		},
	];

	return (
		<section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
						Ready to Get Started?
					</h2>
					<p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
						Join thousands of users who trust us
						for their temporary phone number
						needs. Get your number in seconds, not
						minutes.
					</p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.2,
						}}
						viewport={{ once: true }}
					>
						<Button
							onClick={onGetNumber}
							size="lg"
							className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
						>
							<Phone className="w-6 h-6 mr-3" />
							Get Your Number Now
							<Zap className="w-6 h-6 ml-3" />
						</Button>
					</motion.div>

					{/* Trust Badges */}
					<motion.div
						className="mt-16 flex flex-wrap justify-center items-center gap-8"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{
							duration: 0.8,
							delay: 0.4,
						}}
						viewport={{ once: true }}
					>
						{stats.map((stat, index) => {
							const Icon = stat.icon;
							return (
								<div
									key={index}
									className="flex items-center gap-3 text-white"
								>
									<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
										<Icon className="w-5 h-5" />
									</div>
									<div className="text-left">
										<div className="text-2xl font-bold">
											{stat.value}
										</div>
										<div className="text-sm text-blue-100">
											{stat.label}
										</div>
									</div>
								</div>
							);
						})}
					</motion.div>

					{/* Additional Trust Elements */}
					<motion.div
						className="mt-12 text-center"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{
							duration: 0.8,
							delay: 0.6,
						}}
						viewport={{ once: true }}
					>
						<p className="text-blue-100 mb-6">
							🔒 Secure & Private • ⚡ Instant
							Delivery • 🌍 Global Coverage
						</p>
						<p className="text-sm text-blue-200">
							No credit card required • 24/7
							support • 20-minute validity
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default CTAFooter;


