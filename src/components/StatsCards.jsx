import {
	Users,
	DollarSign,
	Activity,
	TrendingUp,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dashboardStats } from "@/lib/mockData";

const iconMap = {
	users: Users,
	dollar: DollarSign,
	activity: Activity,
	trending: TrendingUp,
};

export function StatsCards() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{dashboardStats.map((stat, index) => {
				const Icon = iconMap[stat.icon];
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
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
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
										<ArrowUp className="h-3.5 w-3.5" />
										{stat.change}
									</span>
								) : (
									<span className="flex items-center gap-1 text-red-600 dark:text-red-500">
										<ArrowDown className="h-3.5 w-3.5" />
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
	);
}
