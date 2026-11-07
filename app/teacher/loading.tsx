export default function TeacherLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-72 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
