// team.js – גרסה סופית

import { supabase } from '../supabaseClient.js';
import { getUser, logout } from '../auth.js';

export async function renderTeam(container) {
  const user = getUser();
  if (!user || user.role !== 'team') {
    container.innerHTML = '<p>אין לך גישה לעמוד זה</p>';
    return;
  }

  const { data: teams } = await supabase.from('teams').select();
  const team = teams.find(t => t.name.includes(user.username));
  if (!team) {
    container.innerHTML = '<p>לא נמצא צוות עבור המשתמש שלך</p>';
    return;
  }

  const { data: names } = await supabase
    .from('name_to_team')
    .select()
    .eq('team_id', team.id);

  const { data: receipts } = await supabase
    .from('receipts')
    .select()
    .eq('team_id', team.id);

  const totalSpent = receipts.reduce((sum, r) => sum + r.amount, 0);
  const remaining = (team.monthly_budget || 0) - totalSpent;

  container.innerHTML = `
    <div class="p-4 text-white">
      <h1 class="text-2xl mb-4">${team.name}</h1>
      <div class="mb-4">
        <p>תקציב חודשי: <strong>${team.monthly_budget || 0} ₪</strong></p>
        <p>סכום שהוצא: <strong>${totalSpent.toFixed(2)} ₪</strong></p>
        <p>נותר: <strong>${remaining.toFixed(2)} ₪</strong></p>
      </div>
      <div>
        <h2 class="text-xl font-bold mb-2">חברי צוות:</h2>
        <ul class="list-disc pr-4">
          ${names.map(n => `<li>${n.person_name}</li>`).join('')}
        </ul>
      </div>
      <button onclick="logout()" class="mt-6 text-sm text-red-400">התנתק</button>
    </div>
  `;
}
