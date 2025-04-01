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
  const [activeTab, setActiveTab] = useState("teams");
  const router = useRouter();

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
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTab("teams")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">שיוך שמות</button>
          <button onClick={() => setActiveTab("budget")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">תקציב</button>
          <button onClick={() => setActiveTab("receipts")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">כל הקבלות</button>
          <button onClick={() => setActiveTab("manualAssign")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">שיוך ידני</button>
          <button onClick={() => setActiveTab("manualEntry")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">קבלה ידנית</button>
          <button onClick={() => setActiveTab("users")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">ניהול סיסמאות</button>
          <button onClick={() => setActiveTab("overview")} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm">מבט על</button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          התנתק
        </button>
      </div>
      {renderTab()}
    </div>
  );
}
