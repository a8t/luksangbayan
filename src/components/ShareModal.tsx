"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";

const SITE_URL =
  typeof window !== "undefined"
    ? window.location.pathname === "/memorial-wall"
      ? "https://luksangbayan.ca/memorial-wall"
      : "https://luksangbayan.ca"
    : "https://luksangbayan.ca";

const shareLinks = [
  {
    label: "Facebook",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.006 3.66 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.34 21.128 22 17.006 22 12z" />
      </svg>
    ),
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      SITE_URL
    )}`,
  },
  {
    label: "Twitter/X",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082A4.48 4.48 0 0016.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.36 4.1 7.6 1.67 4.905c-.386.664-.607 1.437-.607 2.26 0 1.56.794 2.936 2.003 3.744a4.48 4.48 0 01-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.102-.775.157-1.186.157-.29 0-.57-.028-.844-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 012 19.54a12.68 12.68 0 006.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0024 4.59a8.93 8.93 0 01-2.54.698z" />
      </svg>
    ),
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}`,
  },
  {
    label: "WhatsApp",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
      </svg>
    ),
    url: `https://wa.me/?text=${encodeURIComponent(SITE_URL)}`,
  },
  {
    label: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z" />
      </svg>
    ),
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      SITE_URL
    )}`,
  },
  {
    label: "Email",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z" />
      </svg>
    ),
    url: `mailto:?subject=Luksang Bayan&body=${encodeURIComponent(SITE_URL)}`,
  },
];

export default function ShareModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Download QR code as PNG
  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "luksangbayan-qr.png";
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgString);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          aria-label="Close share modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Share Luksang Bayan
          {window.location.pathname === "/memorial-wall"
            ? " Memorial Wall"
            : ""}
        </h2>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-100 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Share on ${link.label}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
            <button
              onClick={() => {
                navigator.clipboard.writeText(SITE_URL);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-100 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Copy Link</span>
            </button>
          </div>
          <div className="mt-4 text-center flex flex-col items-center gap-2">
            <div ref={qrRef} className="inline-block bg-white p-2 rounded-lg">
              <QRCode
                value={SITE_URL}
                size={160}
                bgColor="#fff"
                fgColor="#111"
              />
            </div>
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download QR Code
            </button>
            <p className="text-xs text-gray-400 text-center">
              Scan or share this code to visit{" "}
              <span className="font-mono">luksangbayan.ca</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
