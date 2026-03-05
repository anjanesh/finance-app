'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import { createClient } from './supabase/server';
import {settingsSchema, TransactionFormValues} from '@/lib/validation'; // Import your inferred type
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

export async function uploadAvatar(prevState: FormState, formData: FormData)
{
    const supabase = await createClient();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0)
    {
        return {
            error: true,
            message: 'No file provided'
        }
    }

    const fileExt = file.name.split('.').pop();
    // const fileName = `${Math.random()}.${fileExt}`;

    // Result example: "550e8400-e29b-41d4-a716-446655440000.png"
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const {error} = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

    if (error)
    {
        return {
            error: true,
            message: 'Error uploading avatar'
        }
    }

    // Removing the old file
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError)
    {
        return {
            error: true,
            message: 'Something went wrong, try again'
        }
    }

    const avatar = userData.user.user_metadata.avatar
    if (avatar)
    {
        const { error } = await supabase.storage
            .from('avatars')
            .remove([avatar])

        if (error) {
            return {
                error: true,
                message: 'Something went wrong, try again'
            }
        }
    }

    const { error: dataUpdateError } = await supabase.auth
        .updateUser({
            data: {
                avatar: fileName
            }
        });

    if (dataUpdateError)
    {
        return {
            error: true,
            message: 'Error associating the avatar with the user'
        }
    }

    return { message: 'Updated the user avatar' }
}

export async function updateSettings(prevState: FormState, formData: FormData)
{
    const validated = settingsSchema.safeParse({
        fullName: formData.get('fullName'),
        defaultView: formData.get('defaultView'),
    });

    if (!validated.success)
    {
        return {
            error: true,
            message: 'Error updating settings',
            errors: validated.error.flatten().fieldErrors
        }
    }


    const supabase = await createClient();
    const {error} = await supabase.auth
        .updateUser({
            data: {
                fullName: validated.data.fullName,
                defaultView: validated.data.defaultView,
            }
        })

    if (error)
    {
        return {
            error: true,
            message: 'Failed updating setting',
            errors: {}
        }
    }

    return {
        error: false,
        message: 'Updated user settings',
        errors: {}
    }
}