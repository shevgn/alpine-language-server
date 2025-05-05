import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

type Event = {
    name: string;
    documentation: string;
};

const keyboardEvents: Event[] = [
    {
        name: "keyup",
        documentation: `Keyup event handler.`,
    },
    {
        name: "keydown",
        documentation: `Keydown event handler.`,
    },
    {
        name: "keypress",
        documentation: `Keypress event handler.`,
    },
    {
        name: "input",
        documentation: `Input event handler.`,
    },
    {
        name: "change",
        documentation: `Change event handler.`,
    },
    {
        name: "submit",
        documentation: `Submit event handler.`,
    },
];

const mouseEvents: Event[] = [
    {
        name: "click",
        documentation: `Click event handler.`,
    },
    {
        name: "dblclick",
        documentation: `Double click event handler.`,
    },
    {
        name: "auxclick",
        documentation: `Auxiliary click event handler.`,
    },
    {
        name: "context",
        documentation: `Context click event handler.`,
    },
    {
        name: "mouseover",
        documentation: `Mouse over event handler.`,
    },
    {
        name: "mousemove",
        documentation: ` Mouse move event handler.`,
    },
    {
        name: "mouseenter",
        documentation: `Mouse enter event handler.`,
    },
    {
        name: "mouseleave",
        documentation: `Mouse leave event handler.`,
    },
    {
        name: "mouseout",
        documentation: `Mouse out event handler.`,
    },
    {
        name: "mouseup",
        documentation: `Mouse up event handler.`,
    },
    {
        name: "mousedown",
        documentation: `Mouse down event handler.`,
    },
];

const events = (): CompletionItem[] => {
    return [...mouseEvents, ...keyboardEvents].map((event) => ({
        label: event.name,
        kind: CompletionItemKind.Event,
        insertText: event.name,
        insertTextFormat: InsertTextFormat.PlainText,
        documentation: event.documentation,
    }));
};

export { events, keyboardEvents, mouseEvents };
export type { Event as AlpineEvent };
