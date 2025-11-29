import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Search, RefreshCw, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrders() {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	const loadOrders = useCallback(async () => {
		setLoading(true);
		try {
			const response = await orderApi.getAll(user.apiKey);
			if (response.state === "200" && response.data) {
				setOrders(response.data);
				setFiltered(response.data);
			}
		} catch (error) {
			toast.error(`Failed to load orders: ${error.message}`);
		} finally {
			setLoading(false);
		}
	}, [user.apiKey]);

	useEffect(() => {
		loadOrders();
	}, [loadOrders]);

	useEffect(() => {
		let result = orders;

		// Filter by status
		if (activeTab !== "all") {
			result = result.filter((order) => order.status === activeTab);
		}

		// Filter by type
		if (typeFilter !== "all") {
			result = result.filter((order) => order.typeServe === typeFilter);
		}

		// Filter by search
		if (searchQuery) {
			result = result.filter(
				(order) =>
					order.number?.includes(searchQuery) ||
					order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					order.user?.name
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					order.country?.name
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					order.service?.name
						?.toLowerCase()
						.includes(searchQuery.toLowerCase())
			);
		}

		setFiltered(result);
	}, [searchQuery, orders, activeTab, typeFilter]);

	const handleProcessRefunds = async () => {
		try {
			const response = await orderApi.processRefunds();
			toast.success(
				`Processed ${response.data?.processed || 0} refunds`
			);
			loadOrders();
		} catch (error) {
			toast.error(`Failed to process refunds: ${error.message}`);
		}
	};

	if (loading) return <Skeleton className="h-96 w-full" />;

	const pendingCount = orders.filter((o) => o.status === "pending").length;
	const completedCount = orders.filter((o) => o.status === "completed").length;
	const failedCount = orders.filter((o) => o.status === "failed").length;
	const phoneCount = orders.filter((o) => o.typeServe === "number").length;
	const emailCount = orders.filter((o) => o.typeServe === "email").length;

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Orders Management
					</h1>
					<p className="text-muted-foreground mt-2">
						View and manage all orders (SMS & Email)
					</p>
				</div>
				<Button onClick={handleProcessRefunds} className="gap-2">
					<RefreshCw className="h-4 w-4" />
					Process Refunds
				</Button>
			</div>

			{/* Search and Filter */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="glass-card border-primary/10">
					<CardContent className="pt-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by number, email, user, country, or service..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="glass-card border-primary/10">
					<CardContent className="pt-6">
						<Select value={typeFilter} onValueChange={setTypeFilter}>
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
					<TabsTrigger value="all">All ({orders.length})</TabsTrigger>
					<TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({completedCount})
					</TabsTrigger>
					<TabsTrigger value="failed">Failed ({failedCount})</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<CardTitle>Orders ({filtered.length})</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Number/Email</TableHead>
											<TableHead>Country/Site</TableHead>
											<TableHead>Service</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filtered.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={9}
													className="text-center py-8 text-muted-foreground"
												>
													No orders found
												</TableCell>
											</TableRow>
										) : (
											filtered.map((order) => {
												const isEmail = order.typeServe === "email";
												return (
													<TableRow
														key={order.id}
														className="hover:bg-muted/50"
													>
														<TableCell className="font-medium">
															#{order.id}
														</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className="flex items-center gap-1 w-fit"
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
														</TableCell>
														<TableCell>
															{order.user?.name || "N/A"}
														</TableCell>
														<TableCell>
															<code className="text-xs bg-muted px-2 py-1 rounded break-all max-w-xs block">
																{isEmail
																	? order.email || "N/A"
																	: order.number || "N/A"}
															</code>
														</TableCell>
														<TableCell>
															{isEmail
																? order.emailSite || "N/A"
																: order.country?.name || "N/A"}
														</TableCell>
														<TableCell>
															{isEmail
																? order.emailDomain
																	? `.${order.emailDomain}`
																	: "Default"
																: order.service?.name || "N/A"}
														</TableCell>
														<TableCell className="font-semibold text-green-600 dark:text-green-400">
															${order.price?.toFixed(2) || "0.00"}
														</TableCell>
														<TableCell>
															<StatusBadge status={order.status} />
														</TableCell>
														<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
															{new Date(
																order.createdAt
															).toLocaleString()}
														</TableCell>
													</TableRow>
												);
											})
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
