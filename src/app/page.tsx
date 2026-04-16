/**
 * Landing Page
 *
 * Phase 1: Simple redirect to /studio
 * Phase 7: Full marketing landing page with hero, features, pricing
 */

import { redirect } from "next/navigation";

export default function Home() {
  // Phase 1: Ship fast — land directly in the studio
  redirect("/studio");
}
