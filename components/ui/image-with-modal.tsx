"use client";

import React, { useState } from "react";

interface ImageWithModalProps {
  imageUrl: string;
  altText: string;
}

const ImageWithModal = ({ imageUrl, altText }: ImageWithModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <h3
        style={{
          fontSize: "1.2rem",
          color: "#444",
          marginBottom: "10px",
        }}
      >
        {altText}
      </h3>
      <img
        src={imageUrl}
        alt={altText}
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          objectFit: "fill",
          cursor: "pointer",
        }}
        onClick={openModal}
      />

      {isModalOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Para evitar que el modal se cierre al hacer clic dentro
          >
            <img
              src={imageUrl} // Usa modalImageUrl si se pasa, o la imagen original
              alt={altText}
              style={{
                width: "100%",
                height: "80vh",
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithModal;
