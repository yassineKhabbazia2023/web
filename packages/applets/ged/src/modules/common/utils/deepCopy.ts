export const deepCopy = (contentToDeepCopy: any) =>
  JSON.parse(JSON.stringify(contentToDeepCopy))
