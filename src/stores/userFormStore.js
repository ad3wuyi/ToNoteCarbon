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
		isSubmitted: false,
		loading: false,
	}),
	actions: {
		setIsSubmitted(params) {
			this.isSubmitted = params;
		},
		setPhone(phone) {
			this.phone = phone;
		},
		setCompany(company) {
			this.company = company;
		},
		setIdentity(file) {
			this.identity = file;
		},
		reset() {
			this.$reset();
		},
		async submitForm() {
			const formData = new FormData();
			if (this.identity) formData.append('identity', this.identity);
			formData.append('company', this.company);
			formData.append('email', this.email);
			formData.append('phone', this.phone);

			this.loading = true;

			try {
				const response = await axios.post('https://test-api.gettonote.com/api/v1/legal-docs/documents/user', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Accept: 'application/json',
					},
				});
				toast.success(response.data.message);
				this.isSubmitted = true;

				// Save user ID from response
				this.userId = response.data.user.id;
			} catch (error) {
				toast.error(error.response.data.message);
				console.error('Error uploading files:', error);
			} finally {
				// this.isSubmitted = false;
				this.loading = false;
			}
		},
	},
});
