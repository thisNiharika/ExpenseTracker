import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private STORAGE_KEY = 'pulse_expenses';
  private CATEGORY_KEY = 'pulse_categories';

  // 🔹 Load from localStorage
  private loadExpenses(): Expense[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private loadCategories(): Category[] {
    const data = localStorage.getItem(this.CATEGORY_KEY);
    if (data) return JSON.parse(data);

    // Default categories
    const defaults: Category[] = [
      { id: '1', name: 'Food', color: '#3b82f6' },
      { id: '2', name: 'Transport', color: '#14b8a6' },
      { id: '3', name: 'Shopping', color: '#a855f7' },
      { id: '4', name: 'Bills', color: '#f97316' },
      { id: '5', name: 'Entertainment', color: '#ef4444' },
      { id: '6', name: 'Health', color: '#22c55e' }
    ];

    localStorage.setItem(this.CATEGORY_KEY, JSON.stringify(defaults));
    return defaults;
  }

  private expensesSubject = new BehaviorSubject<Expense[]>(this.loadExpenses());
  expenses$ = this.expensesSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategories());
  categories$ = this.categoriesSubject.asObservable();

  // 🔹 Save to localStorage
  private saveExpenses(data: Expense[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private saveCategories(data: Category[]) {
    localStorage.setItem(this.CATEGORY_KEY, JSON.stringify(data));
  }

  addExpense(expense: Expense) {
    const updated = [expense, ...this.expensesSubject.value];
    this.expensesSubject.next(updated);
    this.saveExpenses(updated);
  }

  deleteExpense(id: string) {
    const updated = this.expensesSubject.value.filter(e => e.id !== id);
    this.expensesSubject.next(updated);
    this.saveExpenses(updated);
  }

  addCategory(category: Category) {
    const updated = [...this.categoriesSubject.value, category];
    this.categoriesSubject.next(updated);
    this.saveCategories(updated);
  }

}