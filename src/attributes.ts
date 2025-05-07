import {
    CompletionItem,
    CompletionItemKind,
    InsertTextFormat,
    MarkupContent,
} from "vscode-languageserver";
import { Documented, Named } from "./types.js";

type Attribute = Named &
    Documented & {
        belongsTo?: string[];
        deprecated?: boolean;
    };

const attributesList: Attribute[] = [
    {
        name: "accept",
        documentation: "This attribute can be used with <input> element only.",
        belongsTo: ["input"],
    },
    {
        name: "accept-charset",
        documentation:
            "Define character encoding and is used for form submission.",
        belongsTo: ["form"],
    },
    {
        name: "accesskey",
        documentation:
            "The keyboard shortcuts to activate/focus specific elements.",
    },
    {
        name: "action",
        documentation:
            "Specify where the form data is to be sent to the server after submission of the form.",
        belongsTo: ["form"],
    },
    {
        name: "align",
        documentation: "Specify the alignment of text content of The Element.",
        deprecated: true,
    },
    {
        name: "alt",
        documentation: "Show or display something if the primary attribute",
        belongsTo: ["img", "area", "input"],
    },
    {
        name: "async",
        documentation:
            "Only works for external scripts (and used only in when src attribute is present ).",
        belongsTo: ["script"],
    },
    {
        name: "autocomplete",
        documentation:
            "Specify whether the input field has autocompleted would be on or off.",
        belongsTo: ["input", "form"],
    },
    {
        name: "autoplay",
        documentation:
            "The audio/video should automatically start playing when web page is loaded.",
        belongsTo: ["audio", "video"],
    },
    {
        name: "autofocus",
        documentation:
            "The element should get focused when the page loads. It is a boolean attribute.",
        belongsTo: ["input", "button", "select", "textarea"],
    },
    {
        name: "bgcolor",
        documentation: "Set the background color of an HTML element.",
    },
    {
        name: "border",
        documentation:
            "Set visible border width to most HTML elements within the body.",
    },
    { name: "charset", documentation: "Define character encoding." },
    {
        name: "checked",
        documentation:
            "Indicate whether an element should be checked when the page loads up. It is a Boolean attribute.",
    },
    {
        name: "cite",
        documentation:
            "Specify the URL of the document that explains the quotes, message or text which describes why the text was inserted.",
    },
    {
        name: "Class",
        documentation: "Specifies one or more class names for an HTML element.",
    },
    {
        name: "cols",
        documentation: "The number of columns a cell should span.",
    },
    {
        name: "colspan",
        documentation:
            "HTML specifies the number of columns a cell should span.",
    },
    {
        name: "content",
        documentation:
            "The values that are related to the http-equiv or name attribute.",
    },
    {
        name: "contenteditable",
        documentation:
            "Specify whether the content present in the element is editable or not.",
    },
    {
        name: "controls",
        documentation: "It is a Boolean attribute and also new in HTML5",
    },
    {
        name: "coords",
        documentation: "Specify the coordinate of an area in an image-map",
    },
    {
        name: "data",
        documentation: "Specify the URL of the Embedded file of the Object.",
    },
    {
        name: "data-*",
        documentation:
            "Specific to HTML5 and you can use the data-* attribute on all HTML elements.",
    },
    {
        name: "datetime",
        documentation:
            "Specify the date and time of the inserted and the deleted text.",
    },
    {
        name: "default",
        documentation:
            "Specify that the track will be enabled if the user’s preferences do not indicate that another track would be more appropriate.",
    },
    {
        name: "defer",
        documentation: "Executed when the page has finished parsing.",
    },
    {
        name: "dir",
        documentation: "The text direction of the element content.",
    },
    {
        name: "dirname",
        documentation:
            "Enable the text direction of the input and the Textarea Field after submitting the form.",
    },
    {
        name: "disabled",
        documentation:
            "The disabled attribute in HTML indicates whether the element is disabled or not.",
    },
    {
        name: "download",
        documentation:
            "Download the element when the user clicks on the hyperlink",
    },
    {
        name: "draggable",
        documentation: "Specify whether an element is draggable or not.",
    },
    {
        name: "dropzone",
        documentation:
            "Specify whether the dragged data is copied, moved, or linked when it is dropped on any element.",
    },
    {
        name: "enctype",
        documentation:
            "That data will be present in the form and should be encoded when submitted to the server.",
    },
    {
        name: "for",
        documentation:
            "For Attribute is used in both the <label> and the <output> element.",
    },
    {
        name: "form",
        documentation: "That the element can contain one or more forms",
    },
    {
        name: "formaction",
        documentation:
            "Specify where to send the data of the form. After submission of the form, the formaction attribute is called.",
    },
    {
        name: "headers",
        documentation:
            "The HTML headers attribute specifies one or additional header cells a table cell is expounded to.",
    },
    {
        name: "height",
        documentation:
            "height attribute is used to specify the height of the Element.",
    },
    {
        name: "hidden",
        documentation:
            "The hidden attribute in HTML is used to define the visibility of elements.",
    },
    {
        name: "high",
        documentation:
            "The range where the value of gauge is considered to be of high value.",
    },
    {
        name: "href",
        documentation: "It is used to specify the URL of the document.",
    },
    {
        name: "hreflang",
        documentation:
            "The language for a linked document. It is used only when the href attribute is set.",
    },
    {
        name: "http-equiv",
        documentation:
            "Provide header information or value of the content Attribute.",
    },
    {
        name: "Id",
        documentation:
            "It is used by CSS and JavaScript to perform a certain task for a unique element.",
    },
    {
        name: "ismap",
        documentation: "The HTML ismap attribute is a boolean attribute.",
    },
    {
        name: "kind",
        documentation:
            "The kind of track. This attribute is only used in <Track> element.",
    },
    {
        name: "label",
        documentation:
            "The title of the Text Track is used by the browser when listing available text tracks.",
    },
    {
        name: "lang",
        documentation: "Specify the language of the element content.",
    },
    {
        name: "list",
        documentation:
            "List of pre-defined options for an <input> element to suggest the user.",
    },
    {
        name: "loop",
        documentation:
            "Restart the audio and video again and again after finishing it. It contains the Boolean value.",
    },
    {
        name: "low",
        documentation:
            "The range where the value of gauge is considered to be low.",
    },
    {
        name: "max",
        documentation: "Specifies the maximum value of an element.",
    },
    {
        name: "maxlength",
        documentation:
            "The maximum number of characters in the <input> element. Its default value is 524288.",
    },
    {
        name: "media",
        documentation:
            "The media attribute is used with the <link> and <style> elements to specify the type of media (screen, print, etc.) the document is optimized for.",
    },
    {
        name: "method",
        documentation:
            "The HTTP method is used to send data while submitting the form.",
    },
    { name: "min", documentation: "Specify the lower bound of the gauge." },
    {
        name: "multiple",
        documentation:
            "Allowed to select more than one value that is present in an element.",
    },
    {
        name: "muted",
        documentation:
            "The audio output of the video is muted, it is a Boolean attribute.",
    },
    { name: "name", documentation: "Specify a name for the element." },
    {
        name: "novalidate",
        documentation:
            "That the form-data should not be validated when submitting the form.",
    },
    {
        name: "onblur",
        documentation: "That moment when the element loses focus.",
    },
    {
        name: "oncopy",
        documentation: "The user copied the content present in an element.",
    },
    {
        name: "oncut",
        documentation:
            "The user cut or delete the content that has been present in the element.",
    },
    {
        name: "onkeypress",
        documentation: "when a user presses a key on the Keyboard.",
    },
    {
        name: "onmousedown",
        documentation:
            "Order of events occurs related to the onmousedown event.",
    },
    {
        name: "onscroll",
        documentation:
            "This onscroll attribute works when an element scrollbar is being scrolled.",
    },
    {
        name: "optimum",
        documentation:
            "The optimum attribute in HTML indicates the optimal numeric value for the gauge.",
    },
    {
        name: "pattern",
        documentation:
            "Specifies a regular expression pattern that the input value must match to be valid.",
    },
    {
        name: "placeholder",
        documentation:
            "Specifies a short hint that describes the expected value of an input field/text area.",
    },
    {
        name: "readonly",
        documentation:
            "Specify that the text written in input or text area Element is read-only.",
    },
    {
        name: "required",
        documentation:
            "Specify that the input element must be filled out before submitting the Form.",
    },
    {
        name: "reversed",
        documentation:
            "Ordered the list in Descending Order(9, 8, 7, 6 …..) instead of ascending order(1, 2, 3 ….)",
    },
    {
        name: "rows",
        documentation:
            "The number of visible text lines for the control i.e the number of rows to display.",
    },
    {
        name: "rowspan",
        documentation: "The number of rows a cell should span.",
    },
    {
        name: "selected",
        documentation:
            "Specify which option should be by default selected when the page loads.",
    },
    {
        name: "size",
        documentation:
            "Specify the initial width for the input field and a number of visible rows for the select element.",
    },
    {
        name: "spellcheck",
        documentation: "Applied to HTML forms using the spellcheck attribute.",
    },
    {
        name: "srclang",
        documentation: "Specify the language of the track text.",
    },
    {
        name: "start",
        documentation:
            "The start value for numbering the individual list item.",
    },
    {
        name: "step",
        documentation: "Set the discrete step size of the <input> element.",
    },
    {
        name: "style",
        documentation: "There are 3 ways of implementing style in HTML.",
    },
    {
        name: "tabindex",
        documentation: "When the tab button is used for navigating.",
    },
    {
        name: "target",
        documentation:
            "Specifies where to open the linked document (e.g., in a new window/tab, in the same window/tab, etc.).",
    },
    {
        name: "title",
        documentation: "Specify extra information about the element.",
    },
    {
        name: "translate",
        documentation:
            "Specify whether the content of an element is translated or not.",
    },
    {
        name: "value",
        documentation:
            "Specify the value of the element with which it is used.",
    },
    {
        name: "wrap",
        documentation:
            "The wrap attribute specifies how text should be wrapped in a <textarea> element (either by spaces or by the browser’s default). It determines how text is handled when the form is submitted.",
    },
];

const attributes = (): CompletionItem[] => {
    return attributesList.map((attribute) => ({
        label: attribute.name.toLowerCase(),
        kind: CompletionItemKind.Value,
        inseertText: attribute.name + '="$1"',
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: {
            kind: "markdown",
            value: attribute.documentation,
        } as MarkupContent,
    }));
};

export { attributes, attributesList };
