import { Address } from './address';
import { Education } from './education';
import { Experience } from './experience';

export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string;
	summary: string;
	birthday: Date;
	phone: string;
	role: string;
	createdAt: string;
	address: Address;
	education: Education[];
	experience: Experience[];
}
