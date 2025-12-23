"use client"

import { Brand } from '@/types/brands';
import { BrandCard } from '@/components/organisms';
import { Carousel } from '@/components/cells';
import { motion } from 'framer-motion';

const brands: Brand[] = [
  {
    id: 1,
    name: 'Balenciaga',
    logo: '/images/brands/Balenciaga.svg',
    href: '#',
  },
  {
    id: 2,
    name: 'Nike',
    logo: '/images/brands/Nike.svg',
    href: '#',
  },
  {
    id: 3,
    name: 'Prada',
    logo: '/images/brands/Prada.svg',
    href: '#',
  },
  {
    id: 4,
    name: 'Miu Miu',
    logo: '/images/brands/Miu-Miu.svg',
    href: '#',
  },
];

export function HomePopularBrandsSection() {
  return (
    <section className='bg-[#0a0a0a] py-12 lg:py-16 w-full'>
      <div className='max-w-[1400px] mx-auto px-4 lg:px-8'>
        <div className='mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4'>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 bg-[#35b9e9]/10 text-[#35b9e9] text-xs font-semibold rounded-full mb-3 border border-[#35b9e9]/30"
            >
              Trusted Partners
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-2xl md:text-3xl lg:text-4xl font-bold text-white'
            >
              POPULAR <span className="text-[#d2ff1f]">BRANDS</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/60 max-w-md"
          >
            Shop from world-renowned brands with guaranteed authenticity
          </motion.p>
        </div>
        <Carousel
          variant='dark'
          items={brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        />
      </div>
    </section>
  );
}
