'use client';

import { Checkbox, CheckboxIndicator } from '@radix-ui/react-checkbox';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@radix-ui/react-dialog';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [dialogError, setDialogError] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const [cgvChecked, setCgvChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const [newsletterNotCheckedWarning, setNewsletterNotCheckedWarning] =
    useState(false);
  const [newsletterNotCheckedWarningCancel, setNewsletterNotCheckedWarningCancel] =
    useState(false);

  const [getMyFreeEbook, setGetMyFreeEbook] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    setTimeout(() => {
      setGetMyFreeEbook(true);
    }, 10000);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const password = formData.get('password') as string;

    if (!password) {
      setInlineError('Password is required');
      e.currentTarget.reset();
      return;
    }

    if (password.length > 4) {
      setInlineError('Password must be less than 4 characters');
      e.currentTarget.reset();
      return;
    }

    // if the password contain any other character than number
    if (!/^\d+$/.test(password)) {
      setInlineError('Password can only contain number');
      e.currentTarget.reset();
      return;
    }

    // if the password contain 4 different number
    if (new Set(password).size > 2) {
      setInlineError('Password must contain only 2 different number');
      e.currentTarget.reset();
      return;
    }

    const email = formData.get('email') as string;

    // check email
    if (!email) {
      setInlineError('Email is required');
      e.currentTarget.reset();
      return;
    }

    // check email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) {
      setInlineError('Email is not valid');
      e.currentTarget.reset();
      return;
    }

    // check email does not contain a +
    if (email?.includes('+')) {
      setInlineError('Email is not valid, it cannot contain a +');
      e.currentTarget.reset();
      return;
    }

    if (!cgvChecked) {
      setInlineError('You need to accept the conditions');
      e.currentTarget.reset();
      return;
    }

    if (!newsletterChecked) {
      setNewsletterNotCheckedWarning(true);
      return;
    }

    finish();
  };

  const finish = () => {
    const form = document.querySelector('form') as HTMLFormElement;

    const formData = new FormData(form);

    const queryParams = new URLSearchParams({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      newsletter: String(newsletterChecked),
      cgv: String(cgvChecked),
    });

    router.push(`/success?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <img src="/loading.gif" className="w-full max-w-xl h-auto" />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <main className="shadow-md p-4 w-full max-w-xl  border-2 border-gray-100 flex flex-col gap-2">
          <h1 className="text-4xl text-center font-bold">Register</h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <label className="text-gray-500 text-xs italic" htmlFor="newsletter">
                Accept to receive our newsletter
              </label>
              <Checkbox
                name="newsletter"
                id="newsletter"
                checked={newsletterChecked}
                className="w-4 h-4 bg-gray-200 border-2 border-gray-400"
                onCheckedChange={(checked) => {
                  const conditions = document.querySelector(
                    "input[name='conditions']"
                  ) as HTMLInputElement;

                  if (!checked) {
                    setNewsletterChecked(false);
                    return;
                  }

                  if (!conditions.checked) {
                    setDialogError({
                      title: 'You need to accept the conditions',
                      description:
                        'You need to accept the conditions to receive the newsletter',
                    });
                    return;
                  }

                  setNewsletterChecked(Boolean(checked));
                }}
              >
                <CheckboxIndicator className="text-green-800">
                  <CheckIcon
                    fontSize={20}
                    className="w-10 h-10 relative -left-3 -top-4"
                  />
                </CheckboxIndicator>
              </Checkbox>
            </div>
            <div className="flex items-center gap-1">
              <label className="text-gray-500 text-xs italic" htmlFor="conditions">
                Accept conditions
              </label>
              <Checkbox
                checked={cgvChecked}
                name="conditions"
                id="conditions"
                className="w-4 h-4 bg-gray-200 border-2 border-gray-400"
                onCheckedChange={(checked) => {
                  // verify that all field is filled or show an error and undo the checkbox

                  const name = document.querySelector(
                    "input[name='name']"
                  ) as HTMLInputElement;

                  const email = document.querySelector(
                    "input[name='email']"
                  ) as HTMLInputElement;

                  const password = document.querySelector(
                    "input[name='password']"
                  ) as HTMLInputElement;

                  if (!checked) {
                    setCgvChecked(false);
                    return;
                  }

                  if (!name.value || !email.value || !password.value) {
                    setDialogError({
                      title: 'You need to fill all the fields',
                      description:
                        'You need to fill all the fields to accept the conditions',
                    });
                    return;
                  }

                  setCgvChecked(Boolean(checked));
                }}
              >
                <CheckboxIndicator className="text-green-800">
                  <CheckIcon
                    fontSize={20}
                    className="w-10 h-10 relative -left-3 -top-4"
                  />
                </CheckboxIndicator>
              </Checkbox>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs italic" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                className="p-2 bg-gray-200 focus:outline-none text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs italic" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                id="email"
                name="email"
                className="p-2 bg-gray-200 focus:outline-none text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs italic" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                className="p-2 bg-gray-200 focus:outline-none text-gray-400"
              />
            </div>

            {inlineError ? (
              <p className="text-xs text-red-500">{inlineError}</p>
            ) : null}
            <button type="submit" className="p-2 bg-gray-200 ">
              Register
            </button>
          </form>
        </main>
      </div>
      {dialogError ? (
        <Dialog open={true}>
          <DialogPortal>
            <DialogOverlay className="bg-gray-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />

            <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <h2 className="text-2xl font-bold">{dialogError.title}</h2>
              <p>{dialogError.description}</p>
              <div>
                <button
                  className="p-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
                  onClick={() => {
                    setDialogError(null);
                  }}
                >
                  Ok
                </button>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      ) : null}
      <Dialog open={newsletterNotCheckedWarning}>
        <DialogPortal>
          <DialogOverlay className="bg-gray-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />

          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <h2 className="text-2xl font-bold">
              Are you sure you don't want to receive our newsletter?
            </h2>
            <p>
              Our newsletter is the best way to stay up to date with our products,
              discounts and more.
            </p>
            <div className="flex items-center gap-2 pt-4 justify-between">
              <button
                className="p-1 text-xs bg-gray-200/10"
                onClick={() => {
                  setNewsletterNotCheckedWarningCancel(true);
                }}
              >
                Yes
              </button>
              <button
                className="p-4 text-xl bg-orange-300 hover:bg-orange-400 active:bg-orange-500"
                onClick={() => {
                  setNewsletterNotCheckedWarning(false);
                }}
              >
                No, I will change.
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog open={newsletterNotCheckedWarningCancel}>
        <DialogPortal>
          <DialogOverlay className="bg-gray-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />

          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <h2 className="text-2xl font-bold">
              You want to continue without receiving our newsletter?
            </h2>
            <p></p>
            <div className="flex items-center gap-2 pt-4 justify-between">
              <button
                className="p-5 relative text-xl bg-orange-300 hover:bg-orange-400 active:bg-orange-500"
                onClick={(e) => {
                  setNewsletterNotCheckedWarningCancel(false);
                  setNewsletterNotCheckedWarning(false);
                  setNewsletterChecked(true);
                }}
              >
                No, I change my mind.
                <button
                  className="p-1 text-gray-300/50 text-xs  absolute bottom-1 left-1"
                  onClick={(e) => {
                    setNewsletterNotCheckedWarningCancel(false);
                    setNewsletterNotCheckedWarning(false);
                    setNewsletterChecked(false);
                    finish();
                    e.stopPropagation();
                  }}
                >
                  yes.
                </button>
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog open={getMyFreeEbook}>
        <DialogPortal>
          <DialogOverlay className="bg-gray-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />

          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <h2 className="text-2xl font-bold">Get my FREE Ebook</h2>
            <div className="relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    setGetMyFreeEbook(false);
                  }}
                >
                  Close
                </button>
              </div>
              <img
                alt="free-ebook-cover"
                src="https://cdn.kobo.com/book-images/6e0c90be-96ba-4993-925f-f5db92774af0/1200/1200/False/100-weight-loss-tips-pdf-ebook-book-free-download.jpg"
                className="w-28 h-auto m-auto group-hover:-translate-y-24 transition-transform duration-1000 relative"
              />
            </div>
            <p>
              Get my FREE Ebook with 100 tips to lose weight without dieting. Just
            </p>
            <div className="flex flex-col gap-2 pt-4 justify-between">
              <input
                type="email"
                className="p-4 text-lg bg-orange-100 focus:outline-none hover:bg-orange-200 border-2 border-orange-400 active:border-orange-500"
                placeholder="Your BEST EMAIL"
              />
              <button
                className="p-5 relative text-xl font-bold bg-orange-300 hover:bg-orange-400 active:bg-orange-500"
                onClick={(e) => {
                  setNewsletterNotCheckedWarningCancel(false);
                  setNewsletterNotCheckedWarning(false);
                  setNewsletterChecked(true);
                }}
              >
                I want the ebook
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
