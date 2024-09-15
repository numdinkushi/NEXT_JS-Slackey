'use client';
import AuthScreen from '@/features/auth/components/auth-screen';
import React, { useEffect, useState } from 'react';

const AuthPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthScreen />
  );
};

export default AuthPage;