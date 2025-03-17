import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your clinical note...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleHighlight = () => editor.chain().focus().toggleHighlight().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const setTextAlignLeft = () => editor.chain().focus().setTextAlign('left').run();
  const setTextAlignCenter = () => editor.chain().focus().setTextAlign('center').run();
  const setTextAlignRight = () => editor.chain().focus().setTextAlign('right').run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="rich-text-editor w-full">
      <div className="toolbar flex flex-wrap gap-1 p-2 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <button
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={toggleUnderline}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-5 h-5" />
        </button>
        <button
          onClick={toggleHighlight}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Highlight"
        >
          <Highlighter className="w-5 h-5" />
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-8"></div>
        <button
          onClick={toggleHeading1}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={toggleHeading2}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={toggleHeading3}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-5 h-5" />
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-8"></div>
        <button
          onClick={toggleBulletList}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={toggleOrderedList}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={toggleBlockquote}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Quote"
        >
          <Quote className="w-5 h-5" />
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-8"></div>
        <button
          onClick={setTextAlignLeft}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={setTextAlignCenter}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={setTextAlignRight}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-8"></div>
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-8"></div>
        <button
          onClick={undo}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Undo"
          disabled={!editor.can().undo()}
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Redo"
          disabled={!editor.can().redo()}
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none p-4 min-h-[300px] bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}; 