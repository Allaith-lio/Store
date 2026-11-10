import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import Button from "../common/Button";
import { useTheme } from "../../context/ThemeContext";
import InputField from "../common/InputField";
import { Logo } from "../common/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, registerUser } from "../../services/dashboardService";

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState(modeParam === "login" ? "login" : "signup");
  useEffect(() => {
    if (modeParam === "login" || modeParam === "signup") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(modeParam);
    }
  }, [modeParam]);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const isSigningUp = mode === "signup";
  const fields = {
  username: {
    label: "Your name",
    type: "text",
    placeholder: "What should we call you?",
    autoComplete: "username",
    minLength: 2,
  },

  email: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },

  password: {
    label: "Password",
    type: "password",
    placeholder: "At least 8 characters",
    autoComplete: isSigningUp ? "new-password" : "current-password",
    minLength: 8,
  },
};
function handleChange(e){
  const { name, value} = e.target;
  setFormData(prev => (
    {...prev, [name]: value}
  ))
}
  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");
    setIsSubmitting(true);

    try {
      if (isSigningUp) {
        await registerUser({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await loginUser(formData);
      }
      navigate("/profile", { replace: true });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleMode() {
    const nextMode = isSigningUp ? "login" : "signup";
    setMode(nextMode);
    setSearchParams({ mode: nextMode });
    setNotice("");
  }
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-page px-4 py-10 text-left sm:px-6 sm:py-16 lg:py-20 transition-colors duration-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-12 -z-10 size-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-20 -z-10 size-96 rounded-full bg-secondary/20 blur-3xl"
      />

      <div className="mx-auto grid min-h-155 w-full max-w-5xl overflow-hidden rounded-4xl border border-line bg-surface shadow-raised transition-colors duration-200 lg:grid-cols-[0.95fr_1.05fr]">

        <aside className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-linear-to-br from-[#244b7b] via-[#2b5b8f] to-[#3975a4] p-7 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10 shadow-[0_0_0_32px_rgba(255,255,255,0.035),0_0_0_64px_rgba(255,255,255,0.025)]"
          />
          <Logo variant="light" />
          <div className="relative z-10 my-10 mx-auto w-full max-w-md text-center lg:my-0 lg:py-16">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium text-blue-50 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} aria-hidden="true" />
              A little something for every day
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

        <section className="flex flex-col bg-surface p-6 sm:p-10 lg:p-12 transition-colors duration-200">
          <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <Button
            type="button"
            className="icon-link relative"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <Sun size={22} className="text-amber-400" />
            ) : (
              <Moon size={22} />
            )}
          </Button>
          <div className="flex items-center justify-end gap-1.5 text-sm text-muted">
            <span>
              {isSigningUp ? "Already have an account?" : "New to Omni Store?"}
            </span>
            <Button
              className="rounded-md px-1.5 py-1 font-semibold text-primary transition hover:text-primary-hover hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              type="button"
              onClick={toggleMode}
            >
              {isSigningUp ? "Sign in" : "Create account"}
            </Button>
          </div>
          </div>
          

          <div className="mx-auto my-auto w-full max-w-sm py-10">
            <span className="text-xs font-bold tracking-[0.18em] text-primary">
              {isSigningUp
                ? "YOUR NEXT FAVORITE STARTS HERE"
                : "NICE TO SEE YOU AGAIN"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {isSigningUp ? "Let’s get you started" : "Welcome back"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {isSigningUp
                ? "Create an account to make your shopping experience your own."
                : "Sign in and pick up right where you left off."}
            </p>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              {Object.keys(fields)
              .filter((name) => name !== "username" || isSigningUp)
              .map((fieldName)=>(
                <InputField
                  key={fieldName}
                  name={fieldName}
                  {...fields[fieldName]}
                  value={formData[fieldName]}
                  onChange={handleChange}
                />
              ))}

              {notice && (
                <p
                  className="rounded-control border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-500"
                  role="alert"
                >
                  {notice}
                </p>
              )}

              <button
                disabled={isSubmitting}
                className="btn btn-primary mt-1 min-h-12 w-full rounded-control hover:-translate-y-0.5 active:translate-y-0"
                type="submit"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isSigningUp
                    ? "Create my account"
                    : "Sign in"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-muted">
              Demo accounts are saved in this browser only. Do not use a real
              password; production sign-in requires a secure backend.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
