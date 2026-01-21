import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/ReusableComponents/LayoutComponents/Sidebar";
import Header from "@/components/ReusableComponents/LayoutComponents/Header";
import { getAuthenticatedUser } from "@/actions/auth";
import { getAllProductsFromStripe } from "@/actions/stripe";

type Props = { children: ReactNode };

const Layout = async ({ children }: Props) => {
  const auth = await getAuthenticatedUser();

  // Redirect if NOT authenticated
  if (auth.status !== 200 && auth.status !== 201) {
    redirect("/sign-in");
  }

  const stripeProductsData = await getAllProductsFromStripe();
  const stripeProducts = stripeProductsData?.products ?? [];

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto px-4 container mx-auto">
        <Header user={auth.User ?? null} stripeProducts={stripeProducts}/>
        <div className="flex-1 py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
