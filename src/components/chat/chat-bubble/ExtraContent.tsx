import { Image } from '@nextui-org/react';

import { TMessage } from '@/types/message';

const ExtraContent = ({ attachments }: Pick<TMessage, 'attachments'>) => {
  const renderContent = (item: TMessage['attachments'][0]) => {
    switch (item.type) {
      case 'image':
        return (
          <Image
            src={item.url}
            height="auto"
            width="auto"
            alt=""
            className="my-1.5 w-full max-w-[350px] rounded-lg"
          />
        );
      default:
        return null;
    }
  };
  return attachments?.map((i) => <div key={i.url}>{renderContent(i)}</div>);
};

export default ExtraContent;
