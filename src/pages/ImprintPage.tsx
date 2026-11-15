import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/site/shared";

function S({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h2 className="font-display text-lg font-light uppercase tracking-[.06em] text-foreground">{title}</h2><div className="space-y-3 leading-7 text-muted-foreground">{children}</div></section>;
}

export default function ImprintPage() {
  const l = siteConfig.legal;
  return (
    <><PageHero eyebrow="Rechtliches" title="Impressum" />
    <div className="page-container max-w-3xl space-y-10 py-14">
      <S title="Angaben gemäß § 5 DDG"><p>{siteConfig.name}<br />{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}</p><p>Vertreten durch die Geschäftsführer: {l.managingDirectors.join(", ")}</p></S>
      <S title="Kontakt"><p>Telefon: <a href={siteConfig.phoneHref} className="text-primary hover:underline">{siteConfig.phone}</a><br />Mobil: <a href={siteConfig.mobileHref} className="text-primary hover:underline">{siteConfig.mobile}</a><br />Kontakt: Telefon / <a href="/kontakt" className="text-primary hover:underline">Kontaktformular</a></p></S>
      <S title="Registereintrag"><p>Registergericht: {l.registerCourt}<br />Registernummer: {l.registerNumber}</p></S>
      {import.meta.env.DEV && <S title="Umsatzsteuer-ID"><p>{l.vatId ?? l.vatIdPreviewText}</p></S>}
      <S title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"><p>{l.responsibleMStV}</p></S>
      <S title="EU-Streitschlichtung"><p>Die Europäische Kommission stellt Informationen zur außergerichtlichen Streitbeilegung für Verbraucher bereit. Wir sind nicht verpflichtet, eine Online-Streitbeilegungsplattform zu verlinken.</p></S>
      <S title="Verbraucherstreitbeilegung"><p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).</p></S>
      <S title="Haftung für Inhalte"><p>Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir diese Inhalte umgehend.</p></S>
      <S title="Haftung für Links"><p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr; verantwortlich ist stets der jeweilige Anbieter oder Betreiber der Seiten. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.</p></S>
      <S title="Urheberrecht"><p>Die durch uns erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der {siteConfig.name}.</p><p>Bildnachweis: Titelbild: Autohausfoto © Bavaria Autoarena GmbH; Fahrzeugfoto Dekler Ph / Unsplash, Bildmontage bearbeitet. Service-Foto: Renaldo Matamoro / Unsplash (Unsplash License). Fahrzeugfotos © Bavaria Autoarena GmbH.</p></S>
    </div></>
  );
}
