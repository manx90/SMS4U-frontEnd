import api from "./api.js";

// ==================== Heleket Payment APIs via Backend ====================
// These APIs use Backend endpoints to avoid CORS issues
export const heleketPaymentApi = {
	/**
	 * Create a payment invoice via Backend (solves CORS issue)
	 * @param {string} amount - Amount in USDT
	 * @param {string} orderId - Unique order ID
	 * @param {object} options - Additional options
	 * @returns {Promise} Invoice data
	 */
	createInvoice: async (amount, orderId, options = {}) => {
		const user = JSON.parse(
			localStorage.getItem("user") || "{}",
		);
		const baseUrl = window.location.origin;

		const response = await api.post(
			"/payment/heleket/create-invoice",
			{
				amount: String(amount),
				orderId,
				userId: user?.id,
				currency: "USDT",
				urlReturn:
					options.urlReturn ||
					`${baseUrl}/user/account`,
				urlSuccess:
					options.urlSuccess ||
					`${baseUrl}/user/account?payment=success`,
				lifetime: options.lifetime || 3600,
				additionalData: options.additionalData || null,
			},
		);

		// Backend returns { state: "200", result: {...}, data: {...} }
		// Return in format expected by Frontend
		return response;
	},

	/**
	 * Get payment status by UUID via Backend
	 * @param {string} uuid - Invoice UUID
	 * @returns {Promise} Payment status data
	 */
	getPaymentStatus: async (uuid) => {
		const response = await api.get(
			`/payment/heleket/status/${uuid}`,
		);

		// Backend returns { state: "200", result: {...}, data: {...} }
		return response;
	},

	/**
	 * Get payment information (alias for getPaymentStatus)
	 * @param {string} uuid - Invoice UUID
	 * @returns {Promise} Payment information
	 */
	getPaymentInfo: async (uuid) => {
		return await heleketPaymentApi.getPaymentStatus(uuid);
	},
};

// Keep default export for backward compatibility
export default heleketPaymentApi;

