import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";

import "./App.css";
import Transactions from "./pages/Transactions";

import Budget from "./pages/Budget";

import Goals from "./pages/Goals";

import Reports from "./pages/Reports";

import Settings from "./pages/Settings";
/* =========================================
   NAVIGATION
========================================= */

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="logo">
        Expense<span>Track</span>
      </div>

      <nav>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Budget
        </NavLink>

        <NavLink
          to="/goals"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Goals
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          History
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Settings
        </NavLink>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </header>
  );
}


/* =========================================
   DASHBOARD
========================================= */

function Dashboard() {

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  const transactionIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const transactionExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const [income, setIncome] = useState("");

  const [expenses, setExpenses] = useState([
    {
      name: "House Rent",
      amount: "",
    },
    {
      name: "Electricity",
      amount: "",
    },
    {
      name: "Groceries",
      amount: "",
    },
    {
      name: "Transport",
      amount: "",
    },
  ]);


  /* TOTAL EXPENSES */

  const manualTotalExpenses = expenses.reduce(
  (total, expense) =>
    total + Number(expense.amount || 0),
  0
);

const totalExpenses =
  transactions.length > 0
    ? transactionExpenses
    : manualTotalExpenses;


  /* SAVINGS */

  const dashboardIncome =
  transactions.length > 0
    ? transactionIncome
    : Number(income || 0);

const savings =
  dashboardIncome - totalExpenses;


  /* SAVINGS RATE */

  const savingsRate =
  dashboardIncome > 0
    ? ((savings / dashboardIncome) * 100).toFixed(1)
    : 0;

  /* UPDATE EXPENSE */

  const updateExpense = (
    index,
    value
  ) => {

    const updatedExpenses = [
      ...expenses,
    ];

    updatedExpenses[index] = {
      ...updatedExpenses[index],
      amount: value,
    };

    setExpenses(updatedExpenses);
  };


  /* UPDATE EXPENSE NAME */

  const updateExpenseName = (
    index,
    value
  ) => {

    const updatedExpenses = [
      ...expenses,
    ];

    updatedExpenses[index] = {
      ...updatedExpenses[index],
      name: value,
    };

    setExpenses(updatedExpenses);
  };


  /* ADD EXPENSE */

  const addExpense = () => {

    setExpenses([
      ...expenses,
      {
        name: "New Expense",
        amount: "",
      },
    ]);
  };


  /* SAVE MONTH */

  const saveMonth = () => {

    const currentMonth =
      new Date().toLocaleString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      );

    const monthData = {

      id: Date.now(),

      month: currentMonth,

      income: Number(
        income || 0
      ),

      expenses: expenses.map(
        (expense) => ({
          name: expense.name,
          amount: Number(
            expense.amount || 0
          ),
        })
      ),

      totalExpenses,

      savings,

      savingsRate,

      savedAt:
        new Date().toISOString(),
    };


    const existingHistory =
      JSON.parse(
        localStorage.getItem(
          "expenseHistory"
        )
      ) || [];


    const monthExists =
      existingHistory.some(
        (item) =>
          item.month ===
          currentMonth
      );


    let updatedHistory;


    if (monthExists) {

      updatedHistory =
        existingHistory.map(
          (item) =>
            item.month ===
            currentMonth
              ? {
                  ...monthData,
                  id: item.id,
                }
              : item
        );

      alert(
        `${currentMonth} expenses updated successfully!`
      );

    } else {

      updatedHistory = [
        ...existingHistory,
        monthData,
      ];

      alert(
        `${currentMonth} expenses saved successfully!`
      );
    }


    localStorage.setItem(
      "expenseHistory",
      JSON.stringify(
        updatedHistory
      )
    );
  };


  return (

    <main className="main-container">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Monthly Expense Tracker
          </h1>

          <p>
            Track your income, expenses
            and savings every month.
          </p>

        </div>

        <button className="month-button">
          August 2026
        </button>

      </div>


      {/* SUMMARY */}

      <section className="summary-grid">

        {/* INCOME */}

        <div className="summary-card income-card">

          <p>
            Monthly Income
          </p>

          <input
            type="number"
            placeholder={
            transactions.length > 0
            ? "Income managed in Transactions"
            : "Enter income"
            }
            value={income}
           onChange={(e) =>
           setIncome(e.target.value)
            }
           disabled={transactions.length > 0}
          />

          <h2>
           ₹{dashboardIncome.toLocaleString()}
          </h2>
        </div>


        {/* EXPENSES */}

        <div className="summary-card expense-card">

          <p>
            Total Expenses
          </p>

          <h2>
            ₹
            {totalExpenses.toLocaleString()}
          </h2>

          <span>
            This month
          </span>

        </div>


        {/* SAVINGS */}

        <div className="summary-card savings-card">

          <p>
            Savings
          </p>

          <h2>
            ₹
            {savings.toLocaleString()}
          </h2>

          <span>
            This month
          </span>

        </div>


        {/* SAVINGS RATE */}

        <div className="summary-card rate-card">

          <p>
            Savings Rate
          </p>

          <h2>
            {savingsRate}%
          </h2>

          <span>
            of income
          </span>

        </div>

      </section>


      {/* EXPENSES */}

      <section className="dashboard-grid">

        <div className="expenses-panel">

          <div className="panel-header">

            <h2>
              Your Monthly Expenses
            </h2>

            <p>
              Enter your spending
              categories and amounts.
            </p>

          </div>


          <div className="expense-list">

            {expenses.map(
              (expense, index) => {

                const percentage =
                  Number(income) > 0
                    ? (
                        Number(
                          expense.amount ||
                            0
                        ) /
                        Number(income) *
                        100
                      ).toFixed(1)
                    : 0;


                return (

                  <div
                    className="expense-row"
                    key={index}
                  >

                    <input
                      className="expense-name"
                      value={
                        expense.name
                      }
                      onChange={(e) =>
                        updateExpenseName(
                          index,
                          e.target.value
                        )
                      }
                    />


                    <input
                      className="expense-amount"
                      type="number"
                      placeholder="₹ Amount"
                      value={
                        expense.amount
                      }
                      onChange={(e) =>
                        updateExpense(
                          index,
                          e.target.value
                        )
                      }
                    />


                    <span className="percentage">
                      {percentage}%
                    </span>

                  </div>

                );
              }
            )}

          </div>


          <button
            className="add-expense"
            onClick={addExpense}
          >
            + Add Expense
          </button>

        </div>


        {/* CHART */}

        <div className="chart-panel">

          <div className="panel-header">

            <h2>
              Spending Breakdown
            </h2>

            <p>
              Your expenses for this month.
            </p>

          </div>


          <div className="pie-container">

            <div
              className="pie-chart"
              style={{
                background:
                  createPieGradient(
                    expenses
                  ),
              }}
            >

              <div className="pie-center">

                <strong>
                  ₹
                  {totalExpenses.toLocaleString()}
                </strong>

                <span>
                  Total Expenses
                </span>

              </div>

            </div>

          </div>


          <div className="legend">

            {expenses.map(
              (expense, index) => (

                <div
                  className="legend-item"
                  key={index}
                >

                  <span className="legend-dot"></span>

                  <span>
                    {expense.name}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      expense.amount ||
                        0
                    ).toLocaleString()}
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* SAVE */}

      <section className="save-section">

        <div>

          <h2>
            Save This Month
          </h2>

          <p>
            Save your monthly expenses
            to your history.
          </p>

        </div>


        <button
          className="save-button"
          onClick={saveMonth}
        >
          💾 Save August 2026
        </button>

      </section>

    </main>
  );
}



/* =========================================
   HISTORY
========================================= */

function History() {

  const history =
    JSON.parse(
      localStorage.getItem(
        "expenseHistory"
      )
    ) || [];


  return (

    <main className="main-container page-content">

      <h1>
        Expense History
      </h1>

      <p>
        View your previous monthly expenses.
      </p>


      {history.length === 0 ? (

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

          {[...history]
            .reverse()
            .map((month) => (

              <div
                className="history-card"
                key={month.id}
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

                </div>


                <div className="history-summary">

                  <div>

                    <span>
                      Income
                    </span>

                    <strong>
                      ₹
                      {Number(
                        month.income || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Expenses
                    </span>

                    <strong>
                      ₹
                      {Number(
                        month.totalExpenses ||
                          0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Savings
                    </span>

                    <strong>
                      ₹
                      {Number(
                        month.savings || 0
                      ).toLocaleString()}
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


                <div className="history-expenses">

                  <h3>
                    Expenses
                  </h3>


                  {month.expenses?.map(
                    (expense, index) => (

                      <div
                        className="history-expense-row"
                        key={index}
                      >

                        <span>
                          {expense.name}
                        </span>

                        <strong>
                          ₹
                          {Number(
                            expense.amount ||
                              0
                          ).toLocaleString()}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

            ))}

        </div>

      )}

    </main>
  );
}



/* =========================================
   PIE CHART
========================================= */

function createPieGradient(expenses) {

  const total =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );


  if (total === 0) {

    return "conic-gradient(#e5e7eb 0deg 360deg)";
  }


  const colors = [
    "#4f46e5",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];


  let currentDegree = 0;


  const sections =
    expenses.map(
      (expense, index) => {

        const amount =
          Number(
            expense.amount || 0
          );


        const degree =
          (amount / total) *
          360;


        const start =
          currentDegree;


        const end =
          currentDegree +
          degree;


        currentDegree =
          end;


        return `${
          colors[
            index % colors.length
          ]
        } ${start}deg ${end}deg`;
      }
    );


  return `conic-gradient(
    ${sections.join(", ")}
  )`;
}


/* =========================================
   APPLICATION
========================================= */

function Application() {
  return (
    <>
      <Navigation />

      <Routes>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />
        

        <Route
          path="/budget"
          element={<Budget />}
        />

        <Route
          path="/goals"
          element={<Goals />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>
    </>
  );
}

/* =========================================
   MAIN APP
========================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* APPLICATION */}

        <Route
          path="*"
          element={<Application />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;