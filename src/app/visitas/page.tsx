import { Suspense } from "react";
import VisitaClient from "../../components/VisitaClient"
export default function HomePage() {


  return (
    <Suspense fallback={null}>
      <VisitaClient />
    </Suspense>
  );
}