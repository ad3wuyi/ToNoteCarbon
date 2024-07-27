import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useUserFormStore } from './userFormStore';
import router from '../router';

const toast = useToast();

export const useAffidavitFormStore = defineStore('affidavitForm', {
	state: () => ({
		genders: [],
		nationalities: [],
		religions: [],
		states: [],
		agree: false,
		full_name: '',
		gender: '',
		occupation: '',
		religion: '',
		nationality: '',
		address: '',
		state: '',
		swear_date: '',
		photo: null,
		signature: null,
	}),
	actions: {
		async fetchGenders() {
			try {
				const response = await axios.get('https://test-api.gettonote.com/api/v1/legal-docs/helpers/genders');
				this.genders = Object.entries(response.data.genders).map(([code, name]) => ({ code, name }));
			} catch (error) {
				console.error('Error fetching genders:', error);
				toast.error('Failed to fetch genders');
			}
		},
		async fetchNationalities() {
			try {
				const response = await axios.get('https://test-api.gettonote.com/api/v1/legal-docs/helpers/nationalities');
				this.nationalities = response.data.nationalities;
			} catch (error) {
				console.error('Error fetching nationalities:', error);
				toast.error('Failed to fetch nationalities');
			}
		},
		async fetchReligions() {
			try {
				const response = await axios.get('https://test-api.gettonote.com/api/v1/legal-docs/helpers/religions');
				this.religions = Object.entries(response.data.religions).map(([code, name]) => ({ code, name }));
			} catch (error) {
				console.error('Error fetching religions:', error);
				toast.error('Failed to fetch religions');
			}
		},
		async fetchStates(countryCode) {
			try {
				const response = await axios.get(
					`https://test-api.gettonote.com/api/v1/legal-docs/helpers/countries/${countryCode}/states`
				);
				this.states = Object.entries(response.data.states).map(([code, name]) => ({ code, name }));
			} catch (error) {
				console.error('Error fetching states:', error);
				toast.error('Failed to fetch states');
			}
		},
		setAgreement(agreement) {
			this.agree = agreement;
		},
		setPhotograph(file) {
			this.photo = file;
		},
		setSignature(file) {
			this.signature = file;
		},
		reset() {
			this.$reset();
		},
		async uploadFiles() {
			const userStore = useUserFormStore(); // Access userFormStore

			if (!this.photo && !this.signature) {
				toast.error('Please upload a photograph and a signature');
				return;
			}

			const formData = new FormData();

			// Add personal information to formData
			formData.append('user_id', userStore.userId);
			formData.append('company', userStore.company);
			formData.append('agree', this.agree ? 1 : 0);
			formData.append('full_name', this.full_name);
			formData.append('gender', this.gender);
			formData.append('occupation', this.occupation);
			formData.append('religion', this.religion);
			formData.append('nationality', this.nationality);
			formData.append('address', this.address);
			formData.append('state', this.state);
			formData.append('swear_date', this.swear_date);

			// Add files to formData if they exist
			if (this.photo) formData.append('photo', this.photo);
			if (this.signature) formData.append('signature', this.signature);

			try {
				const response = await axios.post('https://test-api.gettonote.com/api/v1/legal-docs/documents/data', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Accept: 'application/json',
					},
				});

				toast.success(response.data.message);
				router.push({ name: 'completed' });

				// Reset the form stores upon successful submission
				this.reset();
				userStore.reset();
			} catch (error) {
				console.error('Error submitting data:', error);
				toast.error(error.response.data.message);
			}
		},
	},
});
