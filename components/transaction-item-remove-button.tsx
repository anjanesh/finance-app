import { deleteTransaction } from "@/lib/actions";
import Button from "./button";
import { X, Loader } from 'lucide-react';
import React from "react";

export default function TransactionItemRemoveButton({ id, onRemoved }: { id: string, onRemoved:() => void })
{
    const [loading, setLoading] = React.useState<boolean>();
    const [confirmed, setConfirmed] = React.useState<boolean>();
    const handleClick = async () => {
        if (!confirmed)
        {
            setConfirmed(true);
            return;
        }
        try
        {
            setLoading(true);
            await deleteTransaction(id);
            onRemoved(); // notify the parent
        }
        finally
        {
            setLoading(false);
        }
    }
    return <Button size="xs" variant={!confirmed ? 'ghost' : 'danger'} onClick={handleClick} aria-disabled={loading}>
        {!loading && <X className="w-4 h-4" />}
        {loading && <Loader className="w-4 h-4 animate-spin" />}
    </Button>
}