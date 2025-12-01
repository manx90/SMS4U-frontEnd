import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { heleketPaymentApi } from "../../services/heleketApi";
import { paymentApi } from "../../services/api";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../shared/CopyButton";
import {
	Wallet,
	CreditCard,
	CheckCircle2,
	XCircle,
	Loader2,
	ExternalLink,
	QrCode,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function HeleketPayment() {
	const { user, updateUserBalance, refreshUserData } = useAuth();
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [invoice, setInvoice] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState(null);
	const [isPolling, setIsPolling] = useState(false);
	const pollingIntervalRef = useRef(null);

	// Restore active invoice from localStorage on mount
	useEffect(() => {
		const restoreInvoice = async () => {
			const savedUuid = localStorage.getItem("activePaymentInvoice");
			if (savedUuid) {
				setLoading(true);
				try {
					const response = await heleketPaymentApi.getPaymentStatus(savedUuid);
					const statusData = response?.result || response?.data;

					if (statusData) {
						// Check if invoice has required data (url, uuid)
						if (!statusData.url || !statusData.uuid) {
							console.warn("Invoice missing URL or UUID, clearing...");
							localStorage.removeItem("activePaymentInvoice");
							setLoading(false);
							return;
						}

						setInvoice(statusData);
						setPaymentStatus(statusData.payment_status);

						if (
							statusData.payment_status !== "paid" &&
							statusData.payment_status !== "expired" &&
							statusData.payment_status !== "failed"
						) {
							startPolling(statusData.uuid);
						} else {
							// If terminal state, clear storage
							localStorage.removeItem("activePaymentInvoice");
						}
					} else {
						// Invalid data, clear storage
						localStorage.removeItem("activePaymentInvoice");
					}
				} catch (error) {
					console.error("Error restoring invoice:", error);
					localStorage.removeItem("activePaymentInvoice");
				} finally {
					setLoading(false);
				}
			}
		};

		restoreInvoice();

		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
		};
	}, []);

	// Stop polling when payment is completed or expired
	useEffect(() => {
		if (
			paymentStatus === "paid" ||
			paymentStatus === "expired" ||
			paymentStatus === "failed"
		) {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
				setIsPolling(false);
			}
			// Clear active invoice from storage
			localStorage.removeItem("activePaymentInvoice");
		}
	}, [paymentStatus]);

	// Polling function to check payment status
	const startPolling = (invoiceUuid) => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}

		setIsPolling(true);
		pollingIntervalRef.current = setInterval(async () => {
			try {
				const response = await heleketPaymentApi.getPaymentStatus(
					invoiceUuid,
				);

				// Backend returns { state: "200", result: {...}, data: {...} }
				const statusData = response?.result || response?.data;

				if (statusData) {
					const status = statusData.payment_status;
					setPaymentStatus(status);

					// Update invoice data
					setInvoice((prev) => ({
						...prev,
						...statusData,
					}));

					// If paid, update balance and stop polling
					if (status === "paid") {
						await handlePaymentSuccess(statusData);
					}
				}
			} catch (error) {
				console.error("Error checking payment status:", error);
			}
		}, 8000); // Check every 8 seconds
	};

	const handlePaymentSuccess = async (paymentData) => {
		try {
			// Calculate amount in USDT
			// Use merchant_amount if available (this is what user actually receives)
			// Otherwise use payment_amount or amount
			const paidAmount =
				parseFloat(paymentData.merchant_amount) ||
				parseFloat(paymentData.payment_amount) ||
				parseFloat(paymentData.amount) ||
				0;

			// Note: Balance is automatically updated by Backend webhook when payment is confirmed
			// Refresh user data from server to show updated balance
			await refreshUserData();

			toast.success(
				`Payment successful! ${paidAmount.toFixed(2)} USDT has been added to your balance.`,
			);

			// Stop polling
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
				setIsPolling(false);
			}
		} catch (error) {
			console.error("Error handling payment success:", error);
			// Try to refresh user data anyway
			try {
				await refreshUserData();
			} catch (refreshError) {
				console.error("Error refreshing user data:", refreshError);
			}
			toast.success(
				"Payment successful! Your balance has been updated.",
			);
		}
	};

	const handleCreateInvoice = async (e) => {
		e.preventDefault();

		if (!amount || parseFloat(amount) <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		const minAmount = 0.5; // Minimum amount in USDT
		if (parseFloat(amount) < minAmount) {
			toast.error(`Minimum amount is ${minAmount} USDT`);
			return;
		}

		setLoading(true);
		setPaymentStatus(null);

		try {
			// Close any existing active invoice first
			if (invoice && invoice.uuid) {
				// Stop polling if active
				if (pollingIntervalRef.current) {
					clearInterval(pollingIntervalRef.current);
					pollingIntervalRef.current = null;
					setIsPolling(false);
				}
				// Clear the invoice state
				setInvoice(null);
				setPaymentStatus(null);
				// Clear localStorage
				localStorage.removeItem("activePaymentInvoice");
			}

			// Generate unique order ID
			const orderId = `payment_${user?.id || "user"}_${Date.now()}`;

			// Create invoice (Backend will automatically close any active invoices)
			const response = await heleketPaymentApi.createInvoice(
				amount,
				orderId,
				{
					additionalData: JSON.stringify({
						userId: user?.id,
						userName: user?.name,
					}),
				},
			);

			// Backend returns { state: "200", result: {...}, data: {...} }
			if (response?.state === "200" && response?.result) {
				const invoiceData = response.result;
				
				// Validate that invoice has required fields
				if (!invoiceData.uuid || !invoiceData.url) {
					throw new Error("Invalid invoice response: missing UUID or URL");
				}

				setInvoice(invoiceData);
				setPaymentStatus(invoiceData.payment_status);

				// Start polling if payment is not yet completed
				if (
					invoiceData.payment_status !== "paid" &&
					invoiceData.payment_status !== "expired"
				) {
					startPolling(invoiceData.uuid);
				}

				// Save to localStorage
				localStorage.setItem("activePaymentInvoice", invoiceData.uuid);

				toast.success("Payment invoice created successfully!");
			} else if (response?.state === "200" && response?.data) {
				// Fallback: if result is not available, use data
				const invoiceData = response.data;
				
				// Validate that invoice has required fields
				if (!invoiceData.uuid || !invoiceData.url) {
					throw new Error("Invalid invoice response: missing UUID or URL");
				}

				setInvoice(invoiceData);
				setPaymentStatus(invoiceData.payment_status);

				if (
					invoiceData.payment_status !== "paid" &&
					invoiceData.payment_status !== "expired"
				) {
					startPolling(invoiceData.uuid);
				}

				// Save to localStorage
				localStorage.setItem("activePaymentInvoice", invoiceData.uuid);

				toast.success("Payment invoice created successfully!");
			} else {
				throw new Error(
					response?.error ||
					response?.message ||
					"Failed to create invoice",
				);
			}
		} catch (error) {
			console.error("Error creating invoice:", error);

			// Handle specific error messages
			let errorMessage = "Failed to create payment invoice. Please try again.";

			if (error?.error) {
				errorMessage = error.error;
			} else if (error?.message) {
				errorMessage = error.message;
			} else if (error?.response?.data?.error) {
				errorMessage = error.response.data.error;
			} else if (error?.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			// Show specific message for configuration errors
			if (errorMessage.includes("not configured") || errorMessage.includes("not configured")) {
				toast.error("Payment service is not configured on the server. Please contact support.");
			} else {
				toast.error(errorMessage);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setAmount("");
		setInvoice(null);
		setPaymentStatus(null);
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
		setIsPolling(false);
		localStorage.removeItem("activePaymentInvoice");
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "paid":
				return "text-green-600";
			case "expired":
			case "failed":
				return "text-red-600";
			case "check":
			case "wait":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "paid":
				return <CheckCircle2 className="h-5 w-5 text-green-600" />;
			case "expired":
			case "failed":
				return <XCircle className="h-5 w-5 text-red-600" />;
			default:
				return <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />;
		}
	};

	return (
		<div className="space-y-6">
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<div className="flex items-center gap-2">
						<CreditCard className="h-5 w-5 text-primary" />
						<CardTitle>Add Funds</CardTitle>
					</div>
					<CardDescription>
						Add funds to your account using cryptocurrency
						payments via Heleket
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{!invoice ? (
						<form
							onSubmit={handleCreateInvoice}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="amount">
									Amount (USDT)
								</Label>
								<Input
									id="amount"
									type="number"
									step="0.01"
									min="0.5"
									value={amount}
									onChange={(e) =>
										setAmount(e.target.value)
									}
									placeholder="Enter amount (minimum 0.50 USDT)"
									required
									disabled={loading}
								/>
								<p className="text-xs text-muted-foreground">
									Minimum amount: 0.50 USDT
								</p>
							</div>

							<Alert>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription className="text-xs">
									You can pay using any supported
									cryptocurrency. Your balance will be
									credited in USDT.
								</AlertDescription>
							</Alert>

							<Button
								type="submit"
								className="w-full"
								disabled={loading || !amount}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Invoice...
									</>
								) : (
									<>
										<Wallet className="mr-2 h-4 w-4" />
										Create Payment Invoice
									</>
								)}
							</Button>
						</form>
					) : (
						<div className="space-y-6">
							{/* Payment Status */}
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									{getStatusIcon(paymentStatus)}
									<div>
										<p className="font-semibold">
											Payment Status
										</p>
										<p
											className={`text-sm ${getStatusColor(
												paymentStatus,
											)}`}
										>
											{paymentStatus?.toUpperCase() ||
												"PENDING"}
										</p>
									</div>
								</div>
								{isPolling && (
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin" />
										Checking...
									</div>
								)}
							</div>

							{/* Payment Amount */}
							<div className="grid gap-4 md:grid-cols-2">
								<div className="p-4 border rounded-lg">
									<p className="text-xs text-muted-foreground mb-1">
										Invoice Amount
									</p>
									<p className="text-2xl font-bold">
										{invoice.amount} USDT
									</p>
								</div>
								{invoice.payer_amount && (
									<div className="p-4 border rounded-lg">
										<p className="text-xs text-muted-foreground mb-1">
											Amount to Pay
										</p>
										<p className="text-2xl font-bold">
											{invoice.payer_amount}{" "}
											{invoice.payer_currency}
										</p>
									</div>
								)}
							</div>

							{/* Wallet Address */}
							{invoice.address && (
								<div className="space-y-2">
									<Label>Wallet Address</Label>
									<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
										<code className="flex-1 font-mono text-sm break-all">
											{invoice.address}
										</code>
										<CopyButton text={invoice.address} />
									</div>
								</div>
							)}

							{/* QR Code */}
							{invoice.address_qr_code && (
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<QrCode className="h-4 w-4" />
										QR Code
									</Label>
									<div className="flex justify-center p-4 bg-muted rounded-lg">
										<img
											src={invoice.address_qr_code}
											alt="Payment QR Code"
											className="max-w-xs"
										/>
									</div>
								</div>
							)}

							{/* Payment URL */}
							{invoice.url && (
								<div className="space-y-2">
									<Label>Payment Page</Label>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											className="flex-1"
											onClick={() =>
												window.open(
													invoice.url,
													"_blank",
												)
											}
										>
											<ExternalLink className="mr-2 h-4 w-4" />
											Open Payment Page
										</Button>
									</div>
								</div>
							)}

							<Separator />

							{/* Actions */}
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={handleReset}
									className="flex-1"
								>
									Create New Invoice
								</Button>
								{invoice.url && (
									<Button
										onClick={() =>
											window.open(
												invoice.url,
												"_blank",
											)
										}
										className="flex-1"
									>
										<ExternalLink className="mr-2 h-4 w-4" />
										Pay Now
									</Button>
								)}
							</div>

							{/* Expiration Info */}
							{invoice.expired_at && (
								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription className="text-xs">
										Invoice expires at:{" "}
										{new Date(
											invoice.expired_at * 1000,
										).toLocaleString()}
									</AlertDescription>
								</Alert>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

