import * as XLSX from 'xlsx'

interface ExportOptions {
  filename: string
  sheetName?: string
  header?: boolean
}

export const exportToExcel = (data: any[], options: ExportOptions) => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data, { 
    header: options.header === false ? [] : undefined 
  })

  XLSX.utils.book_append_sheet(
    workbook, 
    worksheet, 
    options.sheetName || 'Sheet1'
  )

  XLSX.writeFile(workbook, `${options.filename}.xlsx`)
}

export const formatDateForExport = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}