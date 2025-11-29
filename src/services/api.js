import axios from "axios";

// Create axios instance with default config
const api = axios.create({
	baseURL:
		import.meta.env.VITE_API_BASE_URL ||
		"http://176.118.198.153:7071/api/v1",
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
	(config) => {
		// Get user data from localStorage
		const user = JSON.parse(
			localStorage.getItem("user") || "{}",
		);

		// Add JWT token to Authorization header if available
		const accessToken = localStorage.getItem(
			"accessToken",
		);
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		// Also add apiKey to query params for backward compatibility
		// (some endpoints might still use it)
		if (user.apiKey && !config.params?.apiKey) {
			config.params = {
				...config.params,
				apiKey: user.apiKey,
			};
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor
api.interceptors.response.use(
	(response) => {
		return response.data;
	},
	async (error) => {
		const originalRequest = error.config;

		// If error is 401 and we haven't tried to refresh yet
		if (
			error.response?.status === 401 &&
			!originalRequest._retry
		) {
			// Check if the error indicates an expired token
			if (
				error.response?.data?.expired ||
				error.response?.data?.error ===
					"Token has expired"
			) {
				if (isRefreshing) {
					// If already refreshing, queue this request
					return new Promise(
						(resolve, reject) => {
							failedQueue.push({
								resolve,
								reject,
							});
						},
					)
						.then((token) => {
							originalRequest.headers.Authorization = `Bearer ${token}`;
							return api(originalRequest);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}

				originalRequest._retry = true;
				isRefreshing = true;

				const refreshToken = localStorage.getItem(
					"refreshToken",
				);

				if (!refreshToken) {
					// No refresh token available, logout
					isRefreshing = false;
					processQueue(
						new Error(
							"No refresh token available",
						),
						null,
					);
					// Trigger logout
					window.dispatchEvent(
						new CustomEvent("auth:logout"),
					);
					return Promise.reject(
						error.response?.data || error,
					);
				}

				try {
					// Try to refresh the token
					const response = await axios.post(
						`${
							import.meta.env.VITE_API_BASE_URL ||
							"http://localhost:7071/api/v1"
						}/auth/refresh-token`,
						{ refreshToken },
					);

					if (
						response.data?.state === "200" &&
						response.data?.data
					) {
						const {
							accessToken: newAccessToken,
							refreshToken: newRefreshToken,
						} = response.data.data;

						// Store new tokens
						localStorage.setItem(
							"accessToken",
							newAccessToken,
						);
						localStorage.setItem(
							"refreshToken",
							newRefreshToken,
						);

						// Update the failed request with new token
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

						// Process queued requests
						processQueue(null, newAccessToken);

						isRefreshing = false;

						// Retry the original request
						return api(originalRequest);
					} else {
						throw new Error(
							"Token refresh failed",
						);
					}
				} catch (refreshError) {
					// Refresh failed, logout user
					processQueue(refreshError, null);
					isRefreshing = false;

					// Clear tokens
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					localStorage.removeItem("user");

					// Trigger logout event
					window.dispatchEvent(
						new CustomEvent("auth:logout"),
					);

					return Promise.reject(refreshError);
				}
			}
		}

		// If we have a response from the server, return the error data
		if (error.response?.data) {
			return Promise.reject(error.response.data);
		}
		// Otherwise, return a formatted error
		return Promise.reject({
			state: "500",
			error:
				error.message || "Something went wrong",
		});
	},
);

// ==================== Auth APIs ====================
export const authApi = {
	login: async (name, password) => {
		const response = await api.get(
			"/auth/login",
			{
				params: { name, password },
			},
		);
		return response;
	},

	register: async (name, email, password) => {
		const response = await api.get(
			"/auth/register",
			{
				params: { name, email, password },
			},
		);
		return response;
	},

	loginWithKey: async (apiKey) => {
		const response = await api.get(
			"/auth/login-with-key",
			{
				params: { apiKey },
			},
		);
		return response;
	},

	refreshToken: async (refreshToken) => {
		const response = await axios.post(
			`${
				import.meta.env.VITE_API_BASE_URL ||
				"http://localhost:7071/api/v1"
			}/auth/refresh-token`,
			{ refreshToken },
		);
		return response.data;
	},

	verifyToken: async () => {
		const response = await api.get(
			"/auth/verify-token",
		);
		return response;
	},
};

// ==================== User APIs ====================
export const userApi = {
	getAll: async () => {
		const response = await api.get(
			"/users/all",
		);
		return response;
	},

	getOne: async (id) => {
		const response = await api.get(
			`/users/${id}`,
		);
		return response;
	},

	create: async (userData) => {
		const response = await api.get(
			"/users/create",
			{
				params: userData,
			},
		);
		return response;
	},

	update: async (id, userData) => {
		const response = await api.get(
			`/users/update/${id}`,
			{
				params: userData,
			},
		);
		return response;
	},

	delete: async (id) => {
		const response = await api.delete(
			"/users/delete",
			{
				params: { id },
			},
		);
		return response;
	},
};

// ==================== Service APIs ====================
export const serviceApi = {
	getAll: async () => {
		const response = await api.get("/service/");
		return response;
	},

	getOne: async (id) => {
		const response = await api.get(
			`/service/service/${id}`,
		);
		return response;
	},

	create: async (serviceData) => {
		const response = await api.get(
			"/service/create",
			{
				params: serviceData,
			},
		);
		return response;
	},

	update: async (id, serviceData) => {
		const response = await api.get(
			"/service/update",
			{
				params: { id, ...serviceData },
			},
		);
		return response;
	},

	delete: async (id) => {
		const response = await api.get(
			"/service/remove",
			{
				params: { id },
			},
		);
		return response;
	},
};

// ==================== Country APIs ====================
export const countryApi = {
	getAll: async () => {
		const response = await api.get("/country/");
		return response;
	},

	getOne: async (id) => {
		const response = await api.get(
			`/country/${id}`,
		);
		return response;
	},

	create: async (countryData) => {
		const response = await api.get(
			"/country/create",
			{
				params: countryData,
			},
		);
		return response;
	},

	delete: async (id) => {
		const response = await api.get(
			"/country/remove",
			{
				params: { id },
			},
		);
		return response;
	},
};

// ==================== Pricing APIs ====================
export const pricingApi = {
	getAll: async () => {
		const response = await api.get("/pricing/");
		return response;
	},

	getOne: async (id) => {
		const response = await api.get(
			`/pricing/${id}`,
		);
		return response;
	},

	getByCountry: async (countryId) => {
		const response = await api.get(
			`/pricing/country/${countryId}`,
		);
		return response;
	},

	getByService: async (serviceId) => {
		const response = await api.get(
			`/pricing/service/${serviceId}`,
		);
		return response;
	},

	create: async (pricingData) => {
		const response = await api.get(
			"/pricing/create",
			{
				params: pricingData,
			},
		);
		return response;
	},

	update: async (id, price) => {
		const response = await api.get(
			"/pricing/update",
			{
				params: { id, price },
			},
		);
		return response;
	},

	delete: async (id) => {
		const response = await api.get(
			"/pricing/remove",
			{
				params: { id },
			},
		);
		return response;
	},
};

// ==================== Order APIs ====================
export const orderApi = {
	getAll: async (apiKey) => {
		const response = await api.get(
			"/order/orders",
			{
				params: { apiKey },
			},
		);
		return response;
	},

	getNumber: async (
		country,
		serviceCode,
		provider,
	) => {
		// apiKey is automatically added by request interceptor
		const params = {
			country,
			serviceCode,
			provider,
		};

		const response = await api.get(
			"/order/get-number",
			{
				params,
			},
		);
		return response;
	},

	getMessage: async (orderId) => {
		const response = await api.get(
			"/order/get-message",
			{
				params: {
					orderId,
				},
			},
		);
		return response;
	},

	getRefundStatus: async (orderId) => {
		const user = JSON.parse(
			localStorage.getItem("user") || "{}",
		);
		const response = await api.get(
			"/order/refund-status",
			{
				params: {
					apiKey: user.apiKey,
					orderId,
				},
			},
		);
		return response;
	},

	processRefunds: async () => {
		const user = JSON.parse(
			localStorage.getItem("user") || "{}",
		);
		const response = await api.get(
			"/order/process-refunds",
			{
				params: {
					apiKey: user.apiKey,
				},
			},
		);
		return response;
	},

	getRefundEligible: async () => {
		const user = JSON.parse(
			localStorage.getItem("user") || "{}",
		);
		const response = await api.get(
			"/order/refund-eligible",
			{
				params: {
					apiKey: user.apiKey,
				},
			},
		);
		return response;
	},

	// Email ordering APIs
	getEmailSites: async () => {
		const response = await api.get(
			"/email/sites",
		);
		return response;
	},

	getEmailDomains: async () => {
		const response = await api.get(
			"/email/domains",
		);
		return response;
	},

	getEmailQuantity: async (
		site,
		domain = null,
	) => {
		const params = { site };
		if (domain) params.domain = domain;
		const response = await api.get(
			"/email/quantity",
			{
				params,
			},
		);
		return response;
	},

	orderEmail: async (site, domain = null) => {
		const params = { site };
		// Always include domain parameter, even if null/empty
		// This allows backend to differentiate between "any domain" and "specific domain"
		if (domain && domain !== "") {
			params.domain = domain;
		}
		const response = await api.get(
			"/order/get-email",
			{
				params,
			},
		);
		return response;
	},

	getEmailMessage: async (orderId) => {
		const response = await api.get(
			"/order/get-email-message",
			{
				params: { orderId },
			},
		);
		return response;
	},

	cancelEmail: async (orderId) => {
		const response = await api.get(
			"/order/cancel-email",
			{
				params: { orderId },
			},
		);
		return response;
	},
};

// ==================== Email Admin APIs ====================
export const emailAdminApi = {
	// Email Sites Management
	getAllSites: async () => {
		const response = await api.get(
			"/email-admin/sites",
		);
		return response;
	},

	getSite: async (id) => {
		const response = await api.get(
			`/email-admin/sites/${id}`,
		);
		return response;
	},

	createSite: async (siteData) => {
		const response = await api.get(
			"/email-admin/sites/create",
			{
				params: siteData,
			},
		);
		return response;
	},

	updateSite: async (id, siteData) => {
		const response = await api.get(
			"/email-admin/sites/update",
			{
				params: { id, ...siteData },
			},
		);
		return response;
	},

	deleteSite: async (id) => {
		const response = await api.get(
			"/email-admin/sites/delete",
			{
				params: { id },
			},
		);
		return response;
	},

	// Email Domains Management
	getAllDomains: async () => {
		const response = await api.get(
			"/email-admin/domains",
		);
		return response;
	},

	getDomain: async (id) => {
		const response = await api.get(
			`/email-admin/domains/${id}`,
		);
		return response;
	},

	createDomain: async (domainData) => {
		const response = await api.get(
			"/email-admin/domains/create",
			{
				params: domainData,
			},
		);
		return response;
	},

	updateDomain: async (id, domainData) => {
		const response = await api.get(
			"/email-admin/domains/update",
			{
				params: { id, ...domainData },
			},
		);
		return response;
	},

	deleteDomain: async (id) => {
		const response = await api.get(
			"/email-admin/domains/delete",
			{
				params: { id },
			},
		);
		return response;
	},

	// Email Prices Management
	getAllPrices: async () => {
		const response = await api.get(
			"/email-admin/prices",
		);
		return response;
	},

	getPrice: async (id) => {
		const response = await api.get(
			`/email-admin/prices/${id}`,
		);
		return response;
	},

	createPrice: async (priceData) => {
		const response = await api.get(
			"/email-admin/prices/create",
			{
				params: priceData,
			},
		);
		return response;
	},

	updatePrice: async (id, priceData) => {
		const response = await api.get(
			"/email-admin/prices/update",
			{
				params: { id, ...priceData },
			},
		);
		return response;
	},

	deletePrice: async (id) => {
		const response = await api.get(
			"/email-admin/prices/delete",
			{
				params: { id },
			},
		);
		return response;
	},

	populatePrices: async (defaultPrice = 0.5) => {
		const response = await api.get(
			"/email-admin/prices/populate",
			{
				params: { defaultPrice },
			},
		);
		return response;
	},
};

// ==================== Payment APIs ====================
export const paymentApi = {
	/**
	 * Update user balance after successful payment
	 * @param {number} amount - Amount to add to balance
	 * @returns {Promise} Updated user data
	 */
	updateBalanceAfterPayment: async (amount) => {
		try {
			const user = JSON.parse(
				localStorage.getItem("user") || "{}",
			);
			if (!user.id) {
				throw new Error("User ID not found");
			}
			// Get current balance and add the new amount
			const currentBalance = user.balance || 0;
			const newBalance = currentBalance + amount;

			const response = await userApi.update(user.id, {
				balance: newBalance,
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Check payment status from backend
	 * @param {string} paymentId - Payment ID or invoice UUID
	 * @returns {Promise} Payment status
	 */
	checkPaymentStatus: async (paymentId) => {
		try {
			const response = await api.get(
				`/payment/status/${paymentId}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Get payment history
	 * @returns {Promise} Payment history
	 */
	getPaymentHistory: async () => {
		try {
			const user = JSON.parse(
				localStorage.getItem("user") || "{}",
			);
			const response = await api.get(
				"/payment/history",
				{
					params: {
						userId: user.id,
					},
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

export default api;
