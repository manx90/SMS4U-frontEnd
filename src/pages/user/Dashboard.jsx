import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { orderApi } from "../../services/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "../../components/shared/CopyButton";
import { StatusBadge } from "../../components/shared/StatusBadge";
import {
	Wallet,
	ShoppingCart,
	Clock,
	Phone,
	Key,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function UserDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalOrders: 0,
		pendingOrders: 0,
		completedOrders: 0,
	});

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
				const userOrders = response.data;
				setOrders(userOrders.slice(0, 5)); // Recent 5 orders
				setStats({
					totalOrders: userOrders.length,
					pendingOrders: userOrders.filter(
						(o) => o.status === "pending",
					).length,
					completedOrders: userOrders.filter(
						(o) => o.status === "completed",
					).length,
				});
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

	const statsCards = [
		{
			title: "Balance",
			value: `$${
				user?.balance?.toFixed(2) || "0.00"
			}`,
			icon: Wallet,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Total Orders",
			value: stats.totalOrders,
			icon: ShoppingCart,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Pending",
			value: stats.pendingOrders,
			icon: Clock,
			color: "text-yellow-500",
			bgColor: "bg-yellow-500/10",
		},
		{
			title: "Completed",
			value: stats.completedOrders,
			icon: TrendingUp,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
	];

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-32 w-full" />
				<div className="grid gap-6 md:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-28" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in-50">
			{/* Header */}
			<Card className="glass-card border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10">
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Welcome back, {user?.name}!
							</h1>
							<p className="text-muted-foreground mt-2">
								Manage your SMS orders and account
							</p>
						</div>
						<Button
							onClick={() =>
								navigate("/user/get-number")
							}
							size="lg"
							className="gap-2"
						>
							<Phone className="h-5 w-5" />
							Get New Number
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Stats Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{statsCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card
							key={index}
							className="glass-card hover:shadow-lg transition-all duration-300 border-primary/10"
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
								<CardTitle className="text-sm font-semibold">
									{stat.title}
								</CardTitle>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color} ring-1 ring-current/20`}
								>
									<Icon className="h-5 w-5" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{stat.value}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* API Key Card */}
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Key className="h-5 w-5 text-primary" />
						<CardTitle>Your API Key</CardTitle>
					</div>
					<CardDescription>
						Use this key for API integration
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
						<code className="flex-1 font-mono text-sm">
							{user?.apiKey || "N/A"}
						</code>
						<CopyButton text={user?.apiKey} />
					</div>
				</CardContent>
			</Card>

			{/* Recent Orders */}
			<Card className="glass-card border-primary/10">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>
							Your latest SMS orders
						</CardDescription>
					</div>
					<Button
						variant="outline"
						onClick={() =>
							navigate("/user/orders")
						}
					>
						View All
					</Button>
				</CardHeader>
				<CardContent>
					{orders.length === 0 ? (
						<div className="text-center py-12">
							<Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-muted-foreground mb-4">
								No orders yet
							</p>
							<Button
								onClick={() =>
									navigate("/user/get-number")
								}
							>
								Get Your First Number
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{orders.map((order) => (
								<div
									key={order.id}
									className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
								>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<p className="font-medium">
												#{order.id}
											</p>
											<StatusBadge
												status={order.status}
											/>
										</div>
										<p className="text-sm text-muted-foreground">
											{order.country?.country} -{" "}
											{order.service?.name}
										</p>
										<code className="text-xs bg-muted px-2 py-1 rounded">
											{order.number ||
												"Pending..."}
										</code>
									</div>
									<div className="text-right">
										<p className="font-semibold text-green-600">
											$
											{order.price?.toFixed(2) ||
												"0.00"}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(
												order.createdAt,
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
