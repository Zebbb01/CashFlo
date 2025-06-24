export function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
