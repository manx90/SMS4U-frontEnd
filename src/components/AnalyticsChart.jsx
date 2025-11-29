import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { chartData } from "@/lib/mockData";

export function AnalyticsChart({
	type = "revenue",
}) {
	const data =
		type === "revenue"
			? chartData.revenue
			: chartData.analytics;

	return (
		<Card className="col-span-full lg:col-span-2 card-enhanced glass-card border-primary/10">
			<CardHeader className="space-y-1">
				<CardTitle className="text-xl font-bold tracking-tight">
					{type === "revenue"
						? "Revenue & Users Overview"
						: "Weekly Analytics"}
				</CardTitle>
				<CardDescription className="text-sm">
					{type === "revenue"
						? "Monthly revenue and user growth trends"
						: "Daily website visits for the past week"}
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-2">
				<ResponsiveContainer
					width="100%"
					height={320}
				>
					{type === "revenue" ? (
						<LineChart data={data}>
							<defs>
								<linearGradient
									id="revenueGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0.3}
									/>
									<stop
										offset="100%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="hsl(var(--border))"
								opacity={0.3}
								vertical={false}
							/>
							<XAxis
								dataKey="name"
								tick={{
									fontSize: 12,
									fill: "hsl(var(--foreground))",
									opacity: 0.7,
								}}
								tickLine={false}
								axisLine={false}
								stroke="hsl(var(--foreground))"
							/>
							<YAxis
								tick={{
									fontSize: 12,
									fill: "hsl(var(--foreground))",
									opacity: 0.7,
								}}
								tickLine={false}
								axisLine={false}
								stroke="hsl(var(--foreground))"
							/>
							<Tooltip
								contentStyle={{
									backgroundColor:
										"hsl(var(--popover))",
									border:
										"1px solid hsl(var(--border))",
									borderRadius: "0.5rem",
									boxShadow:
										"0 4px 12px rgb(0 0 0 / 0.15)",
									color:
										"hsl(var(--popover-foreground))",
								}}
								labelStyle={{
									fontWeight: 600,
									marginBottom: "0.25rem",
									color:
										"hsl(var(--popover-foreground))",
								}}
								itemStyle={{
									color:
										"hsl(var(--popover-foreground))",
								}}
							/>
							<Legend
								wrapperStyle={{
									paddingTop: "1rem",
									color: "hsl(var(--foreground))",
								}}
								iconType="circle"
							/>
							<Line
								type="monotone"
								dataKey="revenue"
								stroke="hsl(var(--primary))"
								strokeWidth={3}
								dot={{
									fill: "hsl(var(--primary))",
									r: 4,
									strokeWidth: 2,
									stroke: "hsl(var(--card))",
								}}
								activeDot={{ r: 6 }}
							/>
							<Line
								type="monotone"
								dataKey="users"
								stroke="hsl(var(--chart-2))"
								strokeWidth={3}
								dot={{
									fill: "hsl(var(--chart-2))",
									r: 4,
									strokeWidth: 2,
									stroke: "hsl(var(--card))",
								}}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					) : (
						<BarChart data={data}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="hsl(var(--border))"
								opacity={0.3}
								vertical={false}
							/>
							<XAxis
								dataKey="name"
								tick={{
									fontSize: 12,
									fill: "hsl(var(--foreground))",
									opacity: 0.7,
								}}
								tickLine={false}
								axisLine={false}
								stroke="hsl(var(--foreground))"
							/>
							<YAxis
								tick={{
									fontSize: 12,
									fill: "hsl(var(--foreground))",
									opacity: 0.7,
								}}
								tickLine={false}
								axisLine={false}
								stroke="hsl(var(--foreground))"
							/>
							<Tooltip
								contentStyle={{
									backgroundColor:
										"hsl(var(--popover))",
									border:
										"1px solid hsl(var(--border))",
									borderRadius: "0.5rem",
									boxShadow:
										"0 4px 12px rgb(0 0 0 / 0.15)",
									color:
										"hsl(var(--popover-foreground))",
								}}
								labelStyle={{
									color:
										"hsl(var(--popover-foreground))",
								}}
								itemStyle={{
									color:
										"hsl(var(--popover-foreground))",
								}}
								cursor={{
									fill: "hsl(var(--muted))",
									opacity: 0.2,
								}}
							/>
							<Bar
								dataKey="visits"
								fill="hsl(var(--primary))"
								radius={[8, 8, 0, 0]}
								maxBarSize={60}
							/>
						</BarChart>
					)}
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
