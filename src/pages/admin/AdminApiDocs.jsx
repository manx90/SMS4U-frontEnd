import { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../../components/shared/CopyButton";
import { Book, Code, Shield } from "lucide-react";
import {
	BASE_URL,
	CodeBlock,
	EndpointCard,
} from "../../components/api-docs/ApiDocComponents.jsx";
import { buildUserApiSections } from "../user/apiDocsUserSections.js";
import { buildAdminApiSections } from "./adminApiDocsSections.js";

export default function AdminApiDocs() {
	const { user } = useAuth();
	const [expandedSections, setExpandedSections] =
		useState({});

	const toggleSection = (sectionId) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
	};

	const apiSections = useMemo(() => {
		const u = buildUserApiSections(user);
		const a = buildAdminApiSections(user);
		return [...u, ...a];
	}, [user]);

	return (
		<div className="space-y-6 animate-in fade-in-50">
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
										Admin API documentation
									</h1>
									<p className="text-muted-foreground mt-1">
										All client endpoints plus admin routes
										— authenticate with an admin account
										apiKey
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="glass-card border-primary/10">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Code className="h-5 w-5 text-primary" />
						<CardTitle>Getting started (admin)</CardTitle>
					</div>
					<CardDescription>
						Base URL and admin authentication (admin apiKey)
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
						<div className="flex items-center gap-2 mb-2">
							<Shield className="h-4 w-4 text-primary" />
							<h4 className="font-semibold">
								Admin authentication — apiKey only
							</h4>
						</div>
						<p className="text-sm text-muted-foreground mb-3">
							Use <code className="text-xs">apiKey</code> for an
							account with role admin (query string,{" "}
							<code className="text-xs">X-Api-Key</code>, or{" "}
							<code className="text-xs">
								Authorization: ApiKey
							</code>
							). JWT is for the dashboard session, not for API
							calls.
						</p>
						<CodeBlock
							code={`curl "${BASE_URL}/users/all?apiKey=${user?.apiKey || "your_admin_api_key"}`}
							language="bash"
						/>
					</div>

					<Separator />

					<div>
						<h4 className="font-semibold mb-2">
							Response shape
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							Same JSON envelope as the user API:
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
										endpointKey={`${section.id}-${idx}`}
										{...endpoint}
										expandedSections={
											expandedSections
										}
										toggleSection={
											toggleSection
										}
									/>
								),
							)}
						</div>
					</div>
				);
			})}

			<Card className="glass-card border-primary/10">
				<CardHeader>
					<CardTitle>Common error codes</CardTitle>
					<CardDescription>
						401 without apiKey:{" "}
						<code className="text-xs">
							{`{"error":"Unauthorized","message":"apiKey is required"}`}
						</code>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[
							{
								code: "200",
								desc: "Success",
							},
							{
								code: "202",
								desc: "Pending",
							},
							{
								code: "400",
								desc: "Bad request or insufficient balance",
							},
							{
								code: "401",
								desc: "Missing or invalid apiKey",
							},
							{
								code: "403",
								desc: "Not admin or insufficient permissions",
							},
							{
								code: "404",
								desc: "Not found",
							},
							{
								code: "500",
								desc: "Server error",
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
