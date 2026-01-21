// Import all the icons you want to use
import { CallStatusEnum } from "@prisma/client";
import { Home, Video, Users, Settings, Sparkle } from "lucide-react"; 

export const sidebarLinks = [
  {
    id: 1,
    title: 'Home',
    icon: Home,
    link: '/home'
  },
  {
    id: 2,
    title: 'Webinars',
    icon: Video,  
    link: '/webinars'
  },
  {
    id: 3,
    title: 'Leads',
    icon: Users,  
    link: '/lead'
  },
  {
    id: 4,
    title: 'AI Agents',
    icon: Sparkle, 
    link: '/ai-agents'
  },
  {
    id: 5,
    title: 'Settings',
    icon: Settings,
    link: '/settings'
  }
];



export const OnBoardingSteps = [
  {
    id: 1,
    title: 'Create a Webinar',
    complete: false,
    link: ''
  },

   {
    id: 2,
    title: 'Get Leads',
    complete: false,
    link: ''
  },

   {
    id: 1,
    title: 'Conversion Status',
    complete: false,
    link: ''
  }
]


export const potentialCustomer = [
  {
    id: '1',
    name: 'John Doe',
    email: 'Johndoe@gmail.com',
    clerkId: '1',
    profileImage: '/vercel.svg',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tags: ['New', 'Hot Lead'],
    callStatus: CallStatusEnum.COMPLETED,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'Johndoe@gmail.com',
    clerkId: '2',
    profileImage: '/vercel.svg',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tags: ['New', 'Hot Lead'],
    callStatus: CallStatusEnum.COMPLETED,
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'Johndoe@gmail.com',
    clerkId: '3',
    profileImage: '/vercel.svg',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tags: ['New', 'Hot Lead'],
    callStatus: CallStatusEnum.COMPLETED,
  },
]


export const subscriptionPriceId = 'price_1SrJjrHxnLpsdH8ilDIuKGb9';


