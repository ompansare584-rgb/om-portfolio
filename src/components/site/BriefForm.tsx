'use client';
import { useState } from 'react';

type Props = { email: string; formspree: string };
const KINDS = ['Short reel (Instagram / YouTube Shorts)', 'YouTube video', 'Cinematic edit / montage', 'Event or college video', 'Something else'];

/** Sends through Formspree when configured, otherwise opens the visitor's mail app. Never stores anything. */
export default function BriefForm({ email, formspree }: Props) {
  const [status, setStatus] = useState('');
  const read = (f: HTMLFormElement) => {
    const d = new FormData(f);
    const g = (k: string) => String(d.get(k) || '').trim();
    return { kind: g('kind'), name: g('name'), from: g('from'), deadline: g('deadline'), details: g('details') };
  };
  const body = (b: ReturnType<typeof read>) =>
    `Edit brief\n\nType: ${b.kind}\nName: ${b.name}\nReply to: ${b.from}\nNeeded by: ${b.deadline || 'flexible'}\n\n${b.details}\n`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const b = read(e.currentTarget);
    if (formspree) {
      setStatus('Sending…');
      try {
        const r = await fetch(formspree, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, _subject: `Edit brief: ${b.kind}` }) });
        if (!r.ok) throw new Error('bad');
        setStatus('Sent. Thank you, I will reply by email.');
        e.currentTarget.reset();
      } catch {
        setStatus(`That did not send. Please write to ${email} instead.`);
      }
      return;
    }
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Edit brief: ' + b.kind)}&body=${encodeURIComponent(body(b))}`;
    setStatus('Your mail app should open with the brief filled in.');
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>What do you need?
        <select name="kind" defaultValue={KINDS[0]}>{KINDS.map((k) => (<option key={k}>{k}</option>))}</select>
      </label>
      <label>Your name<input name="name" autoComplete="name" required /></label>
      <label>Your email<input name="from" type="email" autoComplete="email" required /></label>
      <label>Needed by (optional)<input name="deadline" placeholder="e.g. end of the month" /></label>
      <label>Tell me about it<textarea name="details" required placeholder="What is the video about, how long, what mood?" /></label>
      <div><button className="btn on-paper" type="submit">Send the brief</button></div>
      <p className="status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
