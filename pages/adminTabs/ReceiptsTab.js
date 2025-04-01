// pages/adminTabs/ReceiptsTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function ReceiptsTab() {
  const [receipts, setReceipts] = useState([]);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchReceipts();
  }, [sortBy]);

  const fetchReceipts = async () => {
    let query = supabase.from("receipts").select("id, name, date, amount, team");

    if (sortBy === "date") {
      query = query.order("date", { ascending: false });
    } else if (sortBy === "amount") {
      query = query.order("amount", { ascending: false });
    } else if (sortBy === "team") {
      query = query.order("team", { ascending: true });
    }

    const { data } = await query;
    setReceipts(data || []);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-white text-xl font-semibold">📋 רשימת קבלות</h1>
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">מיון לפי תאריך</option>
          <option value="amount">מיון לפי סכום</option>
          <option value="team">מיון לפי צוות</option>
        </select>
      </div>

      <div className="space-y-3">
        {receipts.map((r) => (
          <div key={r.id} className="bg-gray-800 rounded-xl px-4 py-3 text-white shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
            <div className="flex flex-col">
              <span className="font-semibold">🧾 {r.name}</span>
              <span className="text-gray-400 text-xs">📅 {new Date(r.date).toLocaleDateString("he-IL")}</span>
            </div>
            <div className="text-right sm:text-left">
              <p className="font-bold">₪ {r.amount}</p>
              <p className="text-gray-400">צוות: {r.team}</p>
            </div>
          </div>
        ))}

        {receipts.length === 0 && (
          <p className="text-center text-gray-400">לא נמצאו קבלות</p>
        )}
      </div>
    </div>
  );
}