const tokens = [
  { label: "Background", value: "#F5F7FB" },
  { label: "Surface", value: "#FFFFFF" },
  { label: "Text", value: "#0B1C30" },
  { label: "Muted", value: "#5A6475" },
  { label: "Line", value: "#DFE6F1" },
  { label: "Primary", value: "#0B1C30" },
];

function DesignSystemPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Design System
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">NOVA visual language.</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Typography</h2>
          <div className="mt-5 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Display</div>
              <div className="mt-2 text-5xl font-black tracking-[-0.08em] text-slate-900">NOVA</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Heading</div>
              <div className="mt-2 text-3xl font-black tracking-[-0.06em] text-slate-900">Design system</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Body</div>
              <div className="mt-2 max-w-md text-base leading-7 text-slate-600">A refined typographic system focused on clarity, rhythm, and quiet luxury.</div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Color Tokens</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {tokens.map((token) => (
              <div key={token.label} className="rounded-2xl border border-slate-200 p-3">
                <div className="h-20 rounded-xl" style={{ background: token.value }} />
                <div className="mt-3 font-bold text-slate-900">{token.label}</div>
                <div className="text-sm text-slate-500">{token.value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DesignSystemPage;
