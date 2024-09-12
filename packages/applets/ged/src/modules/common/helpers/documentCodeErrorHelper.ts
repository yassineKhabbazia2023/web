import { MAX_FILE_SIZE_MB } from '@/modules/common/constants/files'

interface ErrorDetail {
  message: string
  description: string
}

const codeErrorMapping: Record<string, ErrorDetail> = {
  FileEmpty: {
    message: 'Fichier vide',
    description: 'Le document doit faire  minimum 1 octet',
  },
  FileTooLarge: {
    message: 'Document trop volumineux',
    description: `Le document doit faire maximum ${MAX_FILE_SIZE_MB}MB`,
  },
  UnauthorizedFileType: {
    message: 'Format non reconnu',
    description: 'Formats de documents reconnus : bmp, csv, doc, dot, docx, dotx, docm, dotm, ' +
    ' gif, jfif,\n jpe, jpeg, jpg, msg, mp4, pdf, ppt, pptx, pot, pps, ppa, ppam, png, rtf, sql,' +
    ' tif, tiff, txt, vsdx,\n xsl, xls, xlsx, xltx, xlsm, xltm, xlam' +
    ', xlsb, zip, rar, xml, pbix, ods, one, onea' +
    ', onetoc, onetoc2,\n onetmp, onepkg',
  },
  UnauthorizedCharFileName: {
    message: 'Caractères interdit',
    description: 'Le nom ne doit contenir aucun des caractères suivants : ' +
    '“ * : &lt; &gt; ? / \\ |.',
  },
  FileNameLengthExceeded: {
    message: 'Nom du fichier trop long',
    description: 'Le nom ne doit pas contenir plus de 256 caractères.',
  },
  PermissionInvalidError: {
    message: 'droit de déplacement introuvable',
    description: 'Vous n\'avez pas le droit de déplacer ce document',
  },
  DocumentCertifiedError: {
    message: 'Document certifié',
    description: 'Vous n\'avez pas le droit de déplacer un document certifié.',
  },
}

export function getFileErrorMessage(
  codeError: string,
): string {
  if (codeErrorMapping[codeError]) {
    return codeErrorMapping[codeError].message
  } else {
    return 'Connexion au serveur interrompue.'
  }
}

export function getFileErrorDescription(
  codeError: string,
): string {
  if (codeError) {
    if (codeErrorMapping[codeError]) {
      return codeErrorMapping[codeError].description
    } else {
      return 'Connexion au serveur interrompue.'
    }
  }
  return 'Connexion au serveur interrompue.'
}
