import { Lato, Open_Sans } from "next/font/google";
import "@/styles/styles.sass";
import Header from "@/components/header";
import Footer from "@/components/footer";

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

const RootLayout = ({ children }) => (
	<html lang="en">
		<body
			className={`${openSans.className} ${openSans.variable} ${lato.variable}`}
		>

			<Header />
			{children}
			<Footer />
		</body>
	</html>
);

export default RootLayout;
