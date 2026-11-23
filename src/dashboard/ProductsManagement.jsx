import { useEffect, useRef, useState } from 'react';
import {
	Edit2,
	Trash2,
	ShoppingBag,
	Package,
	AlertTriangle,
} from 'lucide-react';
import { branches } from '../data/branches';
import {
	createCatalogProduct,
	deleteCatalogProduct,
	getProductStock,
	uploadCatalogImage,
	updateCatalogProduct,
} from '../services/branchService';
import { useShoppingCart } from '../context/useShoppingCart';

const emptyForm = {
	name: '',
	description: '',
	price: '',
	stockByBranch: Object.fromEntries(branches.map(branch => [branch.id, 0])),
	image: '',
	category: '',
	rating: '',
	highlight1: '',
	highlight2: '',
	highlight3: '',
};

export default function ProductsManagement() {
	const { products, refreshProducts } = useShoppingCart();

	const [form, setForm] = useState(emptyForm);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const imageInputRef = useRef(null);
	const imagePreviewUrl = useRef('');

	useEffect(() => () => {
		if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
	}, []);

	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		id: null,
		name: '',
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const clearSelectedImage = () => {
		if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
		imagePreviewUrl.current = '';
		setImageFile(null);
		setImagePreview('');
		if (imageInputRef.current) imageInputRef.current.value = '';
	};

	const handleImageChange = event => {
		const file = event.target.files?.[0];
		if (!file) return;
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
			event.target.value = '';
			setError('Choose a JPEG, PNG, or WebP image smaller than 5 MB.');
			return;
		}

		if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
		imagePreviewUrl.current = URL.createObjectURL(file);
		setImageFile(file);
		setImagePreview(imagePreviewUrl.current);
		setError('');
	};

	const resetForm = () => {
		clearSelectedImage();
		setForm(emptyForm);
		setEditingId(null);
		setError('');
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const hasInvalidStock = branches.some(branch => {
			const stock = Number(form.stockByBranch[branch.id]);
			return !Number.isInteger(stock) || stock < 0;
		});

		if (hasInvalidStock) {
			setError('Enter a non-negative whole-number stock quantity for every branch.');
			return;
		}

		if (
			!form.name ||
			!form.price ||
			!form.category ||
			!form.rating ||
			(!form.image && !imageFile) ||
			!form.description
		) {
			setError('Please fill in all required fields to proceed.');
			return;
		}

		setLoading(true);
		setError('');
		try {
			let image = form.image.trim();
			if (imageFile) {
				image = await uploadCatalogImage(imageFile);
				if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
				imagePreviewUrl.current = '';
				setImageFile(null);
				setImagePreview(image);
				setForm(previous => ({ ...previous, image }));
			}

			const productData = {
				name: form.name.trim(),
				description: form.description.trim(),
				category: form.category.trim(),
				image,
				price: Number(form.price),
				stockByBranch: Object.fromEntries(
					branches.map(branch => [
						branch.id,
						Number(form.stockByBranch[branch.id]),
					]),
				),
				stock: Object.values(form.stockByBranch).reduce(
					(total, stock) => total + Number(stock || 0),
					0,
				),
				rating: Number(form.rating),
				highlights: [form.highlight1, form.highlight2, form.highlight3]
					.map(h => h.trim())
					.filter(Boolean),
			};

			if (editingId !== null) {
				await updateCatalogProduct(editingId, productData);
			} else {
				await createCatalogProduct(productData);
			}
			await refreshProducts();
			resetForm();
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : 'Unable to save product.');
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = product => {
		clearSelectedImage();
		setEditingId(product.id);
		const highlightsList = Array.isArray(product.highlights)
			? product.highlights
			: [];

		setForm({
			name: product.name || '',
			description: product.description || '',
			price: String(product.price || ''),
			stockByBranch: Object.fromEntries(
				branches.map(branch => [
					branch.id,
					String(getProductStock(product, branch.id)),
				]),
			),
			image: product.image || '',
			category: product.category || '',
			rating: String(product.rating || ''),
			highlight1: highlightsList[0] || '',
			highlight2: highlightsList[1] || '',
			highlight3: highlightsList[2] || '',
		});
		setImagePreview(product.image || '');
		setError('');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const confirmDelete = (id, name) => {
		setDeleteModal({ isOpen: true, id, name });
	};

	const executeDelete = async () => {
		if (deleteModal.id !== null) {
			setLoading(true);
			setError('');
			try {
				await deleteCatalogProduct(deleteModal.id);
				await refreshProducts();
				if (editingId === deleteModal.id) resetForm();
				setDeleteModal({ isOpen: false, id: null, name: '' });
			} catch (requestError) {
				setError(requestError instanceof Error ? requestError.message : 'Unable to delete product.');
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="mx-auto max-w-6xl space-y-8 relative">
			{deleteModal.isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4">
					<div className="bg-surface border border-line rounded-2xl p-6 max-w-sm w-full shadow-lg space-y-4">
						<div className="flex items-center gap-3 text-red-500">
							<div className="p-2.5 bg-page rounded-xl border border-line">
								<AlertTriangle size={20} />
							</div>
							<h3 className="font-heading font-bold text-ink text-base">
								Delete Product
							</h3>
						</div>

						<p className="text-xs text-muted leading-relaxed">
							Are you sure you want to delete{' '}
							<span className="font-semibold text-ink">
								"{deleteModal.name}"
							</span>
							? This action cannot be undone.
						</p>

						<div className="flex items-center gap-3 pt-2">
							<button
								type="button"
								onClick={() =>
									setDeleteModal({ isOpen: false, id: null, name: '' })
								}
								className="flex-1 rounded-xl border border-line py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-page"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={executeDelete}
								disabled={loading}
								className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 shadow-sm"
							>
								{loading ? 'Deleting...' : 'Yes, Delete'}
							</button>
						</div>
					</div>
				</div>
			)}
      <div className="mx-auto max-w-6xl mb-8">
        <p className="text-xs font-bold text-primary-text tracking-wider mb-1">STORE OPERATIONS</p>
        <h1 className="text-3xl">Products Management</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your products, update details, and track your store inventory.
        </p>
      </div>
			<div className="flex flex-col gap-8">
				<form
					onSubmit={handleSubmit}
					className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all"
				>
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-heading text-xl text-ink font-bold">
							{editingId !== null ? 'Edit Product Details' : 'Add New Product'}
						</h2>
					</div>

					<div className="mb-6 h-px bg-line/60" />

					<div className="space-y-5 text-sm font-medium text-ink">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<label className="block space-y-1.5">
								<span className="text-xs font-semibold text-muted uppercase tracking-wider">
									Product Name
								</span>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all mt-1"
									placeholder="Enter the product name .."
								/>
							</label>

							<label className="block space-y-1.5">
								<span className="text-xs font-semibold text-muted uppercase tracking-wider">
									Category
								</span>
								<input
									name="category"
									value={form.category}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all mt-1"
									placeholder="Enter the category .."
								/>
							</label>
						</div>

						<label className="block space-y-1.5">
							<span className="text-xs font-semibold text-muted uppercase tracking-wider">
								Description
							</span>
							<textarea
								name="description"
								value={form.description}
								onChange={handleChange}
								rows="3"
								className="w-full resize-none rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all mt-1"
								placeholder="Write a short description about the item features..."
							/>
						</label>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<label className="block space-y-1.5">
								<span className="text-xs font-semibold text-muted uppercase tracking-wider">
									Price ($)
								</span>
								<input
									name="price"
									type="number"
									step="0.01"
									min="0"
									value={form.price}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all mt-1"
									placeholder="0.00"
								/>
							</label>

							<label className="block space-y-1.5">
								<span className="text-xs font-semibold text-muted uppercase tracking-wider">
									Rating (0 - 5)
								</span>
								<input
									name="rating"
									type="number"
									min="0"
									max="5"
									step="0.1"
									value={form.rating}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all mt-1"
									placeholder="4.5"
								/>
							</label>
						</div>

						<fieldset>
							<legend className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
								Stock by branch
							</legend>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								{branches.map(branch => (
									<label key={branch.id} className="block space-y-1.5">
										<span className="text-xs font-semibold text-muted">
											{branch.name}
										</span>
										<input
											type="number"
											min="0"
											step="1"
											value={form.stockByBranch[branch.id] ?? 0}
											onChange={event =>
												setForm(previous => ({
													...previous,
													stockByBranch: {
														...previous.stockByBranch,
														[branch.id]: event.target.value,
													},
												}))
											}
											className="mt-1 w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all"
											aria-label={`${branch.name} stock quantity`}
										/>
									</label>
								))}
							</div>
						</fieldset>

						<div className="space-y-3">
							<label className="block space-y-1.5">
								<span className="text-xs font-semibold text-muted uppercase tracking-wider">
									Product image
								</span>
								<input
									ref={imageInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp"
									onChange={handleImageChange}
									required={!form.image && !imageFile}
									disabled={loading}
									aria-label="Upload product image"
									className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
								/>
								<span className="block text-xs text-muted">
									JPEG, PNG, or WebP. File size up to 5 MB.
								</span>
							</label>
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Product image preview"
									className="h-36 w-36 rounded-xl border border-line object-cover"
								/>
							)}
						</div>

						<fieldset className="pt-2">
							<legend className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
								Why you'll love it (Highlights)
							</legend>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
								<input
									name="highlight1"
									value={form.highlight1}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-3.5 py-2.5 text-ink outline-none transition-all text-xs"
									placeholder="Highlight 1"
								/>
								<input
									name="highlight2"
									value={form.highlight2}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-3.5 py-2.5 text-ink outline-none transition-all text-xs"
									placeholder="Highlight 2"
								/>
								<input
									name="highlight3"
									value={form.highlight3}
									onChange={handleChange}
									className="w-full rounded-xl border border-line bg-page px-3.5 py-2.5 text-ink outline-none transition-all text-xs"
									placeholder="Highlight 3"
								/>
							</div>
						</fieldset>
					</div>

					{error && (
						<div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 flex items-center gap-2">
							<span>⚠️</span> {error}
						</div>
					)}

					<div className="mt-6 flex items-center gap-3">
						<button
							type="submit"
							disabled={loading}
							className="btn btn-primary flex-1 rounded-xl py-3 text-sm font-bold shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99]"
						>
							{loading ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Add Product to Catalog'}
						</button>
						{editingId !== null && (
							<button
								type="button"
								onClick={resetForm}
								className="rounded-xl border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-page"
							>
								Cancel
							</button>
						)}
					</div>
				</form>

				<div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
					<div className="flex items-center justify-between border-b border-line px-6 py-4 bg-page/40">
						<div className="flex items-center gap-2.5">
							<Package className="size-5 text-primary" />
							<h2 className="font-heading text-base text-ink font-bold">
								Inventory Catalog
							</h2>
						</div>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
							{products.length} {products.length === 1 ? 'Item' : 'Items'}{' '}
							Available
						</span>
					</div>

					{products.length === 0 ? (
						<div className="px-6 py-20 text-center text-muted flex flex-col items-center justify-center gap-3">
							<div className="size-16 rounded-full bg-page flex items-center justify-center border border-line">
								<ShoppingBag className="size-8 text-muted/40 stroke-[1.5]" />
							</div>
							<p className="text-sm font-medium">
								No products in your store yet.
							</p>
							<p className="text-xs text-muted/80 max-w-xs">
								Use the form above to add your first item and start tracking
								your store inventory!
							</p>
						</div>
					) : (
						<div className="divide-y divide-line/60">
							{products.map(product => (
								<article
									key={product.id}
									className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface border border-line transition-colors hover:bg-page/50"
								>
									<div className="flex items-center gap-4 min-w-0 flex-1">
										<div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-line bg-page">
											<img
												src={product.image}
												alt={product.name}
												className="size-full object-cover"
												onError={e => {
													e.currentTarget.src =
														'https://placehold.co/100x120?text=Product';
												}}
											/>
										</div>

										<div className="min-w-0 flex-1 space-y-1">
											<h3 className="font-heading font-semibold text-ink text-base truncate">
												{product.name}
											</h3>

											<p className="text-xs text-muted flex flex-wrap items-center gap-2">
												<span className="font-medium text-ink">
													{product.category || 'General'}
												</span>
												<span>•</span>
												<span>⭐ {Number(product.rating || 0).toFixed(1)}</span>
												<span>•</span>
												{branches.map(branch => {
													const stock = getProductStock(product, branch.id);
													return (
														<span
															key={branch.id}
															className={
																stock > 0
																	? 'text-ink font-medium'
																	: 'text-red-500 font-medium'
															}
														>
															{branch.name}: {stock}
														</span>
													);
												})}
											</p>
										</div>
									</div>

									<div className="flex sm:flex-row items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
										<span className="text-sm font-bold text-ink">
											${Number(product.price).toFixed(2)}
										</span>

										<div className="flex items-center gap-1">
											<button
												type="button"
												onClick={() => handleEdit(product)}
												aria-label={`Edit ${product.name}`}
												className="rounded-lg p-2 text-muted hover:bg-page hover:text-ink transition-colors"
												title="Edit"
											>
												<Edit2 size={16} />
											</button>
											<button
												type="button"
												onClick={() => confirmDelete(product.id, product.name)}
												aria-label={`Delete ${product.name}`}
												className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
												title="Delete"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
