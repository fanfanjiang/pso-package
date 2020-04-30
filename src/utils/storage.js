export default class Storage {
    static get(name) {
        if (!name) return;
        return window.localStorage.getItem(name);
    }
    static set(name, content) {
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        window.localStorage.setItem(name, content);
    }
    static remove(name) {
        if (!name) return;
        window.localStorage.removeItem(name);
    }
}
