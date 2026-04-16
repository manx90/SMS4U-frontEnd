import { useState, useEffect } from "react";
import {
	provider3Api,
	countryApi,
	serviceApi,
} from "../../services/api";
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
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Provider3Config() {
	const [rows, setRows] = useState([]);
	const [countries, setCountries] = useState([]);
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState({
		countryId: "",
		serviceId: "",
		price: "",
		upstreamCountryCode: "",
		upstreamServiceName: "",
	});
	const [saving, setSaving] = useState(false);
	const [syncingAll, setSyncingAll] = useState(false);
	const [qcCountry, setQcCountry] = useState("");
	const [qcCode, setQcCode] = useState("");
	const [qsName, setQsName] = useState("");
	const [qsCode, setQsCode] = useState("");
	const [quickSaving, setQuickSaving] = useState(false);

	const load = async () => {
		setLoading(true);
		try {
			const [cfg, cRes, sRes] = await Promise.all([
				provider3Api.configList(),
				countryApi.getAll(),
				serviceApi.getAll(),
			]);
			if (cfg.state === "200" && Array.isArray(cfg.data)) {
				setRows(cfg.data);
			}
			if (cRes.state === "200" && Array.isArray(cRes.data)) {
				setCountries(cRes.data);
			}
			if (sRes.state === "200" && Array.isArray(sRes.data)) {
				setServices(sRes.data);
			}
		} catch (e) {
			toast.error(e?.error || e?.message || "Load failed");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const openCreate = () => {
		setEditingId(null);
		setForm({
			countryId: "",
			serviceId: "",
			price: "",
			upstreamCountryCode: "",
			upstreamServiceName: "",
		});
		setDialogOpen(true);
	};

	const openEdit = (row) => {
		setEditingId(row.id);
		setForm({
			countryId: String(row.country?.id ?? ""),
			serviceId: String(row.service?.id ?? ""),
			price: String(row.price ?? ""),
			upstreamCountryCode: row.upstreamCountryCode || "",
			upstreamServiceName: row.upstreamServiceName || "",
		});
		setDialogOpen(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (editingId) {
				await provider3Api.configUpdate({
					id: editingId,
					price: form.price,
					upstreamCountryCode: form.upstreamCountryCode,
					upstreamServiceName: form.upstreamServiceName,
				});
				toast.success("Updated");
			} else {
				await provider3Api.configCreate({
					countryId: form.countryId,
					serviceId: form.serviceId,
					price: form.price,
					upstreamCountryCode: form.upstreamCountryCode,
					upstreamServiceName: form.upstreamServiceName,
				});
				toast.success("Created");
			}
			setDialogOpen(false);
			load();
		} catch (err) {
			toast.error(
				err?.error || err?.message || "Save failed",
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete this configuration?")) return;
		try {
			await provider3Api.configRemove(id);
			toast.success("Deleted");
			load();
		} catch (err) {
			toast.error(
				err?.error || err?.message || "Delete failed",
			);
		}
	};

	const handleQuickCountry = async () => {
		if (!qcCountry.trim() || !qcCode.trim()) {
			toast.error("Country name and ISO code required");
			return;
		}
		setQuickSaving(true);
		try {
			const res = await provider3Api.adminCountryCreate({
				country: qcCountry.trim(),
				code_country: qcCode.trim(),
			});
			if (res.state === "201") {
				toast.success("Country created (P3 path, no P1/P2)");
				setQcCountry("");
				setQcCode("");
				const cRes = await countryApi.getAll();
				if (cRes.state === "200" && Array.isArray(cRes.data)) {
					setCountries(cRes.data);
				}
			} else {
				toast.error(res.error || "Failed");
			}
		} catch (err) {
			toast.error(
				err?.error || err?.message || "Failed",
			);
		} finally {
			setQuickSaving(false);
		}
	};

	const handleQuickService = async () => {
		if (!qsName.trim() || !qsCode.trim()) {
			toast.error("Service name and code required");
			return;
		}
		setQuickSaving(true);
		try {
			const res = await provider3Api.adminServiceCreate({
				servicename: qsName.trim(),
				code: qsCode.trim(),
			});
			if (res.state === "201") {
				toast.success("Service created (P3 path, no P1/P2 ids)");
				setQsName("");
				setQsCode("");
				const sRes = await serviceApi.getAll();
				if (sRes.state === "200" && Array.isArray(sRes.data)) {
					setServices(sRes.data);
				}
			} else {
				toast.error(res.error || "Failed");
			}
		} catch (err) {
			toast.error(
				err?.error || err?.message || "Failed",
			);
		} finally {
			setQuickSaving(false);
		}
	};

	const handleSyncAll = async () => {
		setSyncingAll(true);
		try {
			const res = await provider3Api.provider3AccessSyncAll();
			if (res.state === "200") {
				const d = res.data;
				if (d?.skipped && d?.reason === "no_provider3_services") {
					toast.info(
						"No Provider 3 rows — add config first.",
					);
				} else if (d?.ok != null) {
					toast.success(
						`Sync: ${d.ok} ok, ${d.failed ?? 0} failed`,
					);
				} else {
					toast.success(res.msg || "Done");
				}
			} else {
				toast.error(res.error || "Sync failed");
			}
		} catch (err) {
			toast.error(
				err?.error || err?.message || "Sync failed",
			);
		} finally {
			setSyncingAll(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold">
						Provider 3 configuration
					</h1>
					<p className="text-muted-foreground mt-1">
						Country + service + upstream codes + price
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="secondary"
						onClick={handleSyncAll}
						disabled={syncingAll}
					>
						{syncingAll ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : null}
						Sync all (accessinfo)
					</Button>
					<Button onClick={openCreate}>
						<Plus className="h-4 w-4 mr-1" />
						Add
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						P3-only: create country / service
					</CardTitle>
					<CardDescription>
						Uses{" "}
						<code className="text-xs">
							/provider3/admin/country-create
						</code>{" "}
						and{" "}
						<code className="text-xs">
							/provider3/admin/service-create
						</code>{" "}
						— no provider 1/2 fields. Then add a config row
						below.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Country name</Label>
						<Input
							value={qcCountry}
							onChange={(e) =>
								setQcCountry(e.target.value)
							}
							placeholder="Italy"
						/>
						<Label>ISO code</Label>
						<Input
							value={qcCode}
							onChange={(e) =>
								setQcCode(e.target.value)
							}
							placeholder="IT"
						/>
						<Button
							type="button"
							variant="secondary"
							disabled={quickSaving}
							onClick={handleQuickCountry}
						>
							Create country
						</Button>
					</div>
					<div className="space-y-2">
						<Label>Service name</Label>
						<Input
							value={qsName}
							onChange={(e) =>
								setQsName(e.target.value)
							}
							placeholder="WhatsApp"
						/>
						<Label>Service code</Label>
						<Input
							value={qsCode}
							onChange={(e) =>
								setQsCode(e.target.value)
							}
							placeholder="wa"
						/>
						<Button
							type="button"
							variant="secondary"
							disabled={quickSaving}
							onClick={handleQuickService}
						>
							Create service
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Admin API (Provider 3)</CardTitle>
					<CardDescription>
						Base URL +{" "}
						<code className="text-xs">/api/v1</code>.
						Header{" "}
						<code className="text-xs">
							Authorization: Bearer
						</code>{" "}
						(admin). المرجع الكامل: ملف المشروع{" "}
						<code className="text-xs">
							SMS4U/PROVIDER3_ADMIN_API.md
						</code>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2 text-muted-foreground font-mono text-xs overflow-x-auto">
					<p>
						GET /provider3/config — list P3 price rows
					</p>
					<p>
						GET
						/provider3/config/create?countryId=&serviceId=&price=&upstreamCountryCode=&upstreamServiceName=
					</p>
					<p>
						GET
						/provider3/config/update?id=&price=&upstreamCountryCode=&upstreamServiceName=
					</p>
					<p>GET /provider3/config/remove?id=</p>
					<p>
						GET /provider3/access-sync?serviceCode=&interval=&serviceName=
					</p>
					<p>GET /provider3/access-sync-all</p>
					<p>
						GET /provider3/admin/country-create?country=&code_country=
					</p>
					<p>
						GET
						/provider3/admin/service-create?servicename=&code=
					</p>
					<p>
						GET /provider3/catalog/countries — countries
						in P3 config (user)
					</p>
					<p>
						GET /provider3/catalog/services?countryId=
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Rows</CardTitle>
					<CardDescription>
						Used by /api/v1/provider3/get-number and pricing
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Country</TableHead>
								<TableHead>Service</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Upstream CC</TableHead>
								<TableHead>Upstream service</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-center text-muted-foreground"
									>
										No rows
									</TableCell>
								</TableRow>
							) : (
								rows.map((r) => (
									<TableRow key={r.id}>
										<TableCell>{r.id}</TableCell>
										<TableCell>
											{r.country?.name}
										</TableCell>
										<TableCell>
											{r.service?.name} (
											{r.service?.code})
										</TableCell>
										<TableCell>{r.price}</TableCell>
										<TableCell>
											{r.upstreamCountryCode}
										</TableCell>
										<TableCell>
											{r.upstreamServiceName}
										</TableCell>
										<TableCell className="text-right space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													openEdit(r)
												}
											>
												<Edit className="h-3 w-3" />
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleDelete(r.id)
												}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-md">
					<form onSubmit={handleSave}>
						<DialogHeader>
							<DialogTitle>
								{editingId ? "Edit" : "Create"} Provider 3
								config
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-3 py-4">
							{!editingId && (
								<>
									<div className="space-y-2">
										<Label>Country</Label>
										<Select
											value={form.countryId}
											onValueChange={(v) =>
												setForm({
													...form,
													countryId: v,
												})
											}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{countries.map((c) => (
													<SelectItem
														key={c.id}
														value={String(
															c.id,
														)}
													>
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Service</Label>
										<Select
											value={form.serviceId}
											onValueChange={(v) =>
												setForm({
													...form,
													serviceId: v,
												})
											}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{services.map((s) => (
													<SelectItem
														key={s.id}
														value={String(
															s.id,
														)}
													>
														{s.name} ({s.code})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</>
							)}
							<div className="space-y-2">
								<Label>Price</Label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={form.price}
									onChange={(e) =>
										setForm({
											...form,
											price: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Upstream country code</Label>
								<Input
									value={form.upstreamCountryCode}
									onChange={(e) =>
										setForm({
											...form,
											upstreamCountryCode:
												e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Upstream service name</Label>
								<Input
									value={form.upstreamServiceName}
									onChange={(e) =>
										setForm({
											...form,
											upstreamServiceName:
												e.target.value,
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
							<Button type="submit" disabled={saving}>
								{saving ? "Saving…" : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
