import type {Metadata} from "next";
import TransactionForm from "@/app/dashboard/components/transaction-form";

export const metadata: Metadata = {
    title: "Add a transaction",
};

export default function Page()
{
    return <>
        <h1 className="text-4xl font-semibold mb-8">Add Transaction</h1>
        <TransactionForm />
    </>
}