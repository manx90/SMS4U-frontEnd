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
		try {
			const response = await api.get(
				"/auth/login",
				{
					params: { name, password },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	register: async (name, email, password) => {
		try {
			const response = await api.get(
				"/auth/register",
				{
					params: { name, email, password },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	loginWithKey: async (apiKey) => {
		try {
			const response = await api.get(
				"/auth/login-with-key",
				{
					params: { apiKey },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	refreshToken: async (refreshToken) => {
		try {
			const response = await axios.post(
				`${
					import.meta.env.VITE_API_BASE_URL ||
					"http://localhost:7071/api/v1"
				}/auth/refresh-token`,
				{ refreshToken },
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	verifyToken: async () => {
		try {
			const response = await api.get(
				"/auth/verify-token",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== User APIs ====================
export const userApi = {
	getAll: async () => {
		try {
			const response = await api.get(
				"/users/all",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getOne: async (id) => {
		try {
			const response = await api.get(
				`/users/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	create: async (userData) => {
		try {
			const response = await api.get(
				"/users/create",
				{
					params: userData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	update: async (id, userData) => {
		try {
			const response = await api.get(
				`/users/update/${id}`,
				{
					params: userData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	delete: async (id) => {
		try {
			const response = await api.delete(
				"/users/delete",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== Service APIs ====================
export const serviceApi = {
	getAll: async () => {
		try {
			const response = await api.get("/service/");
			return response;
		} catch (error) {
			throw error;
		}
	},

	getOne: async (id) => {
		try {
			const response = await api.get(
				`/service/service/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	create: async (serviceData) => {
		try {
			const response = await api.get(
				"/service/create",
				{
					params: serviceData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	update: async (id, serviceData) => {
		try {
			const response = await api.get(
				"/service/update",
				{
					params: { id, ...serviceData },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	delete: async (id) => {
		try {
			const response = await api.get(
				"/service/remove",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== Country APIs ====================
export const countryApi = {
	getAll: async () => {
		try {
			const response = await api.get("/country/");
			return response;
		} catch (error) {
			throw error;
		}
	},

	getOne: async (id) => {
		try {
			const response = await api.get(
				`/country/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	create: async (countryData) => {
		try {
			const response = await api.get(
				"/country/create",
				{
					params: countryData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	delete: async (id) => {
		try {
			const response = await api.get(
				"/country/remove",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== Pricing APIs ====================
export const pricingApi = {
	getAll: async () => {
		try {
			const response = await api.get("/pricing/");
			return response;
		} catch (error) {
			throw error;
		}
	},

	getOne: async (id) => {
		try {
			const response = await api.get(
				`/pricing/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getByCountry: async (countryId) => {
		try {
			const response = await api.get(
				`/pricing/country/${countryId}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getByService: async (serviceId) => {
		try {
			const response = await api.get(
				`/pricing/service/${serviceId}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	create: async (pricingData) => {
		try {
			const response = await api.get(
				"/pricing/create",
				{
					params: pricingData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	update: async (id, price) => {
		try {
			const response = await api.get(
				"/pricing/update",
				{
					params: { id, price },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	delete: async (id) => {
		try {
			const response = await api.get(
				"/pricing/remove",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== Order APIs ====================
export const orderApi = {
	getAll: async (apiKey) => {
		try {
			const response = await api.get(
				"/order/orders",
				{
					params: { apiKey },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getNumber: async (
		country,
		serviceCode,
		provider,
	) => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	getMessage: async (orderId) => {
		try {
			const response = await api.get(
				"/order/get-message",
				{
					params: {
						orderId,
					},
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getRefundStatus: async (orderId) => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	processRefunds: async () => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	getRefundEligible: async () => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	// Email ordering APIs
	getEmailSites: async () => {
		try {
			const response = await api.get(
				"/email/sites",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getEmailDomains: async () => {
		try {
			const response = await api.get(
				"/email/domains",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getEmailQuantity: async (
		site,
		domain = null,
	) => {
		try {
			const params = { site };
			if (domain) params.domain = domain;
			const response = await api.get(
				"/email/quantity",
				{
					params,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	orderEmail: async (site, domain = null) => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	getEmailMessage: async (orderId) => {
		try {
			const response = await api.get(
				"/order/get-email-message",
				{
					params: { orderId },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	cancelEmail: async (orderId) => {
		try {
			const response = await api.get(
				"/order/cancel-email",
				{
					params: { orderId },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// ==================== Email Admin APIs ====================
export const emailAdminApi = {
	// Email Sites Management
	getAllSites: async () => {
		try {
			const response = await api.get(
				"/email-admin/sites",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getSite: async (id) => {
		try {
			const response = await api.get(
				`/email-admin/sites/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	createSite: async (siteData) => {
		try {
			const response = await api.get(
				"/email-admin/sites/create",
				{
					params: siteData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	updateSite: async (id, siteData) => {
		try {
			const response = await api.get(
				"/email-admin/sites/update",
				{
					params: { id, ...siteData },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	deleteSite: async (id) => {
		try {
			const response = await api.get(
				"/email-admin/sites/delete",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Email Domains Management
	getAllDomains: async () => {
		try {
			const response = await api.get(
				"/email-admin/domains",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getDomain: async (id) => {
		try {
			const response = await api.get(
				`/email-admin/domains/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	createDomain: async (domainData) => {
		try {
			const response = await api.get(
				"/email-admin/domains/create",
				{
					params: domainData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	updateDomain: async (id, domainData) => {
		try {
			const response = await api.get(
				"/email-admin/domains/update",
				{
					params: { id, ...domainData },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	deleteDomain: async (id) => {
		try {
			const response = await api.get(
				"/email-admin/domains/delete",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Email Prices Management
	getAllPrices: async () => {
		try {
			const response = await api.get(
				"/email-admin/prices",
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getPrice: async (id) => {
		try {
			const response = await api.get(
				`/email-admin/prices/${id}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	createPrice: async (priceData) => {
		try {
			const response = await api.get(
				"/email-admin/prices/create",
				{
					params: priceData,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	updatePrice: async (id, priceData) => {
		try {
			const response = await api.get(
				"/email-admin/prices/update",
				{
					params: { id, ...priceData },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	deletePrice: async (id) => {
		try {
			const response = await api.get(
				"/email-admin/prices/delete",
				{
					params: { id },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	populatePrices: async (defaultPrice = 0.5) => {
		try {
			const response = await api.get(
				"/email-admin/prices/populate",
				{
					params: { defaultPrice },
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

export default api;
