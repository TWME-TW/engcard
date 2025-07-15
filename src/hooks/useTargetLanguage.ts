import { useState, useEffect } from 'react';
import { LangEnum } from '@/types/lang';

export function useTargetLanguage() {
	const [targetLanguage, setTargetLanguage] = useState<LangEnum>(LangEnum.EN);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTargetLanguage = async () => {
			try {
				const res = await fetch('/api/settings?name=targetLanguage');
				if (res.ok) {
					const data = await res.json();
					const target = data.targetLanguage || LangEnum.EN;
					setTargetLanguage(target);
				}
			} catch (error) {
				console.error('Failed to fetch target language:', error);
				// Default to English if error
				setTargetLanguage(LangEnum.EN);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTargetLanguage();
	}, []);

	return { targetLanguage, setTargetLanguage, isLoading };
}