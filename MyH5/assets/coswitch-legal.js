(function () {
    const storageKey = "coswitch_legal_lang";

    function normalizeLanguage(value) {
        if (!value) return "en";

        const language = String(value).trim().toLowerCase();

        if (
            language.startsWith("zh-hans") ||
            language.startsWith("zh-cn") ||
            language.startsWith("zh-sg")
        ) {
            return "zh-Hans";
        }

        if (language.startsWith("ja")) return "ja";
        if (language.startsWith("ko")) return "ko";
        if (language.startsWith("ar")) return "ar";

        return "en";
    }

    function safeGetStoredLanguage() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function safeSetStoredLanguage(language) {
        try {
            localStorage.setItem(storageKey, language);
        } catch (error) {
            return null;
        }
    }

    function detectBrowserLanguage() {
        const candidates = [];

        if (Array.isArray(navigator.languages)) {
            candidates.push(...navigator.languages);
        }

        if (navigator.language) {
            candidates.push(navigator.language);
        }

        for (const candidate of candidates) {
            const normalized = normalizeLanguage(candidate);
            if (normalized) {
                return normalized;
            }
        }

        return "en";
    }

    function applyLanguage(language, persistSelection) {
        const normalized = normalizeLanguage(language);
        const root = document.documentElement;

        root.dataset.language = normalized;
        root.lang = normalized === "zh-Hans" ? "zh-CN" : normalized;
        root.dir = normalized === "ar" ? "rtl" : "ltr";

        document.querySelectorAll("[data-set-language]").forEach((button) => {
            const active = button.getAttribute("data-set-language") === normalized;
            button.setAttribute("aria-pressed", String(active));
        });

        const activeSection = document.querySelector(
            `[data-lang-section="${normalized}"]`
        );

        if (activeSection && activeSection.dataset.pageTitle) {
            document.title = activeSection.dataset.pageTitle;
        }

        if (persistSelection) {
            safeSetStoredLanguage(normalized);
        }
    }

    const storedLanguage = safeGetStoredLanguage();
    const initialLanguage = storedLanguage
        ? normalizeLanguage(storedLanguage)
        : detectBrowserLanguage() || "en";

    document.documentElement.dataset.language = initialLanguage;
    document.documentElement.lang = initialLanguage === "zh-Hans" ? "zh-CN" : initialLanguage;
    document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr";

    document.addEventListener("DOMContentLoaded", function () {
        applyLanguage(document.documentElement.dataset.language || initialLanguage, false);

        document.querySelectorAll("[data-set-language]").forEach((button) => {
            button.addEventListener("click", function () {
                const nextLanguage = button.getAttribute("data-set-language");
                applyLanguage(nextLanguage, true);
            });
        });

        document.querySelectorAll("[data-current-year]").forEach((element) => {
            element.textContent = String(new Date().getFullYear());
        });
    });
})();
