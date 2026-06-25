import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Health, Our Priority</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">Book appointments with top healthcare professionals effortlessly. Manage your schedule, view prescriptions, and pay online securely.</p>
      <div className="flex gap-4">
        <Link href="/find-doctors" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">Find a Doctor</Link>
        <Link href="/register" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition">Register Now</Link>
      </div>
    </div>
  );
}
