import {
  Briefcase,
  CalendarCheck,
  Compass,
  Handshake,
  LifeBuoy,
  Presentation,
  RotateCcw,
  Stethoscope,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export const courseIcons: Record<string, LucideIcon> = {
  restaurant: UtensilsCrossed,
  directions: Compass,
  doctor: Stethoscope,
  interview: Briefcase,
  friends: Users,
  refund: RotateCcw,
  meeting: Presentation,
  help: LifeBuoy,
  appointment: CalendarCheck,
  neighbor: Handshake,
};
