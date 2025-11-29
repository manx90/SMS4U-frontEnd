import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../../components/shared/CopyButton";
import HeleketPayment from "../../components/payment/HeleketPayment";
import {
	User,
	Key,
	Lock,
	Mail,
	Wallet,
	Shield,
	AlertCircle,
	CreditCard,
} from "lucide-react";

export default function Account() {
	const { user } = useAuth();
	const [passwordData, setPasswordData] =
		useState({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});

	const handlePasswordChange = (e) => {
		e.preventDefault();
		// TODO: Implement password change
	};

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Account Settings
				</h1>
				<p className="text-muted-foreground mt-2">
					Manage your account preferences and
					security
				</p>
			</div>

			<Tabs
				defaultValue="profile"
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="profile">
						Profile
					</TabsTrigger>
					<TabsTrigger value="payment">
						<CreditCard className="h-4 w-4 mr-2" />
						Payment
					</TabsTrigger>
					<TabsTrigger value="security">
						Security
					</TabsTrigger>
					<TabsTrigger value="api">
						API
					</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent
					value="profile"
					className="space-y-4"
				>
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-primary" />
								<CardTitle>
									Profile Information
								</CardTitle>
							</div>
							<CardDescription>
								Your account details and
								information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<User className="h-4 w-4" />
										Username
									</Label>
									<Input
										value={user?.name || ""}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Email
									</Label>
									<Input
										value={
											user?.email || "Not set"
										}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Shield className="h-4 w-4" />
										Role
									</Label>
									<Input
										value={
											user?.role === "admin"
												? "Administrator"
												: "User"
										}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Wallet className="h-4 w-4" />
										Balance
									</Label>
									<Input
										value={`$${
											user?.balance?.toFixed(2) ||
											"0.00"
										}`}
										disabled
										className="font-semibold text-green-600"
									/>
								</div>
							</div>

							<Separator />

							<div className="space-y-2">
								<Label>Account Created</Label>
								<p className="text-sm text-muted-foreground">
									{user?.createdAt
										? new Date(
												user.createdAt,
										  ).toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "long",
													day: "numeric",
												},
										  )
										: "Unknown"}
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Payment Tab */}
				<TabsContent
					value="payment"
					className="space-y-4"
				>
					<HeleketPayment />
				</TabsContent>

				{/* Security Tab */}
				<TabsContent
					value="security"
					className="space-y-4"
				>
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Lock className="h-5 w-5 text-primary" />
								<CardTitle>
									Change Password
								</CardTitle>
							</div>
							<CardDescription>
								Update your password to keep your
								account secure
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handlePasswordChange}
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label htmlFor="currentPassword">
										Current Password
									</Label>
									<Input
										id="currentPassword"
										type="password"
										value={
											passwordData.currentPassword
										}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												currentPassword:
													e.target.value,
											})
										}
										placeholder="Enter current password"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword">
										New Password
									</Label>
									<Input
										id="newPassword"
										type="password"
										value={
											passwordData.newPassword
										}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												newPassword:
													e.target.value,
											})
										}
										placeholder="Enter new password"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">
										Confirm New Password
									</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={
											passwordData.confirmPassword
										}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												confirmPassword:
													e.target.value,
											})
										}
										placeholder="Confirm new password"
									/>
								</div>

								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription className="text-xs">
										Password must be at least 6
										characters long and include a
										mix of letters and numbers
									</AlertDescription>
								</Alert>

								<Button
									type="submit"
									className="w-full"
								>
									Update Password
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				{/* API Tab */}
				<TabsContent
					value="api"
					className="space-y-4"
				>
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Key className="h-5 w-5 text-primary" />
								<CardTitle>API Key</CardTitle>
							</div>
							<CardDescription>
								Your unique API key for
								integration
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription className="text-xs">
									<strong>
										Keep your API key secure!
									</strong>{" "}
									Anyone with this key can access
									your account and make orders.
								</AlertDescription>
							</Alert>

							<div className="space-y-2">
								<Label>Your API Key</Label>
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
									<code className="flex-1 font-mono text-sm break-all">
										{user?.apiKey ||
											"No API key available"}
									</code>
									{user?.apiKey && (
										<CopyButton
											text={user.apiKey}
										/>
									)}
								</div>
							</div>

							<Separator />

							<div className="space-y-3">
								<h4 className="font-semibold text-sm">
									API Usage
								</h4>
								<p className="text-sm text-muted-foreground">
									Use your API key to integrate
									our SMS service into your
									applications. Add it as a query
									parameter in all requests:
								</p>
								<div className="p-3 bg-muted rounded-lg">
									<code className="text-xs">
										GET
										/api/v1/order/get-number?apiKey=YOUR_API_KEY&country=...
									</code>
								</div>
							</div>

							<Separator />

							<div className="space-y-3">
								<h4 className="font-semibold text-sm">
									Account Statistics
								</h4>
								<div className="grid gap-3 md:grid-cols-2">
									<div className="p-3 border rounded-lg">
										<p className="text-xs text-muted-foreground">
											Current Balance
										</p>
										<p className="text-lg font-bold text-green-600">
											$
											{user?.balance?.toFixed(
												2,
											) || "0.00"}
										</p>
									</div>
									<div className="p-3 border rounded-lg">
										<p className="text-xs text-muted-foreground">
											Account Status
										</p>
										<p className="text-lg font-bold text-blue-600">
											Active
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
