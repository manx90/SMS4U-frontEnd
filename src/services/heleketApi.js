import axios from "axios";

// Create axios instance for Heleket API
const heleketApi = axios.create({
	baseURL:
		import.meta.env.VITE_HELEKET_API_URL ||
		"https://api.heleket.com/v1",
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add API key
heleketApi.interceptors.request.use(
	(config) => {
		const apiKey =
			import.meta.env.VITE_HELEKET_API_KEY;
		if (apiKey) {
			config.headers.Authorization = `Bearer ${apiKey}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor
heleketApi.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response?.data) {
			return Promise.reject(error.response.data);
		}
		return Promise.reject({
			state: 1,
			message: error.message || "Something went wrong",
		});
	},
);

// ==================== Heleket Payment APIs ====================
export const heleketPaymentApi = {
	/**
	 * Create a payment invoice
	 * @param {string} amount - Amount in RUB
	 * @param {string} orderId - Unique order ID
	 * @param {object} options - Additional options
	 * @returns {Promise} Invoice data
	 */
	createInvoice: async (amount, orderId, options = {}) => {
		try {
			const baseUrl = window.location.origin;
			const response = await heleketApi.post(
				"/payment",
				{
					amount: String(amount),
					currency: "RUB",
					order_id: orderId,
					url_return:
						options.urlReturn ||
						`${baseUrl}/user/account`,
					url_success:
						options.urlSuccess ||
						`${baseUrl}/user/account?payment=success`,
					url_callback:
						options.urlCallback ||
						`${import.meta.env.VITE_API_BASE_URL || "http://176.118.198.153:7071/api/v1"}/payment/heleket/webhook`,
					lifetime: options.lifetime || 3600, // 1 hour default
					network: options.network || null, // null = all networks
					to_currency: options.toCurrency || null, // null = all cryptocurrencies
					is_payment_multiple:
						options.isPaymentMultiple !== undefined
							? options.isPaymentMultiple
							: true,
					additional_data: options.additionalData || null,
				},
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Get payment status by UUID
	 * @param {string} uuid - Invoice UUID
	 * @returns {Promise} Payment status data
	 */
	getPaymentStatus: async (uuid) => {
		try {
			const response = await heleketApi.get(
				`/payment/${uuid}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Get payment information
	 * @param {string} uuid - Invoice UUID
	 * @returns {Promise} Payment information
	 */
	getPaymentInfo: async (uuid) => {
		try {
			const response = await heleketApi.get(
				`/payment/${uuid}`,
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

export default heleketApi;

