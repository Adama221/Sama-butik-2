import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

interface GalleryImage {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
  date: string;
}

const GALLERY_KEY = "sb_image_gallery";

function loadGallery(): GalleryImage[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGallery(gallery: GalleryImage[]) {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
  } catch {
    // localStorage plein : on garde quand même
  }
}

export default function ImageUploader({ images, onChange, maxImages = 4 }: ImageUploaderProps) {
  const [tab, setTab] = useState<"current" | "upload" | "gallery" | "url">("current");
  const [gallery, setGallery] = useState<GalleryImage[]>(loadGallery);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [gallerySearch, setGallerySearch] = useState("");
  const [selectedFromGallery, setSelectedFromGallery] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const allowed = fileArray.filter((f) => f.type.startsWith("image/"));
      if (!allowed.length) return;

      setUploading(true);
      const newGallery = [...loadGallery()];
      const newImages: string[] = [];

      let processed = 0;

      allowed.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          const entry: GalleryImage = {
            id,
            dataUrl,
            name: file.name,
            size: file.size,
            date: new Date().toISOString(),
          };
          newGallery.push(entry);
          newImages.push(dataUrl);
          processed++;

          if (processed === allowed.length) {
            saveGallery(newGallery);
            setGallery([...newGallery]);
            // Ajouter aux images du produit (sans dépasser maxImages)
            const combined = [...images, ...newImages].slice(0, maxImages);
            onChange(combined);
            setUploading(false);
            setTab("current");
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, onChange, maxImages]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated.length ? updated : [""]);
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const arr = [...images];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange(arr);
  };

  const addUrl = () => {
    setUrlError("");
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setUrlError("URL invalide");
      return;
    }
    if (images.filter(Boolean).length >= maxImages) {
      setUrlError(`Maximum ${maxImages} images`);
      return;
    }
    const clean = images.filter(Boolean);
    onChange([...clean, url]);
    setUrlInput("");
    setTab("current");
  };

  const addFromGallery = () => {
    const toAdd = selectedFromGallery.filter(
      (url) => !images.includes(url)
    );
    const combined = [...images.filter(Boolean), ...toAdd].slice(0, maxImages);
    onChange(combined);
    setSelectedFromGallery([]);
    setTab("current");
  };

  const deleteFromGallery = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    saveGallery(updated);
    setGallery(updated);
    // Si l'image est utilisée dans le formulaire, la retirer aussi
    const deletedImg = gallery.find((g) => g.id === id);
    if (deletedImg) {
      onChange(images.filter((img) => img !== deletedImg.dataUrl));
    }
    setDeleteConfirm(null);
  };

  const toggleSelectGallery = (dataUrl: string) => {
    setSelectedFromGallery((prev) =>
      prev.includes(dataUrl)
        ? prev.filter((u) => u !== dataUrl)
        : [...prev, dataUrl]
    );
  };

  const filteredGallery = gallery.filter((g) =>
    g.name.toLowerCase().includes(gallerySearch.toLowerCase())
  );

  const validImages = images.filter(Boolean);

  return (
    <div className="border-2 border-orange-200 rounded-2xl overflow-hidden bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {[
          { id: "current", label: `📸 Images (${validImages.length})` },
          { id: "upload", label: "⬆️ Uploader" },
          { id: "gallery", label: `🖼️ Galerie (${gallery.length})` },
          { id: "url", label: "🔗 URL" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              tab === t.id
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* ── Onglet Images actuelles ── */}
        {tab === "current" && (
          <div>
            {validImages.length === 0 ? (
              <div
                className="text-center py-10 text-gray-400 cursor-pointer"
                onClick={() => setTab("upload")}
              >
                <div className="text-5xl mb-2">📷</div>
                <p className="font-semibold text-sm">Aucune image</p>
                <p className="text-xs mt-1">Cliquez pour uploader</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {validImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-400 transition-all">
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=300&q=60";
                        }}
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                          PRINCIPAL
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, -1)}
                            className="bg-white/90 text-gray-800 w-7 h-7 rounded-full text-xs font-bold hover:bg-white"
                            title="Déplacer à gauche"
                          >
                            ←
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white w-7 h-7 rounded-full text-xs font-bold hover:bg-red-600"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                        {idx < validImages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 1)}
                            className="bg-white/90 text-gray-800 w-7 h-7 rounded-full text-xs font-bold hover:bg-white"
                            title="Déplacer à droite"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {validImages.length < maxImages && (
                    <button
                      type="button"
                      onClick={() => setTab("upload")}
                      className="h-24 rounded-xl border-2 border-dashed border-orange-300 text-orange-400 hover:border-orange-500 hover:text-orange-500 transition-all flex flex-col items-center justify-center text-xs font-semibold gap-1"
                    >
                      <span className="text-2xl">+</span>
                      <span>Ajouter</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {validImages.length}/{maxImages} images · Passez la souris pour réorganiser
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Onglet Upload ── */}
        {tab === "upload" && (
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-orange-500 bg-orange-50 scale-[1.01]"
                  : "border-orange-300 hover:border-orange-500 hover:bg-orange-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-orange-600 font-semibold text-sm">Traitement en cours…</p>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3">📁</div>
                  <p className="font-black text-gray-800 text-base mb-1">
                    Glissez-déposez vos photos ici
                  </p>
                  <p className="text-gray-500 text-sm mb-3">ou cliquez pour ouvrir votre galerie</p>
                  <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                    📷 Choisir depuis la galerie
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    JPG, PNG, WebP, HEIC · Max {maxImages} images · Toutes tailles acceptées
                  </p>
                </>
              )}
            </div>

            {/* Upload rapide mobile */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.capture = "environment";
                    fileInputRef.current.click();
                  }
                }}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all"
              >
                📸 Prendre une photo
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all"
              >
                🖼️ Galerie photo
              </button>
            </div>
          </div>
        )}

        {/* ── Onglet Galerie ── */}
        {tab === "gallery" && (
          <div>
            {gallery.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-5xl mb-2">🖼️</div>
                <p className="font-semibold text-sm">Galerie vide</p>
                <p className="text-xs mt-1 mb-4">Uploadez des images pour les réutiliser</p>
                <button
                  type="button"
                  onClick={() => setTab("upload")}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600"
                >
                  ⬆️ Uploader maintenant
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher une image…"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {selectedFromGallery.length > 0 && (
                    <button
                      type="button"
                      onClick={addFromGallery}
                      className="bg-orange-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 whitespace-nowrap"
                    >
                      ✓ Ajouter ({selectedFromGallery.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {filteredGallery.map((img) => {
                    const isSelected = selectedFromGallery.includes(img.dataUrl);
                    const isUsed = images.includes(img.dataUrl);
                    return (
                      <div
                        key={img.id}
                        className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected
                            ? "border-orange-500 shadow-lg"
                            : isUsed
                            ? "border-green-400"
                            : "border-transparent hover:border-orange-300"
                        }`}
                        onClick={() => !isUsed && toggleSelectGallery(img.dataUrl)}
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="w-full h-20 object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                              ✓
                            </div>
                          </div>
                        )}
                        {isUsed && (
                          <div className="absolute top-1 left-1">
                            <span className="bg-green-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full">
                              UTILISÉE
                            </span>
                          </div>
                        )}
                        {/* Supprimer de la galerie */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {deleteConfirm === img.id ? (
                            <div className="flex gap-0.5">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); deleteFromGallery(img.id); }}
                                className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                                className="bg-gray-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(img.id); }}
                              className="bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center hover:bg-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] px-1 py-0.5 truncate">
                          {img.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {gallery.length} image(s) · Cliquez pour sélectionner
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("upload")}
                    className="text-xs text-orange-500 font-bold hover:underline"
                  >
                    + Uploader plus
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Onglet URL ── */}
        {tab === "url" && (
          <div>
            <p className="text-xs text-gray-500 mb-3">
              Collez une URL d'image externe (Unsplash, votre serveur, etc.)
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                placeholder="https://example.com/image.jpg"
                className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  urlError ? "border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={addUrl}
                className="bg-orange-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
              >
                Ajouter
              </button>
            </div>
            {urlError && (
              <p className="text-red-500 text-xs mt-1.5 font-semibold">{urlError}</p>
            )}
            {validImages.length >= maxImages && (
              <p className="text-orange-500 text-xs mt-1.5 font-semibold">
                ⚠️ Maximum {maxImages} images atteint. Supprimez-en une d'abord.
              </p>
            )}

            {/* Suggestions Unsplash */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">💡 Suggestions rapides :</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { url: "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80", label: "Boubou" },
                  { url: "https://images.unsplash.com/photo-1622495966027-e0173192c728?w=600&q=80", label: "Kaftan" },
                  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", label: "Homme" },
                ].map((s) => (
                  <button
                    key={s.url}
                    type="button"
                    onClick={() => {
                      setUrlInput(s.url);
                      setUrlError("");
                    }}
                    className="relative rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-400 transition-all group"
                  >
                    <img src={s.url} alt={s.label} className="w-full h-16 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold">{s.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
