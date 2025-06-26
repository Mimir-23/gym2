import { useState } from "react";
import { supabase } from "../../supabase";

export default function ImageUploader({ onUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    setUploading(true);

    // Sube el archivo al bucket "productos"
    const { data, error } = await supabase.storage
      .from("productos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Error al subir imagen:", error.message);
      alert("Error al subir imagen");
      setUploading(false);
      return;
    }

    // Obtiene la URL pública
    const { data: publicUrlData } = supabase.storage
      .from("productos")
      .getPublicUrl(fileName);

    if (publicUrlData?.publicUrl) {
      onUpload(publicUrlData.publicUrl);
    } else {
      console.error("❌ No se pudo obtener la URL pública");
      alert("No se pudo generar la URL pública");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">Imagen del producto</label>

      {currentImage && (
        <img
          src={currentImage}
          alt="Vista previa"
          className="w-40 h-40 object-cover rounded shadow border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-white bg-gray-800 p-2 rounded w-full"
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-yellow-300">Subiendo imagen...</p>
      )}
    </div>
  );
}
