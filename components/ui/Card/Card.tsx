import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto ">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-stone-600">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md  bg-stone-200/50 text-stone-600">
          {footer}
        </div>
      )}
    </div>
  );
}
