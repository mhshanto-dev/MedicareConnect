'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Sidebar({ links, role }) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col shadow-sm sticky top-0 h-screen">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-blue-600 capitalize">{role} Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name || 'User'}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-red-600 hover:bg-red-50 transition font-medium">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
