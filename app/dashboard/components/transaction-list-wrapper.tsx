import { fetchTransactions } from "@/lib/actions"
import TransactionList from "./transaction-list"
import {TrendRange} from "@/types/trends";

export default async function TransactionListWrapper({ range }: { range: TrendRange })
{
    const transactions = await fetchTransactions(range);
    return <TransactionList initialTransactions={transactions} key={range} range={range} />
}