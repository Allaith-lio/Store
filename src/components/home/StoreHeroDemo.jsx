import {
	ShoppingBag,
	Plus,
	Quote,
	ArrowRight,
	ArrowUpRight,
} from 'lucide-react';
import Button from '../common/Button';
import { profile1, profile2, profile3, profile4, profile5 } from '../../utility/ImagesPlace';
import { useState } from 'react';
const columns = [
  [
    { 
      color: 'bg-orange-500 dark:bg-orange-600', 
      h: 'h-72', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 
      notch: 'right',
      title: 'Omni Pro Headset'
    },
    { 
      color: 'bg-amber-400 dark:bg-amber-600', 
      h: 'h-32', 
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80', 
    },
  ],
  [
    { 
      color: 'bg-emerald-400 dark:bg-emerald-600', 
      h: 'h-96', 
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80', 
      notch: 'right' 
    }
  ],
  [
    { 
      color: 'bg-yellow-400 dark:bg-yellow-600', 
      h: 'h-64', 
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', 
    }
  ],
  [
    { 
      color: 'bg-sky-400 dark:bg-sky-600', 
      h: 'h-96', 
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80', 
      notch: 'left' 
    }
  ],
  [
    { 
      color: 'bg-lime-400 dark:bg-lime-600', 
      h: 'h-72', 
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', 
      notch: 'left' 
    },
    { 
      color: 'bg-teal-700 dark:bg-teal-900', 
      h: 'h-32', 
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80',
    },
  ],
];
const allProfiles = [
  { id: 1, src: profile1, alt: "User 1" },
  { id: 2, src: profile2, alt: "User 2" },
  { id: 3, src: profile3, alt: "User 3" },
  { id: 4, src: profile4, alt: "User 4" },
  { id: 5, src: profile5, alt: "User 5" },
];

function Notch({ side }) {
  return (
    <svg
      width="108"
      height="36"
      viewBox="0 0 108 36"
      className={`absolute top-0 fill-page overflow-visible ${
        side === 'right' ? 'right-0' : 'left-0 -scale-x-100'
      }`}
    >
      <path d="M0 -1H109V24H108V36A12 12 0 0 0 96 24H24A12 12 0 0 1 12 12A12 12 0 0 0 0 0Z" />
    </svg>
  )
}
export default function StoreHeroDemo() {
  const [profiles, setProfiles] = useState(allProfiles);

  const handleRotateProfiles = () => {
    setProfiles((prev) => {
      const updated = [...prev];
      const firstItem = updated.shift(); 
      if (firstItem) updated.push(firstItem);
      return updated;
    });
  };

  const visibleProfiles = profiles.slice(0, 3);
	return (
		<section className="section max-w-7xl mx-auto px-6">
			<div className="relative text-center mb-10">
				<div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 size-16 items-center justify-center">
					<span className="absolute inset-0 rounded-full border-2 border-dashed border-ink/40 animate-[spin_12s_linear_infinite]" />
					<ShoppingBag className="size-5 text-ink" />
				</div>

        <h1 className=" text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
            Everything You{' '} 
            <span className="font-logo logo-gradient text-[1.3em]">Love,</span><br/>
            All in One Store
          </h1>
				<div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center">
          <div className="flex items-center -space-x-3">
      {visibleProfiles.map((profile) => (
        <img
          key={profile.id}
          src={profile.src}
          alt={profile.alt}
          className="h-9 w-9 rounded-full object-cover border-2 border-ink shadow-xs transition-all duration-300 hover:scale-105 hover:z-10"
        />
      ))}

      <button
        type="button"
        onClick={handleRotateProfiles}
        aria-label="Show next profiles"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-surface border-2 border-ink shadow-xs text-xs font-bold transition-transform hover:scale-105 hover:z-10 active:scale-95 cursor-pointer"
      >
        <Plus className="size-4 transition-transform active:rotate-90 duration-200" />
      </button>
    </div>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 120}ms` }}>
            {column.map((item, i) => (
              <div
                key={i}
                className={`${item.color} ${item.h} rounded-card relative overflow-hidden group transition-all duration-500 hover:shadow-2xl ${
                  item.notch === 'right' ? 'rounded-tr-none' : ''
                } ${item.notch === 'left' ? 'rounded-tl-none' : ''}`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="Gaming Gear"
                    className="size-full object-cover rounded-[inherit] transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {item.notch && <Notch side={item.notch} />}
              </div>
      ))}

            {index === 2 && (
              <Button
                type="button"
                className="btn btn-primary rounded-full py-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
              >
                Shop Now
                <ArrowUpRight className="size-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
			<div className="mt-16 flex flex-col md:flex-row justify-between gap-10">
				<div className="max-w-sm">
					<Quote className="size-6 text-muted fill-current mb-3" />
					<p className="text-sm text-ink">
						OmniStore has everything I need in one place. Great prices, fast
						delivery, and products I actually love!
					</p>
					<span className="inline-block mt-4 ml-24 px-1 bg-accent/40 font-logo text-2xl">
						Sara M.
					</span>
				</div>

				<div className="max-w-xs">
					<div className="flex items-center justify-between">
						<div className="flex items-baseline gap-3">
							<span className="text-5xl font-heading">01</span>
							<span className="text-xs">Featured</span>
						</div>
						<ArrowRight className="size-5" />
					</div>
					<h3 className="mt-3">
						Discover Top Picks Across Every Category
					</h3>
				</div>
			</div>
		</section>
	);
}
