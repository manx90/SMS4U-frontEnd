import { useState, useEffect } from "react";
import { serviceApi } from "../../services/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmDialog } from "../../components/shared/DeleteConfirmDialog";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Package,
} from "lucide-react";
import { toast } from "sonner";

export default function Services() {
	const [services, setServices] = useState([]);
	const [filteredServices, setFilteredServices] =
		useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] =
		useState("");
	const [dialogOpen, setDialogOpen] =
		useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		useState(false);
	const [selectedService, setSelectedService] =
		useState(null);
	const [isEditing, setIsEditing] =
		useState(false);
	const [formData, setFormData] = useState({
		servicename: "",
		code: "",
		provider1: "",
		provider2: "",
		provider3: "",
	});
	const [syncForm, setSyncForm] = useState({
		serviceCode: "",
		serviceName: "",
	});
	const [syncing, setSyncing] = useState(false);

	useEffect(() => {
		loadServices();
	}, []);

	useEffect(() => {
		const filtered = services.filter((service) =>
			service.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()),
		);
		setFilteredServices(filtered);
	}, [searchQuery, services]);

	const loadServices = async () => {
		setLoading(true);
		try {
			const response = await serviceApi.getAll();
			if (
				response.state === "200" &&
				response.data
			) {
				setServices(response.data);
				setFilteredServices(response.data);
			}
		} catch (error) {
			toast.error(
				`Failed to load services: ${error.message}`,
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelectedService(null);
		setFormData({
			servicename: "",
			code: "",
			provider1: "",
			provider2: "",
			provider3: "",
		});
		setDialogOpen(true);
	};

	const handleEdit = (service) => {
		setIsEditing(true);
		setSelectedService(service);
		setFormData({
			servicename: service.name || "",
			code: service.code || "",
			provider1: service.provider1 || "",
			provider2: service.provider2 || "",
			provider3: service.provider3 || "",
		});
		setDialogOpen(true);
	};

	const handleDelete = (service) => {
		setSelectedService(service);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await serviceApi.delete(selectedService.id);
			toast.success(
				"Service deleted successfully",
			);
			loadServices();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(
				`Failed to delete service: ${error.message}`,
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await serviceApi.update(
					selectedService.id,
					formData,
				);
				toast.success(
					"Service updated successfully",
				);
			} else {
				await serviceApi.create(formData);
				toast.success(
					"Service created successfully",
				);
			}
			setDialogOpen(false);
			loadServices();
		} catch (error) {
			toast.error(
				isEditing
					? `Failed to update service: ${error.message}`
					: `Failed to create service: ${error.message}`,
			);
		}
	};

	const handleProvider3Sync = async (e) => {
		e.preventDefault();
		const code = String(syncForm.serviceCode || "").trim();
		if (!code) {
			toast.error("Service code is required");
			return;
		}
		setSyncing(true);
		try {
			const res = await serviceApi.provider3AccessSync({
				serviceCode: code,
				serviceName: syncForm.serviceName?.trim() || undefined,
			});
			if (res.state === "200") {
				const n = res.data?.rowsInserted;
				toast.success(
					typeof n === "number"
						? `Synced ${n} operator rows`
						: "Provider 3 access sync completed",
				);
			} else {
				toast.error(
					res.error ||
						res.msg ||
						"Sync failed",
				);
			}
		} catch (err) {
			toast.error(
				err?.error ||
					err?.message ||
					"Sync failed",
			);
		} finally {
			setSyncing(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Services Management
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage SMS service providers
					</p>
				</div>
				<Button
					onClick={handleCreate}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Service
				</Button>
			</div>

			<Card className="glass-card border-primary/10">
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search services..."
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(e.target.value)
							}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredServices.map((service) => (
					<Card
						key={service.id}
						className="glass-card border-primary/10 hover:shadow-lg transition-all"
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Package className="h-5 w-5" />
									</div>
									<div>
										<CardTitle className="text-lg">
											{service.name}
										</CardTitle>
										<CardDescription className="text-xs">
											ID: {service.id}
										</CardDescription>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Code:
									</span>
									<code className="bg-muted px-2 py-1 rounded text-xs font-semibold">
										{service.code || "N/A"}
									</code>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Provider 1:
									</span>
									<code className="bg-muted px-2 py-1 rounded text-xs">
										{service.provider1 || "N/A"}
									</code>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Provider 2:
									</span>
									<code className="bg-muted px-2 py-1 rounded text-xs">
										{service.provider2 || "N/A"}
									</code>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										Provider 3:
									</span>
									<code className="bg-muted px-2 py-1 rounded text-xs max-w-[140px] truncate">
										{service.provider3 || "N/A"}
									</code>
								</div>
							</div>
							<div className="flex gap-2 pt-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										handleEdit(service)
									}
									className="flex-1"
								>
									<Edit className="h-3.5 w-3.5 mr-1" />
									Edit
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() =>
										handleDelete(service)
									}
									className="flex-1"
								>
									<Trash2 className="h-3.5 w-3.5 mr-1" />
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle className="text-lg">
						Provider 3 — access sync
					</CardTitle>
					<CardDescription>
						Fetch operator and country data from the third
						provider and store it so users can choose an
						operator when ordering. Run this after configuring
						the backend env and service codes.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleProvider3Sync}
						className="flex flex-col gap-4 sm:flex-row sm:items-end"
					>
						<div className="space-y-2 flex-1 min-w-0">
							<Label htmlFor="p3-sync-code">
								Service code *
							</Label>
							<Input
								id="p3-sync-code"
								value={syncForm.serviceCode}
								onChange={(e) =>
									setSyncForm({
										...syncForm,
										serviceCode: e.target.value,
									})
								}
								placeholder="e.g. tg, wa"
							/>
						</div>
						<div className="space-y-2 flex-1 min-w-0">
							<Label htmlFor="p3-sync-name">
								Override API name (optional)
							</Label>
							<Input
								id="p3-sync-name"
								value={syncForm.serviceName}
								onChange={(e) =>
									setSyncForm({
										...syncForm,
										serviceName: e.target.value,
									})
								}
								placeholder="Defaults to service name / provider3"
							/>
						</div>
						<Button
							type="submit"
							disabled={syncing}
							className="sm:mb-0.5"
						>
							{syncing ? "Syncing…" : "Run sync"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Dialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{isEditing
									? "Edit Service"
									: "Create Service"}
							</DialogTitle>
							<DialogDescription>
								{isEditing
									? "Update service information"
									: "Add a new SMS service provider"}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="servicename">
									Service Name *
								</Label>
								<Input
									id="servicename"
									name="servicename"
									value={formData.servicename}
									onChange={(e) =>
										setFormData({
											...formData,
											servicename: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="code">
									Service Code *
								</Label>
								<Input
									id="code"
									name="code"
									value={formData.code}
									onChange={(e) =>
										setFormData({
											...formData,
											code: e.target.value,
										})
									}
									placeholder="e.g., telegram, whatsapp"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="provider1">
									Provider 1 ID *
								</Label>
								<Input
									id="provider1"
									name="provider1"
									value={formData.provider1}
									onChange={(e) =>
										setFormData({
											...formData,
											provider1: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="provider2">
									Provider 2 ID
								</Label>
								<Input
									id="provider2"
									name="provider2"
									value={formData.provider2}
									onChange={(e) =>
										setFormData({
											...formData,
											provider2: e.target.value,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="provider3">
									Provider 3 API name
								</Label>
								<Input
									id="provider3"
									name="provider3"
									value={formData.provider3}
									onChange={(e) =>
										setFormData({
											...formData,
											provider3: e.target.value,
										})
									}
									placeholder="Accessinfo / API service name (optional)"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									setDialogOpen(false)
								}
							>
								Cancel
							</Button>
							<Button type="submit">
								{isEditing ? "Update" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={confirmDelete}
				title="Delete Service"
				description={`Are you sure you want to delete "${selectedService?.name}"? This may affect related pricing and orders.`}
			/>
		</div>
	);
}
