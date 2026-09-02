import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateUserForm from "./create-user-form";

const ROLE_LABEL: Record<string, string> = { ADMIN: "Administrador", EMPLOYEE: "Funcionário" };

export default async function UsersPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Usuários" description="Gerencie quem tem acesso ao painel." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Equipe</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
