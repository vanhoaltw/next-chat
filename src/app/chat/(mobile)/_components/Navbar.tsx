'use client';

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from '@nextui-org/react';
import { Compass, Menu, MessageCircle, Moon, Sun } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="  p-4 shadow-lg">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-2">
        <Avatar
          src={user?.avatar as string}
          alt={user?.name as string}
          size="md"
        />

        <Button isIconOnly variant="shadow">
          <MessageCircle size={24} className="text-primary" />
        </Button>

        <Button isIconOnly variant="light" disableAnimation disableRipple>
          <Compass size={24} className="text-primary" />
        </Button>

        <Dropdown placement="top-end">
          <DropdownTrigger>
            <Button isIconOnly variant="flat">
              <Menu size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="mode"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              endContent={
                <Switch
                  isDisabled
                  isSelected={theme === 'dark'}
                  size="sm"
                  startContent={<Sun />}
                  endContent={<Moon />}
                />
              }
            >
              Dark Mode
            </DropdownItem>
            <DropdownItem
              onClick={() => signOut()}
              key="delete"
              className="text-danger"
              color="danger"
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
