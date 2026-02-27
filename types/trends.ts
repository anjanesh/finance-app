export type TTransactions = 'Income' | 'Expense' | 'Investment' | 'Saving';
export type TIncome = 'Salary' | 'Investment' | 'Editing' | 'Other';

export type TExpenses =
    | 'Groceries'
    | 'Transport'
    | 'Housing'
    | 'Entertainment'
    | 'Restaurant'
    | 'Health'
    | 'Education'
    | 'Utilities'
    | 'Other';

export type TInvestments = 'Stocks' | 'Bonds' | 'Property' | 'Other';

export type TSavings = 'Emergency' | 'Retirement' | 'Other';

export type TCategories = TIncome | TExpenses | TInvestments | TSavings;

export interface ITransactionItem {
    id?: string;
    type: TTransactions;
    category?: TCategories;
    description: string;
    amount: number;
    created_at: string;
}

export interface TTrends {
    type: TTransactions;
    amount: number;
    prevAmount: number;
}

export type TrendRange = 'last24hours' | 'last7days' | 'last30days' | 'last12months';