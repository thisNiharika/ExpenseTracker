import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-manager.html',
  styleUrls: ['./category-manager.css']
})

export class CategoryManagerComponent implements OnInit {

  newCategory = '';
  categories: Category[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.categories$.subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    if (!this.newCategory) return;

    this.expenseService.addCategory({
      id: uuidv4(),
      name: this.newCategory,
      color: this.generateColor()
    });

    this.newCategory = '';
  }

  generateColor(): string {
    const colors = [
      '#4caf50',
      '#f44336',
      '#2196f3',
      '#ff9800',
      '#9c27b0',
      '#00bcd4'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

}