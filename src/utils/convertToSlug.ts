export const convertToSlug = (str: string) => {
    str = str.toLowerCase().trim();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Chuyển chữ có dấu thành chữ không dấu
    return str.replace(/\s+/g, "-"); // Chuyển khoảng trắng thành dấu gạch
}