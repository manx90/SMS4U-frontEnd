/* eslint-disable no-unused-vars */
"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FaFacebookSquare } from "@react-icons/all-files/fa/FaFacebookSquare";
import { IoLogoWhatsapp } from "@react-icons/all-files/io/IoLogoWhatsapp";
import { FaTelegramPlane } from "@react-icons/all-files/fa/FaTelegramPlane";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { RiDiscordLine } from "@react-icons/all-files/ri/RiDiscordLine";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaSnapchat } from "@react-icons/all-files/fa/FaSnapchat";
import { FaSpotify } from "@react-icons/all-files/fa/FaSpotify";
import { FaUber } from "@react-icons/all-files/fa/FaUber";

import {
	Sun,
	Moon,
	Shield,
	Zap,
	Globe,
	Lock,
	CheckCircle,
	MessageCircle,
	Send,
} from "lucide-react";
// Aceternity UI Components
import { WavyBackground } from "./ui/wavy-background";
import { LampContainer } from "./ui/lamp";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { LayoutTextFlip } from "./ui/layout-text-flip";
import { Highlight } from "./ui/hero-highlight";
import { Meteors } from "./ui/meteors";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "./ui/navigation-menu";
import WorldMap from "./ui/world-map";
import { GlowingEffect } from "./ui/glowing-effect";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Button as MovingBorderButton } from "./ui/moving-border";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

const LandingPage = () => {
	const { theme, setTheme } = useTheme();
	const isDarkMode = theme === "dark";

	const toggleTheme = () => {
		setTheme(isDarkMode ? "light" : "dark");
	};

	// Typewriter words for headline
	const typewriterWords = [
		{ text: "Get" },
		{ text: "Temporary" },
		{ text: "Numbers" },
		{
			text: "for",
			className:
				"text-gray-600 dark:text-gray-400",
		},
	];

	// Flip words for service names
	const serviceNames = [
		{
			icon: (
				<FaFacebookSquare
					style={{ color: "#1877F2" }}
				/>
			),
			text: "Facebook",
		},
		{
			icon: (
				<IoLogoWhatsapp
					style={{ color: "#25D366" }}
				/>
			),
			text: "WhatsApp",
		},
		{
			icon: (
				<FaInstagram
					style={{ color: "#E4405F" }}
				/>
			),
			text: "Instagram",
		},
		{
			icon: (
				<FaTelegramPlane
					style={{ color: "#0088cc" }}
				/>
			),
			text: "Telegram",
		},
		{
			icon: (
				<FaTwitter style={{ color: "#1DA1F2" }} />
			),
			text: "Twitter",
		},
		{
			icon: (
				<FaGoogle style={{ color: "#EA4335" }} />
			),
			text: "Google",
		},
		{
			icon: (
				<FaLinkedin
					style={{ color: "#0A66C2" }}
				/>
			),
			text: "LinkedIn",
		},
		{
			icon: (
				<RiDiscordLine
					style={{ color: "#5865F2" }}
				/>
			),
			text: "Discord",
		},
		{
			icon: (
				<FaSnapchat
					style={{ color: "#FFFC00" }}
				/>
			),
			text: "Snapchat",
		},
		{
			icon: (
				<FaSpotify style={{ color: "#1DB954" }} />
			),
			text: "Spotify",
		},
		{
			icon: (
				<FaUber className="text-black dark:text-white" />
			),
			text: "Uber",
		},
	];

	// World map connection dots
	const mapDots = [
		// America to Europe
		{
			start: { lat: 40.7128, lng: -74.006 },
			end: { lat: 51.5074, lng: -0.1278 },
		}, // NY to London
		{
			start: { lat: 34.0522, lng: -118.2437 },
			end: { lat: 48.8566, lng: 2.3522 },
		}, // LA to Paris
		{
			start: { lat: -23.5505, lng: -46.6333 },
			end: { lat: 41.9028, lng: 12.4964 },
		}, // Sao Paulo to Rome
		// Europe to Asia
		{
			start: { lat: 51.5074, lng: -0.1278 },
			end: { lat: 35.6762, lng: 139.6503 },
		}, // London to Tokyo
		{
			start: { lat: 52.52, lng: 13.405 },
			end: { lat: 39.9042, lng: 116.4074 },
		}, // Berlin to Beijing
		{
			start: { lat: 55.7558, lng: 37.6173 },
			end: { lat: 28.6139, lng: 77.209 },
		}, // Moscow to Delhi
		{
			start: { lat: 41.0082, lng: 28.9784 },
			end: { lat: 31.2304, lng: 121.4737 },
		}, // Istanbul to Shanghai
		// Asia Pacific
		{
			start: { lat: 35.6762, lng: 139.6503 },
			end: { lat: -33.8688, lng: 151.2093 },
		}, // Tokyo to Sydney
		{
			start: { lat: 1.3521, lng: 103.8198 },
			end: { lat: -37.8136, lng: 144.9631 },
		}, // Singapore to Melbourne
		{
			start: { lat: 13.7563, lng: 100.5018 },
			end: { lat: 22.3964, lng: 114.1095 },
		}, // Bangkok to Hong Kong
		// Cross-continental and Africa
		{
			start: { lat: 1.3521, lng: 103.8198 },
			end: { lat: 40.7128, lng: -74.006 },
		}, // Singapore to NY
		{
			start: { lat: -26.2041, lng: 28.0473 },
			end: { lat: 51.5074, lng: -0.1278 },
		}, // Johannesburg to London
		{
			start: { lat: 30.0444, lng: 31.2357 },
			end: { lat: 48.1351, lng: 11.582 },
		}, // Cairo to Munich
		{
			start: { lat: -33.9249, lng: 18.4241 },
			end: { lat: 19.4326, lng: -99.1332 },
		}, // Cape Town to Mexico City
		// Oceania & extras
		{
			start: { lat: -33.8688, lng: 151.2093 },
			end: { lat: -36.8485, lng: 174.7633 },
		}, // Sydney to Auckland
		{
			start: { lat: 37.7749, lng: -122.4194 },
			end: { lat: 35.6895, lng: 139.6917 },
		}, // SF to Tokyo
		{
			start: { lat: 19.4326, lng: -99.1332 },
			end: { lat: 40.4168, lng: -3.7038 },
		}, // Mexico City to Madrid
		{
			start: { lat: 48.2082, lng: 16.3738 },
			end: { lat: 59.3293, lng: 18.0686 },
		}, // Vienna to Stockholm
		{
			start: { lat: 55.7558, lng: 37.6173 },
			end: { lat: 35.6762, lng: 139.6503 },
		}, // Moscow to Tokyo
		{
			start: { lat: 39.9042, lng: 116.4074 },
			end: { lat: 1.3521, lng: 103.8198 },
		}, // Beijing to Singapore
		{
			start: { lat: 28.6139, lng: 77.209 },
			end: { lat: -33.8688, lng: 151.2093 },
		}, // Delhi to Sydney
		{
			start: { lat: 43.6532, lng: -79.3832 },
			end: { lat: 51.5074, lng: -0.1278 },
		}, // Toronto to London
	];

	// How It Works steps (for infinite cards)
	const howItWorksSteps = [
		{
			quote:
				"Browse through our list of supported services like Facebook, WhatsApp, Telegram, and more. Select the one you need to verify.",
			name: "Step 1",
			title: "Choose Your Service",
		},
		{
			quote:
				"Instantly receive a temporary phone number from your chosen country. No registration or signup required - just select and use.",
			name: "Step 2",
			title: "Get a Number",
		},
		{
			quote:
				"Receive your verification SMS code in seconds. Copy and paste it into the app you're verifying. Simple and fast!",
			name: "Step 3",
			title: "Receive the Code",
		},
		{
			quote:
				"Your temporary number stays active for 20 minutes, giving you plenty of time to complete verification. Then it's automatically recycled.",
			name: "Bonus",
			title: "Auto-Expiry",
		},
	];

	// FAQ items
	const faqItems = [
		{
			question: "What services are supported?",
			answer:
				"We support all major platforms including Facebook, WhatsApp, Telegram, Instagram, TikTok, Google, Twitter, and over 100+ other services. New services are added regularly based on user demand.",
		},
		{
			question: "How long is the number active?",
			answer:
				"Each temporary number remains active for 20 minutes from the time you receive it. This gives you plenty of time to complete your verification. If you need more time, you can extend the duration.",
		},
		{
			question: "Is my privacy protected?",
			answer:
				"Absolutely! We never store your personal information. The temporary numbers are completely anonymous and cannot be traced back to you. All SMS messages are automatically deleted after 24 hours.",
		},
		{
			question:
				"What if I don't receive the code?",
			answer:
				"If you don't receive a code within 5 minutes, you can request a refund or try a different number at no extra charge. Our success rate is 99.9%, so this rarely happens.",
		},
		{
			question: "Do I need to register?",
			answer:
				"No registration required! Simply select your service, choose a number, and start receiving SMS codes immediately. You only pay for what you use.",
		},
	];

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDarkMode
					? "dark bg-[#0b0b0b]"
					: "bg-[#f9fafb]"
			}`}
		>
			{/* Logo */}
			<div className="absolute top-6 left-6 z-50 flex items-center gap-2 select-none">
				<h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-4">
					SMS4U
				</h3>
			</div>

			{/* Navbar */}
			<div className="fixed flex mx-auto top-0 left-0 right-0 z-50 px-4 pt-4">
				<div className="max-w-7xl mx-auto">
					<NavigationMenu className="bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200/20 dark:border-gray-800/20">
						<NavigationMenuList className="flex gap-6">
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#home"
									className="text-sm font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									Home
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#how-it-works"
									className="text-sm font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									How It Works
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#pricing"
									className="text-sm font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									Pricing
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#faq"
									className="text-sm font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									FAQ
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#contact"
									className="text-sm font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									Contact
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>

			{/* Hero Section */}
			<section
				id="home"
				className="relative min-h-screen overflow-hidden"
			>
				{/* Wavy Background */}
				<div className="absolute inset-0 z-0">
					<WavyBackground
						containerClassName="min-h-screen"
						colors={[
							"#6EE7B7",
							"#3B82F6",
							"#8B5CF6",
							"#6EE7B7",
						]}
						waveWidth={50}
						backgroundFill={
							isDarkMode ? "#0b0b0b" : "#f9fafb"
						}
						blur={10}
						speed="fast"
						waveOpacity={0.15}
					/>
				</div>

				{/* Meteors */}
				<div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
					<Meteors
						number={20}
						className="bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]"
					/>
				</div>

				{/* Content */}
				<div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
					<div className="max-w-6xl mx-auto w-full">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-12"
						>
							{/* Headline with Typewriter */}
							<div className="flex flex-wrap items-center justify-center gap-3 mb-6">
								<TypewriterEffectSmooth
									words={typewriterWords}
									className="mb-0"
									cursorClassName="bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]"
								/>
								<LayoutTextFlip
									text=""
									className="mb-0"
									words={serviceNames}
									duration={2000}
								/>
							</div>

							{/* Subheading */}
							<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
								<Highlight className="text-gray-900 dark:text-white">
									Choose a service, get a number,
									receive the code
								</Highlight>{" "}
								— all in seconds.
							</p>

							{/* Trust Badges */}
							{/* <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Clock className="w-4 h-4 text-[#6EE7B7]" />
									<span>Average time: 5s</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Globe className="w-4 h-4 text-[#3B82F6]" />
									<span>50+ countries</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Lock className="w-4 h-4 text-[#6EE7B7]" />
									<span>
										100% secure & private
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Zap className="w-4 h-4 text-[#3B82F6]" />
									<span>Instant activation</span>
								</div>
							</div> */}

							{/* CTAs */}
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
								<button className="px-8 py-4 bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
									Get a Number Now
								</button>
								<button className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold text-lg hover:border-[#6EE7B7] dark:hover:border-[#3B82F6] transition-all">
									See How It Works
								</button>
							</div>

							{/* Mock SMS UI */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: 0.3,
									duration: 0.8,
								}}
								className="max-w-sm mx-auto"
							>
								<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] rounded-full flex items-center justify-center">
											<MessageCircle className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-sm font-semibold text-gray-900 dark:text-white">
												+1 (555) 123-4567
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												Active for 19:45
											</div>
										</div>
									</div>
									<div className="border-t border-gray-200 dark:border-gray-800 pt-4">
										<div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
											📩 Your verification code
											is:
										</div>
										<div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] tracking-wider">
											284756
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Supported Services Showcase */}
			<section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#0b0b0b] dark:to-black/50">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
							Supported{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								Services
							</span>
						</h2>
						<p className="text-gray-600 dark:text-gray-300">
							Works with all major platforms and
							apps
						</p>
					</motion.div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#1877F2] dark:hover:border-[#1877F2] transition-all shadow-sm hover:shadow-lg"
						>
							<FaFacebookSquare
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#1877F2" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Facebook
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.05 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#25D366] dark:hover:border-[#25D366] transition-all shadow-sm hover:shadow-lg"
						>
							<IoLogoWhatsapp
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#25D366" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								WhatsApp
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#0088cc] dark:hover:border-[#0088cc] transition-all shadow-sm hover:shadow-lg"
						>
							<FaTelegramPlane
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#0088cc" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Telegram
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.15 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#E4405F] dark:hover:border-[#E4405F] transition-all shadow-sm hover:shadow-lg"
						>
							<FaInstagram
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#E4405F" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Instagram
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#1DA1F2] dark:hover:border-[#1DA1F2] transition-all shadow-sm hover:shadow-lg"
						>
							<FaTwitter
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#1DA1F2" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Twitter
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.25 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#EA4335] dark:hover:border-[#EA4335] transition-all shadow-sm hover:shadow-lg"
						>
							<FaGoogle
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#EA4335" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Google
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#0A66C2] dark:hover:border-[#0A66C2] transition-all shadow-sm hover:shadow-lg"
						>
							<FaLinkedin
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#0A66C2" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								LinkedIn
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.35 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#5865F2] dark:hover:border-[#5865F2] transition-all shadow-sm hover:shadow-lg"
						>
							<RiDiscordLine
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#5865F2" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Discord
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.4 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#FFFC00] dark:hover:border-[#FFFC00] transition-all shadow-sm hover:shadow-lg"
						>
							<FaSnapchat
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#FFFC00" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Snapchat
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.45 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#1DB954] dark:hover:border-[#1DB954] transition-all shadow-sm hover:shadow-lg"
						>
							<FaSpotify
								className="w-12 h-12 mx-auto mb-3"
								style={{ color: "#1DB954" }}
							/>
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Spotify
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.5 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#000000] dark:hover:border-[#09091A] transition-all shadow-sm hover:shadow-lg"
						>
							<FaUber className="w-12 h-12 mx-auto mb-3 text-black dark:text-white" />
							<p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
								Uber
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							viewport={{ once: true }}
							transition={{ delay: 0.55 }}
							whileHover={{ scale: 1.05, y: -5 }}
							className="p-6 bg-gradient-to-br from-[#6EE7B7]/10 to-[#3B82F6]/10 dark:from-[#6EE7B7]/20 dark:to-[#3B82F6]/20 rounded-2xl border border-[#6EE7B7]/50 dark:border-[#3B82F6]/50 transition-all shadow-sm hover:shadow-lg"
						>
							<div className="text-2xl mx-auto mb-3 text-center">
								➕
							</div>
							<p className="text-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								More
							</p>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="text-center mt-8"
					>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							+ 100 more services including
							Google, Twitter, Discord, LinkedIn,
							and many others
						</p>
					</motion.div>
				</div>
			</section>

			{/* How It Works Steps */}
			<section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black/50 dark:to-[#0b0b0b]">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							How It{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								Works
							</span>
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Get your verification code in 3
							simple steps
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Step 1 */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="relative"
						>
							<div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[#6EE7B7] to-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
								1
							</div>
							<div className="ml-16 pt-2">
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
									Choose Service
								</h3>
								<p className="text-gray-600 dark:text-gray-300">
									Select the platform you need to
									verify from our list of 100+
									supported services including
									Facebook, WhatsApp, Telegram,
									and more.
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
							<div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
								2
							</div>
							<div className="ml-16 pt-2">
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
									Get Number
								</h3>
								<p className="text-gray-600 dark:text-gray-300">
									Instantly receive a temporary
									phone number from your chosen
									country. The number is active
									and ready to receive SMS.
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
							<div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
								3
							</div>
							<div className="ml-16 pt-2">
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
									Receive Code
								</h3>
								<p className="text-gray-600 dark:text-gray-300">
									Your verification code arrives
									in seconds (average 5s). Copy it
									and complete your registration.
									Simple as that!
								</p>
							</div>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6 }}
						className="mt-16 text-center"
					>
						<div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6EE7B7]/10 to-[#3B82F6]/10 dark:from-[#6EE7B7]/20 dark:to-[#3B82F6]/20 rounded-full border border-[#6EE7B7]/30 dark:border-[#3B82F6]/30">
							<CheckCircle className="w-5 h-5 text-[#6EE7B7]" />
							<span className="text-gray-700 dark:text-gray-300 font-medium">
								No registration required • Pay
								only when you receive the SMS
							</span>
						</div>
					</motion.div>
				</div>
			</section>

			{/* World Map Section */}
			<section
				id="worldwide"
				className="relative py-20 bg-gray-50 dark:bg-black/50"
			>
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							Available Worldwide{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								🌐
							</span>
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Get numbers from over 150 countries
						</p>
					</motion.div>

					<div className="relative">
						<div className="relative p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
							<GlowingEffect
								blur={20}
								spread={40}
								disabled={false}
								borderWidth={2}
							/>
							<WorldMap
								dots={mapDots}
								lineColor="#3B82F6"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
						<div className="text-center">
							<div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
								50+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								Countries Covered
							</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
								10K+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								Numbers Available
							</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-2">
								100K+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								Users Served
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features/Benefits Section */}
			<section className="py-20 bg-white dark:bg-[#0b0b0b]">
				<div className="max-w-7xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							Why Choose{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								sms4u
							</span>
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:border-[#6EE7B7] dark:hover:border-[#6EE7B7] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-green-100 dark:bg-green-800/50 rounded-xl flex items-center justify-center mb-4">
								<CheckCircle className="w-8 h-8 text-[#10b981]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								No Registration Required
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Start using our service
								immediately. No signup, no
								personal information needed.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center mb-4">
								<Zap className="w-8 h-8 text-[#3B82F6]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								Instant Delivery
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
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
							className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 hover:border-[#6EE7B7] dark:hover:border-[#6EE7B7] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-teal-100 dark:bg-teal-800/50 rounded-xl flex items-center justify-center mb-4">
								<Globe className="w-8 h-8 text-[#14b8a6]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								Worldwide Coverage
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Access numbers from 50+ countries.
								Verify accounts from anywhere in
								the world.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-purple-100 dark:bg-purple-800/50 rounded-xl flex items-center justify-center mb-4">
								<Shield className="w-8 h-8 text-[#8B5CF6]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								Secure & Private
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
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
							className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 hover:border-[#f59e0b] dark:hover:border-[#f59e0b] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-amber-100 dark:bg-amber-800/50 rounded-xl flex items-center justify-center mb-4">
								<Lock className="w-8 h-8 text-[#f59e0b]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								Pay Only for What You Use
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								No monthly fees or subscriptions.
								Pay per verification or top up
								your balance.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.5 }}
							className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 hover:border-[#ec4899] dark:hover:border-[#ec4899] transition-all hover:shadow-lg"
						>
							<div className="w-14 h-14 bg-pink-100 dark:bg-pink-800/50 rounded-xl flex items-center justify-center mb-4">
								<Send className="w-8 h-8 text-[#ec4899]" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
								100+ Services Supported
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								From social media to messaging
								apps, we support all major
								platforms.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section
				id="faq"
				className="py-20 bg-white dark:bg-[#0b0b0b]"
			>
				<div className="max-w-4xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							Frequently Asked{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
								Questions
							</span>
						</h2>
					</motion.div>

					<Accordion
						type="single"
						collapsible
						className="w-full"
					>
						{faqItems.map((item, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
							>
								<AccordionTrigger className="text-left text-gray-900 dark:text-white hover:text-[#3B82F6]">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-gray-600 dark:text-gray-300">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* Footer */}
			<footer
				id="contact"
				className="bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-gray-800 py-12"
			>
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] mb-4">
								SMS4U
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Get temporary phone numbers for
								verification. Fast, secure, and
								reliable.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-white mb-4">
								Services
							</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#1877F2] transition-colors flex items-center gap-2"
									>
										<FaFacebookSquare
											className="w-4 h-4"
											style={{ color: "#1877F2" }}
										/>
										Facebook
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#25D366] transition-colors flex items-center gap-2"
									>
										<IoLogoWhatsapp
											className="w-4 h-4"
											style={{ color: "#25D366" }}
										/>
										WhatsApp
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#0088cc] transition-colors flex items-center gap-2"
									>
										<FaTelegramPlane
											className="w-4 h-4"
											style={{ color: "#0088cc" }}
										/>
										Telegram
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#E4405F] transition-colors flex items-center gap-2"
									>
										<FaInstagram
											className="w-4 h-4"
											style={{ color: "#E4405F" }}
										/>
										Instagram
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-white mb-4">
								Company
							</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										Privacy Policy
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-white mb-4">
								Support
							</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
									>
										API Docs
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
						<p className="text-gray-600 dark:text-gray-400">
							© 2025 SMS4U. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
