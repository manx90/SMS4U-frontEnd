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
import {
	Book,
	Code,
} from "lucide-react";
import {
	BASE_URL,
	CodeBlock,
	EndpointCard,
} from "../../components/api-docs/ApiDocComponents.jsx";
import { buildUserApiSections } from "./apiDocsUserSections.js";

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

	const apiSections = useMemo(
		() => buildUserApiSections(user),
		[user],
	);

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
										API Documentation
									</h1>
									<p className="text-muted-foreground mt-1">
										Developer guide — SMS, email, and
										API integration (apiKey auth)
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
						<CardTitle>Getting Started</CardTitle>
					</div>
					<CardDescription>
						Quick start — base URL, authentication, response
						shape
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
							Authentication — apiKey only on the API
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							Protected routes do not accept JWT on the server.
							The web app may use JWT for session; for API calls
							send <code className="text-xs">apiKey</code> (query,
							header, or JSON body on POST). See the
							&ldquo;Authentication — apiKey&rdquo; section
							below.
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
							Response format (typical)
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							JSON responses; many routes use:
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
					<CardTitle>
						Common HTTP status codes
					</CardTitle>
					<CardDescription>
						401 when apiKey is missing:{" "}
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
								desc: "Success — request completed",
							},
							{
								code: "202",
								desc: "Pending — message not ready yet (retry)",
							},
							{
								code: "400",
								desc: "Bad request — invalid params or insufficient balance",
							},
							{
								code: "401",
								desc: "Unauthorized — missing or invalid apiKey",
							},
							{
								code: "403",
								desc: "Forbidden — role not allowed for this route",
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
