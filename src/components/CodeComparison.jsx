import { useEffect, useMemo, useState } from 'react';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { FileIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export function CodeComparison({
  beforeCode,
  afterCode,
  language = 'jsx',
  filename = 'component.jsx',
  highlightColor = '#7c3aed',
}) {
  const [highlightedBefore, setHighlightedBefore] = useState('');
  const [highlightedAfter, setHighlightedAfter] = useState('');
  const [hasLeftFocus, setHasLeftFocus] = useState(false);
  const [hasRightFocus, setHasRightFocus] = useState(false);

  useEffect(() => {
    if (highlightedBefore || highlightedAfter) {
      setHasLeftFocus(highlightedBefore.includes('class="line focused"'));
      setHasRightFocus(highlightedAfter.includes('class="line focused"'));
    }
  }, [highlightedBefore, highlightedAfter]);

  useEffect(() => {
    async function highlightCode() {
      try {
        const { codeToHtml } = await import('shiki');

        const [before, after] = await Promise.all([
          codeToHtml(beforeCode, {
            lang: language,
            theme: 'github-dark',
            transformers: [
              transformerNotationHighlight({ matchAlgorithm: 'v3' }),
              transformerNotationDiff({ matchAlgorithm: 'v3' }),
              transformerNotationFocus({ matchAlgorithm: 'v3' }),
            ],
          }),
          codeToHtml(afterCode, {
            lang: language,
            theme: 'github-dark',
            transformers: [
              transformerNotationHighlight({ matchAlgorithm: 'v3' }),
              transformerNotationDiff({ matchAlgorithm: 'v3' }),
              transformerNotationFocus({ matchAlgorithm: 'v3' }),
            ],
          }),
        ]);

        setHighlightedBefore(before);
        setHighlightedAfter(after);
      } catch (err) {
        console.error(err);
        setHighlightedBefore(`<pre>${beforeCode}</pre>`);
        setHighlightedAfter(`<pre>${afterCode}</pre>`);
      }
    }
    highlightCode();
  }, [beforeCode, afterCode, language]);

  const renderCode = (code, highlighted) => {
    if (highlighted) {
      return (
        <div
          style={{ '--highlight-color': highlightColor }}
          className={cn(
            'h-full w-full overflow-auto font-mono text-xs bg-[#0d1117]',
            '[&>pre]:h-full [&>pre]:py-2 [&>pre]:!bg-transparent',
            '[&>pre>code]:inline-block [&>pre>code]:w-full [&>pre>code]:!bg-transparent',
            '[&>pre>code>.line]:inline-block [&>pre>code>.line]:w-full [&>pre>code>.line]:px-4 [&>pre>code>.line]:py-0.5',
            '[&>pre>code>.line.highlighted]:bg-[var(--highlight-color)]/20',
            '[&>pre>code>.line.add]:bg-emerald-500/[0.16]',
            '[&>pre>code>.line.remove]:bg-rose-500/[0.16]',
            '[&>pre>code>.line]:transition-all [&>pre>code>.line]:duration-300',
            'group-hover/left:[&>pre>code>.line:not(.focused)]:opacity-100 group-hover/left:[&>pre>code>.line:not(.focused)]:blur-none',
            'group-hover/right:[&>pre>code>.line:not(.focused)]:opacity-100 group-hover/right:[&>pre>code>.line:not(.focused)]:blur-none',
          )}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
    return (
      <pre className="h-full overflow-auto p-4 font-mono text-xs text-zinc-300 bg-[#0d1117] break-all">
        {code}
      </pre>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="group relative w-full overflow-hidden rounded-xl border border-white/[0.08]">
        <div className="relative grid md:grid-cols-2">

          {/* Before */}
          <div
            className={cn(
              'group/left border-white/[0.08] md:border-r',
              hasLeftFocus && '[&>div>.line:not(.focused)]:opacity-50 [&>div>.line:not(.focused)]:blur-[0.095rem]',
            )}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#18181b] px-3 py-2 text-sm text-zinc-400">
              <FileIcon className="h-4 w-4" />
              <span className="text-zinc-300 font-medium">{filename}</span>
              <span className="ml-auto text-xs tracking-widest uppercase text-zinc-600 hidden md:block">before</span>
            </div>
            {renderCode(beforeCode, highlightedBefore)}
          </div>

          {/* After */}
          <div
            className={cn(
              'group/right border-white/[0.08] border-t md:border-t-0',
              hasRightFocus && '[&>div>.line:not(.focused)]:opacity-50 [&>div>.line:not(.focused)]:blur-[0.095rem]',
            )}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#18181b] px-3 py-2 text-sm text-zinc-400">
              <FileIcon className="h-4 w-4" />
              <span className="text-zinc-300 font-medium">{filename}</span>
              <span className="ml-auto text-xs tracking-widest uppercase text-zinc-600 hidden md:block">after</span>
            </div>
            {renderCode(afterCode, highlightedAfter)}
          </div>

        </div>

        {/* VS badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden h-8 w-8 items-center justify-center rounded-md border border-white/[0.12] bg-[#18181b] text-xs font-bold text-zinc-500 md:flex">
          VS
        </div>
      </div>
    </div>
  );
}
