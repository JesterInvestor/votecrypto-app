'use client';

import Link from 'next/link';

export default function LearnMorePage() {
  return (
  <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">About VoteCrypto</h1>
          <p className="text-gray-800 text-base sm:text-lg">Why this app matters and how to get involved</p>
        </header>

  <section className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            VoteCrypto helps people engage in democracy using Web3 tools. Connect your wallet, access trusted voter tools, and earn crypto rewards for civic actions. Our goal is to make participation easier, more transparent, and more rewarding.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Why it matters</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold">Access:</span> Provide simple, mobile-first voter resources.</li>
              <li><span className="font-semibold">Incentives:</span> Reward civic engagement with NFTs and tokens.</li>
              <li><span className="font-semibold">Transparency:</span> Use public, verifiable systems to build trust.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">How it works</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Connect your wallet.</li>
              <li>Use voter tools like registration and absentee ballots.</li>
              <li>Complete actions and earn on-chain rewards.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trusted resources</h2>
            <p className="mb-2">We link to reputable organizations for election and policy information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a href="https://www.vote.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Vote.org
                </a>
                : Registration, absentee ballots, and election info.
              </li>
              <li>
                <a href="https://www.standwithcrypto.org/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--brand-blue)' }}>
                  Stand With Crypto
                </a>
                : Learn where policymakers stand on crypto.
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/get-started" className="inline-flex items-center justify-center link-white px-5 py-3 rounded-lg font-semibold transition-colors" style={{ backgroundColor: 'var(--brand-blue)' }}>
              Get Started
            </Link>
            <Link href="/crypto-politicians" className="inline-flex items-center justify-center border px-5 py-3 rounded-lg font-semibold transition-colors" style={{ borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
              Explore Crypto Politicians
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
