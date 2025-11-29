import { memo } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = memo(() => {
	return (
		<footer
			id="contact"
			className="bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-gray-800 py-8 sm:py-10 md:py-12"
		>
			<div className="max-w-7xl flex flex-col items-center justify-center mx-auto px-4 sm:px-6">
				{/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8"> */}
				<div>
					<h3 className="text-lg text-center mx-auto sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]  ">
						SMS4U
					</h3>
					<p className="text-sm sm:text-base mx-auto text-center text-gray-600 dark:text-gray-400">
						Get temporary phone numbers for
						verification. Fast, secure, and
						reliable.
					</p>
				</div>
				{/* <div>
						<h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
							Services
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#1877F2] transition-colors flex items-center gap-2"
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
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#25D366] transition-colors flex items-center gap-2"
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
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#0088cc] transition-colors flex items-center gap-2"
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
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#E4405F] transition-colors flex items-center gap-2"
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
						<h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
							Company
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									About
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
							Support
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									Help Center
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-[#3B82F6] transition-colors"
								>
									API Docs
								</a>
							</li>
						</ul>
					</div> */}
				{/* </div> */}
				<div className="border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8 text-center">
					<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
						© 2025 SMS4U. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
});

Footer.displayName = "Footer";

export default Footer;
