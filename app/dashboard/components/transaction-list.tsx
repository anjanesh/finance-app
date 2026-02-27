'use client';

import Button from "@/components/button";
import TransactionItem from "@/components/transaction-item";
import TransactionSummaryItem from "@/components/transaction-summary-item";
import {GroupedTransactions, groupAndSumTransactionsByDate, Transaction} from "@/lib/utils";
import {TrendRange, TTransactions} from "@/types/trends";
import React from "react";
import { fetchTransactions } from "@/lib/actions"
import { MouseEvent } from 'react'; // 1. Import the type
import { Loader } from "lucide-react";

export default function TransactionList({ range, initialTransactions }: { range: TrendRange, initialTransactions: Transaction[] })
{
    /*
    const supabase = await createClient();
    const { data: transactions, error } = await supabase
        .rpc('fetch_transactions', {
            // limit_arg,
            // offset_arg,
            range_arg: range
            // .from('transactions')
            // .select('*')
            // .order('created_at', { ascending: false });
        });
    if (error) throw new Error("We can't fetch transactions");
    */

    /*
    const response = await fetch(`${process.env.API_URL}/transactions`,
        {
            next:
                {
                    tags: ['transaction-list']
                }
        });
    const transactions: Transaction[] = await response.json();
    if (!Array.isArray(transactions)) return <p>No transactions found.</p>;
    */

    const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
    // const [offset, setOffset] = React.useState(initialTransactions.length);
    const [buttonHidden, setButtonHidden] = React.useState(initialTransactions.length === 0);
    const [loading, setLoading] = React.useState(false);
    const grouped:GroupedTransactions = groupAndSumTransactionsByDate(transactions ?? []);

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) =>
    {
        setLoading(true);
        let nextTransactions: Transaction[] | null = null;
        try
        {
            // nextTransactions = await fetchTransactions(range, offset, 10);
            nextTransactions = await fetchTransactions(range, transactions.length, 10);
            if (nextTransactions)
            {
                setButtonHidden(nextTransactions.length === 0);
                // setOffset(prevValue => prevValue + 10)
                setTransactions(prevTransactions => [
                    ...prevTransactions,
                    ...nextTransactions! // The '!' tells TS it won't be null her
                ]);
            }
        }
        catch (error)
        {
            console.error("Failed to load more:", error);
        }
        finally
        {
            setLoading(false);
        }
    }

    const handleRemoved = (id: string) => () =>
    {
        setTransactions(prev => [...prev].filter(t => t.id !== id))
    }

    return (
        <div className="space-y-8">
            {Object.entries(grouped)
                .map(([date, { transactions, amount }]) =>
                    <div key={date}>
                        <TransactionSummaryItem date={date} amount={amount} />
                        <hr className="my-4 border-gray-200 dark:border-gray-800" />
                        <section className="space-y-4">
                            {transactions.map(transaction => <div key={transaction.id}>
                                <TransactionItem {...transaction} onRemoved={handleRemoved(transaction.id)}/>
                            </div>)}
                        </section>
                    </div>
                )
            }
            {transactions.length === 0 && <div className="text-center text-gray-400 dark:text-gray-500">No transactions found</div>}
            {!buttonHidden && <div className="flex justify-center">
                <Button variant="ghost" onClick={handleClick} disabled={loading}>
                    <div className="flex items-center space-x-1">
                        {loading && <Loader className="animate-spin" />}
                        <div>Load More</div>
                    </div>
                </Button>
            </div>}
        </div>
    )
}