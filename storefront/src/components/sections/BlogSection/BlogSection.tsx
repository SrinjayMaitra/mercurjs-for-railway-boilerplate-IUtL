"use client"
import { BlogPost } from '@/types/blog';
import { BlogCard } from '@/components/organisms';
import { RevealText } from "@/components/animations/RevealText"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Summer's Most Elegant Accessories",
    excerpt:
      "Discover this season's most sophisticated accessories that blend timeless elegance with modern design.",
    image: '/images/blog/post-1.jpg',
    category: 'ACCESSORIES',
    href: '#',
  },
  {
    id: 2,
    title: 'The Season’s Hottest Trends',
    excerpt:
      'From bold colors to nostalgic silhouettes, explore the must-have looks defining this season’s fashion narrative.',
    image: '/images/blog/post-2.jpg',
    category: 'STYLE GUIDE',
    href: '#',
  },
  {
    id: 3,
    title: 'Minimalist Outerwear Trends',
    excerpt:
      'Explore the latest minimalist outerwear pieces that combine functionality with clean aesthetics.',
    image: '/images/blog/post-3.jpg',
    category: 'TRENDS',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <section className='bg-tertiary container'>
      <div className='flex items-center justify-between mb-12'>
        <RevealText
          text="STAY UP TO DATE"
          el="h2"
          className="heading-lg text-tertiary"
        />
      </div>
      <StaggerContainer className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {blogPosts.map((post, index) => (
          <StaggerItem key={post.id} variant="fade-up">
            <BlogCard
              index={index}
              post={post}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
