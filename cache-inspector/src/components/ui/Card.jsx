export default function Card({ title, subtitle, children, right }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          {title ? <h2 className="text-sm font-semibold text-slate-100">{title}</h2> : null}
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </header>
      {children}
    </section>
  )
}

