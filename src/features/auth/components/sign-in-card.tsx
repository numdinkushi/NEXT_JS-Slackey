import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { SignInFlow } from '../types/types';
import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn,  } = useAuthActions();

    const handleProviderSignIn = (value: 'github' | 'google') => {
        signIn(value);
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(3434, email, password);

    return (
        <Card className='h-full w-full' style={{ padding: '20px' }}>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Login to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5 px-0 pb-0'>
                <form className='space-y-2.5'>
                    <Input
                        disabled={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='email'
                        type='email'
                        required
                    />
                    <Input
                        disabled={false}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='password'
                        type='password'
                        required
                    />
                    <Button type='submit' className='w-full ' size='lg' disabled={false}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={false}
                        onClick={() => { }}
                        variant='outline'
                        size='lg'
                        className='w-full relative'
                    >
                        <FcGoogle className='size-5 absolute top-3 left-2.5' />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={false}
                        onClick={() => handleProviderSignIn('github')}
                        variant='outline'
                        size='lg'
                        className='w-full relative'
                    >
                        <BsGithub className='size-5 absolute top-3 left-2.5' />
                        Continue with Github
                    </Button>
                    <p className='text-xs text-muted-foreground'>
                        Don&apos;t have an account? <span onClick={() => setState('signUp')} className='text-sky-700 hover:underline cursor-pointer'>Sign up</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SignInCard;