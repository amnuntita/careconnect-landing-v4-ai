import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

// Shared shell for /privacy and /terms. Reuses the article layout classes so
// no new CSS is needed.
export function LegalPage({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <article className="post">
          <div className="wrap post-wrap">
            <Breadcrumb
              items={[{ label: "กลับหน้าแรก", href: "/" }, { label: title }]}
            />
            <header className="post-header">
              <h1 className="h1">{title}</h1>
              {lede ? (
                <p className="lede" style={{ marginTop: 16 }}>
                  {lede}
                </p>
              ) : null}
            </header>
            <div className="post-body">{children}</div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

// Rendered in sections whose content is not written yet. Keep the TODO marker
// in code next to each use, not on the page.
export function PendingSection() {
  return <p>รายละเอียดส่วนนี้อยู่ระหว่างจัดทำ</p>;
}
