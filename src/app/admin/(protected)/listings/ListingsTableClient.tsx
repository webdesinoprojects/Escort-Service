"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAdminListings,
  toggleListingStatus,
  archiveListing,
  deleteListing,
} from "@/server/actions/admin";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Crown,
  MapPin,
  ExternalLink,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ListingsTableClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"updated_desc" | "created_desc" | "created_asc">("updated_desc");
  const [dateRange, setDateRange] = useState<"all" | "today" | "7d" | "30d">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Data
  const [listings, setListings] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = () => {
    setIsLoading(true);
    getAdminListings({
      page: currentPage,
      limit: 15,
      status,
      search,
      sort,
      dateRange,
    }).then((res: any) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        setListings(res.listings || []);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems || 0);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage, status, sort, dateRange]);

  const activeFilterCount = (sort !== "updated_desc" ? 1 : 0) + (dateRange !== "all" ? 1 : 0);
  const clearFilters = () => {
    setSort("updated_desc");
    setDateRange("all");
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleStatusToggle = (id: string, current: string) => {
    startTransition(async () => {
      const res = await toggleListingStatus(id, current);
      if (res.success) {
        toast.success(`Ad status changed to ${res.newStatus}!`);
        fetchListings();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handleArchive = (id: string) => {
    if (!confirm("Are you sure you want to archive this ad? It will be removed from search but kept in records.")) return;

    startTransition(async () => {
      const res = await archiveListing(id);
      if (res.success) {
        toast.success("Ad archived successfully!");
        fetchListings();
      } else {
        toast.error(res.error || "Failed to archive ad");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("WARNING: This will permanently delete this ad listing. This action cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteListing(id);
      if (res.success) {
        toast.success("Ad listing deleted permanently!");
        fetchListings();
      } else {
        toast.error(res.error || "Failed to delete ad");
      }
    });
  };

  const getStorefrontLink = (row: any) => {
    if (!row.category?.slug) return "#";
    const titleSlug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return `/${row.category.slug}/${titleSlug}-${row.ad_id}`;
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground font-heading">Escorts Ad Listings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage classified advertisements, approve drafts, archive listings, or edit fields.</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="bg-[#cf4f41] hover:bg-[#b03d31] text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-sm font-heading"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Create New Ad</span>
        </Link>
      </div>

      {/* FILTER & SEARCH BAND */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, name, AD ID..."
              className="w-full bg-background border border-border/80 rounded-xl py-2.5 pl-10 pr-4 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            className="bg-[#202e4d] hover:bg-[#162036] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer uppercase font-heading tracking-wider"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:block">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
            className="bg-background border border-border/80 rounded-xl py-2.5 px-4 text-foreground text-sm outline-none focus:border-[#cf4f41] transition-all cursor-pointer font-sans"
          >
            <option value="all">All Listings</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-1.5 border rounded-xl py-2.5 px-4 text-sm font-bold transition-colors cursor-pointer font-sans ${
              activeFilterCount > 0
                ? "bg-[#cf4f41]/10 border-[#cf4f41] text-[#cf4f41]"
                : "bg-background border-border/80 text-foreground hover:bg-muted"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center text-[10px] font-bold bg-[#cf4f41] text-white rounded-full w-4 h-4">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-lg p-4 z-20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Filters</span>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-muted rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as any); setCurrentPage(1); }}
                  className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-sm outline-none focus:border-[#cf4f41] cursor-pointer"
                >
                  <option value="updated_desc">Recently Updated</option>
                  <option value="created_desc">Newest Created</option>
                  <option value="created_asc">Oldest Created</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Date Created
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => { setDateRange(e.target.value as any); setCurrentPage(1); }}
                  className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-sm outline-none focus:border-[#cf4f41] cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full text-xs font-bold text-[#cf4f41] hover:bg-[#cf4f41]/10 py-2 rounded-lg cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABLE ELEMENT */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm font-semibold">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading classified listings...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center text-muted-foreground">
          <Search className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="font-semibold text-sm">No listings found matching filters.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3.5 pt-4 pl-6 w-20">Photo</th>
                  <th className="pb-3.5 pt-4">AD ID</th>
                  <th className="pb-3.5 pt-4">Title / Profile</th>
                  <th className="pb-3.5 pt-4">Category</th>
                  <th className="pb-3.5 pt-4">Location</th>
                  <th className="pb-3.5 pt-4 w-28 text-center">Status</th>
                  <th className="pb-3.5 pt-4 pr-6 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-foreground">
                {listings.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {row.images && row.images.length > 0 ? (
                          <Image
                            src={row.images[0]}
                            alt={row.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={!row.images[0].startsWith("/")}
                          />
                        ) : (
                          <Search className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-xs text-[#cf4f41]">{row.ad_id}</td>
                    <td className="py-4 pr-4 max-w-[280px]">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-bold truncate" title={row.title}>{row.title}</span>
                          {row.is_vip && <span title="VIP Listing" className="shrink-0"><Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /></span>}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {row.name ? `${row.name}, ` : ""}Age: {row.age || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground font-semibold">
                      {row.category?.title || "Escort"}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <span>{row.city?.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(row.id, row.status)}
                        disabled={isPending || row.status === "archived"}
                        className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border cursor-pointer hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed
                          ${row.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : row.status === "archived"
                            ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        `}
                        title={row.status === "published" ? "Click to Unpublish (Draft)" : "Click to Publish"}
                      >
                        {row.status}
                      </button>
                    </td>
                    <td className="py-4 pr-6 text-right space-x-1">
                      {row.status === "published" && (
                        <a
                          href={getStorefrontLink(row)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors inline-flex"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/listings/${row.id}`}
                        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors inline-flex"
                        title="Edit Listing"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      {row.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(row.id)}
                          disabled={isPending}
                          className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer inline-flex"
                          title="Archive Listing"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={isPending}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/80">
              <span className="text-xs text-muted-foreground">
                Showing page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong> ({totalItems} total items)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1 || isPending}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 border border-border/80 rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages || isPending}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 border border-border/80 rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
