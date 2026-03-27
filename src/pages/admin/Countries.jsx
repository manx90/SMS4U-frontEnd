import { useState, useEffect } from "react";
import { countryApi } from "../../services/api";
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
	Search,
	Edit,
	Trash2,
	Globe,
} from "lucide-react";
import { toast } from "sonner";

export default function Countries() {
	const [countries, setCountries] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] =
		useState("");
	const [dialogOpen, setDialogOpen] =
		useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		useState(false);
	const [selected, setSelected] = useState(null);
	const [formData, setFormData] = useState({
		country: "",
		code_country: "",
		provider1: "",
		provider2: "",
		provider3: "",
	});

	useEffect(() => {
		loadCountries();
	}, []);

	useEffect(() => {
		const f = countries.filter((c) =>
			c.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()),
		);
		setFiltered(f);
	}, [searchQuery, countries]);

	const loadCountries = async () => {
		setLoading(true);
		try {
			const response = await countryApi.getAll();
			if (
				response.state === "200" &&
				response.data
			) {
				setCountries(response.data);
				setFiltered(response.data);
			}
		} catch (error) {
			toast.error(`Failed to load countries: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setSelected(null);
		setFormData({
			country: "",
			code_country: "",
			provider1: "",
			provider2: "",
			provider3: "",
		});
		setDialogOpen(true);
	};

	const handleEdit = (country) => {
		setSelected(country);
		setFormData({
			country: country.name ?? "",
			code_country: country.code_country ?? "",
			provider1: String(country.provider1 ?? ""),
			provider2: String(country.provider2 ?? ""),
			provider3: country.provider3
				? String(country.provider3)
				: "",
		});
		setDialogOpen(true);
	};

	const handleDelete = (country) => {
		setSelected(country);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await countryApi.delete(selected.id);
			toast.success(
				"Country deleted successfully",
			);
			loadCountries();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(`Failed to delete country: ${error.message}`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (selected?.id != null) {
				await countryApi.update({
					id: selected.id,
					...formData,
				});
				toast.success(
					"Country updated successfully",
				);
			} else {
				await countryApi.create(formData);
				toast.success(
					"Country created successfully",
				);
			}
			setDialogOpen(false);
			setSelected(null);
			loadCountries();
		} catch (error) {
			toast.error(
				selected?.id != null
					? `Failed to update country: ${error.message}`
					: `Failed to create country: ${error.message}`,
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
						Countries Management
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage country configurations
					</p>
				</div>
				<Button
					onClick={handleCreate}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Country
				</Button>
			</div>

			<Card className="glass-card border-primary/10">
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search countries..."
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(e.target.value)
							}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>
						All Countries ({filtered.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Country</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Provider 1</TableHead>
								<TableHead>Provider 2</TableHead>
								<TableHead>Provider 3 (ISO)</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((country) => (
								<TableRow
									key={country.id}
									className="hover:bg-muted/50"
								>
									<TableCell>
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4 text-primary" />
											<span className="font-semibold">
												{country.name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<code className="text-xs bg-muted px-2 py-1 rounded font-semibold">
											{country.code_country || "N/A"}
										</code>
									</TableCell>
									<TableCell>
										<code className="text-xs bg-muted px-2 py-1 rounded">
											{country.provider1}
										</code>
									</TableCell>
									<TableCell>
										<code className="text-xs bg-muted px-2 py-1 rounded">
											{country.provider2}
										</code>
									</TableCell>
									<TableCell>
										<code className="text-xs bg-muted px-2 py-1 rounded">
											{country.provider3 || "—"}
										</code>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleEdit(country)
												}
											>
												<Edit className="h-3.5 w-3.5" />
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleDelete(country)
												}
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog
				open={dialogOpen}
				onOpenChange={(open) => {
					setDialogOpen(open);
					if (!open) setSelected(null);
				}}
			>
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{selected?.id != null
									? "Edit Country"
									: "Create Country"}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>Country Name *</Label>
								<Input
									value={formData.country}
									onChange={(e) =>
										setFormData({
											...formData,
											country: e.target.value,
										})
									}
									placeholder="e.g., United States"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Country Code *</Label>
								<Input
									value={formData.code_country}
									onChange={(e) =>
										setFormData({
											...formData,
											code_country: e.target.value,
										})
									}
									placeholder="e.g., US, UK, FR"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Provider 1 Code *</Label>
								<Input
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
								<Label>Provider 2 Code *</Label>
								<Input
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
							<div className="space-y-2">
								<Label>
									Provider 3 country code (ISO)
								</Label>
								<Input
									value={formData.provider3}
									onChange={(e) =>
										setFormData({
											...formData,
											provider3: e.target.value,
										})
									}
									placeholder="e.g. IT, US (optional)"
								/>
								<p className="text-xs text-muted-foreground">
									Used by the third SMS provider API.
									Leave empty if unused.
								</p>
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
								{selected?.id != null
									? "Save changes"
									: "Create"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={confirmDelete}
				title="Delete Country"
				description={`Delete "${selected?.name}"? This may affect related pricing.`}
			/>
		</div>
	);
}
