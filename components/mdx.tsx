import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Separator } from "./ui/separator";

export const MarkdownPlease: Component<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    components={{
      h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
      h2: ({ ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
      h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
      h4: ({ ...props }) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
      h5: ({ ...props }) => <h5 className="text-base font-semibold mt-4 mb-2" {...props} />,
      h6: ({ ...props }) => <h6 className="text-sm font-semibold mt-4 mb-2" {...props} />,
      p: ({ ...props }) => <p className="mb-4" {...props} />,
      hr: () => <Separator className="my-8" />,
      ul: ({ ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
      ol: ({ ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
      li: ({ ...props }) => <li className="mb-1" {...props} />,
      a: ({ ...props }) => <a className="text-[#3182ce] hover:underline" {...props} />,
      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
      // eslint-disable-next-line @next/next/no-img-element
      img: ({ ...props }) => <img className="rounded-lg" {...props} alt="illustration image" />,
      i: ({ ...props }) => <i className="italic" {...props} />,
      b: ({ ...props }) => <b className="font-bold" {...props} />,
      strong: ({ ...props }) => <strong className="font-bold" {...props} />,
      em: ({ ...props }) => <em className="italic" {...props} />,

      code({ inline, className, children, ...props }) {
        const match = (/language-(\w+)/).exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            className="rounded-md my-4"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-muted text-muted-foreground px-1 py-0.5 rounded" {...props}>
            {children}
          </code>
        );
      }
    }}
  >
    {content}
  </ReactMarkdown>
);