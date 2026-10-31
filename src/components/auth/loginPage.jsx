import { useState } from "react";
import {
  ArrowRight,
  Heart,
  LockKeyhole,
  Mail,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [mode, setMode] = useState("signup");
  const [notice, setNotice] = useState("");
  const isSigningUp = mode === "signup";

  function handleSubmit(event) {
    event.preventDefault();
    setNotice(
      isSigningUp
        ? "Account creation isn't connected yet. Your information hasn't been sent."
        : "Sign-in isn't connected yet. Your information hasn't been sent.",
    );
  }

  function toggleMode() {
    setMode(isSigningUp ? "login" : "signup");
    setNotice("");
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#f7f8fc] px-4 py-10 text-left sm:px-6 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-12 -z-10 size-80 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-20 -z-10 size-96 rounded-full bg-indigo-200/40 blur-3xl"
      />

      <div className="mx-auto grid min-h-[620px] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_90px_-35px_rgba(30,58,100,0.28)] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#244b7b] via-[#2b5b8f] to-[#3975a4] p-7 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10 shadow-[0_0_0_32px_rgba(255,255,255,0.035),0_0_0_64px_rgba(255,255,255,0.025)]"
          />
          <Link
            className="relative z-10 inline-flex w-fit items-center gap-3 rounded-xl text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            to="/"
            aria-label="Omni Store home"
          >
            <span className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-white/10">
              <ShoppingBag size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-logo text-3xl font-bold">Omni</span>
              <span className="mt-1 text-[9px] font-bold tracking-[0.28em]">
                STORE
              </span>
            </span>
          </Link>

          <div className="relative z-10 my-10 mx-auto w-full max-w-md text-center lg:my-0 lg:py-16">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium text-blue-50 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} aria-hidden="true" />A little something for
              every day
            </span>
            <h1 className="mt-6 font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl">
              Good things,
              <br />
              all in one place.
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-blue-50/90 sm:text-base">
              Discover lovely finds for your home and everyday life. Your next
              favorite thing is waiting at Omni Store.
            </p>
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/95 shadow-sm backdrop-blur-sm">
              <Heart
                size={17}
                className="fill-rose-200 text-rose-200"
                aria-hidden="true"
              />
              <span>Make room for things you love.</span>
            </div>
          </div>
        </aside>

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-end gap-1.5 text-sm text-slate-500">
            <span>
              {isSigningUp ? "Already have an account?" : "New to Omni Store?"}
            </span>
            <button
              className="rounded-md px-1.5 py-1 font-semibold text-blue-700 transition hover:text-blue-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button"
              onClick={toggleMode}
            >
              {isSigningUp ? "Sign in" : "Create account"}
            </button>
          </div>

          <div className="mx-auto my-auto w-full max-w-sm py-10">
            <span className="text-xs font-bold tracking-[0.18em] text-blue-700">
              {isSigningUp
                ? "YOUR NEXT FAVORITE STARTS HERE"
                : "NICE TO SEE YOU AGAIN"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {isSigningUp ? "Let’s get you started" : "Welcome back"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isSigningUp
                ? "Create an account to make your shopping experience your own."
                : "Sign in and pick up right where you left off."}
            </p>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              {isSigningUp && (
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  <span>Your name</span>
                  <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <UserRound size={18} aria-hidden="true" />
                    <input
                      className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      type="text"
                      name="username"
                      placeholder="What should we call you?"
                      autoComplete="username"
                      minLength={2}
                      required
                    />
                  </span>
                </label>
              )}

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                <span>Email address</span>
                <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={18} aria-hidden="true" />
                  <input
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                <span>Password</span>
                <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    autoComplete={
                      isSigningUp ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                  />
                </span>
              </label>

              {notice && (
                <p
                  className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-800"
                  role="status"
                >
                  {notice}
                </p>
              )}

              <button
                className="btn btn-primary mt-1 min-h-12 w-full rounded-xl hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                type="submit"
              >
                {isSigningUp ? "Create my account" : "Sign in"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Your details stay in this form. Account services will be available
              when sign-in is connected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
