import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Split content into lines for processing
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let isInCodeBlock = false;
    let codeBlockContent: string[] = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        if (paragraphText.trim()) {
          elements.push(
            <p key={key++} className="mb-4 leading-relaxed">
              {renderInlineElements(paragraphText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key++} className="mb-4 space-y-2 pl-6">
            {listItems.map((item, index) => (
              <li key={index} className="list-disc">
                {renderInlineElements(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={key++} className="mb-4 bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        );
        codeBlockContent = [];
        isInCodeBlock = false;
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        flushParagraph();
        flushList();
        if (isInCodeBlock) {
          flushCodeBlock();
        } else {
          isInCodeBlock = true;
        }
        return;
      }

      if (isInCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle headings
      if (trimmedLine.startsWith('# ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h1 key={key++} className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-foreground">
            {trimmedLine.substring(2)}
          </h1>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={key++} className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-foreground">
            {trimmedLine.substring(3)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('### ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={key++} className="text-xl font-bold mb-3 mt-4 first:mt-0 text-foreground">
            {trimmedLine.substring(4)}
          </h3>
        );
        return;
      }

      // Handle images
      const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        flushParagraph();
        flushList();
        elements.push(
          <div key={key++} className="mb-6">
            <ImageWithFallback
              src={imageMatch[2]}
              alt={imageMatch[1]}
              className="w-full rounded-lg shadow-lg"
            />
            {imageMatch[1] && (
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                {imageMatch[1]}
              </p>
            )}
          </div>
        );
        return;
      }

      // Handle blockquotes
      if (trimmedLine.startsWith('> ')) {
        flushParagraph();
        flushList();
        elements.push(
          <blockquote key={key++} className="border-l-4 border-primary pl-4 mb-4 italic text-muted-foreground">
            {renderInlineElements(trimmedLine.substring(2))}
          </blockquote>
        );
        return;
      }

      // Handle lists
      if (trimmedLine.match(/^[-*+]\s+/)) {
        flushParagraph();
        listItems.push(trimmedLine.replace(/^[-*+]\s+/, ''));
        return;
      }

      if (trimmedLine.match(/^\d+\.\s+/)) {
        flushParagraph();
        listItems.push(trimmedLine.replace(/^\d+\.\s+/, ''));
        return;
      }

      // Handle horizontal rules
      if (trimmedLine.match(/^---+$/)) {
        flushParagraph();
        flushList();
        elements.push(
          <hr key={key++} className="my-8 border-border" />
        );
        return;
      }

      // Handle empty lines
      if (trimmedLine === '') {
        flushParagraph();
        flushList();
        return;
      }

      // Regular paragraph content
      flushList();
      currentParagraph.push(line);
    });

    // Flush any remaining content
    flushParagraph();
    flushList();
    flushCodeBlock();

    return elements;
  };

  const renderInlineElements = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remainingText = text;
    let partKey = 0;

    while (remainingText.length > 0) {
      // Bold text
      const boldMatch = remainingText.match(/\*\*(.*?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remainingText.substring(0, boldMatch.index));
        }
        parts.push(
          <strong key={partKey++} className="font-bold">
            {boldMatch[1]}
          </strong>
        );
        remainingText = remainingText.substring(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Italic text
      const italicMatch = remainingText.match(/\*(.*?)\*/);
      if (italicMatch && italicMatch.index !== undefined) {
        if (italicMatch.index > 0) {
          parts.push(remainingText.substring(0, italicMatch.index));
        }
        parts.push(
          <em key={partKey++} className="italic">
            {italicMatch[1]}
          </em>
        );
        remainingText = remainingText.substring(italicMatch.index + italicMatch[0].length);
        continue;
      }

      // Inline code
      const codeMatch = remainingText.match(/`(.*?)`/);
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remainingText.substring(0, codeMatch.index));
        }
        parts.push(
          <code key={partKey++} className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
            {codeMatch[1]}
          </code>
        );
        remainingText = remainingText.substring(codeMatch.index + codeMatch[0].length);
        continue;
      }

      // Links
      const linkMatch = remainingText.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch && linkMatch.index !== undefined) {
        if (linkMatch.index > 0) {
          parts.push(remainingText.substring(0, linkMatch.index));
        }
        parts.push(
          <a 
            key={partKey++} 
            href={linkMatch[2]} 
            className="text-primary underline hover:text-primary/80 transition-colors"
            target={linkMatch[2].startsWith('http') ? '_blank' : '_self'}
            rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {linkMatch[1]}
          </a>
        );
        remainingText = remainingText.substring(linkMatch.index + linkMatch[0].length);
        continue;
      }

      // No more special formatting found, add the rest
      parts.push(remainingText);
      break;
    }

    return parts;
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}