// Typewriter words for headline
export const typewriterWords = [
	{ text: "Get" },
	{ text: "Temporary" },
	{ text: "Numbers" },
	{
		text: "for",
		className: "text-gray-600 dark:text-gray-400",
	},
];

// Service names data (without JSX - will be rendered in component)
export const serviceNamesData = [
	{
		name: "Facebook",
		color: "#1877F2",
		icon: "FaFacebookSquare",
	},
	{
		name: "WhatsApp",
		color: "#25D366",
		icon: "IoLogoWhatsapp",
	},
	{
		name: "Instagram",
		color: "#E4405F",
		icon: "FaInstagram",
	},
	{
		name: "Telegram",
		color: "#0088cc",
		icon: "FaTelegramPlane",
	},
	{
		name: "Twitter",
		color: "#1DA1F2",
		icon: "FaTwitter",
	},
	{
		name: "Google",
		color: "#EA4335",
		icon: "FaGoogle",
	},
	{
		name: "LinkedIn",
		color: "#0A66C2",
		icon: "FaLinkedin",
	},
	{
		name: "Discord",
		color: "#5865F2",
		icon: "RiDiscordLine",
	},
	{
		name: "Snapchat",
		color: "#FFFC00",
		icon: "FaSnapchat",
	},
	{
		name: "Spotify",
		color: "#1DB954",
		icon: "FaSpotify",
	},
	{
		name: "Uber",
		color: "text-black dark:text-white",
		icon: "FaUber",
	},
];

// World map connection dots
export const mapDots = [
	// America to Europe
	{
		start: { lat: 40.7128, lng: -74.006 },
		end: { lat: 51.5074, lng: -0.1278 },
	}, // NY to London
	{
		start: { lat: 34.0522, lng: -118.2437 },
		end: { lat: 48.8566, lng: 2.3522 },
	}, // LA to Paris
	{
		start: { lat: -23.5505, lng: -46.6333 },
		end: { lat: 41.9028, lng: 12.4964 },
	}, // Sao Paulo to Rome
	// Europe to Asia
	{
		start: { lat: 51.5074, lng: -0.1278 },
		end: { lat: 35.6762, lng: 139.6503 },
	}, // London to Tokyo
	{
		start: { lat: 52.52, lng: 13.405 },
		end: { lat: 39.9042, lng: 116.4074 },
	}, // Berlin to Beijing
	{
		start: { lat: 55.7558, lng: 37.6173 },
		end: { lat: 28.6139, lng: 77.209 },
	}, // Moscow to Delhi
	{
		start: { lat: 41.0082, lng: 28.9784 },
		end: { lat: 31.2304, lng: 121.4737 },
	}, // Istanbul to Shanghai
	// Asia Pacific
	{
		start: { lat: 35.6762, lng: 139.6503 },
		end: { lat: -33.8688, lng: 151.2093 },
	}, // Tokyo to Sydney
	{
		start: { lat: 1.3521, lng: 103.8198 },
		end: { lat: -37.8136, lng: 144.9631 },
	}, // Singapore to Melbourne
	{
		start: { lat: 13.7563, lng: 100.5018 },
		end: { lat: 22.3964, lng: 114.1095 },
	}, // Bangkok to Hong Kong
	// Cross-continental and Africa
	{
		start: { lat: 1.3521, lng: 103.8198 },
		end: { lat: 40.7128, lng: -74.006 },
	}, // Singapore to NY
	{
		start: { lat: -26.2041, lng: 28.0473 },
		end: { lat: 51.5074, lng: -0.1278 },
	}, // Johannesburg to London
	{
		start: { lat: 30.0444, lng: 31.2357 },
		end: { lat: 48.1351, lng: 11.582 },
	}, // Cairo to Munich
	{
		start: { lat: -33.9249, lng: 18.4241 },
		end: { lat: 19.4326, lng: -99.1332 },
	}, // Cape Town to Mexico City
	// Oceania & extras
	{
		start: { lat: -33.8688, lng: 151.2093 },
		end: { lat: -36.8485, lng: 174.7633 },
	}, // Sydney to Auckland
	{
		start: { lat: 37.7749, lng: -122.4194 },
		end: { lat: 35.6895, lng: 139.6917 },
	}, // SF to Tokyo
	{
		start: { lat: 19.4326, lng: -99.1332 },
		end: { lat: 40.4168, lng: -3.7038 },
	}, // Mexico City to Madrid
	{
		start: { lat: 48.2082, lng: 16.3738 },
		end: { lat: 59.3293, lng: 18.0686 },
	}, // Vienna to Stockholm
	{
		start: { lat: 55.7558, lng: 37.6173 },
		end: { lat: 35.6762, lng: 139.6503 },
	}, // Moscow to Tokyo
	{
		start: { lat: 39.9042, lng: 116.4074 },
		end: { lat: 1.3521, lng: 103.8198 },
	}, // Beijing to Singapore
	{
		start: { lat: 28.6139, lng: 77.209 },
		end: { lat: -33.8688, lng: 151.2093 },
	}, // Delhi to Sydney
	{
		start: { lat: 43.6532, lng: -79.3832 },
		end: { lat: 51.5074, lng: -0.1278 },
	}, // Toronto to London
];

// FAQ items
export const faqItems = [
	{
		question: "What services are supported?",
		answer:
			"We support all major platforms including Facebook, WhatsApp, Telegram, Instagram, TikTok, Google, Twitter, and over 3000+ other services. New services are added regularly based on user demand.",
	},
	{
		question: "How long is the number active?",
		answer:
			"Each temporary number remains active for 20 minutes from the time you receive it. This gives you plenty of time to complete your verification. If you need more time, you can extend the duration.",
	},

	{
		question: "What if I don't receive the code?",
		answer:
			"If you don't receive a code within 5 minutes, you can request a refund or try a different number at no extra charge. Our success rate is 99.9%, so this rarely happens.",
	},
	{
		question: "Do I need to register?",
		answer:
			"No registration required! Simply select your service, choose a number, and start receiving SMS codes immediately. You only pay for what you use.",
	},
];
