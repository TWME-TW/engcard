#!/usr/bin/env node

/**
 * Automatic Multi-language Translation Generator
 * 
 * This script automatically generates missing translations for locale files
 * using AI translation services. It compares all locale files with the source
 * English file and generates missing keys.
 * 
 * Usage: npm run translate:locales
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SOURCE_LANG = 'en';
const TARGET_LANGUAGES = ['zh-TW', 'ja', 'ko', 'es', 'fr', 'de'];

// Language name mappings for AI prompts
const LANGUAGE_NAMES = {
  'en': 'English',
  'zh-TW': 'Traditional Chinese',
  'ja': 'Japanese', 
  'ko': 'Korean',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Recursively get all translation keys from an object
 */
function getTranslationKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...getTranslationKeys(value, currentKey));
    } else {
      keys.push(currentKey);
    }
  }
  
  return keys;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

/**
 * Set nested value in object using dot notation
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Load JSON file safely
 */
function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Could not load ${filePath}, creating empty object`);
    return {};
  }
}

/**
 * Save JSON file with proper formatting
 */
function saveJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, '\t') + '\n', 'utf8');
}

/**
 * Translate text using OpenAI
 */
async function translateText(text, targetLanguage, context = '') {
  const prompt = `Translate the following text to ${LANGUAGE_NAMES[targetLanguage]}.

Context: This is for a flashcard/vocabulary learning application interface.
${context ? `Additional context: ${context}` : ''}

Text to translate: "${text}"

Instructions:
- Provide only the translation, no explanations
- Keep the tone appropriate for a learning application
- Maintain any placeholder variables like {{word}} exactly as they are
- For technical terms, use commonly accepted translations in the target language
- Keep the translation concise and user-friendly

Translation:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in educational software interfaces. Provide accurate, concise translations that are appropriate for a vocabulary learning application.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Translation error for "${text}" to ${targetLanguage}:`, error.message);
    return text; // Return original text if translation fails
  }
}

/**
 * Batch translate multiple texts with rate limiting
 */
async function batchTranslate(texts, targetLanguage, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const promises = batch.map(({ key, text, context }) => 
      translateText(text, targetLanguage, context)
        .then(translation => ({ key, translation }))
    );
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Rate limiting: wait between batches
    if (i + batchSize < texts.length) {
      console.log(`Translated ${i + batchSize}/${texts.length} keys for ${targetLanguage}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Find missing translation keys
 */
function findMissingKeys(sourceData, targetData) {
  const sourceKeys = getTranslationKeys(sourceData);
  const missingKeys = [];
  
  for (const key of sourceKeys) {
    const targetValue = getNestedValue(targetData, key);
    if (targetValue === undefined || targetValue === '') {
      const sourceValue = getNestedValue(sourceData, key);
      missingKeys.push({
        key,
        text: sourceValue,
        context: key.split('.')[0] // Use top-level key as context
      });
    }
  }
  
  return missingKeys;
}

/**
 * Main translation function
 */
async function translateLocale(targetLanguage) {
  console.log(`\n🌐 Processing ${LANGUAGE_NAMES[targetLanguage]} (${targetLanguage})...`);
  
  // Load source and target files
  const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
  const targetFile = path.join(LOCALES_DIR, `${targetLanguage}.json`);
  
  const sourceData = loadJsonFile(sourceFile);
  const targetData = loadJsonFile(targetFile);
  
  // Find missing keys
  const missingKeys = findMissingKeys(sourceData, targetData);
  
  if (missingKeys.length === 0) {
    console.log(`✅ ${LANGUAGE_NAMES[targetLanguage]} is up to date! (0 missing keys)`);
    return;
  }
  
  console.log(`📝 Found ${missingKeys.length} missing keys for ${LANGUAGE_NAMES[targetLanguage]}`);
  
  // Translate missing keys
  console.log(`🔄 Translating missing keys...`);
  const translatedKeys = await batchTranslate(missingKeys, targetLanguage);
  
  // Update target data
  let updatedCount = 0;
  for (const { key, translation } of translatedKeys) {
    if (translation && translation !== getNestedValue(sourceData, key)) {
      setNestedValue(targetData, key, translation);
      updatedCount++;
    }
  }
  
  // Save updated file
  saveJsonFile(targetFile, targetData);
  console.log(`✅ ${LANGUAGE_NAMES[targetLanguage]} updated! Added ${updatedCount} translations`);
}

/**
 * Check environment and dependencies
 */
function checkEnvironment() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.log('Please set your OpenAI API key:');
    console.log('export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }
  
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`❌ Error: Locales directory not found: ${LOCALES_DIR}`);
    process.exit(1);
  }
  
  const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Error: Source file not found: ${sourceFile}`);
    process.exit(1);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Automatic Multi-language Translation Generator');
  console.log('='.repeat(60));
  
  // Check environment
  checkEnvironment();
  
  // Get target languages from command line or use defaults
  const languages = process.argv.slice(2).length > 0 
    ? process.argv.slice(2)
    : TARGET_LANGUAGES;
  
  console.log(`📚 Source language: ${LANGUAGE_NAMES[SOURCE_LANG]} (${SOURCE_LANG})`);
  console.log(`🎯 Target languages: ${languages.map(lang => LANGUAGE_NAMES[lang]).join(', ')}`);
  
  // Process each language
  for (const language of languages) {
    if (!LANGUAGE_NAMES[language]) {
      console.warn(`⚠️  Unknown language code: ${language}, skipping...`);
      continue;
    }
    
    try {
      await translateLocale(language);
    } catch (error) {
      console.error(`❌ Error processing ${language}:`, error.message);
    }
  }
  
  console.log('\n🎉 Translation generation complete!');
  console.log('='.repeat(60));
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  translateLocale,
  findMissingKeys,
  getTranslationKeys
};