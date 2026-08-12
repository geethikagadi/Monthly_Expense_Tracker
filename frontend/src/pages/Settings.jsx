import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("userName") || ""
  );

  const [email, setEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );

  const saveSettings = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("currency", currency);

    alert("Settings saved successfully!");
  };

  const clearAllData = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all expense data? This cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    localStorage.removeItem("expenseHistory");
    localStorage.removeItem("transactions");
    localStorage.removeItem("budgets");
    localStorage.removeItem("expenseGoals");

    alert("All expense data has been deleted.");

    window.location.reload();
  };


  return (
    <main className="main-container page-content">

      <div className="page-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your account and application
            preferences.
          </p>
        </div>
      </div>

      {/* PROFILE */}

      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Profile</h2>

          <p>
            Update your personal information.
          </p>
        </div>

        <div className="settings-form">

          <div className="settings-field">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="settings-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

        </div>

        <button
          className="save-settings-button"
          onClick={saveSettings}
        >
          Save Changes
        </button>

      </section>

      {/* PREFERENCES */}

      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Preferences</h2>

          <p>
            Customize how your expenses are displayed.
          </p>
        </div>

        <div className="settings-field">

          <label>Currency</label>

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >
            <option value="INR">
              ₹ Indian Rupee (INR)
            </option>

            <option value="USD">
              $ US Dollar (USD)
            </option>

            <option value="EUR">
              € Euro (EUR)
            </option>

            <option value="GBP">
              £ British Pound (GBP)
            </option>
          </select>

        </div>

        <button
          className="save-settings-button"
          onClick={saveSettings}
        >
          Save Preferences
        </button>

      </section>

      {/* DATA */}

      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Data Management</h2>

          <p>
            Manage the financial data stored in
            this application.
          </p>
        </div>

        <button
          className="clear-data-button"
          onClick={clearAllData}
        >
          Clear All Expense Data
        </button>

      </section>

      
    </main>
  );
}

export default Settings;