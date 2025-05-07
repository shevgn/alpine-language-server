export type XDataProps = {
    name: string;
    kind: CompletionItemKind;
};

export type XDataTag = {
    tag: string;
    xData: string;
    range: { start: number; end: number };
    parentData?: string;
};

export type Documented = {
    documentation: string;
};

export type DocumentedMarkup = {
    documentation: {
        kind: "markdown";
        value: string;
    };
};

export type Named = {
    name: string;
};
