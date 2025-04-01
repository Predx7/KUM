// pages/adminTabs/ManualEntryTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { CheckCircle2 } from "lucide-react";

export default function ManualEntryTab() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("name");
    setTeams(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !date || !team) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return;

    const { error: insertError } = await supabase.from("receipts").insert([
      { name, amount: amountNum, date, team },
    ]);

    if (!insertError) {
      await supabase.rpc("increment_team_spent", { team_name: team, value: amountNum });
      setMessage("✔ קבלה נוספה בהצלחה!");
      setName("");
      setAmount("");
      setDate("");
      setTeam("");
      setTimeout(() => setMessage(""), 2500);
    } else {
      setMessage("שגיאה בהוספה");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl space-y-6">
      {message && (
        <div className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl text-sm shadow">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          placeholder="שם המזמין"
          className="bg-gray-700 text-white rounded-xl p-3 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="סכום"
          className="bg-gray-700 text-white rounded-xl p-3 text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className="bg-gray-700 text-white rounded-xl p-3 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="bg-gray-700 text-white rounded-xl p-3 text-sm"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="">בחר צוות</option>
          {teams.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 px-4 text-sm"
        >
          הוסף קבלה
        </button>
      </form>
    </div>
  );
}