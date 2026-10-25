import { redirect } from "next/navigation";
import { roleHome } from "@/lib/navigation";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  redirect(roleHome(session.role));
}
