"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWebinarStore } from "@/store/useWebinarStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaTypeEnum } from "@prisma/client";
import { Search, X } from "lucide-react";
import Stripe from "stripe";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // your Radix Select wrapper

const CTAStep = () => {
  const {
    formData,
    updateCtaField,
    getStepValidationErrors,
    addTag,
    removeTag,
  } = useWebinarStore();

  const [tagInput, setTagInput] = useState("");
  const [stripeProducts, setStripeProducts] = useState<Stripe.Product[]>([]);

  const { ctaLabel, tags, ctaType, priceId } = formData.cta;
  const errors = getStepValidationErrors("cta");

  // ---------- Handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCtaField(name as keyof typeof formData.cta, value);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const handleSelectCTAType = (value: CtaTypeEnum) => {
    updateCtaField("ctaType", value);
  };

  const handleProductChange = (value: string) => {
    updateCtaField("priceId", value);
  };

  // ---------- Fetch Stripe Products ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/stripe-products");
        const data: Stripe.Product[] = await res.json();
        setStripeProducts(data);
      } catch (err) {
        console.error("Failed to fetch Stripe products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ---------- JSX ----------
  return (
    <div className="space-y-6">
      {/* CTA Label */}
      <div className="space-y-2">
        <Label htmlFor="ctaLabel" className={errors?.ctaLabel ? "text-red-400" : ""}>
          CTA Label <span className="text-red-400">*</span>
        </Label>

        <Input
          id="ctaLabel"
          name="ctaLabel"
          value={ctaLabel || ""}
          onChange={handleChange}
          placeholder="Let's Get Started"
          className={cn(
            "!bg-background/50 border border-input",
            errors?.ctaLabel && "border-red-400 focus-visible:ring-red-400"
          )}
        />

        {errors?.ctaLabel && <p className="text-sm text-red-400">{errors.ctaLabel}</p>}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>

        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags and press Enter"
          className="!bg-background/50 border border-input"
        />

        {/* Draft tag preview */}
        {tagInput.trim() && (
          <div className="flex justify-between items-center bg-gray-800 text-white px-3 py-1 rounded-md mt-2">
            <span className="pr-5">{tagInput}</span>

            <button
              type="button"
              onClick={() => setTagInput("")}
              className="absolute top-1 right-1 text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Saved tags */}
        {tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="relative flex items-center bg-gray-800 text-white px-3 py-1 rounded-md"
              >
                <span className="pr-5">{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Type */}
      <div className="space-y-2 w-full">
        <Label>CTA Type</Label>

        <Tabs
          value={ctaType}
          onValueChange={(v) => handleSelectCTAType(v as CtaTypeEnum)}
          className="w-full"
        >
          <TabsList className="w-full bg-transparent">
            <TabsTrigger
              value={CtaTypeEnum.BOOK_A_CALL}
              className="w-1/2 data-[state=active]:!bg-background/50"
            >
              Book a Call
            </TabsTrigger>

            <TabsTrigger value={CtaTypeEnum.BUY_NOW} className="w-1/2">
              Buy Now
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

   {/* Product Select with Search */}
<div className="space-y-2">
  <Label>Attach a Product</Label>

  {/* Search input */}
  <div className="relative">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search Agents..."
      value={tagInput} // you can create a separate state if you want
      onChange={(e) => setTagInput(e.target.value)}
      className="w-full pl-10 pr-3 h-10 rounded-md border border-input    shadow-sm"
    />
  </div>

  {/* Product select */}
  <div className="relative">
    <select
  value={priceId || ""}
  onChange={(e) => handleProductChange(e.target.value)}
  className="w-full h-10 pl-3 pr-8 text-sm rounded-md border border-input shadow-sm appearance-none mt-2 bg-black text-white hover:cursor-pointer"
>
  <option value="" disabled className="bg-black text-white">
    Select a product
  </option>

  {stripeProducts.length > 0
    ? stripeProducts
        .filter((p) =>
          p.name.toLowerCase().includes(tagInput.toLowerCase())
        )
        .map((product) => (
          <option
            key={product.id}
            value={product.id}
            className="bg-black text-white"
          >
            {product.name}
          </option>
        ))
    : (
      <option value="" disabled className="bg-black text-white">
        Create Product in Stripe
      </option>
    )}
</select>


    {/* Dropdown arrow */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <svg
        className="h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
</div>


    </div>
  );
};

export default CTAStep;
