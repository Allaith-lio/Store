import { useState, useEffect } from 'react';
import { Heart, HeartIcon, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/Product/ProductCard';
import { products } from './ShopProducts';

const Wishlist = () => {
	const [wishlistIds, setWishlistIds] = useState(() => {
		const saved = localStorage.getItem('wishlist');
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		const handleStorageChange = () => {
			const saved = localStorage.getItem('wishlist');
			setWishlistIds(saved ? JSON.parse(saved) : []);
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('wishlistChanged', handleStorageChange);
	}, []);

	const wishlistProducts = products.filter(product =>
		wishlistIds.includes(product.id),
	);

	const clearWishlist = () => {
		localStorage.removeItem('wishlist');
		setWishlistIds([]);
	};
	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-2xl py-8 text-center md:py-20">
				<span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
					<HeartIcon className="size-4 text-accent" />
					Saved for later
				</span>

				<h1 className="mt-6">
					My{' '}
					<span className="font-logo logo-gradient text-[1.3em]">
						Wishlist...
					</span>
				</h1>

				<p className="mt-5 leading-8 text-muted">
					All your favorite products, gathered in one place.
				</p>
			</section>

			<div className=" flex items-center justify-between gap-4">
				<p className="text-sm text-[grey]">
					Showing{' '}
					<span className="font-bold text-ink">{wishlistProducts.length}</span>{' '}
					{wishlistProducts.length === 1 ? 'product' : 'products'}
				</p>

				{wishlistProducts.length > 0 && (
					<button
						type="button"
						onClick={clearWishlist}
						className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-hover"
					>
						Clear wishlist
					</button>
				)}
			</div>

			{wishlistProducts.length > 0 ? (
				<div className="mt-5 grid grid-cols-1 gap-5 min-[451px]:grid-cols-2 min-[791px]:grid-cols-3 min-[1024px]:grid-cols-4">
					{wishlistProducts.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<div className="mt-5 rounded-card border border-line bg-surface px-4 py-16 text-center shadow-card">
					<span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Heart size={30} />
					</span>
					<h2 className="mt-5 text-xl text-ink">Your wishlist is empty</h2>
					<p className="mt-2 text-sm text-[grey]">
						Explore our products and save the items you love.
					</p>
					<Link to="/products" className="btn btn-primary mt-5 no-underline">
						<ShoppingBag size={20} />
						Browse products
					</Link>
				</div>
			)}
		</div>
	);
};

export default Wishlist;
