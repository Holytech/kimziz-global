export const metadata = {
  title: { absolute: "Admin | Kimziz Global Links" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return children;
}
