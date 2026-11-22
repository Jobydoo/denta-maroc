'use client';

import React, { useState } from 'react';
import { FileType } from '@/types';
import { uploadToSupabaseStorage } from '@/lib/supabase';
import {
  Image as ImageIcon,
  Upload,
  Maximize2,
  X,
  Calendar,
  Layers,
  FileText,
  Trash2
} from 'lucide-react';
import { formatDateFR } from '@/lib/utils';

export interface PatientFileItem {
  id: string;
  title: string;
  fileType: FileType;
  fileUrl: string;
  createdAt: string | Date;
}

interface ImagingGalleryProps {
  files: PatientFileItem[];
  onUploadNew: (file: {
    title: string;
    fileType: FileType;
    fileUrl: string;
  }) => Promise<void>;
}

export default function ImagingGallery({ files, onUploadNew }: ImagingGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('TOUS');
  const [fullscreenImage, setFullscreenImage] = useState<PatientFileItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<FileType>('PANORAMIQUE');

  const filteredFiles =
    activeFilter === 'TOUS' ? files : files.filter((f) => f.fileType === activeFilter);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const res = await uploadToSupabaseStorage(file, 'dental-radios');
      await onUploadNew({
        title: newTitle || file.name,
        fileType: newType,
        fileUrl: res.url,
      });
      setNewTitle('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header & Upload Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Imagerie Médicale & Radiographies
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Panoramiques, Rétro-alvéolaires, Scanners 3D et Photos cliniques avant/après
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-sky-600/20 hover:opacity-95 cursor-pointer transition-opacity">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Téléversement...' : 'Importer une Radio / Photo'}</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'TOUS', label: 'Toutes les images' },
          { id: 'PANORAMIQUE', label: 'Panoramiques' },
          { id: 'RETRO_ALVEOLAIRE', label: 'Rétro-alvéolaires' },
          { id: 'SCANNER_3D', label: 'Scanners 3D / CBCT' },
          { id: 'PHOTO_AVANT_APRES', label: 'Photos Avant / Après' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      {filteredFiles.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">
            Aucun cliché radiologique dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFiles.map((f) => (
            <div
              key={f.id}
              className="group relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 aspect-video shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={f.fileUrl}
                alt={f.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  {f.fileType.replace('_', ' ')}
                </span>
                <p className="font-bold text-xs truncate">{f.title}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{formatDateFR(f.createdAt)}</p>
              </div>

              {/* View Fullscreen Action */}
              <button
                type="button"
                onClick={() => setFullscreenImage(f)}
                className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur"
                title="Plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullscreenImage.fileUrl}
              alt={fullscreenImage.title}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
            <div className="mt-4 text-center text-white">
              <h4 className="font-bold text-base">{fullscreenImage.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Type : {fullscreenImage.fileType} • Date : {formatDateFR(fullscreenImage.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
