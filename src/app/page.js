'use client'

import { useState, useEffect } from 'react';
import ExodusGame from '../components/ExodusGame'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="w-full max-w-7xl">
        <ExodusGame />
      </div>
    </main>
  )
}