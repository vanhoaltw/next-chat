import { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@nextui-org/react';
import { Image as ImageIcon } from 'lucide-react';

const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append('image', file);
  return fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    {
      method: 'POST',
      body: form,
    }
  )
    .then((response) => response.json())
    .catch(() => null);
};

const FileUpload = ({ onSend }: { onSend: (url: string) => void }) => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) setFileSelected(file);
  };

  return (
    <>
      <Button isIconOnly variant="light" size="sm" onClick={handleClick}>
        <ImageIcon size={20} />
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          multiple={false}
          ref={inputRef}
          disabled={!!fileSelected}
          onChange={handleUploadChange}
        />
      </Button>

      {!!fileSelected && (
        <PreviewUpload
          file={fileSelected}
          onSuccess={(imageUrl) => {
            setFileSelected(null);
            onSend(imageUrl);
          }}
          onClose={() => setFileSelected(null)}
        />
      )}
    </>
  );
};

const PreviewUpload = ({
  file,
  onClose,
  onSuccess,
}: {
  file: File;
  onClose: () => void;
  onSuccess: (url: string) => void;
}) => {
  const { isLoading, mutate: doUpload } = useMutation({
    mutationFn: () => uploadFile(file),
    onSuccess: (result) => {
      if (result) onSuccess(result?.data?.url);
    },
  });

  const isVideo = file.type === 'video';

  return (
    <Modal
      size="xs"
      isOpen
      onOpenChange={isLoading ? () => null : onClose}
      hideCloseButton
    >
      <ModalContent>
        {() => {
          const url = URL.createObjectURL(file);

          return (
            <>
              <ModalBody className="pt-5">
                {isVideo ? (
                  <div>Video</div>
                ) : (
                  <Image
                    src={url}
                    height={450}
                    width={450}
                    radius="sm"
                    alt="Preview upload"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                )}
              </ModalBody>
              <ModalFooter className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="bordered" onPress={() => onClose()}>
                  Cancel
                </Button>
                <Button
                  onClick={() => doUpload()}
                  variant="solid"
                  color="primary"
                  isLoading={isLoading}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default FileUpload;
