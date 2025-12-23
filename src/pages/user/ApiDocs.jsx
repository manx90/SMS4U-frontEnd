import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../../components/shared/CopyButton";
import {
	Book,
	Code,
	Key,
	ChevronDown,
	ChevronRight,
	Server,
	Shield,
	User,
	ShoppingCart,
	Mail,
	Globe,
	Package,
	DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	"http://localhost:3000/api/v1";

export default function ApiDocs() {
	const { user } = useAuth();
	const [expandedSections, setExpandedSections] =
		useState({});

	const toggleSection = (sectionId) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
	};

	const CodeBlock = ({
		code,
		language = "bash",
	}) => (
		<div className="relative group">
			<div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<CopyButton text={code} />
			</div>
			<pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
				<code className={`language-${language}`}>
					{code}
				</code>
			</pre>
		</div>
	);

	const EndpointCard = ({
		method,
		path,
		title,
		description,
		params,
		response,
		example,
		icon: Icon,
	}) => {
		const sectionId = `${method}-${path}`;
		const isExpanded =
			expandedSections[sectionId];

		return (
			<Card className="border-primary/10">
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection(sectionId)}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{Icon && (
								<Icon className="h-5 w-5 text-primary" />
							)}
							<div>
								<div className="flex items-center gap-2">
									<span
										className={cn(
											"px-2 py-1 rounded text-xs font-bold",
											method === "GET" &&
												"bg-green-500/10 text-green-600",
											method === "POST" &&
												"bg-blue-500/10 text-blue-600",
										)}
									>
										{method}
									</span>
									<code className="text-sm font-mono">
										{path}
									</code>
								</div>
								<CardTitle className="mt-2 text-lg">
									{title}
								</CardTitle>
								<CardDescription className="mt-1">
									{description}
								</CardDescription>
							</div>
						</div>
						{isExpanded ? (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronRight className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{isExpanded && (
					<CardContent className="space-y-4">
						{params && params.length > 0 && (
							<div>
								<h4 className="font-semibold mb-2">
									Parameters
								</h4>
								<div className="space-y-2">
									{params.map((param, idx) => (
										<div
											key={idx}
											className="border rounded-lg p-3 bg-muted/30"
										>
											<div className="flex items-start justify-between">
												<div>
													<code className="text-sm font-mono text-primary">
														{param.name}
													</code>
													{param.required && (
														<span className="ml-2 text-xs text-red-500">
															*required
														</span>
													)}
													<p className="text-sm text-muted-foreground mt-1">
														{param.description}
													</p>
													{param.example && (
														<code className="text-xs text-muted-foreground">
															Example:{" "}
															{param.example}
														</code>
													)}
												</div>
												<span className="text-xs px-2 py-1 rounded bg-secondary">
													{param.type}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{response && (
							<div>
								<h4 className="font-semibold mb-2">
									Response
								</h4>
								<CodeBlock
									code={JSON.stringify(
										response,
										null,
										2,
									)}
									language="json"
								/>
							</div>
						)}

						{example && (
							<div>
								<h4 className="font-semibold mb-2">
									Example Request
								</h4>
								<CodeBlock
									code={example}
									language="bash"
								/>
							</div>
						)}
					</CardContent>
				)}
			</Card>
		);
	};

	const apiSections = [
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
							description: "Provider (1 or 2)",
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

	return (
		<div className="space-y-6 animate-in fade-in-50">
			{/* Header */}
			<Card className="glass-card border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10">
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div>
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
									<Book className="h-6 w-6" />
								</div>
								<div>
									<h1 className="text-3xl font-bold tracking-tight">
										API Documentation
									</h1>
									<p className="text-muted-foreground mt-1">
										Complete guide to integrate
										our SMS service API
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Getting Started */}
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Code className="h-5 w-5 text-primary" />
						<CardTitle>Getting Started</CardTitle>
					</div>
					<CardDescription>
						Quick start guide to using our API
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="font-semibold mb-2">
							Base URL
						</h4>
						<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
							<code className="flex-1 font-mono text-sm">
								{BASE_URL}
							</code>
							<CopyButton text={BASE_URL} />
						</div>
					</div>

					<Separator />

					<div>
						<h4 className="font-semibold mb-2">
							Authentication
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							All API requests require your API
							key. Include it as a query
							parameter:
						</p>
						<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
							<code className="flex-1 font-mono text-sm break-all">
								?apiKey=
								{user?.apiKey || "your_api_key"}
							</code>
							{user?.apiKey && (
								<CopyButton text={user.apiKey} />
							)}
						</div>
					</div>

					<Separator />

					<div>
						<h4 className="font-semibold mb-2">
							Response Format
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							All responses are in JSON format
							with a consistent structure:
						</p>
						<CodeBlock
							code={JSON.stringify(
								{
									state: "200",
									data: "{ ... }",
									msg: "success",
								},
								null,
								2,
							)}
							language="json"
						/>
					</div>
				</CardContent>
			</Card>

			{/* API Sections */}
			{apiSections.map((section) => {
				const SectionIcon = section.icon;
				return (
					<div
						key={section.id}
						className="space-y-4"
					>
						<Card className="glass-card border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<SectionIcon className="h-5 w-5" />
									</div>
									<div>
										<CardTitle className="text-xl">
											{section.title}
										</CardTitle>
										<CardDescription>
											{section.description}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>

						<div className="space-y-3">
							{section.endpoints.map(
								(endpoint, idx) => (
									<EndpointCard
										key={`${section.id}-${idx}`}
										{...endpoint}
									/>
								),
							)}
						</div>
					</div>
				);
			})}

			{/* Error Codes */}
			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>
						Common Error Codes
					</CardTitle>
					<CardDescription>
						Understanding API error responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[
							{
								code: "200",
								desc: "Success - Request completed successfully",
							},
							{
								code: "202",
								desc: "Pending - Message not received yet (check again)",
							},
							{
								code: "400",
								desc: "Bad Request - Invalid parameters or insufficient balance",
							},
							{
								code: "401",
								desc: "Unauthorized - Invalid API key",
							},
							{
								code: "404",
								desc: "Not Found - Resource not found",
							},
							{
								code: "500",
								desc: "Server Error - Internal server error",
							},
						].map((error) => (
							<div
								key={error.code}
								className="flex items-start gap-3 p-3 border rounded-lg"
							>
								<code className="px-2 py-1 rounded bg-muted text-sm font-mono">
									{error.code}
								</code>
								<p className="text-sm text-muted-foreground">
									{error.desc}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
