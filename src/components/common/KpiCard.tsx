export default function KpiCard({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const content = (
    <div className="card card-3d p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl">
        {content}
      </a>
    );
  }
  return content;
}


