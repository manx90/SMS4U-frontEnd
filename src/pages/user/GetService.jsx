import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	countryApi,
	serviceApi,
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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [countriesRes, servicesRes] =
				await Promise.all([
					countryApi.getAll(),
					serviceApi.getAll(),
				]);
			if (countriesRes.state === "200")
				setCountries(countriesRes.data || []);
			if (servicesRes.state === "200")
				setServices(servicesRes.data || []);
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
