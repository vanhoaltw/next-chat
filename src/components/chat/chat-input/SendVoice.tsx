import { Button } from '@nextui-org/react';
import { Mic } from 'lucide-react';

const SendVoice = () => {
  return (
    <Button isIconOnly size="sm" variant="light">
      <Mic size={20} />
    </Button>
  );
};

export default SendVoice;
