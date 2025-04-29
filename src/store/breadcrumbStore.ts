import { create } from "zustand";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbStore {
  breadcrumbs: BreadcrumbItem[];
  updateBreadcrumbs: (newCrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (crumb: BreadcrumbItem) => void;
  resetBreadcrumbs: (newCrumbs: BreadcrumbItem[]) => void;
  setBreadcrumbsFromPath: (path: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  updateBreadcrumbs: (newCrumbs: BreadcrumbItem[]) =>
    set({ breadcrumbs: newCrumbs }),
  addBreadcrumb: (crumb: BreadcrumbItem) =>
    set((state) => ({
      breadcrumbs: [...state.breadcrumbs, crumb],
    })),
  resetBreadcrumbs: (newCrumbs: BreadcrumbItem[]) =>
    set({ breadcrumbs: newCrumbs }),
  setBreadcrumbsFromPath: (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => ({
      title: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
    }));
    set({ breadcrumbs });
  },
}));
