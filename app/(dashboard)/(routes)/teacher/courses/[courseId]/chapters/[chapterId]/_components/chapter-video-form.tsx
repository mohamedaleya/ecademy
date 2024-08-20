"use client";

import * as z from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(
    initialData.muxData?.status === "ready"
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  useEffect(() => {
    if (!isVideoReady) {
      const checkVideoStatus = async () => {
        try {
          const response = await axios.get(
            `/api/courses/${courseId}/chapters/${chapterId}/video-status`
          );
          if (response.data.status === "ready") {
            setIsVideoReady(true);
          }
        } catch (error) {
          console.error("Error checking video status:", error);
        }
      };

      const intervalId = setInterval(checkVideoStatus, 10000);

      return () => clearInterval(intervalId);
    }
  }, [isVideoReady, courseId, chapterId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.videoUrl && (
        <div className="relative aspect-video mt-2">
          {isVideoReady ? (
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
              className="aspect-video"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-200 rounded-md">
              <p>Video is processing. Please wait...</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && !isVideoReady && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
