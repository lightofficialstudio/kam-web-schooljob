"use client";

import EmployerSection from "./_components/employer-section";
import HeroSection from "./_components/hero-section";
import JobSeekerSection from "./_components/job-seeker-section";
import LatestJobsSection from "./_components/latest-jobs-section";

// Orchestrator: ประกอบ Section ต่างๆ ของ Landing Page
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LatestJobsSection />
      <EmployerSection />
      <JobSeekerSection />
    </>
  );
}
