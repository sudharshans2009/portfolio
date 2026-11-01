import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// The cache wrapper must preserve arbitrary callback signatures and return types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {},
) {
  return nextCache(reactCache(cb), keyParts, options);
}
