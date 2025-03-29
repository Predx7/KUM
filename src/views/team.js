
const SUPABASE_URL = "https://zehjecgkpjnmnbfqlkba.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGplY2drcGpubW5iZnFsa2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTA0NzAsImV4cCI6MjA1ODgyNjQ3MH0.uWSy84K8j4UMxsjDnx0ZReAymxfOb96fzINH_P3LnSo";

export async function renderTeam(container, teamName) {
  container.innerHTML = "<h1 class='text-white text-xl mb-4'>טוען...</h1>";

  if (!teamName || teamName === "team") {
    container.innerHTML = "<p class='text-red-500'>שגיאה: יש לגשת לעמוד עם שם צוות. לדוגמה: /#/team/hulda</p>";
    return;
  }

  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    };

    const teamRes = await fetch(`${SUPABASE_URL}/rest/v1/teams?name=eq.${teamName}`, { headers });
    const teamData = await teamRes.json();
    const team = teamData[0];

    const namesRes = await fetch(`${SUPABASE_URL}/rest/v1/name_to_team?team=eq.${teamName}`, { headers });
    const names = await namesRes.json();

    if (!team) {
      container.innerHTML = "<p class='text-white'>הצוות לא נמצא.</p>";
      return;
    }

    const spent = team.spent || 0;
    const budget = team.budget || 0;
    const remaining = budget - spent;

    container.innerHTML = `
      <div class="text-white p-6 space-y-4">
        <h1 class="text-2xl font-bold">צוות ${teamName}</h1>
        <p>💸 תקציב: ${budget} ש״ח</p>
        <p>🚕 הוצאות: ${spent} ש״ח</p>
        <p>💰 נשאר: ${remaining} ש״ח</p>
        <div>
          <h2 class="text-lg mt-4 mb-2 underline">חברי צוות:</h2>
          <ul class="list-disc list-inside">
            ${names.map(n => `<li>${n.name}</li>`).join("") || "<li>אין שמות משויכים</li>"}
          </ul>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = "<p class='text-red-500'>שגיאה בטעינת המידע.</p>";
  }
}
