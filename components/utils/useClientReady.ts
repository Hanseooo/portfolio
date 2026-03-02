"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useClientReady() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
