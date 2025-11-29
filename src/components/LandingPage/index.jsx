/* eslint-disable no-unused-vars */
"use client";
import {
	Suspense,
	useCallback,
	useState,
	useEffect,
	lazy,
} from "react";
import { useTheme } from "next-themes";
import {
	Menu,
	LogIn,
	UserPlus,
	MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "../ui/navigation-menu";
import { ThemeToggle } from "../theme-toggle";
import MobileDrawer from "./MobileDrawer";
import { Button } from "../ui/button";

// Eager load hero section (above the fold)
import HeroSection from "./HeroSection";

// Properly lazy load other sections using React.lazy()
const ServicesSection = lazy(() =>
	import("./ServicesSection"),
);
const HowItWorksSection = lazy(() =>
	import("./HowItWorksSection"),
);
const WorldMapSection = lazy(() =>
	import("./WorldMapSection"),
);
const FeaturesSection = lazy(() =>
	import("./FeaturesSection"),
);
const FAQSection = lazy(() =>
	import("./FAQSection"),
);
const Footer = lazy(() => import("./Footer"));

// Loading component for Suspense fallback
const SectionLoader = () => (
	<div className="flex items-center justify-center py-20">
		<div className="w-12 h-12 border-4 border-[#6EE7B7] border-t-[#3B82F6] rounded-full animate-spin"></div>
	</div>
);

const LandingPage = () => {
	const { theme, setTheme } = useTheme();
	const isDarkMode = theme === "dark";
	const navigate = useNavigate();
	const [
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
	] = useState(false);

	// Ensure theme is properly set on mount
	useEffect(() => {
		if (!theme || theme === "system") {
			setTheme("light");
		}
	}, [theme, setTheme]);

	const toggleTheme = useCallback(() => {
		setTheme(isDarkMode ? "light" : "dark");
	}, [isDarkMode, setTheme]);

	const toggleMobileDrawer = useCallback(() => {
		setIsMobileDrawerOpen((prev) => !prev);
	}, []);

	const closeMobileDrawer = useCallback(() => {
		setIsMobileDrawerOpen(false);
	}, []);

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDarkMode
					? "dark bg-[#0b0b0b]"
					: "bg-[#f9fafb]"
			}`}
		>
			{/* Mobile Drawer */}
			<MobileDrawer
				isOpen={isMobileDrawerOpen}
				onClose={closeMobileDrawer}
			/>

			{/* Header with Logo and Navbar */}
			<div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 md:pt-4">
				<div className="max-w-7xl mx-auto relative flex items-center justify-between md:justify-center">
					{/* Logo - Left side */}
					<div className="flex items-center gap-2 select-none md:absolute md:left-0">
						<h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							SMS4U
						</h3>
					</div>

					{/* Navbar - Center (Floating with blur) - Desktop/Tablet */}
					<NavigationMenu className="hidden md:flex bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/20 dark:border-gray-800/20">
						<NavigationMenuList className="flex gap-6 items-center">
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#home"
									className="text-sm font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									Home
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#how-it-works"
									className="text-sm font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									How It Works
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#faq"
									className="text-sm font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
								>
									FAQ
								</NavigationMenuLink>
							</NavigationMenuItem>
							{/* Support Link */}
							<NavigationMenuItem>
								<a
									href="https://t.me/sms4u_pro"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all flex items-center gap-1"
								>
									<MessageCircle className="w-4 h-4" />
									Support
								</a>
							</NavigationMenuItem>
							{/* Auth Buttons */}
							<NavigationMenuItem>
								<div className="pl-2 border-l border-gray-300 dark:border-gray-700 flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											navigate("/login")
										}
										onMouseEnter={() => {
											// Prefetch login page on hover
											import(
												"../../pages/Login"
											).catch(() => {});
										}}
										className="text-sm font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] transition-all"
									>
										<LogIn className="w-4 h-4 mr-1 text-gray-900 dark:text-white" />
										Login
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											navigate("/register")
										}
										onMouseEnter={() => {
											// Prefetch register page on hover
											import(
												"../../pages/Register"
											).catch(() => {});
										}}
										className="text-sm font-medium bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-white hover:opacity-90 transition-all"
									>
										<UserPlus className="w-4 h-4 mr-1" />
										Sign Up
									</Button>
								</div>
							</NavigationMenuItem>
							{/* Theme Toggle - Desktop/Tablet Only */}
							<NavigationMenuItem>
								<div className="pl-2 border-l text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
									<ThemeToggle />
								</div>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>

					{/* Hamburger Menu - Mobile Only */}
					<button
						onClick={toggleMobileDrawer}
						className="md:hidden p-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-gray-200/20 dark:border-gray-800/20 hover:bg-white/70 dark:hover:bg-black/70 transition-all shadow-lg"
						aria-label="Toggle menu"
					>
						<Menu className="w-6 h-6 text-gray-900 dark:text-white" />
					</button>
				</div>
			</div>

			{/* Hero Section - Loaded immediately */}
			<HeroSection isDarkMode={isDarkMode} />

			{/* Lazy loaded sections with Suspense */}
			<Suspense fallback={<SectionLoader />}>
				<ServicesSection />
			</Suspense>

			<Suspense fallback={<SectionLoader />}>
				<HowItWorksSection />
			</Suspense>

			<Suspense fallback={<SectionLoader />}>
				<WorldMapSection />
			</Suspense>

			<Suspense fallback={<SectionLoader />}>
				<FeaturesSection />
			</Suspense>

			<Suspense fallback={<SectionLoader />}>
				<FAQSection />
			</Suspense>

			<Suspense fallback={<SectionLoader />}>
				<Footer />
			</Suspense>
		</div>
	);
};

export default LandingPage;
