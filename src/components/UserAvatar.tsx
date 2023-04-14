"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";

export function UserAvatar(props: { src: string; username: string; size? : number }) {
  return (
    <Avatar className={`h-${props.size ?? 4} w-${props.size ?? 4}`}>
      <AvatarImage {...props} />
      <AvatarFallback>{props.username.slice(0,2)}</AvatarFallback>
    </Avatar>
  );
}
