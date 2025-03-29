export function renderLogin(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-2xl mb-4">התחברות</h1>
      <input id="username" placeholder="שם משתמש" class="mb-2 p-2 rounded bg-gray-800 border border-gray-600" />
      <input id="password" type="password" placeholder="סיסמה" class="mb-4 p-2 rounded bg-gray-800 border border-gray-600" />
      <button onclick="login()" class="bg-blue-600 px-4 py-2 rounded">התחבר</button>
    </div>
  `;
  window.login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('https://zehjecgkpjnmnbfqlkba.supabase.co/rest/v1/users?select=*', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGplY2drcGpubW5iZnFsa2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTA0NzAsImV4cCI6MjA1ODgyNjQ3MH0.uWSy84K8j4UMxsjDnx0ZReAymxfOb96fzINH_P3LnSo',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaGplY2drcGpubW5iZnFsa2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTA0NzAsImV4cCI6MjA1ODgyNjQ3MH0.uWSy84K8j4UMxsjDnx0ZReAymxfOb96fzINH_P3LnSo'
      }
    });
    const users = await res.json();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.role === 'admin') {
        window.location.hash = '#/admin';
      } else {
        window.location.hash = '#/team/' + user.role;
      }
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  };
}
