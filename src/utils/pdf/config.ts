export const PDF_CONFIG = {
  fonts: {
    georgian: {
      name: 'NotoSansGeorgian',
      style: 'normal'
    }
  },
  encoding: 'UTF-8',
  language: 'ka-GE',
  tableStyles: {
    headStyles: { fillColor: [26, 54, 93] },
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  }
} as const;