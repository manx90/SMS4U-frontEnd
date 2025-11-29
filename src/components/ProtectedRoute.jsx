import {
	Navigate,
	useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./ui/spinner";

export const ProtectedRoute = ({
	children,
	requiredRole,
}) => {
	const { isAuthenticated, user, loading } =
		useAuth();
	const location = useLocation();

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner className="h-8 w-8" />
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		);
	}

	// Check role-based access
	if (requiredRole) {
		if (
			requiredRole === "admin" &&
			user?.role !== "admin"
		) {
			return (
				<Navigate to="/user/get-service" replace />
			);
		}
		if (
			requiredRole === "user" &&
			user?.role !== "user"
		) {
			return (
				<Navigate to="/admin/dashboard" replace />
			);
		}
	}

	return children;
};

export default ProtectedRoute;
