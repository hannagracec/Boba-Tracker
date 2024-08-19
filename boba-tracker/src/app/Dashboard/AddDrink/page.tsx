"use client";
import SelectDrinkPage from "./SelectDrinkPage";
import withAuth from '@/src/components/hoc/withAuth';

function AddDrink() {
  return (
    <div>
      <SelectDrinkPage />
    </div>
  );
}

export default withAuth(AddDrink);
