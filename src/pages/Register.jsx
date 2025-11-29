import { useState, useEffect } from "react";
import {
	useNavigate,
	Link,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Alert,
	AlertDescription,
} from "@/components/ui/alert";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Progress } from "@/components/ui/progress";
import {
	Loader2,
	UserPlus,
	User,
	Mail,
	Lock,
	AlertCircle,
	Check,
	X,
} from "lucide-react";

export default function Register() {
	const navigate = useNavigate();
	const {
		register,
		isAuthenticated,
		user,
		loading,
	} = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] =
		useState(false);

	// Redirect if already logged in
	useEffect(() => {
		if (!loading && isAuthenticated && user) {
			const redirectPath =
				user.role === "admin"
					? "/admin/dashboard"
					: "/user/get-service";
			navigate(redirectPath, { replace: true });
		}
	}, [isAuthenticated, user, loading, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	// Password strength calculator
	const calculatePasswordStrength = (
		password,
	) => {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (
			password.match(/[a-z]/) &&
			password.match(/[A-Z]/)
		)
			strength += 25;
		if (password.match(/\d/)) strength += 25;
		if (password.match(/[^a-zA-Z\d]/))
			strength += 25;
		return strength;
	};

	const passwordStrength =
		calculatePasswordStrength(formData.password);
	const getStrengthColor = () => {
		if (passwordStrength < 50)
			return "bg-red-500";
		if (passwordStrength < 75)
			return "bg-yellow-500";
		return "bg-green-500";
	};

	const getStrengthText = () => {
		if (passwordStrength < 50) return "Weak";
		if (passwordStrength < 75) return "Medium";
		return "Strong";
	};

	// Password validation rules
	const passwordRules = [
		{
			text: "At least 8 characters",
			met: formData.password.length >= 8,
		},
		{
			text: "Contains uppercase & lowercase",
			met:
				/[a-z]/.test(formData.password) &&
				/[A-Z]/.test(formData.password),
		},
		{
			text: "Contains a number",
			met: /\d/.test(formData.password),
		},
		{
			text: "Contains special character",
			met: /[^a-zA-Z\d]/.test(formData.password),
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (
			!formData.name ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError("Please fill in all fields");
			return;
		}

		if (
			formData.password !==
			formData.confirmPassword
		) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError(
				"Password must be at least 6 characters long",
			);
			return;
		}

		// Email validation
		const emailRegex =
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			setError(
				"Please enter a valid email address",
			);
			return;
		}

		setIsLoading(true);

		try {
			const result = await register(
				formData.name,
				formData.email,
				formData.password,
			);

			if (result.success) {
				// Now that registration logs you in automatically,
				// redirect to appropriate dashboard
				const redirectPath =
					result.user.role === "admin"
						? "/admin/dashboard"
						: "/user/get-service";
				setTimeout(() => {
					navigate(redirectPath, {
						replace: true,
					});
				}, 1000);
			} else {
				setError(
					result.error || "Registration failed",
				);
			}
		} catch (err) {
			setError(
				err.message ||
					"An error occurred during registration",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4">
			{/* <BackgroundGradientAnimation className="absolute inset-0" /> */}

			<Card className="w-full max-w-md relative z-10 glass-card border-primary/20 shadow-2xl">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-center mb-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/50">
							<UserPlus className="h-6 w-6" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-center">
						Create Account
					</CardTitle>
					<CardDescription className="text-center">
						Sign up to get started with our SMS
						service
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert
								variant="destructive"
								className="animate-in fade-in-50"
							>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									{error}
								</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="text-sm font-medium"
							>
								Username
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Enter your username"
									value={formData.name}
									onChange={handleChange}
									disabled={isLoading}
									className="pl-10 h-11"
									autoComplete="username"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium"
							>
								Email
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleChange}
									disabled={isLoading}
									className="pl-10 h-11"
									autoComplete="email"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium"
							>
								Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Create a password"
									value={formData.password}
									onChange={handleChange}
									disabled={isLoading}
									className="pl-10 h-11"
									autoComplete="new-password"
									required
								/>
							</div>

							{formData.password && (
								<div className="space-y-2 mt-2">
									<div className="flex items-center justify-between text-xs">
										<span className="text-muted-foreground">
											Password strength:
										</span>
										<span
											className={`font-medium ${
												passwordStrength < 50
													? "text-red-500"
													: passwordStrength < 75
													? "text-yellow-500"
													: "text-green-500"
											}`}
										>
											{getStrengthText()}
										</span>
									</div>
									<Progress
										value={passwordStrength}
										className={`h-1.5 ${getStrengthColor()}`}
									/>

									<div className="space-y-1 mt-2">
										{passwordRules.map(
											(rule, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-xs"
												>
													{rule.met ? (
														<Check className="h-3 w-3 text-green-500" />
													) : (
														<X className="h-3 w-3 text-muted-foreground" />
													)}
													<span
														className={
															rule.met
																? "text-green-500"
																: "text-muted-foreground"
														}
													>
														{rule.text}
													</span>
												</div>
											),
										)}
									</div>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="confirmPassword"
								className="text-sm font-medium"
							>
								Confirm Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									placeholder="Confirm your password"
									value={formData.confirmPassword}
									onChange={handleChange}
									disabled={isLoading}
									className="pl-10 h-11"
									autoComplete="new-password"
									required
								/>
							</div>
							{formData.confirmPassword &&
								formData.password !==
									formData.confirmPassword && (
									<p className="text-xs text-red-500 flex items-center gap-1">
										<X className="h-3 w-3" />
										Passwords do not match
									</p>
								)}
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4 mt-4">
						<Button
							type="submit"
							className="w-full h-11 font-semibold"
							disabled={
								isLoading ||
								formData.password !==
									formData.confirmPassword
							}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Sign Up"
							)}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-primary hover:underline transition-colors"
							>
								Login
							</Link>
						</div>

						<div className="text-center text-sm">
							<Link
								to="/"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								← Back to Home
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
