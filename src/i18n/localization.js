import * as config from '../../config';
import enLang from './en';
import csLang from './cs';
import * as I18nStore from '../stores/I18nStore';

function selectNavigatorLocalization() {
    const lang = navigator.language;
    if (lang && lang === "cs" || lang === "cs-CZ" || lang === "sk" || lang === "sk-SK") {
        return csLang;
    }
    return enLang;
}

function selectEnvLocalization() {
    if (config.LANGUAGE === 'cs') {
        return csLang;
    }
    return enLang;
}

export const intlData = config.NAVIGATOR_LANGUAGE ? selectNavigatorLocalization() : selectEnvLocalization();

I18nStore.setMessages(intlData.messages);
