from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    month = Column(String, nullable=False)

    income = Column(Float, default=0)

    category = Column(String, nullable=False)

    amount = Column(Float, default=0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )