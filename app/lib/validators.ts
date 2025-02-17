export const validateDriveLink = (link: string) => {
  const drivePattern = /^https:\/\/drive\.google\.com\/file\/d\//;
  return drivePattern.test(link) || link === "";
};

export const validateSheetLink = (link: string) => {
  const sheetPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\//;
  return sheetPattern.test(link) || link === "";
};

