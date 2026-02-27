import BaseTrend from "@/components/trend"
import { TTransactions, TrendRange } from '@/types/trends';
import { createClient } from "@/lib/supabase/server"

export default async function Trend({type, range}: { type: TTransactions, range: TrendRange })
{
    /*
    const response = await fetch(`${process.env.API_URL}/trends/${type}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const {amount, prevAmount} = await response.json();
    */

    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('calculate_total', {
            range_arg: range,
            type_arg: type
        })
    if (error) throw new Error("Could not fetch the trend data")
    else console.log(data);

    const amounts = data[0];

    return <BaseTrend type={type} amount={amounts.current_amount} prevAmount={amounts.previous_amount} />
}