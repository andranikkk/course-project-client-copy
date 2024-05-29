export const formatToClient = (date?: Date) => {
  if (!date) {
    return ""
  }

  return new Date(date).toLocaleDateString()
}
