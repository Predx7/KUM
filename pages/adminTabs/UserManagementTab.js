// pages/adminTabs/UserManagementTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { CheckCircle2, Trash2, Pencil, Eye } from "lucide-react";

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("team");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("id, username, role, password").order("username");
    setUsers(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) return;
    const { error } = await supabase.from("users").insert([{ username, password, role }]);
    if (error) return setMessage("שגיאה בהוספה");
    setUsername("");
    setPassword("");
    setRole("team");
    setMessage("✔ משתמש נוסף בהצלחה!");
    fetchUsers();
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    await supabase.from("users").delete().eq("id", id);
    fetchUsers();
  };

  const handlePasswordUpdate = async (id) => {
    if (!newPassword) return;
    await supabase.from("users").update({ password: newPassword }).eq("id", id);
    setMessage("✔ סיסמה עודכנה בהצלחה!");
    setEditingId(null);
    setNewPassword("");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleEditing = (id) => {
    setEditingId((prev) => (prev === id ? null : id));
  };

  const togglePasswordView = (id) => {
    setVisiblePasswordId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-gradient-to-tr from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      {message && (
        <div className="flex items-center justify-center gap-2 mb-4 bg-blue-700 text-white px-4 py-2 rounded-xl text-sm shadow-inner">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      <form onSubmit={handleAdd} className="grid gap-4 mb-6">
        <input
          type="text"
          placeholder="שם משתמש"
          className="bg-gray-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="סיסמה"
          className="bg-gray-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="bg-gray-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="team">צוות</option>
          <option value="admin">אדמין</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm shadow-lg"
        >
          הוסף משתמש
        </button>
      </form>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>{user.username} ({user.role})</div>
              <div className="flex gap-2">
                <button onClick={() => togglePasswordView(user.id)} className="text-blue-400 hover:text-blue-500">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => toggleEditing(user.id)} className="text-yellow-400 hover:text-yellow-500">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {visiblePasswordId === user.id && (
              <div className="bg-gray-700 rounded-lg px-3 py-1 text-xs text-white w-fit">סיסמה: {user.password}</div>
            )}

            {editingId === user.id && (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="סיסמה חדשה"
                  className="bg-gray-700 text-white rounded-xl p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={() => handlePasswordUpdate(user.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl text-xs"
                >
                  שמור
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}