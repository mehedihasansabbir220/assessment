"use client";

import React, { Suspense, } from "react";
import ProductsContent from "./productsContent/productsContent";


export const Products: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
};