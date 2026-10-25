import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        className={cn(
          "h-10 w-full justify-start gap-3 rounded-xl px-3.5 text-sm font-medium text-muted-foreground hover:bg-cream hover:text-ink",
          className,
        )}
      >
        <LogOut className="size-4" />
        Log out
      </Button>
    </form>
  );
}
