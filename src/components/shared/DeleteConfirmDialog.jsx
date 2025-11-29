import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export function DeleteConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
	title = "Are you sure?",
	description = "This action cannot be undone. This will permanently delete the item.",
	confirmText = "Delete",
	cancelText = "Cancel",
}) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-3 mb-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
							<AlertCircle className="h-5 w-5 text-destructive" />
						</div>
						<AlertDialogTitle className="text-lg">
							{title}
						</AlertDialogTitle>
					</div>
					<AlertDialogDescription className="text-sm">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive hover:bg-destructive/90"
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteConfirmDialog;
