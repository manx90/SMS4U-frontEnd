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

function countryFormKey(country) {
	if (!country) return "";
	const c = country.code ?? country.code_country;
	if (c != null && String(c).trim() !== "")
		return String(c).trim().toLowerCase();
	return String(country.name || "")
		.toLowerCase()
		.trim();
}

export default function Provider3Tab({
	user,
	countries,
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
	const [operatorOptions, setOperatorOptions] =
		useState([]);
	const [loadingOperators, setLoadingOperators] =
		useState(false);
	const [resolvedOperatorName, setResolvedOperatorName] =
		useState("");
	const shouldFocusServerRef = useRef(false);

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
				};
		});
		return m;
	}, [p3Rows]);

	const availableServices = useMemo(() => {
		return Object.keys(pricingByServiceKey).sort();
	}, [pricingByServiceKey]);

	const selectedPriceConfig = useMemo(() => {
		const sk = formData.serviceId?.toLowerCase();
		if (!sk) return null;
		return pricingByServiceKey[sk] || null;
	}, [formData.serviceId, pricingByServiceKey]);

	const estimatedPrice = selectedPriceConfig?.price ?? 0;

	useEffect(() => {
		let cancelled = false;
		async function load() {
			if (!formData.countryId) {
				setP3Rows([]);
				return;
			}
			const countryRow = countries.find(
				(c) =>
					countryFormKey(c) === formData.countryId,
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
				} else {
					setP3Rows([]);
				}
			} catch {
				if (!cancelled) setP3Rows([]);
			} finally {
				if (!cancelled) setPricingLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [formData.countryId, countries]);

	useEffect(() => {
		if (!shouldFocusServerRef.current) return;
		if (loadingOperators || operatorOptions.length === 0)
			return;
		shouldFocusServerRef.current = false;
		focusElementById("p3-server-select");
	}, [loadingOperators, operatorOptions.length]);

	useEffect(() => {
		let cancelled = false;
		async function loadOperatorCount() {
			if (
				!formData.countryId ||
				!formData.serviceId
			) {
				setOperatorOptions([]);
				setResolvedOperatorName("");
				return;
			}
			const cfg =
				pricingByServiceKey[
					formData.serviceId.toLowerCase()
				];
			if (
				!cfg?.serviceCode ||
				!cfg.price ||
				cfg.price <= 0
			) {
				setOperatorOptions([]);
				setResolvedOperatorName("");
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
				setResolvedOperatorName("");
				return;
			}
			setLoadingOperators(true);
			setResolvedOperatorName("");
			try {
				const res =
					await provider3Api.getProvider3OperatorsCount(
						String(cfg.serviceCode),
						String(countryParam).trim(),
					);
				if (cancelled) return;
				const count =
					res?.state === "200" &&
					res?.data != null &&
					typeof res.data.count === "number"
						? res.data.count
						: 0;
				const normalized = Array.from(
					{ length: Math.max(0, count) },
					(_, i) => ({
						label: `Server ${i + 1}`,
						index: i + 1,
					}),
				);
				setOperatorOptions(normalized);
			} catch (e) {
				console.error(e);
				if (!cancelled) setOperatorOptions([]);
			} finally {
				if (!cancelled) setLoadingOperators(false);
			}
		}
		loadOperatorCount();
		return () => {
			cancelled = true;
		};
	}, [
		formData.countryId,
		formData.serviceId,
		pricingByServiceKey,
		countries,
	]);

	useEffect(() => {
		let cancelled = false;
		async function loadOperatorForServer() {
			if (
				!formData.countryId ||
				!formData.serviceId ||
				!formData.server ||
				String(formData.server).trim() === ""
			) {
				setResolvedOperatorName("");
				return;
			}
			const cfg =
				pricingByServiceKey[
					formData.serviceId.toLowerCase()
				];
			if (!cfg?.serviceCode) {
				setResolvedOperatorName("");
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
				setResolvedOperatorName("");
				return;
			}
			setResolvedOperatorName("");
			try {
				const res =
					await provider3Api.getProvider3Operator(
						String(cfg.serviceCode),
						String(countryParam).trim(),
						formData.server,
					);
				if (cancelled) return;
				if (
					res?.state === "200" &&
					res?.data?.operator != null
				) {
					setResolvedOperatorName(
						String(res.data.operator),
					);
				} else {
					setResolvedOperatorName("");
				}
			} catch (e) {
				console.error(e);
				if (!cancelled) setResolvedOperatorName("");
			}
		}
		loadOperatorForServer();
		return () => {
			cancelled = true;
		};
	}, [
		formData.server,
		formData.countryId,
		formData.serviceId,
		pricingByServiceKey,
		countries,
	]);

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
							typeof order.country === "object"
								? order.country?.name || ""
								: order.country || "",
						service:
							typeof order.service === "object"
								? order.service?.name || ""
								: order.service || "",
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
			const response = await orderApi.getMessage(
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
			const countryMeta = countries.find(
				(c) =>
					countryFormKey(c) === formData.countryId,
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
			let operatorLabel = resolvedOperatorName;
			if (
				!operatorLabel &&
				formData.server &&
				String(formData.server).trim() !== ""
			) {
				const opRes =
					await provider3Api.getProvider3Operator(
						String(cfg.serviceCode),
						String(countryParam).trim(),
						formData.server,
					);
				if (
					opRes?.state === "200" &&
					opRes?.data?.operator != null
				) {
					operatorLabel = String(opRes.data.operator);
				}
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
					operatorLabel ||
					operatorOptions.find(
						(o) =>
							String(o.index) ===
							String(formData.server),
					)?.label;
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

	const selectedCountry = countries.find(
		(c) => countryFormKey(c) === formData.countryId,
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
											disabled={loading}
										>
											{loading ? (
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
													{countries.map(
														(country) => {
															const cKey =
																countryFormKey(
																	country,
																);
															return (
																<CommandItem
																	key={
																		cKey
																	}
																	value={
																		cKey
																	}
																	keywords={[
																		country.name ||
																			"",
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
								{loadingOperators ? (
									<p className="text-sm text-muted-foreground flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Loading servers…
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
											if (!v)
												setResolvedOperatorName(
													"",
												);
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
									user.balance <
										estimatedPrice ||
									loadingOperators ||
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
						<CardTitle className="flex items-center gap-2">
							<Phone className="h-5 w-5" />
							Active Provider 3 Orders (
							{activeOrders.length})
						</CardTitle>
						<CardDescription>
							Pending numbers for Provider 3
						</CardDescription>
					</CardHeader>
					<CardContent>
						{activeOrders.length > 0 ? (
							<div className="space-y-4">
								{activeOrders.map((order) => (
									<Card
										key={order.orderId}
										className="border-2"
									>
										<CardContent className="p-4 space-y-4">
											<div className="flex items-start justify-between">
												<div>
													<code className="text-2xl font-bold font-mono text-green-700">
														{order.number}
													</code>
													<CopyButton
														text={order.number}
													/>
													<div className="text-xs text-muted-foreground mt-1">
														{order.country}{" "}
														· {order.service} ·
														Provider 3
														{order.operatorSlotLabel
															? ` · ${order.operatorSlotLabel}`
															: ""}
													</div>
												</div>
												{order.status ===
													"received" && (
													<CheckCircle className="h-5 w-5 text-green-600" />
												)}
											</div>
											{order.message ? (
												<div className="p-3 bg-muted rounded border text-sm font-mono break-all">
													{order.message}
												</div>
											) : (
												<p className="text-xs text-muted-foreground">
													Waiting for SMS…
												</p>
											)}
											<Button
												size="sm"
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
											>
												{checkingOrderId ===
												order.orderId ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<RefreshCw className="h-4 w-4 mr-1" />
												)}
												Check Message
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<p className="text-center text-muted-foreground py-8">
								No active Provider 3 orders
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
