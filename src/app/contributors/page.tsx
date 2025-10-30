import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";

export default async function ContributorsPage() {
  const contributors = await fakeCisoInsightApi.fetchContributors();
  return (
    <main className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h1 className="text-lg font-semibold mb-3">Contributors</h1>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {contributors.map(c => (
            <li key={String(c.id)} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <img src={c.avatar_url ?? `https://i.pravatar.cc/80?u=${c.login}`} alt={c.login} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium">{c.login}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


