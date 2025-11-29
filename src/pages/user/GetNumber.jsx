import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	countryApi,
	serviceApi,
	orderApi,
	// pricingApi,
} from "../../services/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui/radio-group";
import {
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "../../components/shared/CopyButton";
import {
	Phone,
	CheckCircle,
	AlertCircle,
	Loader2,
	DollarSign,
	Globe,
	Package,
} from "lucide-react";
import { toast } from "sonner";

export default function GetNumber() {
	const { user, updateUserBalance } = useAuth();
	const [countries, setCountries] = useState([]);
	const [services, setServices] = useState([]);
	const [pricing, setPricing] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] =
		useState(false);
	const [
		successDialogOpen,
		setSuccessDialogOpen,
	] = useState(false);
	const [receivedNumber, setReceivedNumber] =
		useState("");
	const [formData, setFormData] = useState({
		country: "",
		service: "",
		provider: "1",
	});
	const [estimatedPrice, setEstimatedPrice] =
		useState(0);

	useEffect(() => {
		loadData();
	}, []);

	const calculatePrice = useCallback(() => {
		if (formData.country && formData.service) {
			// Find the country and service IDs
			const country = countries.find(
				(c) => c.provider1 === formData.country,
			);
			const service = services.find(
				(s) => s.provider1 === formData.service,
			);

			// Find the pricing configuration
			if (country && service) {
				const priceConfig = pricing.find(
					(p) =>
						p.country?.id === country.id &&
						p.service?.id === service.id,
				);
				setEstimatedPrice(
					priceConfig?.price || 0,
				);
			} else {
				setEstimatedPrice(0);
			}
		} else {
			setEstimatedPrice(0);
		}
	}, [formData.country, formData.service, countries, services, pricing]);

	useEffect(() => {
		calculatePrice();
	}, [calculatePrice]);

	const loadData = async () => {
		setLoading(true);
		try {
			const [
				countriesRes,
				servicesRes,
				pricingRes,
			] = await Promise.all([
				countryApi.getAll(),
				serviceApi.getAll(),
				// pricingApi.getAll(),
			]);
			if (countriesRes.state === "200")
				setCountries(countriesRes.data || []);
			if (servicesRes.state === "200")
				setServices(servicesRes.data || []);
			if (pricingRes.state === "200")
				setPricing(pricingRes.data || []);
		} catch (error) {
			toast.error(`Failed to load data: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.country || !formData.service) {
			toast.error(
				"Please select both country and service",
			);
			return;
		}

		// Check balance
		if (user.balance < estimatedPrice) {
			toast.error(
				"Insufficient balance. Please add funds to your account.",
			);
			return;
		}

		setSubmitting(true);

		try {
			const response = await orderApi.getNumber(
				formData.country,
				formData.service,
				formData.provider,
			);

			if (
				response.state === "200" &&
				response.data
			) {
				setReceivedNumber(response.data);
				setSuccessDialogOpen(true);

				// Update user balance
				updateUserBalance(
					user.balance - estimatedPrice,
				);

				// Reset form
				setFormData({
					country: "",
					service: "",
					provider: "1",
				});
			} else {
				throw new Error(
					response.msg || "Failed to get number",
				);
			}
		} catch (error) {
			toast.error(
				error.message || "Failed to get number",
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	const selectedCountry = countries.find(
		(c) => c.provider1 === formData.country,
	);

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Get SMS Number
				</h1>
				<p className="text-muted-foreground mt-2">
					Order a temporary phone number to
					receive SMS
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Form */}
				<Card className="glass-card border-primary/10 lg:col-span-2">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Phone className="h-5 w-5 text-primary" />
							<CardTitle>Order Details</CardTitle>
						</div>
						<CardDescription>
							Select country, service, and
							provider to get your number
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Country Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="country"
									className="flex items-center gap-2"
								>
									<Globe className="h-4 w-4" />
									Country *
								</Label>
								<Select
									value={formData.country}
									onValueChange={(value) =>
										setFormData({
											...formData,
											country: value,
										})
									}
								>
									<SelectTrigger id="country">
										<SelectValue placeholder="Select a country" />
									</SelectTrigger>
									<SelectContent>
										{countries.map((country) => (
											<SelectItem
												key={country.id}
												value={country.provider1}
											>
												{country.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Service Selection */}
							<div className="space-y-2">
								<Label
									htmlFor="service"
									className="flex items-center gap-2"
								>
									<Package className="h-4 w-4" />
									Service *
								</Label>
								<Select
									value={formData.service}
									onValueChange={(value) =>
										setFormData({
											...formData,
											service: value,
										})
									}
								>
									<SelectTrigger id="service">
										<SelectValue placeholder="Select a service" />
									</SelectTrigger>
									<SelectContent>
										{services.map((service) => (
											<SelectItem
												key={service.id}
												value={service.provider1}
											>
												{service.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Provider Selection */}
							<div className="space-y-2">
								<Label>Provider</Label>
								<RadioGroup
									value={formData.provider}
									onValueChange={(value) =>
										setFormData({
											...formData,
											provider: value,
										})
									}
								>
									<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
										<RadioGroupItem
											value="1"
											id="provider1"
										/>
										<Label
											htmlFor="provider1"
											className="flex-1 cursor-pointer"
										>
											Provider 1
										</Label>
									</div>
									<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
										<RadioGroupItem
											value="2"
											id="provider2"
										/>
										<Label
											htmlFor="provider2"
											className="flex-1 cursor-pointer"
										>
											Provider 2
										</Label>
									</div>
								</RadioGroup>
							</div>

							{/* Balance Warning */}
							{user.balance < estimatedPrice &&
								estimatedPrice > 0 && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											Insufficient balance! You
											need $
											{estimatedPrice.toFixed(2)}{" "}
											but have $
											{user.balance.toFixed(2)}
										</AlertDescription>
									</Alert>
								)}

							<Button
								type="submit"
								className="w-full h-12 text-base font-semibold"
								disabled={
									submitting ||
									user.balance < estimatedPrice
								}
							>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Phone className="mr-2 h-5 w-5" />
										Get Number - $
										{estimatedPrice.toFixed(2)}
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Summary */}
				<div className="space-y-4">
					<Card className="glass-card border-primary/10">
						<CardHeader>
							<CardTitle className="text-lg">
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Your Balance:
									</span>
									<span className="font-semibold text-green-600">
										$
										{user?.balance?.toFixed(2) ||
											"0.00"}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Estimated Cost:
									</span>
									<span className="font-semibold">
										${estimatedPrice.toFixed(2)}
									</span>
								</div>
								{estimatedPrice > 0 && (
									<div className="flex justify-between text-sm pt-2 border-t">
										<span className="text-muted-foreground">
											Balance After:
										</span>
										<span className="font-semibold text-blue-600">
											$
											{(
												user?.balance -
												estimatedPrice
											).toFixed(2)}
										</span>
									</div>
								)}
							</div>

							{selectedCountry && (
								<div className="pt-4 border-t space-y-2">
									<p className="text-sm font-semibold">
										Selected Country:
									</p>
									<p className="text-sm text-muted-foreground">
										{selectedCountry.country}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-xs">
							After ordering, you'll have 20
							minutes to receive an SMS. If no SMS
							is received within this time, you'll
							be automatically refunded.
						</AlertDescription>
					</Alert>
				</div>
			</div>

			{/* Success Dialog */}
			<Dialog
				open={successDialogOpen}
				onOpenChange={setSuccessDialogOpen}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<div className="flex items-center justify-center mb-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
								<CheckCircle className="h-10 w-10 text-green-500" />
							</div>
						</div>
						<DialogTitle className="text-center text-2xl">
							Number Received!
						</DialogTitle>
						<DialogDescription className="text-center">
							Your SMS number is ready to use
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="p-4 bg-muted rounded-lg">
							<p className="text-xs text-muted-foreground mb-2 text-center">
								Your Number
							</p>
							<div className="flex items-center justify-center gap-2">
								<code className="text-2xl font-bold font-mono">
									{receivedNumber}
								</code>
								<CopyButton
									text={receivedNumber}
								/>
							</div>
						</div>
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription className="text-xs">
								Go to "My Orders" to check for
								incoming messages. Messages
								typically arrive within a few
								minutes.
							</AlertDescription>
						</Alert>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() =>
								setSuccessDialogOpen(false)
							}
							className="flex-1"
						>
							Close
						</Button>
						<Button
							onClick={() => {
								setSuccessDialogOpen(false);
								window.location.href =
									"/user/orders";
							}}
							className="flex-1"
						>
							View Orders
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
