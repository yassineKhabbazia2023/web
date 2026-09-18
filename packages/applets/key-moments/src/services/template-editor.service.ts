import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type {
  CreateTemplateRequest,
  RawTemplateDocument,
  TemplateCatalogueEntryPayload,
  TemplateCatalogueItem,
  TemplateVersionItem,
} from './template-editor.service.types'

const TEMPLATES = `${API_PREFIXES.KEY_MOMENTS}/templates`

/** The editor side of the templates: versions are appended, never overwritten. */
export class TemplateEditorService {

  /**
   * The whole catalogue, the templates no version is visible for included —
   * those are exactly the ones the editor exists to bring to life.
   */
  static async getCatalogue(): Promise<TemplateCatalogueItem[]> {
    const { data } = await api.gateway.get<TemplateCatalogueEntryPayload[]>(
      TEMPLATES,
      { params: { includeHidden: true } },
    )

    return data.map(({ templateId, code, label, version, visibleVersion }) => ({
      templateId,
      code,
      label,
      visibleVersion: visibleVersion ?? version ?? null,
    }))
  }

  static async getVersions(templateId: number): Promise<TemplateVersionItem[]> {
    const { data } = await api.gateway.get<TemplateVersionItem[]>(`${TEMPLATES}/${templateId}/versions`)

    return data
  }

  /** Verbatim: the editor writes back what it read, plus its own changes. */
  static async getRawContent(templateId: number, version?: string): Promise<RawTemplateDocument> {
    const { data } = await api.gateway.get<RawTemplateDocument>(
      `${TEMPLATES}/${templateId}/content`,
      { params: { version } },
    )

    return data
  }

  static async createTemplate(payload: CreateTemplateRequest): Promise<TemplateCatalogueItem> {
    const { data } = await api.gateway.post<TemplateCatalogueItem>(TEMPLATES, payload)

    return data
  }

  /** Appends a version without making it visible: publishing is its own gesture. */
  static async addVersion(templateId: number, version: string, content: RawTemplateDocument): Promise<void> {
    await api.gateway.post(`${TEMPLATES}/${templateId}/versions`, { version, content })
  }

  static async setVisibleVersion(templateId: number, version: string): Promise<void> {
    await api.gateway.put(`${TEMPLATES}/${templateId}/visible`, undefined, { params: { version } })
  }

  /**
   * Writes a version in place, which is what the editor saves. Refused with a
   * `409` as soon as a publication — active or not — pins that version: what a
   * client has already read never changes under them.
   */
  static async updateContent(
    templateId: number,
    version: string,
    content: RawTemplateDocument,
  ): Promise<void> {
    await api.gateway.put(`${TEMPLATES}/${templateId}/versions/${version}/content`, content)
  }

  /** Renames the template across every one of its versions, locked ones included. */
  static async updateLabel(templateId: number, label: string): Promise<void> {
    await api.gateway.put(`${TEMPLATES}/${templateId}`, { label })
  }

  /** Takes the template out of the catalogue: no version is visible any more. */
  static async clearVisibleVersion(templateId: number): Promise<void> {
    await api.gateway.delete(`${TEMPLATES}/${templateId}/visible`)
  }

  /**
   * Refused with a `409` on the visible version, on one a publication pins, and
   * on the last one left: a template always keeps a version.
   */
  static async deleteVersion(templateId: number, version: string): Promise<void> {
    await api.gateway.delete(`${TEMPLATES}/${templateId}/versions/${version}`)
  }
}
