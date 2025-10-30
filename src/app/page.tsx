export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold">CISO Insight Dashboard</h1>
      <p className="text-gray-400 mt-2">
        Executive analytics for GitHub PR security risk
      </p>
      <a href="/dashboard"
         className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        View Dashboard
      </a>
    </main>
  );
}
