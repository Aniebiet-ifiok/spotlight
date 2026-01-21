import { createWebinar } from "./actions/webinar";
import { prismaClient } from "./lib/prismaClient";


async function test() {
  const dummyData = {
    basicInfo: {
      webinarName: "Terminal Test Webinar",
      description: "This webinar was created via terminal test",
      date: new Date(),
      time: "12:00",
      timeFormat: "PM",
    },
    cta: {
      ctaLabel: "Buy Now",
      ctaType: "BUY_NOW",
      tags: ["terminal", "test"],
      aiAgent: null,
      priceId: null,
    },
    additionalInfo: {
      lockChat: false,
      couponEnabled: false,
      couponCode: null,
    },
  };

  const result = await createWebinar(dummyData as any);
  console.log(result);
  await prismaClient.$disconnect();
}

test();
