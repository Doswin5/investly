export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
      {message}
    </div>
  );
}