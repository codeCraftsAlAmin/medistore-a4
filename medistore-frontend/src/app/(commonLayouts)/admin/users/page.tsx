import { userService } from "@/app/service/user.service";
import { User, Mail, Shield, UserCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatusToggle } from "@/components/admin/UserStatusToggle";

export default async function AdminUsersPage() {
  const { data: usersResponse } = await userService.getAllUsers();
  const users = usersResponse?.data || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl text-slate-200">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all platform users, their roles, and access status.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-fit py-1 px-4 border-primary/30 text-primary"
        >
          Total Users: {users.length}
        </Badge>
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-primary border border-white/5">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield
                          className={`h-4 w-4 ${
                            user.role === "admin"
                              ? "text-rose-500"
                              : user.role === "seller"
                                ? "text-amber-500"
                                : "text-blue-500"
                          }`}
                        />
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.status === "BAN" ? (
                        <Badge
                          variant="destructive"
                          className="bg-rose-500/10 text-rose-500 border-rose-500/20"
                        >
                          Banned
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        >
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== "admin" && (
                        <UserStatusToggle
                          userId={user.id}
                          initialStatus={user.status}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-sans">
                No users found in the system.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
