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
