"use client";
import BrowseStoresPage from "./BrowseStoresPage";
import withAuth from '@/src/components/hoc/withAuth';

function Browse() {
  return (
    <div className="flex justify-center">
      <BrowseStoresPage />
    </div>
  );
}

export default withAuth(Browse);
