'use client';

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
  Tooltip,
} from '@nextui-org/react';
import { Compass, MessageCircle, Moon, Settings, Sun } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { TUser } from '@/types/user';

const Navbar = ({ user }: { user: TUser }) => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-16">
      <div className="fixed left-0 top-0 flex h-full w-16 flex-col items-center border-r p-4 px-2">
        <Avatar
          src={user?.avatar as string}
          alt={user?.name as string}
          size="md"
        />

        <div className="my-6 flex flex-col items-center gap-2">
          <Tooltip content="Chat" placement="right" delay={1000}>
            <Button isIconOnly variant="shadow">
              <MessageCircle size={24} className="text-primary" />
            </Button>
          </Tooltip>

          <Tooltip
            content="Coming soon"
            placement="right"
            delay={1000}
            closeDelay={0}
          >
            <Button isIconOnly variant="light" disableAnimation disableRipple>
              <Compass size={24} className="text-primary" />
            </Button>
          </Tooltip>
        </div>

        <footer className="mt-auto">
          <Dropdown showArrow placement="bottom-start">
            <DropdownTrigger>
              <Button isIconOnly variant="flat">
                <Settings size={20} />
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
        </footer>
      </div>
    </nav>
  );
};

export default Navbar;
