// Renders a string that mixes plain text with inline LaTeX delimited by $...$.
// e.g. "Solve $x^2 - 5x + 6 = 0$." -> text + KaTeX-rendered math.
import katex from "katex";

function renderTeX(tex, displayMode = false) {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode
    });
  } catch {
    return tex;
  }
}

export default function MathText({ children, block = false, className = "" }) {
  const input = String(children ?? "");
  // Split on $...$ keeping the delimiters' contents.
  const parts = input.split(/(\$[^$]*\$)/g).filter((p) => p !== "");

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const tex = part.slice(1, -1);
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: renderTeX(tex, block) }}
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
