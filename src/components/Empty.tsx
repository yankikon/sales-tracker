export function Empty({ title = "Nothing here yet", note }: { title?: string; note?: string }) {
  return (
    <div className="text-center py-10">
      <p className="font-medium opacity-80">{title}</p>
      {note && <p className="text-xs opacity-60 mt-1">{note}</p>}
    </div>
  );
}
