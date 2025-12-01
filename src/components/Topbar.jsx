import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Menu,
	Search,
	LogOut,
	User as UserIcon,
	Settings,
	Wallet,
	MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { ThemeSelector } from "./theme-selector";
import { useAuth } from "../hooks/useAuth";

export function Topbar({ onMenuClick }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] =
		useState("");

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleProfile = () => {
		if (user?.role === "admin") {
			navigate("/admin/settings");
		} else {
			navigate("/user/account");
		}
	};

	const getInitials = (name) => {
		return (
			name
				?.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2) || "U"
		);
	};

	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
			{/* Mobile Menu Button */}
			<Button
				variant="ghost"
				size="icon"
				className="lg:hidden hover:scale-105 text-foreground"
				onClick={onMenuClick}
			>
				<Menu className="h-6 w-6" />
				<span className="sr-only">
					Toggle menu
				</span>
			</Button>

			{/* Search Bar */}
			<div className="flex-1 md:max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) =>
							setSearchQuery(e.target.value)
						}
						className="w-full pl-9 h-10 bg-muted/50 border-muted focus:bg-background transition-colors text-foreground placeholder:text-muted-foreground"
					/>
				</div>
			</div>

			{/* Right Side Actions */}
			<div className="flex items-center gap-2">
				{/* Support Link */}
				<a
					href="https://t.me/sms4u_pro"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
					title="Support on Telegram"
				>
					<MessageCircle className="h-4 w-4" />
					<span className="hidden sm:inline">Support</span>
				</a>

				{/* Visual Theme Selector */}
				{/* <ThemeSelector /> */}

				{/* Theme Toggle */}
				<ThemeToggle />

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-9 w-9 rounded-full hover:scale-105"
						>
							<Avatar className="h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
								<AvatarImage
									src={`https://avatar.vercel.sh/${
										user?.name || "user"
									}`}
									alt={user?.name || "User"}
								/>
								<AvatarFallback className="bg-primary/10 text-primary font-semibold">
									{getInitials(user?.name)}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-64"
					>
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-semibold leading-none">
									{user?.name || "User"}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{user?.email || "No email"}
								</p>
								<div className="flex items-center gap-2 mt-2">
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{user?.role === "admin"
											? "Admin"
											: "User"}
									</Badge>
									{user?.balance !==
										undefined && (
										<div className="flex items-center gap-1 text-xs font-medium text-primary">
											<Wallet className="h-3 w-3" />
											{user.balance.toFixed(2)} USDT
										</div>
									)}
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={handleProfile}
						>
							<UserIcon className="mr-2 h-4 w-4" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() =>
								navigate(
									user?.role === "admin"
										? "/admin/settings"
										: "/user/account",
								)
							}
						>
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive cursor-pointer"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
