import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center animate-fade-in">
      <div className="font-mono">
        <p className="text-neon-cyan/60 text-sm mb-2">$ cat /dev/null</p>
        <h1 className="text-6xl font-bold text-neutral-100 mb-2">
          <span className="text-neon-cyan/40">&gt;</span> 404
        </h1>
        <p className="text-lg text-neutral-500 mb-8">
          skill not found in registry
        </p>
      </div>

      <div className="rounded border border-neutral-800/60 bg-neutral-900/30 p-6 mb-8 text-left font-mono text-sm">
        <p className="text-neutral-600 mb-2">
          <span className="text-red-400/70">error</span>: the requested page
          does not exist or has been removed.
        </p>
        <p className="text-neutral-600">
          <span className="text-yellow-400/70">hint</span>: try searching the
          registry or browsing all skills.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded border border-neon-cyan/40 px-5 py-2 font-mono text-sm text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all"
        >
          <span className="text-neutral-500">$</span> cd ~
        </Link>
        <Link
          href="/skills"
          className="rounded border border-neutral-700 px-5 py-2 font-mono text-sm text-neutral-400 hover:text-neon-cyan hover:border-neon-cyan/40 transition-all"
        >
          <span className="text-neutral-500">$</span> ls /skills
        </Link>
      </div>
    </div>
  );
}
