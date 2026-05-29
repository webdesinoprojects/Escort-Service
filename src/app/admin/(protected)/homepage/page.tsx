"use client";

import { useState, useEffect, useTransition } from "react";
import { getHeroSettings, updateHeroSettings } from "@/server/actions/admin";
import ImageKitUploader from "@/components/admin/ImageKitUploader";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function HeroCmsPage() {
  const [isPending, startTransition] = useTransition();
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    getHeroSettings().then((settings) => {
      setHeroTitle(settings.hero_title);
      setHeroSubtitle(settings.hero_subtitle);
      setHeroImageUrl(settings.hero_image_url);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!heroTitle || !heroSubtitle || !heroImageUrl) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isImageUploading) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    startTransition(async () => {
      const res = await updateHeroSettings({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_image_url: heroImageUrl,
      });

      if (res.success) {
        toast.success("Hero settings updated successfully!");
      } else {
        toast.error(res.error || "Failed to update hero settings.");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground text-sm font-semibold select-none">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Hero settings...</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl font-sans select-none">
      <div className="mb-6">
        <h2 className="text-base font-bold text-foreground font-heading">Manage Hero Section</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Customize the main landing page headline, subheadline and background image.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Hero Heading Title
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Flying Solo? No Worries..."
            className="w-full bg-background border border-border/80 rounded-xl py-3 px-4 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Hero Subheadline
          </label>
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Search or Post Your Adult Advertisement"
            className="w-full bg-background border border-border/80 rounded-xl py-3 px-4 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Background Image (Hero Backdrop)
          </label>
          <ImageKitUploader 
            value={heroImageUrl} 
            onChange={setHeroImageUrl}
            onUploadingChange={setIsImageUploading}
            disabled={isPending}
            folder="oklute-hero"
          />
        </div>

        <div className="pt-4 border-t border-border/80 flex justify-end">
          <button
            type="submit"
            disabled={isPending || isImageUploading}
            className="bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer font-heading tracking-wide"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : isImageUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading Image...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
