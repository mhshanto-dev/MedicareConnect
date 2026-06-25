export default function DoctorLayout({ children }) {
  return <div className="doctor-dashboard flex min-h-screen">
    <aside className="w-64 bg-white shadow-md p-4">Doctor Sidebar</aside>
    <main className="flex-1 p-8 bg-gray-50">{children}</main>
  </div>;
}
