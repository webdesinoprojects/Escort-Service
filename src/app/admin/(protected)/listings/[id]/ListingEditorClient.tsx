"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertListing } from "@/server/actions/admin";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ListingEditorClientProps {
  listing: any;
  categories: any[];
  cities: any[];
  isNew: boolean;
}

const DEMO_SERVICES = [
  "Oral", "Anal", "Girlfriend experience", "French kiss", "Role play", "Threesome", "Sexting", "Videocall",
  "Body Massage", "Erotic Spa", "Nuru Massage", "Deep Tissue", "Foot Massage", "Sensual Stroke",
  "Call Boy Companion", "Erotic Romance", "Gentleman escort", "Dinner date", "Sensual companionship",
  "Shemale pleasure", "Active/Passive", "Ladyboy hookup", "Erotic play", "Oral completion"
];
const DEMO_PLACES = ["At home", "Events and parties", "Hotel / Motel", "Clubs", "Outcall"];
const DEMO_ATTENTION = ["Men", "Women", "Couples", "Disabled"];
const ETHNICITIES = ["African", "Indian", "Asian", "Arab", "Latin", "Caucasian"];
const NATIONALITIES = ["Indian", "Brazilian", "Russian", "German", "Italian", "Spanish", "Colombian", "Thai"];
const BREAST_TYPES = ["Natural", "Silicone", "Small", "Medium", "Large"];
const HAIR_COLORS = ["Black", "Brown", "Blonde", "Red", "Shaved", "Long", "Short"];
const BODY_TYPES = ["Slim", "Athletic", "Average", "Curvy", "Plump"];

export default function ListingEditorClient({
  listing,
  categories,
  cities,
  isNew,
}: ListingEditorClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(listing?.title || "");
  const [name, setName] = useState(listing?.name || "");
  const [age, setAge] = useState(listing?.age !== undefined && listing?.age !== null ? String(listing.age) : "");
  const [description, setDescription] = useState(listing?.description || "");
  const [phone, setPhone] = useState(listing?.phone || "");
  const [whatsapp, setWhatsapp] = useState(listing?.whatsapp || "");
  const [isVip, setIsVip] = useState(listing?.is_vip || false);
  const [status, setStatus] = useState(listing?.status || "draft");
  const [categoryId, setCategoryId] = useState(listing?.category_id || categories[0]?.id || "");
  const [cityId, setCityId] = useState(listing?.city_id || cities[0]?.id || "");
  const [ethnicity, setEthnicity] = useState(listing?.ethnicity || "");
  const [nationality, setNationality] = useState(listing?.nationality || "");
  const [breast, setBreast] = useState(listing?.breast || "");
  const [hair, setHair] = useState(listing?.hair || "");
  const [bodyType, setBodyType] = useState(listing?.body_type || "");
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [aboutMe, setAboutMe] = useState<string[]>(listing?.about_me || []);
  const [services, setServices] = useState<string[]>(listing?.services || []);
  const [placeOfService, setPlaceOfService] = useState<string[]>(listing?.place_of_service || []);
  const [attentionTo, setAttentionTo] = useState<string[]>(listing?.attention_to || []);
  const [newBullet, setNewBullet] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const addBullet = () => {
    if (!newBullet.trim()) return;
    setAboutMe([...aboutMe, newBullet.trim()]);
    setNewBullet("");
  };
  const removeBullet = (index: number) => setAboutMe(aboutMe.filter((_, i) => i !== index));
  const toggleService = (srv: string) =>
    setServices(services.includes(srv) ? services.filter((s) => s !== srv) : [...services, srv]);
  const togglePlace = (pl: string) =>
    setPlaceOfService(placeOfService.includes(pl) ? placeOfService.filter((p) => p !== pl) : [...placeOfService, pl]);
  const toggleAttention = (att: string) =>
    setAttentionTo(attentionTo.includes(att) ? attentionTo.filter((a) => a !== att) : [...attentionTo, att]);
  const removeImage = (url: string) => setImages(images.filter((img) => img !== url));

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 7) {
      toast.error("You can upload a maximum of 7 images per listing.");
      return;
    }
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" is too large. Max 5MB.`);
          continue;
        }
        const authRes = await fetch("/api/imagekit/auth");
        if (!authRes.ok) throw new Error("ImageKit auth failed");
        const { signature, token, expire } = await authRes.json();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
        formData.append("signature", signature);
        formData.append("token", token);
        formData.append("expire", expire);
        formData.append("folder", "oklute-listings");
        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error(`Failed uploading "${file.name}"`);
        const uploadData = await uploadRes.json();
        uploadedUrls.push(uploadData.url);
      }
      setImages([...images, ...uploadedUrls]);
      toast.success("Images uploaded!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed.", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Ad Title is required.");
    if (images.length === 0) return toast.error("At least 1 profile image is required.");
    if (!categoryId || !cityId) return toast.error("Please select a valid Category and Location.");

    startTransition(async () => {
      const res = await upsertListing({
        id: listing?.id,
        title,
        name: name || null,
        age: age ? parseInt(age, 10) : null,
        description: description || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        is_vip: isVip,
        status,
        category_id: categoryId,
        city_id: cityId,
        images,
        about_me: aboutMe,
        tags: [listing?.category?.slug || "independent"],
        services,
        attention_to: attentionTo,
        place_of_service: placeOfService,
        ethnicity: ethnicity || null,
        nationality: nationality || null,
        breast: breast || null,
        hair: hair || null,
        body_type: bodyType || null,
      });
      if (res.success) {
        toast.success(isNew ? "Ad created!" : "Ad saved!");
        router.push("/admin/listings");
      } else {
        toast.error(res.error || "Failed to save.");
      }
    });
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/listings")}
          className="p-2 border border-border/80 rounded-xl hover:bg-muted cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-foreground font-heading">
            {isNew ? "Create Advertisement" : `Edit Listing ${listing?.ad_id}`}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill in the details. Only Title and Images are required.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Info */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">Primary Info</h3>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Ad Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Profile Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="18" max="99"
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Contact Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">WhatsApp</label>
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] font-mono" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">
              Images Portfolio * <span className="text-xs text-muted-foreground font-normal">({images.length} / 7)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={url} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-muted group">
                  <Image src={url} alt={`Photo ${index + 1}`} fill sizes="150px" className="object-cover"
                    unoptimized={!url.startsWith("/")} />
                  <button type="button" onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {images.length < 7 && (
                <div onClick={() => !isUploading && document.getElementById("bundle-file")?.click()}
                  className={`aspect-[3/4] border-2 border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center cursor-pointer p-4 text-center bg-card ${isUploading ? "pointer-events-none opacity-50" : ""}`}>
                  {isUploading ? <Loader2 className="w-6 h-6 text-[#cf4f41] animate-spin" /> : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-xs font-bold">Upload Slots</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input id="bundle-file" type="file" multiple onChange={handleMultipleFilesUpload} accept="image/*" className="hidden" />
          </div>

          {/* Bullets */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">About Me Bullets</h3>
            <div className="flex gap-2">
              <input type="text" value={newBullet} onChange={(e) => setNewBullet(e.target.value)}
                className="flex-1 bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41]" />
              <button type="button" onClick={addBullet}
                className="bg-[#202e4d] text-white p-3 rounded-xl cursor-pointer flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {aboutMe.length > 0 && (
              <ul className="space-y-2 pt-2">
                {aboutMe.map((bullet, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 bg-muted/40 border border-border/50 px-4 py-2.5 rounded-xl text-sm">
                    <span className="truncate">{bullet}</span>
                    <button type="button" onClick={() => removeBullet(idx)} className="text-destructive shrink-0 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Services */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">Services & Placements</h3>
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-muted-foreground">Erotic Services</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEMO_SERVICES.map((srv) => {
                  const checked = services.includes(srv);
                  return (
                    <div key={srv} onClick={() => toggleService(srv)}
                      className={`border rounded-xl p-3 flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${checked ? "border-[#cf4f41] bg-[#cf4f41]/5 text-[#cf4f41]" : "border-border hover:bg-muted/40"}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-[#cf4f41] border-[#cf4f41] text-white" : "border-border"}`}>
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{srv}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground">Place of Service</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEMO_PLACES.map((pl) => {
                  const checked = placeOfService.includes(pl);
                  return (
                    <div key={pl} onClick={() => togglePlace(pl)}
                      className={`border rounded-xl p-3 flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${checked ? "border-[#cf4f41] bg-[#cf4f41]/5 text-[#cf4f41]" : "border-border hover:bg-muted/40"}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-[#cf4f41] border-[#cf4f41] text-white" : "border-border"}`}>
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{pl}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground">Attention To</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEMO_ATTENTION.map((att) => {
                  const checked = attentionTo.includes(att);
                  return (
                    <div key={att} onClick={() => toggleAttention(att)}
                      className={`border rounded-xl p-3 flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${checked ? "border-[#cf4f41] bg-[#cf4f41]/5 text-[#cf4f41]" : "border-border hover:bg-muted/40"}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-[#cf4f41] border-[#cf4f41] text-white" : "border-border"}`}>
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{att}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">Publication Panel</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">VIP Placement</span>
              <button type="button" onClick={() => setIsVip(!isVip)}
                className={`w-11 h-6 rounded-full relative outline-none cursor-pointer ${isVip ? "bg-amber-500" : "bg-border"}`}>
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isVip ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Category *</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">City *</label>
              <select required value={cityId} onChange={(e) => setCityId(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name} ({city.state_name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="pt-4 border-t border-border/80">
              <button type="submit" disabled={isPending || isUploading}
                className="w-full bg-[#cf4f41] hover:bg-[#b03d31] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Saving...</span></> : <><Save className="w-5 h-5" /><span>Save Changes</span></>}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold border-b border-border/60 pb-3">Demographics</h3>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Ethnicity</label>
              <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="">Choose</option>
                {ETHNICITIES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Nationality</label>
              <select value={nationality} onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="">Choose</option>
                {NATIONALITIES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Breast</label>
              <select value={breast} onChange={(e) => setBreast(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="">Choose</option>
                {BREAST_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Hair</label>
              <select value={hair} onChange={(e) => setHair(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="">Choose</option>
                {HAIR_COLORS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Body</label>
              <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#cf4f41] cursor-pointer">
                <option value="">Choose</option>
                {BODY_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
