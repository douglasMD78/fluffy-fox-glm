import React from 'react';

export const renderMarkdownText = (text: string | undefined) => {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Regex para encontrar **texto**
  const regex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, boldText] = match;
    const startIndex = match.index;
    const endIndex = regex.lastIndex;

    // Adiciona o texto antes do negrito
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    // Adiciona o texto em negrito
    parts.push(<strong key={startIndex}>{boldText}</strong>);
    lastIndex = endIndex;
  }

  // Adiciona qualquer texto restante após o último negrito
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};