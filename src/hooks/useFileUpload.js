import { useState } from "react";
// import { uploadService } from '../api/upload.service';
import { imageStorageService } from "../features/image storage/api/imageStorage.service";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const upload = async (fileOrImage) => {
    setUploadError(null);

    // Case 1: Empty
    if (!fileOrImage) return null;

    // Case 2: Already an image object
    if (typeof fileOrImage === "object" && !(fileOrImage instanceof File)) {
      const { url, publicId } = fileOrImage;
      if (typeof url === "string" && typeof publicId === "number") {
        return { url, publicId };
      }
      return null;
    }

    // Case 3: It is a File (User picked a new image)
    if (fileOrImage instanceof File) {
      setIsUploading(true);
      try {
        const created = await imageStorageService.create({
          file: fileOrImage,
          file_name: fileOrImage.name,
          alt_text: "",
        });

        const id = created?.id ?? null;
        let url = null;
        if (id != null) {
          const item = await imageStorageService.getById(id);
          url = item?.url ?? null;
        }
        // const { secureUrl, publicId } = await uploadService.uploadImage(fileOrImage);
        // setIsUploading(false);
        return { url, publicId: id };
      } catch (err) {
        console.error("Upload failed", err);
        setUploadError("Failed to upload image.");
        setIsUploading(false);
        throw err; // Re-throw so the form knows to stop
      } finally {
        setIsUploading(false);
      }
    }

    return null;
  };

  return { upload, isUploading, uploadError };
};
