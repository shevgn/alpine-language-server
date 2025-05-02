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
            label: "x-init",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-init="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to hook into the initialization phase of any element in Alpine.
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
        {
            label: "x-bind",
            kind: CompletionItemKind.Keyword,
            insertText: "x-bind:${1}",
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to set HTML attributes on elements based on the result of JavaScript expressions.
            `,
        },
        {
            label: "x-on",
            kind: CompletionItemKind.Keyword,
            insertText: "x-on:${1}",
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Allows you to easily run code on dispatched DOM events.
`,
        },
        {
            label: "x-text",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-text="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Sets the text content of an element to the result of a given expression.
`,
        },
        {
            label: "x-html",
            kind: CompletionItemKind.Keyword,
            insertText: 'x-html="${1}"',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: `
Sets the "innerHTML" property of an element to the result of a given expression.
`,
        },
    ];
};

export { directives };
