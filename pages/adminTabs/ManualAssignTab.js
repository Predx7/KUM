// pages/adminTabs/ManualAssignTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { CheckCircle2 } from "lucide-react";

export default function ManualAssignTab() {
  const [pendingReceipts, setPendingReceipts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReceipts();
    fetchTeams();
  }, []);

  const fetchReceipts = async () => {
    const { data } = await supabase.from("receipts_pending").select();
    setPendingReceipts(data || []);
  };

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("id, name");
    setTeams(data || []);
  };

  const handleAssign = async (receipt, teamId) => {
    const teamName = teams.find((t) => t.id === teamId)?.name || "";
    const { error: insertError } = await supabase.from("receipts").insert([
      {
        name: receipt.name,
        date: receipt.date,
        amount: receipt.amount,
        team: teamName
      }
    ]);

    if (!insertError) {
      await supabase.from("receipts_pending").delete().eq("id", receipt.id);
      await supabase.rpc("increment_team_spent", { team_name: teamName, value: receipt.amount });
      setMessage("✔ קבלה שויכה בהצלחה");
      fetchReceipts();
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl space-y-6">
      {message && (
        <div className="text-center bg-blue-700 text-white py-2 px-4 rounded-xl shadow text-sm flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      <h2 className="text-white text-xl font-semibold">🛠 שיוך קבלות ידני</h2>

      {pendingReceipts.length === 0 ? (
        <p className="text-gray-400 text-sm">אין קבלות שממתינות לשיוך</p>
      ) : (
        <div className="space-y-4">
          {pendingReceipts.map((receipt) => (
            <div key={receipt.id} className="bg-gray-800 rounded-xl p-4 text-white shadow flex flex-col gap-2">
              <div>
                <p className="font-bold">{receipt.name}</p>
                <p className="text-sm text-gray-400">₪ {receipt.amount} | {new Date(receipt.date).toLocaleDateString("he-IL")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleAssign(receipt, team.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl text-sm"
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
