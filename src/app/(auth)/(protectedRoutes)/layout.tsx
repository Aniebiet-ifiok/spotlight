import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/ReusableComponents/LayoutComponents/Sidebar";
import Header from "@/components/ReusableComponents/LayoutComponents/Header";
import { getAuthenticatedUser } from "@/actions/auth";

type Props = { children: ReactNode };

const Layout = async ({ children }: Props) => {
  const auth = await getAuthenticatedUser();

  // Redirect if NOT authenticated
  if (auth.status !== 200 && auth.status !== 201) {
    redirect("/sign-in");
  }

  // Pass the actual user object to Header
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto px-4 container mx-auto">
        {/* HEADER */}
        <Header user={auth.User ?? null} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
