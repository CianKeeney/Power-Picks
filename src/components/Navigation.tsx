'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">RaffleHub</div>
          <div className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            <Link href="/raffles" className="text-gray-600 hover:text-purple-600">Raffles</Link>
            <Link href="/winners" className="text-gray-600 hover:text-purple-600">Winners</Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600">About</Link>
          </div>
          <Link 
            href="/admin/login" 
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </nav>
      </header>
      <footer className="bg-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">RaffleHub</h3>
              <p className="text-gray-600">Your chance to win amazing prizes</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-purple-600">Home</Link></li>
                <li><Link href="/raffles" className="text-gray-600 hover:text-purple-600">Raffles</Link></li>
                <li><Link href="/winners" className="text-gray-600 hover:text-purple-600">Winners</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-600 hover:text-purple-600">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-600">Email: support@rafflehub.com</li>
                <li className="text-gray-600">Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            © 2024 RaffleHub. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
} 