/**
 * Czech localization.
 */

var Constants = require('../constants/Constants');

module.exports = {
    'locale': 'cs',

    'messages': {
        'add': 'Přidat',
        'back': 'Zpět',
        'cancel': 'Zrušit',
        'open': 'Otevřít',
        'close': 'Zavřít',
        'cancel-tooltip': 'Zrušit a zahodit změny',
        'save': 'Uložit',
        'saving': 'Ukládám...',
        'delete': 'Smazat',
        'headline': 'Název',
        'name': 'Název',
        'summary': 'Shrnutí',
        'narrative': 'Popis',
        'table-actions': 'Akce',
        'table-edit': 'Editovat',
        'author': 'Autor',
        'description': 'Popis',
        'select.default': '--- Vybrat ---',
        'yes': 'Ano',
        'no': 'Ne',
        'unknown': 'Neznámé',
        'please-wait': 'Prosím, čekejte...',
        'actions': 'Akce',

        'login.title': Constants.APP_NAME + ' - Přihlášení',
        'login.username': 'Uživatelské jméno',
        'login.password': 'Heslo',
        'login.submit': 'Přihlásit',
        'login.register': 'Registrace',
        'login.error': 'Přihlášení se nezdařilo.',
        'login.progress-mask': 'Přihlašuji...',

        'main.dashboard-nav': 'Hlavní strana',
        'main.users-nav': 'Uživatelé',
        'main.institutions-nav': 'Kliniky',
        'main.records-nav': 'Záznamy pacientů',
        'main.logout': 'Odhlásit se',
        'main.my-profile': 'Můj profil',

        'dashboard.welcome': 'Dobrý den, {name}, vítejte v ' + Constants.APP_NAME + '.',
        'dashboard.create-tile': 'Vytvořit záznam',
        'dashboard.users-tile': 'Uživatelé',
        'dashboard.institutions-tile': 'Kliniky',
        'dashboard.records-tile': 'Záznamy pacientů',

        'notfound.title': 'Nenalezeno',
        'notfound.msg-with-id': 'Záznam \'{resource}\' s identifikátorem {identifier} nenalezen.',
        'notfound.msg': 'Záznam \'{resource}\' nenalezen.',

        'users.panel-title': 'Uživatelé',
        'users.create-user': 'Přidat uživatele',
        'users.email': 'Email',
        'users.open-tooltip': 'Zobrazit či upravit detaily o tomto uživateli',
        'users.delete-tooltip': 'Smazat tohoto uživatele',
        'users.add-new-user': 'Přidat nového uživatele',
        'users.add-existing-user': 'Přidat existujícího uživatele',
        'users.back-to-institution': 'Zpět do instituce',

        'delete.dialog-title': 'Smazat položku?',
        'delete.dialog-content': 'Určitě chcete odstranit {itemLabel}?',

        'user.panel-title': 'Uživatel',
        'user.first-name': 'Jméno',
        'user.last-name': 'Příjmení',
        'user.username': 'Uživatelské jméno',
        'user.password': 'Heslo',
        'user.password-confirm': 'Potvrzení hesla',
        'user.passwords-not-matching-tooltip': 'Hesla se neshodují',
        'user.is-admin': 'Administrátor?',
        'user.save-success': 'Uživatel úspěšně uložen',
        'user.save-error': 'Uživatele se nepodařilo uložit. Odpověď serveru: {error}',

        'institutions.panel-title': 'Kliniky',
        'institutions.create-institution': 'Vytvořit kliniku',
        'institutions.open-tooltip': 'Zobrazit či upravit detaily o této klinice',
        'institutions.delete-tooltip': 'Smazat tuto kliniku',

        'institution.panel-title': 'Klinika',
        'institution.name': 'Název kliniky',
        'institution.email': 'Kontaktní email',
        'institution.created': 'Klinika zaregistrována {date}',
        'institution.members.panel-title': 'Zaměstnanci kliniky',
        'institution.patients.panel-title': 'Pacienti kliniky',
        'institution.save-success': 'Klinika úspěšně uložena.',
        'institution.save-error': 'Kliniku se nepodařilo uložit. Odpověď serveru: {}.',

        'records.panel-title': 'Záznamy o pacientech',
        'records.local-name': 'Identifikátor pacienta',
        'records.completion-status': 'Stav vyplnění',
        'records.completion-status-tooltip.complete': 'Všechny povinné informace o pacientovi byly vyplněny.',
        'records.completion-status-tooltip.incomplete': 'Některé povinné informace o pacientovi ještě nebyly vyplněny.',
        'records.last-modified': 'Naposledy upraveno',
        'records.open-tooltip': 'Zobrazit či upravit záznam tohoto pacienta',
        'records.delete-tooltip': 'Smazat tento záznam',

        'record.panel-title': 'Záznam o pacientovi {identifier}',
        'record.form-title': 'Details',
        'record.institution': 'Pacient léčen na klinice',
        'record.created-by-msg': 'Vytvořil(a) {name} {date}.',
        'record.last-edited-msg': 'Naposledy upravil(a) {name} {date}.',
        'record.save-success': 'Záznam o pacientovi úspěšně uložen.',
        'record.save-error': 'Záznam se nepodařilo uložit. Odpověď serveru: {}.',
        'record.form.please-wait': 'Nahrávám formulář, prosím, čekejte...',

        'help.local-name': 'Účelem tohoto atributu je pomoci vám identifikovat anonymizované pacienty. Můžete použít např. číslování pacientů ("pacient_1", "pacient_2") či iniciály pacientů ("M.E.")',

        'wizard.previous': 'Zpět',
        'wizard.next': 'Další',
        'wizard.finish': 'Dokončit'
    }
};
