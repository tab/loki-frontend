import { redirect } from "next/navigation"

export default function PermissionDetailsRedirect() {
  return redirect("/backoffice/users")
}
