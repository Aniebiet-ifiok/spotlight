import { getAuthenticatedUser } from '../../../actions/auth';
import { redirect } from 'next/navigation';
import { prismaClient } from '@/lib/prismaClient'; // make sure your prisma client is exported from here
// import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const AuthCallbackPage = async () => {
  // Step 1: Get the user from Clerk
  const auth = await getAuthenticatedUser();

  // Step 2: Check if auth is successful
  if (auth.status >= 200 && auth.status < 300 && auth.user) {
    const userId = auth.user.id; // Clerk's unique user ID
    const email = auth.user.email;

    // Step 3: Check if the user exists in your Prisma DB
    let user = await prismaClient.user.findUnique({ where: { id: userId } });

    // Step 4: If not, create the user automatically
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          id: userId,
          email,
        },
      });
    }

    // Step 5: Redirect to /home once user exists
    redirect('/home');
  } else {
    // If auth failed
    redirect('/');
  }

  // This will only render briefly while redirecting
  return <div>Authenticating...</div>;
};

export default AuthCallbackPage;
