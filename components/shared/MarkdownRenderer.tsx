import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const renderCodeBlock = (block: string, key: number) => {
  const lines = block.split('\n');
  // Remove ``` from first and last line
  const code = lines.slice(1, -1).join('\n');
  return (
    <pre key={key} className="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto text-sm font-mono">
      <code>{code}</code>
    </pre>
  );
};

const renderTable = (block: string, key: number) => {
  const rows = block.trim().split('\n');
  const separatorIndex = rows.findIndex(row => /[-|:]{3,}/.test(row));

  if (separatorIndex === -1 || separatorIndex === 0) {
    return <p key={key} className="my-2 text-sm whitespace-pre-wrap">{block}</p>;
  }

  const headers = rows[separatorIndex - 1].split('|').map(h => h.trim()).filter(Boolean);
  const bodyRows = rows.slice(separatorIndex + 1);

  return (
    <div key={key} className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
              <tr>
                  {headers.map((header, i) => (
                      <th key={i} scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {bodyRows.map((row, i) => (
                  <tr key={i}>
                      {row.split('|').map(cell => cell.trim()).filter(c => c).map((cell, j) => (
                          <td key={j} className="px-4 py-2 whitespace-normal text-gray-700">{cell}</td>
                      ))}
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
  );
};

const renderList = (block: string, key: number) => {
    const lines = block.trim().split('\n');
    const isOrdered = /^\d+\.\s/.test(lines[0].trim());
    const ListTag = isOrdered ? 'ol' : 'ul';
    const listStyle = isOrdered ? 'list-decimal' : 'list-disc';

    return (
        <ListTag key={key} className={`${listStyle} pl-6 my-2 space-y-1 text-sm`}>
            {lines.map((line, index) => {
                const lineContent = line.replace(/^[-*+]\s|^\d+\.\s/, '').trim();
                return <li key={index}>{lineContent}</li>;
            })}
        </ListTag>
    );
};

const renderParagraph = (block: string, key: number) => {
    return <p key={key} className="my-2 text-sm whitespace-pre-wrap">{block}</p>;
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by double newlines, but also handle code blocks which might contain them.
  const blocks = content.split(/(```[\s\S]*?```)/g).flatMap(block => {
    if (block.startsWith('```')) return [block];
    return block.split('\n\n');
  }).filter(Boolean);


  return (
    <div>
      {blocks.map((block, index) => {
        const trimmedBlock = block.trim();
        if (trimmedBlock.startsWith('```') && trimmedBlock.endsWith('```')) {
            return renderCodeBlock(trimmedBlock, index);
        }
        if (trimmedBlock.includes('|') && trimmedBlock.includes('-')) {
            const lines = trimmedBlock.split('\n');
            if (lines.length > 1 && /[-|:]{3,}/.test(lines[1])) {
                 return renderTable(trimmedBlock, index);
            }
        }
        if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ') || trimmedBlock.startsWith('+ ') || /^\d+\.\s/.test(trimmedBlock)) {
            return renderList(trimmedBlock, index);
        }
        return renderParagraph(block, index);
      })}
    </div>
  );
};

export default MarkdownRenderer;
