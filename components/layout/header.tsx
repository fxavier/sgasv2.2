'use client';

import { Bell, MessageSquare, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
//import { useUser, UserButton } from '@clerk/nextjs';

export function Header() {
  // const { user, isSignedIn } = useUser();
  return (
    <header className='border-b bg-white'>
      <div className='flex h-16 items-center px-8 gap-6 justify-end'>
        <nav className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' className='relative'>
            <Bell className='h-5 w-5' />
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500' />
          </Button>
          <Button variant='ghost' size='icon' className='relative'>
            <MessageSquare className='h-5 w-5' />
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500' />
          </Button>
          <Button variant='ghost' size='icon'>
            <Users className='h-5 w-5' />
          </Button>
        </nav>
      </div>
    </header>
  );
}
