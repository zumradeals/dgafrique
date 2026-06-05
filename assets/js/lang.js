/* DG Afrique FR/EN language switcher */
(function () {
  const storageKey = "dga-lang";
  const supportedLanguages = ["fr", "en"];
  let currentDictionary = {};

  function getStoredLanguage() {
    const stored = localStorage.getItem(storageKey);
    return supportedLanguages.includes(stored) ? stored : "fr";
  }

  function resolveKey(dictionary, key) {
    return key.split(".").reduce((value, segment) => {
      if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
        return value[segment];
      }
      return undefined;
    }, dictionary);
  }

  async function loadDictionary(lang) {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Unable to load language: ${lang}`);
    }
    return response.json();
  }

  function applyTranslations(dictionary, lang) {
    document.documentElement.lang = lang;
    window.DGA_TRANSLATIONS = dictionary;
    currentDictionary = dictionary;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const translated = resolveKey(dictionary, element.dataset.i18n);
      if (typeof translated === "string") {
        element.textContent = translated;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const pairs = element.dataset.i18nAttr.split(/[;,]/).map((pair) => pair.trim()).filter(Boolean);
      pairs.forEach((pair) => {
        const separatorIndex = pair.indexOf(":");
        if (separatorIndex === -1) return;
        const attr = pair.slice(0, separatorIndex).trim();
        const key = pair.slice(separatorIndex + 1).trim();
        const translated = resolveKey(dictionary, key);
        if (attr && typeof translated === "string") {
          element.setAttribute(attr, translated);
        }
      });
    });

    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.classList.toggle("lang-active", button.dataset.langButton === lang);
    });
  }

  async function setLanguage(lang) {
    const nextLang = supportedLanguages.includes(lang) ? lang : "fr";
    localStorage.setItem(storageKey, nextLang);

    try {
      const dictionary = await loadDictionary(nextLang);
      applyTranslations(dictionary, nextLang);
    } catch (error) {
      console.error(error);
    }
  }

  window.setLanguage = setLanguage;
  window.getDGATranslation = (key) => resolveKey(currentDictionary, key);

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(getStoredLanguage());
  });
})();
