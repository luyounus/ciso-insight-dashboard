import SeverityPill from "@/components/common/SeverityPill";
import type { PullRequest } from "@/types/github";

export default function PRDetails({ pr }: { pr: PullRequest }) {
  const overall = pr.riskSummary?.overallSeverity ?? pr.severity ?? "INFO";
  const comments = pr.comments ?? [];

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-xl shadow p-4">
        <h1 className="text-xl font-semibold mb-1">
          {pr.title}
          {pr.htmlUrl ? (
            <a href={pr.htmlUrl} target="_blank" rel="noreferrer" className="ml-2 text-sm text-blue-600 hover:underline">
              View on GitHub ↗
            </a>
          ) : null}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <SeverityPill value={overall} />
          <span>State: {pr.state}</span>
          <span>Repo: {String(pr.repoId)}</span>
          <span>Author: {pr.author}</span>
          <span>Created: {new Date(pr.createdAt).toLocaleString()}</span>
          {pr.updatedAt ? <span>Updated: {new Date(pr.updatedAt).toLocaleString()}</span> : null}
          {pr.mergedAt ? <span>Merged: {new Date(pr.mergedAt).toLocaleString()}</span> : null}
        </div>
      </header>

      {pr.riskSummary ? (
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-medium mb-2">Risk summary</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>Score: {pr.riskSummary.score}</div>
            {pr.riskSummary.countsBySeverity ? (
              <div>
                Counts: {Object.entries(pr.riskSummary.countsBySeverity).map(([k,v]) => `${k}:${v}`).join(" · ")}
              </div>
            ) : null}
            {pr.riskSummary.mttr_days !== undefined ? <div>MTTR: {pr.riskSummary.mttr_days} days</div> : null}
          </div>
        </section>
      ) : null}

      {pr.findings && pr.findings.length ? (
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-medium mb-2">Findings</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {pr.findings.map((f) => (
              <li key={f.id}>
                <span className="font-medium">[{f.severity}] {f.type}</span>: {f.message} — {f.file_path}:{f.line}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-medium mb-2">Comments</h2>
        {comments.length === 0 ? (
          <div className="text-sm text-gray-500">No comments</div>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => {
              const userAny = c.user as any;
              const isBot = typeof userAny === "object" ? userAny?.type === "Bot" : false;
              const username = typeof userAny === "object" ? userAny?.login ?? "bot" : String(userAny ?? "user");
              return (
                <li key={String(c.id)} className={`rounded-md border p-3 ${isBot ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">{username}</span> · {new Date(c.createdAt).toLocaleString()}
                    {isBot ? <span className="ml-2 text-purple-700">(bot)</span> : null}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{c.body}</div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}


