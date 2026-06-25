export default function Navbar() {
  return (
    <nav className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600">MediCare Connect</h1>
      <div className="flex gap-6 font-medium text-gray-700">
        <a href="/" className="hover:text-blue-600 transition">Home</a>
        <a href="/find-doctors" className="hover:text-blue-600 transition">Find Doctors</a>
        <a href="/login" className="hover:text-blue-600 transition">Login</a>
      </div>
    </nav>
  );
}
