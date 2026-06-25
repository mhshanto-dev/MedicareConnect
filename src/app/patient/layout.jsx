export default function PatientLayout({ children }) {
  return <div className="patient-dashboard flex min-h-screen">
    <aside className="w-64 bg-white shadow-md p-4">Patient Sidebar</aside>
    <main className="flex-1 p-8">{children}</main>
  </div>;
}
