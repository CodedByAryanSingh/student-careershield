const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function extractResumeText(file) {
  if (!file) throw new Error("Choose a resume file first.")
  if (file.size > MAX_FILE_SIZE) throw new Error("Your resume must be smaller than 10 MB.")

  const extension = file.name.split(".").pop()?.toLowerCase()
  if (!['pdf', 'docx', 'txt'].includes(extension)) {
    throw new Error("Use a PDF, DOCX, or TXT resume.")
  }

  if (extension === "txt") return file.text()

  const arrayBuffer = await file.arrayBuffer()

  if (extension === "docx") {
    const mammoth = await import("mammoth/mammoth.browser")
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }

  const pdfjs = await import("pdfjs-dist")
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
  const pages = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(" "))
  }

  return pages.join("\n\n")
}
