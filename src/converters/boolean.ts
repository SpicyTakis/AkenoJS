export default class BooleanConverter {
    public static truthy = new Set([
        'true',
        't',
        'yes',
        'y',
        'on',
        'enable',
        'enabled',
        '1',
        '+',
    ]);
    public static falsy = new Set([
        'false',
        'f',
        'no',
        'n',
        'off',
        'disable',
        'disabled',
        '0',
        '-',
    ]);

    private static validate(value: string): boolean {
        const lc = value.toLowerCase();
        return this.truthy.has(lc) || this.falsy.has(lc);
    }

    public static convert(value: string): boolean | null {
        const lc = value.toLowerCase();
        if (this.truthy.has(lc)) return true;
        if (this.falsy.has(lc)) return false;
        return null;
    }
}
