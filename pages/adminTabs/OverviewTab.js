// pages/adminTabs/OverviewTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function OverviewTab() {
  const [teams, setTeams] = useState([]);
  const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0 });

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    const { data } = await supabase.from("teams").select("name, monthly_budget, spent");
    if (!data) return;

    const totalBudget = data.reduce((sum, team) => sum + (team.monthly_budget || 0), 0);
    const totalSpent = data.reduce((sum, team) => sum + (team.spent || 0), 0);

    setTeams(data);
    setSummary({ totalBudget, totalSpent });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-white text-xl font-semibold">📊 מבט-על תקציבי</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="bg-gray-800 text-white rounded-xl p-4 shadow flex flex-col gap-1">
            <h3 className="text-lg font-bold">{team.name}</h3>
            <p className="text-sm">התחלה: ₪ {team.monthly_budget || 0}</p>
            <p className="text-sm">הוצאה: ₪ {team.spent || 0}</p>
            <p className="text-sm font-semibold">נותר: ₪ {(team.monthly_budget || 0) - (team.spent || 0)}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 text-white rounded-xl p-4 shadow text-center">
        <h3 className="text-lg font-semibold mb-2">💰 סיכום כללי</h3>
        <p className="text-sm">סה"כ תקציב: ₪ {summary.totalBudget}</p>
        <p className="text-sm">סה"כ הוצאות: ₪ {summary.totalSpent}</p>
        <p className="text-sm font-bold">סה"כ נותר: ₪ {summary.totalBudget - summary.totalSpent}</p>
      </div>
    </div>
  );
}
