import has from 'lodash/has';
import get from 'lodash/get';

const localesFiles = {
  'en': require('json-loader!yaml-loader!../../locales/en.yml'),
  'es': require('json-loader!yaml-loader!../../locales/es.yml')
};

/**
 * Default locales, this should be overriden by config file
 */

class i18n {
  constructor(translations) {
    this.locales = {'en': 'en', 'es': 'es'};

    /**
     * Register locales
     */

    try {
      const locale = this.getLocale();
      this.setLocale(locale);

      this.language = this.locales[locale.split('-')[0]] || 'en';

      this.loadTranslations(translations);

    } catch (err) {
      console.error(err);
    }
  }

  loadTranslations = (translations) => {

    try {
      if (typeof translations == 'undefined'){

        // Translations need to be loaded from translations or localesFiles.
        this.translations = localesFiles[this.language];
      } else {
        this.translations = translations[this.language];
      }
    }
    catch(err) {

      // To Do: get configuration for default translation
      this.translations = localesFiles['en'];
    }
  }

  setLocale = (locale) => {
    try {
      localStorage.setItem('locale', locale);
    } catch (err) {
      console.error(err);
    }
  };

  getLocale = () => (
    localStorage.getItem('locale') || navigator.language || 'en-US'
  );

  /**
   * Expose the translation function
   *
   * it takes a string with the translation key and returns
   * the translation value or the key itself if not found
   * it works with nested translations (my.page.title)
   *
   * any extra parameters are optional and replace a variable marked by {0}, {1}, etc in the translation.
   */

  t = (key, ...replacements) => {
    if (has(this.translations, key)) {
      let translation = get(this.translations, key);

      // replace any {n} with the arguments passed to this method
      replacements.forEach((str, i) => {
        translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str);
      });
      return translation;
    } else {
      console.warn(`${key} language key not set`);
      return key;
    }
  };
}

export default i18n;
