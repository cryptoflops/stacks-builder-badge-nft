
'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { Connect } from '@stacks/connect-react';
import { AuthOptions } from '@stacks/connect';
import { userSession } from '@/lib/stacks-session';

const authOptions = {
    appDetails: {
        name: 'Builder Badge',
        icon: 'https://www.stacks.co/logo-stacks.svg',
    },
    onFinish: () => {
        window.location.reload();
    },
    userSession: userSession as any,
};

export function StacksProvider({ children }: { children: ReactNode }) {
    return (
        <Connect authOptions={authOptions}>
            {children}
        </Connect>
    );
}
