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
	Globe,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailDomains() {
	const [domains, setDomains] = useState([]);
	const [filteredDomains, setFilteredDomains] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDomain, setSelectedDomain] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		display_name: "",
		api_name: "",
		description: "",
		status: true,
	});

	useEffect(() => {
		loadDomains();
	}, []);

	useEffect(() => {
		const filtered = domains.filter((domain) =>
			domain.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			domain.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredDomains(filtered);
	}, [searchQuery, domains]);

	const loadDomains = async () => {
		setLoading(true);
		try {
			const response = await emailAdminApi.getAllDomains();
			if (response.state === "200" && response.data) {
				setDomains(response.data);
				setFilteredDomains(response.data);
			}
		} catch (error) {
			toast.error(`Failed to load email domains: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelectedDomain(null);
		setFormData({
			name: "",
			display_name: "",
			api_name: "",
			description: "",
			status: true,
		});
		setDialogOpen(true);
	};

	const handleEdit = (domain) => {
		setIsEditing(true);
		setSelectedDomain(domain);
		setFormData({
			name: domain.name || "",
			display_name: domain.display_name || "",
			api_name: domain.api_name || "",
			description: domain.description || "",
			status: domain.status ?? true,
		});
		setDialogOpen(true);
	};

	const handleDelete = (domain) => {
		setSelectedDomain(domain);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await emailAdminApi.deleteDomain(selectedDomain.id);
			toast.success("Email domain deleted successfully");
			loadDomains();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error(`Failed to delete email domain: ${error.message}`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await emailAdminApi.updateDomain(selectedDomain.id, formData);
				toast.success("Email domain updated successfully");
			} else {
				await emailAdminApi.createDomain(formData);
				toast.success("Email domain created successfully");
			}
			setDialogOpen(false);
			loadDomains();
		} catch (error) {
			toast.error(
				isEditing
					? `Failed to update email domain: ${error.message}`
					: `Failed to create email domain: ${error.message}`
			);
		}
	};

	const handleToggleStatus = async (domain) => {
		try {
			await emailAdminApi.updateDomain(domain.id, {
				status: !domain.status,
			});
			toast.success("Status updated successfully");
			loadDomains();
		} catch (error) {
			toast.error(`Failed to update status: ${error.message}`);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Email Domains</h2>
				<p className="text-muted-foreground">
					Manage email domain extensions (.com, .ru, .net, etc.)
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Domains
						</CardTitle>
						<Globe className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{domains.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Domains
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{domains.filter((d) => d.status).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Inactive Domains
						</CardTitle>
						<XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{domains.filter((d) => !d.status).length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<CardTitle>Email Domains List</CardTitle>
							<CardDescription>
								View and manage all email domains
							</CardDescription>
						</div>
						<Button onClick={handleCreate}>
							<Plus className="mr-2 h-4 w-4" />
							Add Email Domain
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search Bar */}
					<div className="flex items-center gap-2 mb-4">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search email domains..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					{/* Domains Table */}
					{loading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : filteredDomains.length === 0 ? (
						<div className="text-center py-10">
							<Globe className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="mt-4 text-lg font-semibold">
								No email domains found
							</h3>
							<p className="text-sm text-muted-foreground">
								{searchQuery
									? "Try adjusting your search"
									: "Get started by creating a new email domain"}
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
									{filteredDomains.map((domain) => (
										<TableRow key={domain.id}>
											<TableCell className="font-medium">
												{domain.name}
											</TableCell>
											<TableCell>{domain.display_name}</TableCell>
											<TableCell>
												<code className="text-xs bg-muted px-1 py-0.5 rounded">
													{domain.api_name || "N/A"}
												</code>
											</TableCell>
											<TableCell className="max-w-xs truncate">
												{domain.description || "No description"}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Switch
														checked={domain.status}
														onCheckedChange={() =>
															handleToggleStatus(domain)
														}
													/>
													<Badge
														variant={domain.status ? "default" : "secondary"}
													>
														{domain.status ? "Active" : "Inactive"}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleEdit(domain)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(domain)}
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
								{isEditing ? "Edit Email Domain" : "Create Email Domain"}
							</DialogTitle>
							<DialogDescription>
								{isEditing
									? "Update the email domain details"
									: "Add a new email domain extension"}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									placeholder="com"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
								<p className="text-xs text-muted-foreground">
									Lowercase identifier without dot (e.g., com, ru, net)
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="display_name">Display Name *</Label>
								<Input
									id="display_name"
									placeholder=".com"
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
									placeholder="com"
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
									placeholder="Commercial domain"
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
				title="Delete Email Domain"
				description={`Are you sure you want to delete "${selectedDomain?.display_name}"? This action cannot be undone.`}
			/>
		</div>
	);
}

