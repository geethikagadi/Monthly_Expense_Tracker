import { useEffect, useState } from "react";
import "./History.css";

function History() {
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("expenseHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const deleteMonth = (monthToDelete) => {
    const confirmed = window.confirm(
      `Delete ${monthToDelete} history?`
    );

    if (!confirmed) {
      return;
    }

    const updatedHistory = history.filter(
      (month) => month.month !== monthToDelete
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "expenseHistory",
      JSON.stringify(updatedHistory)
    );

    setSelectedMonth(null);
  };

  /* GROUP / CALCULATE MONTH DATA */

  const months = history.map((month) => {
    const expenses = month.expenses || [];

    const totalExpenses = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    const income = Number(month.income || 0);

    const savings = income - totalExpenses;

    const savingsRate =
      income > 0
        ? ((savings / income) * 100).toFixed(1)
        : 0;

    return {
      ...month,
      income,
      expenses,
      totalExpenses,
      savings,
      savingsRate,
    };
  });

  /* MONTH DETAILS */

  if (selectedMonth) {
    const colors = [
      "#2563eb",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
    ];

    const total = selectedMonth.totalExpenses;

    let currentAngle = 0;

    const pieParts = selectedMonth.expenses.map(
      (expense, index) => {
        const percentage =
          total > 0
            ? (Number(expense.amount || 0) / total) * 100
            : 0;

        const startAngle = currentAngle;

        const endAngle =
          currentAngle + percentage * 3.6;

        currentAngle = endAngle;

        return {
          ...expense,
          percentage,
          startAngle,
          endAngle,
          color: colors[index % colors.length],
        };
      }
    );

    const gradient = pieParts
      .map(
        (part) =>
          `${part.color} ${part.startAngle}deg ${part.endAngle}deg`
      )
      .join(", ");

    return (
      <main className="main-container page-content">

        <button
          className="back-button"
          onClick={() => setSelectedMonth(null)}
        >
          ← Back to History
        </button>

        <div className="page-header">
          <div>
            <h1>{selectedMonth.month}</h1>

            <p>
              Monthly expense details
            </p>
          </div>

          <button
            className="delete-history-button"
            onClick={() =>
              deleteMonth(selectedMonth.month)
            }
          >
            Delete Month
          </button>
        </div>

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card income-card">
            <p>Monthly Income</p>

            <h2>
              ₹
              {selectedMonth.income.toLocaleString(
                "en-IN"
              )}
            </h2>
          </div>

          <div className="summary-card expense-card">
            <p>Total Expenses</p>

            <h2>
              ₹
              {selectedMonth.totalExpenses.toLocaleString(
                "en-IN"
              )}
            </h2>
          </div>

          <div className="summary-card savings-card">
            <p>Savings</p>

            <h2>
              ₹
              {selectedMonth.savings.toLocaleString(
                "en-IN"
              )}
            </h2>
          </div>

          <div className="summary-card rate-card">
            <p>Savings Rate</p>

            <h2>
              {selectedMonth.savingsRate}%
            </h2>
          </div>

        </section>

        {/* DETAILS */}

        <section className="history-details-grid">

          <div className="history-detail-card">

            <h2>Expense Breakdown</h2>

            {selectedMonth.expenses.length === 0 ? (
              <div className="empty-page">
                <p>No expenses recorded.</p>
              </div>
            ) : (
              selectedMonth.expenses.map(
                (expense, index) => (
                  <div
                    className="history-expense-row"
                    key={
                      expense.id ||
                      `${expense.name}-${index}`
                    }
                  >
                    <span>
                      {expense.name}
                    </span>

                    <strong>
                      ₹
                      {Number(
                        expense.amount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )
              )
            )}

          </div>

          {/* PIE CHART */}

          <div className="history-detail-card">

            <h2>Expense Chart</h2>

            <div className="history-pie-chart">

              <div
                className="pie-placeholder"
                style={{
                  background:
                    total > 0
                      ? `conic-gradient(${gradient})`
                      : "#e5e7eb",
                }}
              />

            </div>

            {/* LEGEND */}

            <div className="history-chart-legend">

              {pieParts.map((expense, index) => (
                <div
                  className="legend-item"
                  key={
                    expense.id ||
                    `${expense.name}-${index}`
                  }
                >

                  <span
                    className="legend-dot"
                    style={{
                      background:
                        expense.color,
                    }}
                  />

                  <span>
                    {expense.name}
                  </span>

                  <strong>
                    {expense.percentage.toFixed(1)}%
                  </strong>

                </div>
              ))}

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* HISTORY LIST */

  return (
    <main className="main-container page-content">

      <div className="page-header">

        <div>

          <h1>
            Expense History
          </h1>

          <p>
            View your previous monthly expenses.
          </p>

        </div>

      </div>

      {months.length === 0 ? (

        <div className="empty-page">

          <h2>
            No History Yet
          </h2>

          <p>
            Save your first month's expenses
            from the Dashboard.
          </p>

        </div>

      ) : (

        <div className="history-list">

          {[...months]
            .reverse()
            .map((month) => (

              <div
                className="history-card"
                key={month.month}
              >

                <div className="history-header">

                  <div>

                    <h2>
                      {month.month}
                    </h2>

                    <span>
                      Monthly Expense Summary
                    </span>

                  </div>

                  <div className="history-actions">

                    <button
                      className="view-details-button"
                      onClick={() =>
                        setSelectedMonth(month)
                      }
                    >
                      View Details →
                    </button>

                    <button
                      className="delete-history-button"
                      onClick={() =>
                        deleteMonth(month.month)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

                <div className="history-summary">

                  <div>

                    <span>
                      Income
                    </span>

                    <strong>
                      ₹
                      {month.income.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Expenses
                    </span>

                    <strong>
                      ₹
                      {month.totalExpenses.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Savings
                    </span>

                    <strong>
                      ₹
                      {month.savings.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Savings Rate
                    </span>

                    <strong>
                      {month.savingsRate}%
                    </strong>

                  </div>

                </div>

              </div>

            ))}

        </div>

      )}

    </main>
  );
}

export default History;