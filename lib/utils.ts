// Defining the keys as a union type for strict type checking
export type TransactionType = 'Income' | 'Expense' | 'Saving' | 'Investment';

export interface Transaction
{
    id: string; // Added ID for the map key
    type: TransactionType,
    category?: string,
    description: string,
    amount: number,
    created_at: string;
}

// Define the shape of each date group
export interface TransactionGroup
{
    transactions: Transaction[];
    amount: number;
}

// The final object is a dictionary where the key is a date string
export type GroupedTransactions = Record<string, TransactionGroup>;

export const groupAndSumTransactionsByDate = (transactions: Transaction[]) =>
{
    const grouped: GroupedTransactions = {};

    for (const transaction of transactions)
    {
        const date: string = transaction.created_at.split('T')[0]
        if (!grouped[date])
        {
            grouped[date] = {transactions: [], amount: 0}
        }
        grouped[date].transactions.push(transaction);
        const amount = transaction.type === 'Expense' ? -transaction.amount : transaction.amount;
        grouped[date].amount += amount;
    }

    return grouped;
}