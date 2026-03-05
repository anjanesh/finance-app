'use client';

import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import DateRangeSelect from "@/components/date-range-select";
import Input from "@/components/input";
import Label from "@/components/label";
import SubmitButton from "@/components/submit-button"
import { updateSettings } from "@/lib/actions"
import React from "react";
import {User} from "@supabase/auth-js";
import FormError from "@/components/form-error";

const initialState = {
    message: '',
    error: false,
    errors: {},
}

// 1. Define exactly what fields are in 'defaults'
export interface UserSettings
{
    avatar?: string
    email?: string
    email_verified?: string,
    phone_verified?: string,
    sub?: string,
    fullName?: string,
    defaultView?: string,
    // Add other fields you expect from Supabase
}

export default function SettingsForm({ defaults }: { defaults: UserSettings | undefined })
{
    console.log("defaults on settings-form", defaults);

    const [state, formAction] = React.useActionState(updateSettings, initialState);

    return (
        <form className="space-y-4" action={formAction}>
            {state?.error && (
                <AlertError>{state?.message}</AlertError>
            )}
            {!state?.error && state?.message?.length > 0 && (
                <AlertSuccess>{state?.message}</AlertSuccess>
            )}

            <Label htmlFor="fullName">User full name</Label>
            <Input type="text" name="fullName" id="fullName" placeholder="User full name" defaultValue={defaults?.fullName} />
            {state.errors && state?.errors['fullName']?.map(error=> <FormError key={`fullName-${error}`} error={error} />)}

            <Label htmlFor="defaultView">Default transactions view</Label>
            <DateRangeSelect name="defaultView" id="defaultView" defaultValue={defaults?.defaultView} />
            {state.errors && state?.errors['defaultView']?.map(error=> <FormError key={`defaultView-${error}`} error={error} />)}

            <SubmitButton>Update Settings</SubmitButton>
        </form>
    );
}