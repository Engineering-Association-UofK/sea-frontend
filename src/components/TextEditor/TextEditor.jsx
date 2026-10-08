import React, { useEffect, useState } from "react";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const EnterKey = Extension.create({
  name: "enterKey",

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return this.editor.commands.splitBlock();
      },

      "Shift-Enter": () => {
        return this.editor.commands.setHardBreak();
      },
    };
  },
});

const AutoDirection = Extension.create({
  name: "autoDirection",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "blockquote", "codeBlock", "listItem"],

        attributes: {
          dir: {
            default: "auto",

            renderHTML: () => ({
              dir: "auto",
            }),

            parseHTML: (element) => {
              return {
                dir: element.getAttribute("dir") || "auto",
              };
            },
          },
        },
      },
    ];
  },
});

export default function TextEditor({ value = "", onChange }) {
  const [html, setHtml] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },

        bulletList: {},
        orderedList: {},
        blockquote: {},
        hardBreak: {},
      }),

      EnterKey,
      AutoDirection,
    ],

    content: value,

    immediatelyRender: false,

    onCreate({ editor }) {
      setHtml(editor.getHTML());
    },

    onUpdate({ editor }) {
      const content = editor.getHTML();

      setHtml(content);
      onChange?.(content);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });

      setHtml(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  /*
   * Toolbar button
   */
  const Button = ({
    children,
    onClick,
    active = false,
    disabled = false,
    title,
  }) => {
    return (
      <button
        type="button"
        title={title}
        disabled={disabled}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={onClick}
        style={{
          border: "1px solid #ccc",
          background: active ? "#ddd" : "#fff",
          borderRadius: 4,
          padding: "6px 10px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontWeight: active ? "bold" : "normal",
        }}
      >
        {children}
      </button>
    );
  };

  const setHeading = (level) => {
    editor.chain().focus().setNode("heading", { level }).run();
  };

  /*
   * Set the current block back to paragraph.
   */
  const setParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  /*
   * Code block.
   */
  const setCodeBlock = () => {
    editor.chain().focus().setCodeBlock().run();
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* =========================================
            TOOLBAR
        ========================================== */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            padding: 8,
            borderBottom: "1px solid #ddd",
            background: "#f5f5f5",
          }}
        >
          {/* Bold */}
          <Button
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
          >
            B
          </Button>

          {/* Italic */}
          <Button
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
            }}
          >
            <i>I</i>
          </Button>

          {/* Strike */}
          <Button
            title="Strike"
            active={editor.isActive("strike")}
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
            }}
          >
            <s>S</s>
          </Button>

          {/* Inline code */}
          <Button
            title="Inline Code"
            active={editor.isActive("code")}
            onClick={() => {
              editor.chain().focus().toggleCode().run();
            }}
          >
            {"</>"}
          </Button>

          {/* Paragraph */}
          <Button
            title="Paragraph"
            active={editor.isActive("paragraph")}
            onClick={setParagraph}
          >
            P
          </Button>

          {/* Headings */}
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <Button
              key={level}
              title={`Heading ${level}`}
              active={editor.isActive("heading", { level })}
              onClick={() => setHeading(level)}
            >
              H{level}
            </Button>
          ))}

          {/* Bullet list */}
          <Button
            title="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            • List
          </Button>

          {/* Numbered list */}
          <Button
            title="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
          >
            1. List
          </Button>

          {/* Quote */}
          <Button
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
            }}
          >
            ❝
          </Button>

          {/* Code block */}
          <Button
            title="Code Block"
            active={editor.isActive("codeBlock")}
            onClick={setCodeBlock}
          >
            Code
          </Button>

          {/* Horizontal rule */}
          <Button
            title="Horizontal Rule"
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run();
            }}
          >
            ―
          </Button>

          {/* Undo */}
          <Button
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() => {
              editor.chain().focus().undo().run();
            }}
          >
            ↶
          </Button>

          {/* Redo */}
          <Button
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() => {
              editor.chain().focus().redo().run();
            }}
          >
            ↷
          </Button>
        </div>

        {/* =========================================
            EDITOR
        ========================================== */}
        <div
          style={{
            padding: 15,
          }}
        >
          <EditorContent editor={editor} />
        </div>

        <style>{`

          .ProseMirror {
            outline: none;
            min-height: 300px;
            line-height: 1.6;
            unicode-bidi: plaintext;
          }

          .ProseMirror p {
            margin: 0 0 1em;
          }

          .ProseMirror h1,
          .ProseMirror h2,
          .ProseMirror h3,
          .ProseMirror h4,
          .ProseMirror h5,
          .ProseMirror h6 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            line-height: 1.2;
          }

          /* ===============================
             Lists
          =============================== */

          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 2rem;
            margin: 1em 0;
          }

          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 2rem;
            margin: 1em 0;
          }

          .ProseMirror li {
            margin: 0.25em 0;
          }

          .ProseMirror li p {
            margin: 0;
          }

          .ProseMirror ul ul {
            list-style-type: circle;
          }

          .ProseMirror ul ul ul {
            list-style-type: square;
          }

          .ProseMirror ol ol {
            list-style-type: lower-alpha;
          }

          /* ===============================
             Blockquote
          =============================== */

          .ProseMirror blockquote {
            border-left: 4px solid #ccc;
            margin: 1em 0;
            padding-left: 1em;
            color: #666;
          }

          /* ===============================
             Inline code
          =============================== */

          .ProseMirror code {
            background: #eee;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: monospace;
          }

          /* ===============================
             Code block
          =============================== */

          .ProseMirror pre {
            background: #222;
            color: #fff;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
          }

          .ProseMirror pre code {
            background: transparent;
            padding: 0;
            color: inherit;
          }

          /* ===============================
             Horizontal rule
          =============================== */

          .ProseMirror hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 1.5em 0;
          }

        `}</style>
      </div>
    </div>
  );
}
