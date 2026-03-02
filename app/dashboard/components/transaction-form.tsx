'use client';

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import Select from "@/components/select";
import { categories, types } from "@/lib/consts";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState, useEffect, JSX} from "react";
import { useRouter } from "next/navigation"
import {createTransaction, updateTransaction, purgeTransactionListCache} from "@/lib/actions";
import FormError from "@/components/form-error";
import { transactionSchema, TransactionFormValues } from "@/lib/validation";
import {ITransactionItem, TTransactions} from "@/types/trends";

export default function TransactionForm({initialData}: {initialData?: ITransactionItem}): JSX.Element
{
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TransactionFormValues>(
        {
            mode: "onTouched",
            resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
            defaultValues: initialData ?? {
                type: 'Expense',
                amount: 0,
                description: '',
                created_at: new Date().toISOString().split('T')[0]
            }
        });

    const router = useRouter();
    const [isSaving, setSaving] = useState(false);
    const [lastError, setLastError] = useState<Error | null>(null);
    const type = watch("type") as TTransactions;
    const editing = Boolean(initialData);

    const onSubmit = async (data: TransactionFormValues) =>
    {
        setSaving(true);
        setLastError(null);

        try
        {
            /*
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    created_at: `${data.created_at}T00:00:00`
                })
            });

            await purgeTransactionListCache();
            */

            await createTransaction(data);
            if (editing && initialData?.id)
            {
                // Edit action
                await updateTransaction(initialData.id, data);
            }
            else
            {
                await createTransaction(data)
            }
            router.push('/dashboard')
        }
        catch (error)
        {
            setLastError(error instanceof Error ? error : new Error('An unknown error occurred'));
        }
        finally
        {
            setSaving(false);
        }
    }

    return <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label className="mb-1">Type</Label>
                <Select {...register("type", {
                    onChange: (e) =>
                    {
                        if (e.target.value !== "Expense")
                        {
                            setValue("category", undefined);
                        }
                    }
                })}>
                    {types.map(type => <option key={type}>{type}</option>)}
                </Select>
                <FormError error={errors.type} />
            </div>

            <div>
                <Label className="mb-1">Category</Label>
                <Select {...register("category")} disabled={type !== 'Expense'}>
                    <option value="">Select a category</option>
                    {categories.map(category => <option key={category}>{category}</option>)}
                </Select>
                <FormError error={errors.category} />
            </div>

            <div>
                <Label className="mb-1">Date</Label>
                <Input type="date" {...register("created_at")} disabled={editing}/>
                <FormError error={errors.created_at} />
            </div>

            <div>
                <Label className="mb-1">Amount</Label>
                <Input type="number" {...register("amount")} />
                <FormError error={errors.amount} />
            </div>

            <div className="col-span-1 md:col-span-2">
                <Label className="mb-1">Description</Label>
                <Input {...register("description")} />
                <FormError error={errors.description} />
            </div>
        </div>

        <div className="flex justify-between items-center">
            <div>
                {lastError && <FormError error={{ type: 'server', message: lastError.message }} />}
            </div>
            <Button type="submit" disabled={isSaving}>Save</Button>
        </div>
    </form>
}