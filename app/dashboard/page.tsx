import { Suspense } from "react";
import TransactionListFallback from "./components/transaction-list-fallback";
import Trend from "./components/trend"
import TrendFallback from "@/app/dashboard/components/trend-fallback";
import Link from 'next/link';
import {PlusCircle} from 'lucide-react';
import { sizes, variants } from "@/lib/variants";
import { createClient } from "@/lib/supabase/server";
import { ErrorBoundary } from "react-error-boundary";
import { types } from "@/lib/consts";
import Range from "@/app/dashboard/components/range";
import { TrendRange } from '@/types/trends';
import TransactionListWrapper from "./components/transaction-list-wrapper";

export default async function Page({ searchParams }: { searchParams: Promise<{ range?: string }> })
{
    // Await the searchParams object
    const params = await searchParams;

    // 2. Narrow the type and provide a fallback
    // We cast it 'as TrendRange' but only after ensuring we have a safe default
    const range = (params.range as TrendRange) || 'last30days';

    const supabase = await createClient();
    console.log(await supabase.auth.getUser());

    // 1. Await the client creation
    const client = await createClient();

    // 2. Now 'from' will be recognized correctly
    const { data, error } = await client.from('transactions').select();

    // console.log("data =", data);

    return (
        <div className="space-y-8">
            <section className="flex justify-between items-center">
                <h1 className="text-4xl font-semibold">Summary</h1>
                <aside>
                    <Range />
                </aside>
            </section>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {types.map(type => <ErrorBoundary key={type} fallback={<div className="text-red-500">Cannot fetch {type} trend data</div>}>
                    <Suspense fallback={<TrendFallback />}>
                        <Trend type={type} range={range}/>
                    </Suspense>
                </ErrorBoundary>)}
            </section>

            <section className="flex justify-between items-center">
                <h2 className="text-2xl">Transactions</h2>
                <Link href="/dashboard/transaction/add" className={`flex items-center space-x-1 ${variants['outline']} ${sizes['sm']}`}>
                    <PlusCircle className="w-4 h-4" />
                    <div>Add</div>
                </Link>
            </section>

            <Suspense fallback={<TransactionListFallback />}>
                <TransactionListWrapper range={range}/>
            </Suspense>
        </div>
    )
}