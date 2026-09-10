"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type FaceVerificationCaptureProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

const videoConstraints = {
  facingMode: "user",
  width: { ideal: 1280 },
  height: { ideal: 960 },
};

function screenshotToFile(dataUrl: string) {
  const [metadata, encoded] = dataUrl.split(",");
  const mimeType = /:(.*?);/.exec(metadata)?.[1] || "image/jpeg";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new File([bytes], `hollyway-face-${Date.now()}.jpg`, { type: mimeType });
}

function cameraErrorMessage(error: string | DOMException) {
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Camera permission was blocked. Allow camera access in your browser and try again.";
  if (error instanceof DOMException && error.name === "NotFoundError") return "No front camera was found on this device.";
  return "Hollyway could not access the front camera. Check your browser permissions and try again.";
}

export default function FaceVerificationCapture({ file, onChange }: FaceVerificationCaptureProps) {
  const webcamRef = useRef<Webcam | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  function capture() {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setCameraError("The camera is not ready yet. Keep your face in frame and try again.");
      return;
    }
    const nextFile = screenshotToFile(screenshot);
    if (nextFile.size > 10_000_000) {
      setCameraError("The captured selfie must be 10 MB or smaller.");
      return;
    }
    setCameraError("");
    onChange(nextFile);
  }

  function retake() {
    onChange(null);
    setCameraError("");
    setCameraReady(false);
    setCameraKey((current) => current + 1);
  }

  if (file && previewUrl) {
    return <div className="mt-6 grid gap-4"><div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-xl bg-[#0b1830]"><img className="h-full w-full object-cover" src={previewUrl} alt="Captured face verification selfie" /></div><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-semibold text-[#168046]">Face capture ready for verification.</span><button className="h-10 rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb] hover:bg-[#f4f8ff]" type="button" onClick={retake}>Retake selfie</button></div></div>;
  }

  return <div className="mt-6 grid gap-4"><div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-xl bg-[#0b1830]"><Webcam key={cameraKey} ref={webcamRef} audio={false} mirrored screenshotFormat="image/jpeg" screenshotQuality={0.92} videoConstraints={videoConstraints} playsInline onUserMedia={() => { setCameraReady(true); setCameraError(""); }} onUserMediaError={(error) => { setCameraReady(false); setCameraError(cameraErrorMessage(error)); }} className="h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="h-[70%] w-[52%] rounded-[50%] border-2 border-white/80 shadow-[0_0_0_999px_rgba(11,24,48,.28)]" /></div></div>{cameraError && <p className="rounded-lg border border-[#f3caca] bg-[#fff5f5] p-3 text-xs font-semibold leading-5 text-[#a32929]" role="alert">{cameraError}</p>}<div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs leading-5 text-[#53627a]">Keep your face inside the frame. Use the front camera and remove sunglasses or face coverings.</p><button className="h-10 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={capture} disabled={!cameraReady}>Capture selfie</button></div></div>;
}
