import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css']
})
export class AddExpenseComponent implements OnInit {

  title = '';
  amount = 0;
  category = '';
  categories: Category[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.categories$.subscribe(data => {
      this.categories = data;
    });
  }

  addExpense() {
    if (!this.title || this.amount <= 0) return;

    this.expenseService.addExpense({
      id: uuidv4(),
      title: this.title,
      amount: this.amount,
      category: this.category,
      date: new Date()
    });

    this.title = '';
    this.amount = 0;
  }
}