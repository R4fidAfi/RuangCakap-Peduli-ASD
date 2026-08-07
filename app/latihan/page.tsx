import RequireAuth from "@/components/require-auth";
import AppShell from "@/components/app-shell";
import CourseSection from "@/components/course-section";

export default function LatihanPage() {
  return (
    <RequireAuth>
      <AppShell>
        <CourseSection />
      </AppShell>
    </RequireAuth>
  );
}
