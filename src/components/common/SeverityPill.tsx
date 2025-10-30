const SEV_CLASSES: Record<string, string> = {
  CRITICAL: "bg-purple-600 text-white",
  HIGH: "bg-purple-300 text-purple-900",
  MEDIUM: "bg-blue-500 text-white",
  LOW: "bg-green-400 text-white",
  INFO: "bg-blue-200 text-blue-900",
};

export default function SeverityPill({ value }: { value?: string }) {
  const sev = (value ?? "INFO").toUpperCase();
  const cls = SEV_CLASSES[sev] ?? "bg-gray-200 text-gray-800";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {sev}
    </span>
  );
}


