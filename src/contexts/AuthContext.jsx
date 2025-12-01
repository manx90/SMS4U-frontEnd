import {
	createContext,
	useState,
	useEffect,
	useCallback,
	useRef,
} from "react";
import { authApi, userApi } from "../services/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

// Helper function to decode JWT and get expiration
const getTokenExpiration = (token) => {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp * 1000; // Convert to milliseconds
	} catch {
		return null;
	}
};

// Helper function to check if token needs refresh (expires in less than 5 minutes)
const shouldRefreshToken = (token) => {
	const expiration = getTokenExpiration(token);
	if (!expiration) return false;

	const now = Date.now();
	const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes

	// Refresh if token expires in less than 5 minutes
	return (expiration - now) < fiveMinutesInMs;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const tokenRefreshInterval = useRef(null);

	// Handle automatic logout from API service
	useEffect(() => {
		const handleLogout = () => {
			setUser(null);
			setIsAuthenticated(false);
			localStorage.removeItem("user");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			toast.info("Session expired. Please login again.");
		};

		window.addEventListener("auth:logout", handleLogout);
		return () => window.removeEventListener("auth:logout", handleLogout);
	}, []);

	// Automatic token refresh logic
	const refreshTokenIfNeeded = useCallback(async () => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");

		if (!accessToken || !refreshToken) {
			return;
		}

		// Check if token needs refresh
		if (shouldRefreshToken(accessToken)) {
			try {
				console.log("Token expiring soon, refreshing...");
				const response = await authApi.refreshToken(refreshToken);

				if (response?.state === "200" && response?.data) {
					const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
					localStorage.setItem("accessToken", newAccessToken);
					localStorage.setItem("refreshToken", newRefreshToken);
					console.log("Token refreshed successfully");
				}
			} catch (error) {
				console.error("Failed to refresh token:", error);
				// If refresh fails, logout
				setUser(null);
				setIsAuthenticated(false);
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				toast.error("Session expired. Please login again.");
			}
		}
	}, []);

	// Check for saved user and token on mount
	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		const accessToken = localStorage.getItem("accessToken");

		if (savedUser && accessToken) {
			try {
				const parsedUser = JSON.parse(savedUser);

				// Verify token is not expired
				const expiration = getTokenExpiration(accessToken);
				if (expiration && expiration > Date.now()) {
					setUser(parsedUser);
					setIsAuthenticated(true);

					// Check if token needs immediate refresh
					refreshTokenIfNeeded();
				} else {
					// Token expired, clear storage
					localStorage.removeItem("user");
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
				}
			} catch (error) {
				console.error("Error parsing saved user:", error);
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
			}
		}
		setLoading(false);
	}, [refreshTokenIfNeeded]);

	// Set up token refresh interval (check every minute)
	useEffect(() => {
		if (isAuthenticated) {
			// Check token every minute
			tokenRefreshInterval.current = setInterval(() => {
				refreshTokenIfNeeded();
			}, 60 * 1000); // 1 minute

			return () => {
				if (tokenRefreshInterval.current) {
					clearInterval(tokenRefreshInterval.current);
				}
			};
		}
	}, [isAuthenticated, refreshTokenIfNeeded]);

	const login = async (name, password) => {
		try {
			const response = await authApi.login(
				name,
				password,
			);
			console.log(response);
			if (
				response.state === "200" &&
				response.data
			) {
				const { accessToken, refreshToken, ...userData } = response.data;

				// Store tokens
				if (accessToken) {
					localStorage.setItem("accessToken", accessToken);
				}
				if (refreshToken) {
					localStorage.setItem("refreshToken", refreshToken);
				}

				// Store user data (without tokens)
				setUser(userData);
				setIsAuthenticated(true);
				localStorage.setItem(
					"user",
					JSON.stringify(userData),
				);
				toast.success("Login successful!");
				return { success: true, user: userData };
			} else {
				throw new Error(
					response.error || "Login failed",
				);
			}
		} catch (error) {
			console.log(error);
			const errorMessage =
				error.message ||
				"Login failed. Please try again.";
			toast.error(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		}
	};

	const register = async (
		name,
		email,
		password,
	) => {
		try {
			const response = await authApi.register(
				name,
				email,
				password,
			);

			if (
				response.state === "200" &&
				response.data
			) {
				const { accessToken, refreshToken, ...userData } = response.data;

				// Store tokens
				if (accessToken) {
					localStorage.setItem("accessToken", accessToken);
				}
				if (refreshToken) {
					localStorage.setItem("refreshToken", refreshToken);
				}

				// Store user data (without tokens)
				setUser(userData);
				setIsAuthenticated(true);
				localStorage.setItem(
					"user",
					JSON.stringify(userData),
				);

				toast.success(
					"Registration successful! You are now logged in.",
				);
				return { success: true, user: userData };
			} else {
				throw new Error(
					response.error || "Registration failed",
				);
			}
		} catch (error) {
			const errorMessage =
				error.message ||
				"Registration failed. Please try again.";
			toast.error(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		}
	};

	const loginWithKey = async (apiKey) => {
		try {
			const response = await authApi.loginWithKey(
				apiKey,
			);

			if (
				response.state === "200" &&
				response.data
			) {
				const userData = response.data;
				setUser(userData);
				setIsAuthenticated(true);
				localStorage.setItem(
					"user",
					JSON.stringify(userData),
				);
				return { success: true, user: userData };
			} else {
				throw new Error(
					response.error ||
					"Login with API key failed",
				);
			}
		} catch (error) {
			const errorMessage =
				error.message ||
				"Login with API key failed.";
			toast.error(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		}
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("user");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");

		// Clear the refresh interval
		if (tokenRefreshInterval.current) {
			clearInterval(tokenRefreshInterval.current);
		}

		toast.success("Logged out successfully");
	};

	const updateUserBalance = (newBalance) => {
		if (user) {
			const updatedUser = {
				...user,
				balance: newBalance,
			};
			setUser(updatedUser);
			localStorage.setItem(
				"user",
				JSON.stringify(updatedUser),
			);
		}
	};

	const refreshUserData = async () => {
		try {
			if (!user?.id) {
				console.warn("Cannot refresh user data: no user ID");
				return;
			}

			const response = await userApi.getInfo();
			if (response?.state === "200" && response?.data) {
				const freshData = response.data;
				// Merge fresh data with existing user data to preserve fields like apiKey, role, etc.
				// that might not be returned by the info endpoint
				const updatedUser = {
					...user,
					...freshData,
				};

				setUser(updatedUser);
				localStorage.setItem(
					"user",
					JSON.stringify(updatedUser),
				);
				return updatedUser;
			}
		} catch (error) {
			console.error("Error refreshing user data:", error);
			toast.error("Failed to refresh user data");
		}
	};

	const isAdmin = () => {
		return user?.role === "admin";
	};

	const isUser = () => {
		return user?.role === "user";
	};

	const hasPermission = (requiredRole) => {
		if (requiredRole === "admin") {
			return user?.role === "admin";
		}
		return isAuthenticated;
	};

	const value = {
		user,
		loading,
		isAuthenticated,
		login,
		register,
		loginWithKey,
		logout,
		updateUserBalance,
		refreshUserData,
		isAdmin,
		isUser,
		hasPermission,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
