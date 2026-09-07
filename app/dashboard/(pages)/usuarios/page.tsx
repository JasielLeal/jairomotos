import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getUsers } from "@/app/dashboard/(pages)/usuarios/lib/get-users";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamList } from "@/app/dashboard/(pages)/usuarios/components/team-list";
import CreateUserForm from "./components/create-user-form";

export default async function UsersPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Usuários" description="Gerencie quem tem acesso ao painel." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamList users={users} />
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
