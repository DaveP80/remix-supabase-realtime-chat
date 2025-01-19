// Borrowed & modified from https://github.com/jenseng/abuse-the-platform/blob/main/app/utils/singleton.ts
// Thanks @jenseng!
export const singleton = <T> (
    name: string,
    valueFactory: () => T
): T => {
    const g = global as any;
    g.__singletons ??= {};
    g.__singletons[name] ??= valueFactory();
    return g.__singletons[name];
};
