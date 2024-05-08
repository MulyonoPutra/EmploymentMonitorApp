import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const handlerHttpError = (res: HttpErrorResponse) => {
	let errorMessage = 'An error occurred';
	if (res.error instanceof ErrorEvent) {
		// Client-side error
		errorMessage = `Error: ${res.error.message}`;
	} else {
		// Server-side error
		errorMessage = `Error Code: ${res.status}\nMessage: ${res.message}`;
	}
	// You can customize the error handling further as per your application's requirements
	console.error(errorMessage);
	return throwError(() => errorMessage);
};
