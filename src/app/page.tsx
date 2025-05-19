import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the new dashboard
  redirect("/new-dashboard");
}
