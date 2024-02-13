import { RefObject } from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@nextui-org/react';
import type { EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import dynamic from 'next/dynamic';

const BaseEmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <Skeleton className="bg-default-300 size-[300px] rounded-xl" />
  ),
});

const EmojiPicker = ({
  value = '',
  size = 300,
  callback,
  textareaRef,
}: {
  textareaRef: RefObject<HTMLTextAreaElement>;
  value?: string;
  size?: number;
  callback?: (v: string) => void;
}) => {
  const doAddEmoji = (e: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const sym = e.unified.split('-');
    const codesArray: number[] = [];
    sym.forEach((el) => codesArray.push(Number(`0x${el}`)));
    const emoji = String.fromCodePoint(...codesArray);

    const cursorPosition = textarea.selectionEnd;
    const start = value.substring(0, textarea.selectionStart);
    const end = value.substring(textarea.selectionStart);
    const text = start + emoji + end;

    callback?.(text);
    textarea.focus();
    setTimeout(() => {
      textarea.selectionEnd = cursorPosition + emoji.length;
    }, 0);
  };

  return (
    <Popover classNames={{ content: ['p-0'] }} showArrow placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="light" size="sm">
          <Smile size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <BaseEmojiPicker
          autoFocusSearch
          lazyLoadEmojis
          onEmojiClick={doAddEmoji}
          emojiVersion="0.6"
          searchDisabled
          height={size + 50}
          width={size}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
