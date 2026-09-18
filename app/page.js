"use client";

import { useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CheckoutForm, { PRODUCT } from "../components/CheckoutForm";
import SuccessScreen from "../components/SuccessScreen";

export default function Page() {
  const [paid, setPaid] = useState(false);

  if (paid) {
    return <SuccessScreen />;
  }

  return (
    <>
      <Header />
      <main className="page">
        <ProductCard
          name={PRODUCT.name}
          description={PRODUCT.description}
          price={`$${PRODUCT.price.toFixed(2)}`}
        />
        <CheckoutForm onSuccess={() => setPaid(true)} />
      </main>
    </>
  );
}
