export const formatDate = (dateString) => {
    const date = new Date(dateString);
    // format date to 29 May, 2025 
    const pad = (n) => n.toString().padStart(2, '0');
    const mm = date.toLocaleString('default', { month: 'long' });
    const dd = pad(date.getDate());
    const yyyy = date.getFullYear();
    return `${dd} ${mm}, ${yyyy}`;
};