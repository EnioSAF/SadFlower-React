import { SpeedInsights } from "@vercel/speed-insights/next"

import { Lato, Open_Sans } from "next/font/google";
import { updateStyles } from "@/styles/utils/responsive";
import '@/styles/styles.sass'

const lato = Lato({
	subsets: ["latin"],
	weight: ["400", "700", "900"],
	variable: "--font-lato",
});

const openSans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-open-sans",
});

export const metadata = {
	title: "SadFlower",
	description: "SadFlower World",
};

const RootLayout = ({ children }) => {
	updateStyles(); // Appel de la fonction updateStyles

	return (
		<html lang="fr">
			<SpeedInsights/>
			<body
				className={`${openSans.className} ${openSans.variable} ${lato.variable}`}
			>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;