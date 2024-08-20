import axios from "axios";

interface UploadFormProps {
  courseId: string;
  chapterId: string;
}

export default function UploadForm({ courseId, chapterId }: UploadFormProps) {
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.currentTarget.file.files[0]);

    // console.log(formData.get("file"));
    const response = await axios.patch(
      `/api/courses/${courseId}/chapters/${chapterId}`,
      formData
    );
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" required />
      <button type="submit">Upload File</button>
    </form>
  );
}
