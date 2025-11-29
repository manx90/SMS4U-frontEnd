import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usersTableData } from "@/lib/mockData";

export function UsersTable() {
	return (
		<Card className="col-span-full card-enhanced glass-card border-primary/10">
			<CardHeader className="space-y-1">
				<CardTitle className="text-xl font-bold tracking-tight">
					Recent Users
				</CardTitle>
				<CardDescription className="text-sm">
					A list of recent user registrations and
					their status
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent border-b border-muted">
								<TableHead className="font-semibold text-foreground">
									Name
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Email
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Role
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Status
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Join Date
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{usersTableData.map((user) => (
								<TableRow
									key={user.id}
									className="hover:bg-muted/50 transition-colors cursor-pointer"
								>
									<TableCell className="font-semibold">
										{user.name}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{user.email}
									</TableCell>
									<TableCell>
										<span className="text-sm font-medium">
											{user.role}
										</span>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												user.status === "Active"
													? "default"
													: "secondary"
											}
											className="font-medium"
										>
											{user.status}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{user.joinDate}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
