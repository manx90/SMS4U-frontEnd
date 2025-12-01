import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { heleketPaymentApi } from "../../services/heleketApi";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	RefreshCw,
	ExternalLink,
	Copy,
	CheckCircle2,
	Clock,
	XCircle,
	AlertCircle,
	Wallet,
	DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "../../components/shared/CopyButton";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Payment Status Badge Component
function PaymentStatusBadge({ status }) {
	const statusConfig = {
		paid: {
			label: "Paid",
			variant: "default",
			icon: CheckCircle2,
			className:
				"bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
		},
		check: {
			label: "Pending",
			variant: "secondary",
			icon: Clock,
			className:
				"bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
		},
		process: {
			label: "Processing",
			variant: "secondary",
			icon: Clock,
			className:
				"bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
		},
		expired: {
			label: "Expired",
			variant: "secondary",
			icon: AlertCircle,
			className:
				"bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
		},
		failed: {
			label: "Failed",
			variant: "destructive",
			icon: XCircle,
			className:
				"bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
		},
		cancel: {
			label: "Cancelled",
			variant: "secondary",
			icon: XCircle,
			className:
				"bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
		},
	};

	const config =
		statusConfig[status?.toLowerCase()] || statusConfig.check;
	const Icon = config.icon;

	return (
		<Badge
			variant={config.variant}
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 font-medium",
				config.className,
			)}
		>
			<Icon className="h-3.5 w-3.5" />
			{config.label}
		</Badge>
	);
}

export default function AdminPayments() {
	const { user } = useAuth();
	const [payments, setPayments] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	const loadPayments = useCallback(async () => {
		setLoading(true);
		try {
			const response = await heleketPaymentApi.getAllPayments();
			if (response.state === "200" && response.data) {
				setPayments(response.data);
				setFiltered(response.data);
			}
		} catch (error) {
			toast.error(
				`Failed to load payments: ${error.message}`,
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPayments();
	}, [loadPayments]);

	useEffect(() => {
		let result = payments;

		// Filter by status
		if (activeTab !== "all") {
			if (activeTab === "pending") {
				result = result.filter(
					(payment) =>
						payment.paymentStatus === "check" ||
						payment.paymentStatus === "process",
				);
			} else {
				result = result.filter(
					(payment) =>
						payment.paymentStatus?.toLowerCase() ===
						activeTab.toLowerCase(),
				);
			}
		}

		setFiltered(result);
	}, [payments, activeTab]);

	if (loading) return <Skeleton className="h-96 w-full" />;

	const paidCount = payments.filter(
		(p) => p.paymentStatus === "paid",
	).length;
	const pendingCount = payments.filter(
		(p) =>
			p.paymentStatus === "check" ||
			p.paymentStatus === "process",
	).length;
	const failedCount = payments.filter(
		(p) =>
			p.paymentStatus === "failed" ||
			p.paymentStatus === "expired" ||
			p.paymentStatus === "cancel",
	).length;

	const totalPaid = payments
		.filter((p) => p.paymentStatus === "paid")
		.reduce((sum, p) => sum + (p.merchantAmount || p.paymentAmount || p.amount || 0), 0);

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Payments Management
					</h1>
					<p className="text-muted-foreground mt-2">
						View and manage all payment invoices
					</p>
				</div>
				<Button
					onClick={loadPayments}
					className="gap-2"
					variant="outline"
				>
					<RefreshCw className="h-4 w-4" />
					Refresh
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="glass-card border-primary/10">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Invoices
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{payments.length}
						</div>
					</CardContent>
				</Card>

				<Card className="glass-card border-primary/10">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Paid
						</CardTitle>
						<CheckCircle2 className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{paidCount}
						</div>
					</CardContent>
				</Card>

				<Card className="glass-card border-primary/10">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending
						</CardTitle>
						<Clock className="h-4 w-4 text-yellow-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{pendingCount}
						</div>
					</CardContent>
				</Card>

				<Card className="glass-card border-primary/10">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Paid
						</CardTitle>
						<DollarSign className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{totalPaid.toFixed(2)} USDT
						</div>
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
						All ({payments.length})
					</TabsTrigger>
					<TabsTrigger value="paid">
						Paid ({paidCount})
					</TabsTrigger>
					<TabsTrigger value="pending">
						Pending ({pendingCount})
					</TabsTrigger>
					<TabsTrigger value="failed">
						Failed ({failedCount})
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<CardTitle>
								Payment Invoices ({filtered.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Paid Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>UUID</TableHead>
											<TableHead>Order ID</TableHead>
											<TableHead>Address</TableHead>
											<TableHead>Payment URL</TableHead>
											<TableHead>Created</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filtered.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={10}
													className="text-center py-8 text-muted-foreground"
												>
													No payments found
												</TableCell>
											</TableRow>
										) : (
											filtered.map((payment) => (
												<TableRow
													key={payment.id}
													className="hover:bg-muted/50"
												>
													<TableCell className="font-medium">
														#{payment.id}
													</TableCell>
													<TableCell>
														{payment.user ? (
															<Link
																to={`/admin/users`}
																className="text-primary hover:underline"
															>
																{payment.user.name}
															</Link>
														) : (
															<span className="text-muted-foreground">
																User #{payment.userId}
															</span>
														)}
													</TableCell>
													<TableCell>
														<div className="font-semibold">
															{payment.amount?.toFixed(2) || "0.00"}{" "}
															{payment.currency || "USDT"}
														</div>
													</TableCell>
													<TableCell>
														{payment.merchantAmount ? (
															<div className="font-semibold text-green-600">
																{payment.merchantAmount.toFixed(2)}{" "}
																USDT
															</div>
														) : payment.paymentAmount ? (
															<div className="font-semibold text-blue-600">
																{payment.paymentAmount.toFixed(2)}{" "}
																{payment.payerCurrency || "USDT"}
															</div>
														) : (
															<span className="text-muted-foreground text-sm">
																Not paid
															</span>
														)}
													</TableCell>
													<TableCell>
														<PaymentStatusBadge
															status={payment.paymentStatus}
														/>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[150px] truncate">
																{payment.heleketUuid}
															</code>
															<CopyButton text={payment.heleketUuid} />
														</div>
													</TableCell>
													<TableCell>
														<code className="text-xs bg-muted px-2 py-1 rounded font-mono">
															{payment.orderId}
														</code>
													</TableCell>
													<TableCell>
														{payment.address ? (
															<div className="flex items-center gap-2">
																<code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[150px] truncate">
																	{payment.address}
																</code>
																<CopyButton text={payment.address} />
															</div>
														) : (
															<span className="text-muted-foreground text-sm">
																N/A
															</span>
														)}
													</TableCell>
													<TableCell>
														{payment.url ? (
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	window.open(
																		payment.url,
																		"_blank",
																	)
																}
																className="gap-1"
															>
																<ExternalLink className="h-3 w-3" />
																Open
															</Button>
														) : (
															<span className="text-muted-foreground text-sm">
																N/A
															</span>
														)}
													</TableCell>
													<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
														{payment.createdAt
															? new Date(
																	payment.createdAt,
															  ).toLocaleString()
															: "N/A"}
													</TableCell>
												</TableRow>
											))
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

