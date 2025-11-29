import { useState, useEffect } from "react";
import {
	pricingApi,
	countryApi,
	serviceApi,
} from "../../services/api";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmDialog } from "../../components/shared/DeleteConfirmDialog";
import {
	Plus,
	Edit,
	Trash2,
	DollarSign,
} from "lucide-react";
import { toast } from "sonner";

export default function Pricing() {
	const [pricing, setPricing] = useState([]);
	const [countries, setCountries] = useState([]);
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] =
		useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		useState(false);
	const [selected, setSelected] = useState(null);
	const [isEditing, setIsEditing] =
		useState(false);
	const [formData, setFormData] = useState({
		countryId: "",
		serviceId: "",
		provider1: "",
		provider2: "",
	});

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [
				pricingRes,
				countriesRes,
				servicesRes,
			] = await Promise.all([
				pricingApi.getAll(),
				countryApi.getAll(),
				serviceApi.getAll(),
			]);

			console.log(
				"Pricing response:",
				pricingRes,
			);
			console.log(
				"Countries response:",
				countriesRes,
			);
			console.log(
				"Services response:",
				servicesRes,
			);

			if (pricingRes.state === "200")
				setPricing(pricingRes.data || []);
			if (countriesRes.state === "200")
				setCountries(countriesRes.data || []);
			if (servicesRes.state === "200")
				setServices(servicesRes.data || []);
		} catch (error) {
			console.error("Load data error:", error);
			toast.error(`Failed to load data: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelected(null);
		setFormData({
			countryId: "",
			serviceId: "",
			provider1: "",
			provider2: "",
		});
		setDialogOpen(true);
	};

	const handleEdit = (item) => {
		setIsEditing(true);
		setSelected(item);
		setFormData({
			countryId: item.country?.id || "",
			serviceId: item.service?.id || "",
			provider1: item.provider1 || "",
			provider2: item.provider2 || "",
		});
		setDialogOpen(true);
	};

	const handleDelete = (item) => {
		setSelected(item);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await pricingApi.delete(selected.id);
			toast.success(
				"Pricing deleted successfully",
			);
			loadData();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(`Failed to delete pricing: ${error.message}`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await pricingApi.update(
					selected.id,
					formData.provider1,
					formData.provider2,
				);
				toast.success(
					"Pricing updated successfully",
				);
			} else {
				await pricingApi.create(formData.countryId, formData.serviceId, formData.provider1, formData.provider2);
				toast.success(
					"Pricing created successfully",
				);
			}
			setDialogOpen(false);
			loadData();
		} catch (error) {
			toast.error(
				isEditing
					? `Failed to update pricing: ${error.message}`
					: `Failed to create pricing: ${error.message}`,
			);
		}
	};

	if (loading)
		return <Skeleton className="h-96 w-full" />;

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Pricing Management
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage service pricing by country
					</p>
				</div>
				<Button
					onClick={handleCreate}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Pricing
				</Button>
			</div>

			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>
						All Pricing Configurations (
						{pricing.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Country</TableHead>
								<TableHead>Service</TableHead>
								<TableHead>
									Price Provider 1
								</TableHead>
								<TableHead>
									Price Provider 2
								</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pricing.map((item) => (
								<TableRow
									key={item.id}
									className="hover:bg-muted/50"
								>
									<TableCell className="font-semibold">
										{item.country?.name || "N/A"}
									</TableCell>
									<TableCell>
										{item.service?.name || "N/A"}
									</TableCell>
									<TableCell>
										<code className="  px-2 py-1 rounded flex items-center gap-1">
											<DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
											{item.provider1}
										</code>
									</TableCell>
									<TableCell>
										<code className=" px-2 py-1 rounded flex items-center gap-1">
											<DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
											{item.provider2}
										</code>
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handleEdit(item)
											}
										>
											<Edit className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() =>
												handleDelete(item)
											}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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
									? "Edit Pricing"
									: "Create Pricing"}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>Country *</Label>
								<Select
									value={formData.countryId}
									onValueChange={(value) =>
										setFormData({
											...formData,
											countryId: value,
										})
									}
									disabled={isEditing}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select country" />
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{loading ? (
											<div className="p-2 text-sm text-muted-foreground">
												Loading countries...
											</div>
										) : countries.length === 0 ? (
											<div className="p-2 text-sm text-muted-foreground">
												No countries available.
												Add countries first.
											</div>
										) : (
											countries.map((c) => (
												<SelectItem
													key={c.id}
													value={c.id.toString()}
												>
													{c.country ||
														c.name ||
														`Country ${c.id}`}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Service *</Label>
								<Select
									value={formData.serviceId}
									onValueChange={(value) =>
										setFormData({
											...formData,
											serviceId: value,
										})
									}
									disabled={isEditing}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select service" />
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{loading ? (
											<div className="p-2 text-sm text-muted-foreground">
												Loading services...
											</div>
										) : services.length === 0 ? (
											<div className="p-2 text-sm text-muted-foreground">
												No services available. Add
												services first.
											</div>
										) : (
											services.map((s) => (
												<SelectItem
													key={s.id}
													value={s.id.toString()}
												>
													{s.name ||
														s.service ||
														`Service ${s.id}`}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Provider 1 *</Label>
								<Input
									type="number"
									step="0.01"
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
								<Label>Provider 2 *</Label>
								<Input
									type="text"
									value={formData.provider2}
									onChange={(e) =>
										setFormData({
											...formData,
											provider2: e.target.value,
										})
									}
									required
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
				title="Delete Pricing"
				description="Are you sure you want to delete this pricing configuration?"
			/>
		</div>
	);
}
