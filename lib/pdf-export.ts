import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'

export async function exportToPDF(
  content: string,
  companyName: string,
  jobTitle: string,
  addWatermark: boolean
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const page = pdfDoc.addPage([612, 792]) // US Letter
  const { width, height } = page.getSize()
  const margin = 72

  let yPosition = height - margin

  // Header
  page.drawText(`Cover Letter`, {
    x: margin,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.39, 0.45, 0.55),
  })
  page.drawText(`${companyName} — ${jobTitle}`, {
    x: margin,
    y: yPosition - 16,
    size: 11,
    font: helvetica,
    color: rgb(0.24, 0.32, 0.42),
  })

  yPosition -= 48

  // Divider
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 0.5,
    color: rgb(0.89, 0.91, 0.94),
  })

  yPosition -= 24

  // Content — wrap text
  const fontSize = 11
  const lineHeight = fontSize * 1.6
  const maxWidth = width - margin * 2

  const paragraphs = content.split('\n')
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      yPosition -= lineHeight * 0.5
      continue
    }

    const words = paragraph.split(' ')
    let line = ''

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word
      const testWidth = timesRoman.widthOfTextAtSize(testLine, fontSize)

      if (testWidth > maxWidth && line) {
        if (yPosition < margin + lineHeight) {
          const newPage = pdfDoc.addPage([612, 792])
          yPosition = newPage.getSize().height - margin
        }
        page.drawText(line, { x: margin, y: yPosition, size: fontSize, font: timesRoman, color: rgb(0.06, 0.09, 0.16) })
        yPosition -= lineHeight
        line = word
      } else {
        line = testLine
      }
    }

    if (line) {
      if (yPosition < margin + lineHeight) {
        pdfDoc.addPage([612, 792])
        yPosition = height - margin
      }
      page.drawText(line, { x: margin, y: yPosition, size: fontSize, font: timesRoman, color: rgb(0.06, 0.09, 0.16) })
      yPosition -= lineHeight
    }
    yPosition -= lineHeight * 0.25
  }

  // Footer
  const footerText = 'Generated with ApplyAI — applyai.ink'
  page.drawText(footerText, {
    x: margin,
    y: margin / 2,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.65, 0.7),
  })

  // Watermark
  if (addWatermark) {
    const pages = pdfDoc.getPages()
    for (const p of pages) {
      const { width: w, height: h } = p.getSize()
      p.drawText('Made with ApplyAI — Free Plan', {
        x: w / 2 - 120,
        y: h / 2,
        size: 28,
        font: timesRomanBold,
        color: rgb(0.85, 0.87, 0.9),
        opacity: 0.35,
        rotate: degrees(-45),
      })
    }
  }

  return pdfDoc.save()
}
