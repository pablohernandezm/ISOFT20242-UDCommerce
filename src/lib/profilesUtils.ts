export function getInitials(name: string): string {
	return name
		.split(' ') // Divide el nombre por espacios
		.map((word) => word.charAt(0).toUpperCase()) // Toma la primera letra y la pone en mayúsculas
		.join(''); // Une las iniciales en una sola cadena
}
