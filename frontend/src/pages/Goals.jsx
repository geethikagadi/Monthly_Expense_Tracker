import { useState } from "react";
import "./Goals.css";

function Goals() {
  const [goals, setGoals] = useState(
    JSON.parse(localStorage.getItem("expenseGoals")) || []
  );

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  const addGoal = () => {
  const goalName = name.trim();
  const targetAmount = Number(target);
  const savedAmount = Number(saved || 0);

  if (!goalName || targetAmount <= 0) {
    alert("Please enter a goal name and a valid target amount.");
    return;
  }

  if (savedAmount < 0) {
    alert("Saved amount cannot be negative.");
    return;
  }

  const newGoal = {
    id: Date.now(),
    name: goalName,
    target: targetAmount,
    saved: savedAmount,
    createdAt: new Date().toLocaleDateString("en-IN"),
  };

  const updatedGoals = [...goals, newGoal];

  setGoals(updatedGoals);

  localStorage.setItem(
    "expenseGoals",
    JSON.stringify(updatedGoals)
  );

  setName("");
  setTarget("");
  setSaved("");

  alert("Goal created successfully!");
};
  const updateSaved = (id, value) => {
  const savedAmount = Number(value || 0);

  if (savedAmount < 0) {
    return;
  }

  const updatedGoals = goals.map((goal) =>
    goal.id === id
      ? {
          ...goal,
          saved: savedAmount,
        }
      : goal
  );

  setGoals(updatedGoals);

  localStorage.setItem(
    "expenseGoals",
    JSON.stringify(updatedGoals)
  );
};

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(
      (goal) => goal.id !== id
    );

    setGoals(updatedGoals);

    localStorage.setItem(
      "expenseGoals",
      JSON.stringify(updatedGoals)
    );
  };

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.target || 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + Number(goal.saved || 0),
    0
  );

  return (
    <main className="main-container page-content">

      <div className="page-header">
        <div>
          <h1>Financial Goals</h1>

          <p>
            Set savings goals and track
            your progress.
          </p>
        </div>
      </div>

      {/* SUMMARY */}

      <section className="summary-grid">

        <div className="summary-card income-card">
          <p>Total Target</p>

          <h2>
            ₹{totalTarget.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card savings-card">
          <p>Total Saved</p>

          <h2>
            ₹{totalSaved.toLocaleString()}
          </h2>
        </div>

        <div className="summary-card expense-card">
          <p>Remaining</p>

          <h2>
            ₹{(
              totalTarget - totalSaved
            ).toLocaleString()}
          </h2>
        </div>

      </section>

      {/* CREATE GOAL */}

      <section className="goal-form-card">

        <h2>Create New Goal</h2>

        <div className="goal-form">

          <div>
            <label>Goal Name</label>

            <input
              type="text"
              placeholder="e.g. New Laptop"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div>
            <label>Target Amount</label>

            <input
              type="number"
              placeholder="₹ Target amount"
              value={target}
              onChange={(e) =>
                setTarget(e.target.value)
              }
            />
          </div>

          <div>
            <label>Already Saved</label>

            <input
              type="number"
              placeholder="₹ Saved amount"
              value={saved}
              onChange={(e) =>
                setSaved(e.target.value)
              }
            />
          </div>

          <button
            className="add-goal-button"
            onClick={addGoal}
          >
            + Create Goal
          </button>

        </div>

      </section>

      {/* GOALS */}

      <section className="goals-panel">

        <div className="panel-header">

          <h2>Your Goals</h2>

          <p>
            Track how close you are to
            achieving each goal.
          </p>

        </div>

        {goals.length === 0 ? (

          <div className="empty-page">

            <h2>No Goals Yet</h2>

            <p>
              Create your first financial
              goal above.
            </p>

          </div>

        ) : (

          <div className="goals-list">

            {goals.map((goal) => {

              const percentage =
                goal.target > 0
                  ? Math.min(
                      (goal.saved /
                        goal.target) *
                        100,
                      100
                    )
                  : 0;

              const remaining =
                Math.max(
                  goal.target -
                    goal.saved,
                  0
                );

              return (
                <div
                  className="goal-card"
                  key={goal.id}
                >

                  <div className="goal-header">

                    <div>
                      <h3>
                        {goal.name}
                      </h3>

                      <span>
                        Created{" "}
                        {goal.createdAt}
                      </span>
                    </div>

                    <button
                      className="delete-goal"
                      onClick={() =>
                        deleteGoal(goal.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                  <div className="goal-amounts">

                    <div>
                      <span>Saved</span>

                      <strong>
                        ₹
                        {Number(
                          goal.saved
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>Target</span>

                      <strong>
                        ₹
                        {Number(
                          goal.target
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>Remaining</span>

                      <strong>
                        ₹
                        {remaining.toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  <div className="goal-progress">

                    <div
                      className="goal-progress-bar"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <div className="goal-progress-info">

                    <strong>
                      {percentage.toFixed(1)}%
                      completed
                    </strong>

                    <span>
                      {percentage >= 100
                        ? "Goal achieved 🎉"
                        : "Keep going!"}
                    </span>

                  </div>

                  <div className="goal-update">

                    <label>
                      Update saved amount
                    </label>

                    <input
                      type="number"
                      value={goal.saved}
                      onChange={(e) =>
                        updateSaved(
                          goal.id,
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}

export default Goals;