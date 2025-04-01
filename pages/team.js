// pages/team.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../utils/supabase";

export default function Team() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("user"));

    // אם אין התחברות או שזה לא צוות – נשלח חזרה לעמוד הראשי
    if (!session || session.role !== "team") {
      router.push("/");
      return;
    }

    fetchTeam("צוות " + session.username);
  }, []);

  const fetchTeam = async (teamName) => {
    const { data: teams } = await supabase
      .from("teams")
      .select("id, name, monthly_budget, spent")
      .eq("name", teamName)
      .single();

    if (teams) {
      setTeam(teams);
      const { data: nameList } = await supabase
        .from("name_to_team")
        .select("person_name")
        .eq("team_id", teams.id);
      setMembers(nameList?.map((n) => n.person_name) || []);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  if (loading) return <p className="text-white p-4">טוען...</p>;
  if (!team) return <p className="text-red-500 p-4">לא נמצא צוות</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6 border border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">צוות {team.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
          >
            התנתק
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 shadow-inner">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">חברי הצוות</h2>
          <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
            {members.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 shadow-inner text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">תקציב חודשי:</span>
            <span className="text-white font-medium">₪ {team.monthly_budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">הוצאות החודש:</span>
            <span className="text-white font-medium">₪ {team.spent}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span className="text-blue-400 font-semibold">נותר:</span>
            <span className="text-blue-400 font-semibold">₪ {team.monthly_budget - team.spent}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
