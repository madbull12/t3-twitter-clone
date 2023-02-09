import React from "react";
import Body from "../components/Body";
import NavFeed from "../components/NavFeed";
import NotificationComponent from "../components/NotificationComponent";
import { trpc } from "../utils/trpc";

const NotificationPage = () => {
  const { data: notifications } =
    trpc.notification.getUserNotifications.useQuery();

  return (
    <Body>
      <NavFeed title="Notifications" />
      {notifications?.length !== 0 ? (
        <>
          {notifications?.map((notification) => (
            <NotificationComponent notification={notification} />
          ))}
        </>
      ) : (
        <h1 className="p-4 text-xl font-bold">No notifications here</h1>
      )}
    </Body>
  );
};

export default NotificationPage;
