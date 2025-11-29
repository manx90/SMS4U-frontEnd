import { Badge } from "@/components/ui/badge";
import {
	CheckCircle,
	Clock,
	XCircle,
	AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
	pending: {
		label: "Pending",
		variant: "secondary",
		icon: Clock,
		className:
			"bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
	},
	completed: {
		label: "Completed",
		variant: "default",
		icon: CheckCircle,
		className:
			"bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
	},
	failed: {
		label: "Failed",
		variant: "destructive",
		icon: XCircle,
		className:
			"bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
	},
	active: {
		label: "Active",
		variant: "default",
		icon: CheckCircle,
		className:
			"bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
	},
	inactive: {
		label: "Inactive",
		variant: "secondary",
		icon: AlertCircle,
		className:
			"bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
	},
};

export function StatusBadge({
	status,
	showIcon = true,
	className,
}) {
	const config =
		statusConfig[status?.toLowerCase()] ||
		statusConfig.pending;
	const Icon = config.icon;

	return (
		<Badge
			variant={config.variant}
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 font-medium",
				config.className,
				className,
			)}
		>
			{showIcon && (
				<Icon className="h-3.5 w-3.5" />
			)}
			{config.label}
		</Badge>
	);
}

export default StatusBadge;
