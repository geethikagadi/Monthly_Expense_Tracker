import { useState } from "react";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const addTransaction = () => {
    if (!category || !amount) {
      alert("Please enter category and amount");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      category,
      amount: Number(amount),
      description,
      date: new Date().toLocaleDateString("en-IN"),
    };

    const updatedTransactions = [
      ...transactions,
      newTransaction,
    ];

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );

    setCategory("");
    setAmount("");
    setDescription("");

    alert("Transaction added successfully!");
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  return (
    <main className="main-container page-content">

      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Add and manage your income and expenses.
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
            ₹{(
              totalIncome - totalExpenses
            ).toLocaleString()}
          </h2>
        </div>

      </section>

      {/* ADD TRANSACTION */}

      <section className="transaction-form-card">

        <h2>Add Transaction</h2>

        <div className="transaction-form">

          <div>
            <label>Type</label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>
          </div>

          <div>
            <label>Category</label>

            <input
              type="text"
              placeholder="e.g. Groceries"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />
          </div>

          <div>
            <label>Amount</label>

            <input
              type="number"
              placeholder="₹ Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />
          </div>

          <div>
            <label>Description</label>

            <input
              type="text"
              placeholder="Optional description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <button
            className="add-transaction-button"
            onClick={addTransaction}
          >
            + Add Transaction
          </button>

        </div>

      </section>

      {/* TRANSACTION LIST */}

      <section className="transaction-list-card">

        <h2>Transaction History</h2>

        {transactions.length === 0 ? (

          <div className="empty-page">
            <h3>No Transactions Yet</h3>

            <p>
              Add your first transaction above.
            </p>
          </div>

        ) : (

          <div className="transaction-table">

            <div className="transaction-table-header">
              <span>Date</span>
              <span>Type</span>
              <span>Category</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Action</span>
            </div>

            {[...transactions]
              .reverse()
              .map((transaction) => (

                <div
                  className="transaction-row"
                  key={transaction.id}
                >

                  <span>
                    {transaction.date}
                  </span>

                  <span
                    className={
                      transaction.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {transaction.type}
                  </span>

                  <span>
                    {transaction.category}
                  </span>

                  <span>
                    {transaction.description || "-"}
                  </span>

                  <strong
                    className={
                      transaction.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    ₹
                    {transaction.amount.toLocaleString()}
                  </strong>

                  <button
                    className="delete-transaction"
                    onClick={() =>
                      deleteTransaction(
                        transaction.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Transactions;