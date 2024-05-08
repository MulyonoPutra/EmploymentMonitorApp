import { Category } from 'src/app/modules/category/domain/entities/category';

export interface Activity {
	id: string;
	companyName: string;
	position: string;
	location: string;
	jobType: string;
	status: string;
	category: Category;
	appliedOn: string;
	platform: string;
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}
