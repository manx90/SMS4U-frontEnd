import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
	MapPin,
	MessageSquare,
	Phone,
	Check,
	Loader2,
	Copy,
	Eye,
	EyeOff,
} from "lucide-react";

const GetNumberModal = ({ isOpen, onClose }) => {
	const [step, setStep] = useState(1);
	const [selectedCountry, setSelectedCountry] =
		useState("");
	const [selectedService, setSelectedService] =
		useState("");
	const [generatedNumber, setGeneratedNumber] =
		useState("");
	const [isLoading, setIsLoading] =
		useState(false);
	const [showNumber, setShowNumber] =
		useState(false);
	const [smsMessages, setSmsMessages] = useState(
		[],
	);

	const countries = [
		{
			code: "US",
			name: "United States",
			flag: "🇺🇸",
		},
		{
			code: "GB",
			name: "United Kingdom",
			flag: "🇬🇧",
		},
		{ code: "CA", name: "Canada", flag: "🇨🇦" },
		{ code: "DE", name: "Germany", flag: "🇩🇪" },
		{ code: "FR", name: "France", flag: "🇫🇷" },
		{ code: "JP", name: "Japan", flag: "🇯🇵" },
		{ code: "AU", name: "Australia", flag: "🇦🇺" },
		{ code: "BR", name: "Brazil", flag: "🇧🇷" },
	];

	const services = [
		{
			name: "Facebook",
			icon: "📘",
			color: "from-blue-500 to-blue-600",
		},
		{
			name: "WhatsApp",
			icon: "💬",
			color: "from-green-500 to-green-600",
		},
		{
			name: "Telegram",
			icon: "✈️",
			color: "from-blue-400 to-blue-500",
		},
		{
			name: "Instagram",
			icon: "📷",
			color: "from-pink-500 to-purple-600",
		},
		{
			name: "Twitter",
			icon: "🐦",
			color: "from-sky-400 to-sky-500",
		},
		{
			name: "Google",
			icon: "🔍",
			color: "from-red-500 to-yellow-500",
		},
	];

	const handleCountrySelect = (country) => {
		setSelectedCountry(country);
		setStep(2);
	};

	const handleServiceSelect = (service) => {
		setSelectedService(service);
		generateNumber();
	};

	const generateNumber = async () => {
		setIsLoading(true);
		setStep(3);

		// Simulate API call
		setTimeout(() => {
			const number = `+${
				Math.floor(Math.random() * 9000000000) +
				1000000000
			}`;
			setGeneratedNumber(number);
			setIsLoading(false);

			// Simulate incoming SMS after 3 seconds
			setTimeout(() => {
				const sms = {
					id: Date.now(),
					from: selectedService.name,
					message: `Your ${
						selectedService.name
					} verification code is: ${Math.floor(
						100000 + Math.random() * 900000,
					)}`,
					timestamp:
						new Date().toLocaleTimeString(),
				};
				setSmsMessages([sms]);
			}, 3000);
		}, 2000);
	};

	const copyToClipboard = async () => {
		try {
			// Detect if running on mobile
			const isMobile =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent,
				);

			// On mobile, always use the fallback method as it's more reliable
			if (
				isMobile ||
				!navigator.clipboard ||
				!navigator.clipboard.writeText
			) {
				// Fallback method for mobile and older browsers
				const textArea =
					document.createElement("textarea");
				textArea.value = generatedNumber;

				// Critical: Make it invisible but still accessible for selection
				textArea.style.position = "fixed";
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.width = "2em";
				textArea.style.height = "2em";
				textArea.style.padding = "0";
				textArea.style.border = "none";
				textArea.style.outline = "none";
				textArea.style.boxShadow = "none";
				textArea.style.background = "transparent";
				textArea.style.opacity = "0";
				textArea.style.fontSize = "16px"; // Prevent zoom on iOS
				textArea.setAttribute("readonly", "");

				document.body.appendChild(textArea);

				// Focus is important for mobile
				textArea.focus();

				// Handle iOS devices specially
				if (
					navigator.userAgent.match(
						/ipad|ipod|iphone/i,
					)
				) {
					// iOS requires a different approach
					textArea.contentEditable = "true";
					textArea.readOnly = false;

					const range = document.createRange();
					range.selectNodeContents(textArea);

					const selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);

					textArea.setSelectionRange(0, 999999);
				} else {
					// Android and other mobile devices
					textArea.select();
					textArea.setSelectionRange(0, 99999);
				}

				// Execute copy command
				const successful =
					document.execCommand("copy");
				document.body.removeChild(textArea);

				if (!successful) {
					throw new Error("Copy command failed");
				}
			} else {
				// Modern Clipboard API for desktop (HTTPS only)
				await navigator.clipboard.writeText(
					generatedNumber,
				);
			}
		} catch (error) {
			console.error("Copy failed:", error);
		}
	};

	const resetModal = () => {
		setStep(1);
		setSelectedCountry("");
		setSelectedService("");
		setGeneratedNumber("");
		setIsLoading(false);
		setShowNumber(false);
		setSmsMessages([]);
	};

	const handleClose = () => {
		resetModal();
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={handleClose}
		>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Get Your Temporary Number
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Progress Steps */}
					<div className="flex items-center justify-between mb-8">
						{[1, 2, 3].map((stepNumber) => (
							<div
								key={stepNumber}
								className="flex items-center"
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
										step >= stepNumber
											? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-500"
									}`}
								>
									{stepNumber}
								</div>
								{stepNumber < 3 && (
									<div
										className={`w-16 h-1 mx-2 ${
											step > stepNumber
												? "bg-gradient-to-r from-purple-600 to-blue-600"
												: "bg-gray-200 dark:bg-gray-700"
										}`}
									/>
								)}
							</div>
						))}
					</div>

					{/* Step 1: Country Selection */}
					{step === 1 && (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
						>
							<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<MapPin className="w-5 h-5 text-purple-600" />
								Select Your Country
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								{countries.map((country) => (
									<motion.div
										key={country.code}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Card
											className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-purple-300"
											onClick={() =>
												handleCountrySelect(
													country,
												)
											}
										>
											<CardContent className="p-4 text-center">
												<div className="text-2xl mb-2">
													{country.flag}
												</div>
												<div className="text-sm font-medium">
													{country.name}
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* Step 2: Service Selection */}
					{step === 2 && (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
						>
							<div className="mb-4">
								<Button
									variant="outline"
									onClick={() => setStep(1)}
									className="mb-4"
								>
									← Back
								</Button>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<MessageSquare className="w-5 h-5 text-purple-600" />
									Select Service for{" "}
									{selectedCountry.flag}{" "}
									{selectedCountry.name}
								</h3>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{services.map((service) => (
									<motion.div
										key={service.name}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Card
											className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-purple-300"
											onClick={() =>
												handleServiceSelect(
													service,
												)
											}
										>
											<CardContent className="p-4 text-center">
												<div
													className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center`}
												>
													<span className="text-xl">
														{service.icon}
													</span>
												</div>
												<div className="text-sm font-medium">
													{service.name}
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* Step 3: Number Generation & SMS */}
					{step === 3 && (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
						>
							<div className="mb-4">
								<Button
									variant="outline"
									onClick={() => setStep(2)}
									className="mb-4"
								>
									← Back
								</Button>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<Phone className="w-5 h-5 text-purple-600" />
									Your Temporary Number
								</h3>
							</div>

							{isLoading ? (
								<div className="text-center py-12">
									<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
									<p className="text-gray-600 dark:text-gray-300">
										Generating your{" "}
										{selectedCountry.name} number
										for {selectedService.name}...
									</p>
								</div>
							) : (
								<div className="space-y-6">
									{/* Generated Number */}
									<Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
										<CardContent className="p-6">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
														{selectedService.name}{" "}
														•{" "}
														{selectedCountry.name}
													</p>
													<div className="flex items-center gap-2">
														<span className="text-2xl font-mono font-bold">
															{showNumber
																? generatedNumber
																: "••••••••••"}
														</span>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																setShowNumber(
																	!showNumber,
																)
															}
														>
															{showNumber ? (
																<EyeOff className="w-4 h-4" />
															) : (
																<Eye className="w-4 h-4" />
															)}
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={
																copyToClipboard
															}
														>
															<Copy className="w-4 h-4" />
														</Button>
													</div>
												</div>
												<div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
													<Check className="w-8 h-8 text-white" />
												</div>
											</div>
										</CardContent>
									</Card>

									{/* SMS Messages */}
									<div>
										<h4 className="font-semibold mb-3 flex items-center gap-2">
											<MessageSquare className="w-4 h-4 text-purple-600" />
											Incoming SMS Messages
										</h4>

										{smsMessages.length === 0 ? (
											<Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
												<CardContent className="p-8 text-center">
													<MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
													<p className="text-gray-500 dark:text-gray-400">
														Waiting for SMS
														messages... They will
														appear here
														automatically.
													</p>
												</CardContent>
											</Card>
										) : (
											<div className="space-y-3">
												{smsMessages.map(
													(sms) => (
														<Card
															key={sms.id}
															className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"
														>
															<CardContent className="p-4">
																<div className="flex justify-between items-start mb-2">
																	<span className="font-semibold text-green-800 dark:text-green-200">
																		{sms.from}
																	</span>
																	<span className="text-xs text-gray-500">
																		{
																			sms.timestamp
																		}
																	</span>
																</div>
																<p className="text-gray-700 dark:text-gray-300">
																	{sms.message}
																</p>
															</CardContent>
														</Card>
													),
												)}
											</div>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3">
										<Button
											onClick={handleClose}
											className="flex-1"
											variant="outline"
										>
											Done
										</Button>
										<Button
											onClick={() => {
												resetModal();
												setStep(1);
											}}
											className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
										>
											Get Another Number
										</Button>
									</div>
								</div>
							)}
						</motion.div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GetNumberModal;
