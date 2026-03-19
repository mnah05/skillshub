import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-24 text-center font-mono">
      <div className="mb-6 text-neon-cyan text-lg tracking-wide">
        &gt; email sent
      </div>

      <p className="mb-2 text-sm text-neutral-300">
        We sent a magic link to your inbox.
      </p>
      <p className="mb-8 text-sm text-neutral-500">
        Click the link in the email to sign in. Check your spam folder if you
        don&apos;t see it.
      </p>

      <Link
        href="/login"
        className="text-sm text-neon-cyan/70 hover:text-neon-cyan transition-colors"
      >
        &larr; back to login
      </Link>
    </div>
  );
}
