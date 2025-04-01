// pages/adminTabs/OverviewTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function OverviewTab() {
  const [teams, setTeams] = useState([]);
  const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    const { data } = await supabase.from("teams").select("name, monthly_budget, spent");
    if (!data) return;

    const totalBudget = data.reduce((sum, team) => sum + (team.monthly_budget || 0), 0);
    const totalSpent = data.reduce((sum, team) => sum + (team.spent || 0), 0);

    setTeams(data);
    setSummary({ totalBudget, totalSpent });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center text-white p-10 animate-pulse">
        טוען נתונים...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-white text-2xl font-bold text-center">📊 מבט-על תקציבי</h2>

      {/* סיכום כללי – עכשיו ראשון */}
      <div className="bg-gray-700 text-white rounded-xl p-6 shadow text-center space-y-1">
        <h3 className="text-xl font-semibold">💰 סיכום כללי</h3>
        <p>סה"כ תקציב: ₪ {summary.totalBudget}</p>
        <p>סה"כ הוצאות: ₪ {summary.totalSpent}</p>
        <p className="font-bold">
          סה"כ נותר: ₪ {summary.totalBudget - summary.totalSpent}
        </p>
      </div>

      {/* כל צוות */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teams.map((team, index) => {
          const remaining = (team.monthly_budget || 0) - (team.spent || 0);
          const remainingColor = remaining < 0 ? "text-red-400" : "text-green-400";

          return (
            <div key={index} className="bg-gray-800 text-white rounded-xl p-4 shadow text-center space-y-1">
              <h3 className="text-lg font-bold">{team.name}</h3>
              <p className="text-sm">💼 התחלה: ₪ {team.monthly_budget || 0}</p>
              <p className="text-sm">💸 הוצאה: ₪ {team.spent || 0}</p>
              <p className={`text-sm font-semibold ${remainingColor}`}>💡 נותר: ₪ {remaining}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
