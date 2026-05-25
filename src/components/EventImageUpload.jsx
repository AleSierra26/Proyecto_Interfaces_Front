import { useRef, useState } from 'react';
import { ImagePlus, Loader } from 'lucide-react';
import { uploadEventImage } from '../api';

export default function EventImageUpload({ eventCode, currentImageUrl, onUpload }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImageUrl || null);

    const handleClick = () => inputRef.current?.click();

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        const data = await uploadEventImage(eventCode, file);
        setUploading(false);

        if (data.imageUrl && onUpload) {
            onUpload(data.imageUrl);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
                Imagen del evento
            </label>
            <button
                type="button"
                onClick={handleClick}
                className="relative w-full aspect-[16/7] rounded-[10px] overflow-hidden border border-dashed border-border bg-muted hover:bg-secondary transition-colors flex flex-col items-center justify-center gap-2"
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <ImagePlus className="w-5 h-5 text-white" />
                            <span className="text-[10px] uppercase tracking-widest font-sans text-white">
                                Cambiar imagen
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">
                            Subir imagen
                        </span>
                    </>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                        <Loader className="w-5 h-5 text-foreground animate-spin" />
                    </div>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}