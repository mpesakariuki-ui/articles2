export function generateDOI(paperId: string): string {
  const prefix = '10.5555'; // Example prefix
  const suffix = `pillar.${paperId}`;
  return `${prefix}/${suffix}`;
}

export function validateDOI(doi: string): boolean {
  const doiRegex = /^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/;
  return doiRegex.test(doi);
}