import { useState } from "react";
import "./Budget.css";

function Budget() {
  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || [
      {
        category: "House Rent",
        budget: 10000,
      },
      {
        category: "Groceries",
        budget: 5000,
      },
      {
        category: "Electricity",
        budget: 3000,
      },
      {
        category: "Transport",
        budget: 3000,
      },
    ]
  );

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  const getSpent = (category) => {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        String(transaction.category || "")
          .trim()
          .toLowerCase() ===
          String(category || "")
            .trim()
            .toLowerCase()
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );
};

  const updateBudget = (index, value) => {
    const updated = [...budgets];

    updated[index] = {
      ...updated[index],
      budget: Number(value || 0),
    };

    setBudgets(updated);

    localStorage.setItem(
      "budgets",
      JSON.stringify(updated)
    );
  };

  const updateCategory = (index, value) => {
    const updated = [...budgets];

    updated[index] = {
      ...updated[index],
      category: value,
    };

    setBudgets(updated);

    localStorage.setItem(
      "budgets",
      JSON.stringify(updated)
    );
  };

  const addBudget = () => {
    const updated = [
      ...budgets,
      {
        category: "New Category",
        budget: 0,
      },
    ];

    setBudgets(updated);

    localStorage.setItem(
      "budgets",
      JSON.stringify(updated)
    );
  };

  const deleteBudget = (index) => {
    const updated = budgets.filter(
      (_, i) => i !== index
    );

    setBudgets(updated);

    localStorage.setItem(
      "budgets",
      JSON.stringify(updated)
    );
  };

  const totalBudget = budgets.reduce(
    (total, item) =>
      total + Number(item.budget || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (total, item) =>
      total + getSpent(item.category),
    0
  );

  const remaining =
    totalBudget - totalSpent;

  return (
    <main className="main-container page-content">

      <div className="page-header">
        <div>
          <h1>Monthly Budget</h1>

          <p>
            Set spending limits and track
            your monthly budget.
          </p>
        </div>
      </div>

      {/* SUMMARY */}

      <section className="summary-grid">

        <div className="summary-card income-card">
          <p>Total Budget</p>

          <h2>
            ₹{totalBudget.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card expense-card">
          <p>Total Spent</p>

          <h2>
            ₹{totalSpent.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card savings-card">
          <p>Remaining</p>

          <h2>
            ₹{remaining.toLocaleString()}
          </h2>
        </div>

      </section>

      {/* BUDGET LIST */}

      <section className="budget-panel">

        <div className="panel-header">
          <h2>Category Budgets</h2>

          <p>
            Set a spending limit for each
            category.
          </p>
        </div>

        <div className="budget-list">

          {budgets.map(
            (item, index) => {

              const spent =
                getSpent(item.category);

              const percentage =
               Number(item.budget) > 0
                ? (spent / Number(item.budget)) * 100
               : 0;

               const isOverBudget =
                spent > Number(item.budget || 0);

              return (
                <div
                  className="budget-card"
                  key={index}
                >

                  <div className="budget-top">

                    <input
                      className="budget-category"
                      value={item.category}
                      onChange={(e) =>
                        updateCategory(
                          index,
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="delete-budget"
                      onClick={() =>
                        deleteBudget(index)
                      }
                    >
                      Delete
                    </button>

                  </div>

                  <div className="budget-input-row">

                    <div>
                      <label>
                        Monthly Budget
                      </label>

                      <input
                        type="number"
                        value={item.budget}
                        onChange={(e) =>
                          updateBudget(
                            index,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="budget-number">
                      <span>Spent</span>

                      <strong>
                        ₹{spent.toLocaleString()}
                      </strong>
                    </div>

                    <div className="budget-number">
                      <span>Remaining</span>

                      <strong>
                        ₹{(
                          Number(item.budget || 0) -
                          spent
                        ).toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  <div className="budget-progress">

                    <div
                      className="budget-progress-bar"
                     style={{
                     width: `${Math.min(percentage, 100)}%`,
                     }}
                    />

                  </div>

                  <div className="budget-progress-text">

                <span>
                {percentage.toFixed(1)}% used
                </span>

              <span>
              ₹{spent.toLocaleString()} /
              ₹{Number(
              item.budget || 0
              ).toLocaleString()}
             </span>

              </div>

              {isOverBudget && (
              <p className="budget-warning">
               ⚠️ Budget exceeded by ₹
              {(
               spent - Number(item.budget || 0)
                ).toLocaleString()}
                </p>
                 )}

                </div>
              );
            }
          )}

        </div>

        <button
          className="add-budget-button"
          onClick={addBudget}
        >
          + Add Budget Category
        </button>

      </section>

    </main>
  );
}

export default Budget;