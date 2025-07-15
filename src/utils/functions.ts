export function shuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function isChinese(str: string): boolean {
	return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
}

export function isHavingSpace(str: string): boolean {
	return /\s/.test(str);
}

export function isJapanese(str: string): boolean {
	return /[ぁ-ゔゞァ-・ヽヾ゛゜ー]/.test(str);
}

export function isEnglish(str: string): boolean {
	return /^[a-zA-Z]+$/.test(str);
}

export function isKorean(str: string): boolean {
	return /[가-힣]/.test(str);
}

export function isSpanish(str: string): boolean {
	// Basic Spanish character detection including accents and ñ
	return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(str);
}

export function isFrench(str: string): boolean {
	// Basic French character detection including accents and special characters
	return /^[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+$/.test(str);
}

export function isGerman(str: string): boolean {
	// Basic German character detection including umlauts and ß
	return /^[a-zA-ZäöüÄÖÜß\s]+$/.test(str);
}
