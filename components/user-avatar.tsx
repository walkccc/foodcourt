import { AvatarProps } from '@radix-ui/react-avatar';
import { User } from 'next-auth';

import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage alt="Picture" src={user.image || undefined} />
      <AvatarFallback>
        <span className="sr-only">{user.name}</span>
        <Icons.user className="h-6 w-6" />
      </AvatarFallback>
    </Avatar>
  );
}
