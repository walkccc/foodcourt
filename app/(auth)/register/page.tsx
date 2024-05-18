import Link from 'next/link';

import { Icons } from '@/components/icons';
import { UserAuthForm } from '@/components/user-auth-form';

export default function RegisterPage() {
  return (
    <div className="grid h-screen w-screen grid-cols-2 flex-col items-center justify-center">
      <Link
        href="/login"
        className="absolute right-8 top-8 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-3 py-2  text-center text-sm font-medium text-slate-900 hover:border-slate-100 hover:bg-slate-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-slate-700"
      >
        Login
      </Link>
      <div className="h-full bg-slate-100" />
      <div className="p-8">
        <div className="mx-auto flex w-[350px] flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-bold">Create an account</h1>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-slate-500">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="hover:text-brand underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-brand underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
