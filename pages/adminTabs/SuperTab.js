// pages/adminTabs/SuperTab.js
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function SuperTab() {
  const [superReceipts, setSuperReceipts] = useState([]);
  const [sortBy, setSortBy] = useState("inserted_at");

  useEffect(() => {
    fetchSuperReceipts();
  }, [sortBy]);

  const fetchSuperReceipts = async () => {
    let query = supabase.from("super_receipts").select();

    if (sortBy === "inserted_at") {
      query = query.order("inserted_at", { ascending: false });
    } else if (sortBy === "name") {
      query = query.order("name", { ascending: true });
    } else if (sortBy === "store") {
      query = query.order("store", { ascending: true });
    }

    const { data } = await query;
    setSuperReceipts(data || []);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-white text-xl font-semibold">📋 קבלות סופר</h1>
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="inserted_at">מיון לפי תאריך ושעה</option>
          <option value="name">מיון לפי שם</option>
          <option value="store">מיון לפי חנות</option>
        </select>
      </div>

      <div className="space-y-3">
        {superReceipts.map((r) => (
          <div key={r.id} className="bg-gray-800 rounded-xl px-4 py-3 text-white shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
            <div className="flex flex-col">
              <span className="font-semibold">🧾 {r.name}</span>
              <span className="text-gray-400 text-xs">📅 {new Date(r.inserted_at).toLocaleDateString("he-IL")}</span>
            </div>
            <div className="text-right sm:text-left">
              <p className="font-bold">₪ {r.price}</p>
              <p className="text-gray-400">חנות: {r.store}</p>
            </div>
          </div>
        ))}

        {superReceipts.length === 0 && (
          <p className="text-center text-gray-400">לא נמצאו קבלות</p>
        )}
      </div>
    </div>
  );
}
