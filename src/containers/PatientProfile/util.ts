import { definitions } from '@/types'

export const updatePatientTag = (
  formPatient: definitions['Patient'],
  tagName: string,
  tagValue: string
): definitions['Patient'] => {
  let tags = []

  const newTag = { key: tagName, value: tagValue }

  if (Array.isArray(formPatient.tags)) {
    const tagExists = formPatient.tags.find(({ key }) => key === tagName)

    if (tagExists) {
      tags = formPatient.tags.map((tag) => (tag.key === tagName ? newTag : tag))
    } else {
      tags = [...formPatient.tags, newTag]
    }
  } else {
    tags = [newTag]
  }

  return {
    ...formPatient,
    tags: tags,
  }
}
