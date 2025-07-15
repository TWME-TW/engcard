export enum LangEnum {
	EN = 'en',
	TW = 'tw',
	JA = 'ja',
	KO = 'ko',
	ES = 'es',
	FR = 'fr',
	DE = 'de',
}

export type Lang = `${LangEnum}`;

export const Langs = Object.values(LangEnum);

export const LangCodeToName = (lang: LangEnum) =>
	({
		[LangEnum.EN]: 'English',
		[LangEnum.TW]: '繁體中文',
		[LangEnum.JA]: '日本語',
		[LangEnum.KO]: '한국어',
		[LangEnum.ES]: 'Español',
		[LangEnum.FR]: 'Français',
		[LangEnum.DE]: 'Deutsch',
	}[lang] || 'Unknown');
