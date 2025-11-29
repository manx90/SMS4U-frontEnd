import { memo } from "react";
import {
	motion, // eslint-disable-line no-unused-vars
	AnimatePresence,
} from "framer-motion";
import { X, LogIn, UserPlus, MessageCircle } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { useNavigate } from "react-router-dom";

const MobileDrawer = memo(
	({ isOpen, onClose }) => {
		const navigate = useNavigate();

		const navigationLinks = [
			{ href: "#home", label: "Home" },
			{
				href: "#how-it-works",
				label: "How It Works",
			},
			{ href: "#faq", label: "FAQ" },
			{ href: "https://t.me/sms4u_pro", label: "Support", external: true },
		];

		const handleLinkClick = (e, href) => {
			e.preventDefault();
			onClose();
			// Smooth scroll to section
			setTimeout(() => {
				const element =
					document.querySelector(href);
				if (element) {
					element.scrollIntoView({
						behavior: "smooth",
					});
				}
			}, 300);
		};

		const handleAuthNavigation = (path) => {
			onClose();
			setTimeout(() => {
				navigate(path);
			}, 300);
		};

		return (
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
							onClick={onClose}
						/>

						{/* Drawer */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{
								duration: 0.3,
								ease: "easeInOut",
							}}
							className="fixed right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden"
						>
							<div className="flex flex-col h-full">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
									<h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
										SMS4U
									</h3>
									<button
										onClick={onClose}
										className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										aria-label="Close menu"
									>
										<X className="w-6 h-6 text-gray-900 dark:text-white" />
									</button>
								</div>

								{/* Navigation Links */}
								<nav className="flex-1 px-4 py-6">
									<ul className="space-y-2">
										{navigationLinks.map(
											(link, index) => (
												<motion.li
													key={link.href}
													initial={{
														opacity: 0,
														x: -20,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													transition={{
														delay: index * 0.1,
														duration: 0.3,
													}}
												>
													<a
														href={link.href}
														onClick={(e) => {
															if (link.external) {
																onClose();
																return;
															}
															handleLinkClick(
																e,
																link.href,
															);
														}}
														target={link.external ? "_blank" : undefined}
														rel={link.external ? "noopener noreferrer" : undefined}
														className="block px-4 py-3 text-base font-medium text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#6EE7B7] hover:to-[#3B82F6] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
													>
														{link.external && <MessageCircle className="w-4 h-4" />}
														{link.label}
													</a>
												</motion.li>
											),
										)}
									</ul>
								</nav>

							{/* Theme Toggle Section */}
							<div className="p-6 border-t border-gray-200 dark:border-gray-800">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										Theme
									</span>
									<ThemeToggle />
								</div>
							</div>

							{/* Auth Buttons */}
							<div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
								<button
									onClick={() => handleAuthNavigation("/login")}
									className="w-full py-3 px-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
								>
									<LogIn className="w-4 h-4" />
									Login
								</button>
								<button
									onClick={() => handleAuthNavigation("/register")}
									className="w-full py-3 px-4 bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
								>
									<UserPlus className="w-4 h-4" />
									Sign Up
								</button>
							</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		);
	},
);

MobileDrawer.displayName = "MobileDrawer";

export default MobileDrawer;
