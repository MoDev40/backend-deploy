import { prisma } from "../config/config.js";

export const createNotifications = async (req, res) => {
  
  try {
    const { userId } = req.decoded;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const needNotifications = await prisma.item.findMany({
      where: {
        quantity: {
          lt: 6
        },
        ownerId: Number(userId)
      }
    });
    let isNotifCreated = false;
    for(let i = 0 ; i<needNotifications.length; i++){
      const isNotifExists = await prisma.notification.findMany({
        where:{
          createdAt:{
            gt: new Date(currentYear, currentMonth,1),
            lt: new Date(currentYear, currentMonth+1,1)
          },itemId:needNotifications[i].id
        }
      })
      if(isNotifExists.length == 0){
        isNotifCreated = true;
        await prisma.notification.create({
          data:{
            itemId:needNotifications[i].id,
            message:`Low quantity for this item ${needNotifications[i].name} `
          }
        })
      }
    }
    if(isNotifCreated){
      res.status(200).json({ message: "Incoming Notification. Check Your Notifications"});
    }
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

export const fetchNotifications = async (req,res)=>{
  try{
    const { userId } = req.decoded;

    const notifications = await prisma.notification.findMany({
      where:{
        item:{
          ownerId:Number(userId)
        }
      }
    })
    if(notifications.length == 0){
      res.status(404).json({ message: "There is No Notification..."});
      return
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
}

export const deleteNotifications = async(req,res)=>{
  try {
    const {id} = req.params
    const deleteNotifications = await prisma.notification.delete({
      where:{
        id:Number(id),
      }
    })

    if(!deleteNotifications){
      res.status(404).send({ message: "Delete notification failed"})
      return;
    }
    res.status(200).send({ message:"Delete notification successfully"})
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
}
