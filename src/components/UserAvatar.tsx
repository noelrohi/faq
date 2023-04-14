"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";

export function UserAvatar(props: { src: string; username: string }) {
  return (
    <Avatar className="h-4 w-4">
      <AvatarImage {...props} />
      <AvatarFallback>{props.username.slice(0,2)}</AvatarFallback>
    </Avatar>
  );
}
