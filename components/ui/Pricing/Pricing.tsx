'use client';

import { Button } from '../Button/Button';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/password_signin');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-white">
        <div className="w-full px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>

      </section>
    );
  } else {
    return (
      <section className="bg-transparent text-stone-800">
        <div className="w-full px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-stone-800 sm:text-center sm:text-6xl tracking-tighter">
            Empathic Voice Assistants 
            </h1>
            <p className="max-w-2xl m-auto mt-6 mb-9 text-xl text-stone-600 sm:text-center sm:text-2xl">
              AI voice that responds empathically. Built with Hume.ai align technology for human well-being.
            </p>

            <div className="md:w-2/3 grid grid-cols-3 gap-12 mx-auto pt-16 pb-16">

                <div className="col-span-1 text-center">
                  <Image 
                  className="rounded-full w-32 h-32 mx-auto"
                  src="/pro1.png" 
                  alt="Pricing"
                  width={200} height={200} />
                  <span className="font-thin tracking-tight text-xl">Lucy</span><br/>
                  <span className="font-extrabold tracking-tight text-xl">English Tutor</span><br/>
                  <span className="text-sm leading-3">Increase your efficiency, self-confidence, improve your general well-being.</span>
                </div>

                <div className="col-span-1 text-center relative">
                  <span className="absolute top-0 right-0 bg-stone-800 text-stone-100 px-2 py-1 rounded-full">New</span>
                  <Image 
                  className="rounded-full w-32 h-32 mx-auto"
                  src="/kontotamas2.png" 
                  alt="Pricing"
                  width={400} height={400} />
                  <span className="font-extrabold tracking-tight text-xl">Motivational Coach</span><br/>
                  <span className="text-sm leading-3">Increase your efficiency, self-confidence, improve your general well-being.</span>
                </div>

                <div className="col-span-1 text-center text-stone-700">
                  <Image 
                  className="rounded-full w-32 h-32 mx-auto"
                  src="/5.png" 
                  alt="Pricing"
                  width={1024} height={1280} />
                  <span className="font-extrabold tracking-tight text-xl">Smart Home OS</span><br/>
                  <span className="text-sm leading-3">Control your smart home devices with natural voice. *In development</span>
                </div>

            </div>

            <div className="relative self-center mt-6 bg-white rounded-full p-0.5 flex sm:mt-8 border border-stone-100 shadow-lg">
              {intervals.includes('month') && (
                <button
                  onClick={() => setBillingInterval('month')}
                  type="button"
                  className={`${
                    billingInterval === 'month'
                      ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-xl text-stone-100'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-stone-100'
                  } rounded-full m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly billing
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => setBillingInterval('year')}
                  type="button"
                  className={`${
                    billingInterval === 'year'
                      ? 'relative w-1/2 bg-stone-800 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-stone-500'
                  } rounded-full m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly billing
                </button>
              )}
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {products.map((product) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval
              );
              if (!price) return null;
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 100);
              return (
                <div
                  key={product.id}
                  className={cn(
                    'flex flex-col rounded-lg shadow-xl divide-y divide-zinc-100 bg-stone-100 text-stone-800',
                    {
                      'border border-pink-500': subscription
                        ? product.name === subscription?.prices?.products?.name
                        : product.name === 'Freelancer'
                    },
                    'flex-1', // This makes the flex item grow to fill the space
                    'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                    'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                  )}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold leading-6 text-stone-800">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-stone-600 text-sm">{product.description}</p>
                    <p className="mt-8">
                      <span className="text-5xl font-extrabold white">
                        {priceString}
                      </span>
                      <span className="text-base font-medium text-stone-700">
                        /{billingInterval}
                      </span>
                    </p>
                    <Button
                      type="button"
                      onClick={() => handleStripeCheckout(price)}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-full hover:bg-zinc-900"
                    >
                      {subscription ? 'Manage' : 'Subscribe'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    );
  }
}
