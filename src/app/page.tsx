import { redirect } from "next/navigation";

export default function RootPage() {
  // WP-F05 will replace this temporary authenticated-fixture redirect with the real session gate.
  redirect("/dashboard");
}
