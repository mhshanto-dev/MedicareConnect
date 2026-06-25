export default function AdminLayout({ children }) {
  return <div className="admin-dashboard flex min-h-screen">
    <aside className="w-64 bg-gray-900 text-white shadow-md p-4">Admin Sidebar</aside>
    <main className="flex-1 p-8 bg-gray-100">{children}</main>
  </div>;
}
