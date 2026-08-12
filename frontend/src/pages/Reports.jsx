import { useMemo } from "react";
import "./Reports.css";

function Reports() {
  const history =
    JSON.parse(localStorage.getItem("expenseHistory")) || [];

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  // Combine transaction data and saved monthly data
  const categoryData = useMemo(() => {
    const data = {};

    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        const category = item.category || "Other";

        data[category] =
          (data[category] || 0) +
          Number(item.amount || 0);
      });

    if (Object.keys(data).length === 0 && history.length > 0) {
      history.forEach((month) => {
        (month.expenses || []).forEach((expense) => {
          const category = expense.name || "Other";

          data[category] =
            (data[category] || 0) +
            Number(expense.amount || 0);
        });
      });
    }

    return Object.entries(data).sort(
      (a, b) => b[1] - a[1]
    );
  }, [transactions, history]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  const transactionExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  const historyExpenses = history.reduce(
    (total, month) =>
      total + Number(month.totalExpenses || 0),
    0
  );

  const totalExpenses =
    transactionExpenses > 0
      ? transactionExpenses
      : historyExpenses;

  const balance =
    totalIncome - totalExpenses;

  const highestCategory =
    categoryData.length > 0
      ? categoryData[0]
      : null;

  const colors = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
  ];

  const chartTotal = categoryData.reduce(
    (total, [, amount]) =>
      total + Number(amount),
    0
  );

  let currentAngle = 0;

  const pieGradient = categoryData
    .map(([category, amount], index) => {
      const percentage =
        chartTotal > 0
          ? (amount / chartTotal) * 100
          : 0;

      const start = currentAngle;

      currentAngle += percentage;

      return `${colors[index % colors.length]} ${start}% ${currentAngle}%`;
    })
    .join(", ");

  return (
    <main className="main-container page-content">

      <div className="page-header">
        <div>
          <h1>Reports</h1>

          <p>
            Analyze your income and spending
            patterns.
          </p>
        </div>
      </div>

      {/* SUMMARY */}

      <section className="summary-grid">

        <div className="summary-card income-card">
          <p>Total Income</p>

          <h2>
            ₹{totalIncome.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card expense-card">
          <p>Total Expenses</p>

          <h2>
            ₹{totalExpenses.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card savings-card">
          <p>Balance</p>

          <h2>
            ₹{balance.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card rate-card">
          <p>Top Expense</p>

          <h2>
            {highestCategory
              ? highestCategory[0]
              : "No data"}
          </h2>
        </div>

      </section>

      {/* REPORT CONTENT */}

      {categoryData.length === 0 ? (

        <div className="empty-page reports-empty">

          <h2>No Report Data Yet</h2>

          <p>
            Add transactions or save monthly
            expenses to generate your report.
          </p>

        </div>

      ) : (

        <section className="reports-grid">

          {/* PIE CHART */}

          <div className="report-card">

            <h2>Expense Breakdown</h2>

            <p className="report-subtitle">
              Spending by category
            </p>

            <div className="report-chart-area">

              <div
                className="report-pie-chart"
                style={{
                  background:
                    `conic-gradient(${pieGradient})`,
                }}
              />

            </div>

            <div className="report-legend">

              {categoryData.map(
                ([category, amount], index) => {

                  const percentage =
                    chartTotal > 0
                      ? (
                          (amount /
                            chartTotal) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <div
                      className="report-legend-item"
                      key={category}
                    >

                      <div className="legend-name">

                        <span
                          className="report-dot"
                          style={{
                            background:
                              colors[
                                index %
                                  colors.length
                              ],
                          }}
                        />

                        <span>
                          {category}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          amount
                        ).toLocaleString()}
                        {" "}
                        ({percentage}%)
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* CATEGORY TABLE */}

          <div className="report-card">

            <h2>Category Report</h2>

            <p className="report-subtitle">
              Detailed spending summary
            </p>

            <div className="category-report-list">

              {categoryData.map(
                ([category, amount], index) => {

                  const percentage =
                    chartTotal > 0
                      ? (amount /
                          chartTotal) *
                        100
                      : 0;

                  return (
                    <div
                      className="category-report-row"
                      key={category}
                    >

                      <div className="category-report-header">

                        <span>
                          {category}
                        </span>

                        <strong>
                          ₹
                          {Number(
                            amount
                          ).toLocaleString()}
                        </strong>

                      </div>

                      <div className="category-report-bar">

                        <div
                          style={{
                            width:
                              `${percentage}%`,
                            background:
                              colors[
                                index %
                                  colors.length
                              ],
                          }}
                        />

                      </div>

                      <span className="category-percentage">
                        {percentage.toFixed(1)}%
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>
      )}

      {/* MONTHLY HISTORY */}

      {history.length > 0 && (

        <section className="report-card monthly-report">

          <h2>Monthly Summary</h2>

          <p className="report-subtitle">
            Your saved monthly expense history
          </p>

          <div className="monthly-report-list">

            {[...history]
              .reverse()
              .map((month) => (

                <div
                  className="monthly-report-row"
                  key={month.id}
                >

                  <div>
                    <strong>
                      {month.month}
                    </strong>
                  </div>

                  <div>
                    <span>Income</span>

                    <strong>
                      ₹
                      {Number(
                        month.income || 0
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Expenses</span>

                    <strong>
                      ₹
                      {Number(
                        month.totalExpenses || 0
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Savings</span>

                    <strong>
                      ₹
                      {Number(
                        month.savings || 0
                      ).toLocaleString()}
                    </strong>
                  </div>

                </div>

              ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default Reports;