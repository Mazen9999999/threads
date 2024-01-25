"use client"

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deletePost } from '@/lib/actions/thread.actions';
import { usePathname } from 'next/navigation';


export const DeleteButton = ({ postId }: { postId: string }) => {
    const path = usePathname();
    return (

        <AlertDialog>
            <AlertDialogTrigger>
                <DeleteForeverIcon className="absolute right-0 bottom-0 text-light-1 cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletePost(postId, path)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


    )
}