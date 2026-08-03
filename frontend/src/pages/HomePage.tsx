import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { SectionTitle } from '../components/SectionTitle';
import { ArtworkCard } from '../components/ArtworkCard';
import { ArtistCard } from '../components/ArtistCard';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { GalleryCard } from '../components/GalleryCard';
import { useFeaturedArtworks, useTrendingArtworks } from '../hooks/useArtworks';
import { useCurrentExhibitions } from '../hooks/useExhibitions';
import { usePartnerGalleries } from '../hooks/useGalleries';
import { useArtists } from '../hooks/useArtists';
import { seedArtists, seedArtworks, seedExhibitions, seedGalleries } from '../data/seed';

export function HomePage() {
  const { data: featuredArtworks = [] } = useFeaturedArtworks();
  const { data: trendingArtworks = [] } = useTrendingArtworks();
  const { data: currentExhibitions = [] } = useCurrentExhibitions();
  const { data: partnerGalleries = [] } = usePartnerGalleries();
  const { data: artists = [] } = useArtists();

  const displayedArtworks = featuredArtworks.length > 0 ? featuredArtworks : seedArtworks.filter((w) => w.isFeatured);
  const displayedTrending = trendingArtworks.length > 0 ? trendingArtworks : seedArtworks.sort((a, b) => b.views - a.views).slice(0, 3);
  const displayedExhibitions = currentExhibitions.length > 0 ? currentExhibitions : seedExhibitions.slice(0, 2);
  const displayedGalleries = partnerGalleries.length > 0 ? partnerGalleries : seedGalleries.filter((g) => g.isPartner);
  const displayedArtists = artists.length > 0 ? artists.slice(0, 4) : seedArtists.slice(0, 4);

  return (
    <div>
      <HeroSection />

      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <SectionTitle
              title="Expositions actuelles"
              subtitle="Plongez au cœur des événements culturels qui façonnent la scène artistique contemporaine."
              align="left"
              className="mb-0"
            />
            <Link to="/exhibitions" className="hidden md:flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedExhibitions.map((exhibition, i) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Œuvres tendances"
            subtitle="Les créations les plus consultées et appréciées par notre communauté."
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTrending.slice(0, 3).map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/artworks"
              className="inline-flex items-center gap-2 px-8 py-4 border border-ivory/30 text-ivory rounded-full hover:bg-ivory/10 transition-colors"
            >
              Explorer le catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Artistes populaires"
            subtitle="Rencontrez les talents qui redéfinissent l'art contemporain africain et international."
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedArtists.map((artist, i) => (
              <ArtistCard key={artist.id} artist={artist} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-ivory">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Sélection premium"
            subtitle="Découvrez nos œuvres phares, choisies pour leur force expressive et leur qualité artistique."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArtworks.slice(0, 3).map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Galeries partenaires"
            subtitle="Des institutions culturelles de référence qui font rayonner l'art contemporain."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedGalleries.map((gallery, i) => (
              <GalleryCard key={gallery.id} gallery={gallery} index={i} />
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 lg:py-32 px-6 lg:px-8 bg-gold/5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-obsidian mb-6">
            Rejoignez l'univers Zoro-Zipa
          </h2>
          <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
            Que vous soyez artiste, galerie ou amateur d art, notre plateforme vous offre les outils pour découvrir, partager et vivre l'art autrement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/exhibitions"
              className="px-8 py-4 bg-obsidian text-ivory rounded-full font-medium hover:bg-stone transition-colors"
            >
              Réserver une exposition
            </Link>
            <Link
              to="/artworks"
              className="px-8 py-4 border border-obsidian/20 text-obsidian rounded-full font-medium hover:border-gold transition-colors"
            >
              Explorer les œuvres
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
