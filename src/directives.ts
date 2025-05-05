import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

type Directive = {
    name: string;
    description: string;
    insertText?: string;
};

const directivesList: Directive[] = [
    {
        name: "x-data",
        description:
            "Defines a chunk of HTML as an Alpine component and provides the reactive data for that component to reference.",
    },
    {
        name: "x-init",
        description:
            "Allows you to hook into the initialization phase of any element in Alpine.",
    },
    {
        name: "x-show",
        description:
            "Allows you to conditionally show or hide an element based on a boolean value.",
    },
    {
        name: "x-bind",
        description: "Allows you to bind HTML attributes to Alpine data.",
        insertText: 'x-bind:${1}="${2}"',
    },
    {
        name: "x-on",
        description: "Allows you to easily run code on dispatched DOM events.",
        insertText: 'x-on:${1}="${2}"',
    },
    {
        name: "x-text",
        description:
            "Allows you to set the text content of an element to the result of a given expression.",
    },
    {
        name: "x-html",
        description:
            "Allows you to set the innerHTML property of an element to the result of a given expression.",
    },
];

const directives = (): CompletionItem[] => {
    return directivesList.map((directive) => ({
        label: directive.name,
        kind: CompletionItemKind.Keyword,
        documentation: directive.description,
        insertText: directive.insertText
            ? directive.insertText
            : directive.name + '="${1}"',
        insertTextFormat: InsertTextFormat.Snippet,
    }));
};

export { directives };
