import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { ExpenseService } from '../../services/expense.service';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../../models/expense.model';
import { Category } from '../../models/category.model';

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // 🔹 Mock reactive streams
  const mockExpenses$ = new BehaviorSubject<Expense[]>([]);
  const mockCategories$ = new BehaviorSubject<Category[]>([
    { id: '1', name: 'Food', color: '#4caf50' }
  ]);

  // 🔹 Mock service (NO jasmine spy to avoid type issues)
  const mockExpenseService = {
    expenses$: mockExpenses$.asObservable(),
    categories$: mockCategories$.asObservable(),
    addExpense: () => {}
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ExpenseService, useValue: mockExpenseService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with zero total', () => {
    expect(component.totalAmount).toBe(0);
  });

  it('should update total when expense is emitted', () => {

    mockExpenses$.next([
      {
        id: '1',
        title: 'Lunch',
        amount: 500,
        category: 'Food',
        date: new Date()
      }
    ]);

    fixture.detectChanges();

    expect(component.totalAmount).toBe(500);
  });

  it('should toggle modal visibility', () => {

    expect(component.showModal).toBe(false);

    component.toggleModal();
    expect(component.showModal).toBe(true);

    component.toggleModal();
    expect(component.showModal).toBe(false);

  });

});