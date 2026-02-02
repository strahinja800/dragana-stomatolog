'use client';

import { useEffect, useState } from 'react';

import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ToolbarOption =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote';

const TOOLBAR_PRESETS: Record<'minimal' | 'full', ToolbarOption[]> = {
  minimal: ['bold', 'italic', 'underline'],
  full: [
    'bold',
    'italic',
    'underline',
    'strike',
    'h2',
    'h3',
    'bulletList',
    'orderedList',
    'blockquote',
  ],
};

interface TiptapProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
  toolbarPreset?: 'minimal' | 'full';
  toolbarOptions?: ToolbarOption[];
}

interface TiptapToolbarProps {
  editor: ReturnType<typeof useEditor>;
  options: ToolbarOption[];
}

function TiptapToolbar({ editor, options }: TiptapToolbarProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => forceUpdate((n) => n + 1);
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  if (!editor) return null;

  const toolbarButtons: Record<
    ToolbarOption,
    { icon: React.ReactNode; action: () => void; isActive: boolean }
  > = {
    bold: {
      icon: <Bold className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    italic: {
      icon: <Italic className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    underline: {
      icon: <UnderlineIcon className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    strike: {
      icon: <Strikethrough className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    h2: {
      icon: <Heading2 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    h3: {
      icon: <Heading3 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    bulletList: {
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    orderedList: {
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    blockquote: {
      icon: <Quote className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  };

  // Group separators: after underline/strike, after h3
  const textFormattingOptions: ToolbarOption[] = [
    'bold',
    'italic',
    'underline',
    'strike',
  ];
  const headingOptions: ToolbarOption[] = ['h2', 'h3'];

  const renderSeparator = (index: number, option: ToolbarOption) => {
    const nextOption = options[index + 1];
    if (!nextOption) return null;

    const isEndOfTextFormatting =
      textFormattingOptions.includes(option) &&
      !textFormattingOptions.includes(nextOption);
    const isEndOfHeadings =
      headingOptions.includes(option) && !headingOptions.includes(nextOption);

    if (isEndOfTextFormatting || isEndOfHeadings) {
      return <span className="mx-1 w-px bg-border" />;
    }
    return null;
  };

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      {options.map((option, index) => {
        const button = toolbarButtons[option];
        return (
          <div key={option} className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              className={cn(
                button.isActive && 'bg-accent text-accent-foreground'
              )}
            >
              {button.icon}
            </Button>
            {renderSeparator(index, option)}
          </div>
        );
      })}
    </div>
  );
}

const Tiptap = ({
  content = '',
  placeholder = 'Započnite pisanje...',
  onChange,
  className,
  toolbarPreset = 'minimal',
  toolbarOptions,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const options = toolbarOptions ?? TOOLBAR_PRESETS[toolbarPreset];

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      {editor && <TiptapToolbar editor={editor} options={options} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus-within:outline-none [&_.ProseMirror]:min-h-10 [&_.ProseMirror]:outline-none"
      />
    </div>
  );
};

export default Tiptap;
