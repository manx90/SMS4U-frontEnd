import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
	userApi,
	orderApi,
	serviceApi,
	// countryApi,
} from "../../services/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Users,
	DollarSign,
	ShoppingCart,
	Package,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
	const { user } = useAuth();
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalOrders: 0,
		totalRevenue: 0,
		totalServices: 0,
	});
	const [loading, setLoading] = useState(true);
	const [recentOrders, setRecentOrders] =
		useState([]);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setLoading(true);
		try {
			// Load all dashboard data in parallel
			const [usersRes, ordersRes, servicesRes] =
				await Promise.all([
					userApi.getAll(),
					orderApi.getAll(user.apiKey),
					serviceApi.getAll(),
				]);

			// Calculate stats
			const users = usersRes.data || [];
			const orders = ordersRes.data || [];
			const services = servicesRes.data || [];

			// Calculate total revenue from completed orders
			const revenue = orders
				.filter(
					(order) => order.status === "completed",
				)
				.reduce(
					(sum, order) =>
						sum + (order.price || 0),
					0,
				);

			setStats({
				totalUsers: users.length,
				totalOrders: orders.length,
				totalRevenue: revenue,
				totalServices: services.length,
			});

			// Set recent orders (last 5)
			setRecentOrders(orders.slice(0, 5));
		} catch (error) {
			toast.error(
				`Failed to load dashboard data: ${error.message}`,
			);
			console.error("Dashboard error:", error);
		} finally {
			setLoading(false);
		}
	};

	const statsCards = [
		{
			title: "Total Users",
			value: stats.totalUsers,
			icon: Users,
			change: "+12%",
			changeType: "positive",
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Total Orders",
			value: stats.totalOrders,
			icon: ShoppingCart,
			change: "+23%",
			changeType: "positive",
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Revenue",
			value: `$${stats.totalRevenue.toFixed(2)}`,
			icon: DollarSign,
			change: "+8%",
			changeType: "positive",
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Services",
			value: stats.totalServices,
			icon: Package,
			change: "+2",
			changeType: "positive",
			color: "text-orange-500",
			bgColor: "bg-orange-500/10",
		},
	];

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in-50">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back, {user?.name}!
				</h1>
				<p className="text-muted-foreground mt-2">
					Here's what's happening with your SMS
					service today.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{statsCards.map((stat, index) => {
					const Icon = stat.icon;
					const isPositive =
						stat.changeType === "positive";

					return (
						<Card
							key={index}
							className="card-enhanced glass-card hover:shadow-lg transition-all duration-300 border-primary/10"
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
								<CardTitle className="text-sm font-semibold tracking-tight">
									{stat.title}
								</CardTitle>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color} ring-1 ring-current/20`}
								>
									<Icon className="h-5 w-5" />
								</div>
							</CardHeader>
							<CardContent className="space-y-1">
								<div className="text-3xl font-bold tracking-tight">
									{stat.value}
								</div>
								<p className="text-xs flex items-center gap-1.5 font-medium">
									{isPositive ? (
										<span className="flex items-center gap-1 text-green-600 dark:text-green-500">
											<TrendingUp className="h-3.5 w-3.5" />
											{stat.change}
										</span>
									) : (
										<span className="flex items-center gap-1 text-red-600 dark:text-red-500">
											<TrendingDown className="h-3.5 w-3.5" />
											{stat.change}
										</span>
									)}
									<span className="text-muted-foreground">
										from last month
									</span>
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recent Orders */}
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
					<CardDescription>
						Latest orders from your users
					</CardDescription>
				</CardHeader>
				<CardContent>
					{recentOrders.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No orders yet
						</p>
					) : (
						<div className="space-y-4">
							{recentOrders.map((order) => (
								<div
									key={order.id}
									className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
								>
									<div className="space-y-1">
										<p className="font-medium">
											Order #{order.id}
										</p>
										<p className="text-sm text-muted-foreground">
											{order.country?.name ||
												"N/A"}{" "}
											-{" "}
											{order.service?.name ||
												"N/A"}
										</p>
									</div>
									<div className="text-right">
										<p className="font-semibold">
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
