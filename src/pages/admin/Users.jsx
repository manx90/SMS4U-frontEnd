import { useState, useEffect } from "react";
import { userApi } from "../../services/api";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmDialog } from "../../components/shared/DeleteConfirmDialog";
import { CopyButton } from "../../components/shared/CopyButton";
import {
	Plus,
	Search,
	MoreVertical,
	Edit,
	Trash2,
	Eye,
	UserPlus,
	DollarSign,
	Key,
} from "lucide-react";
import { toast } from "sonner";

export default function Users() {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] =
		useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] =
		useState("");
	const [dialogOpen, setDialogOpen] =
		useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		useState(false);
	const [selectedUser, setSelectedUser] =
		useState(null);
	const [isEditing, setIsEditing] =
		useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
		balance: 0,
	});

	useEffect(() => {
		loadUsers();
	}, []);

	useEffect(() => {
		// Filter users based on search query
		const filtered = users.filter(
			(user) =>
				user.name
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				user.email
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				user.role
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()),
		);
		console.log(
			"🔍 Filtered users count:",
			filtered.length,
		);
		setFilteredUsers(filtered);
	}, [searchQuery, users]);

	const loadUsers = async () => {
		setLoading(true);
		try {
			const response = await userApi.getAll();
			if (
				response.state === "200" &&
				response.data
			) {
				console.log(
					"📊 API Response - Total users:",
					response.data.length,
				);
				console.log(
					"👥 Users data:",
					response.data,
				);
				setUsers(response.data);
				setFilteredUsers(response.data);
			}
		} catch (error) {
			toast.error("Failed to load users");
			console.error("Load users error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setIsEditing(false);
		setSelectedUser(null);
		setFormData({
			name: "",
			email: "",
			password: "",
			role: "user",
			balance: 0,
		});
		setDialogOpen(true);
	};

	const handleEdit = (user) => {
		setIsEditing(true);
		setSelectedUser(user);
		setFormData({
			name: user.name || "",
			email: user.email || "",
			password: "",
			role: user.role || "user",
			balance: user.balance || 0,
		});
		setDialogOpen(true);
	};

	const handleDelete = (user) => {
		setSelectedUser(user);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			console.log(
				"Attempting to delete user:",
				selectedUser.id,
			);
			const response = await userApi.delete(
				selectedUser.id,
			);
			console.log("Delete response:", response);

			if (response.state === "200") {
				toast.success(
					response.message ||
						"User deleted successfully",
				);
				loadUsers();
				setDeleteDialogOpen(false);
			} else {
				toast.error(
					response.error ||
						response.message ||
						"Failed to delete user",
				);
			}
		} catch (error) {
			console.error("Delete user error:", error);
			toast.error(
				error.message || "Failed to delete user",
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (isEditing) {
				// Update user
				await userApi.update(
					selectedUser.id,
					formData,
				);
				toast.success(
					"User updated successfully",
				);
			} else {
				// Create user
				await userApi.create(formData);
				toast.success(
					"User created successfully",
				);
			}

			setDialogOpen(false);
			loadUsers();
		} catch (error) {
			toast.error(
				isEditing
					? "Failed to update user"
					: "Failed to create user",
			);
			console.error("Submit error:", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "balance"
					? parseFloat(value) || 0
					: value,
		}));
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in-50">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Users Management
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage user accounts and permissions
					</p>
				</div>
				<Button
					onClick={handleCreate}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					Add User
				</Button>
			</div>

			{/* Search Bar */}
			<Card className="glass-card border-primary/10">
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search users by name, email, or role..."
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(e.target.value)
							}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Users Table */}
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>
						All Users ({filteredUsers.length})
					</CardTitle>
					<CardDescription>
						A list of all user accounts in the
						system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto max-h-none">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-b border-muted">
									<TableHead className="font-semibold">
										ID
									</TableHead>
									<TableHead className="font-semibold">
										Name
									</TableHead>
									<TableHead className="font-semibold">
										Email
									</TableHead>
									<TableHead className="font-semibold">
										Role
									</TableHead>
									<TableHead className="font-semibold">
										Balance
									</TableHead>
									<TableHead className="font-semibold">
										API Key
									</TableHead>
									<TableHead className="font-semibold">
										Created
									</TableHead>
									<TableHead className="font-semibold text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={8}
											className="text-center py-8 text-muted-foreground"
										>
											No users found
										</TableCell>
									</TableRow>
								) : (
									filteredUsers.map(
										(user, index) => {
											console.log(
												`Rendering user ${
													index + 1
												}:`,
												user.id,
												user.name,
											);
											return (
												<TableRow
													key={user.id}
													className="hover:bg-muted/50 transition-colors"
												>
													<TableCell className="font-medium">
														{user.id}
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
																{user.name?.[0]?.toUpperCase() ||
																	"U"}
															</div>
															<span className="font-semibold">
																{user.name}
															</span>
														</div>
													</TableCell>
													<TableCell className="text-muted-foreground">
														{user.email ||
															"No email"}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																user.role ===
																"admin"
																	? "default"
																	: "secondary"
															}
															className="capitalize"
														>
															{user.role}
														</Badge>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-green-600 dark:text-green-500 font-semibold">
															<DollarSign className="h-3.5 w-3.5" />
															{user.balance?.toFixed(
																2,
															) || "0.00"}
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<code className="text-xs bg-muted px-2 py-1 rounded font-mono">
																{user.apiKey?.slice(
																	0,
																	12,
																) || "N/A"}
																...
															</code>
															{user.apiKey && (
																<CopyButton
																	text={
																		user.apiKey
																	}
																/>
															)}
														</div>
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{new Date(
															user.createdAt,
														).toLocaleDateString()}
													</TableCell>
													<TableCell className="text-right">
														<DropdownMenu>
															<DropdownMenuTrigger
																asChild
															>
																<Button
																	variant="ghost"
																	size="icon"
																>
																	<MoreVertical className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>
																	Actions
																</DropdownMenuLabel>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() =>
																		handleEdit(
																			user,
																		)
																	}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleDelete(
																			user,
																		)
																	}
																	className="text-destructive"
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	Delete
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											);
										},
									)
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<DialogContent className="sm:max-w-[500px]">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								{isEditing ? (
									<>
										<Edit className="h-5 w-5" />
										Edit User
									</>
								) : (
									<>
										<UserPlus className="h-5 w-5" />
										Create New User
									</>
								)}
							</DialogTitle>
							<DialogDescription>
								{isEditing
									? "Update user information and permissions"
									: "Fill in the details to create a new user account"}
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									Username *
								</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Enter username"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="Enter email address"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">
									Password {!isEditing && "*"}
									{isEditing && (
										<span className="text-xs text-muted-foreground ml-2">
											(Leave blank to keep
											current)
										</span>
									)}
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Enter password"
									required={!isEditing}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="role">
										Role *
									</Label>
									<Select
										value={formData.role}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												role: value,
											}))
										}
									>
										<SelectTrigger id="role">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="user">
												User
											</SelectItem>
											<SelectItem value="admin">
												Admin
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="balance">
										Balance
									</Label>
									<Input
										id="balance"
										name="balance"
										type="number"
										step="0.01"
										value={formData.balance}
										onChange={handleInputChange}
										placeholder="0.00"
									/>
								</div>
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
								{isEditing
									? "Update User"
									: "Create User"}
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
				title="Delete User"
				description={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
			/>
		</div>
	);
}
