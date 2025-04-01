// pages/admin.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeamsTab from "./adminTabs/TeamsTab";
import BudgetTab from "./adminTabs/BudgetTab";
import ReceiptsTab from "./adminTabs/ReceiptsTab";
import ManualAssignTab from "./adminTabs/ManualAssignTab";
import ManualEntryTab from "./adminTabs/ManualEntryTab";
import UserManagementTab from "./adminTabs/UserManagementTab";
import OverviewTab from "./adminTabs/OverviewTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/"); // חזרה לעמוד הבית אם אין הרשאה
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "teams":
        return <TeamsTab />;
      case "budget":
        return <BudgetTab />;
      case "receipts":
        return <ReceiptsTab />;
      case "manualAssign":
        return <ManualAssignTab />;
      case "manualEntry":
        return <ManualEntryTab />;
      case "users":
        return <UserManagementTab />;
      case "overview":
        return <OverviewTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div className="w-full flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            🚪 התנתק
          </button>
        </div>
        <div className="w-full flex flex-wrap justify-center gap-2">
          <button onClick={() => setActiveTab("overview")} className={`px-4 py-2 rounded text-sm ${activeTab === "overview" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            📊 מבט על
          </button>
          <button onClick={() => setActiveTab("teams")} className={`px-4 py-2 rounded text-sm ${activeTab === "teams" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            👥 שיוך שמות
          </button>
          <button onClick={() => setActiveTab("budget")} className={`px-4 py-2 rounded text-sm ${activeTab === "budget" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            💰 תקציב
          </button>
          <button onClick={() => setActiveTab("receipts")} className={`px-4 py-2 rounded text-sm ${activeTab === "receipts" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            🧾 כל הקבלות
          </button>
          <button onClick={() => setActiveTab("manualAssign")} className={`px-4 py-2 rounded text-sm ${activeTab === "manualAssign" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            🛠️ שיוך ידני
          </button>
          <button onClick={() => setActiveTab("manualEntry")} className={`px-4 py-2 rounded text-sm ${activeTab === "manualEntry" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            ✍️ קבלה ידנית
          </button>
          <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded text-sm ${activeTab === "users" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-800"}`}>
            🔑 ניהול סיסמאות
          </button>
        </div>
      </div>
      {renderTab()}
    </div>
  );
}
