import CryptoJS from 'crypto-js';

const SECRET_KEY = 'ToNotePen';

export const hashPersistedStatePlugin = ({ store }) => {
	store.$subscribe((mutation, state) => {
		const hashedState = CryptoJS.AES.encrypt(JSON.stringify(state), SECRET_KEY).toString();
		localStorage.setItem(store.$id, hashedState);
	});

	const savedState = localStorage.getItem(store.$id);
	if (savedState) {
		const bytes = CryptoJS.AES.decrypt(savedState, SECRET_KEY);
		const originalState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		store.$patch(originalState);
	}
};
