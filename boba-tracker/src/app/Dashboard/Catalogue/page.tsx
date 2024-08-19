"use client"
import SavedDrinksPage from "./SavedDrinksPage";
import withAuth from '@/src/components/hoc/withAuth';

function Catalogue() {
  return (
    <div>
      <SavedDrinksPage />
    </div>
  );
}

export default withAuth(Catalogue);
