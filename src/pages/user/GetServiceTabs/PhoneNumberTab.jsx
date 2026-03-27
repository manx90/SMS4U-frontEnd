import {
	useState,
	useEffect,
	useMemo,
} from "react";
import { Link } from "react-router-dom";
import {
	orderApi,
	serviceApi,
	pricingApi,
} from "../../../services/api";
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
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui/radio-group";
import {
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "../../../components/shared/CopyButton";
import {
	Phone,
	CheckCircle,
	AlertCircle,
	Loader2,
	Globe,
	Package,
	RefreshCw,
	Check,
	ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/** Prefer API codes so pricing matches countries/services even if names differ. */
function countryKeyFromEntry(entry) {
	const c =
		entry?.country?.code ?? entry?.country?.code_country;
	if (c != null && String(c).trim() !== "")
		return String(c).trim().toLowerCase();
	return String(entry?.country?.name || "")
		.toLowerCase()
		.trim();
}

function serviceKeyFromEntry(entry) {
	const c = entry?.service?.code;
	if (c != null && String(c).trim() !== "")
		return String(c).trim().toLowerCase();
	return String(entry?.service?.name || "")
		.toLowerCase()
		.trim();
}

/** Key used in the form for the selected country row. */
function countryFormKey(country) {
	if (!country) return "";
	const c = country.code ?? country.code_country;
	if (c != null && String(c).trim() !== "")
		return String(c).trim().toLowerCase();
	return String(country.name || "")
		.toLowerCase()
		.trim();
}

export default function PhoneNumberTab({
	user,
	countries,
	loading,
	updateUserBalance,
}) {
	const [open, setOpen] = useState(false);
	const [serviceOpen, setServiceOpen] = useState(false);
	const [submitting, setSubmitting] =
		useState(false);
	const [activeOrders, setActiveOrders] =
		useState([]); // Array of orders: {orderId, number, message, status, country, service, provider, timestamp}
	const [checkingOrderId, setCheckingOrderId] =
		useState(null); // Track which order is currently being checked
	const [formData, setFormData] = useState({
		countryId: "",
		serviceId: "",
		provider: "1",
		operator: "",
	});
	const [estimatedPrice, setEstimatedPrice] =
		useState(0);
	const [operatorOptions, setOperatorOptions] =
		useState([]);
	const [loadingOperators, setLoadingOperators] =
		useState(false);
	const [countryPricing, setCountryPricing] =
		useState([]);
	const [pricingLoading, setPricingLoading] =
		useState(false);

	// Load pricing for the selected country only (GET /pricing/country/:id)
	useEffect(() => {
		let cancelled = false;

		async function loadCountryPricing() {
			if (!formData.countryId) {
				setCountryPricing([]);
				setPricingLoading(false);
				return;
			}

			const countryRow = countries.find(
				(c) =>
					countryFormKey(c) === formData.countryId,
			);
			const countryDbId = countryRow?.id;
			if (countryDbId == null) {
				setCountryPricing([]);
				setPricingLoading(false);
				return;
			}

			setPricingLoading(true);
			try {
				const res = await pricingApi.getByCountry(
					countryDbId,
				);
				if (cancelled) return;
				if (
					res.state === "200" &&
					Array.isArray(res.data)
				) {
					setCountryPricing(res.data);
				} else {
					setCountryPricing([]);
				}
			} catch {
				if (!cancelled) setCountryPricing([]);
			} finally {
				if (!cancelled) setPricingLoading(false);
			}
		}

		loadCountryPricing();
		return () => {
			cancelled = true;
		};
	}, [formData.countryId, countries]);

	const {
		serviceOptionsByCountryProvider,
		pricingByCountryService,
		serviceDisplayNameByKey,
		countryDisplayNameByKey,
	} = useMemo(() => {
		const countryProviderMap = {};
		const priceMap = {};
		const serviceDisplayNameByKey = {};
		const countryDisplayNameByKey = {};

		countryPricing.forEach((entry) => {
			const countryKey = countryKeyFromEntry(entry);
			const serviceKey = serviceKeyFromEntry(entry);

			if (!countryKey || !serviceKey) return;

			const countryLabel =
				entry.country?.name || countryKey;
			const serviceLabel =
				entry.service?.name || serviceKey;

			countryDisplayNameByKey[countryKey] =
				countryLabel;
			serviceDisplayNameByKey[serviceKey] =
				serviceLabel;

			// Parse provider prices with proper null/empty string handling
			const provider1Price =
				entry.provider1 != null &&
				entry.provider1 !== "" &&
				!isNaN(parseFloat(entry.provider1))
					? parseFloat(entry.provider1)
					: 0;
			const provider2Price =
				entry.provider2 != null &&
				entry.provider2 !== "" &&
				!isNaN(parseFloat(entry.provider2))
					? parseFloat(entry.provider2)
					: 0;
			const provider3Price =
				entry.provider3 != null &&
				entry.provider3 !== "" &&
				!isNaN(parseFloat(entry.provider3))
					? parseFloat(entry.provider3)
					: 0;

			priceMap[`${countryKey}::${serviceKey}`] = {
				provider1: provider1Price,
				provider2: provider2Price,
				provider3: provider3Price,
				countryCode: entry.country?.code,
				serviceCode: entry.service?.code,
			};

			if (!countryProviderMap[countryKey]) {
				countryProviderMap[countryKey] = {
					"1": new Set(),
					"2": new Set(),
					"3": new Set(),
				};
			}

			if (provider1Price > 0) {
				countryProviderMap[countryKey]["1"].add(
					serviceKey,
				);
			}

			if (provider2Price > 0) {
				countryProviderMap[countryKey]["2"].add(
					serviceKey,
				);
			}

			if (provider3Price > 0) {
				countryProviderMap[countryKey]["3"].add(
					serviceKey,
				);
			}
		});

		return {
			serviceOptionsByCountryProvider: countryProviderMap,
			pricingByCountryService: priceMap,
			serviceDisplayNameByKey,
			countryDisplayNameByKey,
		};
	}, [countryPricing]);

	const availableServices = useMemo(() => {
		const countryKey = formData.countryId?.toLowerCase()?.trim();
		if (!countryKey) return [];

		const providerSet =
			serviceOptionsByCountryProvider[countryKey]?.[
			formData.provider
			];

		return providerSet
			? Array.from(providerSet).sort()
			: [];
	}, [
		formData.countryId,
		formData.provider,
		serviceOptionsByCountryProvider,
	]);

	const selectedPriceConfig = useMemo(() => {
		const countryKey = formData.countryId?.toLowerCase();
		const serviceKey = formData.serviceId?.toLowerCase();

		if (!countryKey || !serviceKey) return null;

		return (
			pricingByCountryService[`${countryKey}::${serviceKey}`] ||
			null
		);
	}, [
		formData.countryId,
		formData.serviceId,
		pricingByCountryService,
	]);

	useEffect(() => {
		if (!selectedPriceConfig) {
			setEstimatedPrice(0);
			return;
		}

		const providerKey = `provider${formData.provider}`;
		setEstimatedPrice(
			selectedPriceConfig[providerKey] || 0,
		);
	}, [selectedPriceConfig, formData.provider]);

	useEffect(() => {
		let cancelled = false;

		async function loadOperators() {
			if (
				formData.provider !== "3" ||
				!formData.countryId ||
				!formData.serviceId
			) {
				setOperatorOptions([]);
				return;
			}

			const countryKey =
				formData.countryId?.toLowerCase()?.trim();
			const serviceKey =
				formData.serviceId?.toLowerCase()?.trim();
			const pricingEntry =
				countryKey && serviceKey
					? pricingByCountryService[
					`${countryKey}::${serviceKey}`
					]
					: null;

			if (
				!pricingEntry?.serviceCode ||
				!pricingEntry?.provider3 ||
				pricingEntry.provider3 <= 0
			) {
				setOperatorOptions([]);
				return;
			}

			const countryMeta = countries.find(
				(c) =>
					countryFormKey(c) === formData.countryId,
			);
			const countryParam =
				countryMeta?.code ??
				countryMeta?.code_country ??
				"";

			if (!String(countryParam).trim()) {
				setOperatorOptions([]);
				return;
			}

			setLoadingOperators(true);
			try {
				const res =
					await serviceApi.getProvider3Operators(
						String(pricingEntry.serviceCode),
						String(countryParam).trim(),
					);
				if (cancelled) return;
				if (
					res.state === "200" &&
					Array.isArray(res.data)
				) {
					setOperatorOptions(res.data);
				} else {
					setOperatorOptions([]);
				}
			} catch (e) {
				console.error(
					"Load provider 3 operators:",
					e,
				);
				if (!cancelled) setOperatorOptions([]);
			} finally {
				if (!cancelled) setLoadingOperators(false);
			}
		}

		loadOperators();
		return () => {
			cancelled = true;
		};
	}, [
		formData.provider,
		formData.countryId,
		formData.serviceId,
		pricingByCountryService,
		countries,
	]);

	// Fetch all pending orders on component mount
	useEffect(() => {
		const fetchPendingOrders = async () => {
			if (!user?.apiKey) return;

			try {
				const response = await orderApi.getAll(
					user.apiKey,
				);

				if (
					response.state !== "200" ||
					!Array.isArray(response.data)
				) {
					return;
				}

				const pendingPhoneOrders = response.data
					.filter(
						(order) =>
							order.number &&
							!order.email &&
							order.status === "pending",
					)
					.map((order) => ({
						orderId:
							order.publicId || order.id || "",
						number: order.number || "",
						message: order.message || "",
						status: order.message
							? "received"
							: "pending",
						country:
							typeof order.country === "object"
								? order.country?.name || ""
								: order.country || "",
						service:
							typeof order.service === "object"
								? order.service?.name || ""
								: order.service || "",
						provider: String(order.provider || "1"),
						operator: order.operator
							? String(order.operator).trim()
							: undefined,
						timestamp:
							order.createdAt ||
							order.timestamp ||
							new Date().toISOString(),
					}));

				setActiveOrders(pendingPhoneOrders);
			} catch (error) {
				console.error(
					"Error fetching pending orders:",
					error,
				);
			}
		};

		fetchPendingOrders();
	}, [user?.apiKey]); // Re-fetch if user changes

	const handleCheckMessage = async (orderId) => {
		setCheckingOrderId(orderId);
		try {
			const response = await orderApi.getMessage(
				orderId,
			);

			if (
				response.code === 200 &&
				response.data
			) {
				// Update the order in the array with the received message
				setActiveOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.orderId === orderId
							? {
								...order,
								message: response.data,
								status: "received",
							}
							: order,
					),
				);
				toast.success("Message received!");
			} else if (response.code === 202) {
				toast.info(
					"No message yet. Please wait and try again.",
				);
			} else {
				toast.warning(
					"Message not received yet. Keep checking.",
				);
			}
		} catch (error) {
			console.error(
				"Error checking message:",
				error,
			);
			const errorMsg =
				error?.error ||
				error?.message ||
				"Failed to check message";
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

		if (
			!formData.countryId ||
			!formData.serviceId
		) {
			toast.error(
				"Please select both country and service",
			);
			return;
		}

		if (user.balance < estimatedPrice) {
			toast.error(
				"Insufficient balance. Please add funds to your account.",
			);
			return;
		}

		if (
			formData.provider === "3" &&
			(!formData.operator ||
				String(formData.operator).trim() === "")
		) {
			toast.error(
				"Please select an operator for Provider 3",
			);
			return;
		}

		setSubmitting(true);

		try {
			const countryKey = formData.countryId?.toLowerCase();
			const serviceKey = formData.serviceId?.toLowerCase();
			const pricingEntry =
				countryKey && serviceKey
					? pricingByCountryService[`${countryKey}::${serviceKey}`]
					: null;

			if (!pricingEntry) {
				toast.error(
					"Pricing information not found for this combination",
				);
				setSubmitting(false);
				return;
			}

			const { countryCode, serviceCode } = pricingEntry;

			if (!countryCode || !serviceCode) {
				toast.error(
					"Country or service code is missing",
				);
				setSubmitting(false);
				return;
			}

			if (!user?.apiKey) {
				toast.error(
					"API key not found. Please log in again.",
				);
				setSubmitting(false);
				return;
			}

			const countryParam = String(countryCode);
			const serviceParam = String(serviceCode);
			const providerParam = String(
				formData.provider,
			);

			const response = await orderApi.getNumber(
				countryParam,
				serviceParam,
				providerParam,
				formData.provider === "3"
					? String(formData.operator).trim()
					: undefined,
			);

			if (
				response.state === "200" &&
				response.data
			) {
				const newOrder = {
					orderId:
						response.data.publicId ||
						response.data.orderId ||
						"",
					number:
						response.data.number || response.data,
					message: "",
					status: "pending",
					country:
						countryDisplayNameByKey[
							formData.countryId
						] || formData.countryId,
					service:
						serviceDisplayNameByKey[
							formData.serviceId
						] || formData.serviceId,
					provider: formData.provider,
					operator:
						formData.provider === "3"
							? String(
								formData.operator,
							).trim()
							: undefined,
					timestamp: new Date().toISOString(),
				};

				setActiveOrders((prevOrders) => {
					const exists = prevOrders.some(
						(o) => o.orderId === newOrder.orderId,
					);
					if (exists) {
						return prevOrders;
					}
					return [newOrder, ...prevOrders];
				});
				updateUserBalance(
					user.balance - estimatedPrice,
				);
				toast.success(
					"Number ordered successfully! You can now check for messages.",
				);
			} else {
				const errorMessage =
					response.error ||
					response.msg ||
					"Failed to get number. Please try again.";
				toast.error(errorMessage);
			}
		} catch (error) {
			console.error("Order error:", error);
			const errorMessage =
				error?.error ||
				error?.message ||
				"Failed to get number. Please try again.";
			toast.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	// if (loading) {
	// 	return (
	// 		<div className="space-y-6">
	// 			<Skeleton className="h-96 w-full" />
	// 		</div>
	// 	);
	// }

	const selectedCountry = countries.find(
		(c) => countryFormKey(c) === formData.countryId,
	);

	// const providerPrices = getProviderPrices();

	return (
		<>
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Order Form - Always Visible */}
				<Card className="glass-card border-primary/10 lg:col-span-2">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Phone className="h-5 w-5 text-primary" />
							<CardTitle>
								Order New Number
							</CardTitle>
						</div>
						<CardDescription>
							Select country, service, and
							provider to get your number
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Order Form */}
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Country Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="country"
									className="flex items-center gap-2"
								>
									<Globe className="h-4 w-4" />
									Country *
								</Label>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between"
											disabled={loading}
										>
											{loading ? (
												<span className="flex items-center gap-2 text-muted-foreground">
													<Loader2 className="h-4 w-4 animate-spin" />
													Loading countries…
												</span>
											) : formData.countryId ? (
												countryDisplayNameByKey[
													formData.countryId
												] || selectedCountry?.name
											) : (
												"Select a country..."
											)}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-[var(--radix-popover-trigger-width)] p-0"
										align="start"
									>
										<Command>
											<CommandInput placeholder="Search country..." className="h-9" />
											<CommandList>
												<CommandEmpty>
													No country found.
												</CommandEmpty>
												<CommandGroup>
													{countries.map((country) => {
														const cKey =
															countryFormKey(
																country,
															);
														return (
															<CommandItem
																key={cKey}
																value={cKey}
																onSelect={(
																	currentValue,
																) => {
																	const nextCountryId =
																		currentValue ===
																			formData.countryId
																			? ""
																			: currentValue;
																	setFormData({
																		...formData,
																		countryId:
																			nextCountryId,
																		serviceId:
																			"",
																		operator:
																			"",
																	});
																	setOpen(
																		false,
																	);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		formData.countryId ===
																			cKey
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
																{country.name}
															</CommandItem>
														);
													})}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							{/* Service Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="service"
									className="flex items-center gap-2"
								>
									<Package className="h-4 w-4" />
									Service *
								</Label>
								<Popover open={serviceOpen} onOpenChange={setServiceOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={serviceOpen}
											className="w-full justify-between"
											disabled={
												!formData.countryId ||
												pricingLoading
											}
										>
											{pricingLoading &&
											formData.countryId ? (
												<span className="flex items-center gap-2 text-muted-foreground">
													<Loader2 className="h-4 w-4 animate-spin" />
													Loading services…
												</span>
											) : formData.serviceId ? (
												serviceDisplayNameByKey[
													formData.serviceId
												] || formData.serviceId
											) : formData.countryId ? (
												"Select a service..."
											) : (
												"Select country first"
											)}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-[var(--radix-popover-trigger-width)] p-0"
										align="start"
									>
										<Command>
											<CommandInput placeholder="Search service..." className="h-9" />
											<CommandList>
												<CommandEmpty>
													{pricingLoading
														? "Loading…"
														: formData.countryId
															? `No services available for this country with Provider ${formData.provider}`
															: "Select a country first"}
												</CommandEmpty>
												<CommandGroup>
													{availableServices.length > 0 ? (
														availableServices.map(
															(serviceKey) => (
																<CommandItem
																	key={
																		serviceKey
																	}
																	value={
																		serviceKey
																	}
																	onSelect={(
																		currentValue,
																	) => {
																		setFormData(
																			{
																				...formData,
																				serviceId:
																					currentValue ===
																						formData.serviceId
																						? ""
																						: currentValue,
																				operator:
																					"",
																			},
																		);
																		setServiceOpen(
																			false,
																		);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			formData.serviceId ===
																				serviceKey
																				? "opacity-100"
																				: "opacity-0",
																		)}
																	/>
																	{serviceDisplayNameByKey[
																		serviceKey
																	] ||
																		serviceKey}
																</CommandItem>
															),
														)
													) : (
														<div className="px-2 py-6 text-center text-sm text-muted-foreground">
															{formData.countryId
																? `No services available for this country with Provider ${formData.provider}`
																: "Select a country first"}
														</div>
													)}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								{formData.countryId &&
									!pricingLoading &&
									availableServices.length ===
									0 && (
										<p className="text-xs text-destructive">
											No services with pricing
											available for selected
											country and Provider{" "}
											{formData.provider}
										</p>
									)}
							</div>

							{/* Provider Selection */}
							<div className="space-y-2">
								<Label>Provider</Label>
								<RadioGroup
									value={formData.provider}
									onValueChange={(value) => {
										const selectedCountryKey =
											formData.countryId;
										const selectedServiceKey =
											formData.serviceId;

										let newServiceId =
											formData.serviceId;

										if (
											selectedCountryKey &&
											selectedServiceKey
										) {
											const providerKey = `provider${value}`;
											const isServiceAvailable =
												countryPricing.some(
													(p) => {
														if (
															countryKeyFromEntry(
																p,
															) !==
																selectedCountryKey ||
															serviceKeyFromEntry(
																p,
															) !==
																selectedServiceKey
														) {
															return false;
														}
														const raw =
															p[
																providerKey
															];
														if (
															raw == null ||
															raw === ""
														) {
															return false;
														}
														const n =
															parseFloat(
																raw,
															);
														return (
															!isNaN(
																n,
															) &&
															n > 0
														);
													},
												);

											if (!isServiceAvailable) {
												newServiceId = "";
											}
										}

										setFormData({
											...formData,
											provider: value,
											serviceId: newServiceId,
											operator: "",
										});
									}}
								>
									<div className="flex items-center justify-between space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
										<div className="flex items-center space-x-2 flex-1">
											<RadioGroupItem
												value="1"
												id="provider1"
											/>
											<Label
												htmlFor="provider1"
												className="flex-1 cursor-pointer"
											>
												Provider 1
											</Label>
										</div>
									</div>
									<div className="flex items-center justify-between space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
										<div className="flex items-center space-x-2 flex-1">
											<RadioGroupItem
												value="2"
												id="provider2"
											/>
											<Label
												htmlFor="provider2"
												className="flex-1 cursor-pointer"
											>
												Provider 2
											</Label>
										</div>
									</div>
									<div className="flex items-center justify-between space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
										<div className="flex items-center space-x-2 flex-1">
											<RadioGroupItem
												value="3"
												id="provider3"
											/>
											<Label
												htmlFor="provider3"
												className="flex-1 cursor-pointer"
											>
												Provider 3
											</Label>
										</div>
									</div>
								</RadioGroup>
							</div>

							{formData.provider === "3" && (
								<div className="space-y-2">
									<Label htmlFor="operator-p3">
										Operator *
									</Label>
									{loadingOperators ? (
										<p className="text-sm text-muted-foreground flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Loading operators…
										</p>
									) : (
										<Select
											value={formData.operator}
											onValueChange={(v) =>
												setFormData({
													...formData,
													operator: v,
												})
											}
											disabled={
												operatorOptions.length ===
												0
											}
										>
											<SelectTrigger id="operator-p3">
												<SelectValue placeholder="Select operator" />
											</SelectTrigger>
											<SelectContent>
												{operatorOptions.map(
													(row, idx) => {
														const r =
															row != null &&
															typeof row ===
																"object"
																? row
																: {
																	operator:
																		row,
																};
														const op =
															r.operator ??
															"";
														const opStr =
															String(
																op,
															).trim();
														if (!opStr)
															return null;
														return (
															<SelectItem
																key={`${opStr}-${idx}`}
																value={
																	opStr
																}
															>
																{opStr}
																{r.ccode
																	? ` · ${r.ccode}`
																	: ""}
																{r.accessCount !=
																	null
																	? ` (${r.accessCount})`
																	: ""}
															</SelectItem>
														);
													},
												)}
											</SelectContent>
										</Select>
									)}
									{!loadingOperators &&
										formData.provider ===
										"3" &&
										operatorOptions.length ===
										0 &&
										formData.countryId &&
										formData.serviceId && (
											<p className="text-xs text-muted-foreground">
												No operators listed for
												this country. An admin must
												run Provider 3 access sync
												for this service, or choose
												another country.
											</p>
										)}
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

							<Button
								type="submit"
								className="w-full h-12 text-base font-semibold"
								disabled={
									submitting ||
									pricingLoading ||
									user.balance < estimatedPrice ||
									loadingOperators ||
									(formData.provider === "3" &&
										(!formData.operator ||
											String(
												formData.operator,
											).trim() === ""))
								}
							>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Phone className="mr-2 h-5 w-5" />
										Get Number
									</>
								)}
							</Button>

							<div className="text-center">
								<Button
									variant="outline"
									className="w-full"
									asChild
								>
									<Link to="/user/account">
										Add Funds
									</Link>
								</Button>
							</div>
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

							{selectedCountry && (
								<div className="pt-4 border-t space-y-2">
									<p className="text-sm font-semibold">
										Selected Country:
									</p>
									<p className="text-sm text-muted-foreground">
										{selectedCountry.name}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-xs">
							After ordering, you'll have 20
							minutes to receive an SMS. If no SMS
							is received within this time, you'll
							be automatically refunded.
						</AlertDescription>
					</Alert>
				</div>
			</div>

			{/* Active Orders Section - Always show for debugging */}
			<div className="mt-6">
				<Card className="glass-card border-primary/10">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									<Phone className="h-5 w-5" />
									Active Orders (
									{activeOrders.length})
								</CardTitle>
								<CardDescription>
									{activeOrders.length > 0
										? "Check messages for your pending numbers"
										: "No active orders yet. Order a number above to get started!"}
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
														<div className="flex items-center gap-2">
															<code className="text-2xl font-bold font-mono text-green-700 dark:text-green-400">
																{order.number}
															</code>
															<CopyButton
																text={
																	order.number
																}
															/>
														</div>
														<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
															<span className="flex items-center gap-1">
																<Globe className="h-3 w-3" />
																{order.country}
															</span>
															<span className="flex items-center gap-1">
																<Package className="h-3 w-3" />
																{order.service}
															</span>
															<span>
																Provider{" "}
																{order.provider}
															</span>
															{order.operator && (
																<span>
																	Operator{" "}
																	{
																		order.operator
																	}
																</span>
															)}
															<span>
																Order:{" "}
																{order.orderId}
															</span>
														</div>
													</div>
													{order.status ===
														"received" && (
															<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
														)}
												</div>

												{/* Message Display */}
												{order.message &&
													order.message !== "" ? (
													<div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
														<div className="flex items-center gap-2 mb-2">
															<CheckCircle className="h-4 w-4 text-green-600" />
															<p className="font-semibold text-sm text-green-700 dark:text-green-400">
																Message Received!
															</p>
														</div>
														<div className="p-3 bg-white dark:bg-gray-900 rounded border">
															<p className="text-sm font-mono break-all">
																{order.message}
															</p>
														</div>
														<div className="flex items-center justify-end gap-2 mt-2">
															<CopyButton
																text={
																	order.message
																}
															/>
														</div>
													</div>
												) : (
													<div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 dark:border-yellow-800">
														<p className="text-xs text-yellow-800 dark:text-yellow-200">
															⏳ Waiting for
															message... Click
															"Check Message" to
															check for incoming
															SMS.
														</p>
													</div>
												)}

												{/* Action Buttons */}
												<div className="flex gap-2">
													<Button
														onClick={() =>
															handleCheckMessage(
																order.orderId,
															)
														}
														disabled={
															checkingOrderId ===
															order.orderId ||
															order.status ===
															"received"
														}
														className="flex-1"
														size="sm"
													>
														{checkingOrderId ===
															order.orderId ? (
															<>
																<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																Checking...
															</>
														) : order.status ===
															"received" ? (
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
								<p>No active orders yet.</p>
								<p className="text-sm mt-2">
									Order a number above to get
									started!
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
