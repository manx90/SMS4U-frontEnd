import { CopyButton } from "../shared/CopyButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChevronDown,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	"https://api.sms4u.pro/api/v1";

export function CodeBlock({
	code,
	language = "bash",
}) {
	return (
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
}

export function EndpointCard({
	method,
	path,
	title,
	description,
	params,
	response,
	example,
	icon: Icon,
	expandedSections,
	toggleSection,
	endpointKey,
}) {
	const sectionId =
		endpointKey ?? `${method}-${path}`;
	const isExpanded = expandedSections[sectionId];

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
}
