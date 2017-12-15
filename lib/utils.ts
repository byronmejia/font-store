export function minifyCss(css: string) {
    const regex  = /@font-face\s*\{([^]+?)\}/gi;
    const format = 'woff';
    let fontFace: RegExpExecArray | null;
    let outputCSS: string = '';

    while ((fontFace = regex.exec(css)) !== null) {
        outputCSS += '@font-face{' +
            fontFace[1]
                .split(';')
                .map((dec: string): string => {
                    const declarations = dec.split(/:(?!\/\/)/);

                    if (declarations.length !== 2) {
                        return '';
                    }

                    const property    = declarations[0].trim();
                    let value: string = declarations[1].trim();

                    if (property === 'src') {
                        let newValueSplits: Array<string> = value
                            .split(',')
                            .filter((urlProperty: string): boolean => {
                                const match = /format\(['"]?(.*?)['"]?\)/g.exec(urlProperty);
                                if (!match) {
                                    return false;
                                }
                                return match[1] === format;
                            });

                        if (newValueSplits[0]) {
                            value = value[0].trim();
                        } else {
                            return '';
                        }
                    }

                    return [property, value].join(':');
                })
                .filter((dec: string): boolean => {
                    if (!dec) {
                        return false;
                    }
                    return dec !== 'font-style:normal';
                })
                .join(';') +
            '}';
    }
    return outputCSS;
}

export function extractUrls(css: string) {
    const format = /url\(['"]?(.*?)['"]?\)/g;
    const matches: Array<string> = [];
    let match: RegExpExecArray | null;

    while((match = format.exec(css)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}
