import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	countryApi,
	serviceApi,
	// orderApi,
	pricingApi,
} from "../../services/api";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Phone, Mail } from "lucide-react";
import PhoneNumberTab from "./GetServiceTabs/PhoneNumberTab";
import EmailTab from "./GetServiceTabs/EmailTab";

export default function GetService() {
	const { user, updateUserBalance } = useAuth();
	const [activeTab, setActiveTab] =
		useState("phone");
	const [countries, setCountries] = useState([]);
	const [services, setServices] = useState([]);
	const [pricing, setPricing] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [
				countriesRes,
				servicesRes,
				firstPageRes,
			] = await Promise.all([
				countryApi.getAll(),
				serviceApi.getAll(),
				pricingApi.getAll(1, 1000), // Get first page with large limit
			]);
			
			if (countriesRes.state === "200")
				setCountries(countriesRes.data || []);
			if (servicesRes.state === "200")
				setServices(servicesRes.data || []);
			
			if (firstPageRes.state === "200") {
				let allPricingData = firstPageRes.data || [];
				const pagination = firstPageRes.pagination;
				
				// If there are more pages, fetch them all
				if (pagination && pagination.totalPages > 1) {
					const remainingPages = [];
					for (let page = 2; page <= pagination.totalPages; page++) {
						remainingPages.push(pricingApi.getAll(page, 1000));
					}
					
					const remainingResults = await Promise.all(remainingPages);
					
					remainingResults.forEach((result) => {
						if (result.state === "200" && result.data) {
							allPricingData = [...allPricingData, ...result.data];
						}
					});
				}
				
				setPricing(allPricingData);
			}
		} catch (error) {
			console.error(
				"Failed to load data:",
				error,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in-50">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Get Service
				</h1>
				<p className="text-muted-foreground mt-2">
					Order a temporary phone number or email
					to receive verification codes
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger
						value="phone"
						className="flex items-center gap-2"
					>
						<Phone className="h-4 w-4" />
						Phone Number
					</TabsTrigger>
					<TabsTrigger
						value="email"
						className="flex items-center gap-2"
					>
						<Mail className="h-4 w-4" />
						Email
					</TabsTrigger>
				</TabsList>

				<TabsContent value="phone">
					<PhoneNumberTab
						user={user}
						countries={countries}
						services={services}
						pricing={pricing}
						loading={loading}
						updateUserBalance={updateUserBalance}
					/>
				</TabsContent>

				<TabsContent value="email">
					<EmailTab
						user={user}
						loading={loading}
						updateUserBalance={updateUserBalance}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
