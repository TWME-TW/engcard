import { CardProps, Example, DefinitionData, Blocks } from '@/type';
import { Lang } from '@/types/lang';

/**
 * Filters card content based on target language preference
 * If target language content is not available, falls back to English or any available language
 */
export function filterCardByTargetLanguage(
	card: CardProps,
	targetLanguage: Lang
): CardProps {
	if (!card.blocks || card.blocks.length === 0) {
		return card;
	}

	const filteredBlocks: Blocks[] = card.blocks.map((block) => ({
		...block,
		definitions: block.definitions.map((definition) => ({
			...definition,
			definition: filterDefinitionData(definition.definition, targetLanguage),
			example: definition.example
				? definition.example.map((exampleGroup) =>
						filterExampleData(exampleGroup, targetLanguage)
				  )
				: undefined,
		})),
	}));

	return {
		...card,
		blocks: filteredBlocks,
	};
}

/**
 * Filters definition data to prioritize target language
 */
function filterDefinitionData(
	definitions: DefinitionData[],
	targetLanguage: Lang
): DefinitionData[] {
	// First try to find definitions in target language
	const targetLangDefs = definitions.filter((def) => def.lang === targetLanguage);
	if (targetLangDefs.length > 0) {
		return targetLangDefs;
	}

	// Fall back to English if target language not available
	const englishDefs = definitions.filter((def) => def.lang === 'en');
	if (englishDefs.length > 0) {
		return englishDefs;
	}

	// Fall back to any available language
	return definitions.length > 0 ? [definitions[0]] : definitions;
}

/**
 * Filters example data to prioritize target language
 */
function filterExampleData(examples: Example[], targetLanguage: Lang): Example[] {
	// First try to find examples in target language
	const targetLangExamples = examples.filter((ex) => ex.lang === targetLanguage);
	if (targetLangExamples.length > 0) {
		return targetLangExamples;
	}

	// Fall back to English if target language not available
	const englishExamples = examples.filter((ex) => ex.lang === 'en');
	if (englishExamples.length > 0) {
		return englishExamples;
	}

	// Fall back to any available language
	return examples.length > 0 ? [examples[0]] : examples;
}