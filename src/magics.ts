import { CompletionItem, CompletionItemKind } from "vscode-languageserver";
import { Documented, Named } from "./types.js";

type Magic = Named & Documented;

export const magicsList: Magic[] = [
    {
        name: "el",
        documentation: `
Property that can be used to retrieve the current DOM node.
**Example:**
\`\`\`html
<button @click="$el.innerHTML = 'Hello World!'">Replace me with "Hello World!"</button>
\`\`\`
`,
    },
];

export function magics(): CompletionItem[] {
    return magicsList.map((magic) => ({
        label: "$" + magic.name,
        kind: CompletionItemKind.Property,
        documentation: {
            kind: "markdown",
            value: magic.documentation,
        },
        data: {},
    }));
}
