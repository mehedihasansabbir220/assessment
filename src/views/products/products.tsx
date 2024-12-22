"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { ProductModal } from "@/views/products/productModal/productModal";
import { BackToHome } from "@/components/backToHome/backToHome";
import { ProductList } from "@/views/products/productList/productList";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";

export const Products: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
    setCurrentPage,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('productId');
      const page = params.get('page');

      if (page) {
        const pageNum = parseInt(page);
        if (pageNum >= 1 && pageNum <= totalPages) {
          setCurrentPage(pageNum);
        }
      }

      if (productId) {
        const product = PRODUCTS_DATA.find(p => p.id.toString() === productId);
        if (product) {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }
      } else {
        setSelectedProduct(null);
        setIsModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [totalPages, setCurrentPage]);

  // Initialize state from URL on mount
  useEffect(() => {
    const productId = searchParams.get('productId');
    const page = searchParams.get('page');

    if (page) {
      const pageNum = parseInt(page);
      if (pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
      }
    }

    if (productId) {
      const product = PRODUCTS_DATA.find(p => p.id.toString() === productId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, totalPages, setCurrentPage]);

  const updateURL = useCallback((productId?: string | null, page: number = currentPage) => {
    const params = new URLSearchParams(searchParams.toString());

    if (productId) {
      params.set('productId', productId);
    } else {
      params.delete('productId');
    }

    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    const newURL = params.toString()
      ? `?${params.toString()}`
      : '';

    router.push(`/products${newURL}`, { scroll: false });
  }, [router, currentPage, searchParams]);

  const handleOpenModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    updateURL(product.id.toString());
  }, [updateURL]);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    updateURL(null);
  }, [updateURL]);

  const handlePageChangeWithURL = useCallback((direction: "next" | "prev") => {
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
    handlePageChange(direction);
    updateURL(selectedProduct?.id?.toString() || null, newPage);
  }, [currentPage, handlePageChange, updateURL, selectedProduct]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChangeWithURL}
      />
      {isModalOpen && selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};