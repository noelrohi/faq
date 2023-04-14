"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";

export function UserAvatar(props: { src: string; username: string }) {
  return (
    <Avatar>
      <AvatarImage {...props} />
      <AvatarFallback>{props.username.slice(0,2)}</AvatarFallback>
    </Avatar>
  );
}
