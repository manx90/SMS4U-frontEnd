import {
	useState,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { Link } from "react-router-dom";
import {
	orderApi,
	provider3Api,
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
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
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

function focusElementById(id) {
	requestAnimationFrame(() => {
		document.getElementById(id)?.focus();
	});
}

/** Country option value + get-number `country` param: code only (never id or name). */
function countryCodeKey(country) {
	if (!country) return "";
	const raw =
		country.code_country ?? country.code;
	if (raw == null || String(raw).trim() === "")
		return "";
	return String(raw).trim().toLowerCase();
}

function countryCodeForApi(country) {
	if (!country) return "";
	const raw =
		country.code_country ?? country.code;
	return String(raw ?? "").trim();
}

export default function Provider3Tab({
	user,
	loading,
	updateUserBalance,
}) {
	const [open, setOpen] = useState(false);
	const [serviceOpen, setServiceOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [activeOrders, setActiveOrders] = useState([]);
	const [checkingOrderId, setCheckingOrderId] =
		useState(null);
	const [formData, setFormData] = useState({
		countryId: "",
		serviceId: "",
		server: "",
	});
	const [p3Rows, setP3Rows] = useState([]);
	const [pricingLoading, setPricingLoading] =
		useState(false);
	const shouldFocusServerRef = useRef(false);
	const [p3Countries, setP3Countries] = useState([]);
	const [catalogLoading, setCatalogLoading] =
		useState(true);

	const serviceDisplayNameByKey = useMemo(() => {
		const m = {};
		p3Rows.forEach((r) => {
			const k = String(r.serviceCode || "")
				.toLowerCase()
				.trim();
			if (k) {
				m[k] =
					r.serviceName || r.serviceCode || k;
			}
		});
		return m;
	}, [p3Rows]);

	const pricingByServiceKey = useMemo(() => {
		const m = {};
		p3Rows.forEach((r) => {
			const k = String(r.serviceCode || "")
				.toLowerCase()
				.trim();
			if (k)
				m[k] = {
					price: parseFloat(r.price) || 0,
					serviceCode: r.serviceCode,
					serviceName: r.serviceName,
					operatorCount:
						typeof r.operatorCount === "number"
							? r.operatorCount
							: 0,
				};
		});
		return m;
	}, [p3Rows]);

	const operatorOptions = useMemo(() => {
		const sk = formData.serviceId?.toLowerCase();
		if (!sk) return [];
		const cfg = pricingByServiceKey[sk];
		const n = Math.max(
			0,
			cfg?.operatorCount ?? 0,
		);
		return Array.from({ length: n }, (_, i) => ({
			label: `Server ${i + 1}`,
			index: i + 1,
		}));
	}, [formData.serviceId, pricingByServiceKey]);

	const availableServices = useMemo(() => {
		return Object.keys(pricingByServiceKey).sort();
	}, [pricingByServiceKey]);

	const selectedPriceConfig = useMemo(() => {
		const sk = formData.serviceId?.toLowerCase();
		if (!sk) return null;
		return pricingByServiceKey[sk] || null;
	}, [formData.serviceId, pricingByServiceKey]);

	const estimatedPrice = selectedPriceConfig?.price ?? 0;

	const catalogCountriesWithCode = useMemo(
		() =>
			p3Countries.filter(
				(c) => countryCodeKey(c) !== "",
			),
		[p3Countries],
	);

	useEffect(() => {
		let cancelled = false;
		async function loadCatalog() {
			setCatalogLoading(true);
			try {
				const res =
					await provider3Api.getCatalogCountries();
				if (cancelled) return;
				if (
					res?.state === "200" &&
					Array.isArray(res.data)
				) {
					setP3Countries(res.data);
				} else {
					setP3Countries([]);
				}
			} catch {
				if (!cancelled) setP3Countries([]);
			} finally {
				if (!cancelled) setCatalogLoading(false);
			}
		}
		loadCatalog();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			if (!formData.countryId) {
				setP3Rows([]);
				return;
			}
			const countryRow = p3Countries.find(
				(c) =>
					countryCodeKey(c) === formData.countryId,
			);
			const countryDbId = countryRow?.id;
			if (countryDbId == null) {
				setP3Rows([]);
				return;
			}
			setPricingLoading(true);
			try {
				const res =
					await provider3Api.getPricingByCountry(
						countryDbId,
					);
				if (cancelled) return;
				if (
					res.state === "200" &&
					Array.isArray(res.data)
				) {
					setP3Rows(res.data);
					if (import.meta.env.DEV) {
						console.log(
							"[P3 UI] pricing-by-country (API response — server logs are in the Node terminal, not here)",
							{
								countryDbId,
								country: countryRow?.name,
								rows: res.data.map(
									(r) => ({
										serviceCode:
											r.serviceCode,
										operatorCount:
											r.operatorCount,
										price: r.price,
									}),
								),
							},
						);
					}
				} else {
					setP3Rows([]);
				}
			} catch (e) {
				if (import.meta.env.DEV) {
					console.warn(
						"[P3 UI] pricing-by-country error",
						e,
					);
				}
				if (!cancelled) setP3Rows([]);
			} finally {
				if (!cancelled) setPricingLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [formData.countryId, p3Countries]);

	useEffect(() => {
		if (!shouldFocusServerRef.current) return;
		if (pricingLoading || operatorOptions.length === 0)
			return;
		shouldFocusServerRef.current = false;
		focusElementById("p3-server-select");
	}, [pricingLoading, operatorOptions.length]);

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
							order.status === "pending" &&
							String(order.provider) === "3",
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
							(typeof order.p3Country === "object" &&
								order.p3Country?.name) ||
							(typeof order.country === "object"
								? order.country?.name || ""
								: order.country || ""),
						service:
							(typeof order.p3Service === "object" &&
								order.p3Service?.name) ||
							(typeof order.service === "object"
								? order.service?.name || ""
								: order.service || ""),
						provider: "3",
						timestamp:
							order.createdAt ||
							order.timestamp ||
							new Date().toISOString(),
					}));
				setActiveOrders(pendingPhoneOrders);
			} catch (error) {
				console.error(error);
			}
		};
		fetchPendingOrders();
	}, [user?.apiKey]);

	const handleCheckMessage = async (orderId) => {
		setCheckingOrderId(orderId);
		try {
			const response =
				await provider3Api.getProvider3Message(
					orderId,
				);
			if (
				response.code === 200 &&
				response.data
			) {
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
			const errorMsg =
				error?.error ||
				error?.message ||
				"Failed to check message";
			toast.error(errorMsg);
		} finally {
			setCheckingOrderId(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.countryId || !formData.serviceId) {
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
			!formData.server ||
			String(formData.server).trim() === ""
		) {
			toast.error("Please select a server");
			return;
		}
		setSubmitting(true);
		try {
			const cfg =
				pricingByServiceKey[
					formData.serviceId.toLowerCase()
				];
			if (!cfg?.serviceCode) {
				toast.error("Pricing not found");
				setSubmitting(false);
				return;
			}
			const countryMeta = p3Countries.find(
				(c) =>
					countryCodeKey(c) === formData.countryId,
			);
			const countryParam = String(
				countryMeta?.code ??
					countryMeta?.code_country ??
					"",
			);
			if (!countryParam.trim()) {
				toast.error("Invalid country");
				setSubmitting(false);
				return;
			}
			const response =
				await provider3Api.getProvider3Number(
					countryParam,
					String(cfg.serviceCode),
					{ server: formData.server },
				);
			if (
				response.state === "200" &&
				response.data
			) {
				const serverLabel =
					operatorOptions.find(
						(o) =>
							String(o.index) ===
							String(formData.server),
					)?.label || `Server ${formData.server}`;
				const newOrder = {
					orderId:
						response.data.publicId ||
						response.data.orderId ||
						"",
					number:
						response.data.number || response.data,
					message: "",
					status: "pending",
					country: countryMeta?.name || "",
					service:
						serviceDisplayNameByKey[
							formData.serviceId
						] || formData.serviceId,
					provider: "3",
					operatorSlotLabel: serverLabel,
					timestamp: new Date().toISOString(),
				};
				setActiveOrders((prev) => {
					const exists = prev.some(
						(o) => o.orderId === newOrder.orderId,
					);
					if (exists) return prev;
					return [newOrder, ...prev];
				});
				updateUserBalance(
					user.balance - estimatedPrice,
				);
				toast.success(
					"Number ordered successfully! You can now check for messages.",
				);
			} else {
				toast.error(
					response.error ||
						response.msg ||
						"Failed to get number",
				);
			}
		} catch (error) {
			toast.error(
				error?.error ||
					error?.message ||
					"Failed to get number",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const selectedCountry = p3Countries.find(
		(c) => countryCodeKey(c) === formData.countryId,
	);

	return (
		<>
			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="glass-card border-primary/10 lg:col-span-2">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Phone className="h-5 w-5 text-primary" />
							<CardTitle>
								Provider 3 — Order Number
							</CardTitle>
						</div>
						<CardDescription>
							Select country, service, and server
						</CardDescription>
					</CardHeader>
					<CardContent>
						{!catalogLoading &&
							p3Countries.length === 0 && (
								<Alert
									variant="destructive"
									className="mb-4"
								>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										No Provider 3 catalog yet. An
										admin must add at least one
										country+service+price in{" "}
										<strong>
											Provider 3 configuration
										</strong>
										. The country list here only
										shows countries that appear in
										that config (not all system
										countries).
									</AlertDescription>
								</Alert>
							)}
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Globe className="h-4 w-4" />
									Country *
								</Label>
								<Popover
									open={open}
									onOpenChange={setOpen}
								>
									<PopoverTrigger asChild>
										<Button
											type="button"
											variant="outline"
											role="combobox"
											className="w-full justify-between"
											disabled={
												loading ||
												catalogLoading
											}
										>
											{catalogLoading ||
											loading ? (
												<span className="flex items-center gap-2 text-muted-foreground">
													<Loader2 className="h-4 w-4 animate-spin" />
													Loading…
												</span>
											) : formData.countryId ? (
												selectedCountry?.name
											) : (
												"Select a country..."
											)}
											<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-[var(--radix-popover-trigger-width)] p-0"
										align="start"
									>
										<Command>
											<CommandInput placeholder="Search country..." />
											<CommandList>
												<CommandEmpty>
													No country found.
												</CommandEmpty>
												<CommandGroup>
													{catalogCountriesWithCode.map(
														(country) => {
															const cKey =
																countryCodeKey(
																	country,
																);
															return (
																<CommandItem
																	key={
																		country.id ??
																		cKey
																	}
																	value={
																		cKey
																	}
																	keywords={[
																		country.name ||
																			"",
																		countryCodeForApi(
																			country,
																		),
																	]}
																	onSelect={(
																		currentValue,
																	) => {
																		const next =
																			currentValue ===
																			formData.countryId
																				? ""
																				: currentValue;
																		setFormData(
																			{
																				countryId:
																					next,
																				serviceId:
																					"",
																				server: "",
																			},
																		);
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
																	{
																		country.name
																	}
																</CommandItem>
															);
														},
													)}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Package className="h-4 w-4" />
									Service *
								</Label>
								<Popover
									open={serviceOpen}
									onOpenChange={setServiceOpen}
								>
									<PopoverTrigger asChild>
										<Button
											id="p3-service-combobox"
											type="button"
											variant="outline"
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
													Loading…
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
											<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-[var(--radix-popover-trigger-width)] p-0"
										align="start"
									>
										<Command>
											<CommandInput placeholder="Search service..." />
											<CommandList>
												<CommandEmpty>
													No services
												</CommandEmpty>
												<CommandGroup>
													{availableServices.map(
														(sk) => (
															<CommandItem
																key={sk}
																value={sk}
																onSelect={(
																	v,
																) => {
																	const next =
																		v ===
																		formData.serviceId
																			? ""
																			: v;
																	setFormData(
																		{
																			...formData,
																			serviceId:
																				next,
																			server: "",
																		},
																	);
																	setServiceOpen(
																		false,
																	);
																	if (next) {
																		shouldFocusServerRef.current =
																			true;
																	}
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		formData.serviceId ===
																			sk
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
																{serviceDisplayNameByKey[
																	sk
																] || sk}
															</CommandItem>
														),
													)}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							<div className="space-y-2">
								<Label htmlFor="p3-server-select">
									Server *
								</Label>
								{pricingLoading &&
								formData.countryId &&
								formData.serviceId ? (
									<p className="text-sm text-muted-foreground flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Loading…
									</p>
								) : (
									<Select
										value={
											formData.server ||
											undefined
										}
										onValueChange={(v) => {
											setFormData({
												...formData,
												server: v,
											});
										}}
										disabled={
											operatorOptions.length ===
											0
										}
									>
										<SelectTrigger id="p3-server-select">
											<SelectValue placeholder="Select server" />
										</SelectTrigger>
										<SelectContent>
											{operatorOptions.map(
												(row) => (
													<SelectItem
														key={`srv-${row.index}`}
														value={String(
															row.index,
														)}
													>
														{row.label ||
															`Server ${row.index}`}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								)}
								{formData.countryId &&
									formData.serviceId &&
									!loading &&
									!pricingLoading && (
										<p className="text-xs text-muted-foreground">
											{operatorOptions.length > 0
												? `${operatorOptions.length} server slot${operatorOptions.length === 1 ? "" : "s"} available for this country and service.`
												: "No operator slots for this country and service — try another selection."}
										</p>
									)}
							</div>

							{user.balance < estimatedPrice &&
								estimatedPrice > 0 && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											Insufficient balance
										</AlertDescription>
									</Alert>
								)}

							<Button
								type="submit"
								className="w-full h-12"
								disabled={
									submitting ||
									pricingLoading ||
									catalogLoading ||
									p3Countries.length === 0 ||
									user.balance <
										estimatedPrice ||
									!formData.server
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

				<div className="space-y-4">
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<CardTitle className="text-lg">
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									Balance
								</span>
								<span className="font-semibold text-green-600">
									{user?.balance?.toFixed(2) ||
										"0.00"}{" "}
									USDT
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									Estimated
								</span>
								<span>
									{estimatedPrice.toFixed(2)} USDT
								</span>
							</div>
						</CardContent>
					</Card>
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-xs">
							After ordering, you have limited time to
							receive an SMS per server policy.
						</AlertDescription>
					</Alert>
				</div>
			</div>

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
																Provider 3
																{order.operatorSlotLabel
																	? ` · ${order.operatorSlotLabel}`
																	: ""}
															</span>
															<span>
																Order:{" "}
																{
																	order.orderId
																}
															</span>
														</div>
													</div>
													{order.status ===
														"received" && (
														<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
													)}
												</div>

												{order.message &&
												order.message !==
													"" ? (
													<div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
														<div className="flex items-center gap-2 mb-2">
															<CheckCircle className="h-4 w-4 text-green-600" />
															<p className="font-semibold text-sm text-green-700 dark:text-green-400">
																Message
																Received!
															</p>
														</div>
														<div className="p-3 bg-white dark:bg-gray-900 rounded border">
															<p className="text-sm font-mono break-all">
																{
																	order.message
																}
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
															&quot;Check
															Message&quot; to
															check for incoming
															SMS.
														</p>
													</div>
												)}

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
