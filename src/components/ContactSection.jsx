import { useState } from 'react';
import { cn } from '../lib/utils';

const FORMSPREE_URL = 'https://formspree.io/f/mkozwrwj';

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputBase =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20';

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen bg-background flex items-center justify-center py-32 px-6
                 before:absolute before:top-0 before:left-[10%] before:w-4/5 before:h-px
                 before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent"
    >
      <div className="max-w-[560px] w-full flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-zinc-600">
            Contact
          </p>
          <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[1.1] tracking-tight text-zinc-50 m-0">
            Let&apos;s work{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              together
            </span>
          </h2>
          <p className="text-base leading-7 text-zinc-500">
            Have a project in mind? Fill out the form and I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-8 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
              ✓
            </div>
            <p className="text-lg font-semibold text-zinc-100">Message sent!</p>
            <p className="text-sm text-zinc-500">Thanks for reaching out. I&apos;ll be in touch soon.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-xs text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500 tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className={inputBase}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 tracking-wide">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell me about your project..."
                className={cn(inputBase, 'resize-none')}
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <p className="text-xs text-rose-400">
                Something went wrong. Please try again or email me directly.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-br from-violet-700 to-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_36px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === 'sending' ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending…
                </>
              ) : (
                'Send Message'
              )}
            </button>

          </form>
        )}

      </div>
    </section>
  );
};

export default ContactSection;
