import { Lock, Mail, User } from "lucide-react";

function AuthPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="grid min-h-[720px] lg:grid-cols-2">
          <div className="relative overflow-hidden bg-[#eff3f8] p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(239,243,248,0.6)_40%,_rgba(239,243,248,0)_100%)]" />
            <div className="relative z-10">
              <div className="text-5xl font-black tracking-[-0.08em] text-slate-900">NOVA</div>
              <h1 className="mt-10 max-w-sm text-4xl font-black tracking-[-0.06em] text-slate-900">Sign in to your account.</h1>
              <p className="mt-4 max-w-sm text-base text-slate-600">Access your wishlist, track orders, and manage your premium essentials.</p>

              <div className="mt-12 space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Welcome back</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">Secure</span>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                    <Mail className="h-4 w-4" /> omaremad@gmail.com
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                    <Lock className="h-4 w-4" /> •••••••••••
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Member Access
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-[-0.07em] text-slate-900">Welcome</h2>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <User className="h-4 w-4 text-slate-500" />
                    <input className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none" placeholder="Enter your full name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <input className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <input type="password" className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none" placeholder="Enter your password" />
                  </div>
                </div>

                <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">Sign In</button>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Need an account?</span>
                  <button type="button" className="font-bold text-slate-900">Create one</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
