import { lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { Spinner } from "./components/ui/spinner";

// Lazy load ALL routes for optimal performance
const LandingPage = lazy(() => import("./components/LandingPage"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

// Lazy load pages for code splitting (lighter app bundle)
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() =>
	import("./pages/Register"),
);

// Admin Pages - Lazy loaded
const AdminDashboard = lazy(() =>
	import("./pages/admin/Dashboard"),
);
const Users = lazy(() =>
	import("./pages/admin/Users"),
);
const Services = lazy(() =>
	import("./pages/admin/Services"),
);
const Countries = lazy(() =>
	import("./pages/admin/Countries"),
);
const Pricing = lazy(() =>
	import("./pages/admin/Pricing"),
);
const AdminOrders = lazy(() =>
	import("./pages/admin/Orders"),
);
const EmailSites = lazy(() =>
	import("./pages/admin/EmailSites"),
);
const EmailDomains = lazy(() =>
	import("./pages/admin/EmailDomains"),
);
const EmailPrices = lazy(() =>
	import("./pages/admin/EmailPrices"),
);

// User Pages - Lazy loaded
const UserDashboard = lazy(() =>
	import("./pages/user/Dashboard"),
);
const GetService = lazy(() =>
	import("./pages/user/GetService"),
);
const UserOrders = lazy(() =>
	import("./pages/user/Orders"),
);
const Account = lazy(() =>
	import("./pages/user/Account"),
);
const ApiDocs = lazy(() =>
	import("./pages/user/ApiDocs"),
);
const HeleketPayment = lazy(() =>
	import("./components/payment/HeleketPayment"),
);

// Loading fallback component
const PageLoader = () => (
	<div className="flex items-center justify-center min-h-screen">
		<Spinner className="h-8 w-8 text-primary" />
	</div>
);

function App() {
	return (
		<ThemeProvider
			defaultTheme="system"
			storageKey="sms-dashboard-theme"
		>
			<AuthProvider>
				<Router>
					<Suspense fallback={<PageLoader />}>
						<Routes>
							{/* Public Routes */}
							<Route
								path="/"
								element={<LandingPage />}
							/>
							<Route
								path="/login"
								element={<Login />}
							/>
							<Route
								path="/register"
								element={<Register />}
							/>

							{/* Admin Routes */}
							<Route
								path="/admin"
								element={
									<ProtectedRoute requiredRole="admin">
										<DashboardLayout />
									</ProtectedRoute>
								}
							>
								<Route
									index
									element={
										<Navigate
											to="/admin/dashboard"
											replace
										/>
									}
								/>
								<Route
									path="dashboard"
									element={<AdminDashboard />}
								/>
								<Route
									path="users"
									element={<Users />}
								/>
								<Route
									path="services"
									element={<Services />}
								/>
								<Route
									path="countries"
									element={<Countries />}
								/>
								<Route
									path="pricing"
									element={<Pricing />}
								/>
								<Route
									path="email-sites"
									element={<EmailSites />}
								/>
								<Route
									path="email-domains"
									element={<EmailDomains />}
								/>
								<Route
									path="email-prices"
									element={<EmailPrices />}
								/>
								<Route
									path="orders"
									element={<AdminOrders />}
								/>
							</Route>

							{/* User Routes */}
							<Route
								path="/user"
								element={
									<ProtectedRoute requiredRole="user">
										<DashboardLayout />
									</ProtectedRoute>
								}
							>
								<Route
									index
									element={
										<Navigate
											to="/user/get-service"
											replace
										/>
									}
								/>
								<Route
									path="dashboard"
									element={<UserDashboard />}
								/>
								<Route
									path="get-service"
									element={<GetService />}
								/>
								<Route
									path="get-number"
									element={
										<Navigate
											to="/user/get-service"
											replace
										/>
									}
								/>
								<Route
									path="orders"
									element={<UserOrders />}
								/>
								<Route
									path="account"
									element={<Account />}
								/>
								<Route
									path="api-docs"
									element={<ApiDocs />}
								/>
								<Route
									path="add-funds"
									element={<HeleketPayment />}
								/>
							</Route>

							{/* Fallback */}
							<Route
								path="*"
								element={
									<Navigate to="/" replace />
								}
							/>
						</Routes>
					</Suspense>
				</Router>
				<Toaster
					richColors
					position="top-right"
				/>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
