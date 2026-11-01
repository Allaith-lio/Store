import ProfileMenu from '../components/profile/ProfileMenu';

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const UserProfile = ({
	name = 'John Doe',
	email = 'john.doe@example.com',
	avatar = defaultAvatar,
}) => {
	return (
		<div className="p-4">
			<div className="relative overflow-hidden rounded-card border border-line bg-surface p-6 text-center shadow-card">
				<span className="absolute -right-8 -top-8 size-28 rounded-full bg-accent/30" />
				<span className="absolute -bottom-10 -left-10 size-32 rounded-full bg-primary/20" />

				<div className="relative">
					<img
						src={avatar}
						alt={`${name} profile`}
						className="mx-auto size-24 rounded-full border-4 border-surface object-cover shadow-raised ring-2 ring-primary"
					/>
					<h2 className="mt-4 text-xl">{name}</h2>
					<p className="mt-1 text-sm text-muted">{email}</p>
				</div>
			</div>

			<ProfileMenu />
		</div>
	);
};

export default UserProfile;
