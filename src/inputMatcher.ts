import { CompletionItem } from "vscode-languageserver";
import { directives, shorthands } from "./directives.js";
import { events } from "./events.js";
import { modifiers, rawModifiers } from "./modifiers.js";

const eventsRe = /^.*(@|x-on:)$/s;
const directivesRe = /^.*x$/s;

function modifiersRe(type: "mouse" | "keyboard"): RegExp {
    const list = rawModifiers(type);
    const evs = events(type).map((event) => event.label);

    return new RegExp(
        `^.*(@|x-on:)` + `(${evs.join("|")})\.` + `((${list.join("|")})\.)*$`,
        "s"
    );
}

function match(beforeCursor: string, trigger: string): CompletionItem[] {
    if (eventsRe.test(beforeCursor)) {
        if (trigger === "@") {
            return [...shorthands()];
        }

        return [...events("mouse"), ...events("keyboard")];
    }
    if (directivesRe.test(beforeCursor)) {
        return directives();
    }
    if (modifiersRe("keyboard").test(beforeCursor)) {
        return modifiers("keyboard");
    }
    if (modifiersRe("mouse").test(beforeCursor)) {
        return modifiers("mouse");
    }

    return [];
}

export { match };
