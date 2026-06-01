export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
      {message}
    </div>
  );
}