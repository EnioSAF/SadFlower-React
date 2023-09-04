import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SadFlower',
  description: 'SadFlower World',
};

const RootLayout = ({ children }) =>  (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );

  export default RootLayout;
