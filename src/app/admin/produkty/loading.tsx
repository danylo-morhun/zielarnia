import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2 p-6">
      {["a","b","c","d","e","f","g","h","i","j"].map((id) => (
        <Skeleton key={id} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );
}
