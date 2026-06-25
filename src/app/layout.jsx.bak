import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MediCare Connect',
  description: 'Book appointments with top doctors effortlessly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">MediCare Connect</h1>
          <div className="flex gap-6 font-medium">
            <a href="/" className="hover:text-blue-200">Home</a>
            <a href="/find-doctors" className="hover:text-blue-200">Find Doctors</a>
            <a href="/login" className="hover:text-blue-200">Login</a>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
