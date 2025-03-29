// admin.js - גרסה סופית

import { supabase } from '../supabaseClient.js';
import { getUser, logout } from '../auth.js';

export async function renderAdmin(container) {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    container.innerHTML = '<p>אין לך גישה לעמוד זה</p>';
    return;
  }

  container.innerHTML = `
    <div class="p-4 text-white">
      <h1 class="text-2xl mb-4">ניהול אדמין</h1>
      <div class="flex gap-2 mb-4">
        <button id="tab-receipts" class="bg-gray-700 px-4 py-2 rounded">קבלות</button>
        <button id="tab-names" class="bg-gray-700 px-4 py-2 rounded">שיוך שמות</button>
        <button id="tab-budget" class="bg-gray-700 px-4 py-2 rounded">תחילת חודש</button>
        <button onclick="logout()" class="ml-auto text-sm text-red-400">התנתק</button>
      </div>
      <div id="admin-content"></div>
    </div>
  `;

  document.getElementById('tab-receipts').onclick = () => {
    document.getElementById('admin-content').innerHTML = '<p>לשונית הקבלות הרגילה תישאר כאן (בהמשך נעדכן אותה מחדש)</p>';
  };

  document.getElementById('tab-names').onclick = async () => {
    const { data: teams } = await supabase.from('teams').select();
    const { data: names } = await supabase.from('name_to_team').select();
    const content = document.getElementById('admin-content');
    content.innerHTML = '<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">' +
      teams.map(team => `
        <div class="bg-gray-800 rounded p-4 w-full sm:w-72 shadow">
          <h2 class="text-xl font-bold mb-2">${team.name}</h2>
          <div class="space-y-2" id="names-${team.id}">
            ${names.filter(n => n.team_id === team.id).map(n => `
              <div class="flex justify-between bg-gray-700 p-2 rounded">
                <span>${n.person_name}</span>
                <button onclick="removeName('${n.id}', '${team.id}')">➖</button>
              </div>
            `).join('')}
          </div>
          <div class="flex mt-2">
            <input id="input-${team.id}" placeholder="הוסף שם" class="flex-1 p-1 rounded bg-gray-700 text-white" />
            <button onclick="addName('${team.id}')" class="ml-2">✔️</button>
          </div>
        </div>
      `).join('') +
      '</div>';
  };

  document.getElementById('tab-budget').onclick = async () => {
    const { data: teams } = await supabase.from('teams').select();
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <table class="w-full text-right">
        <thead>
          <tr><th>צוות</th><th>תקציב חודשי</th></tr>
        </thead>
        <tbody>
          ${teams.map(t => `
            <tr>
              <td>${t.name}</td>
              <td><input id="budget-${t.id}" value="${t.monthly_budget || 0}" class="bg-gray-800 text-white p-1 rounded" /></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button id="save-budgets" class="mt-4 bg-blue-600 px-4 py-2 rounded">שמור</button>
    `;
    document.getElementById('save-budgets').onclick = async () => {
      for (const t of teams) {
        const value = document.getElementById(`budget-${t.id}`).value;
        await supabase.from('teams').update({ monthly_budget: parseFloat(value) || 0 }).eq('id', t.id);
      }
      alert('עודכן!');
    };
  };
}

window.addName = async (teamId) => {
  const input = document.getElementById(`input-${teamId}`);
  const name = input.value.trim();
  if (!name) return;
  await supabase.from('name_to_team').insert({ person_name: name, team_id: teamId });
  input.value = '';
  document.getElementById('tab-names').click();
};

window.removeName = async (nameId, teamId) => {
  await supabase.from('name_to_team').delete().eq('id', nameId);
  document.getElementById('tab-names').click();
};
