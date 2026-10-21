import { useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useLanguage } from "@/contexts/useLanguage";

interface NewsletterBandProps {
  heading: string;
  placeholder: string;
  buttonLabel: string;
  onSubmit: (email: string) => void;
  eyebrow?: string;
  description?: string;
  media?: ReactNode;
}

// Deliberately permissive: the browser's own type="email" check stays in
// place, this only catches the obvious typo before the app takes over.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterBand = ({
  heading,
  placeholder,
  buttonLabel,
  onSubmit,
  eyebrow,
  description,
  media,
}: NewsletterBandProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  // Unique per instance, so two bands on one page cannot collide on the id.
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onSubmit(value);
  };

  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-10 px-6 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 max-w-xl text-start">
          <p className="eyebrow mb-4 text-secondary-foreground/80">
            {eyebrow ?? t("prim.newsletter.eyebrow")}
          </p>
          <h2 className="font-display text-3xl text-balance tracking-tight text-secondary-foreground sm:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="font-body mt-4 max-w-md text-base leading-relaxed text-secondary-foreground/80">
              {description}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8" noValidate>
            <label htmlFor={fieldId} className="sr-only">
              {t("prim.newsletter.label")}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={fieldId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={placeholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (invalid) setInvalid(false);
                }}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                className="field min-h-11 min-w-0 flex-1 px-5 text-sm"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                {buttonLabel}
              </button>
            </div>
            {invalid && (
              <p
                id={errorId}
                role="alert"
                className="font-body mt-3 text-sm text-secondary-foreground"
              >
                {t("prim.newsletter.invalid")}
              </p>
            )}
          </form>
        </div>

        {media && <div className="min-w-0">{media}</div>}
      </div>
    </section>
  );
};

export default NewsletterBand;
