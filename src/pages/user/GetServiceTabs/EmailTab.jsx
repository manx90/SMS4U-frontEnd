import {
	useState,
	useEffect,
	useCallback,
} from "react";
import { orderApi } from "../../../services/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "../../../components/shared/CopyButton";
import {
	Mail,
	CheckCircle,
	AlertCircle,
	Loader2,
	Globe2,
	Server,
	RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailTab({
	user,
	loading,
	updateUserBalance,
}) {
	const [sites, setSites] = useState([]);
	const [domains, setDomains] = useState([]);
	const [availability, setAvailability] =
		useState({});
	const [loadingData, setLoadingData] =
		useState(true);
	const [submitting, setSubmitting] =
		useState(false);
	const [activeOrders, setActiveOrders] =
		useState([]); // Array of orders: {orderId, email, site, domain, message, status, timestamp}
	const [checkingOrderId, setCheckingOrderId] =
		useState(null); // Track which order is currently being checked
	const [formData, setFormData] = useState({
		site: "",
		domain: "",
	});
	const [estimatedPrice, setEstimatedPrice] =
		useState(0);

	// Function definitions before useEffects
	const loadEmailData = async () => {
		setLoadingData(true);
		try {
			const [sitesRes, domainsRes] =
				await Promise.all([
					orderApi.getEmailSites(),
					orderApi.getEmailDomains(),
				]);

			if (
				sitesRes.state === "200" &&
				sitesRes.data
			) {
				setSites(sitesRes.data);
			}
			if (
				domainsRes.state === "200" &&
				domainsRes.data
			) {
				setDomains(domainsRes.data);
			}
		} catch (error) {
			toast.error(
				error.message ||
					"Failed to load email data",
			);
		} finally {
			setLoadingData(false);
		}
	};

	const loadAvailability = async (site) => {
		if (!site) return;

		try {
			const response =
				await orderApi.getEmailQuantity(site);

			if (
				response.state === "200" &&
				response.data
			) {
				// Transform array response to object format
				// Input: [{ domain: "domain1", count: 10, price: 0.5 }, ...]
				// Output: { "domain1": { count: 10, price: 0.5 }, ... }
				const availabilityData = {};
				response.data.forEach((item) => {
					availabilityData[item.domain] = {
						count: item.count,
						price: item.price,
					};
				});

				setAvailability((prev) => ({
					...prev,
					[site]: availabilityData,
				}));
			}
		} catch (error) {
			console.error(
				"Failed to load availability:",
				error,
			);
			toast.error(
				"Failed to load availability for " + site,
			);
		}
	};

	const calculatePrice = useCallback(() => {
		if (formData.site) {
			const siteAvailability =
				availability[formData.site];
			if (siteAvailability) {
				if (
					formData.domain &&
					siteAvailability[formData.domain]
				) {
					// Specific domain selected
					setEstimatedPrice(
						parseFloat(
							siteAvailability[formData.domain]
								.price || 0,
						),
					);
				} else if (siteAvailability["any"]) {
					// No domain selected, use "any domain" price if available
					setEstimatedPrice(
						parseFloat(
							siteAvailability["any"].price || 0,
						),
					);
				} else {
					// No "any domain" price, no ordering without specific domain
					setEstimatedPrice(0);
				}
			} else {
				setEstimatedPrice(0);
			}
		} else {
			setEstimatedPrice(0);
		}
	}, [
		formData.site,
		formData.domain,
		availability,
	]);

	// Effects
	useEffect(() => {
		loadEmailData();
	}, []);

	useEffect(() => {
		if (formData.site) {
			loadAvailability(formData.site);
		}
	}, [formData.site]);

	useEffect(() => {
		calculatePrice();
	}, [calculatePrice]);

	// Fetch all pending email orders on component mount
	useEffect(() => {
		const fetchPendingOrders = async () => {
			if (!user?.apiKey) return;

			try {
				console.log(
					"Fetching all email orders from backend...",
				);
				const response = await orderApi.getAll(
					user.apiKey,
				);
				console.log(
					"All orders response:",
					response,
				);

				if (
					response.state === "200" &&
					response.data
				) {
					// Filter for email orders that are PENDING ONLY
					const pendingEmailOrders = response.data
						.filter(
							(order) =>
								order.email && // Has an email (not phone number)
								!order.number && // Not a phone order
								order.status === "pending", // Only pending orders
						)
						.map((order) => ({
							orderId: order.publicId || order.id, // Use publicId for API calls
							email: order.email,
							site: order.emailSite || order.site || "",
							domain: order.emailDomain || order.domain || "any",
							message: order.message || "",
							status: order.message ? "received" : "pending",
							timestamp:
								order.createdAt ||
								order.timestamp ||
								new Date().toISOString(),
						}));

					console.log(
						"Pending email orders loaded:",
						pendingEmailOrders,
					);
					setActiveOrders(pendingEmailOrders);
				}
			} catch (error) {
				console.error(
					"Error fetching pending email orders:",
					error,
				);
			}
		};

		fetchPendingOrders();
	}, [user?.apiKey]); // Re-fetch if user changes

	const handleCheckEmailMessage = async (orderId) => {
		setCheckingOrderId(orderId);
		try {
			const response = await orderApi.getEmailMessage(orderId);
			
			console.log("Check email message response:", response);

			if (
				response.code === 200 &&
				response.data
			) {
				// Update the order in the array with the received message
				setActiveOrders(prevOrders =>
					prevOrders.map(order =>
						order.orderId === orderId
							? { ...order, message: response.data, status: "received" }
							: order
					)
				);
				console.log("Email message received and order updated:", response.data);
				toast.success("Email message received!");
			} else if (response.code === 202) {
				console.log("No email message yet (202)");
				toast.info(
					"No email message yet. Please wait and try again.",
				);
			} else {
				console.log("Unexpected response:", response);
				toast.warning(
					"Email message not received yet. Keep checking.",
				);
			}
		} catch (error) {
			console.error(
				"Error checking email message:",
				error,
			);
			const errorMsg =
				error?.error ||
				error?.message ||
				"Failed to check email message";
			toast.error(errorMsg);
		} finally {
			setCheckingOrderId(null);
		}
	};

	// const handleRemoveOrder = (orderId) => {
	// 	setActiveOrders((prevOrders) =>
	// 		prevOrders.filter(
	// 			(order) => order.orderId !== orderId,
	// 		),
	// 	);
	// 	toast.success("Order removed from list");
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.site) {
			toast.error("Please select an email site");
			return;
		}

		if (estimatedPrice === 0) {
			toast.error(
				"No pricing available for this site/domain combination. Please contact support.",
			);
			return;
		}

		if (user.balance < estimatedPrice) {
			toast.error(
				"Insufficient balance. Please add funds to your account.",
			);
			return;
		}

		setSubmitting(true);

		try {
			console.log("Ordering email with:", {
				site: formData.site,
				domain:
					formData.domain || "any available",
				price: estimatedPrice,
			});

			// Send domain only if explicitly selected, otherwise don't include it
			// Backend will handle "any available domain" case
			const response = await orderApi.orderEmail(
				formData.site,
				formData.domain || undefined,
			);

			if (
				response.state === "200" &&
				response.data
			) {
				// Add new order to the active orders array
				const newOrder = {
					orderId: response.data.publicId || response.data.orderId || "", // Use publicId for API calls
					email: response.data.email || "",
					site: formData.site,
					domain: formData.domain || "any",
					message: "",
					status: "pending", // 'pending', 'received'
					timestamp: new Date().toISOString(),
				};

				// Add to beginning only if it doesn't already exist
				setActiveOrders((prevOrders) => {
					const exists = prevOrders.some(
						(o) => o.orderId === newOrder.orderId,
					);
					if (exists) {
						console.log(
							"Order already exists, not adding duplicate",
						);
						return prevOrders;
					}
					return [newOrder, ...prevOrders];
				});
				updateUserBalance(
					user.balance - estimatedPrice,
				);
				loadEmailData(); // Refresh availability
				toast.success(
					"Email ordered successfully!",
				);

				// Optionally reset the form for next order
				// setFormData({
				// 	site: "",
				// 	domain: "",
				// });
			} else {
				throw new Error(
					response.error ||
						response.msg ||
						"Failed to order email",
				);
			}
		} catch (error) {
			const errorMsg =
				error?.error ||
				error?.message ||
				"Failed to order email";
			toast.error(errorMsg);
		} finally {
			setSubmitting(false);
		}
	};

	const getAvailableCount = () => {
		if (formData.site) {
			const siteAvailability =
				availability[formData.site];
			if (siteAvailability) {
				if (
					formData.domain &&
					siteAvailability[formData.domain]
				) {
					return (
						siteAvailability[formData.domain]
							.count || 0
					);
				} else {
					// Sum all counts for this site
					return Object.values(
						siteAvailability,
					).reduce(
						(sum, item) =>
							sum + (item.count || 0),
						0,
					);
				}
			}
		}
		return 0;
	};

	if (loading || loadingData) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	const availableCount = getAvailableCount();
	// const selectedSite = sites.find(
	// 	(s) => s.name === formData.site,
	// );

	return (
		<>
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Form */}
				<Card className="glass-card border-primary/10 lg:col-span-2">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Mail className="h-5 w-5 text-primary" />
							<CardTitle>
								Email Order Details
							</CardTitle>
						</div>
						<CardDescription>
							Select email site and optional
							domain to get your email
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Site Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="site"
									className="flex items-center gap-2"
								>
									<Server className="h-4 w-4" />
									Email Site *
								</Label>
								<Select
									value={formData.site}
									onValueChange={(value) =>
										setFormData({
											...formData,
											site: value,
											domain: "",
										})
									}
								>
									<SelectTrigger id="site">
										<SelectValue placeholder="Select email site" />
									</SelectTrigger>
									<SelectContent>
										{sites.map((site) => (
											<SelectItem
												key={site.id}
												value={site.name}
											>
												{site.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Domain Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="domain"
									className="flex items-center gap-2"
								>
									<Globe2 className="h-4 w-4" />
									Domain (Optional)
								</Label>
								<Select
									value={
										formData.domain || undefined
									}
									onValueChange={(value) =>
										setFormData({
											...formData,
											domain: value,
										})
									}
									disabled={!formData.site}
								>
									<SelectTrigger id="domain">
										<SelectValue placeholder="Any available domain" />
									</SelectTrigger>
									<SelectContent>
										{domains
											.filter(
												(domain) =>
													domain.name !== "any",
											)
											.map((domain) => (
												<SelectItem
													key={domain.id}
													value={domain.name}
												>
													{domain.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								{formData.site &&
								availability[formData.site] &&
								!availability[formData.site][
									"any"
								] ? (
									<p className="text-xs text-orange-600">
										⚠️ You must select a specific
										domain for this site
									</p>
								) : (
									<p className="text-xs text-muted-foreground">
										Leave empty to automatically
										assign any available domain
									</p>
								)}
							</div>

							{/* Availability Info */}
							{formData.site && (
								<div className="p-4 bg-muted rounded-lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`h-2 w-2 rounded-full ${
													availableCount > 10
														? "bg-green-500"
														: availableCount > 0
														? "bg-yellow-500"
														: "bg-red-500"
												}`}
											/>
											<span className="text-sm font-medium">
												Available:{" "}
												{availableCount} emails
											</span>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												if (formData.site) {
													loadAvailability(
														formData.site,
													);
												}
											}}
										>
											<RefreshCw className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}

							{/* Balance Warning */}
							{user.balance < estimatedPrice &&
								estimatedPrice > 0 && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											Insufficient balance! You
											need{" "}
											{estimatedPrice.toFixed(2)} USDT{" "}
											but have{" "}
											{user.balance.toFixed(2)} USDT
										</AlertDescription>
									</Alert>
								)}

							{/* Low Availability Warning */}
							{formData.site &&
								availableCount === 0 && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											No emails currently
											available for this
											selection. Please try again
											later or choose a different
											site/domain.
										</AlertDescription>
									</Alert>
								)}

							<Button
								type="submit"
								className="w-full h-12 text-base font-semibold"
								disabled={
									submitting ||
									user.balance < estimatedPrice ||
									availableCount === 0
								}
							>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Mail className="mr-2 h-5 w-5" />
										Get Email
										{/* {estimatedPrice.toFixed(2)} */}
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Summary */}
				<div className="space-y-4">
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<CardTitle className="text-lg">
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Your Balance:
									</span>
									<span className="font-semibold text-green-600">
										{user?.balance?.toFixed(2) ||
											"0.00"}{" "}
										USDT
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Active Orders:
									</span>
									<span className="font-semibold text-blue-600">
										{activeOrders.length}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-xs">
							After ordering, you'll have access
							to the email. Check "My Orders" to
							view incoming messages. The email
							remains active for the duration
							specified in your order.
						</AlertDescription>
					</Alert>
				</div>
			</div>

			{/* Active Orders Section - Always show */}
			<div className="mt-6">
				<Card className="glass-card border-primary/10">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									<Mail className="h-5 w-5" />
									Active Email Orders (
									{activeOrders.length})
								</CardTitle>
								<CardDescription>
									{activeOrders.length > 0
										? "Your active email addresses"
										: "No active email orders yet. Order an email above to get started!"}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{activeOrders.length > 0 ? (
							<div className="space-y-4">
								{activeOrders.map((order) => (
									<Card
										key={order.orderId}
										className="border-2"
									>
										<CardContent className="p-4">
											<div className="space-y-4">
												{/* Order Header */}
												<div className="flex items-start justify-between">
													<div className="space-y-1 flex-1">
														<div className="flex items-center gap-2 flex-wrap">
															<code className="text-xl font-bold font-mono text-green-700 dark:text-green-400 break-all">
																{order.email}
															</code>
															<CopyButton
																text={order.email}
															/>
														</div>
														<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
															<span className="flex items-center gap-1">
																<Server className="h-3 w-3" />
																{order.site}
															</span>
															<span className="flex items-center gap-1">
																<Globe2 className="h-3 w-3" />
																{order.domain}
															</span>
															<span>
																Order:{" "}
																{order.orderId}
															</span>
														</div>
												</div>
												{order.status === "received" && (
													<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
												)}
											</div>

											{/* Message Display */}
											{order.message && order.message !== "" ? (
												<div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
													<div className="flex items-center gap-2 mb-2">
														<CheckCircle className="h-4 w-4 text-green-600" />
														<p className="font-semibold text-sm text-green-700 dark:text-green-400">
															Email Message Received!
														</p>
													</div>
													<div className="p-3 bg-white dark:bg-gray-900 rounded border">
														<p className="text-sm font-mono break-all">
															{order.message}
														</p>
													</div>
													<div className="flex items-center justify-end gap-2 mt-2">
														<CopyButton text={order.message} />
													</div>
												</div>
											) : (
												<div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 dark:border-yellow-800">
													<p className="text-xs text-yellow-800 dark:text-yellow-200">
														⏳ Waiting for email message... Click "Check Message" to check for incoming emails.
													</p>
												</div>
											)}

											{/* Action Buttons */}
											<div className="flex gap-2">
												<Button
													onClick={() => handleCheckEmailMessage(order.orderId)}
													disabled={
														checkingOrderId === order.orderId ||
														order.status === "received"
													}
													className="flex-1"
													size="sm"
												>
													{checkingOrderId === order.orderId ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Checking...
														</>
													) : order.status === "received" ? (
														<>
															<CheckCircle className="mr-2 h-4 w-4" />
															Received
														</>
													) : (
														<>
															<RefreshCw className="mr-2 h-4 w-4" />
															Check Message
														</>
													)}
												</Button>
												{/* <Button
													onClick={() =>
														handleRemoveOrder(
															order.orderId,
														)
													}
													variant="outline"
													size="sm"
												>
													Remove
												</Button> */}
											</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<p>No active email orders yet.</p>
								<p className="text-sm mt-2">
									Order an email above to get started!
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
