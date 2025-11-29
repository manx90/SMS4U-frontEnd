"use client";
import {
	useState,
	useEffect,
	type ReactNode,
} from "react";
import {
	motion,
	AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

type WordItem =
	| string
	| { icon: ReactNode; text: string };

export const LayoutTextFlip = ({
	text = "Build Amazing",
	words = [
		"Landing Pages",
		"Component Blocks",
		"Page Sections",
		"3D Shaders",
	],
	duration = 3000,
	className,
}: {
	text: string;
	words: WordItem[];
	duration?: number;
	className?: string;
}) => {
	const [currentIndex, setCurrentIndex] =
		useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(
				(prevIndex) =>
					(prevIndex + 1) % words.length,
			);
		}, duration);

		return () => clearInterval(interval);
	}, [duration, words.length]);

	const currentWord = words[currentIndex];
	const isObject =
		typeof currentWord === "object" &&
		currentWord !== null;

	return (
		<>
			<motion.span
				layoutId="subtext"
				className="text-sm font-bold tracking-tight drop-shadow-lg md:text-4xl"
			>
				{text}
			</motion.span>

			<motion.span
				layout
				className={cn(
					"relative w-fit overflow-hidden rounded-md border border-transparent bg-white px-1 font-sans text-lg font-bold tracking-tight text-black shadow-sm ring shadow-black/10 ring-black/10 drop-shadow-lg md:text-4xl dark:bg-neutral-900 dark:text-white dark:shadow-sm dark:ring-1 dark:shadow-white/10 dark:ring-white/10",
					className,
				)}
			>
				<AnimatePresence mode="popLayout">
					<motion.span
						key={currentIndex}
						initial={{
							y: -40,
							filter: "blur(10px)",
						}}
						animate={{
							y: 0,
							filter: "blur(0px)",
						}}
						exit={{
							y: 50,
							filter: "blur(10px)",
							opacity: 0,
						}}
						transition={{
							duration: 0.5,
						}}
						className={cn(
							"inline-flex items-center gap-2 whitespace-nowrap",
						)}
					>
						{isObject ? (
							<>
								<span className="flex items-center gap-2 text-sm md:text-3xl">
									{currentWord.icon}
									{currentWord.text}
								</span>
							</>
						) : (
							currentWord
						)}
					</motion.span>
				</AnimatePresence>
			</motion.span>
		</>
	);
};
