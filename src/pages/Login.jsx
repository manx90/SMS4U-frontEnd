import { useState, useEffect } from "react";
import {
	useNavigate,
	Link,
	useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
import {
	Loader2,
	Lock,
	User,
	AlertCircle,
} from "lucide-react";

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const {
		login,
		isAuthenticated,
		user,
		loading,
	} = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] =
		useState(false);

	const from =
		location.state?.from?.pathname || "/";

	// Redirect if already logged in
	useEffect(() => {
		if (!loading && isAuthenticated && user) {
			const redirectPath =
				user.role === "admin"
					? "/admin/dashboard"
					: "/user/get-service";
			navigate(
				from === "/" ? redirectPath : from,
				{ replace: true },
			);
		}
	}, [
		isAuthenticated,
		user,
		loading,
		navigate,
		from,
	]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!formData.name || !formData.password) {
			setError("Please fill in all fields");
			return;
		}

		setIsLoading(true);

		try {
			const result = await login(
				formData.name,
				formData.password,
			);

			if (result.success) {
				// Redirect based on user role
				const redirectPath =
					result.user.role === "admin"
						? "/admin/dashboard"
						: "/user/get-service";
				navigate(
					from === "/" ? redirectPath : from,
					{ replace: true },
				);
			} else {
				setError(result.error || "Login failed");
			}
		} catch (err) {
			setError(
				err.message ||
					"An error occurred during login",
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
							<Lock className="h-6 w-6" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-center">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access your
						account
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4 mb-10">
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
									placeholder="Enter your password"
									value={formData.password}
									onChange={handleChange}
									disabled={isLoading}
									className="pl-10 h-11"
									autoComplete="current-password"
									required
								/>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button
							type="submit"
							className="w-full h-11 font-semibold"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Logging in...
								</>
							) : (
								"Login"
							)}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-primary hover:underline transition-colors"
							>
								Sign up
							</Link>
						</div>

						<div className="text-center text-sm">
							<Link
								to="/"
								className="text-muted-foreground hover:text-primary   transition-colors"
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
