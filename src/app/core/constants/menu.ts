import { MenuItem } from '../models/menu.model';

export class Menu {
	public static pages: MenuItem[] = [
		{
			group: 'Base',
			separator: false,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/chart-pie.svg',
					label: 'Dashboard',
					route: '/dashboard',
					children: [
						{ label: 'Nfts', route: '/dashboard/nfts' },
						{ label: 'Podcast', route: '/dashboard/podcast' },
					],
				},
				{
					icon: 'assets/icons/heroicons/outline/list.svg',
					label: 'Category',
					route: '/category',
					children: [
						{ label: 'Category Forms', route: '/category/forms' },
						{ label: 'Category List', route: '/category/list' },
					],
				},
				{
					icon: 'assets/icons/heroicons/outline/work.svg',
					label: 'My Activity',
					route: '/activity',
					children: [
						{ label: 'Activity Forms', route: '/activity/forms' },
						{ label: 'Activity List', route: '/activity/list' },
					],
				},
        // {
        //   icon: 'assets/icons/heroicons/outline/bookmark.svg',
        //   label: 'All Activity',
        //   route: '/activity',
        //   children: [
        //     { label: 'Activity List', route: '/activity/list' },
        //   ],
        //   role: 'admin',
        // },
			],
		},
		// {
		// 	group: 'Config',
		// 	separator: false,
		// 	items: [
		// 		{
		// 			icon: 'assets/icons/heroicons/outline/cog.svg',
		// 			label: 'Settings',
		// 			route: '/settings',
		// 		},
		// 		{
		// 			icon: 'assets/icons/heroicons/outline/bell.svg',
		// 			label: 'Notifications',
		// 			route: '/gift',
		// 		},
		// 	],
		// },
	];
}
