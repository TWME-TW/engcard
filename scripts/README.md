# Translation Generator

Automatic multi-language translation generator for locale files using AI.

## Overview

This script automatically generates missing translations for the application's locale files by comparing all target language files with the source English file and translating any missing keys using OpenAI's GPT models.

## Prerequisites

1. **OpenAI API Key**: You need a valid OpenAI API key with access to GPT models
2. **Environment Variable**: Set `OPENAI_API_KEY` in your environment

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

## Usage

### Translate All Languages
Generate missing translations for all supported languages:
```bash
npm run translate:locales
```

### Translate Specific Languages
Generate translations for specific language codes:
```bash
npm run translate:single zh-TW ja ko
```

## Supported Languages

- `en` - English (source language)
- `zh-TW` - Traditional Chinese
- `ja` - Japanese
- `ko` - Korean
- `es` - Spanish
- `fr` - French
- `de` - German

## How It Works

1. **Detection**: The script compares the source `en.json` file with each target language file
2. **Analysis**: It identifies missing translation keys in target files
3. **Translation**: Uses OpenAI GPT to generate appropriate translations with context
4. **Updates**: Automatically updates the target language files with new translations
5. **Preserves**: Existing translations are never overwritten

## Features

- **Context-Aware**: Provides context about the application (flashcard/vocabulary learning)
- **Batch Processing**: Translates multiple keys efficiently with rate limiting
- **Error Handling**: Gracefully handles API errors and continues processing
- **Preservation**: Never overwrites existing translations
- **Formatting**: Maintains JSON structure and formatting
- **Variables**: Preserves template variables like `{{word}}` in translations

## Output

The script provides detailed progress information:
```
🚀 Starting Automatic Multi-language Translation Generator
📚 Source language: English (en)
🎯 Target languages: Traditional Chinese, Japanese, Korean

🌐 Processing Traditional Chinese (zh-TW)...
📝 Found 15 missing keys for Traditional Chinese
🔄 Translating missing keys...
✅ Traditional Chinese updated! Added 15 translations
```

## File Structure

```
public/locales/
├── en.json       # Source file (English)
├── zh-TW.json    # Traditional Chinese
├── ja.json       # Japanese
├── ko.json       # Korean
├── es.json       # Spanish
├── fr.json       # French
└── de.json       # German
```

## Notes

- The script respects OpenAI API rate limits with built-in delays
- Only missing keys are translated; existing translations remain unchanged
- The script can be run multiple times safely
- Translation quality depends on providing clear context in the source English text

## Troubleshooting

**API Key Error**: Make sure `OPENAI_API_KEY` is set in your environment
```bash
echo $OPENAI_API_KEY  # Should display your API key
```

**Rate Limits**: The script includes automatic rate limiting, but you may need to wait if you hit API limits

**Translation Quality**: If translations seem incorrect, consider:
- Making the English source text clearer
- Adding more context to ambiguous terms
- Manually reviewing and adjusting translations after generation