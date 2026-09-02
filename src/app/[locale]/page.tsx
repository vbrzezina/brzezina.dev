import { SiteNav } from '@/components/nav/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Services />
        <Work />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
