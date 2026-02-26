import { getBulletPoints, getIntroText, hasBulletPoints, hasDetails } from './history.utils'

describe('history.utils', () => {
  describe('hasDetails', () => {
    it('should return true when details has content', () => {
      expect(hasDetails('Some content')).toBe(true)
    })

    it('should return false when details is null', () => {
      expect(hasDetails(null)).toBe(false)
    })

    it('should return false when details is empty string', () => {
      expect(hasDetails('')).toBe(false)
    })

    it('should return false when details is only whitespace', () => {
      expect(hasDetails('   ')).toBe(false)
    })
  })

  describe('hasBulletPoints', () => {
    it('should return true when details contains bullet points', () => {
      const details = 'Introduction text\n- First item\n- Second item'
      expect(hasBulletPoints(details)).toBe(true)
    })

    it('should return false when details has no bullet points', () => {
      const details = 'Just some regular text without bullets'
      expect(hasBulletPoints(details)).toBe(false)
    })

    it('should return false when dash is not at line start', () => {
      const details = 'Text with - dash in middle'
      expect(hasBulletPoints(details)).toBe(false)
    })
  })

  describe('getIntroText', () => {
    it('should extract intro text before bullet points', () => {
      const details = 'Simon Peyou a modifié les droits\n- Le droit CLPEN001 a été ajouté'
      expect(getIntroText(details)).toBe('Simon Peyou a modifié les droits')
    })

    it('should return empty string when only bullet points', () => {
      const details = '- First item\n- Second item'
      expect(getIntroText(details)).toBe('')
    })

    it('should join multiple intro lines with space', () => {
      const details = 'First line\nSecond line\n- Bullet point'
      expect(getIntroText(details)).toBe('First line Second line')
    })

    it('should handle empty lines', () => {
      const details = 'Intro text\n\n- Bullet point'
      expect(getIntroText(details)).toBe('Intro text')
    })
  })

  describe('getBulletPoints', () => {
    it('should extract bullet points without prefix', () => {
      const details = 'Introduction\n- First item\n- Second item'
      expect(getBulletPoints(details)).toEqual(['First item', 'Second item'])
    })

    it('should return empty array when no bullet points', () => {
      const details = 'Just regular text'
      expect(getBulletPoints(details)).toEqual([])
    })

    it('should trim whitespace from bullet points', () => {
      const details = '-   Item with spaces   '
      expect(getBulletPoints(details)).toEqual(['Item with spaces'])
    })

    it('should handle real-world example', () => {
      const details = 'Simon Peyou (speyou@test.com) a modifié les droits de l\'utilisateur\n- Le droit CLPEN001-Accéder à l\'outil Pennylane a été ajouté\n'
      expect(getBulletPoints(details)).toEqual(['Le droit CLPEN001-Accéder à l\'outil Pennylane a été ajouté'])
    })
  })
})
