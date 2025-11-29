import {
	useState,
	useEffect,
	useCallback,
} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { orderApi } from "../../services/api";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { CopyButton } from "../../components/shared/CopyButton";
import {
	Search,
	MessageSquare,
	RefreshCw,
	Clock,
	Phone,
	Mail,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function UserOrders() {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] =
		useState("");
	const [activeTab, setActiveTab] =
		useState("all");
	const [typeFilter, setTypeFilter] =
		useState("all");
	const [
		messageDialogOpen,
		setMessageDialogOpen,
	] = useState(false);
	const [selectedOrder, setSelectedOrder] =
		useState(null);
	const [messageData, setMessageData] =
		useState(null);
	const [loadingMessage, setLoadingMessage] =
		useState(false);
	// const [cancelling, setCancelling] =
	// 	useState(false);

	useEffect(() => {
		let result = orders;

		// Filter by status
		if (activeTab !== "all") {
			result = result.filter(
				(order) => order.status === activeTab,
			);
		}

		// Filter by type
		if (typeFilter !== "all") {
			result = result.filter(
				(order) => order.typeServe === typeFilter,
			);
		}

		// Search filter
		if (searchQuery) {
			result = result.filter(
				(order) =>
					order.number?.includes(searchQuery) ||
					order.email
						?.toLowerCase()
						.includes(
							searchQuery.toLowerCase(),
						) ||
					order.country?.name
						?.toLowerCase()
						.includes(
							searchQuery.toLowerCase(),
						) ||
					order.service?.name
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			);
		}

		setFiltered(result);
	}, [
		searchQuery,
		orders,
		activeTab,
		typeFilter,
	]);

	const loadOrders = useCallback(async () => {
		setLoading(true);
		try {
			const response = await orderApi.getAll(
				user.apiKey,
			);
			if (
				response.state === "200" &&
				response.data
			) {
				setOrders(response.data);
				setFiltered(response.data);
			}
		} catch (error) {
			toast.error(
				`Failed to load orders: ${error.message}`,
			);
		} finally {
			setLoading(false);
		}
	}, [user.apiKey]);

	useEffect(() => {
		loadOrders();
	}, [loadOrders]);

	const handleGetMessage = async (order) => {
		setSelectedOrder(order);
		setMessageDialogOpen(true);

		// If the order is already completed and we have a stored message, show it immediately
		if (
			order.status === "completed" &&
			(order.message || order.emailMessage)
		) {
			setLoadingMessage(false);
			setMessageData(
				order.message || order.emailMessage,
			);
			return;
		}

		setLoadingMessage(true);
		setMessageData(null);

		try {
			let response;
			if (order.typeServe === "email") {
				response = await orderApi.getEmailMessage(
					order.publicId,
				);
			} else {
				response = await orderApi.getMessage(
					order.publicId,
				);
			}

			if (
				response.code === 200 ||
				response.state === "200"
			) {
				setMessageData(response.data);
				toast.success("Message received!");
			} else if (
				response.code === 202 ||
				response.state === "202"
			) {
				setMessageData({ pending: true });
				toast.info(
					"No message yet. Please check again shortly.",
				);
			}
		} catch (error) {
			toast.error(
				`Failed to get message: ${error.message}`,
			);
		} finally {
			setLoadingMessage(false);
		}
	};

	// const handleCancelEmail = async (order) => {
	// 	if (
	// 		!confirm(
	// 			"Are you sure you want to cancel this email order?",
	// 		)
	// 	) {
	// 		return;
	// 	}

	// 	setCancelling(true);
	// 	try {
	// 		const response = await orderApi.cancelEmail(
	// 			order.publicId,
	// 		);
	// 		if (response.state === "200") {
	// 			toast.success(
	// 				"Email order cancelled successfully",
	// 			);
	// 			loadOrders();
	// 		}
	// 	} catch (error) {
	// 		toast.error(
	// 			`Failed to cancel email order: ${error.message}`,
	// 		);
	// 	} finally {
	// 		setCancelling(false);
	// 	}
	// };

	if (loading)
		return <Skeleton className="h-96 w-full" />;

	const pendingCount = orders.filter(
		(o) => o.status === "pending",
	).length;
	const completedCount = orders.filter(
		(o) => o.status === "completed",
	).length;
	const phoneCount = orders.filter(
		(o) => o.typeServe === "number",
	).length;
	const emailCount = orders.filter(
		(o) => o.typeServe === "email",
	).length;

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					My Orders
				</h1>
				<p className="text-muted-foreground mt-2">
					View and manage your SMS and email
					orders
				</p>
			</div>

			{/* Search and Filter */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="glass-card border-primary/10">
					<CardContent className="pt-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by number, email, country, or service..."
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(e.target.value)
								}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="glass-card border-primary/10">
					<CardContent className="pt-6">
						<Select
							value={typeFilter}
							onValueChange={setTypeFilter}
						>
							<SelectTrigger>
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Orders ({orders.length})
								</SelectItem>
								<SelectItem value="number">
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4" />
										Phone Numbers ({phoneCount})
									</div>
								</SelectItem>
								<SelectItem value="email">
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Emails ({emailCount})
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</div>

			{/* Status Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="all">
						All ({orders.length})
					</TabsTrigger>
					<TabsTrigger value="pending">
						Pending ({pendingCount})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({completedCount})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value={activeTab}
					className="space-y-4"
				>
					{filtered.length === 0 ? (
						<Card className="glass-card border-primary/10">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">
									No orders found
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{filtered.map((order) => {
								const isEmail =
									order.typeServe === "email";
								const timeLeft =
									order.status === "pending"
										? Math.max(
												0,
												20 * 60 * 1000 -
													(new Date() -
														new Date(
															order.createdAt,
														)),
										  )
										: 0;
								const minutesLeft = Math.ceil(
									timeLeft / (60 * 1000),
								);

								return (
									<Card
										key={order.id}
										className="glass-card border-primary/10 hover:shadow-lg transition-all"
									>
										<CardContent className="pt-6">
											<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
												<div className="space-y-2 flex-1">
													<div className="flex items-center gap-2 flex-wrap">
														<h3 className="font-semibold text-lg">
															Order #{order.id}
														</h3>
														<StatusBadge
															status={
																order.status
															}
														/>
														<Badge
															variant="outline"
															className="flex items-center gap-1"
														>
															{isEmail ? (
																<>
																	<Mail className="h-3 w-3" />
																	Email
																</>
															) : (
																<>
																	<Phone className="h-3 w-3" />
																	Phone
																</>
															)}
														</Badge>
														{order.status ===
															"pending" &&
															minutesLeft > 0 && (
																<div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
																	<Clock className="h-3 w-3" />
																	{minutesLeft}min
																	left
																</div>
															)}
													</div>

													<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
														<div className="col-span-2">
															<p className="text-muted-foreground">
																{isEmail
																	? "Email"
																	: "Number"}
															</p>
															<div className="flex items-center gap-1">
																<code className="text-xs bg-muted px-2 py-1 rounded break-all">
																	{isEmail
																		? order.email ||
																		  "N/A"
																		: order.number ||
																		  "N/A"}
																</code>
																{(order.email ||
																	order.number) && (
																	<CopyButton
																		text={
																			isEmail
																				? order.email
																				: order.number
																		}
																		size="sm"
																	/>
																)}
															</div>
														</div>
														{!isEmail && (
															<>
																<div>
																	<p className="text-muted-foreground">
																		Country
																	</p>
																	<p className="font-medium">
																		{order.country
																			?.name ||
																			"N/A"}
																	</p>
																</div>
																<div>
																	<p className="text-muted-foreground">
																		Service
																	</p>
																	<p className="font-medium">
																		{order.service
																			?.name ||
																			"N/A"}
																	</p>
																</div>
															</>
														)}
														<div>
															<p className="text-muted-foreground">
																Price
															</p>
															<p className="font-semibold text-green-600">
																$
																{order.price?.toFixed(
																	2,
																) || "0.00"}
															</p>
														</div>
													</div>

													<p className="text-xs text-muted-foreground">
														Created:{" "}
														{new Date(
															order.createdAt,
														).toLocaleString()}
													</p>

													{/* Completed message display */}
													{order.status ===
														"completed" &&
														(order.message ||
															order.emailMessage) && (
															<div className="mt-4 space-y-2">
																<p className="text-sm font-semibold flex items-center gap-2">
																	<MessageSquare className="h-4 w-4 text-green-600" />
																	Message Received
																</p>
																<div className="p-4 bg-muted rounded-lg border">
																	<p className="text-sm whitespace-pre-wrap break-words">
																		{order.message ||
																			order.emailMessage ||
																			"Message content unavailable"}
																	</p>
																</div>
																<div className="flex justify-end">
																	<CopyButton
																		text={
																			order.message ||
																			order.emailMessage ||
																			""
																		}
																	/>
																</div>
															</div>
														)}
												</div>

												<div className="flex flex-col gap-2">
													{order.status ===
														"pending" && (
														<>
															<Button
																onClick={() =>
																	handleGetMessage(
																		order,
																	)
																}
																className="gap-2"
																size="sm"
															>
																<MessageSquare className="h-4 w-4" />
																Get Message
															</Button>
															{/* {isEmail && (
																<Button
																	onClick={() =>
																		handleCancelEmail(
																			order,
																		)
																	}
																	variant="outline"
																	className="gap-2"
																	size="sm"
																	disabled={
																		cancelling
																	}
																>
																	<XCircle className="h-4 w-4" />
																	Cancel
																</Button>
															)} */}
														</>
													)}
													{order.status ===
														"completed" && (
														<Button
															onClick={() =>
																handleGetMessage(
																	order,
																)
															}
															variant="outline"
															className="gap-2"
															size="sm"
														>
															<MessageSquare className="h-4 w-4" />
															View Message
														</Button>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Message Dialog */}
			<Dialog
				open={messageDialogOpen}
				onOpenChange={setMessageDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedOrder?.typeServe ===
							"email"
								? "Email Message"
								: "SMS Message"}
						</DialogTitle>
						<DialogDescription>
							Order #{selectedOrder?.id} -{" "}
							{selectedOrder?.typeServe ===
							"email"
								? selectedOrder?.email
								: selectedOrder?.number}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						{loadingMessage ? (
							<div className="flex items-center justify-center py-8">
								<RefreshCw className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : messageData?.pending ? (
							<div className="text-center py-8">
								<Clock className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
								<p className="text-muted-foreground">
									No message received yet. Please
									check again shortly.
								</p>
							</div>
						) : messageData ? (
							<div className="space-y-4">
								<div className="p-4 bg-muted rounded-lg">
									<p className="text-sm text-muted-foreground mb-2">
										Message Content:
									</p>
									<p className="font-medium break-words whitespace-pre-wrap">
										{typeof messageData ===
										"string"
											? messageData
											: messageData.message ||
											  messageData.text ||
											  messageData.sms ||
											  JSON.stringify(
													messageData,
											  )}
									</p>
								</div>
								<div className="flex justify-end">
									<CopyButton
										text={
											typeof messageData ===
											"string"
												? messageData
												: messageData.message ||
												  messageData.text ||
												  messageData.sms ||
												  ""
										}
									/>
								</div>
							</div>
						) : (
							<p className="text-center text-muted-foreground">
								No message available
							</p>
						)}
					</div>
					<div className="flex justify-end gap-2">
						{!loadingMessage &&
							messageData?.pending && (
								<Button
									onClick={() =>
										handleGetMessage(
											selectedOrder,
										)
									}
									variant="outline"
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									Retry
								</Button>
							)}
						<Button
							onClick={() =>
								setMessageDialogOpen(false)
							}
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
