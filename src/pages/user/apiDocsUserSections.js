import { BASE_URL } from "../../components/api-docs/ApiDocComponents.jsx";
import {
	Shield,
	User,
	Key,
	ShoppingCart,
	Mail,
	Globe,
	Package,
	DollarSign,
	Server,
} from "lucide-react";

export function buildUserApiSections(user) {
	return [
		{
			id: "authentication",
			title: "Authentication",
			icon: Shield,
			description:
				"Manage user authentication and API keys",
			endpoints: [
				{
					method: "GET",
					path: "/auth/register",
					title: "Register New User",
					description:
						"Create a new user account",
					icon: User,
					params: [
						{
							name: "name",
							type: "string",
							required: true,
							description:
								"Username for the account",
							example: "john_doe",
						},
						{
							name: "password",
							type: "string",
							required: true,
							description: "Account password",
							example: "securepass123",
						},
						{
							name: "email",
							type: "string",
							required: false,
							description: "Email address",
							example: "john@example.com",
						},
					],
					response: {
						state: "200",
						data: {
							id: 1,
							name: "john_doe",
							email: "john@example.com",
							balance: 0,
							role: "user",
							apiKey: "abc123xyz789",
							accessToken:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							refreshToken:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							createdAt:
								"2025-01-01T00:00:00.000Z",
						},
					},
					example: `curl -X GET "${BASE_URL}/auth/register?name=john_doe&password=securepass123&email=john@example.com"`,
				},
				{
					method: "GET",
					path: "/auth/login",
					title: "Login",
					description:
						"Login with username and password",
					icon: Key,
					params: [
						{
							name: "name",
							type: "string",
							required: true,
							description: "Username",
							example: "john_doe",
						},
						{
							name: "password",
							type: "string",
							required: true,
							description: "Password",
							example: "securepass123",
						},
					],
					response: {
						state: "200",
						data: {
							id: 1,
							name: "john_doe",
							email: "john@example.com",
							balance: 100.5,
							role: "user",
							apiKey: "abc123xyz789",
							accessToken:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							refreshToken:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
						},
					},
					example: `curl -X GET "${BASE_URL}/auth/login?name=john_doe&password=securepass123"`,
				},
				{
					method: "GET",
					path: "/auth/login-with-key",
					title: "Login with API Key",
					description:
						"Quick login using your API key",
					icon: Key,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: {
							id: 1,
							name: "john_doe",
							email: "john@example.com",
							balance: 100.5,
							role: "user",
							apiKey: "abc123xyz789",
						},
					},
					example: `curl -X GET "${BASE_URL}/auth/login-with-key?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
				{
					method: "GET",
					path: "/auth/regenerate-apikey",
					title: "Regenerate API Key",
					description:
						"Generate a new API key (requires password confirmation)",
					icon: Key,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Current API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "password",
							type: "string",
							required: true,
							description:
								"Account password for verification",
							example: "securepass123",
						},
					],
					response: {
						state: "200",
						message:
							"API key regenerated successfully",
						data: {
							apiKey: "new_abc123xyz789",
						},
					},
					example: `curl -X GET "${BASE_URL}/auth/regenerate-apikey?apiKey=${
						user?.apiKey || "your_api_key"
					}&password=securepass123"`,
				},
			],
		},
		{
			id: "user",
			title: "User Information",
			icon: User,
			description: "Get user account information",
			endpoints: [
				{
					method: "GET",
					path: "/users/balance",
					title: "Get Balance",
					description:
						"Check your current account balance",
					icon: DollarSign,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: {
							balance: 100.5,
						},
					},
					example: `curl -X GET "${BASE_URL}/users/balance?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
				{
					method: "GET",
					path: "/users/info",
					title: "Get User Info",
					description:
						"Get your account information",
					icon: User,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: {
							name: "john_doe",
							email: "john@example.com",
							balance: 100.5,
							createdAt:
								"2025-01-01T00:00:00.000Z",
						},
					},
					example: `curl -X GET "${BASE_URL}/users/info?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
			],
		},
		{
			id: "phone-orders",
			title: "Phone Number Orders",
			icon: ShoppingCart,
			description:
				"Order and manage phone numbers for SMS verification",
			endpoints: [
				{
					method: "GET",
					path: "/order/get-number",
					title: "Get Phone Number",
					description:
						"Order a phone number for SMS verification",
					icon: ShoppingCart,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "country",
							type: "string",
							required: true,
							description: "Country code",
							example: "0",
						},
						{
							name: "serviceCode",
							type: "string",
							required: true,
							description: "Service code",
							example: "tg",
						},
						{
							name: "provider",
							type: "string",
							required: true,
							description: "Provider: 1 or 2 only",
							example: "1",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: {
							number: "1234567890",
							orderId: "ABC123XYZ456",
						},
					},
					example: `curl -X GET "${BASE_URL}/order/get-number?apiKey=${
						user?.apiKey || "your_api_key"
					}&country=0&serviceCode=tg&provider=1"`,
				},
				{
					method: "GET",
					path: "/provider3/get-number",
					title: "Get Phone Number (Provider 3)",
					description:
						"Order a number via Provider 3 (separate from provider 1/2)",
					icon: ShoppingCart,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "country",
							type: "string",
							required: true,
							description: "Country (code or id)",
							example: "0",
						},
						{
							name: "serviceCode",
							type: "string",
							required: true,
							description: "Service code",
							example: "tg",
						},
						{
							name: "server",
							type: "string",
							required: false,
							description:
								"Users: 1-based server index from GET /provider3/operators",
							example: "1",
						},
						{
							name: "operator",
							type: "string",
							required: false,
							description:
								"Admin: raw upstream operator id (optional alternative to server)",
							example: "op3410",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: {
							number: "1234567890",
							orderId: "ABC123XYZ456",
						},
					},
					example: `curl -X GET "${BASE_URL}/provider3/get-number?apiKey=${
						user?.apiKey || "your_api_key"
					}&country=0&serviceCode=tg&server=1"`,
				},
				{
					method: "GET",
					path: "/order/get-message",
					title: "Get SMS Message",
					description:
						"Retrieve SMS message for an order",
					icon: Mail,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "orderId",
							type: "string",
							required: true,
							description:
								"Order ID from get-number",
							example: "ABC123XYZ456",
						},
					],
					response: {
						code: 200,
						status: "ok",
						message: "Message received",
						data: "123456",
					},
					example: `curl -X GET "${BASE_URL}/order/get-message?apiKey=${
						user?.apiKey || "your_api_key"
					}&orderId=ABC123XYZ456"`,
				},
				{
					method: "GET",
					path: "/order/orders",
					title: "Get All Orders",
					description:
						"List all your phone number orders",
					icon: ShoppingCart,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: [
							{
								id: 1,
								publicId: "ABC123XYZ456",
								number: "1234567890",
								status: "completed",
								message: "123456",
								price: 1.5,
								typeServe: "number",
								createdAt:
									"2025-01-01T00:00:00.000Z",
							},
						],
					},
					example: `curl -X GET "${BASE_URL}/order/orders?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
				{
					method: "GET",
					path: "/order/refund-status",
					title: "Check Refund Status",
					description:
						"Check if an order is eligible for refund",
					icon: DollarSign,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "orderId",
							type: "string",
							required: true,
							description: "Order ID",
							example: "ABC123XYZ456",
						},
					],
					response: {
						state: "200",
						data: {
							orderId: 1,
							status: "pending",
							refundProcessed: false,
							shouldRefund: false,
							timeLeftMs: 300000,
							timeLeftMinutes: 5,
						},
					},
					example: `curl -X GET "${BASE_URL}/order/refund-status?apiKey=${
						user?.apiKey || "your_api_key"
					}&orderId=ABC123XYZ456"`,
				},
			],
		},
		{
			id: "email-orders",
			title: "Email Orders",
			icon: Mail,
			description:
				"Order and manage temporary email addresses",
			endpoints: [
				{
					method: "GET",
					path: "/order/email-sites",
					title: "Get Email Sites",
					description:
						"List all available email sites/services",
					icon: Server,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: [
							{ name: "facebook.com" },
							{ name: "instagram.com" },
							{ name: "google.com" },
						],
					},
					example: `curl -X GET "${BASE_URL}/order/email-sites?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
				{
					method: "GET",
					path: "/order/email-domains",
					title: "Get Email Domains",
					description:
						"List all available email domains",
					icon: Globe,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: [
							{ name: "gmail.com" },
							{ name: "outlook.com" },
							{ name: "yahoo.com" },
						],
					},
					example: `curl -X GET "${BASE_URL}/order/email-domains?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
				{
					method: "GET",
					path: "/email/quantity",
					title: "Get Email Availability",
					description:
						"Check available email quantity for a site and domain",
					icon: Server,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "site",
							type: "string",
							required: true,
							description: "Site/service name",
							example: "facebook",
						},
						{
							name: "domain",
							type: "string",
							required: false,
							description:
								"Specific domain to check (optional)",
							example: "gmail.com",
						},
					],
					response: {
						state: "200",
						msg: "success",
						data: [
							{
								domain: "gmail.com",
								count: 150,
								price: 0.5,
							},
							{
								domain: "outlook.com",
								count: 200,
								price: 0.5,
							},
							{
								domain: "any",
								count: 500,
								price: 0.4,
							},
						],
					},
					example: `curl -X GET "${BASE_URL}/email/quantity?apiKey=${
						user?.apiKey || "your_api_key"
					}&site=facebook"`,
				},
				{
					method: "GET",
					path: "/order/get-email",
					title: "Order Email",
					description:
						"Order a temporary email address",
					icon: Mail,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "site",
							type: "string",
							required: true,
							description: "Site/service name",
							example: "facebook",
						},
						{
							name: "domain",
							type: "string",
							required: false,
							description:
								"Email domain (optional)",
							example: "gmail.com",
						},
					],
					response: {
						state: "200",
						msg: "Email ordered successfully",
						data: {
							email: "temp123@gmail.com",
							orderId: "EMAIL123XYZ456",
						},
					},
					example: `curl -X GET "${BASE_URL}/order/get-email?apiKey=${
						user?.apiKey || "your_api_key"
					}&site=facebook.com&domain=gmail.com"`,
				},
				{
					method: "GET",
					path: "/order/get-email-message",
					title: "Get Email Message",
					description:
						"Retrieve email message for an order",
					icon: Mail,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "orderId",
							type: "string",
							required: true,
							description: "Email order ID",
							example: "EMAIL123XYZ456",
						},
					],
					response: {
						state: "200",
						msg: "Message received",
						data: "Your verification code is: 123456",
					},
					example: `curl -X GET "${BASE_URL}/order/get-email-message?apiKey=${
						user?.apiKey || "your_api_key"
					}&orderId=EMAIL123XYZ456"`,
				},
				{
					method: "GET",
					path: "/order/reorder-email",
					title: "Reorder Email",
					description:
						"Reorder an email without charging balance",
					icon: Mail,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "orderId",
							type: "string",
							required: false,
							description: "Order ID",
							example: "EMAIL123XYZ456",
						},
						{
							name: "email",
							type: "string",
							required: false,
							description:
								"Email address (alternative to orderId)",
							example: "temp123@gmail.com",
						},
					],
					response: {
						state: "200",
						msg: "Email reordered successfully",
						data: {
							email: "temp123@gmail.com",
							orderId: "EMAIL123XYZ456",
						},
					},
					example: `curl -X GET "${BASE_URL}/order/reorder-email?apiKey=${
						user?.apiKey || "your_api_key"
					}&orderId=EMAIL123XYZ456"`,
				},
				{
					method: "GET",
					path: "/order/cancel-email",
					title: "Cancel Email",
					description:
						"Cancel an email order and get a refund",
					icon: Mail,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
						{
							name: "orderId",
							type: "string",
							required: true,
							description: "Email order ID",
							example: "EMAIL123XYZ456",
						},
					],
					response: {
						state: "200",
						msg: "Email cancelled successfully",
					},
					example: `curl -X GET "${BASE_URL}/order/cancel-email?apiKey=${
						user?.apiKey || "your_api_key"
					}&orderId=EMAIL123XYZ456"`,
				},
			],
		},
		{
			id: "services",
			title: "Services",
			icon: Package,
			description:
				"Get available services for SMS verification",
			endpoints: [
				{
					method: "GET",
					path: "/service",
					title: "List All Services",
					description:
						"Get list of all available services",
					icon: Package,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: [
							{ code: "tg", name: "Telegram" },
							{ code: "wa", name: "WhatsApp" },
							{ code: "fb", name: "Facebook" },
						],
					},
					example: `curl -X GET "${BASE_URL}/service?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
			],
		},
		{
			id: "countries",
			title: "Countries",
			icon: Globe,
			description:
				"Get available countries for phone numbers",
			endpoints: [
				{
					method: "GET",
					path: "/country",
					title: "List All Countries",
					description:
						"Get list of all available countries",
					icon: Globe,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: [
							{ name: "Russia", code: "0" },
							{ name: "Ukraine", code: "1" },
							{ name: "Kazakhstan", code: "2" },
						],
					},
					example: `curl -X GET "${BASE_URL}/country?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
			],
		},
		{
			id: "pricing",
			title: "Pricing",
			icon: DollarSign,
			description:
				"Get pricing information for services",
			endpoints: [
				{
					method: "GET",
					path: "/pricing",
					title: "Get All Pricing",
					description:
						"Get pricing for all country and service combinations",
					icon: DollarSign,
					params: [
						{
							name: "apiKey",
							type: "string",
							required: true,
							description: "Your API key",
							example:
								user?.apiKey || "your_api_key",
						},
					],
					response: {
						state: "200",
						data: [
							{
								country: {
									code: "0",
									name: "Russia",
								},
								service: {
									code: "tg",
									name: "Telegram",
								},
								provider1: 0.5,
								provider2: 0.6,
							},
						],
					},
					example: `curl -X GET "${BASE_URL}/pricing?apiKey=${
						user?.apiKey || "your_api_key"
					}"`,
				},
			],
		},
	];
}
