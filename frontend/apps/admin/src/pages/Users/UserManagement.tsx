import { useEffect, useState } from "react";
import {
  Search,
  Shield,
  User,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../lib/api";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  balance?: number;
  createdAt: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Hits your backend: router.get("/", authMiddlware(["admin"]), getAllusers)
      const res = await apiClient.get("/user"); // Assuming base URL is already configured to /api/users or /api/user
      const data = res.data?.users || res.data?.data || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
  console.error("Failed to load users:", err);
  const errorMsg = (err as any)?.response?.data?.message || "Failed to fetch user directory.";
  toast.error(errorMsg);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to terminate this user account?")
    )
      return;

    try {
      // Hits your backend delete route
      await apiClient.delete(`/user/${id}`);
      toast.success("User account deleted successfully.");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            User Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Monitor platform players, accounts, and security roles
          </p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-zinc-800 text-sm text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="bg-[#111] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
            <p className="text-xs font-mono uppercase tracking-widest">
              Decrypting user database...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#161616] text-zinc-400 text-xs uppercase font-bold tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Account Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role Clearance</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "admin";
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-zinc-900/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                        {user._id ? user._id.slice(-6).toUpperCase() : "N/A"}
                      </td>
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-xs">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs font-mono">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-zinc-500 font-mono text-sm"
                    >
                      No user accounts found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
