"use client";
import SelectDrinkPage from "./SelectDrinkPage";
import React, { Suspense }from 'react';
import withAuth from '@/src/components/hoc/withAuth';

function AddDrink() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectDrinkPage />
    </Suspense>
  );
}

export default withAuth(AddDrink);
