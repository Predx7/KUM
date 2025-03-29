
const SUPABASE_URL = "https://zehjecgkpjnmnbfqlkba.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGplY2drcGpubW5iZnFsa2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTA0NzAsImV4cCI6MjA1ODgyNjQ3MH0.uWSy84K8j4UMxsjDnx0ZReAymxfOb96fzINH_P3LnSo";

export async function renderAdmin(container) {
  container.innerHTML = `
    <div class="p-6 text-white">
      <h1 class="text-2xl mb-4 font-bold">ניהול אדמין</h1>
      <div class="flex gap-4 mb-6">
        <button class="tab-btn bg-gray-700 px-4 py-2 rounded" data-tab="receipts">📄 קבלות</button>
        <button class="tab-btn bg-gray-700 px-4 py-2 rounded" data-tab="names">👥 שיוך שמות</button>
        <button class="tab-btn bg-gray-700 px-4 py-2 rounded" data-tab="month">📅 תחילת חודש</button>
      </div>
      <div id="tab-content" class="mt-6"></div>
    </div>
  `;

  document.querySelectorAll(".tab-btn").forEach(btn =>
    btn.addEventListener("click", () => showTab(btn.dataset.tab))
  );

  showTab("receipts");

  async function showTab(tab) {
    const tabDiv = document.getElementById("tab-content");
    if (tab === "names") {
      renderNamesTab(tabDiv);
    } else if (tab === "month") {
      tabDiv.innerHTML = '<p class="text-white">🔧 לשונית תחילת חודש תגיע בשלב הבא...</p>';
    } else {
      tabDiv.innerHTML = '<p class="text-white">📄 לשונית הקבלות הרגילה תישאר כאן (בהמשך נעדכן אותה מחדש).</p>';
    }
  }

  async function renderNamesTab(container) {
    const teams = ["חולדה", "מזכרת", "חבצלת", "אלמוג", "גבעה"];
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json"
    };

    const namesRes = await fetch(`${SUPABASE_URL}/rest/v1/name_to_team`, { headers });
    const names = await namesRes.json();

    const grouped = {};
    teams.forEach(t => grouped[t] = []);
    names.forEach(n => {
      if (!grouped[n.team]) grouped[n.team] = [];
      grouped[n.team].push(n.name);
    });

    let html = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4">';
    [...teams, "+"].forEach(team => {
      const isAddBox = team === "+";
      html += `
        <div class="bg-gray-800 rounded-lg p-4">
          <h2 class="text-xl font-bold mb-2">${isAddBox ? "➕ הוסף צוות" : team}</h2>
          ${isAddBox ? `
            <input id="new-team-name" class="w-full mb-2 p-2 bg-gray-700 rounded" placeholder="שם צוות">
            <button class="bg-green-600 px-3 py-1 rounded" onclick="addTeam()">צור צוות</button>
          ` : `
            <div class="flex gap-2 mb-2">
              <input id="input-${team}" class="flex-1 p-2 bg-gray-700 rounded" placeholder="הוסף שם">
              <button class="bg-green-500 px-3 py-1 rounded" onclick="addNameToTeam('${team}')">✔️</button>
            </div>
            <ul id="list-${team}" class="space-y-1">
              ${(grouped[team] || []).map(name => `
                <li class="flex justify-between items-center bg-gray-700 px-2 py-1 rounded">
                  ${name}
                  <button onclick="removeName('${name}')" class="text-red-400 hover:text-red-600">✖</button>
                </li>`).join("")}
            </ul>
          `}
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;

    teams.forEach(team => {
      const input = document.getElementById(`input-${team}`);
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const name = input.value.trim();
          if (!name) return;
          await fetch(`${SUPABASE_URL}/rest/v1/name_to_team`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name, team })
          });
          location.reload();
        }
      });
    });

    window.removeName = async (name) => {
      await fetch(`${SUPABASE_URL}/rest/v1/name_to_team?name=eq.${name}`, {
        method: "DELETE",
        headers
      });
      location.reload();
    };

    window.addNameToTeam = async (team) => {
      const input = document.getElementById("input-" + team);
      const name = input.value.trim();
      if (!name) return;
      await fetch(`${SUPABASE_URL}/rest/v1/name_to_team`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, team })
      });
      location.reload();
    };

    window.addTeam = () => {
      const name = document.getElementById("new-team-name").value.trim();
      if (!name) return alert("הכנס שם צוות");
      alert("הוספת צוותים חדשים תתממש בהמשך ✨");
    };
  }
}

