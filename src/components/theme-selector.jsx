import {
	Palette,
	Sparkles,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
	{
		value: "minimal",
		label: "Cool & Minimal",
		icon: Palette,
		description: "Clean and simple",
	},
	{
		value: "premium",
		label: "Premium",
		icon: Sparkles,
		description: "Shadows and glows",
	},
	{
		value: "gradient",
		label: "Gradient",
		icon: Zap,
		description: "Modern glassmorphism",
	},
];

export function ThemeSelector() {
	const [visualTheme, setVisualTheme] =
		useState("minimal");

	useEffect(() => {
		const stored = localStorage.getItem(
			"visual-theme",
		);
		if (
			stored &&
			["minimal", "premium", "gradient"].includes(
				stored,
			)
		) {
			setVisualTheme(stored);
			document.documentElement.setAttribute(
				"data-theme",
				stored,
			);
		}
	}, []);

	const handleThemeChange = (newTheme) => {
		setVisualTheme(newTheme);
		localStorage.setItem(
			"visual-theme",
			newTheme,
		);
		document.documentElement.setAttribute(
			"data-theme",
			newTheme,
		);
	};

	const currentTheme = themes.find(
		(t) => t.value === visualTheme,
	);
	const Icon = currentTheme?.icon || Palette;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Icon className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">
						Select visual theme
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-56"
			>
				<DropdownMenuLabel>
					Visual Theme
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{themes.map((theme) => {
					const ThemeIcon = theme.icon;
					return (
						<DropdownMenuItem
							key={theme.value}
							onClick={() =>
								handleThemeChange(theme.value)
							}
							className={
								visualTheme === theme.value
									? "bg-accent"
									: ""
							}
						>
							<ThemeIcon className="mr-2 h-4 w-4" />
							<div className="flex flex-col">
								<span className="font-medium">
									{theme.label}
								</span>
								<span className="text-xs text-muted-foreground">
									{theme.description}
								</span>
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}


