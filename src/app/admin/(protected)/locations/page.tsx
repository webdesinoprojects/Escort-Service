"use client";

import { useState, useEffect, useTransition } from "react";
import { getCities, upsertCity, deleteCity } from "@/server/actions/admin";
import { Loader2, Plus, Edit2, Trash2, MapPin, Save, X } from "lucide-react";
import { toast } from "sonner";

interface City {
  id?: string;
  name: string;
  slug: string;
  state_name: string;
}

export default function LocationsCmsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal / form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  // Form inputs
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [stateName, setStateName] = useState("");

  const fetchCitiesData = () => {
    setLoading(true);
    getCities().then((data) => {
      setCities(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCitiesData();
  }, []);

  const openAddModal = () => {
    setEditingCity(null);
    setName("");
    setSlug("");
    setStateName("");
    setIsModalOpen(true);
  };

  const openEditModal = (city: City) => {
    setEditingCity(city);
    setName(city.name);
    setSlug(city.slug);
    setStateName(city.state_name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this location? All listings linked to this location will be deleted.")) return;

    startTransition(async () => {
      const res = await deleteCity(id);
      if (res.success) {
        toast.success("Location deleted successfully!");
        fetchCitiesData();
      } else {
        toast.error(res.error || "Failed to delete location");
      }
    });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCity) {
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

    if (!name || !slug || !stateName) {
      toast.error("All fields are required.");
      return;
    }

    startTransition(async () => {
      const res = await upsertCity({
        id: editingCity?.id,
        name,
        slug,
        state_name: stateName,
      });

      if (res.success) {
        toast.success(editingCity ? "Location updated!" : "Location created!");
        setIsModalOpen(false);
        fetchCitiesData();
      } else {
        toast.error(res.error || "Failed to save location.");
      }
    });
  };

  return (
    <div className="space-y-6 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground font-heading">Locations (Cities/States)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage regional nodes for dynamic categories and filter mappings.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#cf4f41] hover:bg-[#b03d31] text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-sm font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm font-semibold">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading locations...</span>
        </div>
      ) : cities.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="font-semibold text-sm">No locations configured yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3.5 pt-4 pl-6">City Name</th>
                  <th className="pb-3.5 pt-4">URL Slug</th>
                  <th className="pb-3.5 pt-4">State / UT</th>
                  <th className="pb-3.5 pt-4 pr-6 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-foreground">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 pl-6 font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#cf4f41]" />
                      <span>{city.name}</span>
                    </td>
                    <td className="py-4 text-muted-foreground font-mono text-xs">{city.slug}</td>
                    <td className="py-4 text-muted-foreground">{city.state_name}</td>
                    <td className="py-4 pr-6 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(city)}
                        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Edit Location"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => city.id && handleDelete(city.id)}
                        disabled={isPending}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Location"
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

      {/* ── FORM MODAL DIALOG ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/80">
              <h3 className="text-base font-bold text-foreground font-heading">
                {editingCity ? "Edit Location Info" : "Add New Location"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">City Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. bangalore"
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">State / Union Territory</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-5 border-t border-border/80 flex justify-end gap-3 shrink-0">
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
                      <span>Save Location</span>
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
