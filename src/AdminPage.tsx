import { FormEvent, useRef, useState, ChangeEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

const ADMIN_SECRET_CODE = "Lestelledilucanel2025";

export function AdminPage({ onReturn }: { onReturn: () => void }) {
  const [imageName, setImageName] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [secretCode, setSecretCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveImage = useMutation(api.images.saveImage);
  const deleteImage = useMutation(api.images.deleteImage);

  const allImages = useQuery(api.images.listImages, isAuthorized ? {} : "skip") || [];

  function handleSecretCodeSubmit(event: FormEvent) {
    event.preventDefault();
    if (secretCode === ADMIN_SECRET_CODE) {
      setIsAuthorized(true);
      toast.success("Access granted to Admin Area.");
    } else {
      toast.error("Incorrect secret code.");
      setSecretCode("");
    }
  }

  async function handleUploadImage(event: FormEvent) {
    event.preventDefault();
    if (!selectedImage || !imageName || !imageDescription) {
      toast.error("Please provide name, description, and select an image.");
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });

      const { storageId } = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(storageId)}`);
      }

      await saveImage({
        name: imageName,
        description: imageDescription,
        storageId: storageId as Id<"_storage">,
      });

      toast.success("Image uploaded successfully!");
      setImageName("");
      setImageDescription("");
      setSelectedImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. " + (error as Error).message);
    }
  }

  async function handleDeleteImage(imageId: Id<"images">) {
    try {
      await deleteImage({ imageId });
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image. " + (error as Error).message);
    }
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <form
          onSubmit={handleSecretCodeSubmit}
          className="space-y-4 p-6 border rounded-lg shadow-lg bg-[#02142b]"
        >
          <h2 className="text-xl font-semibold text-center text-white">Admin Access</h2>
          <div>
            <label htmlFor="secretCode" className="block text-sm font-medium text-white">
              Enter Secret Code
            </label>
            <input
              type="password"
              id="secretCode"
              value={secretCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSecretCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 text-sm">
      {/* Return Button */}
      <button
        onClick={onReturn}
        className="mb-4 text-amber-50 underline text-sm"
      >
        ← Return to Gallery
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-amber-50">Admin Panel</h2>

      {/* Upload Form (Centered) */}
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleUploadImage}
          className="space-y-4 mb-8 p-6 border shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-3 text-sm">Upload New Image</h3>
          <div>
            <label htmlFor="imageName" className="block text-sm font-medium text-sm">Image Name</label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="imageDescription" className="block text-sm font-medium text-sm">Description</label>
            <textarea
              id="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-sm">Image File</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              ref={imageInputRef}
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-950 file:text-amber-50 hover:file:bg-blue-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!selectedImage || !imageName || !imageDescription}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-amber-50 font-medium text-amber-50 bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Upload Image
          </button>
        </form>
      </div>

      {/* Full Width Gallery */}
      <h3 className="text-xl font-semibold mb-4 text-amber-50 text-center">Uploaded Images</h3>
      {allImages.length === 0 && (
        <p className="text-amber-50 text-center">No images have been uploaded yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allImages.map((image) => (
          image.url && (
            <div key={image._id} className="bg-[#0b1c35] rounded-lg shadow-md overflow-hidden">
              <img src={image.url} alt={image.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-amber-50">{image.name}</h4>
                <p className="text-sm text-gray-300 truncate h-10 mb-2">{image.description}</p>
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="mt-2 w-full inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sky-950 font-medium text-amber-50 bg-amber-50 hover:bg-amber-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
