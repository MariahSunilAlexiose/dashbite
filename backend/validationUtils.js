export const checkMissingFields = (tableName, data, requiredFields) => {
  if (tableName === "user") {
    const hasAtLeastOneField = requiredFields.some(
      (field) => data[field] && data[field] !== ""
    )

    if (!hasAtLeastOneField) {
      return {
        success: false,
        message: `At least one of the following fields must be provided: ${requiredFields.join(", ")}`,
      }
    }
  } else {
    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field] === ""
    )

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      }
    }
  }
  return null
}
