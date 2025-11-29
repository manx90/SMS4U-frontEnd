import {
	useNavigate,
	useLocation,
} from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	Settings,
	Package,
	Globe,
	DollarSign,
	ShoppingCart,
	Phone,
	List,
	UserCircle,
	Mail,
	Server,
	Globe2,
	Zap,
	Book,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Route prefetching map
const routePrefetchMap = {
	"/admin/dashboard": () => import("../pages/admin/Dashboard"),
	"/admin/users": () => import("../pages/admin/Users"),
	"/admin/services": () => import("../pages/admin/Services"),
	"/admin/countries": () => import("../pages/admin/Countries"),
	"/admin/pricing": () => import("../pages/admin/Pricing"),
	"/admin/orders": () => import("../pages/admin/Orders"),
	"/admin/email-sites": () => import("../pages/admin/EmailSites"),
	"/admin/email-domains": () => import("../pages/admin/EmailDomains"),
	"/admin/email-prices": () => import("../pages/admin/EmailPrices"),
	"/user/dashboard": () => import("../pages/user/Dashboard"),
	"/user/get-service": () => import("../pages/user/GetService"),
	"/user/orders": () => import("../pages/user/Orders"),
	"/user/account": () => import("../pages/user/Account"),
	"/user/api-docs": () => import("../pages/user/ApiDocs"),
};

// Prefetch handler
const prefetchRoute = (path) => {
	const prefetch = routePrefetchMap[path];
	if (prefetch) {
		prefetch().catch(() => {});
	}
};

// Admin navigation structure
const adminNavItems = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		path: "/admin/dashboard",
	},
	{
		name: "Management",
		icon: Settings,
		children: [
			{
				name: "Users",
				icon: Users,
				path: "/admin/users",
			},
			{
				name: "Services",
				icon: Package,
				path: "/admin/services",
			},
			{
				name: "Countries",
				icon: Globe,
				path: "/admin/countries",
			},
			{
				name: "Pricing",
				icon: DollarSign,
				path: "/admin/pricing",
			},
		],
	},
	{
		name: "Email Management",
		icon: Mail,
		children: [
			{
				name: "Email Sites",
				icon: Server,
				path: "/admin/email-sites",
			},
			{
				name: "Email Domains",
				icon: Globe2,
				path: "/admin/email-domains",
			},
			{
				name: "Email Prices",
				icon: Zap,
				path: "/admin/email-prices",
			},
		],
	},
	{
		name: "Orders",
		icon: ShoppingCart,
		path: "/admin/orders",
	},
];

// User navigation structure
const userNavItems = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		path: "/user/dashboard",
	},
	{
		name: "Orders",
		icon: ShoppingCart,
		children: [
			{
				name: "Get Service",
				icon: Zap,
				path: "/user/get-service",
			},
			{
				name: "My Orders",
				icon: List,
				path: "/user/orders",
			},
		],
	},
	{
		name: "Account",
		icon: UserCircle,
		path: "/user/account",
	},
	{
		name: "API Docs",
		icon: Book,
		path: "/user/api-docs",
	},
];

export function Sidebar({
	userRole,
	onNavigate,
	className,
}) {
	const navigate = useNavigate();
	const location = useLocation();

	const navItems =
		userRole === "admin"
			? adminNavItems
			: userNavItems;

	const handleNavigate = (path) => {
		navigate(path);
		if (onNavigate) {
			onNavigate();
		}
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const isGroupActive = (children) => {
		return children?.some(
			(child) => location.pathname === child.path,
		);
	};

	return (
		<div
			className={cn(
				"flex h-full flex-col border-r bg-sidebar glass-sidebar",
				className,
			)}
		>
			{/* Logo/Brand */}
			<div className="flex h-16 items-center border-b border-sidebar-border px-6">
				<div className="flex items-center gap-3 font-bold">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
						<LayoutDashboard className="h-5 w-5" />
					</div>
					<span className="text-lg tracking-tight">
						{userRole === "admin"
							? "Admin Panel"
							: "SMS Service"}
					</span>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-4 overflow-y-auto">
				{navItems.map((item) => {
					const Icon = item.icon;

					if (item.children) {
						const hasActiveChild = isGroupActive(
							item.children,
						);

						return (
							<div
								key={item.name}
								className="space-y-1"
							>
								{/* Parent Menu Item */}
								<div
									className={cn(
										"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
										hasActiveChild
											? "bg-primary/10 text-primary"
											: "text-sidebar-foreground/80",
									)}
								>
									<Icon className="h-5 w-5" />
									{item.name}
								</div>

								{/* Always Visible Submenu */}
								<div className="ml-3 space-y-1 border-l-2 border-sidebar-border/50 pl-3">
									{item.children.map((child) => {
										const ChildIcon = child.icon;
										const childIsActive =
											isActive(child.path);

										return (
											<button
												key={child.path}
												onClick={() =>
													handleNavigate(
														child.path,
													)
												}
												onMouseEnter={() => prefetchRoute(child.path)}
												onFocus={() => prefetchRoute(child.path)}
												className={cn(
													"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
													childIsActive
														? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
														: "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
												)}
											>
												<ChildIcon className="h-4 w-4" />
												{child.name}
											</button>
										);
									})}
								</div>
							</div>
						);
					}

					const itemIsActive = isActive(
						item.path,
					);

				return (
					<button
						key={item.path}
						onClick={() =>
							handleNavigate(item.path)
						}
						onMouseEnter={() => prefetchRoute(item.path)}
						onFocus={() => prefetchRoute(item.path)}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
							itemIsActive
								? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
								: "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]",
						)}
					>
						<Icon
							className={cn(
								"h-5 w-5 transition-transform",
								itemIsActive && "scale-110",
							)}
						/>
						{item.name}
					</button>
				);
				})}
			</nav>

			{/* Footer */}
			<div className="border-t border-sidebar-border p-4">
				<div className="text-xs text-sidebar-foreground/60 font-medium">
					© 2025 SMS Service
				</div>
			</div>
		</div>
	);
}
