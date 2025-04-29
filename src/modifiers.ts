import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

const behaviorModifiers = [
    "prevent",
    "stop",
    "outside",
    "window",
    "document",
    "once",
    "debounce",
    "throttle",
    "self",
    "camel",
    "dot",
    "passive",
    "capture",
];

const keyboardModifiers = [
    "enter",
    "escape",
    "tab",
    "space",
    "backspace",
    "delete",
    "up",
    "down",
    "left",
    "right",
    "shift",
    "ctrl",
    "alt",
    "slash",
    "period",
    "comma",
    "semicolon",
    "cmd",
    "meta",
    "caps-lock",
];

const mouseModifiers = ["shift", "ctrl", "alt", "meta", "cmd"];

const modifiers = (): CompletionItem[] => {
    return [
        ...mouseModifiers.map((modifier) => ({
            label: "[KEY] " + modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            documentation: `Mouse modifier for Alpine.js. Use with x-on: or @ directives.`,
        })),
        ...behaviorModifiers.map((modifier) => ({
            label: modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            documentation: `Behavior modifier for Alpine.js. Use with x-on: or @ directives.`,
        })),
        ...keyboardModifiers.map((modifier) => ({
            label: "[KEY] " + modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            documentation: `Key modifier for Alpine.js. Use with x-on: or @ directives.`,
        })),
    ];
};

export { behaviorModifiers, keyboardModifiers, mouseModifiers, modifiers };
