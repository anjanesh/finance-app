import TransactionForm from "@/app/dashboard/components/transaction-form";
import { createClient } from "@/lib/supabase/server"
import {TrendRange} from "@/types/trends";
import { notFound } from 'next/navigation';

export const metadata = {
    title: "Edit Transaction"
}

export default async function Page({ params }: { params: Promise<{ id: string }> })
{
    const resolvedParams = await params;
    const id: string = resolvedParams.id;
    console.log("id = ", id);

    const supabase = await createClient();
    const { data: transaction, error } = await supabase.
    from('transactions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) notFound();

    return <>
        <h1 className="text-4xl font-semibold mb-8">Edit Transaction</h1>
        <TransactionForm initialData={transaction} />
    </>
}