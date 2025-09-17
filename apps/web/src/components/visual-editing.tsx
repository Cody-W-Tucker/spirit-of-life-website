"use client";

import { enableVisualEditing } from "@sanity/visual-editing";
import { useEffect } from "react";

export function VisualEditingWrapper() {
    useEffect(() => {
        enableVisualEditing();
    }, []);

    return null;
}
