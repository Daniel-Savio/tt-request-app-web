import './tiptap.css'

import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Label } from './ui/label'

import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'

import { useController, useFormContext } from 'react-hook-form'

const extensions = [TextStyleKit, StarterKit]

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
      }
    },
  })

  return (
    <div className="control-group border-none">
      <ToggleGroup
        className="button-group flex flex-wrap gap-2 bg-card px-2 w-full justify-center"
        type="multiple"
      >
        <button
          className={editorState.isBold ? 'is-active' : ''}
          disabled={!editorState.canBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          <ToggleGroupItem aria-label="Toggle bold" value="bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
        </button>
        <button
          className={editorState.isItalic ? 'is-active' : ''}
          disabled={!editorState.canItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
        >
          <ToggleGroupItem aria-label="Toggle itallic" value="Italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
        </button>
        <button
          className={editorState.isStrike ? 'is-active' : ''}
          disabled={!editorState.canStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
        >
          <ToggleGroupItem aria-label="Toggle strike" value="Strike">
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </button>

        <button
          className={editorState.isBulletList ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          <ToggleGroupItem aria-label="Toggle bullet list" value="bulletList">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </button>
        <button
          className={editorState.isOrderedList ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          <ToggleGroupItem aria-label="Toggle ordered list" value="orderedList">
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </button>
      </ToggleGroup>
    </div>
  )
}

export default ({ name }: { name: string }) => {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })

  const editor = useEditor({
    extensions,
    content: field.value || '',
    onUpdate: ({ editor }) => {
      field.onChange(editor.getHTML())
    },
  })

  return (
    <div>
      <Label className="my-4">Comentários e Obsvervações</Label>
      <MenuBar editor={editor} />
      <EditorContent
        className="border border-border rounded-md p-4 shadow-md mt-2 tiptap"
        editor={editor}
      />
    </div>
  )
}
