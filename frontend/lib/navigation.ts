import { LayoutDashboard, Send, type LucideIcon } from "lucide-react";
import type { Role } from "@/lib/types";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SUBMIT: "/submit",
  MENTOR_DASHBOARD: "/mentor/dashboard",
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [{ href: ROUTES.SUBMIT, label: "Submit project", icon: Send }],
  MENTOR: [
    { href: ROUTES.MENTOR_DASHBOARD, label: "Review dashboard", icon: LayoutDashboard },
  ],
};

export const roleHome = (role: Role): string => {
  return role === "MENTOR" ? ROUTES.MENTOR_DASHBOARD : ROUTES.SUBMIT;
};
