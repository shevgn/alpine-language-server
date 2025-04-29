import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
} from "vscode-languageserver";

type ModifierType = "keyboard" | "mouse" | "behavior";

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

const modifiers = (type: ModifierType): CompletionItem[] => {
    if (type === "mouse") {
        return [
            ...mouseModifiers.map((modifier) => ({
                label: "[KEY] " + modifier,
                kind: CompletionItemKind.EnumMember,
                insertText: modifier,
                insertTextFormat: InsertTextFormat.PlainText,
                data: {
                    type: "mouseModifier",
                    value: modifier,
                },
                documentation: `Mouse modifier for Alpine.js. Use with x-on: or @ directives.`,
            })),
            ...modifiers("behavior"),
        ];
    }

    if (type === "behavior") {
        return behaviorModifiers.map((modifier) => ({
            label: modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            data: {
                type: "behaviorModifier",
                value: modifier,
            },
            documentation: `Behavior modifier for Alpine.js. Use with x-on: or @ directives.`,
        }));
    }

    return [
        ...keyboardModifiers.map((modifier) => ({
            label: "[KEY] " + modifier,
            kind: CompletionItemKind.EnumMember,
            insertText: modifier,
            insertTextFormat: InsertTextFormat.PlainText,
            data: {
                type: "keyModifier",
                value: modifier,
            },
            documentation: `Key modifier for Alpine.js. Use with x-on: or @ directives.`,
        })),
        ...modifiers("behavior"),
    ];
};

function rawModifiers(type: ModifierType): string[] {
    if (type === "mouse") {
        return mouseModifiers;
    }

    if (type === "behavior") {
        return behaviorModifiers;
    }

    if (type === "keyboard") {
        return keyboardModifiers;
    }

    return [];
}

export {
    behaviorModifiers,
    keyboardModifiers,
    mouseModifiers,
    modifiers,
    rawModifiers,
};
export type { ModifierType as AlpineModifierType };
