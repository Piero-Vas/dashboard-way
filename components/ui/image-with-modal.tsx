"use client";

import React, { useState } from "react";

interface ImageWithModalProps {
  imageUrl: string;
  altText: string;
}

const ImageWithModal = ({ imageUrl, altText }: ImageWithModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const openModal = () => {
    if (imageUrl) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isPdf = imageUrl && imageUrl.toLowerCase().includes(".pdf");

  return (
    <div className="flex flex-col items-center justify-center mb-4 w-1/2 p-2">
      <div className="items-center justify-center mb-2 text-center">
        <h3
          style={{
            fontSize: "1.1rem",
            color: "#444",
            marginBottom: "6px",
            fontWeight: "600",
          }}
        >
          {altText}
        </h3>
      </div>

      {!imageUrl || hasError ? (
        <div className="w-[180px] h-[180px] rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-2 text-center">
          <span className="text-gray-400 text-xs mb-1">Sin imagen cargada</span>
        </div>
      ) : isPdf ? (
        <div className="w-[180px] h-[180px] rounded-lg border border-blue-200 bg-blue-50 flex flex-col items-center justify-center p-2 text-center">
          <span className="text-blue-600 font-semibold text-xs mb-2">Archivo PDF</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
          >
            Abrir PDF
          </a>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={imageUrl}
            alt={altText}
            onError={() => setHasError(true)}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={openModal}
          />
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 underline block text-center mt-1"
          >
            Abrir imagen externa
          </a>
        </div>
      )}

      {isModalOpen && !hasError && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]"
          onClick={closeModal}
        >
          <div
            className="relative p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={altText}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Cerrar (X)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithModal;
