import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LoadingOverlay({
	message = "Loading...",
	className,
}) {
	return (
		<div
			className={cn(
				"absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
				className,
			)}
		>
			<Spinner className="h-8 w-8 text-primary" />
			{message && (
				<p className="mt-4 text-sm font-medium text-muted-foreground">
					{message}
				</p>
			)}
		</div>
	);
}

export default LoadingOverlay;
