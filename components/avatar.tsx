import { createClient } from "@/lib/supabase/server";
import { CircleUser } from 'lucide-react';
import Image from 'next/image';

export default async function Avatar({ width = 32, height = 32 }: { width?: number; height?: number })
{
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Check if user exists and has an avatar filename in metadata
    const avatarPath = user?.user_metadata?.avatar;
    if (!avatarPath)
    {
        return <CircleUser className="w-6 h-6" />;
    }

    const { data: imageData, error } = await supabase.storage
        .from('avatars')
        .createSignedUrl(user.user_metadata?.avatar, 60 * 5)

    if (error || !imageData?.signedUrl)
    {
        return <CircleUser className="w-6 h-6" />
    }

    return <Image src={imageData.signedUrl} width={width} height={height} alt="User avatar" className="rounded-full" />
}