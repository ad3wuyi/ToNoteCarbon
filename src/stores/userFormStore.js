import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useUserFormStore = defineStore('userFormStore', {
	state: () => ({
		company: '',
		email: '',
		phone: '',
		identity: null,
		userId: null,
	}),
	actions: {
		setCompany(company) {
			this.company = company;
		},
		setIdentity(file) {
			this.identity = file;
		},
		// setFormData(data) {
		// 	this.company = data.company !== undefined ? data.company : this.company;
		// 	this.email = data.email !== undefined ? data.email : this.email;
		// 	this.phone = data.phone !== undefined ? data.phone : this.phone;
		// 	this.identity = data.identity !== undefined ? data.identity : this.identity;
		// },
		// reset() {
		//   this.$reset();
		// },
		async submitForm() {
			const formData = new FormData();
			if (this.identity) formData.append('identity', this.identity);
			formData.append('company', this.company);
			formData.append('email', this.email);
			formData.append('phone', this.phone);

			try {
				const response = await axios.post('https://test-api.gettonote.com/api/v1/legal-docs/documents/user', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Accept: 'application/json',
					},
				});
				toast.success(response.data.message);
				console.log(response.data);

				// Save user ID from response
				this.userId = response.data.user.id;
				// this.reset();
			} catch (error) {
				console.log(error.response.data);
				toast.error(error.response.data.message);
				console.error('Error uploading files:', error);
			}
		},
	},
});
