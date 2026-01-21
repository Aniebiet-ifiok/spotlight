import { getAuthenticatedUser } from "@/actions/auth";
import { getWebinarByPresenterId, Webinar } from "@/actions/webinar";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { HomeIcon, Users, Video } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import WebinarCard from "./_components/WebinarCard";
// import { Webinar } from "@/types";

type Props = {};

const Page = async (props: Props) => {
  const checkUser = await getAuthenticatedUser();

  if (!checkUser.user) {
    redirect("/");
  }

  const webinars = await getWebinarByPresenterId(checkUser.user.id);

  const now = new Date();

const upcomingWebinars = webinars.filter(
  (webinar: Webinar) => new Date(webinar.startDate) > now
);

const endedWebinars = webinars.filter(
  (webinar: Webinar) => new Date(webinar.startDate) <= now
);

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
          <TabsTrigger
            value="all"
            className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-3 py-2"
          >
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

      <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        {webinars.length > 0 ? (
          webinars.map((webinar: Webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No webinar found
          </div>
        )}
      </TabsContent>

      <TabsContent
  value="upcoming"
  className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
>
  {upcomingWebinars.length > 0 ? (
    upcomingWebinars.map((webinar: Webinar) => (
      <WebinarCard key={webinar.id} webinar={webinar} />
    ))
  ) : (
    <EmptyState message="No upcoming webinars" />
  )}
</TabsContent>

<TabsContent
  value="ended"
  className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
>
  {endedWebinars.length > 0 ? (
    endedWebinars.map((webinar: Webinar) => (
      <WebinarCard key={webinar.id} webinar={webinar} />
    ))
  ) : (
    <EmptyState message="No ended webinars" />
  )}
</TabsContent>


    </Tabs>
  );
};

export default Page;
