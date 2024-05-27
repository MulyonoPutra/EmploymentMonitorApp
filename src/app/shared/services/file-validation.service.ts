import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FileValidationService {
	constructor() {}

	isValidImageType(file: File): boolean {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		return allowedTypes.includes(file.type);
	}

	isValidFileSize(file: File): boolean {
		return file.size <= 5 * 1024 * 1024;
	}
}
