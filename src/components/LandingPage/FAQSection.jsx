import { memo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { faqItems } from "./data";

const FAQSection = memo(() => {
	return (
		<section
			id="faq"
			className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-[#0b0b0b]"
		>
			<div className="max-w-4xl mx-auto px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-10 sm:mb-12 md:mb-16"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
						Frequently Asked{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">
							Questions
						</span>
					</h2>
				</motion.div>

				<Accordion
					type="single"
					collapsible
					className="w-full"
				>
					{faqItems.map((item, index) => (
						<AccordionItem
							key={index}
							value={`item-${index}`}
						>
							<AccordionTrigger className="text-left text-sm sm:text-base text-gray-900 dark:text-white hover:text-[#3B82F6]">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
