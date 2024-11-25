import {
  PIFileText,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypeHeic,
  PIFiletypeJpg,
  PIFiletypeMd,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypePptx,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeTiff,
  PIFiletypeTxt,
  PIFiletypeXls,
  PIFiletypeXlsx,
  PIFiletypeXml,
} from '@pulse/styleguide/components'

export const getFileIcon = (stringWithDot: string) => {
  if (!stringWithDot) {
    return PIFileText
  }
  switch (stringWithDot.split('.').pop()) {
  case 'bmp':
    return PIFiletypeBmp
  case 'csv':
    return PIFiletypeCsv
  case 'doc':
    return PIFiletypeDoc
  case 'docx':
    return PIFiletypeDocx
  case 'gif':
    return PIFiletypeGif
  case 'heic':
    return PIFiletypeHeic
  case 'jpg':
    return PIFiletypeJpg
  case 'md':
    return PIFiletypeMd
  case 'pdf':
    return PIFiletypePdf
  case 'png':
    return PIFiletypePng
  case 'ppt':
    return PIFiletypePpt
  case 'pptx':
    return PIFiletypePptx
  case 'raw':
    return PIFiletypeRaw
  case 'svg':
    return PIFiletypeSvg
  case 'tiff':
    return PIFiletypeTiff
  case 'txt':
    return PIFiletypeTxt
  case 'xls':
    return PIFiletypeXls
  case 'xlsx':
    return PIFiletypeXlsx
  case 'xml':
    return PIFiletypeXml
  default:
    return PIFileText
  }
}
