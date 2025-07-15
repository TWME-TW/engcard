'use client';

import { useTranslation } from '@/context/LanguageContext';
import useCookie from '@/hooks/cookie';
import { useLocalStorage } from '@/hooks/localstorage';

export const LanguageSwitcher = ({ short = false }: { short?: boolean }) => {
	const { t, locale } = useTranslation();

	const { setCookie } = useCookie();
	const [, setLocalStorage] = useLocalStorage<string>('languageCache', 'en');

	async function changeLanguage(newLocale: string) {
		setLocalStorage(newLocale);
		setCookie('language', newLocale, 200);
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	// Available interface languages (currently only supporting en and zh-TW)
	const interfaceLanguages = [
		{ code: 'en', label: short ? t('common.language.english') : 'English' },
		{ code: 'zh-TW', label: short ? t('common.language.traditionalChinese') : '繁體中文' },
	];

	return (
		<div className='flex items-center space-x-2 p-2'>
			<select
				value={locale}
				onChange={(e) => changeLanguage(e.target.value)}
				className='text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 m-1 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-blue-500 dark:focus:border-blue-300'
			>
				{interfaceLanguages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.label}
					</option>
				))}
			</select>
		</div>
	);
};
