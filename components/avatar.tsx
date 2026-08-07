import { MessageCircleHeart } from "lucide-react";
import type { AvatarId } from "@/lib/profile";

/** Placeholder avatar maskot (sampai aset maskot 3D jadi). */
const AVATAR_STYLES: Record<AvatarId, string> = {
  sage: "bg-sage-100 text-leaf-600",
  mist: "bg-mist-100 text-mist-600",
  teal: "bg-teal-200 text-teal-600",
  sun: "bg-sun-100 text-forest-700",
  forest: "bg-forest-700 text-white",
};

export default function Avatar({
  id = "sage",
  className = "h-10 w-10",
}: {
  id?: AvatarId | string;
  className?: string;
}) {
  const style = AVATAR_STYLES[(id as AvatarId) ?? "sage"] ?? AVATAR_STYLES.sage;
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full ${style} ${className}`}
    >
      <MessageCircleHeart className="h-1/2 w-1/2" />
    </span>
  );
}
