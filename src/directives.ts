import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

const directives = (): CompletionItem[] => {
    return [
        {
            label: "x-data",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-data="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Defines a chunk of HTML as an Alpine component and provides the reactive data for that component to reference.
`,
        },
        {
            label: "x-on:",
            kind: CompletionItemKind.Keyword,
            insertText: "x-on:${1}",
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to easily run code on dispatched DOM events.
`,
        },
        {
            label: "x-init",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-init="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to run JavaScript code when the component is initialized.
            `,
        },
        {
            label: "x-show",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-show="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to conditionally show or hide an element based on a boolean value.
            `,
        },
    ];
};

export { directives };
