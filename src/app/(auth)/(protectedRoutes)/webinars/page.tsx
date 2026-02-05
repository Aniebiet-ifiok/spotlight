// pages/webinars/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebinarCard from "./_components/WebinarCard";
import { HomeIcon, Users, Video } from "lucide-react";
import { getAuthenticatedUser } from "@/actions/auth";

type Webinar = {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  tags: string[];
  ctaLabel?: string;
  ctaType?: string;
  priceId?: string;
  thumbnail?: string;
  presenterId: string;
};

const Page = async () => {
  // 1️⃣ Check authenticated user
  const { user } = await getAuthenticatedUser();
  if (!user) redirect("/"); // if not logged in, redirect

  // 2️⃣ Fetch webinars from backend API
  let webinars: Webinar[] = [];
  try {
    const res = await fetch("http://localhost:5000/webinars", {
      credentials: "include", // or pass token in headers if using JWT
    });
    if (!res.ok) throw new Error("Failed to fetch webinars");
    const allWebinars: Webinar[] = await res.json();

    // 3️⃣ Filter webinars for the current presenter
    webinars = allWebinars.filter(w => w.presenterId === user._id);
  } catch (error) {
    console.error("Error fetching webinars:", error);
    webinars = [];
  }

  const now = new Date();

  // Split webinars into upcoming and ended
  const upcomingWebinars = webinars.filter(w => new Date(w.startTime) > now);
  const endedWebinars = webinars.filter(w => new Date(w.startTime) <= now);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-xl col-span-12">
      {message}
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Video className="w-3 h-3" />}
        rightIcon={<Users className="w-3 h-3" />}
        heading="The Home to All your Webinars"
        placeholder="Search option..."
      >
        <TabsList className="bg-transparent flex flex-nowrap gap-3 w-max">
          <TabsTrigger value="all" className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-3 py-2">
            All
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="bg-secondary px-3 py-2">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="ended" className="bg-secondary px-3 py-2">
            Ended
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <TabsContent value="all" className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {webinars.length ? webinars.map(w => <WebinarCard key={w._id} webinar={w} />) : <EmptyState message="No webinars found" />}
      </TabsContent>

      <TabsContent value="upcoming" className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {upcomingWebinars.length ? upcomingWebinars.map(w => <WebinarCard key={w._id} webinar={w} />) : <EmptyState message="No upcoming webinars" />}
      </TabsContent>

      <TabsContent value="ended" className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {endedWebinars.length ? endedWebinars.map(w => <WebinarCard key={w._id} webinar={w} />) : <EmptyState message="No ended webinars" />}
      </TabsContent>
    </Tabs>
  );
};

export default Page;
