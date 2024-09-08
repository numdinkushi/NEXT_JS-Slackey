import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { SignInFlow } from '../types/types';
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert, Eye, EyeOff } from "lucide-react"; // Icons for show/hide password

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPending(true);
        signIn('password', { email, password, flow: 'signIn' })
            .catch(() => {
                setError('Invalid email or password');
            })
            .finally(() => {
                setPending(false);
            });
    };

    const onProviderSignIn = (value: 'github' | 'google') => {
        setPending(true);
        signIn(value).finally(() => setPending(false));
    };

    return (
        <Card className='h-full w-full' style={{ padding: '20px' }}>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>Login to continue</CardTitle>
                <CardDescription>Use your email or another service to continue</CardDescription>
            </CardHeader>
            {error && (
                <div className='bg-destructive/15 rounded-md p-3 flex items-center gap-x-2 text-destructive'>
                    <TriangleAlert className='size-4' />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className='space-y-5 px-0 pb-0'>
                <form onSubmit={onPasswordSignIn} className='space-y-2.5'>
                    <Input
                        disabled={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='email'
                        type='email'
                        required
                    />
                    <div className='relative'>
                        <Input
                            disabled={pending}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='password'
                            type={showPassword ? 'text' : 'password'} // Toggle visibility
                            required
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-2 top-1/2 transform -translate-y-1/2'
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button
                        type='submit'
                        className='w-full'
                        size='lg'
                        disabled={pending}
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={pending}
                        onClick={() => onProviderSignIn('google')}
                        variant='outline'
                        size='lg'
                        className='w-full relative'
                    >
                        <FcGoogle className='size-5 absolute top-3 left-2.5' />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={pending}
                        onClick={() => onProviderSignIn('github')}
                        variant='outline'
                        size='lg'
                        className='w-full relative'
                    >
                        <BsGithub className='size-5 absolute top-3 left-2.5' />
                        Continue with Github
                    </Button>
                    <p className='text-xs text-muted-foreground'>
                        Don&apos;t have an account?{' '}
                        <span onClick={() => setState('signUp')} className='text-sky-700 hover:underline cursor-pointer'>
                            Sign up
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SignInCard;
