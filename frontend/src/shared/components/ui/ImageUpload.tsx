import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  acceptedFormats?: string[];
}

const ImageUpload = ({ 
  label = 'Upload Images',
  value = [],
  onChange,
  maxImages = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed max
    if (value.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = fileArray.filter(file => !acceptedFormats.includes(file.type));
    if (invalidFiles.length > 0) {
      alert('Invalid file format. Please upload only images (JPEG, PNG, GIF, WebP)');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for preview (in production, upload to CDN)
      const base64Images = await Promise.all(
        fileArray.map(file => convertToBase64(file))
      );

      // In production, you would upload to CDN here:
      // const uploadedUrls = await uploadToCDN(fileArray);
      // For now, using base64 as placeholder
      onChange([...value, ...base64Images]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3">{label}</label>
      
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
          dragActive 
            ? 'border-orange-500 bg-orange-500/10' 
            : 'border-[#2a2a2a] hover:border-orange-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-orange-500/10 rounded-full">
                <Upload className="text-orange-500" size={32} />
              </div>
              <div>
                <p className="text-white mb-1">
                  Drag and drop images here, or{' '}
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="text-orange-500 hover:text-orange-400 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-400">
                  Supports: JPEG, PNG, GIF, WebP (Max {maxImages} images)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {value.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-video bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>

                {/* Image number */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs">
                  Image {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image count */}
      {value.length > 0 && (
        <p className="text-sm text-gray-400 mt-2">
          {value.length} / {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
