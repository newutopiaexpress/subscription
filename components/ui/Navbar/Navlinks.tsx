'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';
import { UtopiaLogo } from "@/components/ui/utopia-logo";

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div className="relative flex flex-row justify-between py-4 font-thin align-center md:py-6 bg-transparent text-xs uppercase tracking-wider">
      <div className="flex items-center flex-1 bg-transparent">
        <Link href="#Pricing" className="z-100" aria-label="Logo">
          <UtopiaLogo/>
        </Link>
        <nav className="ml-9 space-x-9 lg:block">
          <Link href="#Pricing" className={s.link}>
            Pricing
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center flex-1 bg-transparent text-center mx-auto">
        <nav className="space-x-9 lg:block">
          {user && (
          <Link href="/" className={s.link}>
            English Tutor
          </Link>
           )}
          {user && (
            <Link href="/account" className={s.link}>
              Mental Health
            </Link>
          )}
          {user && (
            <Link href="/account" className={s.link}>
              Motivational Coach
            </Link>
          )}
        </nav>
      </div>

      <div className="flex justify-end space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className="uppercase">
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
