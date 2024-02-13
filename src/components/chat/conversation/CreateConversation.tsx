'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Avatar,
  Button,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import { createConversation, getUsers } from '@/service';

const CreateConversation = ({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const { mutate: doCreate, isLoading: createLoading } = useMutation({
    mutationKey: 'conversation',
    mutationFn: async () => await createConversation(Array.from(selectedKeys)),
    onSuccess: (data) => {
      router.push(`?id=${data?._id}`);
      onClose();
    },
  });

  const { data, isLoading } = useQuery('users', {
    queryFn: () => getUsers(),
    enabled: !!isOpen,
  });

  const selectedValue = useMemo(() => {
    const arr = Array.from(selectedKeys);
    if (!arr.length) return 'Message';
    if (arr.length < 2) {
      const name = data?.find((i) => i._id === arr[0])?.name;
      return `Message ${name}`;
    }
    return `Create group with ${arr.length} users`;
  }, [data, selectedKeys]);

  return (
    <Modal isOpen={isOpen} size="sm" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">New Chat</ModalHeader>

            <ModalBody>
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </div>
              ) : (
                <Listbox
                  items={data || []}
                  selectionMode="multiple"
                  className="p-0"
                  label="New Chat"
                  selectedKeys={selectedKeys}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setSelectedKeys(keys as Set<string>)
                  }
                >
                  {(item) => (
                    <ListboxItem key={`${item._id}`} textValue={item._id}>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" src={item.avatar} />
                        <dl>
                          <dt className="font-bold">{item.name}</dt>
                          <dd className="text-default-400 text-sm">
                            {item.email}
                          </dd>
                        </dl>
                      </div>
                    </ListboxItem>
                  )}
                </Listbox>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                isDisabled={!Array.from(selectedKeys)?.length}
                variant="solid"
                color="primary"
                isLoading={createLoading}
                onPress={() => doCreate()}
              >
                {selectedValue}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateConversation;
