"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/mockData";
import { trackViewItem } from "@/lib/gtag";

interface Props {
  product: Product;
}

export default function ProductAnalyticsTracker({ product }: Props) {
  useEffect(() => {
    trackViewItem(product);
  }, [product]);

  return null;
}

