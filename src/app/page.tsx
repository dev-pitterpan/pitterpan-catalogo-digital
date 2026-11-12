import CatalogHome from "@shared/components/home/CatalogHome";
import { getPageData } from "@shared/server/catalogs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { catalogs } = await getPageData();
  const month = Number(
    new Intl.DateTimeFormat("pt-BR", {
      month: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  return <CatalogHome catalogs={catalogs} month={month} />;
}
