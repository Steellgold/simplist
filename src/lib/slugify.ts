export const slugify = (title: string, withRandom: boolean = true): string => {
  let slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  if (withRandom) {
    slug += "-" + Math.random().toString(36).substring(7);
  }
  return slug;
};