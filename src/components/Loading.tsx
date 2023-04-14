import { Loader2 } from "lucide-react";

export function LoadingSpinner(props: { size?: number }) {
  const { size } = props;
  return (
    <>
      <Loader2 className={`mr-2 h-${size ?? 4} w-${size ?? 4} animate-spin`} />
    </>
  );
}
