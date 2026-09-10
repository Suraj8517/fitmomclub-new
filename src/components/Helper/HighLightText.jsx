function highlightText(text, highlights) {
  let parts = [{ text, highlighted: false }];
  for (const h of highlights) {
    parts = parts.flatMap((part) => {
      if (part.highlighted) return [part];
      const idx = part.text.indexOf(h);
      if (idx === -1) return [part];
      return [
        { text: part.text.slice(0, idx), highlighted: false },
        { text: h, highlighted: true },
        { text: part.text.slice(idx + h.length), highlighted: false },
      ];
    });
  }
  return parts;
}