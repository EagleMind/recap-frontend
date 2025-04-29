import { useParams } from "react-router-dom";
import { useMemberName } from "@/hooks/useMemberName";

export function MemberBreadcrumb() {
  const { memberId } = useParams();
  const name = useMemberName(memberId);
  return <>{name ? `Edit ${name}` : "Edit Member"}</>;
}
