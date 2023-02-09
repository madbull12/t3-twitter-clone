import { Notification } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import React, { useRef } from "react";
import { BsTwitter } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import { useHover } from "usehooks-ts";
import { trpc } from "../utils/trpc";

interface IProps {
  notification: Notification;
}
const NotificationComponent = ({ notification }: IProps) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const utils = trpc.useContext();
  const { mutateAsync: deleteNotification } =
    trpc.notification.deleteNotification.useMutation({
      onSettled: () => {
        utils.notification.getUserNotifications.invalidate();
      },
    });
  return (
    <Link
      ref={hoverRef}
      href={notification.redirectUrl}
      className="flex cursor-pointer items-center gap-x-4 p-4 hover:bg-base-200 "
    >
      <BsTwitter className="text-2xl text-primary" />
      <div>
        <p className=" text-neutral">{notification.text}</p>
        <p className="text-xs text-gray-500">
        {moment(notification.createdAt as Date).format("lll")}
        </p>
      </div>
      {isHover ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteNotification({ notificationId: notification.id });
          }}
          className="ml-auto text-sm text-gray-500 hover:text-gray-600"
        >
          <IoTrash />
        </button>
      ) : null}
    </Link>
  );
};

export default NotificationComponent;
