'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React from 'react';
import { useCurrentUser } from '../api/use-current-user';
import { Loader, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthActions } from '@convex-dev/auth/react';

const UserButton = () => {
    const { data, isLoading } = useCurrentUser();
    const { signOut } = useAuthActions();

    if (isLoading) {
        return <Loader className='size-4 animate-spin text-muted-foreground' />;
    }

    if (!data) return null;

    const { name, email, image } = data;

    const avatarFallback = name?.charAt(0)!.toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='h-10 w-10 hover:opacity-75 transition'>
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback className='bg-sky-500 text-white'>{avatarFallback}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' side='right' className='w-60'>
                <DropdownMenuItem>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className='h-10'>
                    <LogOut className='size-4 mr-2' />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
