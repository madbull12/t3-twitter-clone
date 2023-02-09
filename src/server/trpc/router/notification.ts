import { z } from "zod";
import { publicProcedure, router } from "../trpc";


export const notificationRouter = router({
    sendNotification:publicProcedure.input(z.object({ text: z.string(),redirectUrl:z.string(),recipientId:z.string() })).mutation(({ ctx,input })=>{
        const senderId = ctx.session?.user?.id;

        return ctx.prisma.notification.create({
            data:{
                recipient:{
                    connect:{
                        id:input?.recipientId
                    }
                },
                text:input?.text,
                redirectUrl:input?.redirectUrl,
                sender:{
                    connect:{
                        id:senderId
                    }
                }
            }
        })
    }),

    getUserNotifications:publicProcedure.query(({ ctx })=>{
        const userId = ctx.session?.user?.id;
        return ctx.prisma.notification.findMany({
            where:{
                recipientId:userId
            }
        })

    }),

    deleteNotification:publicProcedure.input(z.object({ notificationId:z.string() })).mutation(({ ctx,input })=>{
        return ctx.prisma.notification.delete({
            where:{
                id:input?.notificationId
            }
        })
    })
}) 