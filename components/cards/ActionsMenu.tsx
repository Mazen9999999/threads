"use client";

import { deletePost } from "@/lib/actions/thread.actions";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
  import { usePathname } from "next/navigation";

export const ActionsMenu = ({ postId }: { postId: string }) => {

    const path = usePathname();

    return (
        <Menubar className="absolute top-0 right-0 text-light-1">
        <MenubarMenu className="bg-dark-4 text-light-1">
          <MenubarTrigger>
            <div className=" text-light-1 font-semibold">
            <span className="-mb-4">.</span>
            <span>.</span>
            <span className="-mt-4">.</span>
            </div>
          </MenubarTrigger>
          <MenubarContent className="bg-dark-4 text-light-1">
            <MenubarItem>Edit</MenubarItem>
            <MenubarItem>Delete</MenubarItem>
            <MenubarItem>Copy Link</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
    )
}