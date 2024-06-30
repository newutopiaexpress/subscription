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
import { Separator } from '../Separator/Separator';

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


            <Separator orientation="vertical" className="h-9 mx-auto bg-stone-800 opacity-25 mb-6 mt"/>

            <div className="relative w-36 h-36 mx-auto">

                <div className="animate-bounce z-20 absolute top-0 right-0 bg-lime-400 rounded-full w-7 h-7 mx-auto content-center shadow-xl">
                  <HeartIcon/>
                </div>

                <div className="transition-all z-10 absolute rounded-[50px] w-36 h-36 hover:shadow-lg shadow-stone-800/90 ring-2 ring-lime-300/0 hover:ring-lime-300/60 text-center content-center text-stone-100 text-xl bg-stone-800 bg-gradient-to-b from-stone-100/10 from-10% via-stone-800 via-30% to-stone-900 to-90%">
                  <PhoneIcon/>
                </div>

                <div className="animate-pulse z-0 blur-xl absolute rounded-full w-40 h-40 bg-stone-800 bg-gradient-to-b from-lime-400/100 from-10% via-rose-400 via-30% to-sky-300 to-90%">
                </div>
            </div>

            <Separator orientation="vertical" className="h-9 mx-auto bg-stone-800 opacity-25 mb-6 mt-6"/>
   

            <div className="md:w-2/3 grid grid-cols-3 gap-12 mx-auto pt-16 pb-16">

                <div className="col-span-1 text-center bg-stone-100 rounded-xl p-6 shadow-lg">
                  <Image 
                  className="rounded-full w-24 h-24 mx-auto"
                  src="/pro1.png" 
                  alt="Pricing"
                  width={200} height={200} />
                  <span className="font-extrabold tracking-tight text-xl">
                    <span className="font-normal tracking-tight text-xl">Lucy, </span>
                    English Tutor
                  </span> <br/>
                  <span className="text-sm leading-3">Increase your efficiency, self-confidence, improve your general well-being.</span>
                </div>

                <div className="col-span-1 text-center relative bg-stone-100 rounded-xl p-6 shadow-lg">
                  <span className="absolute top-0 right-0 bg-stone-800 text-stone-100 px-2 py-1 rounded-full">New</span>
                  <Image 
                  className="rounded-full w-24 h-24 mx-auto"
                  src="/kontotamas2.png" 
                  alt="Pricing"
                  width={400} height={400} />
                  <span className="font-extrabold tracking-tight text-xl">Motivational Coach</span><br/>
                  <span className="text-sm leading-3">Increase your efficiency, self-confidence, improve your general well-being.</span>
                </div>

                <div className="col-span-1 text-center text-stone-700 bg-stone-100 rounded-xl p-6 shadow-lg">
                  <Image 
                  className="rounded-full w-24 h-24 mx-auto"
                  src="/5.png" 
                  alt="Pricing"
                  width={1024} height={1280} />
                  <span className="font-extrabold tracking-tight text-xl">Smart Home OS</span><br/>
                  <span className="text-sm leading-3">Control your smart home devices with natural voice. *In development</span>
                </div>

            </div>

                <div id="Pricing" className="relative self-center bg-white rounded-full p-0.5 flex sm:mt-8 border border-stone-100 shadow-lg">
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



function PhoneIcon() {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-16 h-16 mx-auto shadow-inner">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>

  );
}

function HeartIcon() {
  return (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-stone-100 w-4 h-4 mx-auto content-center">
  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
</svg>

  );
}



