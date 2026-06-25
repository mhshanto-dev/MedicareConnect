export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded">Go Home</a>
    </div>
  );
}
