import Form from "next/form";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CakeSlice,
  CalendarDays,
  Candy,
  ChevronDown,
  ExternalLink,
  Layers3,
  Package,
  Palette,
  PartyPopper,
  Search,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import {
  campaignMonths,
  catalogCampaigns,
  shoppingDepartments,
} from "../../lib/catalog/departments";
import type { CatalogSummary } from "../../types/catalog";

const departments: Record<string, { icon: LucideIcon; description: string }> = {
  "festas-e-decoracao": {
    icon: PartyPopper,
    description: "Balões, temas e decoração",
  },
  "doces-e-guloseimas": {
    icon: Candy,
    description: "Balas, chocolates e confeitos",
  },
  confeitaria: {
    icon: CakeSlice,
    description: "Ingredientes, formas e utensílios",
  },
  "embalagens-e-descartaveis": {
    icon: Package,
    description: "Caixas, sacolas e itens para servir",
  },
  "artesanato-e-papelaria": {
    icon: Palette,
    description: "Papéis, fitas e materiais para criar",
  },
  utilidades: { icon: Shapes, description: "Itens práticos para o dia a dia" },
};

const campaignPhotos: Record<string, string> = {
  natal: "/assets/images/catalogs/natal/banner.webp",
  pascoa: "/assets/images/catalogs/pascoa/banner.webp",
  halloween: "/assets/images/catalogs/halloween/banner.webp",
  "festa-junina": "/assets/images/catalogs/festa-junina/banner.webp",
  "dia-das-criancas": "/assets/images/catalogs/dia-das-criancas/banner.webp",
};

function CampaignCard({ campaign }: { campaign: CatalogSummary }) {
  const photo = campaignPhotos[campaign.slug];
  return (
    <Link
      className="storefront-campaign"
      href={`/${campaign.slug}/`}
      prefetch={false}
    >
      {photo ? (
        <img src={photo} alt="" loading="lazy" />
      ) : (
        <span className="storefront-campaign__icon">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
      )}
      <strong>{campaign.name}</strong>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

export default function CatalogHome({
  catalogs,
  month,
}: {
  catalogs: CatalogSummary[];
  month: number;
}) {
  const bySlug = new Map(catalogs.map((catalog) => [catalog.slug, catalog]));
  const availableDepartments = shoppingDepartments.flatMap(({ slug }) => {
    const catalog = bySlug.get(slug);
    return catalog ? [catalog] : [];
  });
  const campaigns = catalogCampaigns(catalogs)
    .filter(({ slug }) => slug !== "datas-especiais")
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const seasonal = campaigns.filter(({ slug }) =>
    campaignMonths[slug]?.includes(month),
  );
  const featured =
    seasonal.find(({ slug }) => campaignPhotos[slug]) ??
    seasonal[0] ??
    campaigns.find(({ slug }) => campaignPhotos[slug]);
  const featuredPhoto = featured && campaignPhotos[featured.slug];
  const otherCampaigns = campaigns.filter(
    ({ slug }) => slug !== featured?.slug,
  );
  const visibleCampaigns = [
    ...otherCampaigns.filter(({ slug }) =>
      campaignMonths[slug]?.includes(month),
    ),
    ...otherCampaigns.filter(
      ({ slug }) => !campaignMonths[slug]?.includes(month),
    ),
  ];
  const offers = bySlug.has("ofertas");

  return (
    <div className="storefront-home">
      <header className="storefront-header">
        <div className="storefront-header__inner">
          <Link href="/" className="storefront-brand">
            <img
              src="/assets/images/brand/pitter-pan-logo.svg"
              alt=""
              width={44}
              height={44}
            />
            <span>
              <strong>Pitter Pan Festas</strong>
              <small>Catálogo digital</small>
            </span>
          </Link>
          <nav
            className="storefront-header__nav"
            aria-label="Navegação principal"
          >
            {availableDepartments.length > 0 && (
              <a href="#departamentos">Departamentos</a>
            )}
            {otherCampaigns.length > 0 && (
              <a href="#datas-especiais">Datas especiais</a>
            )}
            {offers && (
              <Link href="/ofertas/" prefetch={false}>
                <BadgePercent size={16} aria-hidden="true" />
                Ofertas
              </Link>
            )}
          </nav>
          <Link
            href="/todos/"
            className="storefront-button storefront-button--quiet"
            prefetch={false}
          >
            <Layers3 size={16} aria-hidden="true" />
            <span>Todos os produtos</span>
          </Link>
        </div>
      </header>

      <main className="storefront-content">
        <section className="storefront-hero" aria-labelledby="catalog-title">
          <div className="storefront-hero__content">
            <h1 id="catalog-title">
              Encontre tudo para
              <br className="storefront-hero__break" /> a sua festa
            </h1>
            <p>Busque por nome ou SKU e descubra as coleções da temporada.</p>
            <Form
              className="storefront-search"
              action="/todos/"
              prefetch={false}
              role="search"
            >
              <Search size={21} aria-hidden="true" />
              <input
                name="q"
                type="search"
                maxLength={120}
                autoComplete="off"
                aria-label="Buscar produtos por nome ou SKU"
                placeholder="Nome do produto ou SKU"
              />
              <button
                type="submit"
                className="storefront-button storefront-button--primary"
              >
                Buscar
              </button>
            </Form>
          </div>
          {featured && (
            <Link
              href={`/${featured.slug}/`}
              className="storefront-featured"
              prefetch={false}
            >
              {featuredPhoto && (
                <img src={featuredPhoto} alt="" fetchPriority="high" />
              )}
              <span className="storefront-featured__copy">
                <small>
                  {seasonal.includes(featured)
                    ? "Coleção da temporada"
                    : "Coleção em destaque"}
                </small>
                <strong>{featured.name}</strong>
                <span>
                  Explorar coleção <ArrowRight size={16} aria-hidden="true" />
                </span>
              </span>
            </Link>
          )}
        </section>

        {availableDepartments.length > 0 && (
          <section
            className="storefront-section"
            id="departamentos"
            aria-labelledby="departamentos-title"
          >
            <h2 id="departamentos-title">Departamentos</h2>
            <div className="storefront-departments">
              {availableDepartments.map(({ slug, name }) => {
                const { icon: Icon, description } = departments[slug];
                return (
                  <Link
                    className="storefront-department"
                    href={`/${slug}/`}
                    key={slug}
                    prefetch={false}
                  >
                    <span className="storefront-department__icon">
                      <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{name}</strong>
                      <small>{description}</small>
                    </span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {otherCampaigns.length > 0 && (
          <section
            className="storefront-section"
            id="datas-especiais"
            aria-labelledby="datas-title"
          >
            <div className="storefront-section__heading">
              <h2 id="datas-title">Datas especiais</h2>
              {bySlug.has("datas-especiais") && (
                <Link href="/datas-especiais/" prefetch={false}>
                  Ver produtos das campanhas{" "}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </div>
            <div className="storefront-campaigns">
              {visibleCampaigns.slice(0, 6).map((campaign) => (
                <CampaignCard key={campaign.slug} campaign={campaign} />
              ))}
            </div>
            {visibleCampaigns.length > 6 && (
              <details className="storefront-more">
                <summary>
                  Mais datas especiais{" "}
                  <ChevronDown size={16} aria-hidden="true" />
                </summary>
                <div className="storefront-campaigns">
                  {visibleCampaigns.slice(6).map((campaign) => (
                    <CampaignCard key={campaign.slug} campaign={campaign} />
                  ))}
                </div>
              </details>
            )}
          </section>
        )}

        <footer className="storefront-footer">
          <span>Pitter Pan Festas</span>
          <a href="https://www.pitterpan.com.br/">
            Loja online <ExternalLink size={14} aria-hidden="true" />
          </a>
        </footer>
      </main>
    </div>
  );
}
