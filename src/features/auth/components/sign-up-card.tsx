import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { SignInFlow } from '../types/types';
import { TriangleAlert, Eye, EyeOff } from 'lucide-react'; // Icons for show/hide password
import { useAuthActions } from '@convex-dev/auth/react';
import { validatePassword } from '../../../lib/utils/password-validator';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState(""); // State for name input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const onProviderSignUp = (value: 'github' | 'google') => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const validatePasswordMessage = validatePassword(password);

    if (validatePasswordMessage) {
      setError(validatePasswordMessage);
      return;
    }

    setPending(true);
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch((error) => {
        console.log(456, error);
        setError('User already exists');
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className='h-full w-full' style={{ padding: '20px' }}>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      {error && (
        <div className='bg-destructive/15 rounded-md p-3 flex items-center gap-x-2 text-destructive'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onPasswordSignUp} className='space-y-2.5'>
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Full Name'
            type='text'
            required
          />
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <div className='relative'>
            <Input
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
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
          <div className='relative'>
            <Input
              disabled={pending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm Password'
              type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
              required
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-2 top-1/2 transform -translate-y-1/2'
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button type='submit' className='w-full ' size='lg' disabled={pending}>
            Sign up to continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp('google')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <FcGoogle className='size-5 absolute top-3 left-2.5' />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp('github')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <BsGithub className='size-5 absolute top-3 left-2.5' />
            Continue with Github
          </Button>
          <p className='text-xs text-muted-foreground'>
            Already have an account?{' '}
            <span onClick={() => setState('signIn')} className='text-sky-700 hover:underline cursor-pointer'>
              Sign in
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
