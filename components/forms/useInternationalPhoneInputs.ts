"use client";

import { useEffect } from "react";

const phonePlaceholder = "Include country code, e.g. +234 801 234 5678";
const phonePattern = "\\+[0-9][0-9 ()-]{6,20}";

export default function useInternationalPhoneInputs() {
  useEffect(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="tel"]');
    inputs.forEach((input) => {
      input.placeholder = phonePlaceholder;
      input.pattern = phonePattern;
    });
  }, []);
}
