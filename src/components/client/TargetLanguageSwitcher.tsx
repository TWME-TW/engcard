'use client';

import { LangEnum, LangCodeToName } from '@/types/lang';

interface TargetLanguageSwitcherProps {
	value?: LangEnum;
	onChange: (targetLanguage: LangEnum) => void;
}

export const TargetLanguageSwitcher = ({ 
	value = LangEnum.EN, 
	onChange 
}: TargetLanguageSwitcherProps) => {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value as LangEnum)}
			className='text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 m-1 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-blue-500 dark:focus:border-blue-300'
		>
			{Object.values(LangEnum).map((lang) => (
				<option key={lang} value={lang}>
					{LangCodeToName(lang)}
				</option>
			))}
		</select>
	);
};