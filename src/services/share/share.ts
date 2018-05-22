import { Injectable } from '@angular/core';

@Injectable()
export class ShareService {
	
	adminName: string;

	constructor() {
		this.adminName = 'Name';
	}

	setAdminName(adminName) {
		this.adminName = adminName;
	}

	getAdminName() {
		return this.adminName;
	}
}