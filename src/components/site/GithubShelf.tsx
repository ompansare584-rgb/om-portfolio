'use client';
import { useEffect, useRef, useState } from 'react';

type Repo = { id: number; name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean; archived: boolean };

/**
 * Live from GitHub's public API (no login, nothing stored). Real repositories only. If the request fails
 * or there are none, the visitor just gets a link. Nothing is ever made up.
 */
export default function GithubShelf({ user }: { user: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'fail'>('idle');

  useEffect(() => {
    const el = box.current;
    if (!el || !user) return;
    const load = () => {
      setState('loading');
      const key = `gh:${user}`;
      try {
        const c = sessionStorage.getItem(key);
        if (c) { setRepos(JSON.parse(c)); setState('done'); return; }
      } catch { /* storage may be blocked */ }
      fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github+json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((all: Repo[]) => {
          const list = all.filter((r) => !r.fork && !r.archived).slice(0, 6);
          try { sessionStorage.setItem(key, JSON.stringify(list)); } catch { /* ignore */ }
          setRepos(list);
          setState('done');
        })
        .catch(() => setState('fail'));
    };
    if (!('IntersectionObserver' in window)) { load(); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [user]);

  return (
    <div ref={box} aria-live="polite">
      {state === 'done' && repos && repos.length > 0 && (
        <>
          <p className="soft" style={{ marginBottom: 10 }}>Live from <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">github.com/{user}</a>. Public repositories, newest first.</p>
          <div className="grid">
            {repos.map((r) => (
              <a key={r.id} className="repo" href={r.html_url} target="_blank" rel="noopener noreferrer">
                <b>{r.name}</b>
                <span>{r.description || 'No description yet.'}{r.language ? ` · ${r.language}` : ''}</span>
              </a>
            ))}
          </div>
        </>
      )}
      {state !== 'done' || !repos || repos.length === 0 ? (
        <p className="soft">
          {state === 'fail' ? 'GitHub did not answer just now. ' : ''}
          {state === 'done' ? 'No public repositories to show yet. ' : ''}
          See what is there on <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      ) : null}
    </div>
  );
}
