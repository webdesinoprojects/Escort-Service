"use client";

import { useState, useEffect, useTransition } from "react";
import { getCategories, upsertCategory, deleteCategory } from "@/server/actions/admin";
import ImageKitUploader from "@/components/admin/ImageKitUploader";
import { Loader2, Plus, Edit2, Trash2, Layers, Save, X, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  id?: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  icon_name: string;
  order_index: number;
  clicks?: number;
}

export default function CategoriesCmsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal / form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [iconName, setIconName] = useState("Flame");
  const [orderIndex, setOrderIndex] = useState(0);

  const fetchCats = () => {
    setLoading(true);
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setIconName("Flame");
    setOrderIndex(categories.length);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setIconName(cat.icon_name || "Flame");
    setOrderIndex(cat.order_index || 0);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will delete all listings associated with this category.")) return;

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted successfully!");
        fetchCats();
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    });
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto generate slug if not editing
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug) {
      toast.error("Title and Slug are required.");
      return;
    }

    startTransition(async () => {
      const res = await upsertCategory({
        id: editingCategory?.id,
        title,
        slug,
        description,
        image_url: imageUrl,
        icon_name: iconName,
        order_index: orderIndex,
      });

      if (res.success) {
        toast.success(editingCategory ? "Category updated!" : "Category created!");
        setIsModalOpen(false);
        fetchCats();
      } else {
        toast.error(res.error || "Failed to save category.");
      }
    });
  };

  return (
    <div className="space-y-6 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground font-heading">Categories Administration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Add, edit, or delete categories displayed on the storefront.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#cf4f41] hover:bg-[#b03d31] text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-sm font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm font-semibold">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center text-muted-foreground">
          <Layers className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="font-semibold text-sm">No categories configured yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3.5 pt-4 pl-6 w-20">Banner</th>
                  <th className="pb-3.5 pt-4">Title</th>
                  <th className="pb-3.5 pt-4">Slug</th>
                  <th className="pb-3.5 pt-4">Icon Name</th>
                  <th className="pb-3.5 pt-4 w-28 text-center">Clicks</th>
                  <th className="pb-3.5 pt-4 w-28 text-center">Index</th>
                  <th className="pb-3.5 pt-4 pr-6 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-foreground">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {cat.image_url ? (
                           <Image
                            src={cat.image_url}
                            alt={cat.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={!cat.image_url.startsWith("/")}
                          />
                        ) : (
                          <Layers className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-bold">{cat.title}</td>
                    <td className="py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                    <td className="py-4 text-muted-foreground">{cat.icon_name}</td>
                    <td className="py-4 text-center font-bold text-[#cf4f41]">{cat.clicks || 0}</td>
                    <td className="py-4 text-center font-bold text-muted-foreground">{cat.order_index}</td>
                    <td className="py-4 pr-6 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cat.id && handleDelete(cat.id)}
                        disabled={isPending}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FORM DRAWER DIALOG ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideInFromRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .drawer-slide-in {
              animation: slideInFromRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />
          {/* Overlay background to close drawer */}
          <div className="absolute inset-0 bg-transparent" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-card border-l border-border/80 shadow-2xl flex flex-col drawer-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 shrink-0">
              <h3 className="text-base font-bold text-foreground font-heading">
                {editingCategory ? "Edit Category Card" : "Add New Category Card"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Escort Girls"
                    className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. escort-girls"
                    className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g., call girls and escort classifieds to find partners..."
                    rows={3}
                    className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Lucide Icon Name</label>
                    <input
                      type="text"
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      placeholder="e.g., Flame, User, Footprints"
                      className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Order Index</label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category Card Background Image</label>
                  <ImageKitUploader 
                    value={imageUrl} 
                    onChange={setImageUrl}
                    folder="oklute-categories"
                  />
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-5 mt-6 border-t border-border/80 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-border/80 text-foreground font-bold rounded-xl hover:bg-muted text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-sm font-heading"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
