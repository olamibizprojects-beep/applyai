import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Footer,
  Header,
} from 'docx'

export async function exportToDOCX(
  content: string,
  companyName: string,
  jobTitle: string,
  addWatermark: boolean
): Promise<Blob> {
  const paragraphs = content.split('\n').map((line) => {
    if (!line.trim()) {
      return new Paragraph({ text: '', spacing: { after: 120 } })
    }
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: 'Calibri',
          size: 24, // 12pt
        }),
      ],
      spacing: { after: 160, line: 360 },
    })
  })

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Cover Letter — ${companyName} / ${jobTitle}`,
                    font: 'Calibri',
                    size: 18,
                    color: '64748B',
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: addWatermark
                      ? 'Generated with ApplyAI (Free Plan) — upgrade at applyai.ink'
                      : 'Generated with ApplyAI — applyai.ink',
                    font: 'Calibri',
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            text: `${companyName} — ${jobTitle}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 400 },
          }),
          ...paragraphs,
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}
