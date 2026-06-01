export default function EmptyState({ title, message }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-slate-400 mt-2">{message}</p>
    </div>
  );
}