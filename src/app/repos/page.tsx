import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";

export default async function ReposPage() {
  const repos = await fakeCisoInsightApi.fetchRepositories();
  return (
    <main className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h1 className="text-lg font-semibold mb-3">Repositories</h1>
        <div className="grid sm:grid-cols-2 gap-3">
          {repos.map(r => (
            <a key={String(r.id)} href={r.html_url} target="_blank" rel="noreferrer" className="block rounded-lg border border-gray-200 p-3 hover:shadow">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.name}</div>
                {r.language ? <span className="text-xs text-gray-500">{r.language}</span> : null}
              </div>
              {r.description ? <div className="text-sm text-gray-600 mt-1">{r.description}</div> : null}
              <div className="mt-2 text-xs text-gray-500">
                ⭐ {r.stargazersCount ?? 0} · 🍴 {r.forksCount ?? 0} · Issues {r.openIssuesCount ?? 0}
              </div>
              {r.topics && r.topics.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.topics.map(t => (
                    <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{t}</span>
                  ))}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}


