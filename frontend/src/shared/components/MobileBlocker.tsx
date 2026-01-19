


import React from 'react';

const MobileBlocker: React.FC = () => (
	<div
		style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			background: 'var(--background)',
			color: 'var(--text)',
			zIndex: 99999,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '2rem',
			fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
			transition: 'background 0.4s',
		}}
	>
		<div
			style={{
				background: 'var(--surface)',
				borderRadius: '1.25rem',
				boxShadow: '0 8px 40px 0 rgba(30,41,59,0.13)',
				padding: '2.5rem 2rem',
				maxWidth: 420,
				width: '100%',
				textAlign: 'center',
				border: '1.5px solid var(--border)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				animation: 'fadeIn 0.7s cubic-bezier(.4,0,.2,1)',
			}}
		>
			<img
				src="/images/logo.png"
				alt="StudyIO Logo"
				style={{ width: 56, height: 56, marginBottom: 20, borderRadius: 14, boxShadow: '0 2px 12px 0 #ff700033', background: 'var(--background)' }}
			/>
			<h1
				style={{
					fontSize: '2rem',
					fontWeight: 800,
					marginBottom: 14,
					letterSpacing: '-0.01em',
					color: 'var(--brand, #FF6D00)',
					textShadow: '0 2px 8px #ff700022',
				}}
			>
				Desktop Only
			</h1>
			<p
				style={{
					fontSize: '1.08rem',
					lineHeight: 1.7,
					color: 'var(--text-muted)',
					marginBottom: 0,
					fontWeight: 500,
				}}
			>
				Our website is currently available on <span style={{ color: 'var(--brand, #FF6D00)', fontWeight: 600 }}>desktop only</span>.<br />
				Please access this site using a <span style={{ color: 'var(--brand, #FF6D00)', fontWeight: 600 }}>laptop or desktop computer</span>.<br />
				<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>We are working on mobile support and will launch it soon.</span>
			</p>
		</div>
		<style>{`
			@keyframes fadeIn {
				from { opacity: 0; transform: translateY(32px); }
				to { opacity: 1; transform: translateY(0); }
			}
			html.dark & {
				background: var(--background);
			}
		`}</style>
	</div>
);

export default MobileBlocker;
