import { useState, useEffect } from "react";
import { emailAdminApi } from "../../services/api";
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
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "../../components/shared/DeleteConfirmDialog";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	DollarSign,
	Sparkles,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailPrices() {
	const [prices, setPrices] = useState([]);
	const [sites, setSites] = useState([]);
	const [domains, setDomains] = useState([]);
	const [filteredPrices, setFilteredPrices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [populateDialogOpen, setPopulateDialogOpen] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [defaultPrice, setDefaultPrice] = useState("0.5");
	const [formData, setFormData] = useState({
		site: "",
		domain: "",
		price: "",
		active: true,
	});

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		const filtered = prices.filter((price) =>
			price.site?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			price.domain?.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredPrices(filtered);
	}, [searchQuery, prices]);

	const loadData = async () => {
		setLoading(true);
		try {
			const [pricesRes, sitesRes, domainsRes] = await Promise.all([
				emailAdminApi.getAllPrices(),
				emailAdminApi.getAllSites(),
				emailAdminApi.getAllDomains(),
			]);

			if (pricesRes.state === "200" && pricesRes.data) {
				setPrices(pricesRes.data);
				setFilteredPrices(pricesRes.data);
			}
			if (sitesRes.state === "200" && sitesRes.data) {
				setSites(sitesRes.data);
			}
			if (domainsRes.state === "200" && domainsRes.data) {
				setDomains(domainsRes.data);
			}
		} catch (error) {
			toast.error(`Failed to load data: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelectedPrice(null);
		setFormData({
			site: "",
			domain: "",
			price: "",
			active: true,
		});
		setDialogOpen(true);
	};

	const handleEdit = (price) => {
		setIsEditing(true);
		setSelectedPrice(price);
		setFormData({
			site: price.site || "",
			domain: price.domain || "",
			price: price.price?.toString() || "",
			active: price.active ?? true,
		});
		setDialogOpen(true);
	};

	const handleDelete = (price) => {
		setSelectedPrice(price);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await emailAdminApi.deletePrice(selectedPrice.id);
			toast.success("Email price deleted successfully");
			loadData();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(`Failed to delete email price: ${error.message}`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validate price
		const priceValue = parseFloat(formData.price);
		if (isNaN(priceValue) || priceValue < 0) {
			toast.error("Please enter a valid price");
			return;
		}

		try {
			const submitData = {
				site: formData.site,
				domain: formData.domain || null,
				price: priceValue,
				active: formData.active,
			};

			if (isEditing) {
				await emailAdminApi.updatePrice(selectedPrice.id, submitData);
				toast.success("Email price updated successfully");
			} else {
				await emailAdminApi.createPrice(submitData);
				toast.success("Email price created successfully");
			}
			setDialogOpen(false);
			loadData();
		} catch (error) {
			toast.error(
				isEditing
					? `Failed to update email price: ${error.message}`
					: "Failed to create email price"
			);
		}
	};

	const handleToggleActive = async (price) => {
		try {
			await emailAdminApi.updatePrice(price.id, {
				active: !price.active,
			});
			toast.success("Status updated successfully");
			loadData();
		} catch (error) {
			toast.error(`Failed to update status: ${error.message}`);
		}
	};

	const handleBulkPopulate = async () => {
		const priceValue = parseFloat(defaultPrice);
		if (isNaN(priceValue) || priceValue <= 0) {
			toast.error("Please enter a valid price");
			return;
		}

		try {
			const response = await emailAdminApi.populatePrices(priceValue);
			if (response.state === "200") {
				toast.success(response.msg || "Prices populated successfully");
				loadData();
				setPopulateDialogOpen(false);
			}
		} catch (error) {
			toast.error(`Failed to populate prices: ${error.message}`);
		}
	};

	const avgPrice = prices.length > 0
		? (prices.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / prices.length).toFixed(2)
		: "0.00";

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Email Prices</h2>
				<p className="text-muted-foreground">
					Manage pricing for email site and domain combinations
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Price Entries
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{prices.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Price
						</CardTitle>
						<DollarSign className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${avgPrice}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Prices
						</CardTitle>
						<DollarSign className="h-4 w-4 text-blue-500 dark:text-blue-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{prices.filter((p) => p.active).length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<CardTitle>Email Prices List</CardTitle>
							<CardDescription>
								View and manage all email prices
							</CardDescription>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => setPopulateDialogOpen(true)}
							>
								<Sparkles className="mr-2 h-4 w-4" />
								Bulk Populate
							</Button>
							<Button onClick={handleCreate}>
								<Plus className="mr-2 h-4 w-4" />
								Add Price
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search Bar */}
					<div className="flex items-center gap-2 mb-4">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by site or domain..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					{/* Prices Table */}
					{loading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : filteredPrices.length === 0 ? (
						<div className="text-center py-10">
							<DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="mt-4 text-lg font-semibold">
								No prices found
							</h3>
							<p className="text-sm text-muted-foreground">
								{searchQuery
									? "Try adjusting your search"
									: "Get started by creating a new price or use bulk populate"}
							</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Site</TableHead>
										<TableHead>Domain</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created At</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredPrices.map((price) => (
										<TableRow key={price.id}>
											<TableCell className="font-medium">
												{price.site}
											</TableCell>
											<TableCell>
												{price.domain ? (
													<Badge variant="outline">.{price.domain}</Badge>
												) : (
													<Badge variant="secondary">Default</Badge>
												)}
											</TableCell>
											<TableCell>
												<span className="font-semibold text-green-600 dark:text-green-400">
													${parseFloat(price.price).toFixed(2)}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Switch
														checked={price.active}
														onCheckedChange={() =>
															handleToggleActive(price)
														}
													/>
													<Badge
														variant={price.active ? "default" : "secondary"}
													>
														{price.active ? "Active" : "Inactive"}
													</Badge>
												</div>
											</TableCell>
											<TableCell>
												{price.createdAt
													? new Date(price.createdAt).toLocaleDateString()
													: "N/A"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleEdit(price)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(price)}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{isEditing ? "Edit Email Price" : "Create Email Price"}
							</DialogTitle>
							<DialogDescription>
								{isEditing
									? "Update the email price details"
									: "Add a new price for a site/domain combination"}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="site">Site *</Label>
								<Select
									value={formData.site}
									onValueChange={(value) =>
										setFormData({ ...formData, site: value })
									}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select email site" />
									</SelectTrigger>
									<SelectContent>
										{sites
											.filter((s) => s.status)
											.map((site) => (
												<SelectItem key={site.id} value={site.name}>
													{site.display_name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="domain">Domain (Optional)</Label>
								<Select
									value={formData.domain}
									onValueChange={(value) =>
										setFormData({ ...formData, domain: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select domain (or leave empty for default)" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">Default (No specific domain)</SelectItem>
										{domains
											.filter((d) => d.status)
											.map((domain) => (
												<SelectItem key={domain.id} value={domain.name}>
													{domain.display_name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								<p className="text-xs text-muted-foreground">
									Leave empty to set a default price for the site
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="price">Price *</Label>
								<div className="relative">
									<span className="absolute left-3 top-2.5 text-muted-foreground">
										$
									</span>
									<Input
										id="price"
										type="number"
										step="0.01"
										min="0"
										placeholder="0.50"
										value={formData.price}
										onChange={(e) =>
											setFormData({ ...formData, price: e.target.value })
										}
										className="pl-7"
										required
									/>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="active">Active Status</Label>
								<Switch
									id="active"
									checked={formData.active}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, active: checked })
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setDialogOpen(false)}
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

			{/* Bulk Populate Dialog */}
			<Dialog open={populateDialogOpen} onOpenChange={setPopulateDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Bulk Populate Prices</DialogTitle>
						<DialogDescription>
							Automatically create price entries for all active site/domain
							combinations that don't already have prices.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
							<div className="flex gap-3">
								<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
								<div className="text-sm text-amber-900 dark:text-amber-100">
									<p className="font-semibold mb-1">Warning</p>
									<p>
										This will create price entries for all combinations of active
										sites and domains that don't already have a price set.
										Existing prices will not be affected.
									</p>
								</div>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="defaultPrice">Default Price *</Label>
							<div className="relative">
								<span className="absolute left-3 top-2.5 text-muted-foreground">
									$
								</span>
								<Input
									id="defaultPrice"
									type="number"
									step="0.01"
									min="0"
									placeholder="0.50"
									value={defaultPrice}
									onChange={(e) => setDefaultPrice(e.target.value)}
									className="pl-7"
									required
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								This price will be applied to all new entries
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setPopulateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleBulkPopulate}>
							<Sparkles className="mr-2 h-4 w-4" />
							Populate Prices
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={confirmDelete}
				title="Delete Email Price"
				description={`Are you sure you want to delete the price for "${selectedPrice?.site}${selectedPrice?.domain ? ` (.${selectedPrice?.domain})` : " (default)"}"? This action cannot be undone.`}
			/>
		</div>
	);
}

