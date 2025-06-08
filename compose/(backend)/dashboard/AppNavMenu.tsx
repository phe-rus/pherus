"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/compose/ui/sidebar";

type props = {
  title: string;
  items: {
    name: string;
    url: string;
    icon?: Icon;
  }[];
};

export function AppNavMenu({ title, items }: props) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items?.map((item) => {
            const { name, url } = item;
            return (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton tooltip={name}>
                  {item.icon && <item.icon />}
                  <span>{name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
