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
import { Textarea } from "@/components/ui/textarea";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "../../components/shared/DeleteConfirmDialog";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Mail,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailSites() {
	const [sites, setSites] = useState([]);
	const [filteredSites, setFilteredSites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedSite, setSelectedSite] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		display_name: "",
		api_name: "",
		description: "",
		status: true,
	});

	useEffect(() => {
		loadSites();
	}, []);

	useEffect(() => {
		const filtered = sites.filter((site) =>
			site.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			site.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredSites(filtered);
	}, [searchQuery, sites]);

	const loadSites = async () => {
		setLoading(true);
		try {
			const response = await emailAdminApi.getAllSites();
			if (response.state === "200" && response.data) {
				setSites(response.data);
				setFilteredSites(response.data);
			}
		} catch (error) {
			toast.error(`Failed to load email sites: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelectedSite(null);
		setFormData({
			name: "",
			display_name: "",
			api_name: "",
			description: "",
			status: true,
		});
		setDialogOpen(true);
	};

	const handleEdit = (site) => {
		setIsEditing(true);
		setSelectedSite(site);
		setFormData({
			name: site.name || "",
			display_name: site.display_name || "",
			api_name: site.api_name || "",
			description: site.description || "",
			status: site.status ?? true,
		});
		setDialogOpen(true);
	};

	const handleDelete = (site) => {
		setSelectedSite(site);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await emailAdminApi.deleteSite(selectedSite.id);
			toast.success("Email site deleted successfully");
			loadSites();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(`Failed to delete email site: ${error.message}`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await emailAdminApi.updateSite(selectedSite.id, formData);
				toast.success("Email site updated successfully");
			} else {
				await emailAdminApi.createSite(formData);
				toast.success("Email site created successfully");
			}
			setDialogOpen(false);
			loadSites();
		} catch (error) {
			toast.error(
				isEditing
					? `Failed to update email site: ${error.message}`
					: "Failed to create email site"
			);
		}
	};

	const handleToggleStatus = async (site) => {
		try {
			await emailAdminApi.updateSite(site.id, {
				status: !site.status,
			});
			toast.success("Status updated successfully");
			loadSites();
		} catch (error) {
			toast.error(`Failed to update status: ${error.message}`);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Email Sites</h2>
				<p className="text-muted-foreground">
					Manage email service providers (Gmail, Outlook, etc.)
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Sites
						</CardTitle>
						<Mail className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{sites.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Sites
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sites.filter((s) => s.status).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Inactive Sites
						</CardTitle>
						<XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sites.filter((s) => !s.status).length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<CardTitle>Email Sites List</CardTitle>
							<CardDescription>
								View and manage all email sites
							</CardDescription>
						</div>
						<Button onClick={handleCreate}>
							<Plus className="mr-2 h-4 w-4" />
							Add Email Site
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search Bar */}
					<div className="flex items-center gap-2 mb-4">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search email sites..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					{/* Sites Table */}
					{loading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : filteredSites.length === 0 ? (
						<div className="text-center py-10">
							<Mail className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="mt-4 text-lg font-semibold">
								No email sites found
							</h3>
							<p className="text-sm text-muted-foreground">
								{searchQuery
									? "Try adjusting your search"
									: "Get started by creating a new email site"}
							</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Display Name</TableHead>
										<TableHead>API Name</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredSites.map((site) => (
										<TableRow key={site.id}>
											<TableCell className="font-medium">
												{site.name}
											</TableCell>
											<TableCell>{site.display_name}</TableCell>
											<TableCell>
												<code className="text-xs bg-muted px-1 py-0.5 rounded">
													{site.api_name || "N/A"}
												</code>
											</TableCell>
											<TableCell className="max-w-xs truncate">
												{site.description || "No description"}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Switch
														checked={site.status}
														onCheckedChange={() =>
															handleToggleStatus(site)
														}
													/>
													<Badge
														variant={site.status ? "default" : "secondary"}
													>
														{site.status ? "Active" : "Inactive"}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleEdit(site)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(site)}
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
								{isEditing ? "Edit Email Site" : "Create Email Site"}
							</DialogTitle>
							<DialogDescription>
								{isEditing
									? "Update the email site details"
									: "Add a new email service provider"}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									placeholder="gmail"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
								<p className="text-xs text-muted-foreground">
									Lowercase identifier (e.g., gmail, outlook)
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="display_name">Display Name *</Label>
								<Input
									id="display_name"
									placeholder="Gmail"
									value={formData.display_name}
									onChange={(e) =>
										setFormData({
											...formData,
											display_name: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="api_name">API Name</Label>
								<Input
									id="api_name"
									placeholder="gmail"
									value={formData.api_name}
									onChange={(e) =>
										setFormData({ ...formData, api_name: e.target.value })
									}
								/>
								<p className="text-xs text-muted-foreground">
									Optional: API-specific identifier
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									placeholder="Google Gmail service"
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									rows={3}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="status">Active Status</Label>
								<Switch
									id="status"
									checked={formData.status}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, status: checked })
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

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={confirmDelete}
				title="Delete Email Site"
				description={`Are you sure you want to delete "${selectedSite?.display_name}"? This action cannot be undone.`}
			/>
		</div>
	);
}

