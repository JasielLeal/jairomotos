import { formatDate } from "@/lib/format";
import type { getUsers } from "@/app/dashboard/(pages)/usuarios/lib/get-users";

const ROLE_LABEL: Record<string, string> = { ADMIN: "Administrador", EMPLOYEE: "Funcionário" };

export function TeamList({ users }: { users: Awaited<ReturnType<typeof getUsers>> }) {
  return (
    <ul className="flex flex-col gap-1">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm"
        >
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{ROLE_LABEL[user.role]}</p>
            <p>desde {formatDate(user.createdAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
