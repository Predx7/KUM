// pages/adminTabs/BudgetTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { Check, RotateCcw } from "lucide-react";

export default function BudgetTab() {
  const [teams, setTeams] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("id, name, monthly_budget").order("id");
    setTeams(data || []);
    const initial = {};
    data?.forEach((t) => (initial[t.id] = t.monthly_budget || 0));
    setBudgets(initial);
  };

  const handleSave = async (id) => {
    const newBudget = parseFloat(budgets[id]) || 0;
    await supabase.from("teams").update({ monthly_budget: newBudget }).eq("id", id);
    setMessage("✔ נשמר בהצלחה");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleReset = (id) => {
    setBudgets((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    await Promise.all(
      teams.map((t) => {
        const newBudget = parseFloat(budgets[t.id]) || 0;
        return supabase.from("teams").update({ monthly_budget: newBudget }).eq("id", t.id);
      })
    );
    setMessage("✔ נשמרו כל התקציבים");
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleResetAll = () => {
    const reset = {};
    teams.forEach((t) => (reset[t.id] = 0));
    setBudgets(reset);
  };

  const handleResetMonth = async () => {
    const confirm = window.confirm("האם אתה בטוח שברצונך לאפס את התקציב וההוצאות של כל הצוותים?");
    if (!confirm) return;
    await supabase.from("teams").update({ monthly_budget: 0, spent: 0 }).not("id", "is", null);
    setBudgets({});
    setMessage("✔ החודש אופס בהצלחה");
    fetchTeams();
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl space-y-6">
      {message && (
        <div className="text-center bg-blue-700 text-white py-2 px-4 rounded-xl shadow-sm text-sm">
          {message}
        </div>
      )}

      <div className="flex justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-xl shadow"
          >
            שמור הכל
          </button>
          <button
            onClick={handleResetAll}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-xl shadow"
          >
            אפס הכל
          </button>
        </div>
        <button
          onClick={handleResetMonth}
          className="bg-red-700 hover:bg-red-800 text-white text-sm px-6 py-2 rounded-xl shadow"
        >
          🗓️ איפוס חודש כולל
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-gray-800 rounded-xl p-4 flex flex-col gap-3 shadow-md">
            <h2 className="text-white text-base font-semibold">{team.name}</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="bg-gray-700 text-white rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={budgets[team.id] || ""}
                onChange={(e) => setBudgets({ ...budgets, [team.id]: e.target.value })}
              />
              <button
                onClick={() => handleSave(team.id)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => handleReset(team.id)}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
