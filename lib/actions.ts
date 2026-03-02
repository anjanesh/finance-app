'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import { createClient } from './supabase/server';
import { TransactionFormValues } from '@/lib/validation'; // Import your inferred type
import { transactionSchema } from './validation';
import {TrendRange} from "@/types/trends";
import { redirect } from 'next/navigation';

export async function purgeTransactionListCache()
{
    revalidateTag('transaction-list', '');
}

export async function createTransaction(formData: TransactionFormValues)
{
    const validated = transactionSchema.safeParse(formData);
    if (!validated.success)
    {
        throw new Error('Invalid data')
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from('transactions')
        .insert(formData);

    if (error) {
        console.error("Supabase Error:", error.message);
    }

    revalidatePath('/dashboard');
}

export async function fetchTransactions(range: TrendRange, offset = 0, limit = 10)
{
    const supabase = await createClient();
    let { data, error } = await supabase
        .rpc('fetch_transactions', {
            limit_arg: limit,
            offset_arg: offset,
            range_arg: range
        })
    if (error) throw new Error("We can't fetch transactions")
    return data;
}

export async function deleteTransaction(id: string)
{
    const supabase = await createClient();
    const {error} = await supabase.from('transactions')
        .delete()
        .eq('id', id)
    if (error) throw new Error(`Could not delete the transaction ${id}`)
    revalidatePath('/dashboard')
}

export async function updateTransaction(id: string, formData: TransactionFormValues)
{
    const validated = transactionSchema.safeParse(formData)
    if (!validated.success) {
        throw new Error('Invalid data')
    }

    const supabase = await createClient();

    const { error } = await supabase.from('transactions')
        .update(formData)
        .eq('id', id)

    if (error) {
        throw new Error('Failed creating the transaction')
    }

    revalidatePath('/dashboard')
}

// Define the shape of your response
export type FormState =
{
    message: string;
    error?: boolean; // Optional because success might not have an error property
}

export async function login(prevState: FormState, formData: FormData)
{
    const supabase = await createClient();
    const email = formData.get('email')
    const {error} = supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true
        }
    })
    if (error)
    {
        return {
            error: true,
            message: 'Error authenticating!'
        }
    }

    return {
        message: `Email sent to ${email}`,
    }
}

export async function signOut()
{
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    redirect('/login');
}