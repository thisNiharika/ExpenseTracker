import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { Category } from '../../models/category.model';
import { ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  expenses: Expense[] = [];
  categories: Category[] = [];

  totalAmount = 0;
  displayBalance = 0;
  pieGradient = '';
  title = '';
  amount = 0;
  category = '';
  animatedGradient = '';

  showModal = false;

  categoryTotals: {
    category: string;
    total: number;
    color: string;
  }[] = [];

  constructor(private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.expenseService.expenses$,
      this.expenseService.categories$
    ]).subscribe(([expenses, categories]) => {

      this.expenses = expenses;
      this.categories = categories;

      this.totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
      this.animateBalance(this.totalAmount);

      this.calculateCategoryTotals();  // Now guaranteed safe


    });


  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }


getCategoryPercent(amount: number): number {

  const total = this.totalAmount;

  if (total === 0) return 0;

  return Math.round((amount / total) * 100);
}

getCategoryIcon(category: string): string {

  const icons: { [key: string]: string } = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '💡',
    Entertainment: '🎬',
    Health: '💊'
  };

  return icons[category] || '💰';
}

getCategoryColor(category: string): string {

  const categoryObj = this.categories.find(c => c.name === category);

  return categoryObj ? categoryObj.color : '#3b82f6';

}



  addExpense(): void {

    if (!this.title || this.amount <= 0) return;

    this.expenseService.addExpense({
      id: crypto.randomUUID(),
      title: this.title,
      amount: this.amount,
      category: this.category,
      date: new Date()
    });

    this.title = '';
    this.amount = 0;

    this.toggleModal();
  }

  calculateCategoryTotals(): void {

    const totals: { [key: string]: number } = {};

    // Sum category totals
    this.expenses.forEach(exp => {
      if (!totals[exp.category]) {
        totals[exp.category] = 0;
      }
      totals[exp.category] += exp.amount;
    });

    const totalSum = Object.values(totals).reduce((a, b) => a + b, 0);

    let start = 0;
    const segments: string[] = [];

    const palette = [
      '#3b82f6',
      '#14b8a6',
      '#a855f7',
      '#f97316',
      '#ef4444'
    ];

    let colorIndex = 0;

    this.categoryTotals = Object.keys(totals).map(cat => {

      const color = palette[colorIndex % palette.length];
      colorIndex++;

      const percentage = totalSum > 0
        ? (totals[cat] / totalSum) * 100
        : 0;

      const segment = `${color} ${start}% ${start + percentage}%`;

      segments.push(segment);

      start += percentage;

      return {
        category: cat,
        total: totals[cat],
        color: color
      };
    });

    this.pieGradient = segments.length > 0
      ? `conic-gradient(${segments.join(',')})`
      : '';

    const finalGradient = segments.length > 0
      ? `conic-gradient(${segments.join(',')})`
      : '';

    this.animatePie(finalGradient);
    this.cdr.detectChanges();

  }

  animatePie(targetGradient: string) {

    this.animatedGradient = 'conic-gradient(#1f2937 0% 100%)';

    requestAnimationFrame(() => {
      this.animatedGradient = targetGradient;
    });

  }

  animateBalance(target: number): void {

    const duration = 600;
    const startTime = performance.now();
    const initial = this.displayBalance;

    const animate = (currentTime: number) => {

      const progress = Math.min((currentTime - startTime) / duration, 1);

      this.displayBalance = Math.floor(
        initial + (target - initial) * progress
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }



}