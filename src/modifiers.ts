import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

type ModifierType = "keyboard" | "mouse";

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

const modifiers = (type: ModifierType): CompletionItem[] => {
    if (type === "mouse") {
        return mouseModifiers.map((modifier) => ({
            label: modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            data: {
                type: "mouseModifier",
                value: modifier,
            },
            documentation: `Mouse modifier for Alpine.js. Use with x-on: or @ directives.`,
        }));
    }

    return keyboardModifiers.map((modifier) => ({
        label: modifier,
        kind: CompletionItemKind.EnumMember,
        insertText: modifier,
        insertTextFormat: InsertTextFormat.PlainText,
        data: {
            type: "keyModifier",
            value: modifier,
        },
        documentation: `Key modifier for Alpine.js. Use with x-on: or @ directives.`,
    }));
};

export { keyboardModifiers, mouseModifiers, modifiers };
export type { ModifierType as AlpineModifierType };
