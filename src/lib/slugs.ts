export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Change accents to normal letters
        .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim()
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
}
