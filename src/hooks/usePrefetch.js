import { useEffect } from "react";

/**
 * Hook to prefetch routes for faster navigation
 * Prefetches the route when the component mounts or on hover
 */
export const usePrefetch = (routePath) => {
	useEffect(() => {
		// Dynamically import the route to prefetch it
		if (routePath) {
			const prefetch = () => {
				// This will trigger the lazy loading of the route
				import(/* @vite-ignore */ routePath).catch(() => {
					// Silently fail if route doesn't exist
				});
			};

			// Prefetch after a small delay to not block initial render
			const timer = setTimeout(prefetch, 100);
			return () => clearTimeout(timer);
		}
	}, [routePath]);
};

/**
 * Prefetch route on link hover/focus
 */
export const handlePrefetch = (importFn) => {
	return {
		onMouseEnter: () => {
			importFn().catch(() => {});
		},
		onFocus: () => {
			importFn().catch(() => {});
		},
	};
};

