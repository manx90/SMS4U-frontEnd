import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({
	text,
	className,
	size = "icon",
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async (e) => {
		// Prevent event bubbling
		e?.stopPropagation();
		
		try {
			// Detect if running on mobile
			const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			
			// On mobile, always use the fallback method as it's more reliable
			if (isMobile || !navigator.clipboard || !navigator.clipboard.writeText) {
				// Fallback method for mobile and older browsers
				const textArea = document.createElement("textarea");
				textArea.value = text;
				
				// Critical: Make it invisible but still accessible for selection
				textArea.style.position = "fixed";
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.width = "2em";
				textArea.style.height = "2em";
				textArea.style.padding = "0";
				textArea.style.border = "none";
				textArea.style.outline = "none";
				textArea.style.boxShadow = "none";
				textArea.style.background = "transparent";
				textArea.style.opacity = "0";
				textArea.style.fontSize = "16px"; // Prevent zoom on iOS
				textArea.setAttribute("readonly", "");
				
				document.body.appendChild(textArea);
				
				// Focus is important for mobile
				textArea.focus();
				
				// Handle iOS devices specially
				if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
					// iOS requires a different approach
					textArea.contentEditable = "true";
					textArea.readOnly = false;
					
					const range = document.createRange();
					range.selectNodeContents(textArea);
					
					const selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					
					textArea.setSelectionRange(0, 999999);
				} else {
					// Android and other mobile devices
					textArea.select();
					textArea.setSelectionRange(0, 99999);
				}
				
				// Execute copy command
				let successful = false;
				try {
					successful = document.execCommand("copy");
				} catch (err) {
					console.error("execCommand failed:", err);
				}
				
				// Clean up
				document.body.removeChild(textArea);
				
				if (successful) {
					setCopied(true);
					toast.success("Copied to clipboard!");
					setTimeout(() => setCopied(false), 2000);
				} else {
					throw new Error("Copy command failed");
				}
			} else {
				// Modern Clipboard API for desktop (HTTPS only)
				await navigator.clipboard.writeText(text);
				setCopied(true);
				toast.success("Copied to clipboard!");
				setTimeout(() => setCopied(false), 2000);
			}
		} catch (error) {
			console.error("Copy failed:", error);
			toast.error("Failed to copy. Please copy manually.");
		}
	};

	return (
		<Button
			variant="ghost"
			size={size}
			className={cn(
				"hover:scale-105 transition-transform",
				className,
			)}
			onClick={handleCopy}
		>
			{copied ? (
				<Check className="h-4 w-4 text-green-500" />
			) : (
				<Copy className="h-4 w-4" />
			)}
		</Button>
	);
}

export default CopyButton;
