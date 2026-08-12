from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, get_db
from models import Base, Expense


app = FastAPI(
    title="ExpenseTrack API",
    description="Monthly Expense Tracking System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


# Request model
class ExpenseCreate(BaseModel):
    month: str
    income: float
    category: str
    amount: float


@app.get("/")
def home():
    return {
        "message": "ExpenseTrack Backend is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "OK"
    }


# Get all expenses
@app.get("/api/expenses")
def get_expenses(db: Session = Depends(get_db)):

    expenses = db.query(Expense).all()

    return expenses


# Add an expense
@app.post("/api/expenses")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):

    new_expense = Expense(
        month=expense.month,
        income=expense.income,
        category=expense.category,
        amount=expense.amount
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense saved successfully",
        "expense": {
            "id": new_expense.id,
            "month": new_expense.month,
            "income": new_expense.income,
            "category": new_expense.category,
            "amount": new_expense.amount
        }
    }


@app.delete("/api/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        return {
            "message": "Expense not found"
        }

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted successfully"
    }

@app.delete("/api/expenses/month/{month}")
def delete_month_expenses(
    month: str,
    db: Session = Depends(get_db)
):
    expenses = (
        db.query(Expense)
        .filter(Expense.month == month)
        .all()
    )

    for expense in expenses:
        db.delete(expense)

    db.commit()

    return {
        "message": f"{len(expenses)} expenses deleted",
        "month": month
    }