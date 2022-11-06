import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function NetWorkWrapper({ children }: Props) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window &&
        window.addEventListener("offline", function (e) {
          toast.error("You are offline", {
            toastId: "offline-id",
          });
        });

      window &&
        window.addEventListener("online", function (e) {
          toast.success("You are online", {
            toastId: "online-id",
          });
          this.setTimeout(() => {
            this.window.location.reload();
          }, 2000);
        });
    }
    return () => {
      if (typeof window !== "undefined") {
        window &&
          window.removeEventListener("offline", function (e) {
            toast.error("You are offline", {
              toastId: "offline-id",
            });
          });

        window &&
          window.removeEventListener("online", function (e) {
            toast.success("You are online", {
              toastId: "online-id",
            });
            this.setTimeout(() => {
              this.window.location.reload();
            }, 2000);
          });
      }
    };
  }, []);

  return <div>{children}</div>;
}
