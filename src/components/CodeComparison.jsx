import { useEffect, useState } from 'react';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { FileIcon } from 'lucide-react';
import './CodeComparison.css';

export function CodeComparison({
  beforeCode,
  afterCode,
  language = 'jsx',
  filename = 'component.jsx',
  highlightColor = 'rgba(124, 58, 237, 0.25)',
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

        const before = await codeToHtml(beforeCode, {
          lang: language,
          theme: 'github-dark',
          transformers: [
            transformerNotationHighlight({ matchAlgorithm: 'v3' }),
            transformerNotationDiff({ matchAlgorithm: 'v3' }),
            transformerNotationFocus({ matchAlgorithm: 'v3' }),
          ],
        });
        const after = await codeToHtml(afterCode, {
          lang: language,
          theme: 'github-dark',
          transformers: [
            transformerNotationHighlight({ matchAlgorithm: 'v3' }),
            transformerNotationDiff({ matchAlgorithm: 'v3' }),
            transformerNotationFocus({ matchAlgorithm: 'v3' }),
          ],
        });

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
          className="code-panel__body"
          style={{ '--highlight-color': highlightColor }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
    return (
      <pre className="code-panel__body code-panel__body--plain">{code}</pre>
    );
  };

  return (
    <div className="code-comparison">
      <div className="code-comparison__grid">
        {/* Before */}
        <div className={`code-panel${hasLeftFocus ? ' code-panel--has-focus' : ''}`}>
          <div className="code-panel__header">
            <FileIcon size={14} />
            <span className="code-panel__filename">{filename}</span>
            <span className="code-panel__label">before</span>
          </div>
          {renderCode(beforeCode, highlightedBefore)}
        </div>

        {/* After */}
        <div className={`code-panel code-panel--right${hasRightFocus ? ' code-panel--has-focus' : ''}`}>
          <div className="code-panel__header">
            <FileIcon size={14} />
            <span className="code-panel__filename">{filename}</span>
            <span className="code-panel__label">after</span>
          </div>
          {renderCode(afterCode, highlightedAfter)}
        </div>
      </div>

      {/* VS badge */}
      <div className="code-comparison__vs">VS</div>
    </div>
  );
}
