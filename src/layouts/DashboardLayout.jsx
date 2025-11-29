import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
	const [mobileMenuOpen, setMobileMenuOpen] =
		useState(false);
	const { user } = useAuth();

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
				<Sidebar userRole={user?.role} />
			</aside>

			{/* Mobile Sidebar */}
			<Sheet
				open={mobileMenuOpen}
				onOpenChange={setMobileMenuOpen}
			>
				<SheetContent
					side="left"
					className="p-0 w-64"
				>
					<Sidebar
						userRole={user?.role}
						onNavigate={() =>
							setMobileMenuOpen(false)
						}
					/>
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<div className="flex flex-1 flex-col lg:pl-64">
				<Topbar
					onMenuClick={() =>
						setMobileMenuOpen(true)
					}
				/>

				{/* Page Content */}
				<main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30">
					<div className="container mx-auto p-4 md:p-6 lg:p-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
