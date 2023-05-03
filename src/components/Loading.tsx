import { Loader2 } from "lucide-react";
import { Skeleton } from "~/ui/skeleton";

export function LoadingSpinner(props: { size?: number }) {
  const { size } = props;
  return (
    <>
      <Loader2 className={`mr-2 h-${size ?? 4} w-${size ?? 4} animate-spin`} />
    </>
  );
}
function CardSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-row gap-4 rounded-md bg-white/10 p-4 shadow-md lg:w-1/3">
      <Skeleton className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
      <div className="flex">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[150] bg-slate-300 dark:bg-slate-700" />
          <Skeleton className="h-4 w-[300px] bg-slate-300 dark:bg-slate-700" />
          <Skeleton className="h-10 w-full bg-slate-300 dark:bg-slate-700" />
          <Skeleton className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
export function FAQSkeleton(props: { count?: number }) {
  let count = 3;
  if(props.count) count = props.count;
  const skeletons = Array.from({ length: count }, (_, index) => (
    <CardSkeleton key={index} />
  ));
  return <>{skeletons}</>;
}
