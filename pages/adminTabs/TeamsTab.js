// pages/adminTabs/TeamsTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { Plus, Minus, Check, Trash } from "lucide-react";

export default function TeamsTab() {
  const [teams, setTeams] = useState([]);
  const [newNames, setNewNames] = useState({});
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const fetchTeams = async () => {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*, name_to_team: name_to_team(*)");
    if (!teamsData) return;
    const mappedTeams = teamsData.map((team) => ({
      ...team,
      members: team.name_to_team?.map((n) => n.person_name) || [],
    }));
    setTeams(mappedTeams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddName = async (teamId) => {
    const name = newNames[teamId];
    if (!name) return;
    await supabase.from("name_to_team").insert([{ team_id: teamId, person_name: name }]);
    setNewNames({ ...newNames, [teamId]: "" });
    fetchTeams();
  };

  const handleRemoveName = async (teamId, name) => {
    const { data: matches } = await supabase
      .from("name_to_team")
      .select("id")
      .eq("team_id", teamId)
      .eq("person_name", name)
      .limit(1);

    if (matches && matches.length > 0) {
      await supabase.from("name_to_team").delete().eq("id", matches[0].id);
      fetchTeams();
    }
  };

  const handleAddTeam = async () => {
    if (!newTeamName) return;

    const { data, error } = await supabase
      .from("teams")
      .insert([{ name: newTeamName, monthly_budget: 0, spent: 0 }])
      .select();

    if (!error && data && data.length > 0) {
      const team = data[0];
      await supabase.from("users").insert([{ username: newTeamName, password: "1234", role: "team" }]);
      setShowAddTeam(false);
      setNewTeamName("");
      fetchTeams();
    } else {
      alert("שגיאה בהוספת צוות");
      console.log(error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const confirm = window.confirm("אתה בטוח שברצונך למחוק את הצוות?");
    if (!confirm) return;
    await supabase.from("name_to_team").delete().match({ team_id: teamId });
    await supabase.from("teams").delete().match({ id: teamId });
    fetchTeams();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl">
      {teams.map((team) => (
        <div key={team.id} className="rounded-2xl bg-gray-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">{team.name}</h2>
            <button onClick={() => handleDeleteTeam(team.id)} className="text-red-400 hover:text-red-600">
              <Trash size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="הוסף שם"
              className="flex-1 px-3 py-2 rounded-xl bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newNames[team.id] || ""}
              onChange={(e) => setNewNames({ ...newNames, [team.id]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAddName(team.id)}
            />
            <button
              onClick={() => handleAddName(team.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl text-sm"
            >
              הוסף
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {team.members.map((name, idx) => (
              <div key={idx} className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs">
                {name}
                <button onClick={() => handleRemoveName(team.id, name)}>
                  <Minus size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        className="rounded-2xl bg-gray-800 p-4 min-h-[100px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition border border-dashed border-gray-600"
        onClick={() => setShowAddTeam(true)}
      >
        <Plus className="text-white mb-1" size={24} />
        <span className="text-white text-sm">הוסף צוות</span>
      </div>

      {showAddTeam && (
        <div className="w-full flex flex-col items-center mt-4 col-span-full">
          <input
            type="text"
            placeholder="שם צוות חדש"
            className="p-3 rounded-xl bg-gray-700 text-white w-64 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm"
            onClick={handleAddTeam}
          >
            שמור
          </button>
        </div>
      )}
    </div>
  );
}
