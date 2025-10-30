import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";
import PRDetails from "@/components/prs/PRDetails";

export default async function PRDetailsPage({ params }: { params: { id: string } }) {
  const pr = await fakeCisoInsightApi.fetchPullRequestById(params.id);
  if (!pr) {
    return (
      <main className="space-y-6">
        <div className="bg-white rounded-xl shadow p-4">PR not found.</div>
      </main>
    );
  }
  return (
    <main className="space-y-6">
      <PRDetails pr={pr} />
    </main>
  );
}


