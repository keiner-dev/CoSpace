"use client";

import { useSyncExternalStore } from "react";

interface ClientFormattedDateProps {
  isoString: string;
  type?: "date" | "time" | "full";
}

// Suscriptor vacío requerido por useSyncExternalStore
const emptySubscribe = () => () => {};

export default function ClientFormattedDate({ isoString, type = "full" }: ClientFormattedDateProps) {
  // useSyncExternalStore devuelve false en el servidor (SSR) y true en el navegador (CSR)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,  // Snapshot en el cliente
    () => false  // Snapshot en el servidor
  );

  if (!isClient) {
    return <span className="text-zinc-400">--:--</span>;
  }

  const date = new Date(isoString);

  if (type === "date") {
    return (
      <span>
        {date.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    );
  }

  if (type === "time") {
    return (
      <span>
        {date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    );
  }

  return (
    <span>
      {date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </span>
  );
}