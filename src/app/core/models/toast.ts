export interface Toast {
	type: string;
	title: string;
	message: string;
}

export enum ToastType {
	success = 'success',
	error = 'error',
	info = 'info',
	warning = 'warning',
}
