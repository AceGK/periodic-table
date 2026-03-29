"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "flashcard-config";

function load() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export default function useFlashCardConfig(defaultFront = "name", defaultBack = "full_details", defaultSet = "all") {
  const saved = load();
  const [frontField, setFrontField] = useState(saved?.front || defaultFront);
  const [backField, setBackField] = useState(saved?.back || defaultBack);
  const [set, setSet] = useState(saved?.set || defaultSet);

  useEffect(() => {
    save({ front: frontField, back: backField, set });
  }, [frontField, backField, set]);

  return { frontField, setFrontField, backField, setBackField, set, setSet };
}
