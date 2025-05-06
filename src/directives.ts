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
        description: `
Defines a chunk of HTML as an Alpine component and provides the reactive data for that component to reference.
**Example:**
\`\`\`html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Content</button>
 
    <div x-show="open">
        Content...
    </div>
</div>
\`\`\`
`,
    },
    {
        name: "x-init",
        description: `
Allows you to hook into the initialization phase of any element in Alpine.
**Example:**
\`\`\`html
<div x-init="console.log('I\'m being initialized!')"></div>
\`\`\`
`,
    },
    {
        name: "x-show",
        description: `
Allows you to conditionally show or hide an element based on a boolean value.
**Example:**
\`\`\`html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>
 
    <div x-show="open">
        Dropdown Contents...
    </div>
</div>
\`\`\`
`,
    },
    {
        name: "x-bind",
        description: `
Allows you to bind HTML attributes to Alpine data.
**Example:**
\`\`\`html
<div x-data="{ placeholder: 'Type here...' }">
    <input type="text" x-bind:placeholder="placeholder">
</div>
\`\`\`
`,
        insertText: 'x-bind:${1}="${2}"',
    },
    {
        name: "x-on",
        description: `
Allows you to easily run code on dispatched DOM events.
**Example:**
\`\`\`html
<button x-on:click="alert('Hello World!')">Say Hi</button>
\`\`\`
`,
        insertText: 'x-on:${1}="${2}"',
    },
    {
        name: "x-text",
        description: `
Allows you to set the text content of an element to the result of a given expression.
**Example:**
\`\`\`html
<div x-data="{ username: 'calebporzio' }">
    Username: <strong x-text="username"></strong>
</div>
\`\`\`
`,
    },
    {
        name: "x-html",
        description: `
Allows you to set the innerHTML property of an element to the result of a given expression.
**Example:**
\`\`\`html
<div x-data="{ username: '<strong>calebporzio</strong>' }">
    Username: <span x-html="username"></span>
</div>
\`\`\`
`,
    },
    {
        name: "x-model",
        description: `
Allows you to create two-way data bindings between form elements and Alpine data.
**Example:**
\`\`\`html
<div x-data="{ message: '' }">
    <input type="text" x-model="message">
 
    <span x-text="message"></span>
</div>
\`\`\`
`,
    },
    {
        name: "x-modelable",
        description: `
Allows you to expose any Alpine property as the target of the x-model directive.
**Example:**
\`\`\`html
<div x-data="{ number: 5 }">
    <div x-data="{ count: 0 }" x-modelable="count" x-model="number">
        <button @click="count++">Increment</button>
    </div>
 
    Number: <span x-text="number"></span>
</div>
\`\`\`
`,
    },
    {
        name: "x-for",
        description: `
Allows you to create DOM elements by iterating through a list.
**Example:**
\`\`\`html
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="color in colors">
        <li x-text="color"></li>
    </template>
</ul>
\`\`\`
`,
    },
    {
        name: "x-transition",
        description: `
Allows you can create smooth transitions between when an element is shown or hidden.
**Example:**
\`\`\`html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>
 
    <div x-show="open" x-transition>
        Hello 👋
    </div>
</div>
\`\`\`
`,
    },
    {
        name: "x-effect",
        description: `
Allows you to run a function whenever the data it references changes.
**Example:**
\`\`\`html
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
\`\`\`
`,
    },
    {
        name: "x-ignore",
        description: `
Allows you to ignore a chunk of HTML from being processed by Alpine.
**Example:**
\`\`\`html
<div x-data="{ label: 'From Alpine' }">
    <div x-ignore>
        <span x-text="label"></span>
    </div>
</div>
\`\`\`
`,
    },
    {
        name: "x-ref",
        description: `
Allows you to create a reference to an element in your Alpine component. 
**Example:** 
\`\`\`html
<button @click="$refs.text.remove()">Remove Text</button>
             
<span x-ref="text">Hello 👋</span>
\`\`\` 
`,
    },
    {
        name: "x-cloak",
        description: `
Allows you to hide a chunk of HTML until Alpine is fully initialized.
**Example:**
\`\`\`html
<span x-cloak x-show="false">This will not 'blip' onto screen at any point</span>
\`\`\`
`,
    },
    {
        name: "x-teleport",
        description: `
Allows you to transport part of your Alpine template to another part of the DOM on the page entirely.
**Example:**
\`\`\`html
<body>
    <div>
        <template x-teleport="body">
            Contents...
        </template>
    </div>
    ...
</body>
\`\`\`
`,
    },
    {
        name: "x-if",
        description: `
Allows you to conditionally render a chunk of HTML based on a boolean value.
Because of this difference in behavior, **x-if** should not be applied directly to the element, but instead to a **<template>** tag that encloses the element. This way, Alpine can keep a record of the element once it's removed from the page.
**Example:**
\`\`\`html
<template x-if="open">
    <div>Contents...</div>
</template>
\`\`\`
`,
    },
    {
        name: "x-id",
        description: `
Allows you to generate unique IDs for elements in your Alpine component.
**Example:**
\`\`\`html
div x-id="['text-input']">
    <label :for="$id('text-input')">Username</label>
    <!-- for="text-input-1" -->
 
    <input type="text" :id="$id('text-input')">
    <!-- id="text-input-1" -->
</div>
<div x-id="['text-input']">
    <label :for="$id('text-input')">Username</label>
    <!-- for="text-input-2" -->
 
    <input type="text" :id="$id('text-input')">
    <!-- id="text-input-2" -->
</div>
\`\`\`
`,
    },
];

const directives = (): CompletionItem[] => {
    return directivesList.map((directive) => ({
        label: directive.name,
        kind: CompletionItemKind.Keyword,
        documentation: {
            kind: "markdown",
            value: directive.description,
        },
        insertText: directive.insertText
            ? directive.insertText
            : directive.name + '="${1}"',
        insertTextFormat: InsertTextFormat.Snippet,
    }));
};

export { directives };
